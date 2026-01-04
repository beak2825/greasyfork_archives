// ==UserScript==
// @name         SORA Batch Image Generation Helper V2
// @namespace    http://tampermonkey.net/
// @version      2
// @description  Assists with batch image generation on SORA by automating image "pasting" and prompting, with UI logs. IMPORTANT NOTE: STILL HAS BUGS
// @license      MIT
// @author       ZandrieGbz
// @match        https://sora.chatgpt.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/541985/SORA%20Batch%20Image%20Generation%20Helper%20V2.user.js
// @updateURL https://update.greasyfork.org/scripts/541985/SORA%20Batch%20Image%20Generation%20Helper%20V2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CONFIGURATION ---
    // const DEFAULT_PROMPT = "Recreate the individual from the first image, maintaining their original pose and physique, while dressing them in the outfit from the second image. Focus on realistic integration, high-fidelity facial features from the first image, and accurate outfit placement. Ensure a clean background unless specified by product image context.";
    const DEFAULT_PROMPT = "Recreate the individual from the first image, dressed in the apparel presented in the second image. Ensure the original model's exact stance and personal identity are fully preserved. The primary focus must be on transferring the clothing accurately and nothing else from the second source image. Photorealistic, White background.";
    const PROMPT_STORAGE_KEY = 'sora_helper_prompt_v1';
    const PROMPT_VISIBILITY_STORAGE_KEY = 'sora_helper_prompt_hidden_v1';
    const PROMPT_SAVE_DEBOUNCE_MS = 400;
    const PASTE_WAIT_MS = 1500; // Milliseconds to wait after a paste command.
    const GENERATION_TIMEOUT_MS = 480000; // 8 minutes timeout for a single generation (was 5min).

    // --- GLOBAL STATE ---
    let activePrompt = DEFAULT_PROMPT;
    let promptDebounceTimer = null;
    let isPromptSectionCollapsed = false;
    let imagePairsData = []; // DEPRECATED: Will be replaced by ProductSet.pairs arrays
    let nextPairId = 0;
    let currentIndex = -1; // DEPRECATED: Will be replaced by currentSetIndex + currentPairInSetIndex
    let isPaused = false;
    let isStopped = true;
    let soraChatInput = null;
    let soraSendButton = null;
    let generatedMediaContainer = null;
    let generationCompletionObserver = null;

    // NEW: Global variables for bulk upload workflow
    let selectedModelFile = null;
    let selectedOutfitFiles = [];

    // NEW: Multiple Product Sets Data Structure
    let productSets = []; // Array of ProductSet objects
    let nextProductSetId = 0; // Counter for unique product set IDs
    let currentSetIndex = -1; // Index of currently processing set
    let currentPairInSetIndex = -1; // Index of currently processing pair within the current set

    // ProductSet data structure definition
    /**
     * ProductSet structure:
     * {
     *   id: number,              // Unique identifier for the set
     *   name: string,            // User-defined name for the set
     *   modelFile: File,         // The model image file for this set
     *   outfitFiles: File[],     // Array of outfit image files for this set
     *   status: string,          // 'pending', 'processing', 'completed', 'error', 'paused'
     *   pairs: Array,            // Generated pairs for this set (model + each outfit)
     *   progress: {
     *     total: number,         // Total number of pairs in this set
     *     completed: number,     // Number of completed pairs
     *     failed: number,        // Number of failed pairs
     *     pending: number        // Number of pending pairs
     *   },
     *   metadata: {
     *     createdAt: number,     // Timestamp when set was created
     *     lastModified: number,  // Timestamp when set was last modified
     *     totalSize: number,     // Total file size of all images in set
     *     processingStartTime: number, // When processing started for this set
     *     processingEndTime: number    // When processing completed for this set
     *   },
     *   errorInfo: {
     *     errorCount: number,    // Number of errors encountered in this set
     *     lastError: string,     // Last error message for this set
     *     retryCount: number     // Number of retry attempts for this set
     *   }
     * }
     */

    // Helper function to create a new ProductSet
    function createProductSet(name, modelFile, outfitFiles) {
        const now = Date.now();
        const totalSize = (modelFile ? modelFile.size : 0) + 
                         (outfitFiles ? outfitFiles.reduce((sum, file) => sum + file.size, 0) : 0);
        
        return {
            id: nextProductSetId++,
            name: name || `Product Set ${nextProductSetId}`,
            modelFile: modelFile || null,
            outfitFiles: outfitFiles || [],
            status: 'pending',
            pairs: [],
            progress: {
                total: 0,
                completed: 0,
                failed: 0,
                pending: 0
            },
            metadata: {
                createdAt: now,
                lastModified: now,
                totalSize: totalSize,
                processingStartTime: null,
                processingEndTime: null
            },
            errorInfo: {
                errorCount: 0,
                lastError: null,
                retryCount: 0
            }
        };
    }

    // Helper function to validate a ProductSet
    function validateProductSet(productSet) {
        if (!productSet) {
            return { isValid: false, error: 'ProductSet is null or undefined' };
        }

        if (typeof productSet.id !== 'number') {
            return { isValid: false, error: 'ProductSet ID must be a number' };
        }

        if (!productSet.name || typeof productSet.name !== 'string') {
            return { isValid: false, error: 'ProductSet name must be a non-empty string' };
        }

        if (!productSet.modelFile) {
            return { isValid: false, error: 'ProductSet must have a model file' };
        }

        if (!Array.isArray(productSet.outfitFiles)) {
            return { isValid: false, error: 'ProductSet outfitFiles must be an array' };
        }

        if (productSet.outfitFiles.length === 0) {
            return { isValid: false, error: 'ProductSet must have at least one outfit file' };
        }

        // Validate file objects
        if (productSet.modelFile && typeof productSet.modelFile.name !== 'string') {
            return { isValid: false, error: 'Model file must have a valid name' };
        }

        for (let i = 0; i < productSet.outfitFiles.length; i++) {
            const outfitFile = productSet.outfitFiles[i];
            if (!outfitFile || typeof outfitFile.name !== 'string') {
                return { isValid: false, error: `Outfit file at index ${i} is invalid` };
            }
        }

        return { isValid: true };
    }

    // Helper function to update ProductSet status
    function updateProductSetStatus(setId, newStatus, context = 'unknown') {
        const productSet = productSets.find(set => set.id === setId);
        if (!productSet) {
            log(`[ProductSet] Error: Set ${setId} not found for status update (context: ${context})`, 'error');
            return false;
        }

        const oldStatus = productSet.status;
        productSet.status = newStatus;
        productSet.metadata.lastModified = Date.now();

        log(`[ProductSet] Status changed for set ${setId} "${productSet.name}": ${oldStatus} → ${newStatus} (context: ${context})`, 'debug');
        
        // Update processing timestamps
        if (newStatus === 'processing' && !productSet.metadata.processingStartTime) {
            productSet.metadata.processingStartTime = Date.now();
        } else if ((newStatus === 'completed' || newStatus === 'error') && !productSet.metadata.processingEndTime) {
            productSet.metadata.processingEndTime = Date.now();
        }

        return true;
    }

    // Helper function to update ProductSet progress
    function updateProductSetProgress(setId, context = 'unknown') {
        const productSet = productSets.find(set => set.id === setId);
        if (!productSet) {
            log(`[ProductSet] Error: Set ${setId} not found for progress update (context: ${context})`, 'error');
            return false;
        }

        // Count pairs by status
        const completed = productSet.pairs.filter(pair => pair.status === 'done').length;
        const failed = productSet.pairs.filter(pair => pair.status === 'error').length;
        const pending = productSet.pairs.filter(pair => pair.status === 'pending').length;
        const processing = productSet.pairs.filter(pair => pair.status === 'processing').length;
        const total = productSet.pairs.length;

        // Update progress
        productSet.progress = {
            total: total,
            completed: completed,
            failed: failed,
            pending: pending,
            processing: processing
        };

        productSet.metadata.lastModified = Date.now();

        log(`[ProductSet] Progress updated for set ${setId} "${productSet.name}": ${completed}/${total} completed, ${failed} failed, ${pending + processing} pending (context: ${context})`, 'debug');

        return true;
    }

    // Helper function to find ProductSet by ID
    function findProductSetById(setId) {
        return productSets.find(set => set.id === setId);
    }

    // Helper function to remove ProductSet
    function removeProductSet(setId, context = 'unknown') {
        const setIndex = productSets.findIndex(set => set.id === setId);
        if (setIndex === -1) {
            log(`[ProductSet] Error: Set ${setId} not found for removal (context: ${context})`, 'error');
            return false;
        }

        const removedSet = productSets.splice(setIndex, 1)[0];
        log(`[ProductSet] Removed set ${setId} "${removedSet.name}" (context: ${context})`, 'info');

        // Update current indices if needed
        if (currentSetIndex >= setIndex) {
            currentSetIndex = Math.max(-1, currentSetIndex - 1);
        }

        return true;
    }

    // Helper function to get overall batch progress across all sets
    function getOverallBatchProgress() {
        const totalProgress = {
            sets: productSets.length,
            completedSets: 0,
            totalPairs: 0,
            completedPairs: 0,
            failedPairs: 0,
            pendingPairs: 0,
            processingPairs: 0
        };

        productSets.forEach(set => {
            if (set.status === 'completed') {
                totalProgress.completedSets++;
            }
            
            totalProgress.totalPairs += set.progress.total;
            totalProgress.completedPairs += set.progress.completed;
            totalProgress.failedPairs += set.progress.failed;
            totalProgress.pendingPairs += set.progress.pending;
            totalProgress.processingPairs += set.progress.processing || 0; // Handle case where processing doesn't exist
        });

        return totalProgress;
    }

    // Helper function to generate pairs for a specific ProductSet with enhanced ID system
    function generatePairsForProductSet(productSet) {
        if (!productSet || !validateProductSet(productSet).isValid) {
            log(`[ProductSet] Cannot generate pairs for invalid product set`, 'error');
            return false;
        }

        // Clear existing pairs
        productSet.pairs = [];

        // Generate pairs: one for each outfit with the model
        productSet.outfitFiles.forEach((outfitFile, index) => {
            // Enhanced pair ID: Format "S{setId}P{pairIndex}" (e.g., "S1P0", "S1P1", "S2P0")
            const setBasedPairId = `S${productSet.id}P${index}`;
            
            const pair = {
                id: nextPairId++, // Global sequential pair ID for backward compatibility
                setBasedId: setBasedPairId, // NEW: Set-aware pair ID
                setId: productSet.id, // Reference to parent ProductSet
                setName: productSet.name,
                pairIndex: index, // Index within the set (0-based)
                displayName: `${productSet.name}.${index + 1}`, // Human-readable name (1-based)
                modelFile: productSet.modelFile,
                outfitFile: outfitFile,
                status: 'pending',
                createdAt: Date.now(),
                lastModified: Date.now()
            };

            productSet.pairs.push(pair);
            
            log(`[ProductSet] Generated pair ${setBasedPairId} (ID: ${pair.id}) for set "${productSet.name}": ${productSet.modelFile.name} + ${outfitFile.name}`, 'debug');
        });

        // Update set progress
        updateProductSetProgress(productSet.id, 'generate_pairs');
        
        log(`[ProductSet] Generated ${productSet.pairs.length} pairs for set "${productSet.name}" with set-based IDs ${productSet.pairs[0]?.setBasedId} to ${productSet.pairs[productSet.pairs.length-1]?.setBasedId}`, 'success');
        return true;
    }

    // Helper function to get all pairs across all ProductSets (for backward compatibility)
    function getAllPairsFromProductSets() {
        const allPairs = [];
        
        productSets.forEach(set => {
            if (set.pairs && Array.isArray(set.pairs)) {
                allPairs.push(...set.pairs);
            }
        });

        return allPairs;
    }

    // Helper function to find a pair by ID (supports both legacy ID and set-based ID) across all ProductSets
    function findPairById(pairId) {
        for (const set of productSets) {
            if (set.pairs) {
                // Try to find by legacy numeric ID first (for backward compatibility)
                let pair = set.pairs.find(p => p.id === pairId);
                
                // If not found and pairId is string, try set-based ID
                if (!pair && typeof pairId === 'string') {
                    pair = set.pairs.find(p => p.setBasedId === pairId);
                }
                
                if (pair) {
                    return { pair, set };
                }
            }
        }
        return null;
    }

    // NEW: Helper function to find a pair by set-based ID specifically
    function findPairBySetBasedId(setBasedId) {
        // Parse the set-based ID format "S{setId}P{pairIndex}"
        const match = setBasedId.match(/^S(\d+)P(\d+)$/);
        if (!match) {
            log(`[FindPair] Invalid set-based ID format: ${setBasedId}`, 'error');
            return null;
        }
        
        const setId = parseInt(match[1]);
        const pairIndex = parseInt(match[2]);
        
        const productSet = findProductSetById(setId);
        if (!productSet || !productSet.pairs) {
            log(`[FindPair] ProductSet ${setId} not found for set-based ID: ${setBasedId}`, 'error');
            return null;
        }
        
        const pair = productSet.pairs[pairIndex];
        if (!pair) {
            log(`[FindPair] Pair at index ${pairIndex} not found in set ${setId} for set-based ID: ${setBasedId}`, 'error');
            return null;
        }
        
        return { pair, set: productSet };
    }

    // Helper function to update pair status within a ProductSet
    function updatePairStatusInProductSet(pairId, newStatus, context = 'unknown') {
        const result = findPairById(pairId);
        if (!result) {
            log(`[ProductSet] Error: Pair ${pairId} not found for status update (context: ${context})`, 'error');
            return false;
        }

        const { pair, set } = result;
        const oldStatus = pair.status;
        pair.status = newStatus;

        log(`[ProductSet] Pair ${pairId} status changed: ${oldStatus} → ${newStatus} in set "${set.name}" (context: ${context})`, 'debug');

        // Update the ProductSet's progress
        updateProductSetProgress(set.id, `pair_status_update_${context}`);

        // Check if set is completed after status update
        checkProductSetCompletion(set.id, `pair_status_update_${context}`);

        return true;
    }

    // NEW: Set completion detection logic
    function checkProductSetCompletion(setId, context = 'unknown') {
        const productSet = findProductSetById(setId);
        if (!productSet) {
            log(`[SetCompletion] ProductSet ${setId} not found for completion check (context: ${context})`, 'error');
            return false;
        }

        // Update progress first
        updateProductSetProgress(setId, `completion_check_${context}`);

        const validation = validateProductSetCompletion(setId, context);
        
        if (validation.isComplete) {
            // Determine final status based on pair results
            const hasErrors = validation.errorPairs > 0;
            const finalStatus = hasErrors ? 'error' : 'completed';
            
            if (productSet.status !== finalStatus) {
                updateProductSetStatus(setId, finalStatus, `completion_detected_${context}`);
                
                const duration = productSet.metadata.processingStartTime ? 
                    Date.now() - productSet.metadata.processingStartTime : 0;
                const durationMinutes = Math.round(duration / 60000);
                
                log(`[SetCompletion] 🎉 ProductSet "${productSet.name}" completed with status: ${finalStatus}`, 
                    hasErrors ? 'warn' : 'success');
                log(`[SetCompletion] Summary for "${productSet.name}": ${validation.summary}, Duration: ${durationMinutes}m`, 'info');
                
                // Check if all sets are complete
                const allSetsComplete = checkAllProductSetsCompletion(context);
                return { setComplete: true, allSetsComplete, finalStatus };
            }
        }
        
        return { setComplete: false, allSetsComplete: false };
    }

    function checkAllProductSetsCompletion(context = 'unknown') {
        const validation = validateAllProductSetsCompletion(context);
        
        if (validation.isComplete) {
            log(`[AllSetsCompletion] 🎉 All ProductSets completed! ${validation.summary}`, 'success');
            
            // Stop the main loop and update UI
            isStopped = true;
            if (batchGenerateBtn) {
                batchGenerateBtn.disabled = false;
                batchGenerateBtn.textContent = 'BATCH GENERATE';
            }
            if (pauseBtn) { 
                pauseBtn.disabled = true; 
                pauseBtn.textContent = 'PAUSE';
            }
            if (stopBtn) { 
                stopBtn.disabled = true;
            }
            
            if (mainLoopInterval) {
                clearInterval(mainLoopInterval);
                mainLoopInterval = null;
            }
            
            // Show completion summary with metrics
            const overallProgress = getOverallBatchProgress();
            const metrics = getOperationMetrics();
            const runtimeMinutes = Math.round(metrics.runtime / 60000);
            const runtimeSeconds = Math.round((metrics.runtime % 60000) / 1000);
            
            let message = `🎉 All ProductSets processing completed!\n\n${validation.summary}`;
            message += `\n\n📊 Performance Metrics:`;
            message += `\n• Runtime: ${runtimeMinutes}m ${runtimeSeconds}s`;
            message += `\n• Success Rate: ${metrics.successRate}%`;
            message += `\n• Recovery Attempts: ${metrics.recoveryAttempts}`;
            
            if (validation.errorSets && validation.errorSets.length > 0) {
                const errorList = validation.errorSets.map(set => `• ${set.name}: ${set.errorInfo.lastError || 'Unknown error'}`).join('\n');
                message += `\n\nSets with errors:\n${errorList}`;
            }
            
            if (metrics.activeCircuitBreakers.length > 0) {
                message += `\n\n⚠️ Active Circuit Breakers: ${metrics.activeCircuitBreakers.length}`;
            }
            
            playCompletionSound();
            alert(message);
            
            return true;
        } else {
            log(`[AllSetsCompletion] ProductSets still in progress: ${validation.summary}`, 'debug');
            return false;
        }
    }

    // NEW: Enhanced set-level error tracking
    function recordProductSetError(setId, error, context = 'unknown') {
        const productSet = findProductSetById(setId);
        if (!productSet) {
            log(`[SetError] ProductSet ${setId} not found for error recording (context: ${context})`, 'error');
            return false;
        }

        productSet.errorInfo.errorCount++;
        productSet.errorInfo.lastError = error.message || error.toString();
        productSet.metadata.lastModified = Date.now();

        log(`[SetError] Recorded error for set "${productSet.name}": ${productSet.errorInfo.lastError} (Total errors: ${productSet.errorInfo.errorCount}, context: ${context})`, 'error');

        // Update set status to error if not already
        if (productSet.status !== 'error') {
            updateProductSetStatus(setId, 'error', `error_recorded_${context}`);
        }

        return true;
    }

    // Helper function to migrate existing imagePairsData to ProductSet structure
    function migrateToProductSets() {
        if (!imagePairsData || imagePairsData.length === 0) {
            log(`[Migration] No existing pairs to migrate`, 'info');
            return;
        }

        // Group pairs by model file (assuming they represent different sets)
        const setGroups = new Map();
        
        imagePairsData.forEach(pair => {
            if (!pair.modelFile) return;
            
            const modelKey = `${pair.modelFile.name}_${pair.modelFile.size}`;
            
            if (!setGroups.has(modelKey)) {
                setGroups.set(modelKey, {
                    modelFile: pair.modelFile,
                    outfitFiles: [],
                    pairs: []
                });
            }
            
            const group = setGroups.get(modelKey);
            if (pair.outfitFile && !group.outfitFiles.find(f => f.name === pair.outfitFile.name)) {
                group.outfitFiles.push(pair.outfitFile);
            }
            group.pairs.push(pair);
        });

        // Convert groups to ProductSets
        let migratedCount = 0;
        setGroups.forEach((group, modelKey) => {
            const setName = `Migrated Set (${group.modelFile.name})`;
            const newSet = createProductSet(setName, group.modelFile, group.outfitFiles);
            
            // Copy existing pairs with updated structure
            newSet.pairs = group.pairs.map(pair => ({
                ...pair,
                setId: newSet.id,
                setName: newSet.name,
                pairIndex: newSet.pairs.length
            }));

            productSets.push(newSet);
            updateProductSetProgress(newSet.id, 'migration');
            migratedCount++;
        });

        log(`[Migration] Migrated ${imagePairsData.length} pairs into ${migratedCount} ProductSets`, 'success');
        
        // Clear old data structure
        // imagePairsData = []; // Keep for now to maintain backward compatibility
    }

    // Helper function to sync imagePairsData with ProductSets (for backward compatibility)
    function syncImagePairsDataWithProductSets() {
        imagePairsData = getAllPairsFromProductSets();
        log(`[Sync] Synchronized imagePairsData with ${imagePairsData.length} pairs from ${productSets.length} ProductSets`, 'debug');
    }

    // NEW: Concurrent generation tracking with atomic operations
    let activeGenerations = 0;
    const MAX_CONCURRENT_GENERATIONS = 2;
    let generationStartTimes = new Map(); // Track when each generation started
    let lastGlobalCompletionTime = 0; // Track last completion globally to prevent duplicate detection

    // NEW: Main loop architecture state
    let mainLoopInterval = null;
    let isProcessingPair = false; // Mutex to prevent concurrent pair starts
    let lastPairStartTime = 0; // Track timing between pair starts

    // NEW: Workspace isolation and DOM access control
    let isDOMBusy = false; // Mutex for DOM operations
    let lastWorkspaceCleanTime = 0; // Track when workspace was last cleaned
    let currentPairFiles = { model: null, outfit: null }; // Track current pair's files

    // NEW: UI synchronization tracking
    let lastUIRefreshTime = 0; // Track when UI was last refreshed

    // NEW: Policy violation tracking per generation
    let policyViolationChecks = new Map(); // Track violation checks per pair
    let violationRetryQueues = new Map(); // Track retry attempts per pair

    // NEW: Enhanced error handling and recovery system
    let errorRecoveryAttempts = new Map(); // Track recovery attempts per pair
    let circuitBreakerStates = new Map(); // Track failure patterns
    let operationMetrics = {
        startTime: Date.now(),
        pairsAttempted: 0,
        pairsSucceeded: 0,
        pairsFailed: 0,
        recoveryAttempts: 0,
        circuitBreakerTrips: 0
    };

    // Atomic operations for activeGenerations counter
    function incrementActiveGenerations(pairId, context = 'unknown') {
        const oldValue = activeGenerations;
        activeGenerations = Math.min(activeGenerations + 1, MAX_CONCURRENT_GENERATIONS);
        log(`[Counter] activeGenerations: ${oldValue} → ${activeGenerations} (+1 for pair ${pairId}, context: ${context})`, 'debug');
        if (activeGenerations !== oldValue + 1) {
            log(`[Counter] WARNING: Counter increment clamped for pair ${pairId}`, 'warn');
        }
        return activeGenerations;
    }

    function decrementActiveGenerations(pairId, context = 'unknown') {
        const oldValue = activeGenerations;
        activeGenerations = Math.max(activeGenerations - 1, 0);
        log(`[Counter] activeGenerations: ${oldValue} → ${activeGenerations} (-1 for pair ${pairId}, context: ${context})`, 'debug');
        if (activeGenerations !== oldValue - 1 && oldValue > 0) {
            log(`[Counter] WARNING: Counter decrement clamped for pair ${pairId}`, 'warn');
        }
        return activeGenerations;
    }

    function validateActiveGenerationsCounter(context = 'unknown') {
        const uiCount = getActualActiveGenerationsFromUI();
        const difference = Math.abs(activeGenerations - uiCount);
        
        // Only auto-correct for significant mismatches (3+ difference) to avoid timing issues
        // When generations are just starting, UI might lag behind internal counter
        if (difference >= 3) {
            log(`[Counter] ERROR: Significant counter mismatch! Internal: ${activeGenerations}, UI: ${uiCount}, Context: ${context}`, 'error');
            // Auto-correct based on UI (more reliable for large discrepancies)
            const oldValue = activeGenerations;
            activeGenerations = uiCount;
            log(`[Counter] Auto-corrected: ${oldValue} → ${activeGenerations} based on UI`, 'warn');
        } else if (difference > 0) {
            log(`[Counter] Minor counter difference: Internal: ${activeGenerations}, UI: ${uiCount}, Context: ${context} (tolerance: OK)`, 'debug');
        }
        return activeGenerations;
    }

    // Enhanced currentIndex management (Updated for ProductSet architecture)
    function validateCurrentIndex(context = 'unknown') {
        if (currentIndex < -1) {
            log(`[Index] ERROR: currentIndex ${currentIndex} is invalid (context: ${context}). Resetting to -1`, 'error');
            currentIndex = -1;
        }
        if (imagePairsData && currentIndex >= imagePairsData.length + 10) { // Allow some buffer but not too much
            log(`[Index] ERROR: currentIndex ${currentIndex} exceeds bounds (array length: ${imagePairsData?.length || 0}, context: ${context}). Resetting to array length`, 'error');
            currentIndex = imagePairsData.length;
        }
        return currentIndex;
    }

    function setCurrentIndex(newIndex, context = 'unknown') {
        const oldIndex = currentIndex;
        currentIndex = newIndex;
        validateCurrentIndex(context);
        if (currentIndex !== oldIndex) {
            log(`[Index] Changed: ${oldIndex} → ${currentIndex} (context: ${context})`, 'debug');
        }
        return currentIndex;
    }

    // NEW: ProductSet-based index management
    function validateProductSetIndices(context = 'unknown') {
        // Validate currentSetIndex
        if (currentSetIndex < -1) {
            log(`[SetIndex] ERROR: currentSetIndex ${currentSetIndex} is invalid (context: ${context}). Resetting to -1`, 'error');
            currentSetIndex = -1;
        }
        if (currentSetIndex >= productSets.length + 5) { // Allow some buffer
            log(`[SetIndex] ERROR: currentSetIndex ${currentSetIndex} exceeds bounds (sets length: ${productSets.length}, context: ${context}). Resetting to sets length`, 'error');
            currentSetIndex = productSets.length;
        }

        // Validate currentPairInSetIndex if we have a valid set
        if (currentSetIndex >= 0 && currentSetIndex < productSets.length) {
            const currentSet = productSets[currentSetIndex];
            if (currentSet && currentSet.pairs) {
                if (currentPairInSetIndex >= currentSet.pairs.length + 5) { // Allow some buffer
                    log(`[PairIndex] ERROR: currentPairInSetIndex ${currentPairInSetIndex} exceeds bounds (pairs length: ${currentSet.pairs.length}, context: ${context}). Resetting to pairs length`, 'error');
                    currentPairInSetIndex = currentSet.pairs.length;
                }
            }
        } else {
            // If no valid set, reset pair index
            if (currentPairInSetIndex !== -1) {
                log(`[PairIndex] No valid set, resetting currentPairInSetIndex to -1 (context: ${context})`, 'debug');
                currentPairInSetIndex = -1;
            }
        }

        return { currentSetIndex, currentPairInSetIndex };
    }

    function setCurrentProductSetIndex(newSetIndex, newPairIndex = -1, context = 'unknown') {
        const oldSetIndex = currentSetIndex;
        const oldPairIndex = currentPairInSetIndex;
        
        currentSetIndex = newSetIndex;
        currentPairInSetIndex = newPairIndex;
        
        validateProductSetIndices(context);
        
        if (currentSetIndex !== oldSetIndex || currentPairInSetIndex !== oldPairIndex) {
            log(`[SetIndex] Changed: Set ${oldSetIndex}.${oldPairIndex} → ${currentSetIndex}.${currentPairInSetIndex} (context: ${context})`, 'debug');
            
            // Update legacy currentIndex for backward compatibility
            updateLegacyCurrentIndex(context);
        }
        
        return { currentSetIndex, currentPairInSetIndex };
    }

    // Helper function to update legacy currentIndex based on ProductSet indices
    function updateLegacyCurrentIndex(context = 'unknown') {
        if (currentSetIndex === -1) {
            currentIndex = -1;
            return;
        }

        let legacyIndex = 0;
        
        // Count all pairs from sets before the current set
        for (let setIdx = 0; setIdx < currentSetIndex && setIdx < productSets.length; setIdx++) {
            const set = productSets[setIdx];
            if (set && set.pairs) {
                legacyIndex += set.pairs.length;
            }
        }
        
        // Add the current pair index within the current set
        if (currentPairInSetIndex >= 0) {
            legacyIndex += currentPairInSetIndex;
        }
        
        const oldCurrentIndex = currentIndex;
        currentIndex = legacyIndex;
        
        if (currentIndex !== oldCurrentIndex) {
            log(`[Index] Legacy index updated: ${oldCurrentIndex} → ${currentIndex} (Set ${currentSetIndex}.${currentPairInSetIndex}, context: ${context})`, 'debug');
        }
    }

    // Helper function to convert legacy currentIndex to ProductSet indices
    function convertLegacyIndexToProductSetIndices(legacyIndex, context = 'unknown') {
        if (legacyIndex < 0 || productSets.length === 0) {
            return { setIndex: -1, pairIndex: -1 };
        }

        let remainingIndex = legacyIndex;
        
        for (let setIdx = 0; setIdx < productSets.length; setIdx++) {
            const set = productSets[setIdx];
            if (!set || !set.pairs) continue;
            
            if (remainingIndex < set.pairs.length) {
                // Found the target set and pair
                log(`[Index] Converted legacy index ${legacyIndex} to Set ${setIdx}.${remainingIndex} (context: ${context})`, 'debug');
                return { setIndex: setIdx, pairIndex: remainingIndex };
            }
            
            remainingIndex -= set.pairs.length;
        }
        
        // Index is beyond all pairs
        log(`[Index] Legacy index ${legacyIndex} is beyond all pairs, returning last set (context: ${context})`, 'warn');
        return { setIndex: productSets.length - 1, pairIndex: productSets[productSets.length - 1]?.pairs?.length || 0 };
    }

    // Helper function to get current pair using ProductSet indices
    function getCurrentPairFromProductSets() {
        if (currentSetIndex < 0 || currentSetIndex >= productSets.length) {
            return null;
        }

        const currentSet = productSets[currentSetIndex];
        if (!currentSet || !currentSet.pairs || currentPairInSetIndex < 0 || currentPairInSetIndex >= currentSet.pairs.length) {
            return null;
        }

        return {
            pair: currentSet.pairs[currentPairInSetIndex],
            set: currentSet,
            setIndex: currentSetIndex,
            pairIndex: currentPairInSetIndex
        };
    }

    // Enhanced pair status management
    const VALID_PAIR_STATUSES = ['pending', 'processing', 'done', 'error', 'skipped'];
    const VALID_STATUS_TRANSITIONS = {
        'pending': ['processing', 'error', 'skipped'],
        'processing': ['done', 'error', 'skipped'],
        'done': [], // Final state - no transitions allowed
        'error': ['pending', 'skipped'], // Can retry from error or skip
        'skipped': ['pending'] // Can restart from skipped
    };

    function validatePairStatus(pair, context = 'unknown') {
        if (!pair) return false;
        
        if (!VALID_PAIR_STATUSES.includes(pair.status)) {
            log(`[Status] ERROR: Invalid status '${pair.status}' for pair ${pair.id} (context: ${context})`, 'error');
            pair.status = 'pending'; // Reset to safe state
            return false;
        }
        return true;
    }

    function setPairStatus(pair, newStatus, context = 'unknown') {
        if (!pair) {
            log(`[Status] ERROR: No pair provided (context: ${context})`, 'error');
            return false;
        }

        const oldStatus = pair.status || 'unknown';
        
        // Validate new status
        if (!VALID_PAIR_STATUSES.includes(newStatus)) {
            log(`[Status] ERROR: Invalid new status '${newStatus}' for pair ${pair.id} (context: ${context})`, 'error');
            return false;
        }

        // Check if transition is allowed
        if (oldStatus !== 'unknown' && VALID_STATUS_TRANSITIONS[oldStatus] && 
            !VALID_STATUS_TRANSITIONS[oldStatus].includes(newStatus)) {
            log(`[Status] WARNING: Invalid transition ${oldStatus} → ${newStatus} for pair ${pair.id} (context: ${context})`, 'warn');
            // Allow it but log the warning
        }

        pair.status = newStatus;
        log(`[Status] Changed: ${oldStatus} → ${newStatus} for pair ${pair.id} (context: ${context})`, 'debug');
        
        // Update UI
        try {
            updatePairStatusInUI(pair.id, newStatus === 'done' ? 'Done!' : 
                                         newStatus === 'error' ? 'Error' :
                                         newStatus === 'processing' ? 'Processing...' : 
                                         newStatus === 'skipped' ? 'Skipped' :
                                         'Pending');
        } catch (uiError) {
            log(`[Status] UI update failed for pair ${pair.id}: ${uiError.message}`, 'warn');
        }

        return true;
    }

    // NEW: Enhanced completion detection and validation (Updated for ProductSet architecture)
    function validateAllPairsCompletion(context = 'unknown') {
        // Use ProductSets as primary source if available, fall back to imagePairsData for compatibility
        if (productSets.length > 0) {
            return validateAllProductSetsCompletion(context);
        }
        
        if (!imagePairsData || imagePairsData.length === 0) {
            log(`[Completion] No pairs to validate (context: ${context})`, 'debug');
            return { isComplete: true, summary: 'No pairs to process' };
        }

        const statusCounts = {
            pending: 0,
            processing: 0,
            done: 0,
            error: 0,
            skipped: 0,
            unknown: 0
        };

        const stuckPairs = [];
        const errorPairs = [];
        
        imagePairsData.forEach((pair, index) => {
            const status = pair.status || 'unknown';
            statusCounts[status] = (statusCounts[status] || 0) + 1;
            
            // Check for stuck pairs (processing for too long)
            if (status === 'processing') {
                const startTime = generationStartTimes.get(pair.id);
                if (startTime && (Date.now() - startTime) > 300000) { // 5 minutes
                    stuckPairs.push({ pair, duration: Date.now() - startTime });
                }
            }
            
            if (status === 'error') {
                errorPairs.push(pair);
            }
        });

        const totalPairs = imagePairsData.length;
        const completedPairs = statusCounts.done;
        const pendingPairs = statusCounts.pending;
        const processingPairs = statusCounts.processing;
        const erroredPairs = statusCounts.error;

        const isComplete = pendingPairs === 0 && processingPairs === 0 && activeGenerations === 0;
        
        const summary = `${completedPairs}/${totalPairs} done, ${pendingPairs} pending, ${processingPairs} processing, ${erroredPairs} error${stuckPairs.length > 0 ? `, ${stuckPairs.length} stuck` : ''}`;
        
        log(`[Completion] Validation result: ${isComplete ? 'COMPLETE' : 'IN_PROGRESS'} - ${summary} (context: ${context})`, isComplete ? 'success' : 'info');

        if (stuckPairs.length > 0) {
            log(`[Completion] WARNING: Found ${stuckPairs.length} stuck pairs:`, 'warn');
            stuckPairs.forEach(({pair, duration}) => {
                log(`  Pair ${pair.id} stuck in processing for ${Math.round(duration/1000)}s`, 'warn');
            });
        }

        return {
            isComplete,
            summary,
            statusCounts,
            stuckPairs,
            errorPairs,
            completedPairs,
            totalPairs
        };
    }

    // NEW: ProductSet-specific completion validation
    function validateAllProductSetsCompletion(context = 'unknown') {
        if (!productSets || productSets.length === 0) {
            log(`[ProductSetCompletion] No ProductSets to validate (context: ${context})`, 'debug');
            return { isComplete: true, summary: 'No ProductSets to process' };
        }

        const setStatusCounts = {
            pending: 0,
            processing: 0,
            completed: 0,
            error: 0,
            paused: 0
        };

        const pairStatusCounts = {
            pending: 0,
            processing: 0,
            done: 0,
            error: 0,
            skipped: 0,
            unknown: 0
        };

        const stuckPairs = [];
        const errorPairs = [];
        const errorSets = [];
        
        productSets.forEach(set => {
            // Count set statuses
            const setStatus = set.status || 'pending';
            setStatusCounts[setStatus] = (setStatusCounts[setStatus] || 0) + 1;
            
            if (setStatus === 'error') {
                errorSets.push(set);
            }
            
            // Count pair statuses within each set
            if (set.pairs && Array.isArray(set.pairs)) {
                set.pairs.forEach(pair => {
                    const pairStatus = pair.status || 'unknown';
                    pairStatusCounts[pairStatus] = (pairStatusCounts[pairStatus] || 0) + 1;
                    
                    // Check for stuck pairs
                    if (pairStatus === 'processing') {
                        const startTime = generationStartTimes.get(pair.id);
                        if (startTime && (Date.now() - startTime) > 300000) { // 5 minutes
                            stuckPairs.push({ 
                                pair, 
                                set, 
                                duration: Date.now() - startTime 
                            });
                        }
                    }
                    
                    if (pairStatus === 'error') {
                        errorPairs.push({ pair, set });
                    }
                });
            }
        });

        const totalSets = productSets.length;
        const completedSets = setStatusCounts.completed;
        const totalPairs = Object.values(pairStatusCounts).reduce((sum, count) => sum + count, 0);
        const completedPairs = pairStatusCounts.done;
        const skippedPairs = pairStatusCounts.skipped;
        const pendingPairs = pairStatusCounts.pending;
        const processingPairs = pairStatusCounts.processing;
        const erroredPairs = pairStatusCounts.error;

        const isComplete = pendingPairs === 0 && processingPairs === 0 && activeGenerations === 0 &&
                          setStatusCounts.pending === 0 && setStatusCounts.processing === 0;
        
        const summary = `Sets: ${completedSets}/${totalSets} completed | Pairs: ${completedPairs}/${totalPairs} done${skippedPairs > 0 ? `, ${skippedPairs} skipped` : ''}, ${pendingPairs} pending, ${processingPairs} processing, ${erroredPairs} error${stuckPairs.length > 0 ? `, ${stuckPairs.length} stuck` : ''}`;
        
        log(`[ProductSetCompletion] Validation result: ${isComplete ? 'COMPLETE' : 'IN_PROGRESS'} - ${summary} (context: ${context})`, isComplete ? 'success' : 'info');

        if (stuckPairs.length > 0) {
            log(`[ProductSetCompletion] WARNING: Found ${stuckPairs.length} stuck pairs:`, 'warn');
            stuckPairs.forEach(({pair, set, duration}) => {
                log(`  Pair ${pair.id} in set "${set.name}" stuck in processing for ${Math.round(duration/1000)}s`, 'warn');
            });
        }

        if (errorSets.length > 0) {
            log(`[ProductSetCompletion] WARNING: Found ${errorSets.length} sets with errors:`, 'warn');
            errorSets.forEach(set => {
                log(`  Set "${set.name}" has error: ${set.errorInfo.lastError || 'Unknown error'}`, 'warn');
            });
        }

        return {
            isComplete,
            summary,
            setStatusCounts,
            pairStatusCounts,
            stuckPairs,
            errorPairs,
            errorSets,
            completedPairs,
            totalPairs,
            completedSets,
            totalSets
        };
    }

    // NEW: Validate individual ProductSet completion
    function validateProductSetCompletion(setId, context = 'unknown') {
        const productSet = findProductSetById(setId);
        if (!productSet) {
            log(`[SetCompletion] ProductSet ${setId} not found (context: ${context})`, 'error');
            return { isComplete: false, error: 'Set not found' };
        }

        if (!productSet.pairs || productSet.pairs.length === 0) {
            log(`[SetCompletion] ProductSet "${productSet.name}" has no pairs (context: ${context})`, 'warn');
            return { isComplete: true, summary: 'No pairs to process in set' };
        }

        const pendingPairs = productSet.pairs.filter(p => p.status === 'pending').length;
        const processingPairs = productSet.pairs.filter(p => p.status === 'processing').length;
        const donePairs = productSet.pairs.filter(p => p.status === 'done').length;
        const errorPairs = productSet.pairs.filter(p => p.status === 'error').length;

        const isComplete = pendingPairs === 0 && processingPairs === 0;
        const summary = `${donePairs}/${productSet.pairs.length} done, ${errorPairs} error, ${pendingPairs} pending, ${processingPairs} processing`;

        log(`[SetCompletion] Set "${productSet.name}": ${isComplete ? 'COMPLETE' : 'IN_PROGRESS'} - ${summary} (context: ${context})`, isComplete ? 'success' : 'debug');

        return {
            isComplete,
            summary,
            totalPairs: productSet.pairs.length,
            donePairs,
            errorPairs,
            pendingPairs,
            processingPairs
        };
    }

    function checkBatchCompletion(context = 'unknown') {
        const validation = validateAllPairsCompletion(context);
        
        if (validation.isComplete) {
            log(`[Completion] 🎉 Batch completion confirmed! ${validation.summary}`, 'success');
            
            // Stop the main loop and update UI
            isStopped = true;
            if (batchGenerateBtn) {
                batchGenerateBtn.disabled = false;
                batchGenerateBtn.textContent = 'BATCH GENERATE';
            }
            if (pauseBtn) { 
                pauseBtn.disabled = true; 
                pauseBtn.textContent = 'PAUSE';
            }
            if (stopBtn) { 
                stopBtn.disabled = true;
            }
            
            if (mainLoopInterval) {
                clearInterval(mainLoopInterval);
                mainLoopInterval = null;
            }
            
            // Show completion summary with metrics
            const metrics = getOperationMetrics();
            const runtimeMinutes = Math.round(metrics.runtime / 60000);
            const runtimeSeconds = Math.round((metrics.runtime % 60000) / 1000);
            
            let message = `🎉 Batch processing completed!\n\n${validation.summary}`;
            message += `\n\n📊 Performance Metrics:`;
            message += `\n• Runtime: ${runtimeMinutes}m ${runtimeSeconds}s`;
            message += `\n• Success Rate: ${metrics.successRate}%`;
            message += `\n• Recovery Attempts: ${metrics.recoveryAttempts}`;
            
            if (validation.errorPairs.length > 0) {
                const errorList = validation.errorPairs.map(p => `• ${p.modelFile?.name || 'Unknown'} + ${p.outfitFile?.name || 'Unknown'}`).join('\n');
                message += `\n\nFailed pairs:\n${errorList}`;
            }
            
            if (metrics.activeCircuitBreakers.length > 0) {
                message += `\n\n⚠️ Active Circuit Breakers: ${metrics.activeCircuitBreakers.length}`;
            }
            
            playCompletionSound();
            alert(message);
            
            return true;
        } else {
            log(`[Completion] Batch still in progress: ${validation.summary}`, 'debug');
            return false;
        }
    }

    // NEW: Workspace isolation and validation functions
    async function acquireDOMLock(context = 'unknown', timeout = 20000) {
        const logPrefix = `[DOM-Lock]`;
        const startTime = Date.now();
        
        log(`${logPrefix} Acquiring DOM lock (context: ${context})`, 'debug');
        
        while (isDOMBusy) {
            if (Date.now() - startTime > timeout) {
                throw new Error(`DOM lock timeout after ${timeout}ms (context: ${context})`);
            }
            log(`${logPrefix} Waiting for DOM lock (context: ${context})...`, 'debug');
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        isDOMBusy = true;
        log(`${logPrefix} DOM lock acquired (context: ${context})`, 'debug');
        return {
            release: () => {
                isDOMBusy = false;
                log(`${logPrefix} DOM lock released (context: ${context})`, 'debug');
            }
        };
    }

    function validateWorkspaceState(expectedImages = 0, context = 'unknown') {
        const logPrefix = `[Workspace]`;
        
        try {
            log(`${logPrefix} Validating workspace state (expecting ${expectedImages} images, context: ${context})`, 'debug');
            
            // Check for staged images in the input area
            const composerArea = document.querySelector('.relative.rounded-\\[24px\\].p-2.max-tablet\\:flex');
            const imageGrid = composerArea?.querySelector('div.grid.grid-cols-5.gap-2.p-1.pb-0');
            const stagedImages = imageGrid?.querySelectorAll('div.relative.h-full.w-full.overflow-hidden > img[alt="Upload"][src^="data:image"]') || [];
            
            const actualImages = stagedImages.length;
            
            if (actualImages !== expectedImages) {
                log(`${logPrefix} CONTAMINATION DETECTED! Expected ${expectedImages} images but found ${actualImages} (context: ${context})`, 'error');
                
                // Log details of found images for debugging
                stagedImages.forEach((img, index) => {
                    const src = img.src.substring(0, 50) + '...';
                    log(`${logPrefix} Found image ${index + 1}: ${src}`, 'warn');
                });
                
                return {
                    isValid: false,
                    expectedImages,
                    actualImages,
                    contaminated: actualImages > expectedImages,
                    needsCleanup: actualImages > 0
                };
            }
            
            // Check if SORA interface is in a clean state
            const textarea = document.querySelector('textarea[placeholder*="image"]') ||
                           document.querySelector('textarea[placeholder="Describe your image..."]');
            
            if (!textarea) {
                log(`${logPrefix} Warning: Textarea not found (context: ${context})`, 'warn');
            }
            
            log(`${logPrefix} Workspace validation passed: ${actualImages} images as expected (context: ${context})`, 'success');
            
            return {
                isValid: true,
                expectedImages,
                actualImages,
                contaminated: false,
                needsCleanup: false
            };
            
        } catch (error) {
            log(`${logPrefix} Error validating workspace: ${error.message} (context: ${context})`, 'error');
            return {
                isValid: false,
                expectedImages,
                actualImages: -1,
                contaminated: true,
                needsCleanup: true,
                error: error.message
            };
        }
    }

    async function ensureCleanWorkspace(context = 'unknown', forceClean = false) {
        const logPrefix = `[Workspace-Clean]`;
        
        log(`${logPrefix} Ensuring clean workspace (context: ${context}, force: ${forceClean})`, 'info');
        
        // Check current state
        const currentState = validateWorkspaceState(0, context);
        
        if (currentState.isValid && !forceClean) {
            log(`${logPrefix} Workspace already clean (context: ${context})`, 'success');
            lastWorkspaceCleanTime = Date.now();
            // NOTE: Don't reset currentPairFiles here - we need to keep tracking for validation
            return true;
        }
        
        if (currentState.needsCleanup || forceClean) {
            log(`${logPrefix} Workspace contaminated with ${currentState.actualImages} images, cleaning... (context: ${context})`, 'warn');
            
            try {
                await clearSoraInput();
                
                // Wait a moment for UI to update
                await new Promise(resolve => setTimeout(resolve, 500));
                
                // Validate cleanup was successful
                const afterCleanState = validateWorkspaceState(0, `${context}_after_clean`);
                
                if (afterCleanState.isValid) {
                    log(`${logPrefix} Workspace cleaned successfully (context: ${context})`, 'success');
                    lastWorkspaceCleanTime = Date.now();
                    // NOTE: Don't reset currentPairFiles here - we need to keep tracking for validation
                    return true;
                } else {
                    log(`${logPrefix} Cleanup failed! Still found ${afterCleanState.actualImages} images (context: ${context})`, 'error');
                    return false;
                }
                
            } catch (cleanupError) {
                log(`${logPrefix} Error during cleanup: ${cleanupError.message} (context: ${context})`, 'error');
                return false;
            }
        }
        
        log(`${logPrefix} Workspace validation failed (context: ${context})`, 'error');
        return false;
    }

    function trackPairFiles(pair, context = 'unknown') {
        if (!pair) return;
        
        currentPairFiles = {
            model: pair.modelFile ? {
                name: pair.modelFile.name,
                size: pair.modelFile.size,
                type: pair.modelFile.type
            } : null,
            outfit: pair.outfitFile ? {
                name: pair.outfitFile.name,
                size: pair.outfitFile.size,
                type: pair.outfitFile.type
            } : null
        };
        
        log(`[File-Track] Tracking files for pair ${pair.id}: Model="${currentPairFiles.model?.name || 'None'}", Outfit="${currentPairFiles.outfit?.name || 'None'}" (context: ${context})`, 'debug');
    }

    function validatePairFiles(pair, context = 'unknown') {
        if (!pair) return false;
        
        const expectedModel = pair.modelFile ? {
            name: pair.modelFile.name,
            size: pair.modelFile.size,
            type: pair.modelFile.type
        } : null;
        
        const expectedOutfit = pair.outfitFile ? {
            name: pair.outfitFile.name,
            size: pair.outfitFile.size,
            type: pair.outfitFile.type
        } : null;
        
        const modelMatches = (!expectedModel && !currentPairFiles.model) || 
                           (expectedModel && currentPairFiles.model && 
                            expectedModel.name === currentPairFiles.model.name &&
                            expectedModel.size === currentPairFiles.model.size);
                            
        const outfitMatches = (!expectedOutfit && !currentPairFiles.outfit) || 
                            (expectedOutfit && currentPairFiles.outfit && 
                             expectedOutfit.name === currentPairFiles.outfit.name &&
                             expectedOutfit.size === currentPairFiles.outfit.size);
        
        if (!modelMatches || !outfitMatches) {
            log(`[File-Validate] FILE MISMATCH for pair ${pair.id}! Expected: Model="${expectedModel?.name || 'None'}", Outfit="${expectedOutfit?.name || 'None'}" | Tracked: Model="${currentPairFiles.model?.name || 'None'}", Outfit="${currentPairFiles.outfit?.name || 'None'}" (context: ${context})`, 'error');
            return false;
        }
        
        log(`[File-Validate] File validation passed for pair ${pair.id} (context: ${context})`, 'success');
        return true;
    }

    // NEW: Generation-specific policy violation detection and handling
    function initializePolicyViolationTracking(pairId, context = 'unknown') {
        const logPrefix = `[Policy-${pairId}]`;
        
        if (!policyViolationChecks.has(pairId)) {
            policyViolationChecks.set(pairId, {
                pairId,
                startTime: Date.now(),
                checkCount: 0,
                lastCheckTime: 0,
                violationDetected: false,
                violationType: null,
                context
            });
            
            violationRetryQueues.set(pairId, {
                pairId,
                retryCount: 0,
                maxRetries: 2, // Allow 2 retries for policy violations
                retryDelay: 30000, // 30 seconds between retries
                lastRetryTime: 0
            });
            
            log(`${logPrefix} Initialized policy violation tracking (context: ${context})`, 'debug');
        }
    }

    function detectPolicyViolationForGeneration(pairId, context = 'unknown') {
        const logPrefix = `[Policy-${pairId}]`;
        
        try {
            const trackingData = policyViolationChecks.get(pairId);
            if (!trackingData) {
                log(`${logPrefix} No tracking data found, cannot check violations (context: ${context})`, 'warn');
                return { hasViolation: false, violationType: null };
            }

            trackingData.checkCount++;
            trackingData.lastCheckTime = Date.now();

            // STRATEGY 1: Look for alert icons with policy violation text
            const alertIcons = document.querySelectorAll('svg.lucide-alert-circle');
            
            for (const alertIcon of alertIcons) {
                // Find the containing element with policy violation text
                const container = alertIcon.closest('div');
                if (!container) continue;

                const containerText = container.textContent || '';
                
                // Check for different types of policy violations
                if (containerText.includes("This content might violate our policies")) {
                    // Get more specific violation type if possible
                    let violationType = 'content_policy';
                    if (containerText.includes("safety")) violationType = 'safety_policy';
                    if (containerText.includes("copyright")) violationType = 'copyright_policy';
                    if (containerText.includes("inappropriate")) violationType = 'inappropriate_content';
                    
                    // Check if this violation is recent (appeared in the last 30 seconds)
                    const timeSinceStart = Date.now() - trackingData.startTime;
                    if (timeSinceStart < 60000) { // Only consider violations within 1 minute of generation start
                        trackingData.violationDetected = true;
                        trackingData.violationType = violationType;
                        
                        log(`${logPrefix} Policy violation detected: ${violationType} (check #${trackingData.checkCount}, context: ${context})`, 'error');
                        
                        return {
                            hasViolation: true,
                            violationType,
                            violationText: containerText.substring(0, 100) + '...',
                            timeSinceStart
                        };
                    } else {
                        log(`${logPrefix} Found old policy violation (${Math.round(timeSinceStart/1000)}s ago), ignoring (context: ${context})`, 'debug');
                    }
                }
            }

            // STRATEGY 2: Look for specific error messages in toast notifications
            const toasts = document.querySelectorAll('li[data-sonner-toast]');
            for (const toast of toasts) {
                const toastText = toast.textContent || '';
                if (toastText.includes("policy") || toastText.includes("violation") || toastText.includes("not allowed")) {
                    const timeSinceStart = Date.now() - trackingData.startTime;
                    if (timeSinceStart < 30000) { // Only consider recent toasts
                        trackingData.violationDetected = true;
                        trackingData.violationType = 'toast_policy';
                        
                        log(`${logPrefix} Policy violation in toast: ${toastText.substring(0, 50)}... (context: ${context})`, 'error');
                        
                        return {
                            hasViolation: true,
                            violationType: 'toast_policy',
                            violationText: toastText.substring(0, 100) + '...',
                            timeSinceStart
                        };
                    }
                }
            }

            // No violation detected
            log(`${logPrefix} No policy violation detected (check #${trackingData.checkCount}, context: ${context})`, 'debug');
            return { hasViolation: false, violationType: null };

        } catch (error) {
            log(`${logPrefix} Error checking policy violations: ${error.message} (context: ${context})`, 'error');
            return { hasViolation: false, violationType: null, error: error.message };
        }
    }

    async function handlePolicyViolation(pairId, violationData, context = 'unknown') {
        const logPrefix = `[Policy-${pairId}]`;
        const retryData = violationRetryQueues.get(pairId);
        
        if (!retryData) {
            log(`${logPrefix} No retry data found, cannot handle violation (context: ${context})`, 'error');
            return { shouldRetry: false, action: 'no_retry_data' };
        }

        log(`${logPrefix} Handling policy violation: ${violationData.violationType} (retry ${retryData.retryCount}/${retryData.maxRetries}, context: ${context})`, 'warn');

        // Check if we should retry
        if (retryData.retryCount >= retryData.maxRetries) {
            log(`${logPrefix} Maximum retries reached (${retryData.retryCount}), marking as permanent failure (context: ${context})`, 'error');
            
            // Clean up tracking data
            policyViolationChecks.delete(pairId);
            violationRetryQueues.delete(pairId);
            
            return {
                shouldRetry: false,
                action: 'max_retries_exceeded',
                finalFailure: true,
                violationType: violationData.violationType
            };
        }

        // Check retry timing
        const timeSinceLastRetry = Date.now() - retryData.lastRetryTime;
        if (retryData.lastRetryTime > 0 && timeSinceLastRetry < retryData.retryDelay) {
            const waitTime = retryData.retryDelay - timeSinceLastRetry;
            log(`${logPrefix} Too soon to retry, need to wait ${Math.round(waitTime/1000)}s more (context: ${context})`, 'info');
            
            return {
                shouldRetry: false,
                action: 'wait_for_retry_delay',
                waitTime
            };
        }

        // Prepare for retry
        retryData.retryCount++;
        retryData.lastRetryTime = Date.now();

        log(`${logPrefix} Preparing retry attempt ${retryData.retryCount}/${retryData.maxRetries} after ${Math.round(retryData.retryDelay/1000)}s delay (context: ${context})`, 'info');

        // Perform cleanup before retry
        try {
            await ensureCleanWorkspace(`policy_violation_cleanup_${pairId}`, true);
            log(`${logPrefix} Workspace cleaned for retry (context: ${context})`, 'info');
        } catch (cleanupError) {
            log(`${logPrefix} Error cleaning workspace for retry: ${cleanupError.message} (context: ${context})`, 'error');
        }

        return {
            shouldRetry: true,
            action: 'scheduled_retry',
            retryCount: retryData.retryCount,
            maxRetries: retryData.maxRetries,
            retryDelay: retryData.retryDelay
        };
    }

    function cleanupPolicyViolationTracking(pairId, context = 'unknown') {
        const logPrefix = `[Policy-${pairId}]`;
        
        const hadTracking = policyViolationChecks.has(pairId);
        const hadRetryData = violationRetryQueues.has(pairId);
        
        if (hadTracking) {
            const trackingData = policyViolationChecks.get(pairId);
            log(`${logPrefix} Cleaning up violation tracking after ${trackingData.checkCount} checks (context: ${context})`, 'debug');
            policyViolationChecks.delete(pairId);
        }
        
        if (hadRetryData) {
            const retryData = violationRetryQueues.get(pairId);
            log(`${logPrefix} Cleaning up retry queue after ${retryData.retryCount} attempts (context: ${context})`, 'debug');
            violationRetryQueues.delete(pairId);
        }
        
        if (hadTracking || hadRetryData) {
            log(`${logPrefix} Policy violation tracking cleanup completed (context: ${context})`, 'debug');
        }
    }

    // NEW: Enhanced DOM element detection and validation
    function findAndValidateTextarea(context = 'unknown', requiredState = 'available') {
        const logPrefix = `[DOM-Textarea]`;
        
        try {
            log(`${logPrefix} Finding textarea (context: ${context}, required: ${requiredState})`, 'debug');
            
            // Multiple strategies to find the textarea
            const selectors = [
                'textarea[placeholder*="image"]',
                'textarea[placeholder="Describe your image..."]',
                'textarea[placeholder="Describe a new image..."]',
                'textarea.max-h-\\[80vh\\]',
                'textarea' // Fallback
            ];
            
            let foundTextarea = null;
            let selectorUsed = null;
            
            for (const selector of selectors) {
                const textarea = document.querySelector(selector);
                if (textarea) {
                    foundTextarea = textarea;
                    selectorUsed = selector;
                    break;
                }
            }
            
            if (!foundTextarea) {
                log(`${logPrefix} No textarea found with any selector (context: ${context})`, 'error');
                return { textarea: null, isValid: false, reason: 'not_found' };
            }
            
            log(`${logPrefix} Found textarea using selector: ${selectorUsed} (context: ${context})`, 'success');
            
            // Validate textarea state based on requirements
            if (requiredState === 'available') {
                if (foundTextarea.disabled || foundTextarea.readOnly) {
                    log(`${logPrefix} Textarea found but not available (disabled: ${foundTextarea.disabled}, readonly: ${foundTextarea.readOnly}, context: ${context})`, 'warn');
                    return { textarea: foundTextarea, isValid: false, reason: 'not_available' };
                }
            }
            
            // Check if textarea is visible and interactable
            if (foundTextarea.offsetParent === null) {
                log(`${logPrefix} Textarea found but not visible (context: ${context})`, 'warn');
                return { textarea: foundTextarea, isValid: false, reason: 'not_visible' };
            }
            
            log(`${logPrefix} Textarea validation passed (context: ${context})`, 'success');
            return { 
                textarea: foundTextarea, 
                isValid: true, 
                selector: selectorUsed,
                placeholder: foundTextarea.placeholder,
                disabled: foundTextarea.disabled,
                readOnly: foundTextarea.readOnly
            };
            
        } catch (error) {
            log(`${logPrefix} Error finding/validating textarea: ${error.message} (context: ${context})`, 'error');
            return { textarea: null, isValid: false, reason: 'error', error: error.message };
        }
    }

    function findAndValidateRemixButton(context = 'unknown', timeout = 15000) {
        const logPrefix = `[DOM-Button]`;
        
        return new Promise((resolve) => {
            log(`${logPrefix} Finding Remix button with timeout ${timeout}ms (context: ${context})`, 'debug');
            
            const startTime = Date.now();
            
            const searchForButton = () => {
                try {
                    // Strategy 1: Look for exact Remix button with proper attributes
                    const buttons = Array.from(document.querySelectorAll('button'));
                    
                    // Primary method: Look for the specific Remix button structure
                    let remixButton = buttons.find(btn => {
                        try {
                            const isExplicitlyEnabled = btn.getAttribute('data-disabled') === 'false';
                            const hasRemixText = btn.textContent.trim() === "Remix";
                            const hasCoreStyling = btn.classList.contains('px-3') &&
                                                 btn.classList.contains('py-2') &&
                                                 btn.classList.contains('h-9') &&
                                                 btn.classList.contains('rounded-full') &&
                                                 btn.classList.contains('bg-token-bg-inverse');
                            
                            return isExplicitlyEnabled && hasRemixText && hasCoreStyling;
                        } catch (btnError) {
                            return false;
                        }
                    });
                    
                    // Fallback method: Look for any enabled button with "Remix" text
                    if (!remixButton) {
                        log(`${logPrefix} Primary method failed, trying fallback (context: ${context})`, 'debug');
                        remixButton = buttons.find(btn => {
                            try {
                                const hasRemixText = btn.textContent.trim() === "Remix";
                                const isNotDisabled = !btn.disabled && btn.getAttribute('data-disabled') !== 'true';
                                return hasRemixText && isNotDisabled;
                            } catch (btnError) {
                                return false;
                            }
                        });
                    }
                    
                    if (remixButton) {
                        // Validate the button is truly ready
                        if (remixButton.offsetParent === null) {
                            log(`${logPrefix} Remix button found but not visible (context: ${context})`, 'warn');
                            return null;
                        }
                        
                        log(`${logPrefix} Valid Remix button found (context: ${context})`, 'success');
                        return {
                            button: remixButton,
                            isValid: true,
                            method: remixButton.getAttribute('data-disabled') === 'false' ? 'primary' : 'fallback',
                            disabled: remixButton.disabled,
                            dataDisabled: remixButton.getAttribute('data-disabled'),
                            text: remixButton.textContent.trim()
                        };
                    }
                    
                    return null;
                    
                } catch (error) {
                    log(`${logPrefix} Error searching for button: ${error.message} (context: ${context})`, 'error');
                    return null;
                }
            };
            
            // Try finding the button immediately
            const result = searchForButton();
            if (result) {
                resolve(result);
                return;
            }
            
            // If not found, set up polling with timeout
            const pollInterval = 500;
            const maxAttempts = Math.ceil(timeout / pollInterval);
            let attempts = 0;
            
            const pollForButton = () => {
                attempts++;
                const elapsed = Date.now() - startTime;
                
                if (elapsed >= timeout) {
                    log(`${logPrefix} Timeout after ${elapsed}ms, ${attempts} attempts (context: ${context})`, 'error');
                    resolve({ button: null, isValid: false, reason: 'timeout', attempts, elapsed });
                    return;
                }
                
                const result = searchForButton();
                if (result) {
                    log(`${logPrefix} Found button after ${elapsed}ms, ${attempts} attempts (context: ${context})`, 'success');
                    resolve(result);
                } else {
                    setTimeout(pollForButton, pollInterval);
                }
            };
            
            log(`${logPrefix} Button not immediately available, starting polling (context: ${context})`, 'info');
            setTimeout(pollForButton, pollInterval);
        });
    }

    async function validateDOMElementState(element, elementType, context = 'unknown') {
        const logPrefix = `[DOM-Validate]`;
        
        try {
            if (!element) {
                log(`${logPrefix} ${elementType} element is null (context: ${context})`, 'error');
                return { isValid: false, reason: 'null_element' };
            }
            
            // Check if element is still in the DOM
            if (!document.contains(element)) {
                log(`${logPrefix} ${elementType} element no longer in DOM (context: ${context})`, 'warn');
                return { isValid: false, reason: 'not_in_dom' };
            }
            
            // Check visibility
            if (element.offsetParent === null) {
                log(`${logPrefix} ${elementType} element not visible (context: ${context})`, 'warn');
                return { isValid: false, reason: 'not_visible' };
            }
            
            // Type-specific validation
            if (elementType === 'textarea') {
                if (element.disabled || element.readOnly) {
                    log(`${logPrefix} Textarea is disabled/readonly (context: ${context})`, 'warn');
                    return { isValid: false, reason: 'not_interactive' };
                }
            } else if (elementType === 'button') {
                if (element.disabled) {
                    log(`${logPrefix} Button is disabled (context: ${context})`, 'warn');
                    return { isValid: false, reason: 'disabled' };
                }
            }
            
            log(`${logPrefix} ${elementType} element validation passed (context: ${context})`, 'success');
            return { isValid: true };
            
        } catch (error) {
            log(`${logPrefix} Error validating ${elementType}: ${error.message} (context: ${context})`, 'error');
            return { isValid: false, reason: 'validation_error', error: error.message };
        }
    }

    // NEW: Comprehensive error handling and recovery system
    const ERROR_CATEGORIES = {
        RECOVERABLE: 'recoverable',
        FATAL: 'fatal',
        RETRY: 'retry',
        CIRCUIT_BREAKER: 'circuit_breaker'
    };

    const ERROR_TYPES = {
        // Recoverable errors (can be retried with workspace cleanup)
        WORKSPACE_CONTAMINATION: { category: ERROR_CATEGORIES.RECOVERABLE, maxRetries: 2, retryDelay: 2000 },
        DOM_ELEMENT_NOT_FOUND: { category: ERROR_CATEGORIES.RECOVERABLE, maxRetries: 3, retryDelay: 1000 },
        IMAGE_PASTE_FAILED: { category: ERROR_CATEGORIES.RECOVERABLE, maxRetries: 2, retryDelay: 1500 },
        INTERFACE_NOT_READY: { category: ERROR_CATEGORIES.RECOVERABLE, maxRetries: 3, retryDelay: 2000 },
        
        // Retry with delay (temporary SORA issues)
        POLICY_VIOLATION: { category: ERROR_CATEGORIES.RETRY, maxRetries: 2, retryDelay: 30000 },
        GENERATION_TIMEOUT: { category: ERROR_CATEGORIES.RETRY, maxRetries: 1, retryDelay: 10000 },
        NETWORK_ERROR: { category: ERROR_CATEGORIES.RETRY, maxRetries: 3, retryDelay: 5000 },
        
        // Circuit breaker patterns (repeated failures)
        REPEATED_DOM_FAILURES: { category: ERROR_CATEGORIES.CIRCUIT_BREAKER, threshold: 3, cooldown: 60000 },
        REPEATED_PASTE_FAILURES: { category: ERROR_CATEGORIES.CIRCUIT_BREAKER, threshold: 3, cooldown: 30000 },
        
        // Fatal errors (cannot be recovered)
        INVALID_FILE_DATA: { category: ERROR_CATEGORIES.FATAL, maxRetries: 0, retryDelay: 0 },
        SORA_INTERFACE_BROKEN: { category: ERROR_CATEGORIES.FATAL, maxRetries: 0, retryDelay: 0 },
        CRITICAL_SYSTEM_ERROR: { category: ERROR_CATEGORIES.FATAL, maxRetries: 0, retryDelay: 0 }
    };

    function categorizeError(error, context = 'unknown') {
        const logPrefix = `[Error-Categorize]`;
        
        try {
            const errorMessage = error.message || error.toString();
            const errorStack = error.stack || '';
            
            log(`${logPrefix} Categorizing error: "${errorMessage}" (context: ${context})`, 'debug');
            
            // Pattern matching for different error types
            if (errorMessage.includes('Workspace validation failed') || 
                errorMessage.includes('CONTAMINATION DETECTED')) {
                return { type: 'WORKSPACE_CONTAMINATION', ...ERROR_TYPES.WORKSPACE_CONTAMINATION };
            }
            
            if (errorMessage.includes('not found') || errorMessage.includes('not available') ||
                errorMessage.includes('DOM may have changed')) {
                return { type: 'DOM_ELEMENT_NOT_FOUND', ...ERROR_TYPES.DOM_ELEMENT_NOT_FOUND };
            }
            
            if (errorMessage.includes('Failed to paste') || errorMessage.includes('synthetic paste')) {
                return { type: 'IMAGE_PASTE_FAILED', ...ERROR_TYPES.IMAGE_PASTE_FAILED };
            }
            
            if (errorMessage.includes('PolicyViolation')) {
                return { type: 'POLICY_VIOLATION', ...ERROR_TYPES.POLICY_VIOLATION };
            }
            
            if (errorMessage.includes('timeout') || errorMessage.includes('timed out')) {
                return { type: 'GENERATION_TIMEOUT', ...ERROR_TYPES.GENERATION_TIMEOUT };
            }
            
            if (errorMessage.includes('Interface not ready') || errorMessage.includes('not ready')) {
                return { type: 'INTERFACE_NOT_READY', ...ERROR_TYPES.INTERFACE_NOT_READY };
            }
            
            if (errorMessage.includes('network') || errorMessage.includes('fetch') ||
                errorMessage.includes('connection')) {
                return { type: 'NETWORK_ERROR', ...ERROR_TYPES.NETWORK_ERROR };
            }
            
            if (errorMessage.includes('Invalid file') || errorMessage.includes('file data')) {
                return { type: 'INVALID_FILE_DATA', ...ERROR_TYPES.INVALID_FILE_DATA };
            }
            
            // Check for critical system errors
            if (errorStack.includes('ReferenceError') || errorStack.includes('TypeError') ||
                errorMessage.includes('Critical') || errorMessage.includes('FATAL')) {
                return { type: 'CRITICAL_SYSTEM_ERROR', ...ERROR_TYPES.CRITICAL_SYSTEM_ERROR };
            }
            
            // Default to recoverable for unknown errors
            log(`${logPrefix} Unknown error pattern, defaulting to recoverable (context: ${context})`, 'warn');
            return { type: 'UNKNOWN_RECOVERABLE', category: ERROR_CATEGORIES.RECOVERABLE, maxRetries: 1, retryDelay: 2000 };
            
        } catch (categorizationError) {
            log(`${logPrefix} Error during categorization: ${categorizationError.message} (context: ${context})`, 'error');
            return { type: 'CATEGORIZATION_FAILED', category: ERROR_CATEGORIES.FATAL, maxRetries: 0, retryDelay: 0 };
        }
    }

    async function handleErrorWithRecovery(pairId, error, context = 'unknown') {
        const logPrefix = `[Recovery-${pairId}]`;
        
        try {
            log(`${logPrefix} Handling error with recovery (context: ${context})`, 'info');
            operationMetrics.recoveryAttempts++;
            
            // Categorize the error
            const errorCategory = categorizeError(error, context);
            log(`${logPrefix} Error categorized as: ${errorCategory.type} (${errorCategory.category})`, 'info');
            
            // Get or create recovery tracking for this pair
            if (!errorRecoveryAttempts.has(pairId)) {
                errorRecoveryAttempts.set(pairId, {
                    pairId,
                    totalAttempts: 0,
                    errorHistory: [],
                    lastAttemptTime: 0,
                    recoveryStrategies: new Set()
                });
            }
            
            const recoveryData = errorRecoveryAttempts.get(pairId);
            recoveryData.totalAttempts++;
            recoveryData.errorHistory.push({
                timestamp: Date.now(),
                error: error.message,
                type: errorCategory.type,
                category: errorCategory.category,
                context
            });
            recoveryData.lastAttemptTime = Date.now();
            
            // Check circuit breaker conditions
            const circuitBreakerResult = checkCircuitBreaker(pairId, errorCategory, context);
            if (circuitBreakerResult.shouldTrip) {
                log(`${logPrefix} Circuit breaker tripped: ${circuitBreakerResult.reason}`, 'error');
                operationMetrics.circuitBreakerTrips++;
                return {
                    shouldRetry: false,
                    action: 'circuit_breaker_tripped',
                    reason: circuitBreakerResult.reason,
                    cooldownTime: circuitBreakerResult.cooldownTime
                };
            }
            
            // Handle based on error category
            switch (errorCategory.category) {
                case ERROR_CATEGORIES.FATAL:
                    log(`${logPrefix} Fatal error, no recovery possible`, 'error');
                    return {
                        shouldRetry: false,
                        action: 'fatal_error',
                        errorType: errorCategory.type
                    };
                    
                case ERROR_CATEGORIES.RECOVERABLE:
                    return await handleRecoverableError(pairId, errorCategory, recoveryData, context);
                    
                case ERROR_CATEGORIES.RETRY:
                    return await handleRetryableError(pairId, errorCategory, recoveryData, context);
                    
                case ERROR_CATEGORIES.CIRCUIT_BREAKER:
                    return await handleCircuitBreakerError(pairId, errorCategory, recoveryData, context);
                    
                default:
                    log(`${logPrefix} Unknown error category: ${errorCategory.category}`, 'error');
                    return {
                        shouldRetry: false,
                        action: 'unknown_category',
                        errorType: errorCategory.type
                    };
            }
            
        } catch (recoveryError) {
            log(`${logPrefix} Error during recovery handling: ${recoveryError.message}`, 'error');
            return {
                shouldRetry: false,
                action: 'recovery_failed',
                error: recoveryError.message
            };
        }
    }

    async function handleRecoverableError(pairId, errorCategory, recoveryData, context) {
        const logPrefix = `[Recovery-${pairId}]`;
        
        // Check retry limits
        if (recoveryData.totalAttempts > errorCategory.maxRetries) {
            log(`${logPrefix} Max recovery attempts exceeded (${recoveryData.totalAttempts}/${errorCategory.maxRetries})`, 'error');
            return {
                shouldRetry: false,
                action: 'max_recoveries_exceeded',
                totalAttempts: recoveryData.totalAttempts
            };
        }
        
        log(`${logPrefix} Attempting recovery for ${errorCategory.type} (attempt ${recoveryData.totalAttempts}/${errorCategory.maxRetries})`, 'info');
        
        // Apply recovery strategies
        const recoveryStrategies = [];
        
        // Strategy 1: Workspace cleanup (always for recoverable errors)
        if (!recoveryData.recoveryStrategies.has('workspace_cleanup')) {
            recoveryStrategies.push('workspace_cleanup');
            recoveryData.recoveryStrategies.add('workspace_cleanup');
        }
        
        // Strategy 2: DOM refresh (for DOM-related errors)
        if (errorCategory.type.includes('DOM') && !recoveryData.recoveryStrategies.has('dom_refresh')) {
            recoveryStrategies.push('dom_refresh');
            recoveryData.recoveryStrategies.add('dom_refresh');
        }
        
        // Strategy 3: Interface state reset (for interface errors)
        if (errorCategory.type.includes('INTERFACE') && !recoveryData.recoveryStrategies.has('interface_reset')) {
            recoveryStrategies.push('interface_reset');
            recoveryData.recoveryStrategies.add('interface_reset');
        }
        
        // Execute recovery strategies
        for (const strategy of recoveryStrategies) {
            try {
                await executeRecoveryStrategy(pairId, strategy, context);
                log(`${logPrefix} Recovery strategy '${strategy}' executed successfully`, 'success');
            } catch (strategyError) {
                log(`${logPrefix} Recovery strategy '${strategy}' failed: ${strategyError.message}`, 'warn');
            }
        }
        
        // Wait before retry
        if (errorCategory.retryDelay > 0) {
            log(`${logPrefix} Waiting ${errorCategory.retryDelay}ms before retry`, 'info');
            await new Promise(resolve => setTimeout(resolve, errorCategory.retryDelay));
        }
        
        return {
            shouldRetry: true,
            action: 'recovery_applied',
            strategies: recoveryStrategies,
            retryDelay: errorCategory.retryDelay,
            attempt: recoveryData.totalAttempts
        };
    }

    async function handleRetryableError(pairId, errorCategory, recoveryData, context) {
        const logPrefix = `[Retry-${pairId}]`;
        
        // Check retry limits
        if (recoveryData.totalAttempts > errorCategory.maxRetries) {
            log(`${logPrefix} Max retry attempts exceeded (${recoveryData.totalAttempts}/${errorCategory.maxRetries})`, 'error');
            return {
                shouldRetry: false,
                action: 'max_retries_exceeded',
                totalAttempts: recoveryData.totalAttempts
            };
        }
        
        log(`${logPrefix} Scheduling retry for ${errorCategory.type} (attempt ${recoveryData.totalAttempts}/${errorCategory.maxRetries})`, 'info');
        
        // For retryable errors, just wait and try again
        if (errorCategory.retryDelay > 0) {
            log(`${logPrefix} Waiting ${Math.round(errorCategory.retryDelay/1000)}s before retry`, 'info');
            await new Promise(resolve => setTimeout(resolve, errorCategory.retryDelay));
        }
        
        return {
            shouldRetry: true,
            action: 'scheduled_retry',
            retryDelay: errorCategory.retryDelay,
            attempt: recoveryData.totalAttempts
        };
    }

    async function handleCircuitBreakerError(pairId, errorCategory, recoveryData, context) {
        const logPrefix = `[CircuitBreaker-${pairId}]`;
        
        log(`${logPrefix} Circuit breaker error detected: ${errorCategory.type}`, 'warn');
        
        // This will be handled by the circuit breaker check
        return {
            shouldRetry: false,
            action: 'circuit_breaker_evaluation',
            errorType: errorCategory.type
        };
    }

    function checkCircuitBreaker(pairId, errorCategory, context) {
        const logPrefix = `[CircuitBreaker]`;
        
        if (errorCategory.category !== ERROR_CATEGORIES.CIRCUIT_BREAKER) {
            return { shouldTrip: false };
        }
        
        const breakerKey = errorCategory.type;
        
        if (!circuitBreakerStates.has(breakerKey)) {
            circuitBreakerStates.set(breakerKey, {
                failureCount: 0,
                lastFailureTime: 0,
                state: 'CLOSED', // CLOSED = normal, OPEN = tripped, HALF_OPEN = testing
                cooldownUntil: 0
            });
        }
        
        const breaker = circuitBreakerStates.get(breakerKey);
        const now = Date.now();
        
        // Check if we're in cooldown period
        if (breaker.state === 'OPEN' && now < breaker.cooldownUntil) {
            return {
                shouldTrip: true,
                reason: `Circuit breaker OPEN for ${breakerKey}, cooldown until ${new Date(breaker.cooldownUntil).toLocaleTimeString()}`,
                cooldownTime: breaker.cooldownUntil - now
            };
        }
        
        // Reset if cooldown period has passed
        if (breaker.state === 'OPEN' && now >= breaker.cooldownUntil) {
            breaker.state = 'HALF_OPEN';
            breaker.failureCount = 0;
            log(`${logPrefix} Circuit breaker ${breakerKey} entering HALF_OPEN state`, 'info');
        }
        
        // Increment failure count
        breaker.failureCount++;
        breaker.lastFailureTime = now;
        
        // Check if we should trip the breaker
        if (breaker.failureCount >= errorCategory.threshold) {
            breaker.state = 'OPEN';
            breaker.cooldownUntil = now + errorCategory.cooldown;
            
            log(`${logPrefix} Circuit breaker TRIPPED for ${breakerKey} (${breaker.failureCount} failures)`, 'error');
            
            return {
                shouldTrip: true,
                reason: `Circuit breaker tripped after ${breaker.failureCount} failures of type ${breakerKey}`,
                cooldownTime: errorCategory.cooldown
            };
        }
        
        return { shouldTrip: false };
    }

    async function executeRecoveryStrategy(pairId, strategy, context) {
        const logPrefix = `[Strategy-${pairId}]`;
        
        switch (strategy) {
            case 'workspace_cleanup':
                log(`${logPrefix} Executing workspace cleanup strategy`, 'info');
                await ensureCleanWorkspace(`recovery_${pairId}_cleanup`, true);
                break;
                
            case 'dom_refresh':
                log(`${logPrefix} Executing DOM refresh strategy`, 'info');
                // Clear cached DOM references
                soraChatInput = null;
                soraSendButton = null;
                // Wait for DOM to settle
                await new Promise(resolve => setTimeout(resolve, 1000));
                break;
                
            case 'interface_reset':
                log(`${logPrefix} Executing interface reset strategy`, 'info');
                // Reset interface state tracking
                lastWorkspaceCleanTime = 0;
                currentPairFiles = { model: null, outfit: null };
                // Wait for interface to stabilize
                await new Promise(resolve => setTimeout(resolve, 2000));
                break;
                
            default:
                throw new Error(`Unknown recovery strategy: ${strategy}`);
        }
    }

    function cleanupErrorRecoveryTracking(pairId, context = 'unknown') {
        try {
            if (errorRecoveryAttempts.has(pairId)) {
                errorRecoveryAttempts.delete(pairId);
                log(`[Recovery] Cleaned up error tracking for pair ${pairId} (context: ${context})`, 'debug');
            }
        } catch (error) {
            log(`[Recovery] Error cleaning up tracking for pair ${pairId}: ${error.message}`, 'warn');
        }
    }

    // ENHANCED: Operation metrics with set-level tracking
    function getOperationMetrics() {
        const runtime = Date.now() - operationMetrics.startTime;
        const successRate = operationMetrics.pairsAttempted > 0 ? 
            (operationMetrics.pairsSucceeded / operationMetrics.pairsAttempted * 100).toFixed(1) : 0;
        
        // Generate set-level metrics if ProductSets are in use
        const setMetrics = productSets.length > 0 ? generateSetLevelMetrics() : {};
        const comparative = productSets.length > 0 ? getComparativeSetMetrics() : null;
            
        return {
            ...operationMetrics,
            runtime,
            successRate: parseFloat(successRate),
            activeCircuitBreakers: Array.from(circuitBreakerStates.entries())
                .filter(([key, state]) => state.state === 'OPEN')
                .map(([key, state]) => ({ type: key, cooldownUntil: state.cooldownUntil })),
            setMetrics, // NEW: Per-set detailed metrics
            comparativeMetrics: comparative, // NEW: Cross-set performance analysis
            setsCount: productSets.length
        };
    }

    // NEW: Generate detailed metrics for each ProductSet
    function generateSetLevelMetrics() {
        const setMetrics = {};
        
        productSets.forEach(set => {
            const metrics = calculateProductSetMetrics(set);
            setMetrics[set.id] = {
                ...metrics,
                setName: set.name,
                setId: set.id
            };
        });
        
        return setMetrics;
    }

    // NEW: Calculate comprehensive metrics for a single ProductSet
    function calculateProductSetMetrics(productSet) {
        const now = Date.now();
        const progress = productSet.progress;
        
        // Basic progress metrics
        const totalPairs = progress.total;
        const completedPairs = progress.completed;
        const failedPairs = progress.failed;
        const pendingPairs = progress.pending;
        const processingPairs = progress.processing;
        
        // Success rate calculation
        const attemptedPairs = completedPairs + failedPairs;
        const successRate = attemptedPairs > 0 ? Math.round((completedPairs / attemptedPairs) * 100) : 0;
        
        // Timing metrics
        const startTime = productSet.metadata.processingStartTime;
        const endTime = productSet.metadata.processingEndTime;
        const currentRuntime = startTime ? (endTime || now) - startTime : 0;
        const averageTimePerPair = completedPairs > 0 ? currentRuntime / completedPairs : 0;
        const estimatedTimeRemaining = pendingPairs > 0 && averageTimePerPair > 0 ? 
            pendingPairs * averageTimePerPair : 0;
        
        // Error analysis
        const errorRate = attemptedPairs > 0 ? Math.round((failedPairs / attemptedPairs) * 100) : 0;
        const errorCount = productSet.errorInfo.errorCount;
        const lastError = productSet.errorInfo.lastError;
        
        // Performance metrics
        const pairsPerMinute = currentRuntime > 0 ? Math.round((completedPairs / (currentRuntime / 60000)) * 10) / 10 : 0;
        
        // Status-based analysis
        const statusBreakdown = {
            pending: pendingPairs,
            processing: processingPairs,
            completed: completedPairs,
            failed: failedPairs
        };
        
        // File size analysis (if available)
        let totalModelSize = 0;
        let totalOutfitSize = 0;
        
        if (productSet.modelFile) {
            totalModelSize = productSet.modelFile.size || 0;
        }
        
        if (productSet.outfitFiles && Array.isArray(productSet.outfitFiles)) {
            totalOutfitSize = productSet.outfitFiles.reduce((sum, file) => sum + (file.size || 0), 0);
        }
        
        const averageOutfitSize = productSet.outfitFiles?.length > 0 ? 
            totalOutfitSize / productSet.outfitFiles.length : 0;
        
        return {
            // Progress metrics
            totalPairs,
            completedPairs,
            failedPairs,
            pendingPairs,
            processingPairs,
            attemptedPairs,
            successRate,
            errorRate,
            
            // Timing metrics
            currentRuntime,
            averageTimePerPair,
            estimatedTimeRemaining,
            pairsPerMinute,
            
            // Status and error info
            status: productSet.status,
            statusBreakdown,
            errorCount,
            lastError,
            
            // File metrics
            totalModelSize,
            totalOutfitSize,
            averageOutfitSize,
            
            // Timestamps
            createdAt: productSet.metadata.createdAt,
            lastModified: productSet.metadata.lastModified,
            processingStartTime: productSet.metadata.processingStartTime,
            processingEndTime: productSet.metadata.processingEndTime
        };
    }

    // NEW: Get metrics for a specific ProductSet
    function getProductSetMetrics(setId) {
        const productSet = findProductSetById(setId);
        if (!productSet) {
            log(`[Metrics] ProductSet ${setId} not found`, 'error');
            return null;
        }
        
        return calculateProductSetMetrics(productSet);
    }

    // NEW: Get comparative metrics across all sets
    function getComparativeSetMetrics() {
        if (productSets.length === 0) {
            return null;
        }
        
        const allMetrics = productSets.map(set => calculateProductSetMetrics(set));
        
        // Calculate aggregate statistics
        const totalSets = allMetrics.length;
        const completedSets = allMetrics.filter(m => m.status === 'completed').length;
        const errorSets = allMetrics.filter(m => m.status === 'error').length;
        const processingSets = allMetrics.filter(m => m.status === 'processing').length;
        
        // Performance comparisons
        const avgSuccessRate = allMetrics.length > 0 ? 
            allMetrics.reduce((sum, m) => sum + m.successRate, 0) / totalSets : 0;
        const avgPairsPerMinute = allMetrics.length > 0 ? 
            allMetrics.reduce((sum, m) => sum + m.pairsPerMinute, 0) / totalSets : 0;
        const avgTimePerPair = allMetrics.length > 0 ? 
            allMetrics.reduce((sum, m) => sum + m.averageTimePerPair, 0) / totalSets : 0;
        
        // Find best and worst performing sets (avoid errors if array is empty)
        let bestPerformingSet = null;
        let worstPerformingSet = null;
        let fastestSet = null;
        let slowestSet = null;
        
        if (allMetrics.length > 0) {
            bestPerformingSet = allMetrics.reduce((best, current) => 
                current.successRate > best.successRate ? current : best);
            worstPerformingSet = allMetrics.reduce((worst, current) => 
                current.successRate < worst.successRate ? current : worst);
            fastestSet = allMetrics.reduce((fastest, current) => 
                current.pairsPerMinute > fastest.pairsPerMinute ? current : fastest);
            slowestSet = allMetrics.reduce((slowest, current) => 
                current.pairsPerMinute < slowest.pairsPerMinute ? current : slowest);
        }
        
        return {
            totalSets,
            completedSets,
            errorSets,
            processingSets,
            avgSuccessRate: Math.round(avgSuccessRate),
            avgPairsPerMinute: Math.round(avgPairsPerMinute * 10) / 10,
            avgTimePerPair: Math.round(avgTimePerPair),
            bestPerformingSet: bestPerformingSet ? {
                setId: bestPerformingSet.setId,
                setName: productSets.find(s => s.id === bestPerformingSet.setId)?.name,
                successRate: bestPerformingSet.successRate
            } : null,
            worstPerformingSet: worstPerformingSet ? {
                setId: worstPerformingSet.setId,
                setName: productSets.find(s => s.id === worstPerformingSet.setId)?.name,
                successRate: worstPerformingSet.successRate
            } : null,
            fastestSet: fastestSet ? {
                setId: fastestSet.setId,
                setName: productSets.find(s => s.id === fastestSet.setId)?.name,
                pairsPerMinute: fastestSet.pairsPerMinute
            } : null,
            slowestSet: slowestSet ? {
                setId: slowestSet.setId,
                setName: productSets.find(s => s.id === slowestSet.setId)?.name,
                pairsPerMinute: slowestSet.pairsPerMinute
            } : null
        };
    }

    // NEW: Log comprehensive metrics summary
    function logMetricsSummary(context = 'metrics_summary') {
        const metrics = getOperationMetrics();
        const comparative = metrics.comparativeMetrics;
        
        log(`[Metrics] === PERFORMANCE SUMMARY (${context}) ===`, 'info');
        log(`[Metrics] Overall: ${metrics.pairsSucceeded}/${metrics.pairsAttempted} pairs completed (${metrics.successRate}%)`, 'info');
        log(`[Metrics] Runtime: ${Math.round(metrics.runtime / 60000)}m ${Math.round((metrics.runtime % 60000) / 1000)}s`, 'info');
        log(`[Metrics] Recovery attempts: ${metrics.recoveryAttempts || 0}`, 'info');
        
        if (comparative) {
            log(`[Metrics] Sets: ${comparative.completedSets}/${comparative.totalSets} completed`, 'info');
            log(`[Metrics] Average success rate: ${comparative.avgSuccessRate}%`, 'info');
            log(`[Metrics] Average speed: ${comparative.avgPairsPerMinute} pairs/min`, 'info');
            
            if (comparative.bestPerformingSet) {
                log(`[Metrics] Best performing: ${comparative.bestPerformingSet.setName} (${comparative.bestPerformingSet.successRate}%)`, 'info');
            }
            if (comparative.fastestSet) {
                log(`[Metrics] Fastest: ${comparative.fastestSet.setName} (${comparative.fastestSet.pairsPerMinute} pairs/min)`, 'info');
            }
        }
        
        log(`[Metrics] === END SUMMARY ===`, 'info');
    }

    // Function to play completion sound
    function playCompletionSound() {
        try {
            // Create audio context for a pleasant completion sound
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();

            // Create a pleasant two-tone chime sound
            const playTone = (frequency, startTime, duration) => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);

                oscillator.frequency.setValueAtTime(frequency, startTime);
                oscillator.type = 'sine';

                gainNode.gain.setValueAtTime(0, startTime);
                gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.01);
                gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

                oscillator.start(startTime);
                oscillator.stop(startTime + duration);
            };

            const now = audioContext.currentTime;
            playTone(800, now, 0.3); // First tone (higher pitch)
            playTone(600, now + 0.15, 0.4); // Second tone (lower pitch, overlapping)

            log('🔊 Completion sound played', 'success');
        } catch (error) {
            log(`Could not play completion sound: ${error.message}`, 'warn');
            // Fallback: try to use a simple beep
            try {
                const utterance = new SpeechSynthesisUtterance('');
                utterance.volume = 0.1;
                utterance.rate = 10;
                utterance.pitch = 2;
                speechSynthesis.speak(utterance);
            } catch (fallbackError) {
                log('Audio notification not available in this browser', 'info');
            }
        }
    }

    // Function to check if SORA's interface is ready to accept new images
    function isSoraInterfaceReady() {
        try {
            // Check if there's a textarea available and it's not disabled
            const textarea = document.querySelector('textarea[placeholder*="image"]') ||
                           document.querySelector('textarea[placeholder="Describe your image..."]') ||
                           document.querySelector('textarea[placeholder="Describe a new image..."]');

            if (!textarea) {
                log('SORA interface not ready: No textarea found', 'debug');
                return false;
            }

            if (textarea.disabled || textarea.readOnly) {
                log('SORA interface not ready: Textarea is disabled or readonly', 'debug');
                return false;
            }

            // Check if there are any blocking overlays or loading states
            const loadingOverlays = document.querySelectorAll('[class*="loading"], [class*="spinner"], [class*="overlay"]');
            for (const overlay of loadingOverlays) {
                if (overlay.offsetParent !== null) { // Element is visible
                    log('SORA interface not ready: Loading overlay detected', 'debug');
                    return false;
                }
            }

            // Check if the image upload area is accessible
            const composerArea = document.querySelector('.relative.rounded-\\[24px\\].p-2.max-tablet\\:flex');
            if (!composerArea) {
                log('SORA interface not ready: Composer area not found', 'debug');
                return false;
            }

            log('SORA interface appears ready for new images', 'debug');
            return true;

        } catch (error) {
            log(`Error checking SORA interface readiness: ${error.message}`, 'warn');
            return false; // Default to not ready on error
        }
    }

    // Function to check SORA's UI for actual active generation count
    function getActualActiveGenerationsFromUI() {
        try {
            let activeCount = 0;

            // STRATEGY 1: Check for the explicit "You can only generate X images at a time" popup FIRST
            // This popup indicates SORA is at its hard limit and is the most reliable indicator.
            const limitPopup = Array.from(document.querySelectorAll('div.surface-popover[data-state="instant-open"]')).find(popup =>
                popup.textContent.includes('You can only generate') && popup.textContent.includes('images or videos at a time')
            );

            if (limitPopup) {
                log(`Detected SORA generation limit popup. Forcing count to MAX_CONCURRENT_GENERATIONS (${MAX_CONCURRENT_GENERATIONS}) to enforce waiting.`, 'warn');
                // If the popup is there, it means we cannot start more generations.
                // We return MAX_CONCURRENT_GENERATIONS to force the gatekeeper to wait.
                return MAX_CONCURRENT_GENERATIONS;
            }

            // STRATEGY 2: Multiple approaches to count active generations
            // Approach A: Look for progress circles with stroke-dashoffset (animated progress)
            const animatedCircles = document.querySelectorAll('circle[stroke-dashoffset]');
            for (const circle of animatedCircles) {
                // Check if this circle is part of a generation progress indicator
                const container = circle.closest('div');
                if (container) {
                    // Look for percentage text near this circle
                    const percentageElements = container.querySelectorAll('*');
                    for (const elem of percentageElements) {
                        if (elem.textContent && elem.textContent.includes('%') && elem.textContent.match(/\d+%/)) {
                            activeCount++;
                            log(`Found active generation (progress circle with: ${elem.textContent.trim()})`, 'debug');
                            break; // Only count this circle once
                        }
                    }
                }
            }

            // Approach B: Look for percentage text directly (fallback)
            if (activeCount === 0) {
                const percentageTexts = Array.from(document.querySelectorAll('*')).filter(elem => {
                    return elem.textContent && elem.textContent.match(/^\d+%$/) && elem.offsetParent !== null;
                });

                for (const percentText of percentageTexts) {
                    // Verify this is likely a generation progress by checking for nearby progress indicators
                    const nearbyCircle = percentText.closest('div')?.querySelector('circle[stroke-dashoffset]');
                    if (nearbyCircle) {
                        activeCount++;
                        log(`Found active generation (percentage text: ${percentText.textContent.trim()})`, 'debug');
                    }
                }
            }

            // **FIXED**: Removed the problematic safety check that caused the deadlock.
            // The UI detection is now the primary source of truth for the gatekeeper. The internal
            // 'activeGenerations' counter will sync asynchronously but is not used to override the UI check here,
            // preventing the race condition.

            log(`SORA UI shows ${activeCount} active generations (internal: ${activeGenerations})`, 'debug');
            return activeCount;

        } catch (error) {
            log(`Error checking SORA UI for active generations: ${error.message}, falling back to internal counter (${activeGenerations})`, 'warn');
            return activeGenerations; // Fall back to internal counter instead of 0
        }
    }

    // --- UI Elements ---
    let mainPanel, pairsContainer, batchGenerateBtn, pauseBtn, stopBtn, addPairBtn, logToggleButton, logView, promptTextarea, promptResetButton, promptToggleButton, promptCharCountLabel, promptSectionContainer;

    // --- STYLES ---
    GM_addStyle(`
        #sora-helper-panel {
            position: fixed;
            top: 60px;
            right: 10px;
            width: 380px; /* Slightly wider for log toggle */
            max-height: 85vh;
            background-color: #2d2d2d;
            border: 1px solid #444;
            border-radius: 8px;
            z-index: 10000;
            color: #f0f0f0;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            display: flex;
            flex-direction: column;
            font-family: sans-serif; /* Basic font */
        }
        #sora-helper-panel h3 {
            margin: 0;
            padding: 10px 12px;
            background-color: #353535;
            border-bottom: 1px solid #444;
            text-align: center;
            font-size: 16px;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        #sora-log-toggle-btn {
            background: none; border: 1px solid #555; color: #ccc; padding: 3px 6px;
            font-size: 11px; border-radius: 4px; cursor: pointer;
        }
        #sora-log-toggle-btn:hover { background-color: #454545; }

        #sora-clear-all-btn {
            background: none; border: 1px solid #555; color: #ccc; padding: 3px 6px;
            font-size: 11px; border-radius: 4px; cursor: pointer; margin-left: 5px;
        }
        #sora-clear-all-btn:hover { background-color: #454545; }

        #sora-minimize-btn {
            background: none; border: 1px solid #555; color: #ccc; padding: 3px 8px;
            font-size: 11px; border-radius: 4px; cursor: pointer; margin-left: 5px;
        }
        #sora-minimize-btn:hover { background-color: #454545; }

        #sora-floating-btn {
            position: fixed;
            top: 50%;
            right: 20px;
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #4a90e2, #357abd);
            border: 3px solid #2c5282;
            border-radius: 50%;
            display: none;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            z-index: 10001;
            font-family: sans-serif;
            font-weight: bold;
            font-size: 14px;
            color: white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2);
            transition: transform 0.2s, box-shadow 0.2s;
            user-select: none;
        }
        #sora-floating-btn:hover {
            transform: scale(1.05);
            box-shadow: 0 6px 16px rgba(0,0,0,0.4), 0 3px 6px rgba(0,0,0,0.3);
        }
        #sora-floating-btn:active {
            transform: scale(0.95);
        }

        #sora-log-view {
            display: none; /* Hidden by default */
            height: 100px;
            background-color: #222;
            border-top: 1px solid #444;
            padding: 8px;
            overflow-y: scroll;
            font-size: 10px;
            color: #bbb;
            line-height: 1.4;
            flex-shrink: 0; /* Prevent shrinking when pairs container grows */
            position: relative; /* For positioning the copy button */
        }

        #sora-helper-custom-modal {
            /* Placed at the bottom of the panel for now */
            background-color: rgba(45, 45, 45, 0.97); /* Darker, slightly transparent */
            padding: 15px;
            border-top: 1px solid #555;
            text-align: center;
            /* Initially hidden, shown when needed */
            /* Could also be positioned absolutely to overlay the panel */
        }
        #sora-helper-modal-content p {
            margin-bottom: 15px;
            font-size: 13px;
            color: #eee;
            line-height: 1.5;
        }
        #sora-helper-modal-buttons button {
            padding: 8px 15px;
            margin: 0 10px;
            border-radius: 5px;
            border: none;
            cursor: pointer;
            font-weight: bold;
        }
        #sora-helper-modal-ok-btn { background-color: #5cb85c; color: white; }
        #sora-helper-modal-cancel-btn { background-color: #d9534f; color: white; }
        #sora-log-view div { margin-bottom: 3px; }
        #sora-pairs-container {
            overflow-y: auto;
            padding: 10px;
            flex-grow: 1;
        }
        .sora-helper-pair {
            background-color: #3a3a3a;
            padding: 10px;
            margin-bottom: 10px;
            border-radius: 6px;
            border: 1px solid #505050;
            position: relative; /* For absolute positioning of remove button */
        }
        .sora-helper-pair p { margin: 0 0 5px 0; font-size: 13px; font-weight: bold; }
        .sora-helper-pair input[type="file"] {
            width: calc(100% - 12px); /* Adjust for padding */
            margin-bottom: 8px;
            font-size: 12px;
            padding: 5px;
            background-color: #454545;
            border: 1px solid #555;
            border-radius: 4px;
            color: #ddd;
        }
        .sora-helper-pair input[type="file"]:disabled {
            background-color: #2a2a2a;
            border-color: #3a3a3a;
            cursor: not-allowed;
        }
        .sora-helper-pair .model-preloaded-indicator {
            font-size: 10px;
            color: #5cb85c;
            margin-top: 2px;
            margin-bottom: 6px;
            font-style: italic;
            display: flex;
            align-items: center;
            gap: 4px;
        }
        .sora-helper-pair .model-preloaded-indicator::before {
            content: '✓';
            font-weight: bold;
            color: #5cb85c;
        }
        .sora-helper-pair.pair-complete {
            border: 2px solid #5cb85c;
            background-color: #3a4a3a;
            box-shadow: 0 0 8px rgba(92, 184, 92, 0.3);
        }
        .sora-helper-pair.pair-incomplete {
            border: 2px solid #777;
            background-color: #3a3a3a;
        }
        .sora-helper-pair.pair-complete .status {
            color: #5cb85c;
            font-weight: bold;
        }
        .sora-helper-pair button.remove-pair-btn {
            position: absolute;
            top: 8px;
            right: 8px;
            background-color: #c94c4c;
            color: white; border: none; padding: 3px 7px; font-size: 11px;
            border-radius: 4px; cursor: pointer;
        }
        .sora-helper-pair button.remove-pair-btn:hover { background-color: #af3a3a; }
        .sora-helper-pair .status {
            font-size: 11px; font-style: italic; color: #aaa;
            text-align: right; margin-top: 5px;
        }
        #sora-helper-controls-wrapper {
            padding: 0 10px 10px 10px; /* Add padding for add pair btn */
        }
        #sora-helper-add-pair-btn {
            background-color: #5cb85c; color: white;
            width: 100%;
            padding: 8px 10px; font-size: 13px; border: none; border-radius: 5px;
            cursor: pointer; margin-bottom: 10px; font-weight: bold;
        }
        #sora-helper-clear-all-btn {
            background-color: #e74c3c; color: white;
            width: 100%;
            padding: 8px 10px; font-size: 13px; border: none; border-radius: 5px;
            cursor: pointer; margin-bottom: 10px; font-weight: bold;
            transition: background-color 0.2s;
        }
        #sora-helper-clear-all-btn:hover {
            background-color: #c0392b;
        }
        #sora-helper-controls {
            display: flex; gap: 5px;
            background-color: #353535;
            padding: 12px;
            border-top: 1px solid #444;
            border-bottom-left-radius: 8px;
            border-bottom-right-radius: 8px;
        }
        #sora-helper-controls button {
            flex-grow: 1; padding: 8px 10px; border: none; border-radius: 5px;
            cursor: pointer; font-size: 11px; font-weight: bold;
            transition: background-color 0.2s;
        }
        #sora-batch-generate-btn { background-color: #4a90e2; color: white; }
        #sora-batch-generate-btn:disabled { background-color: #777; cursor: not-allowed; }
        #sora-pause-btn { background-color: #f39c12; color: white; }
        #sora-pause-btn:disabled { background-color: #777; cursor: not-allowed; }
        #sora-stop-btn { background-color: #e74c3c; color: white; }
        #sora-stop-btn:disabled { background-color: #777; cursor: not-allowed; }
        #sora-save-btn { background-color: #27ae60; color: white; }
        #sora-save-btn:disabled { background-color: #777; cursor: not-allowed; }
        #sora-load-btn { background-color: #8e44ad; color: white; }
        #sora-load-btn:disabled { background-color: #777; cursor: not-allowed; }
        #sora-prompt-section {
            padding: 14px 15px 10px 15px;
            border-bottom: 1px solid #444;
            background-color: #323232;
        }
        #sora-prompt-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
        }
        #sora-prompt-header label {
            font-size: 13px;
            font-weight: bold;
            color: #f0f0f0;
        }
        #sora-prompt-meta {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 11px;
            color: #aaa;
        }
        #sora-prompt-input {
            width: 100%;
            min-height: 72px;
            max-height: 140px;
            resize: vertical;
            padding: 8px;
            background-color: #2a2a2a;
            border: 1px solid #555;
            border-radius: 4px;
            color: #f0f0f0;
            font-size: 12px;
            line-height: 1.4;
        }
        #sora-prompt-input:focus {
            outline: none;
            border-color: #4a90e2;
            box-shadow: 0 0 0 1px rgba(74,144,226,0.2);
        }
        #sora-prompt-reset-btn {
            background: none;
            border: 1px solid #555;
            color: #ccc;
            padding: 3px 8px;
            font-size: 11px;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.2s;
        }
        #sora-prompt-reset-btn:hover {
            background-color: #454545;
        }
        #sora-prompt-reset-btn:active {
            background-color: #3a3a3a;
        }
        #sora-prompt-toggle-btn {
            background: none;
            border: 1px solid #555;
            color: #ccc;
            padding: 3px 8px;
            font-size: 11px;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.2s;
        }
        #sora-prompt-toggle-btn:hover {
            background-color: #454545;
        }
        #sora-prompt-toggle-btn:active {
            background-color: #3a3a3a;
        }
        #sora-prompt-section.collapsed {
            padding-bottom: 6px;
        }
        #sora-prompt-section.collapsed #sora-prompt-input,
        #sora-prompt-section.collapsed #sora-prompt-charcount {
            display: none;
        }
    `);

    function loadStoredPrompt(context = 'startup') {
        try {
            if (typeof window === 'undefined' || !window.localStorage) {
                log(`[Prompt] localStorage unavailable; using default prompt (context: ${context})`, 'warn');
                activePrompt = DEFAULT_PROMPT;
                return activePrompt;
            }

            const stored = window.localStorage.getItem(PROMPT_STORAGE_KEY);
            if (stored && typeof stored === 'string' && stored.trim().length > 0) {
                activePrompt = stored;
                log(`[Prompt] Loaded stored prompt (${stored.length} chars) (context: ${context})`, 'info');
                return activePrompt;
            }

            log(`[Prompt] No stored prompt found; using default (context: ${context})`, 'debug');
        } catch (error) {
            log(`[Prompt] Failed to load stored prompt: ${error.message}. Using default. (context: ${context})`, 'warn');
        }

        activePrompt = DEFAULT_PROMPT;
        return activePrompt;
    }

    function savePromptToStorage(value, context = 'unknown') {
        const promptValue = typeof value === 'string' ? value : '';
        const trimmedLength = promptValue.trim().length;

        try {
            if (typeof window === 'undefined' || !window.localStorage) {
                log(`[Prompt] localStorage unavailable; skipping save (context: ${context})`, 'warn');
                return;
            }

            if (trimmedLength === 0) {
                window.localStorage.removeItem(PROMPT_STORAGE_KEY);
                log(`[Prompt] Cleared stored prompt (context: ${context})`, 'debug');
            } else {
                window.localStorage.setItem(PROMPT_STORAGE_KEY, promptValue);
                log(`[Prompt] Saved prompt (${promptValue.length} chars) (context: ${context})`, 'debug');
            }
        } catch (error) {
            log(`[Prompt] Failed to save prompt: ${error.message} (context: ${context})`, 'warn');
        }
    }

    function schedulePromptSave(value, context = 'auto_save') {
        if (promptDebounceTimer) {
            clearTimeout(promptDebounceTimer);
        }

        promptDebounceTimer = setTimeout(() => {
            savePromptToStorage(value, context);
            promptDebounceTimer = null;
        }, PROMPT_SAVE_DEBOUNCE_MS);
    }

    function updatePromptCharacterCount() {
        if (!promptCharCountLabel) {
            return;
        }

        const source = promptTextarea && typeof promptTextarea.value === 'string'
            ? promptTextarea.value
            : activePrompt || '';

        const length = source.length;
        promptCharCountLabel.textContent = `${length} chars`;
        promptCharCountLabel.style.color = length === 0 ? '#f39c12' : '#aaa';
    }

    function setActivePrompt(newPrompt, { persist = false, context = 'unknown', updateUI = true } = {}) {
        const sanitized = typeof newPrompt === 'string' ? newPrompt : '';
        activePrompt = sanitized;

        if (updateUI && promptTextarea && promptTextarea.value !== sanitized) {
            promptTextarea.value = sanitized;
        }

        updatePromptCharacterCount();

        if (persist) {
            savePromptToStorage(sanitized, context);
        }

        if (!['ui_input', 'auto_save', 'ui_bootstrap'].includes(context)) {
            log(`[Prompt] Active prompt updated (${sanitized.trim().length} chars) (context: ${context})`, 'info');
        }

        return activePrompt;
    }

    function handlePromptInput(event) {
        const newValue = event?.target?.value ?? '';
        setActivePrompt(newValue, { persist: false, context: 'ui_input', updateUI: false });
        schedulePromptSave(newValue, 'auto_save');
    }

    function handlePromptReset(event) {
        if (event) {
            event.preventDefault();
        }

        setActivePrompt(DEFAULT_PROMPT, { persist: true, context: 'reset_to_default' });
        if (promptTextarea) {
            promptTextarea.focus();
        }
        log('[Prompt] Prompt reset to default template.', 'info');
    }

    function loadPromptVisibility(context = 'startup') {
        isPromptSectionCollapsed = false;

        try {
            if (typeof window === 'undefined' || !window.localStorage) {
                log(`[Prompt] localStorage unavailable; using default prompt visibility (context: ${context})`, 'warn');
                return isPromptSectionCollapsed;
            }

            const stored = window.localStorage.getItem(PROMPT_VISIBILITY_STORAGE_KEY);
            if (stored === '1' || stored === 'true' || stored === 'hidden') {
                isPromptSectionCollapsed = true;
            } else if (stored === '0' || stored === 'false' || stored === 'visible') {
                isPromptSectionCollapsed = false;
            }

            log(`[Prompt] Loaded prompt section visibility: ${isPromptSectionCollapsed ? 'hidden' : 'visible'} (context: ${context})`, 'debug');
        } catch (error) {
            log(`[Prompt] Failed to load prompt visibility: ${error.message}. Defaulting to visible. (context: ${context})`, 'warn');
            isPromptSectionCollapsed = false;
        }

        return isPromptSectionCollapsed;
    }

    function savePromptVisibility(isHidden, context = 'unknown') {
        try {
            if (typeof window === 'undefined' || !window.localStorage) {
                log(`[Prompt] localStorage unavailable; cannot persist prompt visibility (context: ${context})`, 'warn');
                return;
            }

            window.localStorage.setItem(PROMPT_VISIBILITY_STORAGE_KEY, isHidden ? '1' : '0');
            log(`[Prompt] Prompt section visibility saved as ${isHidden ? 'hidden' : 'visible'} (context: ${context})`, 'debug');
        } catch (error) {
            log(`[Prompt] Failed to persist prompt visibility: ${error.message} (context: ${context})`, 'warn');
        }
    }

    function applyPromptSectionVisibility(isHidden, context = 'unknown') {
        if (promptSectionContainer) {
            promptSectionContainer.classList.toggle('collapsed', Boolean(isHidden));
        }

        if (promptToggleButton) {
            if (isHidden) {
                promptToggleButton.textContent = 'Show';
                promptToggleButton.title = 'Show the prompt editor';
            } else {
                promptToggleButton.textContent = 'Hide';
                promptToggleButton.title = 'Hide the prompt editor';
            }
        }

        if (!isHidden) {
            updatePromptCharacterCount();
        }

        if (context !== 'ui_bootstrap') {
            log(`[Prompt] Prompt section ${isHidden ? 'collapsed' : 'expanded'} (context: ${context})`, 'info');
        }
    }

    function togglePromptSection(forceHidden = null, context = 'user_toggle') {
        if (typeof forceHidden === 'boolean') {
            isPromptSectionCollapsed = forceHidden;
        } else {
            isPromptSectionCollapsed = !isPromptSectionCollapsed;
        }

        applyPromptSectionVisibility(isPromptSectionCollapsed, context);
        savePromptVisibility(isPromptSectionCollapsed, context);

        return isPromptSectionCollapsed;
    }

    // --- HELPER FUNCTIONS ---
    function logToUIPanel(message, type = 'info') {
        if (!logView) return;
        const logEntry = document.createElement('div');
        const now = new Date();
        const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
        logEntry.textContent = `[${timeString}] ${message}`;
        if (type === 'error') logEntry.style.color = '#ff8a8a';
        else if (type === 'success') logEntry.style.color = '#8aff8a';
        logView.appendChild(logEntry);
        logView.scrollTop = logView.scrollHeight;
    }

    function log(message, type = 'info') {
        console.log(`[SORA Helper] ${message}`);
        logToUIPanel(message, type);
    }

    // NEW: UI synchronization function to prevent status display issues
    function refreshAllPairStatusInUI(context = 'unknown') {
        const logPrefix = `[UI-Refresh]`;
        
        if (!imagePairsData || imagePairsData.length === 0) {
            log(`${logPrefix} No pairs to refresh (context: ${context})`, 'debug');
            return;
        }
        
        log(`${logPrefix} Refreshing UI status for all pairs (context: ${context})`, 'debug');
        
        imagePairsData.forEach(pair => {
            if (pair && pair.id !== undefined) {
                const statusText = pair.status === 'done' ? 'Done!' : 
                                  pair.status === 'error' ? 'Error' :
                                  pair.status === 'processing' ? 'Processing...' : 
                                  'Pending';
                
                try {
                    updatePairStatusInUI(pair.id, statusText);
                    log(`${logPrefix} Refreshed pair ${pair.id}: ${pair.status} → ${statusText}`, 'debug');
                } catch (uiError) {
                    log(`${logPrefix} Failed to refresh pair ${pair.id}: ${uiError.message}`, 'warn');
                }
            }
        });

        // Update overall progress and check for completion
        productSets.forEach(set => {
            updateProductSetProgress(set.id, 'ui_refresh');
            checkProductSetCompletion(set.id, 'ui_refresh');
        });
        updateOverallProgressIndicators();
    }

    function getSoraElement(selector, description, parent = document) {
        const element = parent.querySelector(selector);
        if (!element) {
            log(`Error: SORA element not found: ${description} (Selector: ${selector})`, 'error');
        }
        return element;
    }

    // ENHANCED: Update pair status in UI with set-aware improvements
    function updatePairStatusInUI(pairId, statusText) {
        try {
            if (pairId === null || pairId === undefined) {
                log(`Invalid pairId provided to updatePairStatusInUI: ${pairId}`, 'warn');
                return;
            }

            const pairDiv = document.getElementById(`sora-helper-pair-${pairId}`);
            if (pairDiv) {
                let statusDiv = pairDiv.querySelector('.status');
                if (!statusDiv) {
                    log(`Status div not found for pair ${pairId}, creating it...`, 'warn');
                    statusDiv = document.createElement('div');
                    statusDiv.className = 'status';
                    pairDiv.appendChild(statusDiv);
                }
                
                // Enhanced status display with set information
                const result = findPairById(pairId);
                if (result && result.pair && result.set) {
                    const { pair, set } = result;
                    
                    // Create enhanced status text with set context
                    const setInfo = pair.setBasedId || `${set.name}.${(pair.pairIndex || 0) + 1}`;
                    const enhancedStatusText = `[${setInfo}] ${statusText}`;
                    statusDiv.textContent = enhancedStatusText;
                    
                    // Add set-based styling
                    pairDiv.setAttribute('data-set-id', set.id);
                    pairDiv.setAttribute('data-set-name', set.name);
                    
                    // Update status-based styling
                    updatePairElementStyling(pairDiv, statusText, pair);
                    
                    // Update the parent set's status
                    updateProductSetStatusInUI(set.id);
                    
                    log(`Updated status for pair ${setInfo} (ID: ${pairId}): ${statusText}`, 'debug');
                } else {
                    // Fallback for legacy pairs without set context
                statusDiv.textContent = statusText;
                    updatePairElementStyling(pairDiv, statusText);
                    log(`Updated status for legacy pair ${pairId}: ${statusText}`, 'debug');
                }
            } else {
                log(`Pair div not found for ID ${pairId} when updating status to: ${statusText}`, 'warn');
            }
        } catch (statusError) {
            log(`Error updating pair status UI for pair ${pairId}: ${statusError.message}`, 'error');
        }
    }

    // NEW: Update pair element styling based on status
    function updatePairElementStyling(pairDiv, statusText, pair = null) {
        const statusDiv = pairDiv.querySelector('.status');
        if (!statusDiv) return;
        
        // Remove existing status classes
        pairDiv.classList.remove('pair-pending', 'pair-processing', 'pair-done', 'pair-error', 'pair-skipped');
        
        log(`[Styling] Applying style for status: "${statusText}" to pair ${pair?.id || 'unknown'}`, 'debug');
        
        // NUCLEAR APPROACH: Direct style setting with maximum specificity
        const statusLower = statusText.toLowerCase();
        
        if (statusText.includes('✅') || statusLower.includes('done')) {
            statusDiv.style.color = '#5cb85c';
            pairDiv.style.backgroundColor = '#f0f8f0';
            pairDiv.style.borderLeft = '4px solid #5cb85c';
            pairDiv.style.color = '#333';
            pairDiv.setAttribute('data-status', 'done');
            pairDiv.classList.add('pair-done');
        } else if (statusText.includes('❌') || statusLower.includes('error')) {
            statusDiv.style.color = '#d9534f';
            pairDiv.style.backgroundColor = '#fef7f7';
            pairDiv.style.borderLeft = '4px solid #d9534f';
            pairDiv.style.color = '#333';
            pairDiv.setAttribute('data-status', 'error');
            pairDiv.classList.add('pair-error');
        } else if (statusText.includes('⏳') || statusLower.includes('processing')) {
            statusDiv.style.color = '#8B4513';
            pairDiv.style.backgroundColor = '#fff3cd';
            pairDiv.style.borderLeft = '4px solid #f0ad4e';
            pairDiv.style.color = '#856404';
            pairDiv.setAttribute('data-status', 'processing');
            pairDiv.classList.add('pair-processing');
        } else if (statusLower.includes('skipped')) {
            statusDiv.style.color = '#6c757d';
            pairDiv.style.backgroundColor = '#f8f9fa';
            pairDiv.style.borderLeft = '4px solid #6c757d';
            pairDiv.style.color = '#6c757d';
            pairDiv.setAttribute('data-status', 'skipped');
            pairDiv.classList.add('pair-skipped');
        } else {
            // Default to pending style for any unmatched status (including 'pending', 'Pending', etc.)
            statusDiv.style.color = '#777';
            pairDiv.style.backgroundColor = '#f9f9f9';
            pairDiv.style.borderLeft = '4px solid #ddd';
            pairDiv.style.color = '#777';
            pairDiv.setAttribute('data-status', 'pending');
            pairDiv.classList.add('pair-pending');
        }
        
        log(`[Styling] Applied cssText: "${pairDiv.style.cssText}"`, 'debug');
        
        // Remove any existing timestamp to prevent cramped UI
        const existingTimestamp = pairDiv.querySelector('.timestamp');
        if (existingTimestamp) {
            existingTimestamp.remove();
        }
    }

    // NEW: Update ProductSet status display in the UI
    function updateProductSetStatusInUI(setId) {
        const productSet = findProductSetById(setId);
        if (!productSet) return;

        // Update the ProductSet card status (if in ProductSet management view)
        updateProductSetCardStatus(setId);

        // Update the set header in pairs display (if in pairs view)
        updateSetHeaderInPairsDisplay(setId);

        // Update overall progress indicators
        updateOverallProgressIndicators();
    }

    // NEW: Update set header in pairs display view
    function updateSetHeaderInPairsDisplay(setId) {
        const setHeaderElement = document.getElementById(`set-header-${setId}`);
        if (!setHeaderElement) return;

        const productSet = findProductSetById(setId);
        if (!productSet) return;

        const progress = productSet.progress;
        const statusText = getSetStatusDisplayText(productSet);
        const progressPercentage = progress.total > 0 ? Math.round((progress.completed / progress.total) * 100) : 0;

        // Update set header content
        const setTitleElement = setHeaderElement.querySelector('.set-title');
        const setStatusElement = setHeaderElement.querySelector('.set-status');
        const setProgressBar = setHeaderElement.querySelector('.set-progress-bar');

        if (setTitleElement) {
            setTitleElement.textContent = `${productSet.name} (${progress.completed}/${progress.total})`;
        }

        if (setStatusElement) {
            setStatusElement.textContent = statusText;
            setStatusElement.className = `set-status status-${productSet.status}`;
        }

        if (setProgressBar) {
            setProgressBar.style.width = `${progressPercentage}%`;
            setProgressBar.style.backgroundColor = getProgressBarColor(productSet.status, progressPercentage);
        }

        // Update set header background based on status
        updateSetHeaderStyling(setHeaderElement, productSet.status);
    }

    // NEW: Get status display text for a ProductSet
    function getSetStatusDisplayText(productSet) {
        const progress = productSet.progress;
        
        switch (productSet.status) {
            case 'pending':
                return `Ready to start (${progress.total} pairs)`;
            case 'processing':
                return `Processing... ${progress.completed}/${progress.total} done`;
            case 'completed':
                const duration = productSet.metadata.processingStartTime ? 
                    Math.round((Date.now() - productSet.metadata.processingStartTime) / 60000) : 0;
                return `✅ Completed in ${duration}m (${progress.failed > 0 ? `${progress.failed} failed` : 'All successful'})`;
            case 'error':
                return `❌ Error: ${productSet.errorInfo.lastError || 'Unknown error'}`;
            case 'paused':
                return `⏸️ Paused (${progress.completed}/${progress.total} done)`;
            default:
                return `Status: ${productSet.status}`;
        }
    }

    // NEW: Get progress bar color based on status and percentage
    function getProgressBarColor(status, percentage) {
        switch (status) {
            case 'completed':
                return '#5cb85c'; // Green
            case 'error':
                return '#d9534f'; // Red
            case 'processing':
                return percentage > 50 ? '#5bc0de' : '#f0ad4e'; // Blue if >50%, orange if <50%
            case 'paused':
                return '#6c757d'; // Gray
            default:
                return '#ddd'; // Light gray
        }
    }

    // NEW: Update set header styling based on status
    function updateSetHeaderStyling(headerElement, status) {
        // Remove existing status classes
        headerElement.classList.remove('status-pending', 'status-processing', 'status-completed', 'status-error', 'status-paused');
        
        // Add current status class
        headerElement.classList.add(`status-${status}`);
        
        // Update background and border colors
        switch (status) {
            case 'processing':
                headerElement.style.backgroundColor = '#e7f3ff';
                headerElement.style.borderLeft = '4px solid #5bc0de';
                break;
            case 'completed':
                headerElement.style.backgroundColor = '#f0f8f0';
                headerElement.style.borderLeft = '4px solid #5cb85c';
                break;
            case 'error':
                headerElement.style.backgroundColor = '#fef7f7';
                headerElement.style.borderLeft = '4px solid #d9534f';
                break;
            case 'paused':
                headerElement.style.backgroundColor = '#f8f9fa';
                headerElement.style.borderLeft = '4px solid #6c757d';
                break;
            default:
                headerElement.style.backgroundColor = '#f9f9f9';
                headerElement.style.borderLeft = '4px solid #ddd';
        }
    }

    // NEW: Update overall progress indicators
    function updateOverallProgressIndicators() {
        const overallProgress = getOverallBatchProgress();
        
        // Update main control panel progress
        const batchProgressElement = document.getElementById('batch-progress-indicator');
        if (batchProgressElement) {
            const totalPairs = overallProgress.totalPairs;
            const completedPairs = overallProgress.completedPairs;
            const pendingPairs = overallProgress.pendingPairs;
            const processingPairs = overallProgress.processingPairs;
            const percentage = totalPairs > 0 ? Math.round((completedPairs / totalPairs) * 100) : 0;
            
            batchProgressElement.textContent = `Progress: ${completedPairs}/${totalPairs} done (${percentage}%), ${pendingPairs} pending, ${processingPairs} processing - ${overallProgress.completedSets}/${overallProgress.sets} sets completed`;
        }

        // Update button text with progress
        if (batchGenerateBtn && !isStopped) {
            const completedPairs = overallProgress.completedPairs;
            const totalPairs = overallProgress.totalPairs;
            const pendingPairs = overallProgress.pendingPairs;
            
            if (pendingPairs === 0 && completedPairs === totalPairs) {
                batchGenerateBtn.textContent = 'BATCH GENERATE';
            } else {
                batchGenerateBtn.textContent = `PROCESSING... (${completedPairs}/${totalPairs})`;
            }
        }
    }

    async function copyFileToClipboard(file) {
        if (!file) {
            log("Error: No file provided to copy.", 'error');
            return { success: false, blob: null };
        }
        log(`Attempting to convert and copy "${file.name}" (${file.type}) to clipboard as PNG...`, 'info');

        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function(event) {
                const img = new Image();
                img.onload = function() {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);

                    canvas.toBlob(async function(pngBlob) {
                        if (!pngBlob) {
                            log(`Error: Canvas toBlob returned null for "${file.name}".`, 'error');
                            // Rejecting here means the promise from copyFileToClipboard will be rejected.
                            // The caller should handle this rejection or the .catch below will.
                            // For consistency, let's resolve with failure and null blob.
                            resolve({ success: false, blob: null, error: `Canvas toBlob failed for ${file.name}` });
                            return;
                        }
                        try {
                            const clipboardItem = new ClipboardItem({ 'image/png': pngBlob });
                            await navigator.clipboard.write([clipboardItem]);
                            log(`File "${file.name}" successfully copied to clipboard as PNG.`, 'success');
                            resolve({ success: true, blob: pngBlob });
                        } catch (err) {
                            log(`Error writing PNG Blob to clipboard for "${file.name}": ${err.name} - ${err.message}`, 'error');
                            log(`Will proceed with synthetic paste using the image blob for "${file.name}".`, 'info');
                            // IMPORTANT: Don't show alert dialog as it blocks the automation process.
                            // Resolve with success:false BUT with the blob, so synthetic paste can be attempted.
                            resolve({ success: false, blob: pngBlob, error: `Clipboard write failed: ${err.message}` });
                        }
                    }, 'image/png');
                };
                img.onerror = function() {
                    log(`Error: Could not load image "${file.name}" for canvas conversion.`, 'error');
                    resolve({ success: false, blob: null, error: `Failed to load image ${file.name}` });
                };
                img.src = event.target.result; // This is the data URL from FileReader
            };
            reader.onerror = function() {
                log(`Error: FileReader failed to read "${file.name}".`, 'error');
                resolve({ success: false, blob: null, error: `FileReader failed for ${file.name}` });
            };
            reader.readAsDataURL(file); // Read the file as a Data URL
        })
        .catch(err => { // Catch errors from the new Promise or unhandled rejections from its executor
            log(`Overall error in copyFileToClipboard for "${file.name}": ${err.message}`, 'error');
            return { success: false, blob: null, error: `Overall error: ${err.message}` }; // Ensure function returns the structured object on error
        });
    }

    // Clean synthetic paste - same simple approach for both images
    async function simulatePasteEvent(targetElement, blob, imageNameForLog, expectedTotalImages = 1) {
        try {
            log(`Starting synthetic paste for ${imageNameForLog} (expecting ${expectedTotalImages} total images)`, 'info');

            // Ensure target is focused
            targetElement.focus();
            targetElement.click();
            await new Promise(resolve => setTimeout(resolve, 100));

            // Create File object from blob
            const file = new File([blob], `${imageNameForLog}.png`, { type: 'image/png' });

            // Create DataTransfer with the file
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);

            // Create ClipboardEvent - same approach for both images
            const pasteEvent = new ClipboardEvent('paste', {
                clipboardData: dataTransfer,
                bubbles: true,
                cancelable: true,
                composed: true
            });

            // Dispatch the event
            targetElement.dispatchEvent(pasteEvent);
            log(`Synthetic paste event dispatched for ${imageNameForLog}`, 'info');

            // Wait for SORA's processing time with retry logic
            log(`Waiting for SORA to process ${imageNameForLog} (up to 60 seconds)...`, 'info');

            const maxRetries = 59; // Increased from 29 to allow up to 60 seconds total for image paste detection
            const retryInterval = 1000;

            for (let retry = 0; retry < maxRetries; retry++) {
                const waitTime = retry === 0 ? 2000 : retryInterval;
                await new Promise(resolve => setTimeout(resolve, waitTime));

                try {
                    const composerArea = document.querySelector('.relative.rounded-\\[24px\\].p-2.max-tablet\\:flex');
                    const imageGrid = composerArea?.querySelector('div.grid.grid-cols-5.gap-2.p-1.pb-0');
                    const currentImages = imageGrid?.querySelectorAll('div.relative.h-full.w-full.overflow-hidden > img[alt="Upload"][src^="data:image"]') || [];

                    log(`Retry ${retry + 1}/${maxRetries}: Found ${currentImages.length} images for ${imageNameForLog}, expecting ${expectedTotalImages}`, 'debug');

                    if (currentImages.length >= expectedTotalImages) {
                        log(`Synthetic paste succeeded for ${imageNameForLog} - found ${currentImages.length} images after ${retry + 1} attempts`, 'success');
                        return { action: 'pasted_programmatically_synthetic', didPaste: true };
                    }
                } catch (checkError) {
                    log(`Error checking for images on retry ${retry + 1}: ${checkError.message}`, 'warn');
                }

                if (retry < maxRetries - 1) {
                    log(`Still waiting for ${imageNameForLog} to appear in SORA (attempt ${retry + 1}/${maxRetries})...`, 'info');
                }
            }

            const finalImageCount = document.querySelectorAll('.relative.rounded-\\[24px\\].p-2.max-tablet\\:flex div.grid.grid-cols-5.gap-2.p-1.pb-0 div.relative.h-full.w-full.overflow-hidden > img[alt="Upload"][src^="data:image"]')?.length || 0;
            log(`Synthetic paste failed for ${imageNameForLog} - found ${finalImageCount} images but expected ${expectedTotalImages}`, 'error');
            return { action: 'error_synthetic_paste', didPaste: false, error: `Expected ${expectedTotalImages} images but found ${finalImageCount}` };

        } catch (e) {
            log(`Synthetic paste failed for ${imageNameForLog}: ${e.message}`, 'error');
            return { action: 'error_synthetic_paste', didPaste: false, error: e.message };
        }
    }

    // Simplified attemptPaste function focused on synthetic paste only
    async function attemptPaste(targetElement, imageNameForLog = "image", imageBlob = null, expectedTotalImages = 1) {
        if (!targetElement) {
            log(`Target element for paste of "${imageNameForLog}" is null.`, 'error');
            return { action: 'error', didPaste: false, error: "Target element null" };
        }

        // Try synthetic paste if a blob is provided
        if (imageBlob) {
            log(`Attempting synthetic paste for ${imageNameForLog}`, 'info');
            const syntheticResult = await simulatePasteEvent(targetElement, imageBlob, imageNameForLog, expectedTotalImages);

            if (syntheticResult.didPaste) {
                log(`Synthetic paste succeeded for ${imageNameForLog}`, 'success');
                return syntheticResult;
            }
            log(`Synthetic paste failed for ${imageNameForLog}. Error: ${syntheticResult.error}`, 'error');
            return syntheticResult; // Return the failed result instead of trying manual fallback
        } else {
            log(`No image blob provided for ${imageNameForLog}, cannot attempt synthetic paste.`, 'error');
            return { action: 'error', didPaste: false, error: "No image blob provided" };
        }
    }

    async function waitForSoraImageAcknowledgement(imageName, expectedTotalStagedImages) {
        log(`Waiting for SORA to show ${expectedTotalStagedImages} total staged image(s) in input area (after adding "${imageName}")...`);

        return new Promise((resolve, reject) => {
            let observer = null;
            let timeoutId = null;

            // Selectors based on user-provided HTML structure
            const STABLE_COMPOSER_AREA_SELECTOR = '.relative.rounded-\\[24px\\].p-2.max-tablet\\:flex'; // Grandparent of the grid
            const STAGED_IMAGES_GRID_SELECTOR = 'div.grid.grid-cols-5.gap-2.p-1.pb-0'; // The direct container of image items
            // Selector for an individual valid image *inside* a grid item wrapper
            const ACTUAL_IMAGE_IN_GRID_ITEM_SELECTOR = 'div.relative.h-full.w-full.overflow-hidden > img[alt="Upload"][src^="data:image"]';

            const cleanupAndResolve = () => {
                if (observer) observer.disconnect();
                clearTimeout(timeoutId);
                log(`Successfully detected ${expectedTotalStagedImages} staged image(s).`, 'success');
                resolve(true);
            };

            const cleanupAndReject = (reason) => {
                if (observer) observer.disconnect();
                clearTimeout(timeoutId);
                log(reason, 'error');
                reject(new Error(reason));
            };

            // Increased timeout to give user ample time for manual paste if needed, and for UI to react.
            timeoutId = setTimeout(() => {
                cleanupAndReject(`Timeout waiting for ${expectedTotalStagedImages} staged image(s) after adding "${imageName}". User might not have pasted, or UI did not update as expected, or selectors are incorrect.`);
            }, PASTE_WAIT_MS + 15000); // e.g., 1.5s paste wait + 15s for UI/manual action

            const composerArea = document.querySelector(STABLE_COMPOSER_AREA_SELECTOR);
            if (!composerArea) {
                cleanupAndReject(`SORA Composer Area ("${STABLE_COMPOSER_AREA_SELECTOR}") not found. Cannot observe for staged images.`);
                return;
            }

            const checkStagedImages = () => {
                const imageGrid = composerArea.querySelector(STAGED_IMAGES_GRID_SELECTOR);
                if (imageGrid) {
                    let validStagedImageCount = 0;
                    const potentialImageWrappers = imageGrid.children; // These are the <div class="relative"> wrappers

                    for (let i = 0; i < potentialImageWrappers.length; i++) {
                        const wrapper = potentialImageWrappers[i];
                        // Check if this wrapper actually contains the specific img tag we're looking for
                        if (wrapper.querySelector(ACTUAL_IMAGE_IN_GRID_ITEM_SELECTOR)) {
                            validStagedImageCount++;
                        }
                    }

                    log(`Found ${validStagedImageCount} valid staged images in grid. Expecting ${expectedTotalStagedImages}.`, 'debug');
                    if (validStagedImageCount >= expectedTotalStagedImages) {
                        cleanupAndResolve();
                        return true;
                    }
                } else {
                    log(`Staged image grid ("${STAGED_IMAGES_GRID_SELECTOR}") not found inside composer area ("${STABLE_COMPOSER_AREA_SELECTOR}") yet.`, 'debug');
                }
                return false;
            };

            // Check immediately in case images are already there
            if (checkStagedImages()) return;

            if (observer) observer.disconnect(); // Disconnect any previous observer instance
            observer = new MutationObserver((mutationsList) => {
                let relevantMutationDetected = false;
                for (const mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        // Check if the target of mutation is the grid, or if an added node contains/is the grid,
                        // or if the target is the composer area itself (grid might be added to it).
                        if ( (mutation.target.matches && mutation.target.matches(STAGED_IMAGES_GRID_SELECTOR)) ||
                             (mutation.target.closest && mutation.target.closest(STAGED_IMAGES_GRID_SELECTOR)) ||
                             (mutation.target === composerArea) ) {
                            relevantMutationDetected = true;
                            break;
                        }
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                if (node.matches(STAGED_IMAGES_GRID_SELECTOR) || node.querySelector(STAGED_IMAGES_GRID_SELECTOR)) {
                                    relevantMutationDetected = true;
                                }
                            }
                        });
                    }
                    if (relevantMutationDetected) break;
                }

                if (relevantMutationDetected) {
                    log("Relevant mutation detected in composer area. Re-checking staged image count.", 'debug');
                    if (checkStagedImages()) {
                        // cleanupAndResolve() is called inside checkStagedImages if successful
                    }
                }
            });

            observer.observe(composerArea, { childList: true, subtree: true });
            log(`MutationObserver started on SORA Composer Area ("${STABLE_COMPOSER_AREA_SELECTOR}") to find grid items.`, 'info');
        });
    }

    // **REWRITTEN (v6 - Crash Fix)**: This version is optimized to prevent UI freezes and crashes.
    // It uses highly specific selectors and a debounced check to avoid expensive operations inside the rapidly-firing MutationObserver.
    function waitForGenerationCompletion(pairId, startTime) {
        return new Promise((resolve, reject) => {
            const logPrefix = `[waiter-p${pairId}]`;
            log(`${logPrefix} Listener started.`, 'debug');

            // Initialize policy violation tracking for this generation
            initializePolicyViolationTracking(pairId, `completion_waiter_${pairId}`);

            // Each listener has its own, completely independent state.
            let isResolved = false;
            let localObserver;
            let checkTimeout = null; // Used for debouncing the check function.

            const cleanupAndResolve = (reason) => {
                if (isResolved) return;
                isResolved = true;
                clearTimeout(timeoutId);
                clearTimeout(checkTimeout);
                if (localObserver) localObserver.disconnect();

                decrementActiveGenerations(pairId, 'completion_success');
                generationStartTimes.delete(pairId);
                cleanupPolicyViolationTracking(pairId, 'completion_success');
                log(`${logPrefix} COMPLETED. Reason: ${reason}. Active generations now: ${activeGenerations}`, 'success');
                resolve(reason);
            };

            const cleanupAndReject = (error) => {
                if (isResolved) return;
                isResolved = true;
                clearTimeout(timeoutId);
                clearTimeout(checkTimeout);
                if (localObserver) localObserver.disconnect();

                decrementActiveGenerations(pairId, 'completion_failure');
                generationStartTimes.delete(pairId);
                cleanupPolicyViolationTracking(pairId, 'completion_failure');
                log(`${logPrefix} FAILED. Reason: ${error.message}. Active generations now: ${activeGenerations}`, 'error');
                reject(error);
            };

            const timeoutId = setTimeout(() => {
                cleanupAndReject(new Error(`Generation timed out after ${GENERATION_TIMEOUT_MS / 1000}s`));
            }, GENERATION_TIMEOUT_MS);

            const MEDIA_FEED_CONTAINER_SELECTOR = '.grid.grid-cols-1.gap-8';
            const SUCCESSFUL_MEDIA_ITEM_SELECTOR = 'div.relative.group.select-none > div:not(:has(circle[stroke-dashoffset]))';
            let initialItemCount = -1;

            let lastPolicyCheckTime = 0;
            const POLICY_CHECK_INTERVAL = 30000; // 30 seconds

            const performChecks = () => {
                if (isResolved) return;

                // --- Check 1: Generation-specific Policy Violation Detection (Every 30 seconds only) ---
                const now = Date.now();
                if (now - lastPolicyCheckTime >= POLICY_CHECK_INTERVAL) {
                    lastPolicyCheckTime = now;
                    
                    const violationCheck = detectPolicyViolationForGeneration(pairId, `waiter_${pairId}_check`);
                    if (violationCheck.hasViolation) {
                    log(`${logPrefix} Policy violation detected: ${violationCheck.violationType}`, 'error');
                    
                    // Handle the violation (check for retry possibility)
                    handlePolicyViolation(pairId, violationCheck, `waiter_${pairId}_violation`).then(response => {
                        if (response.shouldRetry) {
                            log(`${logPrefix} Policy violation will be retried (${response.retryCount}/${response.maxRetries})`, 'warn');
                            // The retry will be handled by the main loop when this generation fails
                            cleanupAndReject(new Error(`PolicyViolationRetryScheduled:${violationCheck.violationType}`));
                        } else if (response.finalFailure) {
                            log(`${logPrefix} Policy violation is permanent failure after ${response.retryCount || 0} retries`, 'error');
                            cleanupAndReject(new Error(`PolicyViolationPermanentFailure:${violationCheck.violationType}`));
                        } else {
                            log(`${logPrefix} Policy violation handling deferred: ${response.action}`, 'info');
                            // Continue monitoring, violation might resolve itself
                        }
                    }).catch(handlingError => {
                        log(`${logPrefix} Error handling policy violation: ${handlingError.message}`, 'error');
                        cleanupAndReject(new Error(`PolicyViolationHandlingError:${handlingError.message}`));
                    });
                        return;
                    }
                }

                // --- Check 2: New Item in Media Feed ---
                const mediaFeed = document.querySelector(MEDIA_FEED_CONTAINER_SELECTOR);
                if (mediaFeed && mediaFeed.offsetParent !== null) {
                    if (initialItemCount === -1) {
                        initialItemCount = mediaFeed.querySelectorAll(SUCCESSFUL_MEDIA_ITEM_SELECTOR).length;
                        log(`${logPrefix} Media feed visible. Baseline item count: ${initialItemCount}`, 'debug');
                    }
                    const currentItemCount = mediaFeed.querySelectorAll(SUCCESSFUL_MEDIA_ITEM_SELECTOR).length;
                    if (currentItemCount > initialItemCount) {
                        log(`${logPrefix} New completed media item detected.`, 'debug');
                        cleanupAndResolve('new_media_item_detected');
                        return;
                    }
                } else {
                    initialItemCount = -1;
                }

                // --- Check 3: "Ready" Toast Fallback ---
                const toast = Array.from(document.querySelectorAll('li[data-sonner-toast]'))
                                   .find(t => t.textContent.includes("Ready · Click to view"));
                if (toast) {
                    const timeSinceLastGlobal = Date.now() - lastGlobalCompletionTime;
                    if (timeSinceLastGlobal > 10000) {
                        log(`${logPrefix} New completion toast detected.`, 'debug');
                        lastGlobalCompletionTime = Date.now();
                        cleanupAndResolve('toast_message_found');
                    }
                }
            };

            // Debounced observer to prevent crashing the browser.
            localObserver = new MutationObserver(() => {
                clearTimeout(checkTimeout); // Clear previous pending check
                checkTimeout = setTimeout(performChecks, 100); // Schedule a new check in 100ms
            });

            localObserver.observe(document.body, { childList: true, subtree: true });
        });
    }

    // --- UI CREATION ---
    function createMainPanel() {
        mainPanel = document.createElement('div');
        mainPanel.id = 'sora-helper-panel';

        const titleBar = document.createElement('h3');
        titleBar.style.display = 'flex';
        titleBar.style.alignItems = 'center';
        titleBar.style.justifyContent = 'space-between';
        titleBar.style.gap = '10px';
        titleBar.style.margin = '0';
        titleBar.style.padding = '10px 10px';
        
        // Create logo container
        const logoContainer = document.createElement('div');
        logoContainer.style.display = 'flex';
        logoContainer.style.alignItems = 'center';
        logoContainer.style.gap = '8px';
        
        // Create SVG logo
        const logoSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        logoSvg.setAttribute('width', '24');
        logoSvg.setAttribute('height', '24');
        logoSvg.setAttribute('viewBox', '0 0 24 24');
        logoSvg.style.color = '#4a90e2';
        logoSvg.style.flexShrink = '0';
        
        const logoPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        logoPath.setAttribute('fill', 'currentColor');
        logoPath.setAttribute('d', 'M21.139 10.053a5.35 5.35 0 0 0-.46-4.392 5.41 5.41 0 0 0-5.824-2.594 5.35 5.35 0 0 0-4.033-1.798 5.41 5.41 0 0 0-5.158 3.744 5.35 5.35 0 0 0-3.576 2.594 5.41 5.41 0 0 0 .665 6.34 5.35 5.35 0 0 0 .46 4.392 5.41 5.41 0 0 0 5.824 2.595 5.35 5.35 0 0 0 4.033 1.798 5.41 5.41 0 0 0 5.16-3.747 5.35 5.35 0 0 0 3.576-2.593 5.41 5.41 0 0 0-.667-6.34m-8.067 11.276a4 4 0 0 1-2.575-.931l.127-.072 4.274-2.469a.7.7 0 0 0 .35-.608v-6.024l1.807 1.043a.07.07 0 0 1 .035.049v4.99a4.027 4.027 0 0 1-4.018 4.022M4.43 17.638a4 4 0 0 1-.48-2.696l.127.076 4.273 2.469a.7.7 0 0 0 .702 0l5.218-3.013v2.086a.07.07 0 0 1-.026.056l-4.32 2.494a4.026 4.026 0 0 1-5.494-1.472m-1.125-9.33A4 4 0 0 1 5.4 6.545l-.002.147v4.937a.7.7 0 0 0 .35.608l5.218 3.012-1.806 1.043a.06.06 0 0 1-.061.005l-4.32-2.496a4.026 4.026 0 0 1-1.473-5.493m14.841 3.454L12.93 8.749l1.806-1.042a.07.07 0 0 1 .06-.006l4.321 2.494a4.024 4.024 0 0 1-.621 7.26v-5.086a.7.7 0 0 0-.349-.607m1.798-2.706-.127-.076-4.273-2.468a.7.7 0 0 0-.702 0L9.624 9.524V7.438a.07.07 0 0 1 .026-.055l4.32-2.492a4.023 4.023 0 0 1 5.974 4.165M8.642 12.774l-1.807-1.043a.06.06 0 0 1-.035-.05v-4.99a4.023 4.023 0 0 1 6.597-3.088l-.127.072-4.274 2.469a.7.7 0 0 0-.351.607zm.981-2.116 2.324-1.342 2.324 1.342v2.683l-2.324 1.341-2.324-1.341z');
        
        logoSvg.appendChild(logoPath);
        logoContainer.appendChild(logoSvg);
        
        // Create title text container
        const titleTextContainer = document.createElement('div');
        titleTextContainer.style.display = 'flex';
        titleTextContainer.style.flexDirection = 'column';
        titleTextContainer.style.lineHeight = '1.2';
        
        // Main title
        const mainTitle = document.createElement('div');
        mainTitle.textContent = 'Sora Auto-Gen';
        mainTitle.style.fontSize = '16px';
        mainTitle.style.fontWeight = 'bold';
        mainTitle.style.color = '#f0f0f0';
        mainTitle.style.margin = '0';
        mainTitle.style.textAlign = 'left';
        
        // Credit subtitle
        const creditSubtitle = document.createElement('div');
        creditSubtitle.textContent = 'by: Zandriegbz';
        creditSubtitle.style.fontSize = '11px';
        creditSubtitle.style.color = '#999';
        creditSubtitle.style.fontWeight = 'normal';
        creditSubtitle.style.margin = '0';
        creditSubtitle.style.marginTop = '-2px';
        creditSubtitle.style.textAlign = 'left';
        
        titleTextContainer.appendChild(mainTitle);
        titleTextContainer.appendChild(creditSubtitle);
        logoContainer.appendChild(titleTextContainer);
        titleBar.appendChild(logoContainer);

        // Create button container for proper spacing and alignment
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.alignItems = 'center';
        buttonContainer.style.gap = '2px';

        logToggleButton = document.createElement('button');
        logToggleButton.id = 'sora-log-toggle-btn';
        logToggleButton.textContent = 'Show Log';
        logToggleButton.title = 'Click to show/hide log. Triple-click quickly (within 1 second) to copy all logs.';

        // Triple-click detection variables
        let lastClickTime = 0;
        let clickCount = 0;
        let clickTimer = null;

        logToggleButton.onclick = () => {
            const currentTime = Date.now();
            const timeDiff = currentTime - lastClickTime;

            // If clicks are within 1 second, increment counter
            if (timeDiff <= 1000) {
                clickCount++;
            } else {
                clickCount = 1; // Reset if too much time passed
            }

            // Clear any existing timer
            if (clickTimer) {
                clearTimeout(clickTimer);
            }

            // If this is the third click within 1 second, copy logs
            if (clickCount === 3) {
                clickCount = 0; // Reset immediately

                try {
                    const logText = Array.from(logView.children)
                        .map(child => child.textContent)
                        .join('\n');

                    navigator.clipboard.writeText(logText).then(() => {
                        const originalText = logToggleButton.textContent;
                        const originalBg = logToggleButton.style.backgroundColor;

                        logToggleButton.textContent = '✅ Copied!';
                        logToggleButton.style.backgroundColor = '#5cb85c';

                        setTimeout(() => {
                            logToggleButton.textContent = originalText;
                            logToggleButton.style.backgroundColor = originalBg;
                        }, 2000);
                    }).catch(err => {
                        console.error('Failed to copy logs:', err);
                        const originalText = logToggleButton.textContent;
                        const originalBg = logToggleButton.style.backgroundColor;

                        logToggleButton.textContent = '❌ Failed';
                        logToggleButton.style.backgroundColor = '#d9534f';

                        setTimeout(() => {
                            logToggleButton.textContent = originalText;
                            logToggleButton.style.backgroundColor = originalBg;
                        }, 2000);
                    });
                } catch (error) {
                    console.error('Error copying logs:', error);
                }
            } else {
                // For single or double clicks, toggle log visibility
                if (logView.style.display === 'none') {
                    logView.style.display = 'block';
                    logToggleButton.textContent = 'Hide Log';
                } else {
                    logView.style.display = 'none';
                    logToggleButton.textContent = 'Show Log';
                }

                // Set a timer to reset the click count after 1 second
                clickTimer = setTimeout(() => {
                    clickCount = 0;
                    clickTimer = null;
                }, 1000);
            }

            lastClickTime = currentTime;
        };
        buttonContainer.appendChild(logToggleButton);

        // Add Clear All button to button container
        const clearAllBtn = document.createElement('button');
        clearAllBtn.id = 'sora-clear-all-btn';
        clearAllBtn.textContent = 'Clear All';
        clearAllBtn.onclick = handleClearAll;
        clearAllBtn.title = 'Remove all pairs and reset to start fresh';
        buttonContainer.appendChild(clearAllBtn);

        const minimizeButton = document.createElement('button');
        minimizeButton.id = 'sora-minimize-btn';
        minimizeButton.textContent = '−';
        minimizeButton.title = 'Minimize to floating button';
        minimizeButton.onclick = handleMinimize;
        buttonContainer.appendChild(minimizeButton);

        // Add button container to title bar
        titleBar.appendChild(buttonContainer);

        mainPanel.appendChild(titleBar);

        logView = document.createElement('div');
        logView.id = 'sora-log-view';
        mainPanel.appendChild(logView);

    promptSectionContainer = document.createElement('div');
    promptSectionContainer.id = 'sora-prompt-section';

    const promptHeader = document.createElement('div');
    promptHeader.id = 'sora-prompt-header';

    const promptLabel = document.createElement('label');
    promptLabel.setAttribute('for', 'sora-prompt-input');
    promptLabel.textContent = 'Prompt';

    const promptMeta = document.createElement('div');
    promptMeta.id = 'sora-prompt-meta';

    promptCharCountLabel = document.createElement('span');
    promptCharCountLabel.id = 'sora-prompt-charcount';
    promptMeta.appendChild(promptCharCountLabel);

    promptResetButton = document.createElement('button');
    promptResetButton.id = 'sora-prompt-reset-btn';
    promptResetButton.type = 'button';
    promptResetButton.textContent = 'Reset';
    promptResetButton.title = 'Restore the default fashion prompt';
    promptResetButton.addEventListener('click', handlePromptReset);
    promptMeta.appendChild(promptResetButton);

    promptToggleButton = document.createElement('button');
    promptToggleButton.id = 'sora-prompt-toggle-btn';
    promptToggleButton.type = 'button';
    promptToggleButton.textContent = 'Hide';
    promptToggleButton.title = 'Hide the prompt editor';
    promptToggleButton.addEventListener('click', () => togglePromptSection(null, 'user_toggle'));
    promptMeta.appendChild(promptToggleButton);

    promptHeader.appendChild(promptLabel);
    promptHeader.appendChild(promptMeta);

    promptTextarea = document.createElement('textarea');
    promptTextarea.id = 'sora-prompt-input';
    promptTextarea.rows = 3;
    promptTextarea.placeholder = 'Describe how Sora should combine the model and outfit...';
    promptTextarea.addEventListener('input', handlePromptInput);

    promptSectionContainer.appendChild(promptHeader);
    promptSectionContainer.appendChild(promptTextarea);

    mainPanel.appendChild(promptSectionContainer);

    // Initialize prompt UI with the active prompt value
    setActivePrompt(activePrompt, { persist: false, context: 'ui_bootstrap' });
    applyPromptSectionVisibility(isPromptSectionCollapsed, 'ui_bootstrap');

        const customModal = document.createElement('div');
        customModal.id = 'sora-helper-custom-modal';
        customModal.style.display = 'none'; // Hidden by default
        customModal.innerHTML = `
            <div id="sora-helper-modal-content">
                <p id="sora-helper-modal-message">"></p>
                <div id="sora-helper-modal-buttons">
                    <button id="sora-helper-modal-ok-btn">OK</button>
                    <button id="sora-helper-modal-cancel-btn">Cancel</button>
                </div>
            </div>
        `;
        mainPanel.appendChild(customModal); // Add modal to the panel

        // NEW: Create ProductSet management section (replaces single upload section)
        const productSetSection = document.createElement('div');
        productSetSection.id = 'sora-productset-section';
        productSetSection.style.padding = '15px 15px 8px 15px';

        // Section header with "Add Product Set" button
        const headerDiv = document.createElement('div');
        headerDiv.style.display = 'flex';
        headerDiv.style.justifyContent = 'space-between';
        headerDiv.style.alignItems = 'center';
        headerDiv.style.marginBottom = '20px';

        const sectionTitle = document.createElement('h4');
        sectionTitle.textContent = 'Product Sets';
        sectionTitle.style.margin = '0';
        sectionTitle.style.color = '#f0f0f0';
        sectionTitle.style.fontSize = '16px';
        sectionTitle.style.textAlign = 'left';

        const addSetBtn = document.createElement('button');
        addSetBtn.id = 'sora-add-set-btn';
        addSetBtn.textContent = '+ Add Product Set';
        addSetBtn.onclick = handleAddProductSet;
        addSetBtn.style.padding = '8px 12px';
        addSetBtn.style.backgroundColor = '#5cb85c';
        addSetBtn.style.color = 'white';
        addSetBtn.style.border = 'none';
        addSetBtn.style.borderRadius = '4px';
        addSetBtn.style.fontSize = '12px';
        addSetBtn.style.fontWeight = 'bold';
        addSetBtn.style.cursor = 'pointer';

        headerDiv.appendChild(sectionTitle);
        headerDiv.appendChild(addSetBtn);

        // Container for ProductSet cards
        const productSetCardsContainer = document.createElement('div');
        productSetCardsContainer.id = 'sora-productset-cards';
        productSetCardsContainer.style.maxHeight = '400px';
        productSetCardsContainer.style.overflowY = 'auto';

        // Generate all pairs button (for all ProductSets)
        const generateAllPairsBtn = document.createElement('button');
        generateAllPairsBtn.id = 'sora-generate-all-pairs-btn';
        generateAllPairsBtn.textContent = 'Generate All Pairs';
        generateAllPairsBtn.onclick = handleGenerateAllPairs;
        generateAllPairsBtn.disabled = true;
        generateAllPairsBtn.style.width = '100%';
        generateAllPairsBtn.style.padding = '12px';
        generateAllPairsBtn.style.backgroundColor = '#4a90e2';
        generateAllPairsBtn.style.color = 'white';
        generateAllPairsBtn.style.border = 'none';
        generateAllPairsBtn.style.borderRadius = '5px';
        generateAllPairsBtn.style.fontSize = '14px';
        generateAllPairsBtn.style.fontWeight = 'bold';
        generateAllPairsBtn.style.cursor = 'pointer';
        generateAllPairsBtn.style.marginTop = '15px';

        productSetSection.appendChild(headerDiv);
        productSetSection.appendChild(productSetCardsContainer);
        productSetSection.appendChild(generateAllPairsBtn);

        // Legacy upload section (for backward compatibility - hidden by default)
        const uploadSection = document.createElement('div');
        uploadSection.id = 'sora-upload-section';
        uploadSection.style.padding = '15px';
        uploadSection.style.display = 'none'; // Hidden in favor of ProductSet workflow

        // Model image upload
        const modelSection = document.createElement('div');
        modelSection.style.marginBottom = '20px';

        const modelLabel = document.createElement('label');
        modelLabel.textContent = 'Model Image:';
        modelLabel.style.display = 'block';
        modelLabel.style.marginBottom = '8px';
        modelLabel.style.fontSize = '14px';
        modelLabel.style.fontWeight = 'bold';
        modelLabel.style.color = '#f0f0f0';

        const modelInput = document.createElement('input');
        modelInput.type = 'file';
        modelInput.accept = 'image/*';
        modelInput.id = 'sora-model-input';
        modelInput.onchange = handleModelImageSelect;
        modelInput.style.width = '100%';
        modelInput.style.padding = '8px';
        modelInput.style.backgroundColor = '#454545';
        modelInput.style.border = '1px solid #555';
        modelInput.style.borderRadius = '4px';
        modelInput.style.color = '#ddd';
        modelInput.style.fontSize = '12px';

        modelSection.appendChild(modelLabel);
        modelSection.appendChild(modelInput);

        // Outfit images bulk upload
        const outfitSection = document.createElement('div');
        outfitSection.style.marginBottom = '20px';

        const outfitLabel = document.createElement('label');
        outfitLabel.textContent = 'Outfit Images (Select Multiple):';
        outfitLabel.style.display = 'block';
        outfitLabel.style.marginBottom = '8px';
        outfitLabel.style.fontSize = '14px';
        outfitLabel.style.fontWeight = 'bold';
        outfitLabel.style.color = '#f0f0f0';

        const outfitInput = document.createElement('input');
        outfitInput.type = 'file';
        outfitInput.accept = 'image/*';
        outfitInput.multiple = true; // Allow multiple file selection
        outfitInput.id = 'sora-outfit-input';
        outfitInput.onchange = handleOutfitImagesSelect;
        outfitInput.style.width = '100%';
        outfitInput.style.padding = '8px';
        outfitInput.style.backgroundColor = '#454545';
        outfitInput.style.border = '1px solid #555';
        outfitInput.style.borderRadius = '4px';
        outfitInput.style.color = '#ddd';
        outfitInput.style.fontSize = '12px';

        outfitSection.appendChild(outfitLabel);
        outfitSection.appendChild(outfitInput);

        // Generate pairs button (legacy)
        const generatePairsBtn = document.createElement('button');
        generatePairsBtn.id = 'sora-generate-pairs-btn';
        generatePairsBtn.textContent = 'Generate Pairs';
        generatePairsBtn.onclick = handleGeneratePairs;
        generatePairsBtn.disabled = true;
        generatePairsBtn.style.width = '100%';
        generatePairsBtn.style.padding = '10px';
        generatePairsBtn.style.backgroundColor = '#5cb85c';
        generatePairsBtn.style.color = 'white';
        generatePairsBtn.style.border = 'none';
        generatePairsBtn.style.borderRadius = '5px';
        generatePairsBtn.style.fontSize = '14px';
        generatePairsBtn.style.fontWeight = 'bold';
        generatePairsBtn.style.cursor = 'pointer';
        generatePairsBtn.style.marginBottom = '15px';

        uploadSection.appendChild(modelSection);
        uploadSection.appendChild(outfitSection);
        uploadSection.appendChild(generatePairsBtn);

        // Add both sections to main panel (ProductSet section visible by default)
        mainPanel.appendChild(productSetSection);
        mainPanel.appendChild(uploadSection);

        // Generated pairs container (initially hidden)
        pairsContainer = document.createElement('div');
        pairsContainer.id = 'sora-pairs-container';
        pairsContainer.style.display = 'none';
        mainPanel.appendChild(pairsContainer);

        const controlsDiv = document.createElement('div');
        controlsDiv.id = 'sora-helper-controls';

        batchGenerateBtn = document.createElement('button');
        batchGenerateBtn.id = 'sora-batch-generate-btn';
        batchGenerateBtn.textContent = 'BATCH GENERATE';
        batchGenerateBtn.onclick = handleBatchGenerate;
        controlsDiv.appendChild(batchGenerateBtn);

        pauseBtn = document.createElement('button');
        pauseBtn.id = 'sora-pause-btn';
        pauseBtn.textContent = 'PAUSE';
        pauseBtn.onclick = handlePause;
        pauseBtn.disabled = true;
        controlsDiv.appendChild(pauseBtn);

        stopBtn = document.createElement('button');
        stopBtn.id = 'sora-stop-btn';
        stopBtn.textContent = 'STOP';
        stopBtn.onclick = handleStop;
        stopBtn.disabled = true;
        controlsDiv.appendChild(stopBtn);

        // Add save/load buttons
        const saveBtn = document.createElement('button');
        saveBtn.id = 'sora-save-btn';
        saveBtn.textContent = 'SAVE';
        saveBtn.onclick = handleSave;
        saveBtn.title = 'Save current batch progress to file';
        controlsDiv.appendChild(saveBtn);

        const loadBtn = document.createElement('button');
        loadBtn.id = 'sora-load-btn';
        loadBtn.textContent = 'LOAD';
        loadBtn.onclick = handleLoad;
        loadBtn.title = 'Load batch progress from file';
        controlsDiv.appendChild(loadBtn);

        mainPanel.appendChild(controlsDiv);
        document.body.appendChild(mainPanel);

        // Create floating minimized button
        const floatingBtn = document.createElement('div');
        floatingBtn.id = 'sora-floating-btn';
        floatingBtn.textContent = 'AIG';
        floatingBtn.title = 'Click to restore Sora Auto-Gen interface';
        floatingBtn.onclick = handleRestore;
        document.body.appendChild(floatingBtn);
    }

    // DEPRECATED: addPairToUI() - No longer used with bulk upload system
    // function addPairToUI() { ... }

    // NEW: Handle model image selection
    function handleModelImageSelect(event) {
        try {
            const file = event.target.files[0];
            if (file) {
                // Validate file type
                if (!file.type.startsWith('image/')) {
                    alert('Please select a valid image file for the model.');
                    event.target.value = '';
                    return;
                }
                selectedModelFile = file;
                log(`Model image selected: ${file.name} (${file.type}, ${Math.round(file.size / 1024)}KB)`, 'success');
                checkIfReadyToGeneratePairs();
            } else {
                selectedModelFile = null;
                log('Model image cleared', 'info');
                checkIfReadyToGeneratePairs();
            }
        } catch (error) {
            log(`Error handling model image selection: ${error.message}`, 'error');
            selectedModelFile = null;
            checkIfReadyToGeneratePairs();
        }
    }

    // NEW: Handle outfit images selection (bulk)
    function handleOutfitImagesSelect(event) {
        try {
            const files = Array.from(event.target.files);
            if (files.length > 0) {
                // Validate all files are images
                const invalidFiles = files.filter(file => !file.type.startsWith('image/'));
                if (invalidFiles.length > 0) {
                    alert(`Please select only image files. Invalid files: ${invalidFiles.map(f => f.name).join(', ')}`);
                    event.target.value = '';
                    return;
                }

                selectedOutfitFiles = files;
                const totalSize = files.reduce((sum, file) => sum + file.size, 0);
                log(`${files.length} outfit images selected (Total: ${Math.round(totalSize / 1024)}KB): ${files.map(f => f.name).join(', ')}`, 'success');
                checkIfReadyToGeneratePairs();
            } else {
                selectedOutfitFiles = [];
                log('Outfit images cleared', 'info');
                checkIfReadyToGeneratePairs();
            }
        } catch (error) {
            log(`Error handling outfit images selection: ${error.message}`, 'error');
            selectedOutfitFiles = [];
            checkIfReadyToGeneratePairs();
        }
    }

    // NEW: Check if ready to generate pairs
    function checkIfReadyToGeneratePairs() {
        const generatePairsBtn = document.getElementById('sora-generate-pairs-btn');
        if (generatePairsBtn) {
            const ready = selectedModelFile && selectedOutfitFiles.length > 0;
            generatePairsBtn.disabled = !ready;

            if (ready) {
                generatePairsBtn.textContent = `Generate ${selectedOutfitFiles.length} Pairs`;
            } else {
                generatePairsBtn.textContent = 'Generate Pairs';
            }
        }
    }

    // NEW: Generate pairs from selected files (Updated for ProductSet architecture)
    function handleGeneratePairs() {
        try {
            if (!selectedModelFile || selectedOutfitFiles.length === 0) {
                alert('Please select both a model image and at least one outfit image.');
                return;
            }

            // Create a new ProductSet from the selected files
            const setName = `Product Set ${nextProductSetId + 1}`;
            const newProductSet = createProductSet(setName, selectedModelFile, selectedOutfitFiles);

            // Validate the new ProductSet
            const validation = validateProductSet(newProductSet);
            if (!validation.isValid) {
                alert(`Error creating product set: ${validation.error}`);
                log(`Error creating product set: ${validation.error}`, 'error');
                return;
            }

            // Generate pairs for the new ProductSet
            if (!generatePairsForProductSet(newProductSet)) {
                alert('Error generating pairs for the product set.');
                return;
            }

            // Add the ProductSet to the global array
            productSets.push(newProductSet);

            // Synchronize with legacy imagePairsData for backward compatibility
            syncImagePairsDataWithProductSets();

            // Reset current indices for new batch
            currentSetIndex = 0;
            currentPairInSetIndex = -1;
            setCurrentIndex(0, 'generate_pairs_reset');

            log(`Generated ProductSet "${newProductSet.name}" with ${newProductSet.pairs.length} pairs successfully`, 'success');

            // Show pairs container and hide upload section
            const uploadSection = document.getElementById('sora-upload-section');
            if (uploadSection) {
                uploadSection.style.display = 'none';
            }

            if (pairsContainer) {
                pairsContainer.style.display = 'block';
            }

            // Create pairs display
            createPairsDisplay();

            // Enable batch generate button
            if (batchGenerateBtn) {
                batchGenerateBtn.disabled = false;
            }

            // Clear the selection for next use
            selectedModelFile = null;
            selectedOutfitFiles = [];
            
            // Reset file inputs
            const modelInput = document.getElementById('sora-model-input');
            const outfitInput = document.getElementById('sora-outfit-input');
            if (modelInput) modelInput.value = '';
            if (outfitInput) outfitInput.value = '';

            checkIfReadyToGeneratePairs();

        } catch (error) {
            log(`Error generating pairs: ${error.message}`, 'error');
        }
    }

    // NEW: Generate pairs for all ProductSets
    function generatePairsForAllProductSets() {
        try {
            let totalPairsGenerated = 0;

            productSets.forEach(productSet => {
                if (generatePairsForProductSet(productSet)) {
                    totalPairsGenerated += productSet.pairs.length;
                }
            });

            // Synchronize with legacy imagePairsData for backward compatibility
            syncImagePairsDataWithProductSets();

            log(`Generated ${totalPairsGenerated} pairs across ${productSets.length} ProductSets`, 'success');
            return totalPairsGenerated;

        } catch (error) {
            log(`Error generating pairs for all ProductSets: ${error.message}`, 'error');
            return 0;
        }
    }

    // NEW: Create visual display of generated pairs
    function createPairsDisplay() {
        pairsContainer.innerHTML = '';

        // Calculate overall progress
        const allPairs = getAllPairsFromProductSets();
        const totalPairs = allPairs.length;
        const totalCompleted = allPairs.filter(pair => pair.status === 'done').length;
        const totalFailed = allPairs.filter(pair => pair.status === 'error').length;
        const totalProcessing = allPairs.filter(pair => pair.status === 'processing').length;

        // Add header with back button and overall progress
        const header = document.createElement('div');
        header.style.padding = '10px';
        header.style.borderBottom = '1px solid #444';
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';

        const leftSection = document.createElement('div');
        leftSection.style.display = 'flex';
        leftSection.style.flexDirection = 'column';
        leftSection.style.gap = '4px';

        const title = document.createElement('h4');
        title.textContent = `Generated Pairs (${totalPairs} total across ${productSets.length} sets)`;
        title.style.margin = '0';
        title.style.color = '#f0f0f0';
        title.style.fontSize = '14px';

        const overallProgress = document.createElement('div');
        overallProgress.style.fontSize = '11px';
        overallProgress.style.color = '#aaa';
        overallProgress.textContent = `Completed: ${totalCompleted}, Failed: ${totalFailed}, Processing: ${totalProcessing}, Pending: ${totalPairs - totalCompleted - totalFailed - totalProcessing}`;

        leftSection.appendChild(title);
        leftSection.appendChild(overallProgress);

        const rightSection = document.createElement('div');
        rightSection.style.display = 'flex';
        rightSection.style.gap = '8px';

        const backToSetsBtn = document.createElement('button');
        backToSetsBtn.textContent = 'Back to Sets';
        backToSetsBtn.onclick = handleBackToProductSets;
        backToSetsBtn.style.padding = '5px 10px';
        backToSetsBtn.style.backgroundColor = '#555';
        backToSetsBtn.style.color = 'white';
        backToSetsBtn.style.border = 'none';
        backToSetsBtn.style.borderRadius = '4px';
        backToSetsBtn.style.cursor = 'pointer';
        backToSetsBtn.style.fontSize = '11px';

        const backBtn = document.createElement('button');
        backBtn.textContent = 'Back to Upload';
        backBtn.onclick = handleBackToUpload;
        backBtn.style.padding = '5px 10px';
        backBtn.style.backgroundColor = '#777';
        backBtn.style.color = 'white';
        backBtn.style.border = 'none';
        backBtn.style.borderRadius = '4px';
        backBtn.style.cursor = 'pointer';
        backBtn.style.fontSize = '11px';

        rightSection.appendChild(backToSetsBtn);
        rightSection.appendChild(backBtn);

        header.appendChild(leftSection);
        header.appendChild(rightSection);
        pairsContainer.appendChild(header);

        // Add pairs display organized by ProductSet
        const pairsDisplay = document.createElement('div');
        pairsDisplay.id = 'sora-pairs-display';
        pairsDisplay.style.padding = '10px';
        pairsDisplay.style.maxHeight = '300px';
        pairsDisplay.style.overflowY = 'auto';

        // Group pairs by ProductSet
        productSets.forEach(productSet => {
            if (productSet.pairs.length === 0) return;

            // Create set header
            const setHeader = createPairDisplaySetHeader(productSet);
            pairsDisplay.appendChild(setHeader);

            // Create collapsible container for pairs
            const setContainer = document.createElement('div');
            setContainer.id = `pairs-set-container-${productSet.id}`;
            setContainer.style.marginBottom = '15px';
            setContainer.style.backgroundColor = '#2a2a2a';
            setContainer.style.borderRadius = '4px';
            setContainer.style.border = '1px solid #444';

            // Add pairs for this set
            productSet.pairs.forEach((pair, pairIndex) => {
                const pairDiv = createPairDisplayElement(pair, productSet, pairIndex);
                setContainer.appendChild(pairDiv);
            });

            pairsDisplay.appendChild(setContainer);
        });

        pairsContainer.appendChild(pairsDisplay);
    }

    // Helper function to create set header in pairs display
    function createPairDisplaySetHeader(productSet) {
        const setHeader = document.createElement('div');
        setHeader.id = `pairs-set-header-${productSet.id}`;
        setHeader.style.display = 'flex';
        setHeader.style.justifyContent = 'space-between';
        setHeader.style.alignItems = 'center';
        setHeader.style.padding = '8px 12px';
        setHeader.style.backgroundColor = '#4a4a4a';
        setHeader.style.borderRadius = '6px';
        setHeader.style.marginBottom = '5px';
        setHeader.style.cursor = 'pointer';
        setHeader.style.userSelect = 'none';

        const leftSection = document.createElement('div');
        leftSection.style.display = 'flex';
        leftSection.style.alignItems = 'center';
        leftSection.style.gap = '8px';

        // Expand/collapse arrow
        const expandArrow = document.createElement('span');
        expandArrow.id = `pairs-expand-${productSet.id}`;
        expandArrow.textContent = '▼';
        expandArrow.style.fontSize = '10px';
        expandArrow.style.color = '#aaa';
        expandArrow.style.transition = 'transform 0.3s ease';

        // Set name and pair count
        const setTitle = document.createElement('div');
        setTitle.style.fontWeight = 'bold';
        setTitle.style.color = '#f0f0f0';
        setTitle.style.fontSize = '12px';
        setTitle.textContent = `${productSet.name} (${productSet.pairs.length} pairs)`;

        leftSection.appendChild(expandArrow);
        leftSection.appendChild(setTitle);

        const rightSection = document.createElement('div');
        rightSection.style.display = 'flex';
        rightSection.style.alignItems = 'center';
        rightSection.style.gap = '10px';

        // Progress indicator
        const progressText = document.createElement('div');
        progressText.style.fontSize = '10px';
        progressText.style.color = '#aaa';
        const completed = productSet.pairs.filter(p => p.status === 'done').length;
        const failed = productSet.pairs.filter(p => p.status === 'error').length;
        const processing = productSet.pairs.filter(p => p.status === 'processing').length;
        progressText.textContent = `${completed}/${productSet.pairs.length} done`;
        if (failed > 0) progressText.textContent += `, ${failed} failed`;
        if (processing > 0) progressText.textContent += `, ${processing} processing`;

        // Set-level controls
        const setControls = document.createElement('div');
        setControls.style.display = 'flex';
        setControls.style.gap = '4px';
        
        // Retry set button
        const retrySetBtn = document.createElement('button');
        retrySetBtn.textContent = 'Retry Set';
        retrySetBtn.style.fontSize = '9px';
        retrySetBtn.style.padding = '2px 6px';
        retrySetBtn.style.backgroundColor = '#666';
        retrySetBtn.style.color = 'white';
        retrySetBtn.style.border = 'none';
        retrySetBtn.style.borderRadius = '3px';
        retrySetBtn.style.cursor = 'pointer';
        retrySetBtn.onclick = (e) => {
            e.stopPropagation();
            handleRetryProductSet(productSet.id);
        };

        // Skip set button
        const skipSetBtn = document.createElement('button');
        skipSetBtn.textContent = 'Skip Set';
        skipSetBtn.style.fontSize = '9px';
        skipSetBtn.style.padding = '2px 6px';
        skipSetBtn.style.backgroundColor = '#888';
        skipSetBtn.style.color = 'white';
        skipSetBtn.style.border = 'none';
        skipSetBtn.style.borderRadius = '3px';
        skipSetBtn.style.cursor = 'pointer';
        skipSetBtn.onclick = (e) => {
            e.stopPropagation();
            handleSkipProductSet(productSet.id);
        };

        setControls.appendChild(retrySetBtn);
        setControls.appendChild(skipSetBtn);

        rightSection.appendChild(progressText);
        rightSection.appendChild(setControls);

        setHeader.appendChild(leftSection);
        setHeader.appendChild(rightSection);

        // Add click handler for expand/collapse
        setHeader.onclick = () => togglePairSetExpanded(productSet.id);

        return setHeader;
    }

    // Helper function to create individual pair display element
    function createPairDisplayElement(pair, productSet, pairIndex) {
            const pairDiv = document.createElement('div');
            pairDiv.className = 'sora-helper-pair pair-complete';
            pairDiv.id = `sora-helper-pair-${pair.id}`;
            pairDiv.style.display = 'flex';
            pairDiv.style.alignItems = 'center';
            pairDiv.style.gap = '10px';
        pairDiv.style.padding = '8px 12px';
        pairDiv.style.borderBottom = '1px solid #333';
        pairDiv.style.backgroundColor = '#f9f9f9'; // Default background

        // Pair number with set.pair format
            const pairNumber = document.createElement('div');
        pairNumber.textContent = `S${productSet.id}P${pairIndex}`;
        pairNumber.style.fontSize = '11px';
            pairNumber.style.fontWeight = 'bold';
        pairNumber.style.minWidth = '35px';
        pairNumber.style.color = '#aaa';

                    // Model info with truncated filenames
        const modelInfo = document.createElement('div');
        modelInfo.style.flex = '1';
        modelInfo.style.fontSize = '10px';
        const truncatedModelName = truncateFilename(pair.modelFile.name);
        const truncatedOutfitName = truncateFilename(pair.outfitFile.name);
        modelInfo.innerHTML = `<strong>Model:</strong> ${truncatedModelName}<br><strong>Outfit:</strong> ${truncatedOutfitName}`;
        
        // Add title attributes to show full filenames on hover
        modelInfo.title = `Model: ${pair.modelFile.name}\nOutfit: ${pair.outfitFile.name}`;

            // Status
            const statusDiv = document.createElement('div');
            statusDiv.className = 'status';
        statusDiv.textContent = pair.status || 'Pending';
        statusDiv.style.fontSize = '9px';
            statusDiv.style.minWidth = '60px';
        statusDiv.style.textAlign = 'center';
        statusDiv.style.padding = '2px 6px';
        statusDiv.style.borderRadius = '3px';

        // Style status based on value - convert status to display text
        const statusText = pair.status === 'done' ? 'Done!' : 
                          pair.status === 'error' ? 'Error' :
                          pair.status === 'processing' ? 'Processing...' : 
                          'Pending';
        updatePairElementStyling(pairDiv, statusText, pair);

            pairDiv.appendChild(pairNumber);
            pairDiv.appendChild(modelInfo);
            pairDiv.appendChild(statusDiv);

        return pairDiv;
    }

    // Toggle expand/collapse for a ProductSet in pairs display
    function togglePairSetExpanded(setId) {
        const container = document.getElementById(`pairs-set-container-${setId}`);
        const arrow = document.getElementById(`pairs-expand-${setId}`);
        
        if (!container || !arrow) return;

        const isCollapsed = container.style.display === 'none';
        container.style.display = isCollapsed ? 'block' : 'none';
        arrow.style.transform = isCollapsed ? 'rotate(0deg)' : 'rotate(-90deg)';
        arrow.textContent = isCollapsed ? '▼' : '▶';
    }

    // Handle retry all failed pairs in a ProductSet
    function handleRetryProductSet(setId) {
        const productSet = findProductSetById(setId);
        if (!productSet) {
            log(`ProductSet ${setId} not found for retry`, 'error');
            return;
        }

        const failedPairs = productSet.pairs.filter(pair => pair.status === 'error');
        if (failedPairs.length === 0) {
            log(`No failed pairs to retry in ProductSet "${productSet.name}"`, 'info');
            return;
        }

        log(`Retrying ${failedPairs.length} failed pairs in ProductSet "${productSet.name}"`, 'info');
        
        // Reset failed pairs to pending
        failedPairs.forEach(pair => {
            setPairStatus(pair, 'pending', `retry_set_${setId}`);
        });

        // Update progress and UI
        updateProductSetProgress(setId, `retry_set_${setId}`);
        updateProductSetStatus(setId, 'pending', `retry_set_${setId}`);
        updateProductSetStatusInUI(setId);
        refreshAllPairStatusInUI(`retry_set_${setId}`);
    }

    // Handle skip all pending/processing pairs in a ProductSet
    function handleSkipProductSet(setId) {
        const productSet = findProductSetById(setId);
        if (!productSet) {
            log(`ProductSet ${setId} not found for skip`, 'error');
            return;
        }

        const skipablePairs = productSet.pairs.filter(pair => 
            pair.status === 'pending' || pair.status === 'processing'
        );
        
        if (skipablePairs.length === 0) {
            log(`No pairs to skip in ProductSet "${productSet.name}"`, 'info');
            return;
        }

        const confirmation = confirm(
            `Skip ${skipablePairs.length} pending/processing pairs in "${productSet.name}"? This will mark them as skipped.`
        );

        if (!confirmation) return;

        log(`Skipping ${skipablePairs.length} pairs in ProductSet "${productSet.name}"`, 'info');
        
        // Mark pairs as skipped
        skipablePairs.forEach(pair => {
            setPairStatus(pair, 'skipped', `skip_set_${setId}`);
        });

        // Update progress and UI
        updateProductSetProgress(setId, `skip_set_${setId}`);
        updateProductSetStatus(setId, 'completed', `skip_set_${setId}`);
        updateProductSetStatusInUI(setId);
        refreshAllPairStatusInUI(`skip_set_${setId}`);
    }

    // NEW: Handle adding a new ProductSet
    function handleAddProductSet() {
        try {
            log('Adding new ProductSet...', 'info');
            
            // Create a new empty ProductSet
            const setName = `Product Set ${nextProductSetId + 1}`;
            const newProductSet = createProductSet(setName, null, []);
            
            // Add to ProductSets array
            productSets.push(newProductSet);
            
            // Create UI card for the new ProductSet
            createProductSetCard(newProductSet);
            
            // Update "Generate All Pairs" button state
            updateGenerateAllPairsButtonState();
            
            log(`Created new ProductSet "${newProductSet.name}" with ID ${newProductSet.id}`, 'success');
            
        } catch (error) {
            log(`Error adding ProductSet: ${error.message}`, 'error');
        }
    }

    // NEW: Handle generating pairs for all ProductSets
    function handleGenerateAllPairs() {
        try {
            log('Generating pairs for all ProductSets...', 'info');
            
            const totalPairs = generatePairsForAllProductSets();
            
            if (totalPairs > 0) {
                // Switch to pairs view
                const productSetSection = document.getElementById('sora-productset-section');
                if (productSetSection) {
                    productSetSection.style.display = 'none';
        }

        if (pairsContainer) {
                    pairsContainer.style.display = 'block';
                }
                
                // Create pairs display
                createPairsDisplay();
                
                // FORCE refresh all pair styles after creation
                setTimeout(() => {
                    refreshAllPairStatusInUI('post_pairs_creation');
                }, 100);
                
                // Enable batch generate button
        if (batchGenerateBtn) {
                    batchGenerateBtn.disabled = false;
                }
                
                log(`Generated ${totalPairs} pairs across ${productSets.length} ProductSets`, 'success');
            } else {
                alert('No valid ProductSets found to generate pairs from. Please add at least one ProductSet with a model and outfit images.');
            }
            
        } catch (error) {
            log(`Error generating all pairs: ${error.message}`, 'error');
        }
    }

    // NEW: Create ProductSet card UI element
    function createProductSetCard(productSet) {
        const cardsContainer = document.getElementById('sora-productset-cards');
        if (!cardsContainer) {
            log('ProductSet cards container not found', 'error');
            return;
        }
        
        const card = document.createElement('div');
        card.className = 'productset-card';
        card.id = `productset-card-${productSet.id}`;
        card.style.backgroundColor = '#3a3a3a';
        card.style.border = '1px solid #555';
        card.style.borderRadius = '8px';
        card.style.padding = '15px';
        card.style.marginBottom = '15px';
        card.style.position = 'relative';
        
        // Card header with name, expand/collapse, and remove button
        const cardHeader = document.createElement('div');
        cardHeader.style.display = 'flex';
        cardHeader.style.justifyContent = 'space-between';
        cardHeader.style.alignItems = 'center';
        cardHeader.style.marginBottom = '10px';
        cardHeader.style.cursor = 'pointer'; // Make header clickable for expand/collapse
        
        const leftSection = document.createElement('div');
        leftSection.style.display = 'flex';
        leftSection.style.alignItems = 'center';
        leftSection.style.gap = '8px';
        leftSection.style.flex = '1';
        
        // Expand/collapse arrow
        const expandBtn = document.createElement('span');
        expandBtn.id = `expand-btn-${productSet.id}`;
        expandBtn.textContent = '▼'; // Down arrow (expanded by default)
        expandBtn.style.fontSize = '12px';
        expandBtn.style.color = '#aaa';
        expandBtn.style.cursor = 'pointer';
        expandBtn.style.userSelect = 'none';
        
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.value = productSet.name;
        nameInput.style.backgroundColor = 'transparent';
        nameInput.style.border = 'none';
        nameInput.style.color = '#f0f0f0';
        nameInput.style.fontSize = '14px';
        nameInput.style.fontWeight = 'bold';
        nameInput.style.width = '180px';
        nameInput.onclick = (e) => e.stopPropagation(); // Prevent expand/collapse when clicking input
        nameInput.onchange = () => {
            productSet.name = nameInput.value;
            productSet.metadata.lastModified = Date.now();
            log(`Updated ProductSet name to "${productSet.name}"`, 'debug');
        };
        
        leftSection.appendChild(expandBtn);
        leftSection.appendChild(nameInput);
        
        const rightSection = document.createElement('div');
        rightSection.style.display = 'flex';
        rightSection.style.alignItems = 'center';
        rightSection.style.gap = '8px';
        
        // Quick status indicator in header
        const quickStatus = document.createElement('span');
        quickStatus.id = `quick-status-${productSet.id}`;
        quickStatus.style.fontSize = '10px';
        quickStatus.style.color = '#666';
        quickStatus.style.fontStyle = 'italic';
        quickStatus.textContent = '0/0';
        
        const removeBtn = document.createElement('button');
        removeBtn.textContent = '✕';
        removeBtn.style.backgroundColor = '#c94c4c';
        removeBtn.style.color = 'white';
        removeBtn.style.border = 'none';
        removeBtn.style.borderRadius = '4px';
        removeBtn.style.padding = '4px 8px';
        removeBtn.style.cursor = 'pointer';
        removeBtn.style.fontSize = '12px';
        removeBtn.onclick = (e) => {
            e.stopPropagation(); // Prevent expand/collapse when clicking remove
            handleRemoveProductSet(productSet.id);
        };
        
        rightSection.appendChild(quickStatus);
        rightSection.appendChild(removeBtn);
        
        cardHeader.appendChild(leftSection);
        cardHeader.appendChild(rightSection);
        
        // Add click handler for expand/collapse
        cardHeader.onclick = () => toggleProductSetExpanded(productSet.id);
        
        // Collapsible content container
        const contentContainer = document.createElement('div');
        contentContainer.id = `content-${productSet.id}`;
        contentContainer.style.display = 'block'; // Expanded by default
        
        // Model image section
        const modelSection = document.createElement('div');
        modelSection.style.marginBottom = '15px';
        
        const modelLabel = document.createElement('label');
        modelLabel.textContent = 'Model Image:';
        modelLabel.style.display = 'block';
        modelLabel.style.fontSize = '12px';
        modelLabel.style.color = '#ccc';
        modelLabel.style.marginBottom = '5px';
        
        const modelInput = document.createElement('input');
        modelInput.type = 'file';
        modelInput.accept = 'image/*';
        modelInput.style.width = '100%';
        modelInput.style.fontSize = '11px';
        modelInput.style.backgroundColor = '#454545';
        modelInput.style.border = '1px solid #666';
        modelInput.style.borderRadius = '4px';
        modelInput.style.padding = '6px';
        modelInput.style.color = '#ddd';
        modelInput.onchange = (e) => handleProductSetModelSelect(productSet.id, e);
        
        modelSection.appendChild(modelLabel);
        modelSection.appendChild(modelInput);
        
        // Outfit images section
        const outfitSection = document.createElement('div');
        outfitSection.style.marginBottom = '10px';
        
        const outfitLabel = document.createElement('label');
        outfitLabel.textContent = 'Outfit Images:';
        outfitLabel.style.display = 'block';
        outfitLabel.style.fontSize = '12px';
        outfitLabel.style.color = '#ccc';
        outfitLabel.style.marginBottom = '5px';
        
        const outfitInput = document.createElement('input');
        outfitInput.type = 'file';
        outfitInput.accept = 'image/*';
        outfitInput.multiple = true;
        outfitInput.style.width = '100%';
        outfitInput.style.fontSize = '11px';
        outfitInput.style.backgroundColor = '#454545';
        outfitInput.style.border = '1px solid #666';
        outfitInput.style.borderRadius = '4px';
        outfitInput.style.padding = '6px';
        outfitInput.style.color = '#ddd';
        outfitInput.onchange = (e) => handleProductSetOutfitSelect(productSet.id, e);
        
        outfitSection.appendChild(outfitLabel);
        outfitSection.appendChild(outfitInput);
        
        // Status indicator
        const statusDiv = document.createElement('div');
        statusDiv.id = `productset-status-${productSet.id}`;
        statusDiv.style.fontSize = '11px';
        statusDiv.style.color = '#aaa';
        statusDiv.style.fontStyle = 'italic';
        statusDiv.textContent = 'Ready to add files';
        
        // Add sections to content container
        contentContainer.appendChild(modelSection);
        contentContainer.appendChild(outfitSection);
        contentContainer.appendChild(statusDiv);
        
        card.appendChild(cardHeader);
        card.appendChild(contentContainer);
        
        cardsContainer.appendChild(card);
        
        log(`Created UI card for ProductSet "${productSet.name}"`, 'debug');
    }

    // NEW: Handle model image selection for a ProductSet
    function handleProductSetModelSelect(setId, event) {
        try {
            const productSet = findProductSetById(setId);
            if (!productSet) {
                log(`ProductSet ${setId} not found for model selection`, 'error');
                return;
            }
            
            const file = event.target.files[0];
            if (file) {
                if (!file.type.startsWith('image/')) {
                    alert('Please select a valid image file for the model.');
                    event.target.value = '';
                    return;
                }
                
                productSet.modelFile = file;
                productSet.metadata.lastModified = Date.now();
                
                log(`Model image selected for ProductSet "${productSet.name}": ${truncateFilename(file.name)}`, 'success');
                updateProductSetCardStatus(setId);
                updateGenerateAllPairsButtonState();
            } else {
                productSet.modelFile = null;
                updateProductSetCardStatus(setId);
                updateGenerateAllPairsButtonState();
            }
        } catch (error) {
            log(`Error handling model selection for ProductSet ${setId}: ${error.message}`, 'error');
        }
    }

    // NEW: Handle outfit images selection for a ProductSet
    function handleProductSetOutfitSelect(setId, event) {
        try {
            const productSet = findProductSetById(setId);
            if (!productSet) {
                log(`ProductSet ${setId} not found for outfit selection`, 'error');
                return;
            }
            
            const files = Array.from(event.target.files);
            if (files.length > 0) {
                const invalidFiles = files.filter(file => !file.type.startsWith('image/'));
                if (invalidFiles.length > 0) {
                    alert(`Please select only image files. Invalid files: ${invalidFiles.map(f => f.name).join(', ')}`);
                    event.target.value = '';
                    return;
                }
                
                productSet.outfitFiles = files;
                productSet.metadata.lastModified = Date.now();
                
                const truncatedNames = files.map(f => truncateFilename(f.name)).join(', ');
                log(`${files.length} outfit images selected for ProductSet "${productSet.name}": ${truncatedNames}`, 'success');
                updateProductSetCardStatus(setId);
                updateGenerateAllPairsButtonState();
            } else {
                productSet.outfitFiles = [];
                updateProductSetCardStatus(setId);
                updateGenerateAllPairsButtonState();
            }
        } catch (error) {
            log(`Error handling outfit selection for ProductSet ${setId}: ${error.message}`, 'error');
        }
    }

    // NEW: Toggle ProductSet expanded/collapsed state
    function toggleProductSetExpanded(setId) {
        const contentContainer = document.getElementById(`content-${setId}`);
        const expandBtn = document.getElementById(`expand-btn-${setId}`);
        
        if (!contentContainer || !expandBtn) {
            log(`Cannot find elements for ProductSet ${setId} expand/collapse`, 'error');
            return;
        }
        
        const isExpanded = contentContainer.style.display !== 'none';
        
        if (isExpanded) {
            // Collapse
            contentContainer.style.display = 'none';
            expandBtn.textContent = '▶'; // Right arrow
            expandBtn.style.color = '#666';
            log(`Collapsed ProductSet ${setId}`, 'debug');
        } else {
            // Expand
            contentContainer.style.display = 'block';
            expandBtn.textContent = '▼'; // Down arrow
            expandBtn.style.color = '#aaa';
            log(`Expanded ProductSet ${setId}`, 'debug');
        }
    }

    // NEW: Update ProductSet card status display
    function updateProductSetCardStatus(setId) {
        const productSet = findProductSetById(setId);
        const statusDiv = document.getElementById(`productset-status-${setId}`);
        const quickStatus = document.getElementById(`quick-status-${setId}`);
        
        if (!productSet) return;
        
        const hasModel = productSet.modelFile !== null;
        const hasOutfits = productSet.outfitFiles && productSet.outfitFiles.length > 0;
        
        // Update main status (in content area)
        if (statusDiv) {
            if (hasModel && hasOutfits) {
                statusDiv.textContent = `Ready: 1 model + ${productSet.outfitFiles.length} outfits`;
                statusDiv.style.color = '#5cb85c';
            } else if (hasModel) {
                statusDiv.textContent = 'Model added, need outfit images';
                statusDiv.style.color = '#f39c12';
            } else if (hasOutfits) {
                statusDiv.textContent = 'Outfits added, need model image';
                statusDiv.style.color = '#f39c12';
            } else {
                statusDiv.textContent = 'Ready to add files';
                statusDiv.style.color = '#aaa';
            }
        }
        
        // Update quick status (in header)
        if (quickStatus) {
            const modelCount = hasModel ? 1 : 0;
            const outfitCount = hasOutfits ? productSet.outfitFiles.length : 0;
            quickStatus.textContent = `${modelCount}/${outfitCount}`;
            
            if (hasModel && hasOutfits) {
                quickStatus.style.color = '#5cb85c';
            } else if (hasModel || hasOutfits) {
                quickStatus.style.color = '#f39c12';
            } else {
                quickStatus.style.color = '#666';
            }
        }
    }

    // NEW: Handle removing a ProductSet
    function handleRemoveProductSet(setId) {
        try {
            const productSet = findProductSetById(setId);
            if (!productSet) {
                log(`ProductSet ${setId} not found for removal`, 'error');
                return;
            }
            
            if (!confirm(`Are you sure you want to remove ProductSet "${productSet.name}"?`)) {
                return;
            }
            
            // Remove from array
            removeProductSet(setId, 'user_removal');
            
            // Remove UI card
            const card = document.getElementById(`productset-card-${setId}`);
            if (card) {
                card.remove();
            }
            
            // Update button states
            updateGenerateAllPairsButtonState();
            
            log(`Removed ProductSet "${productSet.name}"`, 'info');
            
        } catch (error) {
            log(`Error removing ProductSet ${setId}: ${error.message}`, 'error');
        }
    }

    // NEW: Update Generate All Pairs button state
    function updateGenerateAllPairsButtonState() {
        const generateAllBtn = document.getElementById('sora-generate-all-pairs-btn');
        if (!generateAllBtn) return;
        
        const validSets = productSets.filter(set => {
            const validation = validateProductSet(set);
            return validation.isValid;
        });
        
        const readyForGeneration = validSets.length > 0;
        generateAllBtn.disabled = !readyForGeneration;
        
        if (readyForGeneration) {
            const totalPotentialPairs = validSets.reduce((sum, set) => sum + set.outfitFiles.length, 0);
            generateAllBtn.textContent = `Generate All Pairs (${totalPotentialPairs} total)`;
        } else {
            generateAllBtn.textContent = 'Generate All Pairs';
        }
    }

    // NEW: Handle back to ProductSet management (from pairs view)
    function handleBackToProductSets() {
        const productSetSection = document.getElementById('sora-productset-section');
        if (productSetSection) {
            productSetSection.style.display = 'block';
        }

        if (pairsContainer) {
            pairsContainer.style.display = 'none';
        }

        // Refresh ProductSet cards to show current state
        refreshProductSetCards();
    }

    // NEW: Refresh all ProductSet cards
    function refreshProductSetCards() {
        const cardsContainer = document.getElementById('sora-productset-cards');
        if (!cardsContainer) return;
        
        cardsContainer.innerHTML = '';
        
        productSets.forEach(productSet => {
            createProductSetCard(productSet);
        });
        
        updateGenerateAllPairsButtonState();
    }

    // UPDATED: Handle back to upload (legacy function - now redirects to ProductSets)
    function handleBackToUpload() {
        // In the new architecture, redirect to ProductSet management instead
        handleBackToProductSets();
    }

    // --- EVENT HANDLERS & LOGIC ---
    // DEPRECATED: handleAddPair() - No longer used with bulk upload system
    // function handleAddPair() { ... }

    // DEPRECATED: handleRemovePair() - No longer used with bulk upload system
    // function handleRemovePair() { ... }

    function handleClearAll() {
        try {
            // Confirm with user before clearing all pairs
            if (imagePairsData && imagePairsData.length > 0) {
                if (!confirm(`Are you sure you want to clear all ${imagePairsData.length} pairs? This action cannot be undone.`)) {
                    return;
                }
            }

            // Clear the data arrays
            imagePairsData = [];
            selectedModelFile = null;
            selectedOutfitFiles = [];
            nextPairId = 0; // Reset the ID counter
            setCurrentIndex(-1, 'clear_all_reset'); // Reset processing index

            // Reset concurrent generation tracking
            activeGenerations = 0;
            generationStartTimes.clear();
            lastGlobalCompletionTime = 0;

            // Reset file inputs
            const modelInput = document.getElementById('sora-model-input');
            const outfitInput = document.getElementById('sora-outfit-input');
            if (modelInput) modelInput.value = '';
            if (outfitInput) outfitInput.value = '';

            // Show upload section and hide pairs container
            const uploadSection = document.getElementById('sora-upload-section');
            if (uploadSection) {
                uploadSection.style.display = 'block';
            }

            if (pairsContainer) {
                pairsContainer.style.display = 'none';
                pairsContainer.innerHTML = '';
            }

            // Reset batch processing state
            isStopped = true;
            isPaused = false;

            // Reset button states
            if (batchGenerateBtn) {
                batchGenerateBtn.disabled = true;
                batchGenerateBtn.textContent = 'BATCH GENERATE';
            }
            if (pauseBtn) {
                pauseBtn.disabled = true;
                pauseBtn.textContent = 'PAUSE';
            }
            if (stopBtn) {
                stopBtn.disabled = true;
            }

            // Update generate pairs button
            checkIfReadyToGeneratePairs();

            log('All data cleared successfully. Ready to start fresh!', 'success');

        } catch (clearError) {
            log(`Error clearing all data: ${clearError.message}`, 'error');
        }
    }

    // DEPRECATED: updatePairDisplayNumbers() - No longer used with bulk upload system
    // function updatePairDisplayNumbers() { ... }

    // DEPRECATED: updatePairCompletenessIndicators() - No longer used with bulk upload system
    // function updatePairCompletenessIndicators() { ... }

    // DEPRECATED: handleFileSelect() - No longer used with bulk upload system
    // function handleFileSelect() { ... }

    // DEPRECATED: promptForBulkPairCreation() - No longer used with bulk upload system
    // function promptForBulkPairCreation() { ... }

    // DEPRECATED: showBulkPairCreationModal() - No longer used with bulk upload system
    // function showBulkPairCreationModal() { ... }

    // DEPRECATED: createBulkPairs() - No longer used with bulk upload system
    // function createBulkPairs() { ... }

    // **NEW: Single-threaded main loop architecture**
    function mainLoop() {
        try {
            const logPrefix = `[MainLoop]`;
            
            // Validate counter integrity before making decisions
            validateActiveGenerationsCounter('main_loop_start');
            
            // Add periodic UI refresh to prevent sync issues
            const timeSinceLastRefresh = Date.now() - (lastUIRefreshTime || 0);
            if (timeSinceLastRefresh > 10000) { // Refresh every 10 seconds
                refreshAllPairStatusInUI('main_loop_periodic_refresh');
                lastUIRefreshTime = Date.now();
            }
            
            // Periodic completion check (even before all pairs are launched) - ProductSet aware
            const completionStatus = validateAllProductSetsCompletion('main_loop_periodic');
            if (completionStatus.isComplete) {
                checkAllProductSetsCompletion('main_loop_periodic_complete');
                return;
            }
            
            log(`${logPrefix} Running check. Status: stopped=${isStopped}, paused=${isPaused}, processing=${isProcessingPair}, active=${activeGenerations}/${MAX_CONCURRENT_GENERATIONS}. Progress: ${completionStatus.summary}`, 'debug');

            // Check if batch processing should be stopped
        if (isStopped) {
                log(`${logPrefix} Batch is stopped. Stopping main loop.`, 'info');
                if (mainLoopInterval) {
                    clearInterval(mainLoopInterval);
                    mainLoopInterval = null;
                }
            return;
        }

            // Check if batch processing is paused
        if (isPaused) {
                log(`${logPrefix} Batch is paused. Waiting...`, 'debug');
            return;
        }

            // Check if we're already processing a pair (mutex)
            if (isProcessingPair) {
                log(`${logPrefix} Already processing a pair. Waiting...`, 'debug');
                return;
            }

            // Enhanced completion check - validate actual completion status
            // ProductSet-aware pair iteration
            const currentPairResult = getCurrentPairFromProductSets();
            if (!currentPairResult) {
                // All pairs have been launched, now check if they're actually completed
                if (checkAllProductSetsCompletion('main_loop_all_launched')) {
                    return; // Batch is complete, main loop will be stopped by checkAllProductSetsCompletion
            } else {
                    // Still have incomplete pairs, continue monitoring
                return;
            }
        }

            const currentPair = currentPairResult.pair;

            // Check if we have available slots for new generation
            const uiGenerations = getActualActiveGenerationsFromUI();
            const interfaceReady = isSoraInterfaceReady();
            
            // ENHANCED: Double-check for generation limit popup before proceeding
            const limitPopup = Array.from(document.querySelectorAll('div[data-side="top"][data-align="center"][data-state="instant-open"]')).find(popup =>
                popup.textContent.includes('You can only generate') && popup.textContent.includes('at a time')
            );
            
            if (limitPopup) {
                log(`${logPrefix} Generation limit popup detected. Cannot start new pairs. UI:${uiGenerations}, Internal:${activeGenerations}`, 'warn');
                return;
            }
            
            if (uiGenerations >= MAX_CONCURRENT_GENERATIONS || activeGenerations >= MAX_CONCURRENT_GENERATIONS || !interfaceReady) {
                log(`${logPrefix} No available slots. UI:${uiGenerations}, Internal:${activeGenerations}, Ready:${interfaceReady}`, 'debug');
                return;
            }

            // Minimum delay between pair starts (3 seconds)
            const timeSinceLastStart = Date.now() - lastPairStartTime;
            if (timeSinceLastStart < 3000) {
                log(`${logPrefix} Too soon since last pair start (${timeSinceLastStart}ms). Waiting...`, 'debug');
                return;
            }

            // Validate current pair status
            if (currentPair.status !== 'pending') {
                log(`${logPrefix} Pair ${currentPair.id} not pending (status: ${currentPair.status}). Moving to next.`, 'info');
                advanceToNextPair('main_loop_skip_non_pending');
            return;
        }

            // Ensure workspace is clean before starting new pair (non-blocking check)
            const preStartValidation = validateWorkspaceState(0, `main_loop_pre_start_${currentPair.id}`);
            if (!preStartValidation.isValid) {
                log(`${logPrefix} Workspace contaminated before starting pair ${currentPair.id}, deferring start...`, 'warn');
                return; // Try again next loop iteration
            }

            // Ready to start a new pair!
            const pairContext = getPairProcessingContext(currentPair);
            log(`${logPrefix} Starting ${pairContext.displayName} (Set ${currentSetIndex}, Pair ${currentPairInSetIndex})`, 'info');
            isProcessingPair = true; // Set mutex
            lastPairStartTime = Date.now();
            
            // Start the pair processing (don't await - let it run async)
            startSinglePair(currentPair).then(() => {
                log(`${logPrefix} Pair ${currentPair.id} start completed`, 'success');
                advanceToNextPair('main_loop_success'); // Move to next pair
                isProcessingPair = false; // Release mutex
            }).catch((error) => {
                log(`${logPrefix} Pair ${currentPair.id} start failed: ${error.message}`, 'error');
                advanceToNextPair('main_loop_error'); // Move to next pair anyway
                isProcessingPair = false; // Release mutex
            });

        } catch (mainLoopError) {
            log(`[MainLoop] Error: ${mainLoopError.message}`, 'error');
            isProcessingPair = false; // Ensure mutex is released on error
            
            // Check if this is a critical system error that should stop the batch
            const errorCategory = categorizeError(mainLoopError, 'main_loop');
            if (errorCategory.category === ERROR_CATEGORIES.FATAL) {
                log(`[MainLoop] Fatal error detected, stopping batch processing`, 'error');
                handleStop(); // Stop the batch processing
            }
        }
    }

    // NEW: Advance to the next pair using ProductSet indices
    function advanceToNextPair(context = 'unknown') {
        if (productSets.length === 0) {
            log(`[Navigation] No ProductSets available (context: ${context})`, 'warn');
            return false;
        }

        // Start from current position
        let setIndex = currentSetIndex;
        let pairIndex = currentPairInSetIndex + 1;

        // Iterate through sets and pairs to find next pending pair
        while (setIndex < productSets.length) {
            const productSet = productSets[setIndex];
            
            if (productSet && productSet.pairs && pairIndex < productSet.pairs.length) {
                // Found a valid position, update indices
                setCurrentProductSetIndex(setIndex, pairIndex, context);
                updateLegacyCurrentIndex(context); // Maintain backward compatibility
                log(`[Navigation] Advanced to Set ${setIndex}, Pair ${pairIndex} (context: ${context})`, 'debug');
                return true;
            }
            
            // Move to next set
            setIndex++;
            pairIndex = 0;
        }

        // Reached end of all sets
        setCurrentProductSetIndex(productSets.length, 0, context);
        updateLegacyCurrentIndex(context); // Maintain backward compatibility
        log(`[Navigation] Reached end of all ProductSets (context: ${context})`, 'debug');
        return false;
    }

    // NEW: Get enhanced processing context for a pair (ProductSet-aware)
    function getPairProcessingContext(pair) {
        // Determine if this is a ProductSet pair or legacy pair
        const result = findPairById(pair.id);
        const isProductSetPair = result && result.set;
        
        let logPrefix, contextDescription, displayName, productSet, setId;
        
        if (isProductSetPair) {
            productSet = result.set;
            setId = productSet.id;
            
            // Enhanced logging with set context
            const setBasedId = pair.setBasedId || `S${setId}P${pair.pairIndex || 0}`;
            const pairDisplayName = pair.displayName || `${productSet.name}.${(pair.pairIndex || 0) + 1}`;
            
            logPrefix = `[Worker-${setBasedId}]`;
            displayName = pairDisplayName;
            contextDescription = `ProductSet "${productSet.name}" (${pairDisplayName})`;
        } else {
            // Legacy pair handling
            logPrefix = `[Worker-${pair.id}]`;
            displayName = `Pair ${pair.id}`;
            contextDescription = `Legacy pair ${pair.id}`;
            productSet = null;
            setId = null;
        }
        
        return {
            isProductSetPair,
            logPrefix,
            contextDescription,
            displayName,
            productSet,
            setId,
            setBasedId: pair.setBasedId,
            pairIndex: pair.pairIndex
        };
    }

    // **ENHANCED: Pure worker function with ProductSet context awareness**
    async function startSinglePair(pair) {
        if (!pair) {
            throw new Error("No pair provided to startSinglePair");
        }

        // Enhanced context detection for ProductSet awareness
        const pairContext = getPairProcessingContext(pair);
        const logPrefix = pairContext.logPrefix;
        let domLock = null;
        
        log(`${logPrefix} Starting processing`, 'info');
        log(`${logPrefix} Context: ${pairContext.contextDescription}`, 'debug');
        log(`${logPrefix} Files: Model="${pair.modelFile?.name || 'N/A'}", Outfit="${pair.outfitFile?.name || 'N/A'}"`, 'debug');

        // Update pair status using ProductSet-aware function
        if (pairContext.isProductSetPair) {
            updatePairStatusInProductSet(pair.id, 'processing', 'worker_start');
            
            // Update set processing start time if this is the first pair in the set
            if (pairContext.productSet && !pairContext.productSet.metadata.processingStartTime) {
                pairContext.productSet.metadata.processingStartTime = Date.now();
                updateProductSetStatus(pairContext.setId, 'processing', 'first_pair_start');
                log(`${logPrefix} Started processing for ProductSet "${pairContext.productSet.name}"`, 'info');
            }
        } else {
            // Legacy pair handling
            setPairStatus(pair, 'processing', 'worker_start');
        }
        
        operationMetrics.pairsAttempted++;

        try {
            // Determine which prompt will be used for this pair
            let promptForThisPair = activePrompt;
            if (!promptForThisPair || promptForThisPair.trim().length === 0) {
                promptForThisPair = DEFAULT_PROMPT;
                log(`${logPrefix} Active prompt empty. Falling back to default prompt for this pair.`, 'warn');
            }

            // STEP 1: Acquire DOM lock to prevent concurrent access
            domLock = await acquireDOMLock(`worker_${pair.id}`, 20000);
            
            // STEP 2: Track this pair's files for validation
            trackPairFiles(pair, `worker_${pair.id}_start`);
            
            // STEP 3: Ensure workspace is completely clean before starting
            const cleanWorkspace = await ensureCleanWorkspace(`worker_${pair.id}_pre_start`, true);
            if (!cleanWorkspace) {
                throw new Error(`Failed to clean workspace before starting pair ${pair.id}`);
            }
            // Prepare for new pairs (except the first one)
            if (currentIndex > 0) {
                log(`${logPrefix} Preparing for new pair (sequence ${currentIndex + 1})...`, 'info');
                // Clear old textarea reference so we find it fresh
                soraChatInput = null;
                // Small wait to ensure any previous generation UI updates are settled
                await new Promise(resolve => setTimeout(resolve, 500));
            }

            // --- SET PROMPT FIRST ---
            log(`${logPrefix} Setting prompt: "${promptForThisPair.substring(0,30)}..."`, 'debug');

            // Always re-find the textarea for new pairs to ensure fresh DOM reference
            if (!soraChatInput || currentIndex > 0) {
                log(`${logPrefix} Finding textarea for prompt ${currentIndex > 0 ? '(new pair)' : '(initial)'}...`, 'debug');

                const textareaResult = findAndValidateTextarea(`worker_${pair.id}_initial`, 'available');
                if (!textareaResult.isValid) {
                    throw new Error(`SORA Chat Input not found or not available for pair ID ${pair.id}: ${textareaResult.reason}. DOM may have changed.`);
                }

                soraChatInput = textareaResult.textarea;
                log(`Found and validated textarea using ${textareaResult.selector} for pair ID ${pair.id}`, 'success');
            }

            // Ensure textarea is properly focused and ready
            try {
                soraChatInput.focus();
                soraChatInput.click(); // Also click to ensure it's active
                await new Promise(resolve => setTimeout(resolve, 200)); // Wait for focus to take effect
                log(`Textarea focused and ready for pair ID ${pair.id}`, 'debug');
            } catch (focusError) {
                log(`Error focusing textarea: ${focusError.message}`, 'warn');
            }

            // Set the prompt
            try {
                soraChatInput.value = ''; // Clear it first
                soraChatInput.dispatchEvent(new Event('input', { bubbles: true, inputType: 'deleteContentBackward' }));
                await new Promise(resolve => setTimeout(resolve, 50));

                // Try native value setter first
                try {
                    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
                    if (nativeInputValueSetter) {
                        nativeInputValueSetter.call(soraChatInput, promptForThisPair);
                    } else {
                        soraChatInput.value = promptForThisPair;
                    }
                } catch (e) {
                    log("Error trying native value setter for prompt, falling back.", "warn");
                    soraChatInput.value = promptForThisPair;
                }

                soraChatInput.dispatchEvent(new Event('input', { bubbles: true, inputType: 'insertText', composed: true }));
                soraChatInput.dispatchEvent(new Event('change', { bubbles: true }));
                soraChatInput.dispatchEvent(new Event('keyup', { bubbles: true, key: 'a', charCode: 65, keyCode: 65}));
                soraChatInput.dispatchEvent(new Event('keydown', { bubbles: true, key: 'a', charCode: 65, keyCode: 65}));
                await new Promise(resolve => setTimeout(resolve, 150));
                log("Prompt setting fully attempted for pair ID " + pair.id, 'info');

                if (soraChatInput.value !== promptForThisPair) {
                    log("WARNING: Textarea value does not match prompt after setting. SORA might not use the correct prompt.", "error");
                }
            } catch (promptError) {
                log(`Error setting prompt for pair ID ${pair.id}: ${promptError.message}`, 'error');
            }
            // --- END SET PROMPT FIRST ---

            // --- Handle Model Image ---
            if (!pair.modelFile) throw new Error("Model file missing for pair ID " + pair.id);
            const modelCopyResult = await copyFileToClipboard(pair.modelFile);

            if (!modelCopyResult.blob) { // If no blob, we can't proceed with synthetic paste
                throw new Error(`Failed to get image blob for model image "${pair.modelFile.name}", pair ID ${pair.id}. Error: ${modelCopyResult.error || 'Unknown error'}`);
            }
            if (!modelCopyResult.success) { // Log if clipboard copy failed, but we still have a blob
                log(`Warning: Failed to copy model image "${pair.modelFile.name}" to system clipboard for pair ID ${pair.id}. Will attempt synthetic paste. Error: ${modelCopyResult.error || 'Unknown error'}`, 'warn');
            }

            const modelPasteOutcome = await attemptPaste(soraChatInput, pair.modelFile.name, modelCopyResult.blob, 1);

            if (!modelPasteOutcome.didPaste && modelPasteOutcome.action !== 'user_will_paste_manually') {
                 // If paste didn't happen AND user isn't manually pasting, it's an error for this pair.
                throw new Error(`Failed to paste model image "${pair.modelFile.name}" for pair ID ${pair.id}. Action: ${modelPasteOutcome.action}, Error: ${modelPasteOutcome.error || 'N/A'}`);
            }
            // If action was 'pasted_programmatically_synthetic', 'pasted_programmatically_exec_command', or 'user_will_paste_manually', we proceed.
            // The case 'user_cancelled_manual_paste' would be caught by !modelPasteOutcome.didPaste and result in the error above.

            if (modelPasteOutcome.action === 'user_will_paste_manually') {
                log(`User will manually paste model image "${pair.modelFile.name}". Waiting for acknowledgement...`, 'info');
                // No extra timeout here, waitForSoraImageAcknowledgement handles it
            }
            if (!await waitForSoraImageAcknowledgement(pair.modelFile.name, 1)) {
                throw new Error(`SORA did not acknowledge model image staging for "${pair.modelFile.name}", pair ID ${pair.id}`);
            }
            
            // STEP 4: Validate that we have exactly 1 image (the model) and it's correct
            const modelValidation = validateWorkspaceState(1, `worker_${pair.id}_after_model`);
            if (!modelValidation.isValid) {
                throw new Error(`Workspace validation failed after model upload for pair ${pair.id}: expected 1 image, found ${modelValidation.actualImages}`);
            }

            // --- Re-find textarea for 2nd image ---
            // Re-find the textarea element for 2nd image since SORA may have changed the DOM
            log(`Re-querying textarea for 2nd image in case SORA changed the DOM...`, 'info');

            const freshTextareaResult = findAndValidateTextarea(`worker_${pair.id}_second_image`, 'available');
            if (freshTextareaResult.isValid) {
                soraChatInput = freshTextareaResult.textarea;
                log(`Found fresh textarea using ${freshTextareaResult.selector}, has content: ${freshTextareaResult.textarea.value.length > 0}`, 'success');
            } else {
                log(`Warning: Could not find fresh textarea (${freshTextareaResult.reason}), using original`, 'warn');
                
                // Validate the existing textarea is still usable
                const existingValidation = await validateDOMElementState(soraChatInput, 'textarea', `worker_${pair.id}_existing_check`);
                if (!existingValidation.isValid) {
                    throw new Error(`Existing textarea is no longer valid: ${existingValidation.reason}`);
                }
            }

            // --- Handle Outfit Image ---
            if (!pair.outfitFile) throw new Error("Outfit file missing for pair ID " + pair.id);
            const outfitCopyResult = await copyFileToClipboard(pair.outfitFile);

            if (!outfitCopyResult.blob) { // If no blob, we can't proceed
                throw new Error(`Failed to get image blob for outfit image "${pair.outfitFile.name}", pair ID ${pair.id}. Error: ${outfitCopyResult.error || 'Unknown error'}`);
            }
            if (!outfitCopyResult.success) { // Log if clipboard copy failed, but we still have a blob
                log(`Warning: Failed to copy outfit image "${pair.outfitFile.name}" to system clipboard for pair ID ${pair.id}. Will attempt synthetic paste. Error: ${outfitCopyResult.error || 'Unknown error'}`, 'warn');
            }

            const outfitPasteOutcome = await attemptPaste(soraChatInput, pair.outfitFile.name, outfitCopyResult.blob, 2);

            if (!outfitPasteOutcome.didPaste && outfitPasteOutcome.action !== 'user_will_paste_manually') {
                throw new Error(`Failed to paste outfit image "${pair.outfitFile.name}" for pair ID ${pair.id}. Action: ${outfitPasteOutcome.action}, Error: ${outfitPasteOutcome.error || 'N/A'}`);
            }

            if (outfitPasteOutcome.action === 'user_will_paste_manually') {
                log(`User will manually paste outfit image "${pair.outfitFile.name}". Waiting for acknowledgement...`, 'info');
            }

            if (!await waitForSoraImageAcknowledgement(pair.outfitFile.name, 2)) {
                throw new Error(`SORA did not acknowledge outfit image staging for "${pair.outfitFile.name}", pair ID ${pair.id}`);
            }
            
            // STEP 5: Validate that we have exactly 2 images (model + outfit) and they're correct
            const outfitValidation = validateWorkspaceState(2, `worker_${pair.id}_after_outfit`);
            if (!outfitValidation.isValid) {
                throw new Error(`Workspace validation failed after outfit upload for pair ${pair.id}: expected 2 images, found ${outfitValidation.actualImages}`);
            }
            
            // STEP 6: Final file validation - ensure we're processing the right files
            if (!validatePairFiles(pair, `worker_${pair.id}_final_check`)) {
                throw new Error(`File validation failed for pair ${pair.id} - files don't match expected pair`);
            }

            // --- TARGET THE "REMIX" BUTTON WHEN ENABLED ---
            let remixButton = null;
            log("Attempting to find active 'Remix' button with enhanced error handling...", 'info');

            try {
                log(`Finding Remix button for pair ID ${pair.id}...`, 'info');
                const buttonResult = await findAndValidateRemixButton(`worker_${pair.id}_button`, 15000); // 15 second timeout
                
                if (!buttonResult.isValid) {
                    throw new Error(`Remix button not found or not valid for pair ID ${pair.id}: ${buttonResult.reason}`);
                }
                
                remixButton = buttonResult.button;
                soraSendButton = remixButton;
                log(`Found Remix button using ${buttonResult.method} method for pair ID ${pair.id}`, 'success');

                // Validate button before clicking
                const buttonValidation = await validateDOMElementState(soraSendButton, 'button', `worker_${pair.id}_button_validate`);
                if (!buttonValidation.isValid) {
                    throw new Error(`Remix button validation failed for pair ID ${pair.id}: ${buttonValidation.reason}`);
                }

                log(`Found and validated SORA 'Remix' button. Attempting click for pair ID ${pair.id}`, 'info');

                    // Enhanced button click with error handling
                    try {
                        soraSendButton.focus();
                        await new Promise(resolve => setTimeout(resolve, 100));
                        soraSendButton.click();
                        log(`SORA 'Remix' button clicked successfully for pair ID ${pair.id}`, 'success');
                        
                        // Wait a moment for any error popup to appear
                        await new Promise(resolve => setTimeout(resolve, 500));
                        
                        // Check for generation limit error popup after clicking
                        const errorPopups = Array.from(document.querySelectorAll('div[data-side="top"][data-align="center"][data-state="instant-open"]'));
                        for (const popup of errorPopups) {
                            const textContent = popup.textContent || '';
                            if (textContent.includes('You can only generate 2 images or videos at a time')) {
                                log(`[Remix-Error] Detected generation limit popup after remix click for pair ${pair.id}: "${textContent.trim()}"`, 'warn');
                                throw new Error(`Generation limit reached when clicking remix button for pair ${pair.id}. SORA says: "${textContent.trim()}"`);
                            }
                        }
                        
                        // Also check for generic generation limit popups
                        const genericPopups = Array.from(document.querySelectorAll('.surface-popover, [role="tooltip"]'));
                        for (const popup of genericPopups) {
                            const textContent = popup.textContent || '';
                            if (textContent.includes('can only generate') && textContent.includes('at a time')) {
                                log(`[Remix-Error] Detected generic generation limit popup after remix click for pair ${pair.id}: "${textContent.trim()}"`, 'warn');
                                throw new Error(`Generation limit reached when clicking remix button for pair ${pair.id}. SORA says: "${textContent.trim()}"`);
                            }
                        }
                        
                        log(`[Remix-Validation] No error popup detected after remix click for pair ${pair.id}`, 'debug');
                        
                    } catch (clickError) {
                        log(`Error clicking Remix button: ${clickError.message}`, 'error');
                        throw new Error(`Failed to click Remix button for pair ID ${pair.id}: ${clickError.message}`);
                }
            } catch (buttonError) {
                log(`Critical error in remix button handling: ${buttonError.message}`, 'error');
                throw buttonError;
            }
            // --- END TARGET THE "REMIX" BUTTON ---

            // Enhanced generation completion waiting with error handling
            try {
                // CRITICAL SAFETY CHECK: Never allow more than MAX_CONCURRENT_GENERATIONS
                // Check BEFORE incrementing the counter
                if (activeGenerations >= MAX_CONCURRENT_GENERATIONS) {
                    throw new Error(`Generation limit reached: Internal counter shows ${activeGenerations} active generations, which equals or exceeds limit of ${MAX_CONCURRENT_GENERATIONS}. Cannot start pair ${pair.id}!`);
                }

                const generationStartTime = Date.now();
                incrementActiveGenerations(pair.id, 'generation_start');
                generationStartTimes.set(pair.id, generationStartTime);
                log(`Starting generation for pair ID ${pair.id}... (Active: ${activeGenerations}/${MAX_CONCURRENT_GENERATIONS})`, 'info');

                // Start the completion waiting in the background (don't await it here)
                waitForGenerationCompletion(pair.id, generationStartTime).then(() => {
                    setPairStatus(pair, 'done', 'generation_completion_success');
                    cleanupErrorRecoveryTracking(pair.id, 'generation_success');
                    log(`Pair ID ${pair.id} completed successfully. Active generations now: ${activeGenerations}`, 'success');
                }).catch((generationError) => {
                    // Make sure to decrement counter on error
                    decrementActiveGenerations(pair.id, 'completion_error');
                    generationStartTimes.delete(pair.id);
                    setPairStatus(pair, 'error', 'generation_completion_error');
                    cleanupErrorRecoveryTracking(pair.id, 'generation_error');
                    log(`Error during generation completion for pair ID ${pair.id}: ${generationError.message}. Active generations: ${activeGenerations}`, 'error');
                });

                // Don't await completion - let it run in background and continue to next pair
                log(`Pair ID ${pair.id} generation started, moving to next pair without waiting`, 'info');
                operationMetrics.pairsSucceeded++;
                
                // Reset file tracking now that upload is complete and generation started
                currentPairFiles = { model: null, outfit: null };
                log(`[File-Track] Reset file tracking after successful upload of pair ${pair.id}`, 'debug');
                
                // Release DOM lock after successful generation start
                if (domLock) {
                    domLock.release();
                    domLock = null;
                }

            } catch (generationError) {
                // Make sure to decrement counter on error
                decrementActiveGenerations(pair.id, 'start_error');
                generationStartTimes.delete(pair.id);
                log(`Error starting generation for pair ID ${pair.id}: ${generationError.message}. Active generations: ${activeGenerations}`, 'error');
                throw new Error(`Generation failed to start for pair ID ${pair.id}: ${generationError.message}`);
            }

        } catch (err) {
            log(`${logPrefix} Error processing: ${err.message}`, 'error');
            
            // Check if this is a generation limit error - if so, treat it differently
            if (err.message.includes('Generation limit reached') || 
                err.message.includes('You can only generate') || 
                err.message.includes('can only generate') ||
                err.message.includes('equals or exceeds limit')) {
                log(`${logPrefix} Generation limit error detected - resetting pair ${pair.id} to pending for retry`, 'warn');
                setPairStatus(pair, 'pending', 'generation_limit_retry');
                
                // Don't count this as a failed pair since it's just a temporary limit
                // The pair will be retried when slots become available
                
                // Add UI refresh after a short delay
                setTimeout(() => {
                    refreshAllPairStatusInUI('generation_limit_ui_sync');
                }, 500);
                
                // CRITICAL: Release DOM lock before returning
                if (domLock) {
                    domLock.release();
                    domLock = null;
                }
                
                return; // Exit without incrementing failed counter or throwing
            }
            
            operationMetrics.pairsFailed++;

            // Enhanced error logging with more details
            if (err.stack) {
                console.error(`[SORA Helper] Full error stack for pair ID ${pair.id}:`, err.stack);
            }
            
            // CRITICAL: Release DOM lock before cleanup
            if (domLock) {
                domLock.release();
                domLock = null;
            }
            
            // Try comprehensive error recovery with ProductSet-level awareness
            try {
                // First try set-level error handling if pair belongs to a ProductSet
                let setRecoveryAttempted = false;
                if (pair.setId) {
                    try {
                        const setRecoveryResult = await handleSetLevelError(pair.setId, pair.id, err, `worker_${pair.id}_set_error`);
                        setRecoveryAttempted = true;
                        
                        if (setRecoveryResult.shouldContinue) {
                            log(`${logPrefix} Set-level error recovery successful for set ${pair.setId}, action: ${setRecoveryResult.action}`, 'info');
                            
                            // If set recovery was successful, also try pair-level recovery
                            const pairRecoveryResult = await handleErrorWithRecovery(pair.id, err, `worker_${pair.id}_pair_error_after_set`);
                            
                            if (pairRecoveryResult.shouldRetry) {
                                log(`${logPrefix} Combined set+pair recovery successful, retrying pair ${pair.id}`, 'info');
                                setPairStatus(pair, 'pending', 'worker_combined_recovery_retry');
                                
                                setTimeout(() => {
                                    refreshAllPairStatusInUI('worker_combined_recovery_ui_sync');
                                }, 500);
                                
                                return; // Exit without throwing, let main loop retry
                            }
                        } else {
                            log(`${logPrefix} Set-level error handling indicates set should not continue (action: ${setRecoveryResult.action})`, 'warn');
                            // Set might be isolated or failed - continue with pair-level handling
                        }
                    } catch (setRecoveryError) {
                        log(`${logPrefix} Set-level error recovery failed: ${setRecoveryError.message}`, 'warn');
                        // Continue with pair-level recovery as fallback
                    }
                }
                
                // Standard pair-level error recovery (as fallback or primary)
                const recoveryResult = await handleErrorWithRecovery(pair.id, err, `worker_${pair.id}_main_error`);
                
                if (recoveryResult.shouldRetry) {
                    log(`${logPrefix} ${setRecoveryAttempted ? 'Fallback ' : ''}pair-level error recovery successful, retrying pair ${pair.id} (action: ${recoveryResult.action})`, 'info');
                    setPairStatus(pair, 'pending', 'worker_recovery_retry'); // Reset to pending for retry
                    
                    // Add UI refresh after a short delay to ensure proper sync
                    setTimeout(() => {
                        refreshAllPairStatusInUI('worker_recovery_ui_sync');
                    }, 500);
                    
                    return; // Exit without throwing, let main loop retry
                } else {
                    log(`${logPrefix} Error recovery failed or not applicable (action: ${recoveryResult.action})`, 'error');
                    setPairStatus(pair, 'error', 'worker_recovery_failed');
                }
                
            } catch (recoveryError) {
                log(`${logPrefix} Critical error during recovery: ${recoveryError.message}`, 'error');
                setPairStatus(pair, 'error', 'worker_recovery_error');
            }
            
            // Call comprehensive workspace cleanup on error
            try {
                await ensureCleanWorkspace(`worker_${pair.id}_error_cleanup`, true);
                log(`${logPrefix} Workspace cleaned up after error`, 'info');
            } catch (cleanupError) {
                log(`${logPrefix} Error during cleanup: ${cleanupError.message}`, 'warn');
            }
            
            // Reset tracked files
            currentPairFiles = { model: null, outfit: null };
            
            // Clean up error recovery tracking
            cleanupErrorRecoveryTracking(pair.id, 'worker_error_cleanup');
            
            throw err; // Re-throw so main loop can handle it
        }

        log(`${logPrefix} Processing completed successfully`, 'success');
    }

    function handleBatchGenerate() {
        try {
            log("--- handleBatchGenerate: Entry ---", 'debug');

            // Validate image pairs before starting
            if (!imagePairsData || imagePairsData.length === 0) {
                alert("No image pairs found. Please add at least one image pair before starting batch generation.");
                log("No image pairs available for batch generation.", 'error');
                return;
            }

            const validPairs = imagePairsData.filter(pair => pair.modelFile && pair.outfitFile);
            if (validPairs.length === 0) {
                alert("No valid image pairs found. Each pair must have both a model image and an outfit image.");
                log("No valid image pairs with both model and outfit images.", 'error');
                return;
            }

            const trimmedPrompt = (activePrompt || '').trim();
            if (trimmedPrompt.length === 0) {
                alert("Your prompt is empty. Please enter a prompt or reset to the default before starting batch generation.");
                log("Batch start blocked: prompt is empty.", 'error');
                if (isPromptSectionCollapsed) {
                    togglePromptSection(false, 'auto_show_for_validation');
                }
                if (promptTextarea) {
                    promptTextarea.focus();
                }
                return;
            }

            log(`Found ${validPairs.length} valid image pairs out of ${imagePairsData.length} total pairs.`, 'info');

            // Enhanced SORA UI element detection with error handling
            try {
                soraChatInput = getSoraElement('textarea[placeholder="Describe your image..."]', "SORA Chat Input");
                if (!soraChatInput) {
                    // Try alternative selectors
                    soraChatInput = document.querySelector('textarea[placeholder*="image"]') ||
                                   document.querySelector('textarea.max-h-\\[80vh\\]') ||
                                   document.querySelector('textarea');
                    if (soraChatInput) {
                        log("Found chat input using alternative selector.", 'warn');
                    }
                }
                log(`--- handleBatchGenerate: soraChatInput found: ${!!soraChatInput}`, 'debug');
            } catch (inputError) {
                log(`Error finding chat input: ${inputError.message}`, 'error');
            }

            let initialSendButtonCheck = null;
            // This correctly looks for the up-arrow button structure, which is present initially
            try {
                const buttons = Array.from(document.querySelectorAll('button'));
                initialSendButtonCheck = buttons.find(btn => {
                    try {
                        const svgPath = btn.querySelector('svg path[d^="M11.293 5.293"]'); // Specific path for the up-arrow
                        const srSpan = btn.querySelector('span.sr-only');
                        const hasCreateImageText = srSpan && srSpan.textContent.trim() === "Create image";
                        // It must have the SVG or the screen reader text typically associated with the up-arrow send button
                        return svgPath && hasCreateImageText;
                    } catch (btnError) {
                        return false;
                    }
                });
            } catch (e) {
                log(`--- handleBatchGenerate: Error finding initial send button (up-arrow structure): ${e.message}`, 'error');
            }
            log(`--- handleBatchGenerate: initialSendButtonCheck (up-arrow structure) found: ${!!initialSendButtonCheck}`, 'debug');

            try {
                generatedMediaContainer = getSoraElement('div[data-index="1"] > div.flex.flex-col > div.grid', "Generated Media Container");
                log(`--- handleBatchGenerate: generatedMediaContainer found: ${!!generatedMediaContainer}`, 'debug');
            } catch (containerError) {
                log(`Error finding generated media container: ${containerError.message}`, 'warn');
            }

            if (!soraChatInput || !initialSendButtonCheck) {
                alert("Essential SORA UI elements (Chat Input or Send Button structure) not found. Script cannot run. Check console and selectors.");
                log("Fatal: Essential SORA UI elements missing in handleBatchGenerate.", 'error');
                return;
            }

            if (!generatedMediaContainer) {
                log("Warning: Generated Media Container not found in handleBatchGenerate. Completion detection via MutationObserver might be impaired.", 'error');
            }

            log(`--- handleBatchGenerate: isStopped = ${isStopped}, isPaused = ${isPaused}`, 'debug');

            if (isStopped) {
                log("--- handleBatchGenerate: Condition 'isStopped' is true. Starting new batch.", 'debug');
                setCurrentIndex(0, 'batch_generate_start');
                
                // NEW: Initialize ProductSet indices for multi-set processing
                if (productSets.length > 0) {
                    setCurrentProductSetIndex(0, 0, 'batch_generate_start');
                    log(`--- handleBatchGenerate: Initialized ProductSet indices to Set 0, Pair 0`, 'debug');
                }
                
                isStopped = false;
                isPaused = false;
                isProcessingPair = false; // Reset mutex
                currentPairFiles = { model: null, outfit: null }; // Reset file tracking for new batch
                batchGenerateBtn.textContent = 'PROCESSING...';
                batchGenerateBtn.disabled = true;
                pauseBtn.disabled = false;
                stopBtn.disabled = false;
                log("--- handleBatchGenerate: Starting main loop for new batch.", 'debug');
                
                // Start the main loop (if not already running)
                if (!mainLoopInterval) {
                    mainLoopInterval = setInterval(mainLoop, 2500); // Every 2.5 seconds
                    log("--- handleBatchGenerate: Main loop started.", 'info');
                }
                
            } else if (isPaused) {
                log("--- handleBatchGenerate: Condition 'isPaused' is true. Resuming batch.", 'debug');
                isPaused = false;
                batchGenerateBtn.textContent = 'PROCESSING...';
                batchGenerateBtn.disabled = true;
                pauseBtn.disabled = false;
                stopBtn.disabled = false;
                log("--- handleBatchGenerate: Resuming via main loop.", 'debug');
                
                // Ensure main loop is running
                if (!mainLoopInterval) {
                    mainLoopInterval = setInterval(mainLoop, 2500); // Every 2.5 seconds
                    log("--- handleBatchGenerate: Main loop restarted for resume.", 'info');
                }
            } else if (!isStopped && !isPaused) {
                log("--- handleBatchGenerate: Batch is already considered running.", 'debug');
                batchGenerateBtn.disabled = true;
            } else {
                log("--- handleBatchGenerate: No condition met to start/resume. This shouldn't happen.", 'error');
            }
            log("--- handleBatchGenerate: Exit ---", 'debug');
        } catch (batchError) {
            log(`Error in handleBatchGenerate: ${batchError.message}`, 'error');
            // Reset to safe state - but keep pause/stop available for user control
            isStopped = true;
            batchGenerateBtn.disabled = false;
            batchGenerateBtn.textContent = 'BATCH GENERATE';
            // Don't disable pause/stop buttons - user should be able to stop if there's a problem
        }
    }

    function handlePause() {
        try {
            if (!isPaused) {
                isPaused = true;
                if (pauseBtn) {
                    pauseBtn.textContent = 'PAUSED'; // Indicate it's successfully paused
                }
                if (batchGenerateBtn) {
                    batchGenerateBtn.textContent = 'RESUME';
                    batchGenerateBtn.disabled = false; // Allow resuming
                }
                log("Pause requested. Will pause after current item finishes.", 'info');
            }
        } catch (pauseError) {
            log(`Error handling pause: ${pauseError.message}`, 'error');
            // Ensure pause state is set even if UI update fails
            isPaused = true;
        }
    }

    function handleStop() {
        try {
            isStopped = true;
            isPaused = false; // Ensure pause is also cleared
            isProcessingPair = false; // Reset mutex

            // Stop the main loop
            if (mainLoopInterval) {
                clearInterval(mainLoopInterval);
                mainLoopInterval = null;
                log("Main loop stopped", 'info');
            }

            // Reset all state tracking
            activeGenerations = 0;
            generationStartTimes.clear();
            lastGlobalCompletionTime = 0;
            isDOMBusy = false; // Reset DOM lock
            currentPairFiles = { model: null, outfit: null }; // Reset file tracking
            
            // Clean up all policy violation tracking
            policyViolationChecks.clear();
            violationRetryQueues.clear();
            
            // Clean up all error recovery tracking
            errorRecoveryAttempts.clear();
            circuitBreakerStates.clear();
            
            // Reset operation metrics
            operationMetrics.pairsAttempted = 0;
            operationMetrics.pairsSucceeded = 0;
            operationMetrics.pairsFailed = 0;
            operationMetrics.recoveryAttempts = 0;
            operationMetrics.circuitBreakerTrips = 0;
            operationMetrics.startTime = Date.now();

            // Safely disconnect observer
            try {
                if (generationCompletionObserver) {
                    generationCompletionObserver.disconnect();
                    generationCompletionObserver = null;
                }
            } catch (observerError) {
                log(`Error disconnecting generation observer: ${observerError.message}`, 'warn');
            }

            // Update UI elements safely
            try {
                if (batchGenerateBtn) {
                    batchGenerateBtn.textContent = 'BATCH GENERATE';
                    batchGenerateBtn.disabled = false;
                }
                if (pauseBtn) {
                    pauseBtn.textContent = 'PAUSE';
                    pauseBtn.disabled = true;
                }
                if (stopBtn) {
                    stopBtn.disabled = true;
                }
            } catch (uiError) {
                log(`Error updating UI during stop: ${uiError.message}`, 'warn');
            }

            log(`Stop requested. Batch processing halted. Reset generation tracking.`, 'info');

            // Update pair statuses safely
            try {
                if (imagePairsData && Array.isArray(imagePairsData)) {
                    imagePairsData.forEach(p => {
                        if (p && p.status === 'processing') {
                            p.status = 'pending'; // Or 'stopped'
                            try {
                                updatePairStatusInUI(p.id, 'Stopped');
                            } catch (statusError) {
                                log(`Error updating status for pair ${p.id}: ${statusError.message}`, 'warn');
                            }
                        }
                    });
                }
            } catch (pairError) {
                log(`Error updating pair statuses during stop: ${pairError.message}`, 'warn');
            }

            setCurrentIndex(-1, 'handle_stop_reset'); // Reset index effectively
        } catch (stopError) {
            log(`Error handling stop: ${stopError.message}`, 'error');
            // Ensure stop state is set even if other operations fail
            isStopped = true;
            isPaused = false;
            activeGenerations = 0;
            generationStartTimes.clear();
            lastGlobalCompletionTime = 0;
        }
    }

    // --- ENHANCED SAVE/LOAD FUNCTIONALITY WITH PRODUCTSET SUPPORT ---
    async function handleSave() {
        try {
            log("Saving current ProductSet batch progress...", 'info');

            // Check if we have ProductSets to save
            if (!productSets || productSets.length === 0) {
                // Fallback: try to save legacy imagePairsData if exists
            if (!imagePairsData || imagePairsData.length === 0) {
                    alert("No ProductSets or image pairs to save.");
                return;
                }
                return await handleLegacySave();
            }

            // Convert ProductSets to saveable format
            const savedProductSets = [];
            let totalPairs = 0;
            let completedPairs = 0;

            for (const productSet of productSets) {
                if (!productSet) continue;

                const savedSet = {
                    id: productSet.id,
                    name: productSet.name,
                    status: productSet.status,
                    progress: productSet.progress,
                    metadata: { ...productSet.metadata },
                    errorInfo: productSet.errorInfo ? { ...productSet.errorInfo } : null,
                    modelFile: null,
                    outfitFiles: [],
                    pairs: []
                };

                // Convert model file to base64
                if (productSet.modelFile) {
                    try {
                        const modelBase64 = await fileToBase64(productSet.modelFile);
                        savedSet.modelFile = {
                            name: productSet.modelFile.name,
                            type: productSet.modelFile.type,
                            size: productSet.modelFile.size,
                            lastModified: productSet.modelFile.lastModified,
                            data: modelBase64
                        };
                    } catch (e) {
                        log(`Error converting model file to base64 for set ${productSet.id}: ${e.message}`, 'warn');
                    }
                }

                // Convert outfit files to base64
                if (productSet.outfitFiles && Array.isArray(productSet.outfitFiles)) {
                    for (const outfitFile of productSet.outfitFiles) {
                        if (!outfitFile) continue;
                        try {
                            const outfitBase64 = await fileToBase64(outfitFile);
                            savedSet.outfitFiles.push({
                                name: outfitFile.name,
                                type: outfitFile.type,
                                size: outfitFile.size,
                                lastModified: outfitFile.lastModified,
                                data: outfitBase64
                            });
                        } catch (e) {
                            log(`Error converting outfit file to base64 for set ${productSet.id}: ${e.message}`, 'warn');
                        }
                    }
                }

                // Save pair information (files already converted above)
                if (productSet.pairs && Array.isArray(productSet.pairs)) {
                    productSet.pairs.forEach(pair => {
                        if (!pair) return;
                        savedSet.pairs.push({
                            id: pair.id,
                            setId: pair.setId,
                            setName: pair.setName,
                            pairIndex: pair.pairIndex,
                            displayName: pair.displayName,
                            setBasedId: pair.setBasedId,
                            status: pair.status,
                            modelFileName: pair.modelFile ? pair.modelFile.name : null,
                            outfitFileName: pair.outfitFile ? pair.outfitFile.name : null
                        });
                        totalPairs++;
                        if (pair.status === 'done') completedPairs++;
                    });
                }

                savedProductSets.push(savedSet);
            }

            const saveData = {
                version: "2.0", // Updated version for ProductSet support
                format: "productSets",
                timestamp: new Date().toISOString(),
                // ProductSet-specific state
                productSets: savedProductSets,
                nextProductSetId: nextProductSetId,
                currentSetIndex: currentSetIndex,
                currentPairInSetIndex: currentPairInSetIndex,
                // Legacy state for compatibility
                currentIndex: currentIndex,
                nextPairId: nextPairId,
                // Processing state
                isStopped: isStopped,
                isPaused: isPaused,
                // Statistics
                totalSets: productSets.length,
                totalPairs: totalPairs,
                completedPairs: completedPairs,
                // Metrics snapshot
                operationMetrics: { ...operationMetrics }
            };

            // Download as JSON file
            const blob = new Blob([JSON.stringify(saveData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `sora-productsets-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            log(`ProductSet batch progress saved successfully! ${savedProductSets.length} sets, ${totalPairs} total pairs (${completedPairs} completed)`, 'success');
        } catch (saveError) {
            log(`Error saving ProductSet batch progress: ${saveError.message}`, 'error');
            alert("Error saving batch progress. Check console for details.");
        }
    }

    async function handleLegacySave() {
        try {
            log("Saving legacy image pairs format...", 'info');

            // Convert image files to base64 for saving
            const savedPairs = [];
            for (const pair of imagePairsData) {
                if (!pair) continue;

                const savedPair = {
                    id: pair.id,
                    status: pair.status,
                    modelFile: null,
                    outfitFile: null
                };

                // Convert model file to base64
                if (pair.modelFile) {
                    try {
                        const modelBase64 = await fileToBase64(pair.modelFile);
                        savedPair.modelFile = {
                            name: pair.modelFile.name,
                            type: pair.modelFile.type,
                            size: pair.modelFile.size,
                            lastModified: pair.modelFile.lastModified,
                            data: modelBase64
                        };
                    } catch (e) {
                        log(`Error converting model file to base64 for pair ${pair.id}: ${e.message}`, 'warn');
                    }
                }

                // Convert outfit file to base64
                if (pair.outfitFile) {
                    try {
                        const outfitBase64 = await fileToBase64(pair.outfitFile);
                        savedPair.outfitFile = {
                            name: pair.outfitFile.name,
                            type: pair.outfitFile.type,
                            size: pair.outfitFile.size,
                            lastModified: pair.outfitFile.lastModified,
                            data: outfitBase64
                        };
                    } catch (e) {
                        log(`Error converting outfit file to base64 for pair ${pair.id}: ${e.message}`, 'warn');
                    }
                }

                savedPairs.push(savedPair);
            }

            const saveData = {
                version: "1.0",
                format: "legacy",
                timestamp: new Date().toISOString(),
                currentIndex: currentIndex,
                nextPairId: nextPairId,
                isStopped: isStopped,
                isPaused: isPaused,
                pairs: savedPairs,
                totalPairs: imagePairsData.length,
                completedPairs: imagePairsData.filter(p => p && p.status === 'done').length
            };

            // Download as JSON file
            const blob = new Blob([JSON.stringify(saveData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `sora-legacy-batch-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            log(`Legacy batch progress saved successfully! ${savedPairs.length} pairs saved`, 'success');
        } catch (saveError) {
            log(`Error saving legacy batch progress: ${saveError.message}`, 'error');
            throw saveError;
        }
    }

    async function handleLoad() {
        try {
            // Create file input
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = '.json';
            fileInput.style.display = 'none';

            fileInput.onchange = async (event) => {
                try {
                    const file = event.target.files[0];
                    if (!file) return;

                    log("Loading batch progress from file...", 'info');

                    const text = await file.text();
                    const saveData = JSON.parse(text);

                    // Validate save data structure
                    if (!saveData.version) {
                        throw new Error("Invalid save file format - missing version");
                    }

                    // Stop any current processing
                    if (!isStopped) {
                        handleStop();
                        await new Promise(resolve => setTimeout(resolve, 500)); // Wait for stop to complete
                    }

                    // Determine format and load accordingly
                    if (saveData.format === 'productSets' && saveData.version === '2.0') {
                        await loadProductSetFormat(saveData);
                    } else if (saveData.format === 'legacy' || saveData.version === '1.0') {
                        await loadLegacyFormat(saveData);
                    } else {
                        throw new Error(`Unsupported save file format: ${saveData.format} v${saveData.version}`);
                    }

                } catch (parseError) {
                    log(`Error loading batch progress: ${parseError.message}`, 'error');
                    alert(`Error loading file: ${parseError.message}`);
                }
            };

            document.body.appendChild(fileInput);
            fileInput.click();
            document.body.removeChild(fileInput);

        } catch (loadError) {
            log(`Error setting up file load: ${loadError.message}`, 'error');
            alert("Error setting up file load. Check console for details.");
        }
    }

    async function loadProductSetFormat(saveData) {
        try {
            log(`Loading ProductSet format v${saveData.version}...`, 'info');

            // Validate ProductSet save data
            if (!saveData.productSets || !Array.isArray(saveData.productSets)) {
                throw new Error("Invalid ProductSet save file - missing productSets array");
            }

            // Clear current state
            productSets = [];
                    imagePairsData = [];
                    pairsContainer.innerHTML = '';
            mainPanel.style.display = 'block';

            // Restore ProductSet state variables
            nextProductSetId = saveData.nextProductSetId || 1;
            currentSetIndex = saveData.currentSetIndex || -1;
            currentPairInSetIndex = saveData.currentPairInSetIndex || -1;
            setCurrentIndex(saveData.currentIndex || -1, 'load_productset_restore');
                    nextPairId = saveData.nextPairId || 0;
            isStopped = saveData.isStopped !== false;
            isPaused = saveData.isPaused || false;

            // Restore metrics if available
            if (saveData.operationMetrics) {
                Object.assign(operationMetrics, saveData.operationMetrics);
            }

            // Restore ProductSets
            let restoredSets = 0;
            let restoredPairs = 0;

            for (const savedSet of saveData.productSets) {
                if (!savedSet) continue;

                const productSet = {
                    id: savedSet.id,
                    name: savedSet.name || `ProductSet ${savedSet.id}`,
                    status: savedSet.status || 'pending',
                    progress: savedSet.progress || { completed: 0, failed: 0, pending: 0, processing: 0 },
                    metadata: savedSet.metadata || { createdAt: Date.now() },
                    errorInfo: savedSet.errorInfo || null,
                    modelFile: null,
                    outfitFiles: [],
                    pairs: []
                };

                // Restore model file
                if (savedSet.modelFile && savedSet.modelFile.data) {
                    try {
                        productSet.modelFile = base64ToFile(
                            savedSet.modelFile.data,
                            savedSet.modelFile.name,
                            savedSet.modelFile.type
                        );
                    } catch (e) {
                        log(`Error restoring model file for set ${savedSet.id}: ${e.message}`, 'warn');
                    }
                }

                // Restore outfit files
                if (savedSet.outfitFiles && Array.isArray(savedSet.outfitFiles)) {
                    for (const savedOutfit of savedSet.outfitFiles) {
                        if (!savedOutfit || !savedOutfit.data) continue;
                        try {
                            const outfitFile = base64ToFile(
                                savedOutfit.data,
                                savedOutfit.name,
                                savedOutfit.type
                            );
                            productSet.outfitFiles.push(outfitFile);
                        } catch (e) {
                            log(`Error restoring outfit file for set ${savedSet.id}: ${e.message}`, 'warn');
                        }
                    }
                }

                // Restore pairs (regenerate files from ProductSet files)
                if (savedSet.pairs && Array.isArray(savedSet.pairs)) {
                    for (const savedPair of savedSet.pairs) {
                        if (!savedPair) continue;

                        const pair = {
                            id: savedPair.id,
                            setId: savedPair.setId,
                            setName: savedPair.setName,
                            pairIndex: savedPair.pairIndex,
                            displayName: savedPair.displayName,
                            setBasedId: savedPair.setBasedId,
                            status: savedPair.status || 'pending',
                            modelFile: productSet.modelFile, // Reference to set's model file
                            outfitFile: null
                        };

                        // Find matching outfit file by name
                        if (savedPair.outfitFileName && productSet.outfitFiles) {
                            const matchingOutfit = productSet.outfitFiles.find(f => f.name === savedPair.outfitFileName);
                            if (matchingOutfit) {
                                pair.outfitFile = matchingOutfit;
                            }
                        }

                        productSet.pairs.push(pair);
                        restoredPairs++;
                    }
                }

                // Regenerate pairs if they weren't saved or failed to restore
                if (productSet.pairs.length === 0 && productSet.modelFile && productSet.outfitFiles.length > 0) {
                    log(`Regenerating pairs for ProductSet ${productSet.id} from files`, 'info');
                    const generatedPairs = generatePairsForProductSet(productSet);
                    restoredPairs += generatedPairs.length;
                }

                productSets.push(productSet);
                restoredSets++;
            }

            // Sync to legacy format for compatibility
            syncImagePairsDataWithProductSets();

            // Refresh UI
            refreshProductSetCards();
            if (productSets.length > 0) {
                createPairsDisplay();
            }

            log(`ProductSet load successful! Restored ${restoredSets} sets with ${restoredPairs} total pairs`, 'success');
            alert(`Successfully loaded ${restoredSets} ProductSets with ${restoredPairs} total pairs.`);

        } catch (productSetLoadError) {
            log(`Error loading ProductSet format: ${productSetLoadError.message}`, 'error');
            throw productSetLoadError;
        }
    }

    async function loadLegacyFormat(saveData) {
        try {
            log(`Loading legacy format v${saveData.version}...`, 'info');

            // Validate legacy save data
            if (!saveData.pairs || !Array.isArray(saveData.pairs)) {
                throw new Error("Invalid legacy save file - missing pairs array");
            }

            // Clear current state
            productSets = [];
            imagePairsData = [];
            pairsContainer.innerHTML = '';

            // Restore legacy state variables
            setCurrentIndex(saveData.currentIndex || -1, 'load_legacy_restore');
            nextPairId = saveData.nextPairId || 0;
            isStopped = saveData.isStopped !== false;
                    isPaused = saveData.isPaused || false;

                    // Restore pairs
                    for (const savedPair of saveData.pairs) {
                        if (!savedPair) continue;

                        const pair = {
                            id: savedPair.id,
                            status: savedPair.status || 'pending',
                            modelFile: null,
                            outfitFile: null
                        };

                        // Convert base64 back to File objects
                        if (savedPair.modelFile && savedPair.modelFile.data) {
                            try {
                                pair.modelFile = base64ToFile(
                                    savedPair.modelFile.data,
                                    savedPair.modelFile.name,
                                    savedPair.modelFile.type
                                );
                            } catch (e) {
                                log(`Error restoring model file for pair ${pair.id}: ${e.message}`, 'warn');
                            }
                        }

                        if (savedPair.outfitFile && savedPair.outfitFile.data) {
                            try {
                                pair.outfitFile = base64ToFile(
                                    savedPair.outfitFile.data,
                                    savedPair.outfitFile.name,
                                    savedPair.outfitFile.type
                                );
                            } catch (e) {
                                log(`Error restoring outfit file for pair ${pair.id}: ${e.message}`, 'warn');
                            }
                        }

                        imagePairsData.push(pair);
            }

            // Show pairs container and hide upload section
            const uploadSection = document.getElementById('sora-upload-section');
            if (uploadSection) {
                uploadSection.style.display = 'none';
            }

            if (pairsContainer) {
                pairsContainer.style.display = 'block';
            }

            // Create pairs display with loaded data
            createPairsDisplay();

                    // Update UI state
                    if (isStopped) {
                const batchGenerateBtn = document.getElementById('sora-batch-generate');
                const pauseBtn = document.getElementById('sora-pause');
                const stopBtn = document.getElementById('sora-stop');
                
                if (batchGenerateBtn) {
                        batchGenerateBtn.disabled = false;
                        batchGenerateBtn.textContent = 'BATCH GENERATE';
                }
                if (pauseBtn) pauseBtn.disabled = true;
                if (stopBtn) stopBtn.disabled = true;
                    }

                    const completedCount = imagePairsData.filter(p => p && p.status === 'done').length;
            log(`Legacy batch progress loaded successfully! ${imagePairsData.length} pairs restored, ${completedCount} completed, ready to continue from pair ${currentIndex + 1}`, 'success');

                    if (completedCount > 0) {
                alert(`Legacy batch loaded successfully!\nTotal pairs: ${imagePairsData.length}\nCompleted: ${completedCount}\nReady to continue from pair ${currentIndex + 1}`);
            }

        } catch (legacyLoadError) {
            log(`Error loading legacy format: ${legacyLoadError.message}`, 'error');
            alert("Error loading legacy format. Check console for details.");
            throw legacyLoadError;
        }
    }

    // Helper functions for file conversion
    function fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    function base64ToFile(base64, fileName, fileType) {
        const arr = base64.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], fileName, { type: fileType || mime });
    }

    // --- INITIALIZATION ---
    // Helper function to truncate long filenames for display
    function truncateFilename(filename, maxLength = 20) {
        if (!filename || filename.length <= maxLength) {
            return filename;
        }
        
        // Split filename and extension
        const lastDotIndex = filename.lastIndexOf('.');
        const name = lastDotIndex > 0 ? filename.substring(0, lastDotIndex) : filename;
        const extension = lastDotIndex > 0 ? filename.substring(lastDotIndex) : '';
        
        // If extension is too long, just truncate normally
        if (extension.length > 8) {
            return filename.substring(0, maxLength - 3) + '...';
        }
        
        // Calculate available space for name part
        const availableLength = maxLength - extension.length - 3; // 3 for "..."
        
        if (availableLength <= 3) {
            // If very short, just show beginning + extension
            return filename.substring(0, maxLength - extension.length - 3) + '...' + extension;
        }
        
        // Keep first part and last part of name
        const firstPart = Math.ceil(availableLength * 0.6); // 60% for beginning
        const lastPart = Math.floor(availableLength * 0.4); // 40% for end
        
        const truncatedName = name.substring(0, firstPart) + '...' + name.substring(name.length - lastPart);
        
        return truncatedName + extension;
    }

    // DEBUG: Force apply styles to all existing pairs
    function debugForceApplyStyles() {
        log('[DEBUG] Force applying styles to all pair elements...', 'info');
        
        // Find all pair divs
        const pairDivs = document.querySelectorAll('[id^="sora-helper-pair-"]');
        log(`[DEBUG] Found ${pairDivs.length} pair elements`, 'info');
        
        pairDivs.forEach((pairDiv, index) => {
            try {
                const pairId = pairDiv.id.replace('sora-helper-pair-', '');
                const result = findPairById(parseInt(pairId));
                if (result && result.pair) {
                    const statusText = result.pair.status === 'done' ? 'Done!' : 
                                      result.pair.status === 'error' ? 'Error' :
                                      result.pair.status === 'processing' ? 'Processing...' : 
                                      'Pending';
                    
                    log(`[DEBUG] Applying style to pair ${pairId} with status "${statusText}"`, 'debug');
                    updatePairElementStyling(pairDiv, statusText, result.pair);
                    
                    // Double-check the applied styles
                    const computedStyle = window.getComputedStyle(pairDiv);
                    log(`[DEBUG] Pair ${pairId} computed background: ${computedStyle.backgroundColor}`, 'debug');
                } else {
                    log(`[DEBUG] Could not find pair data for ID ${pairId}`, 'warn');
                }
            } catch (error) {
                log(`[DEBUG] Error processing pair div ${index}: ${error.message}`, 'error');
            }
        });
    }

    function init() {
    log("Script initializing...");
    loadStoredPrompt('init_pre_ui');
    loadPromptVisibility('init_pre_ui');
    createMainPanel();
        
        // Add a default ProductSet for better UX
        try {
            const defaultProductSet = createProductSet("Product Set 1", null, []);
            productSets.push(defaultProductSet);
            createProductSetCard(defaultProductSet);
            log(`Created default ProductSet "${defaultProductSet.name}" with ID ${defaultProductSet.id}`, 'info');
        } catch (error) {
            log(`Error creating default ProductSet: ${error.message}`, 'warn');
        }
        
        log("SORA Helper UI injected. Ready.", 'success');
        
        // Add debug function to global scope for manual testing
        window.debugForceApplyStyles = debugForceApplyStyles;
    }

    // Wait for the page to be somewhat settled before injecting UI
    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // --- MINIMIZE/RESTORE FUNCTIONALITY ---
    function handleMinimize() {
        try {
            const mainPanel = document.getElementById('sora-helper-panel');
            const floatingBtn = document.getElementById('sora-floating-btn');

            if (mainPanel && floatingBtn) {
                mainPanel.style.display = 'none';
                floatingBtn.style.display = 'flex';
                log("Interface minimized to floating button", 'info');
            }
        } catch (minimizeError) {
            log(`Error minimizing interface: ${minimizeError.message}`, 'error');
        }
    }

    function handleRestore() {
        try {
            const mainPanel = document.getElementById('sora-helper-panel');
            const floatingBtn = document.getElementById('sora-floating-btn');

            if (mainPanel && floatingBtn) {
                mainPanel.style.display = 'flex';
                floatingBtn.style.display = 'none';
                log("Interface restored from floating button", 'info');
            }
        } catch (restoreError) {
            log(`Error restoring interface: ${restoreError.message}`, 'error');
        }
    }

    async function clearSoraInput() {
        log("Attempting to clear SORA input area...", 'info');
        try {
            // Find all buttons that contain a screen-reader-only span with the text "Remove media".
            const deleteButtons = Array.from(document.querySelectorAll('button')).filter(btn => {
                const srText = btn.querySelector('span.sr-only');
                return srText && srText.textContent.trim() === 'Remove media';
            });

            if (deleteButtons.length > 0) {
                log(`Found ${deleteButtons.length} staged images to remove. Clearing...`, 'info');
                // Iterate in reverse because the collection of buttons will change as we click them.
                for (let i = deleteButtons.length - 1; i >= 0; i--) {
                    deleteButtons[i].click();
                    // Add a small delay to allow the UI to react smoothly.
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
                log("Successfully cleared staged images.", 'success');
            } else {
                log("No staged images found to clear.", 'info');
            }
        } catch (e) {
            log(`Error while trying to clear SORA input: ${e.message}`, 'error');
        }
    }

    // NEW: Enhanced ProductSet-level error handling and isolation
    
    // Set-level error tracking
    let setErrorRecoveryAttempts = new Map(); // Map<setId, recoveryData>
    let setCircuitBreakerStates = new Map(); // Map<errorType, circuitBreakerState>
    
    // Set-level error categories with isolation strategies
    const SET_ERROR_CATEGORIES = {
        SET_FATAL: 'set_fatal',           // Errors that affect entire set (corrupted model file, etc.)
        SET_RECOVERABLE: 'set_recoverable', // Errors that can be recovered at set level
        SET_ISOLATED: 'set_isolated',     // Errors isolated to specific pairs within set
        CROSS_SET: 'cross_set'            // Errors that could affect multiple sets
    };

    function categorizeSetError(error, setId, pairId = null, context = 'unknown') {
        const logPrefix = `[SetErrorCategorizer-S${setId}]`;
        
        const errorMessage = error.message || error.toString();
        const errorLower = errorMessage.toLowerCase();
        
        // Set-fatal errors (affect entire set)
        if (errorLower.includes('model file') || 
            errorLower.includes('corrupted') ||
            errorLower.includes('invalid format') ||
            errorLower.includes('file not found')) {
            return {
                category: SET_ERROR_CATEGORIES.SET_FATAL,
                type: 'SET_MODEL_ERROR',
                severity: 'high',
                isolationLevel: 'set',
                maxRetries: 1,
                retryDelay: 5000,
                requiresSetIsolation: true,
                affectsOtherSets: false
            };
        }
        
        // Cross-set errors (could affect multiple sets)
        if (errorLower.includes('workspace') ||
            errorLower.includes('dom lock') ||
            errorLower.includes('interface not ready') ||
            errorLower.includes('sora interface')) {
            return {
                category: SET_ERROR_CATEGORIES.CROSS_SET,
                type: 'WORKSPACE_CONTAMINATION',
                severity: 'high',
                isolationLevel: 'global',
                maxRetries: 3,
                retryDelay: 10000,
                requiresSetIsolation: false,
                affectsOtherSets: true
            };
        }
        
        // Set-recoverable errors (can be recovered at set level)
        if (errorLower.includes('outfit') ||
            errorLower.includes('paste') ||
            errorLower.includes('upload')) {
            return {
                category: SET_ERROR_CATEGORIES.SET_RECOVERABLE,
                type: 'SET_PROCESSING_ERROR',
                severity: 'medium',
                isolationLevel: 'set',
                maxRetries: 3,
                retryDelay: 3000,
                requiresSetIsolation: true,
                affectsOtherSets: false
            };
        }
        
        // Set-isolated errors (isolated to specific pairs)
        return {
            category: SET_ERROR_CATEGORIES.SET_ISOLATED,
            type: 'PAIR_PROCESSING_ERROR',
            severity: 'low',
            isolationLevel: 'pair',
            maxRetries: 2,
            retryDelay: 2000,
            requiresSetIsolation: false,
            affectsOtherSets: false
        };
    }

    async function handleSetLevelError(setId, pairId, error, context = 'unknown') {
        const logPrefix = `[SetErrorHandler-S${setId}]`;
        const productSet = findProductSetById(setId);
        
        if (!productSet) {
            log(`${logPrefix} ProductSet not found for error handling`, 'error');
            return { shouldContinue: false, action: 'set_not_found' };
        }

        try {
            log(`${logPrefix} Handling set-level error for pair ${pairId}: ${error.message}`, 'info');
            
            // Categorize the error with set context
            const errorCategory = categorizeSetError(error, setId, pairId, context);
            log(`${logPrefix} Error categorized as: ${errorCategory.type} (${errorCategory.category})`, 'info');
            
            // Record error in ProductSet
            recordProductSetError(setId, error.message, `set_error_handler_${context}`);
            
            // Get or create set-level recovery tracking
            if (!setErrorRecoveryAttempts.has(setId)) {
                setErrorRecoveryAttempts.set(setId, {
                    setId,
                    totalAttempts: 0,
                    errorHistory: [],
                    lastAttemptTime: 0,
                    isolationStatus: 'none',
                    recoveryStrategies: new Set()
                });
            }
            
            const setRecoveryData = setErrorRecoveryAttempts.get(setId);
            setRecoveryData.totalAttempts++;
            setRecoveryData.errorHistory.push({
                timestamp: Date.now(),
                pairId,
                error: error.message,
                type: errorCategory.type,
                category: errorCategory.category,
                context
            });
            setRecoveryData.lastAttemptTime = Date.now();
            
            // Handle based on error category and isolation level
            switch (errorCategory.category) {
                case SET_ERROR_CATEGORIES.SET_FATAL:
                    return await handleSetFatalError(setId, errorCategory, setRecoveryData, context);
                    
                case SET_ERROR_CATEGORIES.CROSS_SET:
                    return await handleCrossSetError(setId, errorCategory, setRecoveryData, context);
                    
                case SET_ERROR_CATEGORIES.SET_RECOVERABLE:
                    return await handleSetRecoverableError(setId, errorCategory, setRecoveryData, context);
                    
                case SET_ERROR_CATEGORIES.SET_ISOLATED:
                    return await handleSetIsolatedError(setId, pairId, errorCategory, setRecoveryData, context);
                    
                default:
                    log(`${logPrefix} Unknown set error category: ${errorCategory.category}`, 'error');
                    return { shouldContinue: false, action: 'unknown_category' };
            }
            
        } catch (handlingError) {
            log(`${logPrefix} Error during set-level error handling: ${handlingError.message}`, 'error');
            updateProductSetStatus(setId, 'error', `set_error_handler_failed_${context}`);
            return { shouldContinue: false, action: 'handling_failed', error: handlingError.message };
        }
    }

    async function handleSetFatalError(setId, errorCategory, setRecoveryData, context) {
        const logPrefix = `[SetFatal-S${setId}]`;
        const productSet = findProductSetById(setId);
        
        log(`${logPrefix} Handling set-fatal error: ${errorCategory.type}`, 'error');
        
        // Mark entire set as failed
        updateProductSetStatus(setId, 'error', `set_fatal_${context}`);
        
        // Mark all pending/processing pairs in set as failed
        if (productSet && productSet.pairs) {
            productSet.pairs.forEach(pair => {
                if (pair.status === 'pending' || pair.status === 'processing') {
                    setPairStatus(pair, 'error', `set_fatal_cascade_${context}`);
                }
            });
        }
        
        log(`${logPrefix} Set marked as fatal error - all pending pairs failed`, 'error');
        
        return {
            shouldContinue: false,
            action: 'set_fatal_error',
            setIsolated: true,
            affectedPairs: productSet ? productSet.pairs.length : 0
        };
    }

    async function handleCrossSetError(setId, errorCategory, setRecoveryData, context) {
        const logPrefix = `[CrossSet-S${setId}]`;
        
        log(`${logPrefix} Handling cross-set error: ${errorCategory.type}`, 'warn');
        
        // Check if this affects global processing
        if (errorCategory.affectsOtherSets) {
            log(`${logPrefix} Cross-set error may affect other sets - applying global recovery`, 'warn');
            
            // Apply global workspace cleanup
            try {
                await ensureCleanWorkspace(`cross_set_recovery_${context}`, true);
                log(`${logPrefix} Global workspace cleanup completed`, 'info');
            } catch (cleanupError) {
                log(`${logPrefix} Global workspace cleanup failed: ${cleanupError.message}`, 'error');
            }
            
            // Small delay to let things settle
            await new Promise(resolve => setTimeout(resolve, errorCategory.retryDelay));
        }
        
        return {
            shouldContinue: true,
            action: 'cross_set_recovery',
            globalCleanupApplied: true,
            retryDelay: errorCategory.retryDelay
        };
    }

    async function handleSetRecoverableError(setId, errorCategory, setRecoveryData, context) {
        const logPrefix = `[SetRecoverable-S${setId}]`;
        
        // Check retry limits for this set
        if (setRecoveryData.totalAttempts > errorCategory.maxRetries) {
            log(`${logPrefix} Max set recovery attempts exceeded (${setRecoveryData.totalAttempts}/${errorCategory.maxRetries})`, 'error');
            updateProductSetStatus(setId, 'error', `max_set_recoveries_${context}`);
            return {
                shouldContinue: false,
                action: 'max_set_recoveries_exceeded',
                totalAttempts: setRecoveryData.totalAttempts
            };
        }
        
        log(`${logPrefix} Attempting set-level recovery (attempt ${setRecoveryData.totalAttempts}/${errorCategory.maxRetries})`, 'info');
        
        // Apply set-level recovery strategies
        const recoveryStrategies = [];
        
        // Strategy 1: Set-level workspace cleanup
        if (!setRecoveryData.recoveryStrategies.has('set_workspace_cleanup')) {
            recoveryStrategies.push('set_workspace_cleanup');
            setRecoveryData.recoveryStrategies.add('set_workspace_cleanup');
        }
        
        // Strategy 2: Reset set processing state
        if (!setRecoveryData.recoveryStrategies.has('set_state_reset')) {
            recoveryStrategies.push('set_state_reset');
            setRecoveryData.recoveryStrategies.add('set_state_reset');
        }
        
        // Execute recovery strategies
        for (const strategy of recoveryStrategies) {
            try {
                await executeSetRecoveryStrategy(setId, strategy, context);
                log(`${logPrefix} Set recovery strategy '${strategy}' executed successfully`, 'success');
            } catch (strategyError) {
                log(`${logPrefix} Set recovery strategy '${strategy}' failed: ${strategyError.message}`, 'warn');
            }
        }
        
        // Update set status back to pending for retry
        updateProductSetStatus(setId, 'pending', `set_recovery_${context}`);
        
        // Wait before retry
        if (errorCategory.retryDelay > 0) {
            log(`${logPrefix} Waiting ${Math.round(errorCategory.retryDelay/1000)}s before set retry`, 'info');
            await new Promise(resolve => setTimeout(resolve, errorCategory.retryDelay));
        }
        
        return {
            shouldContinue: true,
            action: 'set_recovery_applied',
            strategies: recoveryStrategies,
            retryDelay: errorCategory.retryDelay,
            attempt: setRecoveryData.totalAttempts
        };
    }

    async function handleSetIsolatedError(setId, pairId, errorCategory, setRecoveryData, context) {
        const logPrefix = `[SetIsolated-S${setId}P${pairId}]`;
        
        log(`${logPrefix} Handling isolated pair error within set`, 'info');
        
        // This error is isolated to the specific pair - don't affect the set
        // Use existing pair-level error handling
        const pairRecoveryResult = await handleErrorWithRecovery(pairId, new Error(errorCategory.type), context);
        
        if (!pairRecoveryResult.shouldRetry) {
            log(`${logPrefix} Pair failed after isolated error handling`, 'warn');
            // Mark this specific pair as failed but continue with set
            const pair = findPairById(pairId);
            if (pair.result) {
                setPairStatus(pair.result.pair, 'error', `isolated_error_${context}`);
            }
        }
        
        return {
            shouldContinue: true,
            action: 'pair_isolated_error',
            pairRetryResult: pairRecoveryResult,
            setUnaffected: true
        };
    }

    async function executeSetRecoveryStrategy(setId, strategy, context) {
        const logPrefix = `[SetRecovery-S${setId}]`;
        
        switch (strategy) {
            case 'set_workspace_cleanup':
                log(`${logPrefix} Executing set workspace cleanup strategy`, 'info');
                await ensureCleanWorkspace(`set_recovery_cleanup_${setId}_${context}`, true);
                break;
                
            case 'set_state_reset':
                log(`${logPrefix} Executing set state reset strategy`, 'info');
                const productSet = findProductSetById(setId);
                if (productSet && productSet.pairs) {
                    // Reset processing pairs back to pending
                    productSet.pairs.forEach(pair => {
                        if (pair.status === 'processing') {
                            setPairStatus(pair, 'pending', `set_state_reset_${context}`);
                        }
                    });
                }
                break;
                
            case 'set_file_revalidation':
                log(`${logPrefix} Executing set file revalidation strategy`, 'info');
                const setForValidation = findProductSetById(setId);
                if (setForValidation) {
                    const validation = validateProductSet(setForValidation);
                    if (!validation.isValid) {
                        throw new Error(`Set validation failed: ${validation.error}`);
                    }
                }
                break;
                
            default:
                log(`${logPrefix} Unknown set recovery strategy: ${strategy}`, 'warn');
        }
    }

    function isolateProductSet(setId, reason, context = 'unknown') {
        const logPrefix = `[SetIsolation-S${setId}]`;
        const productSet = findProductSetById(setId);
        
        if (!productSet) {
            log(`${logPrefix} Cannot isolate - ProductSet not found`, 'error');
            return false;
        }
        
        log(`${logPrefix} Isolating ProductSet "${productSet.name}" - Reason: ${reason}`, 'warn');
        
        // Mark set as error state
        updateProductSetStatus(setId, 'error', `isolation_${context}`);
        
        // Mark all pending/processing pairs as skipped to prevent further processing
        let isolatedPairs = 0;
        if (productSet.pairs) {
            productSet.pairs.forEach(pair => {
                if (pair.status === 'pending' || pair.status === 'processing') {
                    setPairStatus(pair, 'skipped', `set_isolation_${context}`);
                    isolatedPairs++;
                }
            });
        }
        
        // Record isolation in set metadata
        if (!productSet.metadata.isolationHistory) {
            productSet.metadata.isolationHistory = [];
        }
        productSet.metadata.isolationHistory.push({
            timestamp: Date.now(),
            reason,
            context,
            isolatedPairs
        });
        
        log(`${logPrefix} Set isolated successfully - ${isolatedPairs} pairs affected`, 'info');
        
        // Update UI
        updateProductSetStatusInUI(setId);
        
        return true;
    }

    function cleanupSetErrorRecoveryTracking(setId, context = 'unknown') {
        try {
            if (setErrorRecoveryAttempts.has(setId)) {
                setErrorRecoveryAttempts.delete(setId);
                log(`[SetRecovery] Cleaned up set error tracking for set ${setId} (context: ${context})`, 'debug');
            }
        } catch (error) {
            log(`[SetRecovery] Error cleaning up set tracking for set ${setId}: ${error.message}`, 'warn');
        }
    }

    // --- ENHANCED SET TEMPLATES FUNCTIONALITY ---
    
    // Template storage in localStorage
    const TEMPLATE_STORAGE_KEY = 'sora_productset_templates';
    
    function saveProductSetAsTemplate(setId, templateName) {
        try {
            const productSet = findProductSetById(setId);
            if (!productSet) {
                throw new Error(`ProductSet ${setId} not found`);
            }
            
            // Validate template name
            if (!templateName || templateName.trim() === '') {
                throw new Error('Template name cannot be empty');
            }
            
            const template = {
                id: `template_${Date.now()}`,
                name: templateName.trim(),
                createdAt: Date.now(),
                originalSetName: productSet.name,
                modelFileName: productSet.modelFile ? productSet.modelFile.name : null,
                outfitFileNames: productSet.outfitFiles ? productSet.outfitFiles.map(f => f.name) : [],
                outfitCount: productSet.outfitFiles ? productSet.outfitFiles.length : 0,
                pairCount: productSet.pairs ? productSet.pairs.length : 0,
                metadata: {
                    ...productSet.metadata,
                    savedAsTemplate: Date.now()
                }
            };
            
            // Get existing templates
            const existingTemplates = getProductSetTemplates();
            
            // Check for duplicate names
            if (existingTemplates.some(t => t.name === templateName.trim())) {
                throw new Error(`Template name "${templateName}" already exists`);
            }
            
            // Add new template
            existingTemplates.push(template);
            
            // Save to localStorage
            localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(existingTemplates));
            
            log(`ProductSet "${productSet.name}" saved as template "${templateName}"`, 'success');
            return template.id;
            
        } catch (error) {
            log(`Error saving ProductSet template: ${error.message}`, 'error');
            throw error;
        }
    }
    
    function getProductSetTemplates() {
        try {
            const templates = localStorage.getItem(TEMPLATE_STORAGE_KEY);
            return templates ? JSON.parse(templates) : [];
        } catch (error) {
            log(`Error loading ProductSet templates: ${error.message}`, 'warn');
            return [];
        }
    }
    
    function deleteProductSetTemplate(templateId) {
        try {
            const templates = getProductSetTemplates();
            const filteredTemplates = templates.filter(t => t.id !== templateId);
            
            if (filteredTemplates.length === templates.length) {
                throw new Error('Template not found');
            }
            
            localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(filteredTemplates));
            log(`Template deleted successfully`, 'success');
            
        } catch (error) {
            log(`Error deleting template: ${error.message}`, 'error');
            throw error;
        }
    }
    
    function createProductSetFromTemplate(templateId) {
        try {
            const templates = getProductSetTemplates();
            const template = templates.find(t => t.id === templateId);
            
            if (!template) {
                throw new Error('Template not found');
            }
            
            // Create new ProductSet based on template
            const newProductSet = createProductSet(
                `${template.originalSetName} (from template)`,
                null, // modelFile - user will need to upload
                [] // outfitFiles - user will need to upload
            );
            
            // Copy metadata
            newProductSet.metadata = {
                ...newProductSet.metadata,
                createdFromTemplate: template.id,
                templateName: template.name,
                expectedOutfitCount: template.outfitCount
            };
            
            productSets.push(newProductSet);
            log(`ProductSet created from template "${template.name}"`, 'success');
            
            // Refresh UI
            refreshProductSetCards();
            
            return newProductSet.id;
            
        } catch (error) {
            log(`Error creating ProductSet from template: ${error.message}`, 'error');
            throw error;
        }
    }

    // --- SMART FILE ORGANIZATION FUNCTIONALITY ---
    
    // File type detection patterns
    const FILE_TYPE_PATTERNS = {
        model: [
            /model/i, /base/i, /person/i, /character/i, /figure/i, /man/i, /woman/i, /male/i, /female/i,
            /portrait/i, /face/i, /body/i, /human/i, /main/i, /primary/i, /original/i
        ],
        outfit: [
            /outfit/i, /clothing/i, /dress/i, /shirt/i, /pants/i, /skirt/i, /jacket/i, /coat/i,
            /style/i, /fashion/i, /wear/i, /garment/i, /top/i, /bottom/i, /attire/i, /costume/i,
            /variant/i, /option/i, /alternative/i, /alt/i, /look/i, /v\d+/i
        ]
    };
    
    function detectFileType(fileName) {
        const name = fileName.toLowerCase();
        
        // Check model patterns
        for (const pattern of FILE_TYPE_PATTERNS.model) {
            if (pattern.test(name)) {
                return { type: 'model', confidence: 0.8 };
            }
        }
        
        // Check outfit patterns
        for (const pattern of FILE_TYPE_PATTERNS.outfit) {
            if (pattern.test(name)) {
                return { type: 'outfit', confidence: 0.7 };
            }
        }
        
        // Fallback: if filename contains numbers, likely outfit variants
        if (/\d+/.test(name)) {
            return { type: 'outfit', confidence: 0.5 };
        }
        
        // Default to outfit if unsure (most files are outfit variations)
        return { type: 'outfit', confidence: 0.3 };
    }
    
    function organizeFilesIntoSets(files) {
        try {
            log(`Organizing ${files.length} files into ProductSets...`, 'info');
            
            const organizedSets = new Map(); // Map<setName, {models: [], outfits: []}>
            const unassignedFiles = [];
            
            for (const file of files) {
                const detection = detectFileType(file.name);
                
                // Extract potential set name from filename
                let setName = extractSetNameFromFilename(file.name);
                
                if (!setName) {
                    setName = 'Unassigned';
                }
                
                if (!organizedSets.has(setName)) {
                    organizedSets.set(setName, { models: [], outfits: [] });
                }
                
                const setData = organizedSets.get(setName);
                
                if (detection.type === 'model' && detection.confidence > 0.6) {
                    setData.models.push(file);
                } else {
                    setData.outfits.push(file);
                }
            }
            
            const suggestions = [];
            
            for (const [setName, setData] of organizedSets) {
                if (setData.models.length > 0 && setData.outfits.length > 0) {
                    suggestions.push({
                        name: setName,
                        modelFile: setData.models[0], // Use first model file
                        outfitFiles: setData.outfits,
                        confidence: 'high',
                        extraModels: setData.models.slice(1) // Additional model files
                    });
                } else if (setData.outfits.length > 0) {
                    suggestions.push({
                        name: setName,
                        modelFile: null,
                        outfitFiles: setData.outfits,
                        confidence: 'medium',
                        needsModel: true
                    });
                } else if (setData.models.length > 0) {
                    suggestions.push({
                        name: setName,
                        modelFile: setData.models[0],
                        outfitFiles: [],
                        confidence: 'low',
                        needsOutfits: true
                    });
                }
            }
            
            log(`File organization complete: ${suggestions.length} sets suggested`, 'success');
            return suggestions;
            
        } catch (error) {
            log(`Error organizing files: ${error.message}`, 'error');
            return [];
        }
    }
    
    function extractSetNameFromFilename(filename) {
        // Remove file extension
        const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
        
        // Common patterns to extract set names
        const patterns = [
            // Pattern: "SetName_model.jpg" or "SetName_outfit1.jpg"
            /^([^_]+)_/,
            // Pattern: "SetName-model.jpg" or "SetName-outfit1.jpg"  
            /^([^-]+)-/,
            // Pattern: "SetName model.jpg" or "SetName outfit1.jpg"
            /^([^0-9]+)\s+(model|outfit|dress|shirt|pants)/i,
            // Pattern: "SetName (1).jpg" or "SetName (variant).jpg"
            /^([^(]+)\s*\(/,
            // Pattern: "SetName1.jpg", "SetName2.jpg" (extract base name)
            /^([A-Za-z]+)[\d]*$/
        ];
        
        for (const pattern of patterns) {
            const match = nameWithoutExt.match(pattern);
            if (match) {
                return match[1].trim();
            }
        }
        
        // If no pattern matches, use first part before any numbers
        const baseMatch = nameWithoutExt.match(/^([A-Za-z\s]+)/);
        if (baseMatch) {
            return baseMatch[1].trim();
        }
        
        return null;
    }
    
    function showSmartOrganizationDialog(suggestions) {
        // Remove existing dialog if present
        const existingDialog = document.getElementById('smart-organization-dialog');
        if (existingDialog) {
            existingDialog.remove();
        }
        
        if (!suggestions || suggestions.length === 0) {
            alert('No file organization suggestions available.');
            return;
        }
        
        // Create dialog
        const dialog = document.createElement('div');
        dialog.id = 'smart-organization-dialog';
        dialog.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        `;
        
        const dialogContent = document.createElement('div');
        dialogContent.style.cssText = `
            background: #2d2d2d;
            color: #f0f0f0;
            padding: 20px;
            border-radius: 8px;
            max-width: 80%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        `;
        
        const suggestionsHtml = suggestions.map((suggestion, index) => {
            const confidenceColor = suggestion.confidence === 'high' ? '#4caf50' : 
                                   suggestion.confidence === 'medium' ? '#ff9800' : '#f44336';
            
            return `
                <div style="border: 1px solid #444; border-radius: 6px; padding: 15px; margin-bottom: 15px; background: #333;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <h4 style="margin: 0; color: #4fc3f7;">${suggestion.name}</h4>
                        <span style="background: ${confidenceColor}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px; text-transform: uppercase;">
                            ${suggestion.confidence} confidence
                        </span>
                    </div>
                    
                    <div style="margin: 8px 0;">
                        <strong>Model:</strong> 
                        ${suggestion.modelFile ? 
                            `<span style="color: #4caf50;">${suggestion.modelFile.name}</span>` : 
                            '<span style="color: #f44336;">❌ Missing (required)</span>'
                        }
                        ${suggestion.extraModels && suggestion.extraModels.length > 0 ? 
                            `<br><span style="color: #ff9800; font-size: 12px;">⚠️ ${suggestion.extraModels.length} extra model files found</span>` : 
                            ''
                        }
                    </div>
                    
                    <div style="margin: 8px 0;">
                        <strong>Outfits (${suggestion.outfitFiles.length}):</strong>
                        ${suggestion.outfitFiles.length > 0 ? 
                            `<div style="color: #ccc; font-size: 12px; margin-top: 4px;">${suggestion.outfitFiles.slice(0, 3).map(f => f.name).join(', ')}${suggestion.outfitFiles.length > 3 ? ` +${suggestion.outfitFiles.length - 3} more` : ''}</div>` :
                            '<span style="color: #f44336;">❌ No outfit files</span>'
                        }
                    </div>
                    
                    <div style="text-align: right; margin-top: 10px;">
                        <input type="checkbox" id="suggestion-${index}" ${suggestion.confidence === 'high' ? 'checked' : ''} 
                            style="margin-right: 8px;">
                        <label for="suggestion-${index}" style="color: #ccc;">Create this ProductSet</label>
                    </div>
                </div>
            `;
        }).join('');
        
        dialogContent.innerHTML = `
            <h3 style="margin-top: 0; color: #4fc3f7;">Smart File Organization</h3>
            <p style="color: #ccc; margin-bottom: 20px;">
                I've analyzed your files and found ${suggestions.length} potential ProductSet(s). 
                Review and select which ones to create:
            </p>
            
            <div id="suggestions-container" style="margin: 20px 0;">
                ${suggestionsHtml}
            </div>
            
            <div style="text-align: right; margin-top: 20px; padding-top: 15px; border-top: 1px solid #444;">
                <button onclick="closeOrganizationDialog();" 
                    style="padding: 8px 16px; background: #666; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 10px;">
                    Cancel
                </button>
                <button onclick="selectAllSuggestions();" 
                    style="padding: 8px 16px; background: #2196f3; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 10px;">
                    Select All
                </button>
                <button onclick="createSelectedSets();" 
                    style="padding: 8px 16px; background: #4caf50; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    Create Selected Sets
                </button>
            </div>
        `;
        
        dialog.appendChild(dialogContent);
        document.body.appendChild(dialog);
        
        // Store suggestions for later use
        window._organizationSuggestions = suggestions;
        
        // Add helper functions
        window.closeOrganizationDialog = () => {
            dialog.remove();
            delete window._organizationSuggestions;
            delete window.closeOrganizationDialog;
            delete window.selectAllSuggestions;
            delete window.createSelectedSets;
        };
        
        window.selectAllSuggestions = () => {
            suggestions.forEach((_, index) => {
                const checkbox = document.getElementById(`suggestion-${index}`);
                if (checkbox) checkbox.checked = true;
            });
        };
        
        window.createSelectedSets = () => {
            const selectedSuggestions = suggestions.filter((_, index) => {
                const checkbox = document.getElementById(`suggestion-${index}`);
                return checkbox && checkbox.checked;
            });
            
            if (selectedSuggestions.length === 0) {
                alert('Please select at least one ProductSet to create.');
                return;
            }
            
            let createdCount = 0;
            let skippedCount = 0;
            
            selectedSuggestions.forEach(suggestion => {
                if (suggestion.modelFile && suggestion.outfitFiles.length > 0) {
                    try {
                        const newSet = createProductSet(suggestion.name, suggestion.modelFile, suggestion.outfitFiles);
                        productSets.push(newSet);
                        createdCount++;
                    } catch (error) {
                        log(`Error creating ProductSet "${suggestion.name}": ${error.message}`, 'warn');
                        skippedCount++;
                    }
                } else {
                    skippedCount++;
                    log(`Skipped "${suggestion.name}" - missing required files`, 'warn');
                }
            });
            
            // Refresh UI
            refreshProductSetCards();
            
            alert(`Smart organization complete!\nCreated: ${createdCount} ProductSets\nSkipped: ${skippedCount} incomplete sets`);
            window.closeOrganizationDialog();
        };
        
        // Close on background click
        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) {
                window.closeOrganizationDialog();
            }
        });
    }

})();