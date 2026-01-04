// ==UserScript==
// @name        Yet Another E-hentai Viewer
// @description Fullscreen Image Viewer for E-hentai/Exhentai with a sidebar, preloading, dual page mode, and other stuff.
// @namespace   Violentmonkey Scripts
// @match       https://exhentai.org/g/*
// @match       https://exhentai.org/s/*
// @match       https://e-hentai.org/g/*
// @match       https://e-hentai.org/s/*
// @icon        https://e-hentai.org/favicon.ico
// @version     1.18
// @author      shlsdv
// @license     MIT

// For configuration managment
// @grant       GM_registerMenuCommand
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue

// Optional, can be removed. Removing breaks save image command (Shift+S).
// @grant       GM_download

// Optional, can be removed. Removing breaks Ctrl+V image paste if url is cross-origin.
// @grant       GM_xmlhttpRequest
// @connect     *

// @homepageURL https://greasyfork.org/en/scripts/531375-yet-another-e-hentai-viewer
// @downloadURL https://update.greasyfork.org/scripts/531375/Yet%20Another%20E-hentai%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/531375/Yet%20Another%20E-hentai%20Viewer.meta.js
// ==/UserScript==

(function () {
    "use strict";
    // ----------------------------------------------------------------------------------------------
    // thumbCollection.js
    // ----------------------------------------------------------------------------------------------

    /**
     * Represents an ordered collection of objects (typically representing thumbnails)
     * or null values. Objects are expected to potentially have a unique `href`.
     *
     * This collection provides features of both an Array and a Map:
     * - **Ordered Elements:** Maintains the insertion order of elements (including nulls),
     *   accessible via index (primarily through iteration or methods like `forEach`).
     *   Standard array manipulation methods like `push`, `unshift`, `splice`, and index-based
     *   removal are provided. Supports storing `null` or `undefined` values directly
     *   in the collection.
     * - **Fast Key Lookup:** Offers efficient O(1) average time lookup of non-null elements
     *   using their unique `href` (via `getByHref`). Null/undefined elements or elements
     *   without an `href` are not included in this lookup map.
     * - **Fast First/Last Item Access:** Provides O(1) access to the first and last
     *   non-null/undefined items in the collection via `first()` and `last()`.
     *
     * It synchronizes an internal array (`items`) for order and iteration with an internal
     * Map (`lookup` for href) for fast key-based access for applicable elements. It also
     * maintains indices (`_firstValidIndex`, `_lastValidIndex`) pointing to the first
     * and last non-null/undefined items for efficient retrieval.
     * All modification methods ensure this synchronization is maintained. Null/undefined
     * values are preserved in the `items` array but ignored by the `lookup` map and
     * the first/last item tracking.
     *
     * Note: While the class itself doesn't directly support bracket notation access
     * (e.g., `collection[0]`), it's designed to be easily wrapped by a Proxy
     * (e.g., via the `createThumbCollection` factory function)
     * to enable such syntax transparently while preserving the lookup and first/last item functionality.
     */
    class ThumbCollection {
        /**
         * @param {Array<object|null|undefined>} [initialItems=[]] - Optional initial array of items.
         *        Object items are expected to potentially have an `href` property (any type,
         *        used as key). `null` or `undefined` values are preserved in the order.
         */
        constructor(initialItems = []) {
            this.items = [];              // The array storing the items (including nulls) in order
            this.lookup = new Map();      // Map<href, itemObject> for fast href lookup (non-null items only)
            this._firstValidIndex = -1;   // Index of the first non-null/undefined item, or -1 if none
            this._lastValidIndex = -1;    // Index of the last non-null/undefined item, or -1 if none

            // Use internal helper to populate initial state
            this._initializeItems(initialItems);
        }

        /**
         * @private Internal helper to populate initial items and state.
         * @param {Array<object|null|undefined>} initialItems
         */
        _initializeItems(initialItems) {
            initialItems.forEach((item) => {
                // Always add the item (or null/undefined) to the main array
                this.items.push(item);
                const index = this.items.length - 1;

                // Handle valid items (non-null/undefined)
                if (item != null) {
                    // Update first/last valid indices
                    if (this._firstValidIndex === -1) {
                        this._firstValidIndex = index;
                    }
                    this._lastValidIndex = index; // Always update last valid index seen so far

                    // Add to href lookup if href exists
                    if (item.href != null) {
                        if (this.lookup.has(item.href)) {
                            console.warn(`[Constructor] Duplicate href "${item.href}" detected. Lookup will point to the last instance encountered.`);
                        }
                        this.lookup.set(item.href, item);
                    }
                }
            });
        }


        // --- Core Accessors ---

        /** Get item by its unique href. Returns undefined if href not found or item associated with href is null. */
        getByHref(href) {
            return this.lookup.get(href);
        }

        /** Get item by its array index (less common if using Proxy) */
        get(index) {
            // Handle potential sparse arrays if 'delete' was used unwisely, though splice is preferred.
            if (index >= 0 && index < this.items.length) {
                return this.items[index];
            }
            return undefined; // Consistent with array behavior for out-of-bounds
        }

        /** Get the first non-null/undefined item in the collection. O(1). */
        first() {
            return this._firstValidIndex !== -1 ? this.items[this._firstValidIndex] : undefined;
        }

        /** Get the last non-null/undefined item in the collection. O(1). */
        last() {
            return this._lastValidIndex !== -1 ? this.items[this._lastValidIndex] : undefined;
        }

        /** Get the internal array (use with caution, direct modification bypasses lookups and index tracking) */
        get array() {
            return this.items;
        }

        /** Get the number of items in the collection (including nulls/undefined) */
        get length() {
            return this.items.length;
        }

        // --- Modification Methods (Updating array, lookup map, and first/last indices) ---

        push(...itemsToAdd) {
            const originalLength = this.items.length;
            itemsToAdd.forEach((item, i) => {
                const currentIndex = originalLength + i;
                // Always add the item to the array
                this.items.push(item);

                // Handle valid items
                if (item != null) {
                    // Update first/last valid indices
                    if (this._firstValidIndex === -1) {
                        this._firstValidIndex = currentIndex;
                    }
                    this._lastValidIndex = currentIndex; // Pushed item is always the new last valid

                    // Update lookup map if href exists
                    if (item.href != null) {
                        if (this.lookup.has(item.href)) {
                            console.warn(`[push] Item with href "${item.href}" already exists or was added multiple times. Overwriting in lookup.`);
                        }
                        this.lookup.set(item.href, item);
                    }
                }
            });
            return this.items.length;
        }

        unshift(...itemsToAdd) {
            const numAdded = itemsToAdd.length;
            if (numAdded === 0) return this.items.length;

            const originalLength = this.items.length;
            const wasEmptyOrAllNull = this._firstValidIndex === -1;

            // Add all items to the beginning of the array first
            // We need to iterate *backwards* through itemsToAdd to add them correctly to the lookup
            // and maintain the 'last one wins' logic for duplicate hrefs within the added items.
            // However, Array.prototype.unshift does this automatically. Let's rebuild after.

            this.items.unshift(...itemsToAdd);

            // --- Rebuild Lookups and Boundaries ---
            // Unshift potentially changes many indices and can introduce duplicate hrefs
            // in complex ways. Rebuilding is the most reliable way to ensure correctness.
            this.rebuildLookupsAndBoundaries();

            return this.items.length;
        }

        removeByHref(href) {
            const itemToRemove = this.lookup.get(href);
            if (itemToRemove) { // Check if the href exists in the lookup
                // Find the *specific instance* in the array that the lookup points to
                // Use findIndex for potentially better performance than indexOf with objects
                const index = this.items.findIndex(item => item === itemToRemove);
                if (index > -1) {
                    // Now delegate to removeByIndex internal logic
                    this._removeIndexInternal(index, itemToRemove);
                    return true; // Successfully removed
                } else {
                    // This indicates an inconsistency: item was in lookup but not found in array.
                    console.warn(`[removeByHref] Item with href "${href}" found in lookup but corresponding instance not found in array. Removing from lookup only.`);
                    this.lookup.delete(href);
                    // Note: first/last indices might be inaccurate now, consider rebuildLookupsAndBoundaries() if this happens often.
                    return false; // Indicate potential inconsistency
                }
            }
            return false; // Not found by href in the lookup map
        }

        removeByIndex(index) {
            if (index < 0 || index >= this.items.length) {
                return false; // Index out of bounds
            }
            const itemToRemove = this.items[index];
            this._removeIndexInternal(index, itemToRemove);
            return true;
        }

        /**
         * Removes elements from the collection and optionally inserts new elements in their place,
         * returning the deleted elements. Updates lookups and boundaries.
         * Mimics Array.prototype.splice.
         *
         * @param {number} start - The zero-based index at which to start changing the array.
         *        If < 0, it will begin that many elements from the end.
         * @param {number} [deleteCount] - An integer indicating the number of elements in the array
         *        to remove from `start`. If omitted, or if >= number of elements from start to end,
         *        all elements from `start` to the end of the array will be deleted.
         * @param {...any} itemsToAdd - The elements to add to the array, beginning from `start`.
         *        If you don't specify any elements, splice() will only remove elements from the array.
         * @returns {Array<object|null|undefined>} An array containing the deleted elements.
         */
        splice(start, deleteCount, ...itemsToAdd) {
            // 1. Normalize start index (handle negative values like Array.splice)
            let actualStart = start;
            if (actualStart < 0) {
                actualStart = Math.max(this.items.length + actualStart, 0);
            } else {
                actualStart = Math.min(actualStart, this.items.length); // Clamp to length
            }

            // 2. Normalize deleteCount
            // If deleteCount is undefined, delete all from start
            let actualDeleteCount = (deleteCount === undefined)
                ? this.items.length - actualStart
                : Math.max(0, deleteCount);
            // Clamp deleteCount to number of available items from start
            actualDeleteCount = Math.min(actualDeleteCount, this.items.length - actualStart);

            // 3. Perform the splice on the internal array and get deleted items
            const deletedItems = this.items.splice(actualStart, actualDeleteCount, ...itemsToAdd);

            // 4. Update lookup map: Remove deleted items
            // We need to be careful if duplicate hrefs existed. Rebuilding the whole state
            // is the safest approach after a complex operation like splice.
            // deletedItems.forEach(item => {
            //     if (item != null && item.href != null) {
            //         // Only delete from lookup if THIS specific instance was mapped
            //         if (this.lookup.get(item.href) === item) {
            //             this.lookup.delete(item.href);
            //             // If another item with same href exists, rebuild will find it.
            //         }
            //     }
            // });

            // 5. Update lookup map: Add new items (will be handled by rebuild)
            // itemsToAdd.forEach(item => { ... });

            // 6. Update boundaries and lookup map
            // Rebuilding ensures consistency after complex removals/insertions/shifts.
            this.rebuildLookupsAndBoundaries();

            // 7. Return deleted items
            return deletedItems;
        }

        /**
         * @private Internal helper for removing an item by index and updating state.
         * @param {number} index - The index to remove.
         * @param {object|null|undefined} itemToRemove - The item being removed (pre-fetched).
         */
        _removeIndexInternal(index, itemToRemove) {
            // 1. Remove from array
            this.items.splice(index, 1);

            // 2. Remove from lookup if applicable
            if (itemToRemove && itemToRemove.href != null && this.lookup.get(itemToRemove.href) === itemToRemove) {
                this.lookup.delete(itemToRemove.href);
                // If a duplicate href exists earlier in the array, a rebuild might be needed
                // to restore the lookup correctly. Let's rely on rebuild for now.
                // Consider adding a targeted lookup fix here later if needed.
            }

            // 3. Update first/last valid indices
            // This requires careful handling of edge cases. Rebuilding is simpler.
            // this._updateBoundariesAfterRemoval(index, itemToRemove != null); // Old way
            this.rebuildLookupsAndBoundaries(); // Safer after removal, especially with duplicate hrefs
        }


        // --- Iteration ---

        forEach(callbackFn, thisArg) {
            this.items.forEach(callbackFn, thisArg);
        }

        map(callbackFn, thisArg) {
            return this.items.map(callbackFn, thisArg);
        }

        filter(callbackFn, thisArg) {
            // Note: filter creates a standard array, not a new ThumbCollection
            return this.items.filter(callbackFn, thisArg);
        }

        [Symbol.iterator]() {
            return this.items[Symbol.iterator]();
        }

        // --- Maintenance ---

        /** Rebuilds the href lookup map AND first/last valid indices based on the current state of the items array. */
        rebuildLookupsAndBoundaries() {
            this.lookup.clear();
            this._firstValidIndex = -1;
            this._lastValidIndex = -1;
            this.items.forEach((item, index) => {
                if (item != null) {
                    // Update boundaries
                    if (this._firstValidIndex === -1) {
                        this._firstValidIndex = index;
                    }
                    this._lastValidIndex = index;

                    // Update lookup
                    if (item.href != null) {
                        // Allow overwrites, last one wins during rebuild
                        this.lookup.set(item.href, item);
                    }
                }
            });
        }
        /** Alias for potential backward compatibility (if needed) */
        rebuildLookups() {
            this.rebuildLookupsAndBoundaries();
        }

        // --- PRIVATE HELPER METHODS ---

        /**
         * @private Internal helper to find and update the _firstValidIndex.
         * @param {number} [startIndex=0] - Index to start searching from.
         */
        _findAndUpdateFirstValidIndex(startIndex = 0) {
            for (let i = startIndex; i < this.items.length; i++) {
                if (this.items[i] != null) {
                    this._firstValidIndex = i;
                    return;
                }
            }
            // If no valid item found from startIndex onwards
            this._firstValidIndex = -1;
            // If first becomes -1, last must also be -1 if the search covered the whole array
            if (startIndex === 0) {
                this._lastValidIndex = -1;
            }
        }

        /**
         * @private Internal helper to find and update the _lastValidIndex.
         * @param {number} [startIndex=this.items.length - 1] - Index to start searching from (backwards).
         */
        _findAndUpdateLastValidIndex(startIndex = this.items.length - 1) {
            for (let i = startIndex; i >= 0; i--) {
                if (this.items[i] != null) {
                    this._lastValidIndex = i;
                    return;
                }
            }
            // If no valid item found from startIndex backwards
            this._lastValidIndex = -1;
            // If last becomes -1, first must also be -1 if the search covered the whole array
            if (startIndex === this.items.length - 1) {
                this._firstValidIndex = -1;
            }
        }


        /**
         * @private Updates lookup map and potentially first/last indices when an item is set via index (Proxy).
         * Called *after* the item has been set in the `items` array.
         * @param {number} index - The index being modified.
         * @param {object | null | undefined} newItem - The new item now at the index.
         * @param {object | null | undefined} oldItem - The item previously at the index.
         */
        _updateLookupsAndBoundaries(index, newItem, oldItem) {
            const oldItemWasValid = oldItem != null;
            const newItemIsValid = newItem != null;
            let needsBoundaryRebuild = false;

            // 1. Update href lookup map
            // Remove old item from lookup if it was the one mapped
            if (oldItemWasValid && oldItem.href != null && this.lookup.get(oldItem.href) === oldItem) {
                this.lookup.delete(oldItem.href);
                // Check if another item with the same href exists now needs to be in the lookup
                const existingItemWithSameHrefIndex = this.items.findLastIndex(item => item != null && item.href === oldItem.href);
                if (existingItemWithSameHrefIndex !== -1 && existingItemWithSameHrefIndex !== index) {
                    this.lookup.set(oldItem.href, this.items[existingItemWithSameHrefIndex]);
                }
            }
            // Add new item to lookup if it's valid and has an href
            if (newItemIsValid && newItem.href != null) {
                const existingHrefItem = this.lookup.get(newItem.href);
                if (existingHrefItem && existingHrefItem !== newItem) {
                    console.warn(`[_updateLookupsAndBoundaries] Overwriting href lookup for "${newItem.href}" which pointed to a different instance.`);
                }
                this.lookup.set(newItem.href, newItem);
            }

            // 2. Update first/last valid indices - check if boundaries might have changed
            if (oldItemWasValid !== newItemIsValid) {
                // Item changed validity status
                needsBoundaryRebuild = true;
            } else if (newItemIsValid) {
                // Item remained valid, check if it's at a boundary index
                if (index <= this._firstValidIndex || index >= this._lastValidIndex) {
                    needsBoundaryRebuild = true;
                }
            } else {
                // Item remained null/undefined, no boundary change possible from this specific index
            }


            // If the change *might* have affected boundaries, rebuild them.
            // It's simpler and safer than complex incremental updates for set().
            if (needsBoundaryRebuild || this.items.length <= 1) {
                this._findAndUpdateFirstValidIndex();
                // Only update last if first was found (avoids extra loop if empty)
                if (this._firstValidIndex !== -1) {
                    this._findAndUpdateLastValidIndex();
                } else {
                    this._lastValidIndex = -1; // Ensure last is also -1 if first is
                }
            }
            // If no rebuild needed (e.g. valid->valid in middle), indices remain correct.
        }

        // _updateBoundariesAfterRemoval is removed as _removeIndexInternal now uses rebuildLookupsAndBoundaries()
    }

    // --- Proxy Factory Function (No changes needed for splice, relies on method forwarding) ---

    /**
     * Creates a ThumbCollection instance wrapped in a Proxy for array-like bracket access.
     * Handles null/undefined values and updates the href lookup map and first/last item
     * tracking correctly.
     * @param {Array<object|null|undefined>} [initialItems=[]] - Optional initial array of items.
     * @returns {ThumbCollection & Proxy} - The proxied collection instance.
     */
    function createThumbCollection(initialItems = []) {
        const collectionInstance = new ThumbCollection(initialItems);

        const handler = {
            get(target, prop, receiver) {
                // Handle symbols (like Symbol.iterator) correctly
                if (typeof prop === 'symbol') {
                    const value = Reflect.get(target, prop, receiver);
                    if (typeof value === 'function') {
                        return value.bind(target);
                    }
                    return value;
                }

                // Check if prop is a valid array index (numeric string)
                const index = parseInt(prop, 10);
                // Check if it parses cleanly and the string representation matches
                if (String(prop) === String(index) && index >= 0) {
                    // Access the item directly from the internal array
                    // Use Reflect.get for consistency and potential future features
                    return Reflect.get(target.items, prop, receiver);
                }

                // Access other properties or methods (like getByHref, first, last, push, length etc.)
                const value = Reflect.get(target, prop, receiver);
                if (typeof value === 'function') {
                    // Bind methods to the collection instance
                    return value.bind(target);
                }
                return value; // Return other properties like length
            },

            set(target, prop, value, receiver) {
                // Check if prop is a valid array index (numeric string)
                const index = parseInt(prop, 10);
                if (String(prop) === String(index) && index >= 0) {
                    // Allow setting one past the end like arrays (causes length increase)
                    if (index > target.items.length) {
                        console.warn(`[Proxy set] Index ${index} is out of bounds (length is ${target.items.length}). Setting will create undefined holes.`);
                        // Allow Reflect.set to handle potential sparseness if desired
                    }

                    // Get the item currently at the index *before* overwriting it
                    const oldItem = target.items[index]; // Will be undefined if index >= target.items.length

                    // Set the value in the internal array. Use Reflect.set on the array itself.
                    const success = Reflect.set(target.items, prop, value, target.items);

                    if (success) {
                        // Update the lookup map and first/last indices based on the old and new items
                        // Pass the actual index used, the new value, and the old value
                        target._updateLookupsAndBoundaries(index, value, oldItem);
                    }
                    return success;
                }
                // Allow setting other properties directly on the ThumbCollection instance
                // Note: This bypasses _updateLookupsAndBoundaries; only intended for internal props if any
                // or potentially custom properties added outside the collection's core data.
                return Reflect.set(target, prop, value, target);
            },

            deleteProperty(target, prop) {
                // Prevent deleting symbol properties
                if (typeof prop === 'symbol') {
                    console.warn(`Attempted to delete symbol property: ${prop.toString()}`);
                    return false;
                }

                // Check if prop is a valid array index (numeric string)
                const index = parseInt(prop, 10);
                if (String(prop) === String(index) && index >= 0) {
                    // Check if the index is within the current bounds of the array
                    if (index < target.items.length) {
                        // Use the public removeByIndex method which handles everything
                        return target.removeByIndex(index);
                    } else {
                        // Index out of bounds, standard array delete returns true but does nothing
                        // For consistency with potential strict modes or expectations, return false.
                        return false;
                    }
                }

                // Prevent deletion of non-numeric properties (methods, internal properties) by default
                console.warn(`Attempted to delete non-index property: ${prop}. Deletion disallowed.`);
                return false;
            },

            has(target, prop) {
                // Handle symbols
                if (typeof prop === 'symbol') {
                    return Reflect.has(target, prop);
                }

                // Check if prop is a valid array index (numeric string)
                const index = parseInt(prop, 10);
                if (String(prop) === String(index) && index >= 0) {
                    // Standard array 'has' check (index must be within bounds and not an empty slot)
                    // Note: `target.items.hasOwnProperty(prop)` might be more accurate for sparse arrays
                    // but `index < target.items.length` is typical array behavior for `in`.
                    return index < target.items.length;
                }

                // Check for methods/properties defined on the ThumbCollection instance itself
                return Reflect.has(target, prop);
            },

            // --- Other traps (optional but good for robustness) ---

            ownKeys(target) {
                // Combine array indices with the target object's own keys
                const itemKeys = Object.keys(target.items);
                const targetKeys = Reflect.ownKeys(target);
                // Filter out duplicates ('length' might be in both) and non-enumerable if needed
                // Simple approach: combine and create a Set to deduplicate
                return [...new Set([...itemKeys, ...targetKeys])];
            },

            getOwnPropertyDescriptor(target, prop) {
                // Check if prop is an index
                const index = parseInt(prop, 10);
                if (String(prop) === String(index) && index >= 0 && index < target.items.length) {
                    // Get descriptor from the items array
                    return Reflect.getOwnPropertyDescriptor(target.items, prop);
                }
                // Otherwise, get descriptor from the target object itself
                return Reflect.getOwnPropertyDescriptor(target, prop);
            }
        };

        return new Proxy(collectionInstance, handler);
    }/**
 * Manages running asynchronous tasks (functions returning Promises) with a limited concurrency.
 */
    class PromisePool {
        /**
         * Creates an instance of PromisePool.
         * @param {number} maxConcurrency - The maximum number of tasks to run concurrently. Must be at least 1.
         */
        constructor(maxConcurrency = 5) {
            this.maxConcurrency = Math.max(1, Math.floor(maxConcurrency)); // Ensure positive integer >= 1
            this.activePromises = new Set(); // Stores the wrapper promises of active tasks
            this.queuedTasks = []; // Stores tasks waiting for a slot { taskFactory: Function, resolve: Function, reject: Function }
        }

        /**
         * Waits until a concurrency slot is available.
         * Should only be called when the pool is actually full.
         * @private
         */
        async #waitForSlot() {
            // This promise resolves when any active task finishes, freeing a slot.
            // We race against all active promises. The first one to settle (resolve/reject)
            // will cause Promise.race to settle. The finally block on that task's
            // wrapper promise will remove it from activePromises.
            try {
                await Promise.race(this.activePromises);
            } catch (err) {
                // Ignore errors here. Promise.race rejects if the first promise to settle rejects.
                // The error is handled by the individual task's catch block (or should be).
                // We only care that *a* slot became free.
            }
            // After race settles, a slot *should* be free due to the finally() block
            // in the wrapper promise created in _runTask. We might need to loop
            // in run(), but let's try without first. A check before adding is safer.
        }


        /**
         * Internal method to actually execute a task and manage its lifecycle within the pool.
         * @param {Function} taskFactory - A function that returns the Promise for the task.
         * @private
         */
        #runTask(taskFactory) {
            const taskPromise = taskFactory(); // Execute the function to get the actual promise

            // Create a wrapper promise that handles removing itself from the active set
            // regardless of whether the original task resolves or rejects.
            const managedPromise = taskPromise
                .catch(err => {
                    // Catch errors from the taskFactory's promise here
                    // to prevent unhandled rejections potentially crashing Promise.race
                    // or Promise.allSettled if the caller doesn't handle them.
                    // The caller should still handle errors on the promise returned by run().
                    // We don't re-throw here to allow other tasks to continue smoothly.
                    // console.error("PromisePool: Task encountered an error:", err); // Optional internal logging
                })
                .finally(() => {
                    this.activePromises.delete(managedPromise); // Remove itself from active set
                    // Check if there are queued tasks waiting
                    if (this.queuedTasks.length > 0) {
                        const nextTaskInfo = this.queuedTasks.shift();
                        // Run the next queued task directly since we know a slot is free
                        const nextTaskPromise = this.#runTask(nextTaskInfo.taskFactory);
                        // Link the original promise resolves/rejects
                        nextTaskPromise.then(nextTaskInfo.resolve, nextTaskInfo.reject);
                    }
                });

            this.activePromises.add(managedPromise); // Add the wrapper promise to the active set
            return taskPromise; // Return the *original* task's promise to the caller
        }


        /**
         * Submits a task to the pool. The task will run when a concurrency slot is available.
         *
         * @param {Function} taskFactory - A function that returns a Promise when called.
         *                                Example: () => fetch(url)
         * @returns {Promise<any>} A Promise that resolves or rejects with the result of the taskFactory's promise.
         */
        run(taskFactory) {
            return new Promise((resolve, reject) => {
                if (this.activePromises.size < this.maxConcurrency) {
                    // Enough slots, run immediately
                    const taskPromise = this.#runTask(taskFactory);
                    // Link the resolution/rejection back to the promise we return
                    taskPromise.then(resolve, reject);
                } else {
                    // Pool is full, queue the task
                    // console.log(`PromisePool: Pool full (${this.activePromises.size}). Queuing task.`);
                    this.queuedTasks.push({ taskFactory, resolve, reject });
                }
            });

            // ---- Simpler approach without explicit queue ----
            // Need async here to use await
            /* async run(taskFactory) {
                 // Wait if the pool is full
                 while (this.activePromises.size >= this.maxConcurrency) {
                     await this.#waitForSlot();
                 }
                 // Now a slot is free, run the task
                 return this.#runTask(taskFactory);
            } */
            // Chose the queue approach as it feels slightly more robust in managing
            // the exact start time rather than potentially multiple checks after Promise.race.
        }

        /**
         * Returns a Promise that resolves when all currently active and queued tasks have settled (completed or failed).
         * @returns {Promise<void>}
         */
        async waitAll() {
            // Wait until both the active set AND the queue are empty.
            while (this.activePromises.size > 0 || this.queuedTasks.length > 0) {
                if (this.activePromises.size > 0) {
                    try {
                        // Wait for *all* currently active promises to settle.
                        // Using allSettled ensures we wait even if some fail.
                        await Promise.allSettled(this.activePromises);
                    } catch (e) { /* Should not happen with allSettled */ }
                } else {
                    // If active is empty but queue is not, it might mean tasks finished
                    // very quickly. Add a small delay to allow the event loop to potentially
                    // process the next queued item triggered by a finally() block.
                    await new Promise(resolve => setTimeout(resolve, 0));
                }
                // Loop continues check in case new items were queued while waiting
            }
        }
    }
    // ----------------------------------------------------------------------------------------------
    // config.js
    // ----------------------------------------------------------------------------------------------

    function sanitizeKeyForHtmlId(key) {
        // Replace spaces, parentheses, and dots with underscores
        return key.replace(/[\s().]/g, '_');
    }

    class Config {
        constructor(title, configDefinitions = {}, closeOnClickAway = true, requiresReload = false) {
            this.title = title;
            this.originalDefinitions = configDefinitions;
            this.data = {}; // Will hold the nested configuration data
            this.flatDefinitions = {}; // Will hold the flattened definitions map (flatKey -> definition)
            this._reloadListeners = []; // Array of reload listeners
            this.hiddenTabs = new Set(); // Stores names of tabs explicitly marked as hidden
            this._listeners = []; // Array of save click listeners
            this._buildDataAndFlatDefinitions(this.originalDefinitions, this.data);

            // Load needs the data structure and flat definitions
            this.load();

            // Accessors need the loaded data
            this._createAccessors(); // Modified call

            this.registerMenuCommand();
            this.overlay = null;
            this.boundEscapeHandler = this.handleEscape.bind(this);
            this.boundClickAwayHandler = this.handleClickAway.bind(this);
            this.activeTab = null;
            this.closeOnClickAway = closeOnClickAway;
            this.requiresReload = requiresReload;
        }

        onSaveClick(callback) {
            if (typeof callback === 'function') {
                this._listeners.push(callback);
            }
            // return unsubscribe function
            return () => { this.offSaveClick(callback); };
        }

        offSaveClick(callback) {
            this._listeners = this._listeners.filter(listener => listener !== callback);
        }

        _notifyListeners() {
            this._listeners.forEach((listener, index) => {
                try {
                    listener();
                } catch (error) {
                    console.error(`Config: Error executing save listener at index ${index}:`, error);
                }
            });
        }

        onReload(callback) {
            if (typeof callback === 'function') {
                this._reloadListeners.push(callback);
            }
            return () => { this.offReload(callback); }; // Return unsubscribe function
        }

        offReload(callback) {
            this._reloadListeners = this._reloadListeners.filter(listener => listener !== callback);
        }

        _notifyReloadListeners() {
            this._reloadListeners.forEach((listener, index) => {
                try {
                    listener();
                } catch (error) {
                    console.error(`Config: Error executing reload listener at index ${index}:`, error);
                }
            });
        }

        _buildDataAndFlatDefinitions(sourceDefinitions, currentDataLevel, pathParts = [], currentTab = 'General', hideAll = false, currentSection = null) {
            for (const key in sourceDefinitions) {
                if (!Object.prototype.hasOwnProperty.call(sourceDefinitions, key)) continue;

                // Skip special metadata keys
                if (key.startsWith('_')) continue;

                const value = sourceDefinitions[key];
                const newPathParts = [...pathParts, key];

                if (typeof value === 'object' && value !== null) {
                    // Check if it's a leaf setting (has 'default') OR a description text (has 'text: true')
                    const isLeafSetting = Object.prototype.hasOwnProperty.call(value, 'default');
                    const isDescriptionText = value.text === true; // Check for the description flag

                    if (isLeafSetting || isDescriptionText) {
                        // Leaf definition (setting or description)
                        const flatKey = newPathParts.join('.');
                        const definition = { ...value, tab: currentTab, section: currentSection, originalKey: key }; // Store original key
                        if (hideAll) definition.hidden = true;

                        this.flatDefinitions[flatKey] = definition;
                        // Assign a default value: use definition.default if present, otherwise null (for description)
                        currentDataLevel[key] = isLeafSetting ? definition.default : null;
                    } else {
                        // It's a nested sub-config object
                        const newTabName = value._tabName || ((pathParts.length === 0) ? key : currentTab);

                        // Determine section
                        let newSection = currentSection;
                        if (value._tabName) newSection = null; // Reset section on tab change
                        if (value._sectionName) newSection = value._sectionName;

                        if (!Object.prototype.hasOwnProperty.call(currentDataLevel, key)) {
                            currentDataLevel[key] = {};
                        }

                        let nextHideAll = hideAll;
                        // Check if this group itself should be hidden
                        if (value._hidden === true) {
                            this.hiddenTabs.add(newTabName);
                            nextHideAll = true;
                        }
                        // Pass the determined tab name down in the recursive call
                        this._buildDataAndFlatDefinitions(value, currentDataLevel[key], newPathParts, newTabName, nextHideAll, newSection);
                    }
                } else {
                    console.warn(`Config: Invalid definition format for key "${key}" at path "${newPathParts.join('.')}"`, value);
                }
            }
        }

        _getValueByFlatKey(flatKey) {
            const keys = flatKey.split('.');
            let current = this.data;
            for (const key of keys) {
                if (current === null || typeof current !== 'object' || !Object.prototype.hasOwnProperty.call(current, key)) {
                    return undefined;
                }
                current = current[key];
            }
            return current;
        }

        _setValueByFlatKey(flatKey, value) {
            const keys = flatKey.split('.');
            let current = this.data;
            for (let i = 0; i < keys.length - 1; i++) {
                const key = keys[i];
                if (current === null || typeof current !== 'object' || !Object.prototype.hasOwnProperty.call(current, key)) {
                    console.error(`Config: Cannot set value for key "${flatKey}". Invalid path segment "${key}".`);
                    return false;
                }
                current = current[key];
            }
            if (current === null || typeof current !== 'object') {
                console.error(`Config: Cannot set value for key "${flatKey}". Final path segment parent is not an object.`);
                return false;
            }
            current[keys[keys.length - 1]] = value;
            return true;
        }

        _updateDataFromForm(formElement) {
            console.log("Config: Reading values from form to update internal data.");
            Object.entries(this.flatDefinitions).forEach(([flatKey, definition]) => {
                if (definition.hidden === true || definition.text === true) return; // Skip hidden and description text

                const sanitizedKey = sanitizeKeyForHtmlId(flatKey);
                const input = formElement.querySelector(`#config-${sanitizedKey}`);
                if (!input) {
                    console.warn(`Config: Could not find input element for key ${flatKey}`);
                    return;
                }

                let newValue;
                if (input.tagName.toLowerCase() === "select") {
                    newValue = input.value;
                } else if (input.type === "checkbox") {
                    newValue = input.checked;
                } else if (input.type === "number") {
                    newValue = input.valueAsNumber;
                    if (isNaN(newValue)) newValue = definition.default; // Revert to default if invalid number
                } else { // text, etc.
                    newValue = input.value;
                }

                this._setValueByFlatKey(flatKey, newValue); // Update internal data
            });
        }

        _createAccessors() {
            const accessorRoot = this;

            for (const flatKey in this.flatDefinitions) {
                if (!Object.prototype.hasOwnProperty.call(this.flatDefinitions, flatKey)) continue;

                const pathParts = flatKey.split('.');
                const accessorKey = pathParts.pop(); // The leaf key name, e.g., "numColumns" or "replaceDefaultGridView"

                let currentTargetForProp = accessorRoot; // Where the final property 'accessorKey' will be defined
                let currentTargetForNesting = accessorRoot; // Tracks the object needed for the *next* level down (if not flattening)
                let currentDefinitionLevel = this.originalDefinitions;

                // Determine the target object based on _subgroup flags in the *original* definition structure
                for (const part of pathParts) { // Iterate parent path segments e.g., "Gallery (Embedded)", "embeddedGridViewConfig"
                    if (!currentDefinitionLevel || typeof currentDefinitionLevel !== 'object') {
                        console.error(`Config: Invalid definition structure encountered while processing "${part}" for flat key "${flatKey}"`);
                        currentTargetForProp = null; // Mark as invalid target
                        break;
                    }
                    let nextDefinitionLevel = currentDefinitionLevel[part];
                    const isFlattened = nextDefinitionLevel && typeof nextDefinitionLevel === 'object' && nextDefinitionLevel._subgroup === false;

                    // This logic determines where the *final* property (accessorKey) should live
                    if (!isFlattened) {
                        // If the *current* level definition (nextDefinitionLevel) is NOT flattened,
                        // the final property will live *inside* an object corresponding to 'part'.
                        // Ensure this nesting object exists on the *previous* target (currentTargetForNesting).
                        let nestingObject;
                        if (!Object.prototype.hasOwnProperty.call(currentTargetForNesting, part)) {
                            nestingObject = {};
                            Object.defineProperty(currentTargetForNesting, part, {
                                value: nestingObject,
                                enumerable: true,
                                configurable: false, // Prevent deletion of structure
                                writable: false
                            });
                        } else {
                            nestingObject = currentTargetForNesting[part];
                            // Check if it's a valid object for nesting
                            if (typeof nestingObject !== 'object' || nestingObject === null) {
                                console.error(`Config: Structure conflict. Expected object at "${pathParts.slice(0, pathParts.indexOf(part) + 1).join('.')}" but found non-object when defining "${flatKey}".`);
                                currentTargetForProp = null; // Mark as invalid target
                                break; // Stop processing this flatKey
                            }
                        }
                        currentTargetForProp = nestingObject; // The prop will live here
                        currentTargetForNesting = nestingObject; // Next potential nesting starts from here

                    } else {
                        // If the *current* level definition IS flattened (_subgroup: false),
                        // the final property lives directly on the *previous* target (currentTargetForNesting).
                        currentTargetForProp = currentTargetForNesting; // Reaffirm target is the parent level
                        // currentTargetForNesting technically stays the same for the next iteration of this loop,
                        // as the flattened group doesn't introduce a new level in the *accessor* hierarchy.
                    }

                    // Move down the definition structure for the next iteration's check
                    currentDefinitionLevel = nextDefinitionLevel;
                } // End loop through parent path parts

                // Define the final leaf accessor property if the target is valid
                if (currentTargetForProp) {
                    if (!Object.prototype.hasOwnProperty.call(currentTargetForProp, accessorKey)) {
                        Object.defineProperty(currentTargetForProp, accessorKey, {
                            get: () => this._getValueByFlatKey(flatKey),
                            set: (newValue) => {
                                // Optional: Add type validation/coercion based on definition.default type here?
                                if (this._setValueByFlatKey(flatKey, newValue)) {
                                    this.save();
                                }
                            },
                            enumerable: true,
                            configurable: true // Allows user to modify/delete later if needed
                        });
                    } else {
                        // Property already exists. This could be due to multiple flatKeys attempting
                        // to define the same property path (e.g., an error in definitions or complex flattening).
                        console.warn(`Config: Accessor key "${accessorKey}" already exists on target for flat key "${flatKey}". Check for definition conflicts.`);
                    }
                } else {
                    // Error occurred during path traversal, logged above.
                    //  console.error(`Config: Could not define accessor for "${flatKey}" due to structure issues.`);
                }
            } // End loop through flatKeys
        }

        load() {
            console.log("Config: Loading config values from local storage");
            for (const flatKey in this.flatDefinitions) {
                const storedValue = GM_getValue(flatKey);
                if (typeof storedValue !== 'undefined') {
                    this._setValueByFlatKey(flatKey, storedValue);
                }
            }
        }

        save() {
            console.log("Config: Saving config values to local storage");
            for (const flatKey in this.flatDefinitions) {
                const definition = this.flatDefinitions[flatKey];
                const currentValue = this._getValueByFlatKey(flatKey);
                if (currentValue !== undefined && currentValue !== definition.default) {
                    GM_setValue(flatKey, currentValue);
                } else {
                    GM_deleteValue(flatKey);
                }
            }
        }

        handleEscape(e) {
            if (e.key === "Escape" && this.overlay) {
                this.closeUI();
            }
        }

        handleClickAway(e) {
            if (this.closeOnClickAway && this.overlay) {
                const configContainer = this.overlay.querySelector('div');
                if (configContainer && !configContainer.contains(e.target)) {
                    this.closeUI();
                }
            }
        }

        closeUI() {
            if (this.overlay && this.overlay.parentNode) {
                this.overlay.parentNode.removeChild(this.overlay);
                this.overlay = null;
                document.removeEventListener("keydown", this.boundEscapeHandler);
                document.removeEventListener("click", this.boundClickAwayHandler);
            }
        }

        showingUI() {
            return !!this.overlay;
        }

        _updateElementDisabledState(elementWrapper, inputElement, isDisabled, definition) {
            const onConditionFail = definition.onConditionFail;

            if (!onConditionFail || onConditionFail == "disable") {
                inputElement.disabled = isDisabled;
                elementWrapper.style.opacity = isDisabled ? '0.5' : '1';
                elementWrapper.style.pointerEvents = isDisabled ? 'none' : 'auto';
            } else if (typeof onConditionFail === 'object') {
                if (onConditionFail.label) {
                    const labelElement = elementWrapper.querySelector('label');
                    if (isDisabled) {
                        labelElement.textContent = onConditionFail.label;
                    } else {
                        labelElement.textContent = definition.label;
                    }
                }
            } else {
                console.warn("Invalid onConditionFail: ", onConditionFail);
            }
        }

        _createTabButton(tabName, tabContainer, contentContainer) {
            const button = document.createElement("button");
            button.textContent = tabName;
            button.type = "button";
            button.style.padding = "1em 1em"; // Taller buttons
            button.style.width = "100%";
            button.style.textAlign = "left";
            button.style.marginBottom = "4px"; // Gap between buttons
            button.style.border = "none";
            button.style.cursor = "pointer";
            button.style.backgroundColor = "transparent";
            button.style.color = "#ccc";
            button.style.outline = "none";
            button.style.whiteSpace = "nowrap"; // Prevent wrapping
            button.style.borderRadius = "4px";

            button.addEventListener("click", () => {
                Array.from(tabContainer.children).forEach(btn => {
                    btn.style.backgroundColor = "#444";
                    btn.style.color = "#ccc";
                    btn.style.borderBottom = "1px solid #555";
                    btn.style.fontWeight = "normal";
                });
                Array.from(contentContainer.children).forEach(pane => pane.style.display = "none");

                button.style.backgroundColor = "#666"; // Highlight active
                button.style.color = "#fff";
                button.style.fontWeight = "bold";

                const contentPane = contentContainer.querySelector(`[data-tab-content="${tabName}"]`);
                if (contentPane) contentPane.style.display = "block";
                this.activeTab = tabName;
            });
            return button;
        }

        showUI(parent) {
            if (this.showingUI()) return;
            if (!parent) parent = document.body;
            const overlay = document.createElement("div");
            overlay.style.position = "fixed";
            overlay.style.top = 0;
            overlay.style.left = 0;
            overlay.style.width = "100%";
            overlay.style.height = "100%";
            overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
            overlay.style.zIndex = 1000000;
            overlay.style.display = "flex";
            overlay.style.justifyContent = "center";
            this.overlay = overlay;
            const configContainer = document.createElement("div");
            configContainer.style.padding = "1em";
            configContainer.style.backgroundColor = "#333";
            configContainer.style.color = "#fff";
            configContainer.style.maxHeight = "80vh";
            configContainer.style.alignSelf = "flex-start";
            configContainer.style.margin = "5vh auto 0 auto";
            configContainer.style.overflowY = "auto";
            configContainer.style.border = "1px solid #555";
            configContainer.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.3)";
            configContainer.style.width = "700px";
            configContainer.style.borderRadius = "4px";
            configContainer.style.fontFamily = "Arial, sans-serif";
            if (this.title) {
                const titleElement = document.createElement("h2");
                titleElement.textContent = this.title;
                titleElement.style.marginTop = 0;
                titleElement.style.marginBottom = "1em";
                titleElement.style.textAlign = "center";
                configContainer.appendChild(titleElement);
            }

            const mainFlexWrapper = document.createElement("div");
            mainFlexWrapper.style.display = "flex";
            mainFlexWrapper.style.alignItems = "stretch";
            mainFlexWrapper.style.overflow = "hidden"; // Prevent layout blowout

            const tabButtonContainer = document.createElement("div");
            tabButtonContainer.style.borderRight = "1px solid #555";
            tabButtonContainer.style.paddingRight = "0.5em";
            tabButtonContainer.style.display = "flex";
            tabButtonContainer.style.flexDirection = "column";
            tabButtonContainer.style.flexShrink = "0";
            tabButtonContainer.style.width = "auto"; // Allow growth for text
            tabButtonContainer.style.minWidth = "120px";

            const tabContentContainer = document.createElement("div");
            tabContentContainer.style.paddingLeft = "1em";
            tabContentContainer.style.flexGrow = "1";
            tabContentContainer.style.overflowY = "auto"; // Content scrolls

            const tabs = {};
            // Map to store dependencies: controllerKey -> [dependentKey1, dependentKey2, ...]
            const dependencyMap = {};

            Object.entries(this.flatDefinitions).forEach(([flatKey, definition]) => {
                if (definition.hidden === true) return;
                const tabName = definition.tab || 'General';

                // --- Build Dependency Map ---
                if (definition.condition && Array.isArray(definition.condition) && definition.condition.length === 2) {
                    const [controllerKey, /* requiredValue */] = definition.condition;
                    if (!dependencyMap[controllerKey]) {
                        dependencyMap[controllerKey] = [];
                    }
                    dependencyMap[controllerKey].push(flatKey); // Store the dependent key
                }
                // --- End Build Dependency Map ---
                if (!tabs[tabName]) {
                    tabs[tabName] = [];
                }
                tabs[tabName].push(flatKey);
            });

            const allTabNames = Object.keys(tabs);
            const visibleTabNames = allTabNames.filter(name => !this.hiddenTabs.has(name));
            this.activeTab = visibleTabNames.length > 0 ? visibleTabNames[0] : null;

            const form = document.createElement("form");
            form.style.flexGrow = "1";
            form.style.minWidth = "0";
            form.style.display = "flex";
            form.style.flexDirection = "column";
            let previousFieldType = null; // Track the type of the previous field

            // --- Create Save & Reload button upfront if needed ---
            let saveReloadButton = null; // Reference to the Save & Reload button
            const anySettingRequiresReload = Object.values(this.flatDefinitions).some(def => def.requiresReload === true);
            const needsReloadButton = this.requiresReload || anySettingRequiresReload;

            if (needsReloadButton) {
                saveReloadButton = document.createElement("button");
                saveReloadButton.textContent = "Save & Reload";
                saveReloadButton.type = "button"; // Important: prevent form submission
                saveReloadButton.style.marginLeft = "0.5em";
                saveReloadButton.style.padding = "0.5em 1em";
                saveReloadButton.style.backgroundColor = "#2196F3";
                saveReloadButton.style.border = "none";
                saveReloadButton.style.borderRadius = "3px";
                saveReloadButton.style.color = "#fff";
                saveReloadButton.style.cursor = "pointer";
                saveReloadButton.style.display = 'none'; // Initially hidden
            }
            const createFieldElement = (key) => {
                const self = this; // Capture 'this' for use in listeners
                const definition = this.flatDefinitions[key];
                const value = this._getValueByFlatKey(key);
                const fieldWrapper = document.createElement("div");
                fieldWrapper.style.marginBottom = "0.75em";
                fieldWrapper.style.display = "flex";
                fieldWrapper.style.alignItems = "center";

                // Add extra spacing only when switching between checkbox/description and other fields
                const currentIsCheckbox = typeof value === "boolean";
                const isDescription = definition.text === true;
                if (previousFieldType !== null && (currentIsCheckbox || isDescription) !== previousFieldType) {
                    fieldWrapper.style.marginTop = "2em";
                }
                previousFieldType = (currentIsCheckbox || isDescription);

                const labelElement = document.createElement("label");
                const sanitizedKey = sanitizeKeyForHtmlId(key); // Use the helper function
                labelElement.textContent = definition.label || key.split('.').pop();
                labelElement.htmlFor = `config-${sanitizedKey}`; // Use sanitized key
                labelElement.style.marginRight = "0.5em";
                labelElement.style.fontWeight = "bold";
                labelElement.style.textAlign = "left";
                let input;

                // Only set fixed width for non-checkbox inputs
                if (typeof value !== "boolean") {
                    labelElement.style.width = "200px";
                }

                // Check if it's a description text
                if (definition.text === true) {
                    const descriptionElement = document.createElement('p');
                    descriptionElement.textContent = definition.label || definition.originalKey || "Description text missing"; // Use label or original key
                    descriptionElement.style.margin = "0 0 0.75em 0"; // Adjust margin as needed
                    descriptionElement.style.fontStyle = "italic";
                    descriptionElement.style.color = "#bbb"; // Lighter color for description
                    return descriptionElement; // Return only the description paragraph
                }
                if (definition.choices && Array.isArray(definition.choices)) {
                    input = document.createElement("select");
                    input.id = `config-${sanitizedKey}`; // Use sanitized key
                    input.style.flexGrow = "1";
                    input.style.padding = "0.3em";
                    input.style.border = "1px solid #777";
                    input.style.borderRadius = "2px";
                    input.style.backgroundColor = "#555";
                    input.style.color = "#fff";
                    definition.choices.forEach((choice) => {
                        const option = document.createElement("option");
                        option.value = choice;
                        option.textContent = choice;
                        if (choice === value) {
                            option.selected = true;
                        }
                        input.appendChild(option);
                    });
                }
                else if (typeof value === "boolean") {
                    input = document.createElement("input");
                    input.id = `config-${sanitizedKey}`; // Use sanitized key
                    input.type = "checkbox";
                    input.checked = value;
                    input.style.transform = "scale(1.2)";
                } else if (typeof value === "number") {
                    input = document.createElement("input");
                    input.id = `config-${sanitizedKey}`; // Use sanitized key
                    input.type = "number";
                    input.value = value;
                    input.style.flexGrow = "1";
                    input.style.padding = "0.3em";
                    input.style.border = "1px solid #777";
                    input.style.borderRadius = "2px";
                    input.style.backgroundColor = "#555";
                    input.style.color = "#fff";
                } else {
                    input = document.createElement("input");
                    input.id = `config-${sanitizedKey}`; // Use sanitized key
                    input.type = "text";
                    input.value = value;
                    input.style.flexGrow = "1";
                    input.style.padding = "0.3em";
                    input.style.border = "1px solid #777";
                    input.style.borderRadius = "2px";
                    input.style.backgroundColor = "#555";
                    input.style.color = "#fff";
                }
                // Append elements in the correct order (input first for checkbox visual)
                if (input.type === 'checkbox') {
                    input.style.marginRight = "0.5em"; // Add margin to separate from label
                    fieldWrapper.appendChild(input);
                    fieldWrapper.appendChild(labelElement);
                } else {
                    fieldWrapper.appendChild(labelElement);
                    fieldWrapper.appendChild(input);
                }

                // --- Initial Condition Check ---
                if (definition.condition && Array.isArray(definition.condition) && definition.condition.length === 2) {
                    const [controllerKey, requiredValue] = definition.condition;
                    const controllerDefinition = this.flatDefinitions[controllerKey];
                    if (controllerDefinition) {
                        const controllerValue = this._getValueByFlatKey(controllerKey);
                        const isDisabled = controllerValue !== requiredValue;
                        this._updateElementDisabledState(fieldWrapper, input, isDisabled, definition);
                    } else {
                        console.warn(`Config: Controller key "${controllerKey}" for dependent key "${key}" not found in definitions.`);
                    }
                }
                // --- End Initial Condition Check ---

                // Add change listener to potentially show the Save & Reload button
                // AND add listener if this element is a *controller* for other elements
                if (input) { // Check if input exists (not a description text)
                    // Use 'click' for checkboxes for immediate feedback, 'input' for others
                    const eventType = (input.type === 'checkbox') ? 'click' : 'input';

                    // --- Listener for CONTROLLER elements ---
                    if (dependencyMap[key]) { // Check if this key controls others
                        input.addEventListener(eventType, (event) => {
                            let newValue;
                            if (input.type === 'checkbox') newValue = event.target.checked;
                            else if (input.type === 'number') newValue = event.target.valueAsNumber;
                            else newValue = event.target.value; // string, select

                            // Update dependent elements
                            dependencyMap[key].forEach(dependentKey => {
                                const dependentDefinition = self.flatDefinitions[dependentKey];
                                const requiredValue = dependentDefinition.condition[1];
                                const depSanitizedKey = sanitizeKeyForHtmlId(dependentKey);
                                const depInput = form.querySelector(`#config-${depSanitizedKey}`);
                                const depWrapper = depInput ? depInput.closest('div') : null; // Find the wrapper div

                                if (depWrapper && depInput) {
                                    const shouldBeDisabled = newValue !== requiredValue;
                                    self._updateElementDisabledState(depWrapper, depInput, shouldBeDisabled, dependentDefinition);
                                }
                            });
                        });
                    }
                    // --- End Listener for CONTROLLER elements ---

                    input.addEventListener(eventType, () => {
                        const settingDefinition = this.flatDefinitions[key];
                        const settingRequiresReload = settingDefinition.requiresReload === true ||
                            (settingDefinition.requiresReload !== false && this.requiresReload === true);

                        if (settingRequiresReload && saveReloadButton) { // saveReloadButton reference is now correct
                            saveReloadButton.style.display = ''; // Show the button
                        }
                    });
                }
                return fieldWrapper;
            };

            visibleTabNames.forEach(tabName => {
                const button = this._createTabButton(tabName, tabButtonContainer, tabContentContainer);
                tabButtonContainer.appendChild(button);

                const contentPane = document.createElement("div");
                contentPane.dataset.tabContent = tabName;
                contentPane.style.display = "none";

                let currentSection = null;
                let currentContainer = contentPane;
                previousFieldType = null; // Reset spacing tracker for new tab

                tabs[tabName].forEach(key => {
                    const def = this.flatDefinitions[key];

                    if (def.section !== currentSection) {
                        if (def.section) {
                            const fieldset = document.createElement("fieldset");
                            fieldset.style.border = "1px solid #555";
                            fieldset.style.borderRadius = "3px";
                            fieldset.style.padding = "0.5em";
                            fieldset.style.marginBottom = "1em";

                            const legend = document.createElement("legend");
                            legend.textContent = def.section;
                            legend.style.padding = "0 5px";
                            legend.style.color = "#ddd";
                            legend.style.fontSize = "0.9em";
                            legend.style.fontWeight = "bold";

                            fieldset.appendChild(legend);
                            contentPane.appendChild(fieldset);
                            currentContainer = fieldset;
                        } else {
                            currentContainer = contentPane;
                        }
                        currentSection = def.section;
                        previousFieldType = null; // Reset spacing tracker when section changes
                    }
                    currentContainer.appendChild(createFieldElement(key));
                });
                tabContentContainer.appendChild(contentPane);
            });

            const buttonsWrapper = document.createElement("div");
            buttonsWrapper.style.padding = "1em";
            buttonsWrapper.style.textAlign = "right";
            buttonsWrapper.style.flexShrink = "0"; // Keep fixed at bottom
            const saveButton = document.createElement("button");
            saveButton.textContent = "Save Config";
            saveButton.type = "submit";
            saveButton.style.marginLeft = "0.5em";
            saveButton.style.padding = "0.5em 1em";
            saveButton.style.backgroundColor = "#4CAF50";
            saveButton.style.border = "none";
            saveButton.style.borderRadius = "3px";
            saveButton.style.color = "#fff";
            saveButton.style.cursor = "pointer";
            const cancelButton = document.createElement("button");
            cancelButton.textContent = "Cancel";
            cancelButton.type = "button";
            cancelButton.style.padding = "0.5em 1em";
            cancelButton.style.backgroundColor = "#f44336";
            cancelButton.style.border = "none";
            cancelButton.style.borderRadius = "3px";
            cancelButton.style.color = "#fff";
            cancelButton.style.cursor = "pointer";
            cancelButton.addEventListener("click", () => {
                this.closeUI();
            });
            buttonsWrapper.appendChild(cancelButton);
            buttonsWrapper.appendChild(saveButton);
            // Append the Save & Reload button if it was created
            if (saveReloadButton) {
                saveReloadButton.addEventListener("click", () => {
                    this._updateDataFromForm(form);
                    this.save();
                    this._notifyListeners();
                    this._notifyReloadListeners();
                    this.closeUI();
                    window.location.reload();
                });
                buttonsWrapper.appendChild(saveReloadButton);
            }

            form.appendChild(tabContentContainer);
            form.appendChild(buttonsWrapper);

            mainFlexWrapper.appendChild(tabButtonContainer);
            mainFlexWrapper.appendChild(form);
            configContainer.appendChild(mainFlexWrapper);

            form.addEventListener("submit", (e) => {
                e.preventDefault();
                this._updateDataFromForm(form);
                this.save();
                this._notifyListeners();
                this.closeUI();
            });

            overlay.appendChild(configContainer);

            // Pre-calculation of height to prevent shifting
            // 1. Append hidden overlay to DOM to allow measurement
            overlay.style.visibility = "hidden";
            parent.appendChild(overlay);

            // Fix sidebar width to prevent jumping when bolding active tab
            const sidebarButtons = Array.from(tabButtonContainer.children);
            sidebarButtons.forEach(btn => btn.style.fontWeight = "bold");
            const sidebarWidth = Math.ceil(tabButtonContainer.getBoundingClientRect().width);
            sidebarButtons.forEach(btn => btn.style.fontWeight = "normal");
            tabButtonContainer.style.width = `${sidebarWidth}px`;
            tabButtonContainer.style.minWidth = `${sidebarWidth}px`;

            // 2. Measure maximum height among all tabs
            let maxContentHeight = 0;
            const panes = Array.from(tabContentContainer.children);

            // Temporarily reset styles to measure natural height
            panes.forEach(pane => {
                pane.style.display = "block";
                maxContentHeight = Math.max(maxContentHeight, pane.offsetHeight);
                pane.style.display = "none";
            });

            // 3. Set fixed height for the content area
            // Max height constraint (80vh roughly minus header/footer)
            const viewportHeight = window.innerHeight;
            const maxAllowedHeight = viewportHeight * 0.8;
            // Estimate header/footer height (Title + Buttons) ~ 120px
            const overhead = 120;

            const targetHeight = Math.min(maxContentHeight + overhead, maxAllowedHeight);

            // Apply height to container. 
            // We set height instead of maxHeight to enforce consistency across tabs.
            configContainer.style.height = `${targetHeight}px`;
            configContainer.style.display = "flex";
            configContainer.style.flexDirection = "column";

            // Ensure the flex wrapper takes available space so inner scrolling works
            mainFlexWrapper.style.flexGrow = "1";
            mainFlexWrapper.style.minHeight = "0"; // Flexbox scroll fix

            // 4. Activate first tab and show
            const firstTabButton = tabButtonContainer.querySelector('button');
            if (firstTabButton) firstTabButton.click();

            overlay.style.visibility = "visible";
            document.addEventListener("keydown", this.boundEscapeHandler);
            // Add slight delay to prevent instant close when opening
            setTimeout(() => {
                document.addEventListener("click", this.boundClickAwayHandler);
            }, 50);
        }

        registerMenuCommand(name = "Configuration") {
            GM_registerMenuCommand(name, () => this.showUI());
        }
    }
    // ----------------------------------------------------------------------------------------------
    // utils.js
    // ----------------------------------------------------------------------------------------------

    // Determine the current page index from URL parameter.
    function getPageIndexFromUrl(url) {
        const params = new URL(url).searchParams;
        const p = params.get("p");
        return p ? parseInt(p, 10) : 0;
    }

    function getTotalPages() {
        const pageLinks = Array.from(document.querySelectorAll('table.ptt a'))
            .filter(a => /^\d+$/.test(a.textContent));
        if (pageLinks.length === 0) return 1;
        const lastPageLink = pageLinks[pageLinks.length - 1];
        const pParam = getPageIndexFromUrl(lastPageLink.href);
        return pParam ? pParam + 1 : parseInt(lastPageLink.textContent, 10);
    }

    function getTotalImages() {
        const elements = document.querySelectorAll('td.gdt2');
        let pageCount = null;

        elements.forEach(el => {
            const text = el.textContent.trim();
            const match = text.match(/(\d+)\s*pages/i);
            if (match) {
                pageCount = parseInt(match[1], 10);
            }
        });

        if (pageCount !== null) {
            return pageCount;
        } else {
            console.warn('Image count not found.');
        }
    }

    function getThumbOffset(backgroundString, itemWidth) {
        const sanitizedBackground = backgroundString.replace(/url\([^)]+\)/, '');
        const tempDiv = document.createElement('div');
        tempDiv.style.cssText = `
    position: absolute; visibility: hidden; width: 0; height: 0;
    background: ${sanitizedBackground};
    `;
        document.body.appendChild(tempDiv);
        let backgroundPositionX = window.getComputedStyle(tempDiv).backgroundPositionX;
        document.body.removeChild(tempDiv);

        backgroundPositionX = parseFloat(backgroundPositionX);

        if (itemWidth) {
            const scale = itemWidth / THUMB_WIDTH;
            return scale * backgroundPositionX;
        }
        return backgroundPositionX;
    }

    function imageIndexToPageIndex(imageIndex) {
        return Math.floor(imageIndex / PAGINATION);
    }

    function getGalleryId() {
        try {
            const pathname = window.location.pathname;
            return pathname.split('/')[2];
        } catch {
            console.warn(`Error extracting gallery id from url ${window.location.pathname}`);
            return null;
        }
    }

    // requires thumbs.length global variable to be set
    function getSpritesheetWidthForPage(pageIndex) {
        const startIndex = pageIndex * PAGINATION;
        if (startIndex >= thumbs.length) {
            return 0;
        }
        const numImagesOnPage = Math.min(PAGINATION, thumbs.length - startIndex);
        return THUMB_WIDTH * numImagesOnPage;
    }

    function determineIfSpritesheets(initialThumbs) {
        if (!initialThumbs?.length) {
            return true;
        }
        const firstBg = initialThumbs[0].background;

        if (firstBg.includes(baseUrl) || firstBg.includes(".jpg")) {
            return false;
        }
        return true;
    }

    function fmtUrl(url, maxPayload = 50) {
        try {
            if (typeof url !== 'string') return String(url);
            const lower = url.toLowerCase();
            if (!lower.startsWith('data:')) return url; // non-data URLs: full
            // keep "data:[mediatype][;base64]," and then first maxPayload chars of payload
            const commaIdx = url.indexOf(',');
            if (commaIdx === -1) return url.slice(0, 100) + '…';
            const header = url.slice(0, commaIdx + 1);
            const payload = url.slice(commaIdx + 1);
            const truncated = payload.length > maxPayload ? payload.slice(0, maxPayload) + '…' : payload;
            return header + truncated;
        } catch (e) {
            return url;
        }
    }

    async function fetchDocument(url, signal = null) {
        try {
            const fetchOptions = {};
            if (signal instanceof AbortSignal) { // Only add signal if it's a valid AbortSignal
                fetchOptions.signal = signal;
            }
            const response = await fetch(url, fetchOptions);
            // Check if the request was aborted *after* the fetch promise resolves
            // Although fetch throws AbortError, this is an extra check in some edge cases.
            if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
            if (!response.ok)
                throw new Error(`HTTP error! status: ${response.status}`);
            const htmlText = await response.text();
            const parser = new DOMParser();
            return parser.parseFromString(htmlText, "text/html");
        } catch (error) {
            if (error.name === 'AbortError') {
                console.log(`Fetch aborted for ${url}`);
            } else {
                console.error("Error fetching document:", error);
            }
            throw error; // Re-throw the error after logging
        }
    }

    function getFirstByXpath(xpath, doc = document) {
        return doc.evaluate(
            xpath,
            doc,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;
    }

    const FULL_URL_XPATH = '//img[@id="img"]';
    const ORIGINAL_URL_XPATH = '//a[starts-with(normalize-space(text()), "Download original")]';
    async function extractImageUrls(url, signal = null) {
        const doc = await fetchDocument(url, signal); // Pass signal down
        if (!doc) return [null, null]; // fetchDocument might throw or return null/undefined on error
        const imageElem = getFirstByXpath(FULL_URL_XPATH, doc);
        const imageUrl = imageElem ? imageElem.src : null;
        const linkElem = getFirstByXpath(ORIGINAL_URL_XPATH, doc);

        // Not all images have a button do download the original image
        // If no button is present, then imageUrl already points to the original.
        const downloadHref = linkElem ? linkElem.getAttribute("href") : imageUrl;

        return [imageUrl, downloadHref];
    }

    // Return objects that include the link element and the page index.
    function extractThumbnailLinks(doc, pageIndex) {
        const gdtDiv = doc.getElementById("gdt");
        if (!gdtDiv) return [];

        function findThumbUrl(element) {
            if (!element) return null;

            const background = element.style.background;
            const regex = /url\(\s*(['"])?(.*?)\1\s*\)/;
            const match = background ? background.match(regex) : null;
            const url = match ? match[2] : null;

            if (url) {
                return { background: background, thumbUrl: url, width: element.offsetWidth, height: element.offsetHeight };
            }

            for (const child of element.children) {
                const result = findThumbUrl(child);
                if (result) {
                    return result;
                }
            }
            return null;
        }

        const array = Array.from(gdtDiv.querySelectorAll(`a[href^="${baseUrl}/s/"]`)).map((a, index) => {
            const href = a.href;
            const pictureElement = findThumbUrl(a);

            if (!pictureElement) {
                pictureElement = a.querySelector('div');
            }

            let background = pictureElement?.background || null;
            let width = pictureElement?.width || null;
            let height = pictureElement?.height || null;

            return {
                link: a,
                page: pageIndex,
                imageIndex: PAGINATION * pageIndex + index,
                fullImageUrl: null,
                originalImageUrl: null,
                href,
                background,
                width,
                height
            };
        });

        return array;
    }

    function extractHashFromEHUrl(imageUrl) {
        // Parse the URL; throws if invalid
        const url = new URL(imageUrl);

        // Split the pathname into segments
        // e.g. "/h/abc123-foo/bar" → ["", "h", "abc123-foo", "bar"]
        const segments = url.pathname.split('/');
        // Find the "h" segment and the next segment
        const idx = segments.indexOf('h');
        if (idx === -1 || segments.length <= idx + 1) {
            return null;
        }

        const hashSegment = segments[idx + 1];
        const [hash] = hashSegment.split('-');
        return hash;
    }

    function showGalleriesWithThisImage(imageUrl) {
        const hash = extractHashFromEHUrl(imageUrl);

        if (!hash) {
            console.error("Could not extract a valid hash from url: " + imageUrl);
            return;
        }

        const searchUrl = `${baseUrl}/?f_shash=${hash}`;
        window.open(searchUrl, '_blank', 'noopener,noreferrer');
    }

    function formatChapterMetadata(chapter) {
        const first = (chapter.linkText || "").trim();
        const second = (chapter.description || "").trim();
        const sep = first.endsWith('.') && second.startsWith('.') ? "" : " ";
        let text = (first + sep + second).trim();

        const pageNumber = (chapter.index + 1).toString();
        const numberPattern = new RegExp(`^(?:P)?0*${pageNumber}[\\s\\.\\-:]*`, 'i');
        if (numberPattern.test(text)) {
            text = text.replace(numberPattern, '').trim();
            if (/^[.\-:•■・]/.test(text)) {
                text = text.slice(1).trim();
            }
        }

        text = text.replaceAll('…', '...').replaceAll(' .', '.');
        const dotSections = text.match(/\.{2,}|-{2,}/g) || [];
        const longestDotSection = dotSections.reduce((longest, dots) =>
            dots.length > longest.length ? dots : longest, '');

        let title = text;
        let author = null;

        if (longestDotSection.length >= 2) {
            const parts = text.split(longestDotSection);
            if (parts.length >= 2) {
                title = parts[0].trim();
                author = parts.slice(1).join(longestDotSection).trim();
            }
        }

        return {
            title: title,
            author: author,
            pageLabel: (chapter.index + 1).toString()
        };
    }

    function createNotification(text, duration = 2) {
        const existingNotification = document.getElementById('Notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        const notificationContainer = document.createElement('div');
        notificationContainer.id = 'Notification';
        notificationContainer.style.zIndex = 999999;
        notificationContainer.style.position = 'fixed';
        notificationContainer.style.bottom = '30px';
        notificationContainer.style.left = '50%';
        notificationContainer.style.transform = 'translateX(-50%)';
        const notificationButton = document.createElement('input');
        notificationButton.type = 'button';
        notificationButton.value = text;
        notificationButton.style.padding = '10px';
        notificationButton.style.fontSize = '16px';
        notificationContainer.appendChild(notificationButton);
        document.body.appendChild(notificationContainer);
        setTimeout(() => {
            if (notificationContainer.parentElement) {
                notificationContainer.parentElement.removeChild(notificationContainer);
            }
        }, duration * 1000);
    }

    function clearNotification() {
        const existingNotification = document.getElementById('Notification');
        if (existingNotification) {
            existingNotification.remove();
        }
    }

    function ensureElement(element, name) {
        if (!element) {
            console.error(`${name} element not found!`);
            return false;
        }
        return true;
    }

    function saveImage(url) {
        console.log("Saving image from url " + url);
        let filename = url.split('/').pop();

        // for some reason downloading a webp image opens it in a new tab
        if (filename.endsWith('.webp')) {
            filename += '.png';
        }

        GM_download({
            url: url,
            name: filename,
            saveAs: true
        });
    }

    let styleElement = null;
    const NO_SCROLL_CLASS = 'disable-no-scroll';

    function lockPageScroll() {
        function createNoScrollStyle() {
            if (styleElement) return;

            const css = `
          .${NO_SCROLL_CLASS}, .${NO_SCROLL_CLASS} body {
            overflow: hidden !important;
          }
          /* Optional: Add padding rule here too */
          .${NO_SCROLL_CLASS} body.userscript-compensate-scrollbar {
             /* padding-right will be set via JS */
          }
        `;
            styleElement = document.createElement('style');
            styleElement.type = 'text/css';
            styleElement.appendChild(document.createTextNode(css));
            (document.head || document.documentElement).appendChild(styleElement);
        }
        createNoScrollStyle();
        if (document.documentElement.classList.contains(NO_SCROLL_CLASS)) return;
        document.documentElement.classList.add(NO_SCROLL_CLASS);
    }

    function unlockPageScroll() {
        if (!document.documentElement.classList.contains(NO_SCROLL_CLASS)) return;
        document.documentElement.classList.remove(NO_SCROLL_CLASS);
    }

    let hideStyleElement = null;
    const HIDE_CLASS = 'y_hidden';
    function hideElement(element) {
        function createHideStyle() {
            if (hideStyleElement) return; // only create the style element once

            const css = `
        .${HIDE_CLASS} {
        display: none !important;
        }
    `;

            hideStyleElement = document.createElement('style');
            hideStyleElement.type = 'text/css';
            hideStyleElement.appendChild(document.createTextNode(css));
            (document.head || document.documentElement).appendChild(hideStyleElement);
        }
        if (!element) {
            console.error('hideElement: No element provided.');
            return;
        }

        createHideStyle();

        element.classList.add(HIDE_CLASS);
    }

    function unhideElement(element) {
        if (!element) {
            console.error('unhideElement: No element provided.');
            return;
        }

        element.classList.remove(HIDE_CLASS);
    }

    function isElementHidden(element) {
        if (!element) {
            console.error('unhideElement: No element provided.');
            return;
        }
        return element.classList.contains(HIDE_CLASS);
    }

    function goToPageAnywhere(index) {
        console.log('Going to page index ' + index);
        if (imageViewer.isActive()) {
            imageViewer.goOrScrollToIndex(index);
        } else if (embeddedGridView) {
            if (config.embeddedGridGotoOpensViewer) {
                imageViewer.loadAndShowIndex(index);
            } else {
                embeddedGridView.scrollToIndex(index);
            }
        } else { // main index view without embedded custom grid view
            imageViewer.loadAndShowIndex(index);
        }
    }

    function isFullscreen() {
        return (
            document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.msFullscreenElement
        );
    }

    function requestFullscreen(element) {
        if (!isFullscreen()) {
            element.requestFullscreen?.() ||
                element.webkitRequestFullscreen?.() ||
                element.msRequestFullscreen?.();
        }
    }

    function exitFullscreen() {
        if (isFullscreen()) {
            document.exitFullscreen?.() ||
                document.webkitExitFullscreen?.() ||
                document.msExitFullscreen?.();
        }
    }

    /**
     * Inserts one or more items into an array *after* a specified index,
     * modifying the original array in place.
     * @param {Array<any>} array - The array to modify.
     * @param {number} index - The index *after* which items should be inserted.
     *                         - If index is -1, items are inserted at the beginning.
     *                         - If index is >= array.length - 1, items are appended to the end.
     *                         - Behavior for index < -1 is to insert at the beginning (same as index = -1).
     * @param {...any} itemsToInsert - The item(s) to insert. Can be zero or more arguments.
     * @returns {Array<any>} The modified original array.
     * @throws {TypeError} If the first argument is not an array.
     * @throws {TypeError} If the index is not an integer.
     */
    function insertAfterIndex(array, index, ...itemsToInsert) {
        if (itemsToInsert.length === 0) {
            return array;
        }
        const targetInsertionIndex = Math.max(0, Math.min(index + 1, array.length));
        array.splice(targetInsertionIndex, 0, ...itemsToInsert);
        return array;
    }

    /**
     * Fetches media from a URL and returns its Blob and MIME type.
     * This is the core logic used by other helper functions. It handles cross-origin
     * requests using GM_xmlhttpRequest and also supports data URIs.
     *
     * Requires @grant GM_xmlhttpRequest and appropriate @connect directives.
     *
     * @param {string} mediaUrl The URL of the media to fetch (can be http/https or data: URI).
     * @returns {Promise<{ blob: Blob, type: string | null }>} A Promise that resolves with an
     *          object containing the Blob and the detected Content-Type string.
     */
    function fetchMediaDetails(mediaUrl) {
        return new Promise((resolve, reject) => {
            // Handle data URIs directly without a network request
            if (mediaUrl.startsWith('data:')) {
                try {
                    const byteString = atob(mediaUrl.split(',')[1]);
                    const mimeString = mediaUrl.split(',')[0].split(':')[1].split(';')[0];
                    const ab = new ArrayBuffer(byteString.length);
                    const ia = new Uint8Array(ab);
                    for (let i = 0; i < byteString.length; i++) {
                        ia[i] = byteString.charCodeAt(i);
                    }
                    const blob = new Blob([ab], { type: mimeString });
                    resolve({ blob: blob, type: mimeString });
                } catch (e) {
                    reject(new Error(`Error parsing data URI: ${e.message}`));
                }
                return;
            }

            // Use GM_xmlhttpRequest for network URLs
            GM_xmlhttpRequest({
                method: "GET",
                url: mediaUrl,
                responseType: "blob",
                onload: function (response) {
                    if (response.status >= 200 && response.status < 300) {
                        const mediaBlob = response.response;
                        if (!mediaBlob || mediaBlob.size === 0) {
                            reject(new Error(`Received empty blob for ${mediaUrl}`));
                            return;
                        }

                        // Extract Content-Type from headers for accuracy
                        let contentType = null;
                        if (response.responseHeaders) {
                            const match = response.responseHeaders.match(/^content-type:\s*(.*)$/im);
                            if (match && match[1]) {
                                contentType = match[1].trim().split(';')[0];
                            }
                        }
                        // Resolve with the blob and the detected type
                        resolve({ blob: mediaBlob, type: contentType || mediaBlob.type });
                    } else {
                        reject(new Error(`Failed to fetch ${mediaUrl}: Server responded with status ${response.status}`));
                    }
                },
                onerror: function (response) {
                    reject(new Error(`Network error fetching ${mediaUrl}: ${response.error || 'Unknown error'}`));
                },
            });
        });
    }

    /**
     * Fetches the Content-Type header for a potentially cross-origin URL
     * using GM_xmlhttpRequest with a HEAD request, without downloading the full file.
     *
     * Requires @grant GM_xmlhttpRequest and appropriate @connect directives.
     *
     * @param {string} mediaUrl The URL to check.
     * @returns {Promise<string | null>} A Promise that resolves with the primary Content-Type
     *          string (e.g., 'image/jpeg', 'video/mp4', 'text/html') or null if the
     *          header is missing, couldn't be parsed, or the request failed.
     *          Rejects with an Error object on network/request errors.
     */
    function getMediaContentType(mediaUrl) {
        return new Promise((resolve, reject) => {
            console.log(`Initiating GM HEAD request for type: ${mediaUrl}`);

            GM_xmlhttpRequest({
                method: "HEAD", // Use HEAD request!
                url: mediaUrl,
                // responseType: "blob", // Not needed for HEAD, we only care about headers
                headers: {
                    // You might include standard headers if needed, but often not necessary for HEAD
                    // 'Accept': '*/*'
                },
                onload: function (response) {
                    // Even errors (like 404) might have headers, but we usually only care about success
                    if (response.status >= 200 && response.status < 300) {
                        let contentType = null;
                        if (response.responseHeaders) {
                            // Match 'content-type:' case-insensitive, trim whitespace
                            const match = response.responseHeaders.match(/^content-type:\s*(.*)$/im);
                            if (match && match[1]) {
                                // Get primary type (e.g., 'image/jpeg') before any params like charset
                                contentType = match[1].trim().split(';')[0].trim();
                                console.log(`Detected Content-Type for ${mediaUrl}: ${contentType} (from full header: ${match[1].trim()})`);
                                resolve(contentType); // Resolve with the found type
                            } else {
                                console.warn(`Could not find Content-Type header for ${mediaUrl}. Status: ${response.status}. Headers:\n${response.responseHeaders}`);
                                resolve(null); // Successfully got headers, but Content-Type is missing
                            }
                        } else {
                            console.warn(`No responseHeaders found for ${mediaUrl}, Status: ${response.status}.`);
                            resolve(null); // Successfully completed request, but no headers (unlikely for 2xx)
                        }
                    } else {
                        // Handle non-2xx responses (404, 500, etc.)
                        // You might still want to check headers even on error in some cases,
                        // but generally, a non-2xx means the resource isn't available as expected.
                        console.warn(`GM_xmlhttpRequest (HEAD) non-2xx status for ${mediaUrl}: Status ${response.status} ${response.statusText}`);
                        // Decide if a non-2xx should reject or resolve with null
                        // Rejecting might be better to indicate failure accessing the resource.
                        reject(new Error(`Failed to get headers for ${mediaUrl}: Server responded with status ${response.status} ${response.statusText}`));
                    }
                },
                onerror: function (response) {
                    console.error(`GM_xmlhttpRequest (HEAD) network error for ${mediaUrl}:`, response.error);
                    reject(new Error(`Network error checking type for ${mediaUrl}: ${response.error || 'Unknown error'}`));
                },
                ontimeout: function () {
                    console.error(`GM_xmlhttpRequest (HEAD) timed out for ${mediaUrl}`);
                    reject(new Error(`Timeout checking type for ${mediaUrl}`));
                },
                onabort: function () {
                    console.warn(`GM_xmlhttpRequest (HEAD) aborted for ${mediaUrl}`);
                    reject(new Error(`Request aborted checking type for ${mediaUrl}`));
                }
            });
        });
    }

    /**
     * Fetches media (image/video) from a URL and returns a temporary blob: URL.
     * This function is a wrapper around fetchMediaDetails.
     *
     * IMPORTANT: The caller is responsible for calling URL.revokeObjectURL() on the
     * returned blob URL when it's no longer needed to prevent memory leaks.
     *
     * @param {string} mediaUrl The URL of the media to fetch.
     * @returns {Promise<{ blobUrl: string, type: string | null }>} A Promise that resolves with an
     *          object containing the blobUrl and the Content-Type string.
     */
    async function fetchMediaBlobUrl(mediaUrl) {
        try {
            const { blob, type } = await fetchMediaDetails(mediaUrl);
            const blobUrl = URL.createObjectURL(blob);
            return { blobUrl: blobUrl, type: type };
        } catch (error) {
            // Re-throw the error to be handled by the caller
            console.error(`Error in fetchMediaBlobUrl for ${mediaUrl}:`, error);
            throw error;
        }
    }

    /**
     * Converts an image Blob of any type (jpeg, gif, etc.) into a PNG Blob.
     * This is necessary because browsers often only support writing 'image/png' to the clipboard.
     *
     * @param {Blob} imageBlob The source image blob to convert.
     * @returns {Promise<Blob>} A Promise that resolves with a new Blob in PNG format.
     */
    function convertToPngBlob(imageBlob) {
        return new Promise((resolve, reject) => {
            // Create a temporary URL for the source image blob
            const imageUrl = URL.createObjectURL(imageBlob);

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const image = new Image();

            // This is our success handler
            image.onload = () => {
                // Set canvas dimensions to match the fully loaded image
                canvas.width = image.width;
                canvas.height = image.height;

                // Draw the image onto the canvas
                ctx.drawImage(image, 0, 0);

                // The toBlob call is asynchronous. We resolve the promise in its callback.
                canvas.toBlob((pngBlob) => {
                    // Clean up the temporary URL now that we're done with it
                    URL.revokeObjectURL(imageUrl);
                    resolve(pngBlob);
                }, 'image/png');
            };

            // This is our error handler
            image.onerror = () => {
                // Clean up the temporary URL on failure as well
                URL.revokeObjectURL(imageUrl);
                reject(new Error('Failed to load image for PNG conversion.'));
            };

            // Start loading the image
            image.src = imageUrl;
        });
    }

    function createGoToPageInput() {
        const input = document.createElement('input');
        input.type = 'text';
        input.id = 'GoToPageInput';
        input.inputMode = 'numeric';
        input.pattern = '[0-9]*';
        input.placeholder = `Go to page 1-${thumbs.length}...`;
        Object.assign(input.style, {
            position: 'fixed',
            bottom: '80px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '8px 16px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            zIndex: '99999',
            fontSize: '16px',
            outline: 'none',
            display: 'none',
            WebkitAppearance: 'none',
            MozAppearance: 'textfield'
        });

        // Remove spinner buttons
        input.style.WebkitAppearance = 'none';
        input.style.MozAppearance = 'textfield';

        const handleClose = () => {
            input.style.display = 'none';
            input.value = '';
            // Only remove the document-level click listener
            document.removeEventListener('click', handleClickOutside);
        };

        const handleInputKeydown = (e) => {
            // Allow browser shortcuts with modifiers (Ctrl+C, Ctrl+R, etc.)
            if (e.ctrlKey || e.altKey || e.metaKey) {
                return;
            }

            // *** Crucial: Stop the event from bubbling up to the document keydown listener ***
            // This prevents keys like Backspace from triggering document-level actions (like showing grid view)
            // when the input is focused.
            e.stopPropagation();

            if (e.key === 'g' || e.key === 'G') {
                handleClose();
                return;
            }

            if (e.key === 'Enter') {
                e.preventDefault(); // Prevent form submission if it were in a form
                const pageNumStr = input.value;
                // Allow negative numbers for parsing, use regex for validation
                if (/^-?\d+$/.test(pageNumStr)) {
                    const pageNum = parseInt(pageNumStr, 10);
                    // Convert page number (1-based, potentially negative) to 0-based index
                    let targetIndex = (pageNum >= 1) ? pageNum - 1 : thumbs.length + pageNum; // Negative wraps from end (-1 goes to last image)

                    if (targetIndex >= 0 && targetIndex < thumbs.length) {
                        goToPageAnywhere(targetIndex);
                    } else {
                        // Provide more specific feedback if the index is out of range
                        alert(`Invalid input: Effective index ${targetIndex} is out of range [0, ${thumbs.length - 1}]`);
                    }
                } else {
                    alert("Invalid input: Please enter an integer.");
                }
                handleClose();
            } else if (e.key === 'Escape') {
                handleClose();
                // Allow '-' only as the first character. Allow all digits. Prevent other single characters.
            } else if (e.key.length === 1 && !/\d/.test(e.key) && !(e.key === '-' && input.value.length === 0)) {
                // Prevent single non-numeric characters from being entered into the input
                e.preventDefault();
                // Do not return here. Let the event bubble up if necessary,
                // although preventDefault might stop other handlers.
                // The main goal is browser shortcuts are already allowed by the modifier check above.
            }
            // Allow numbers, Backspace, Delete, Arrow Keys, etc. by default
        };

        // Add click outside handler
        const handleClickOutside = (e) => {
            if (!input.contains(e.target)) {
                handleClose();
                e.preventDefault();
            }
        };

        // Attach keydown listener directly to the input and keep it
        // This listener doesn't need to be removed and re-added.
        input.addEventListener('keydown', handleInputKeydown);

        // Store the handler reference on the element for easy access later
        input.__handleClickOutside = handleClickOutside;
        input.__handleClose = handleClose;

        document.body.appendChild(input);
        return input;
    }

    let goToPageInput = null;
    function showGotoPageInput() {
        if (!goToPageInput || goToPageInput.style.display === "none") {
            if (!goToPageInput) {
                goToPageInput = createGoToPageInput();
            }
            goToPageInput.style.display = 'block';
            goToPageInput.focus();
            // Add the click-outside listener when the input is shown
            setTimeout(() => {
                document.addEventListener('click', goToPageInput.__handleClickOutside);
            }, 100);

        } else {
            goToPageInput.__handleClose();
        }
    }

    function gotoPageInputIsVisible() {
        return !!goToPageInput && goToPageInput.style.display !== "none";
    }
    // ----------------------------------------------------------------------------------------------
    // fetching.js
    // ----------------------------------------------------------------------------------------------

    async function fetchGalleryPage(pageIndex) {
        if (pageIndex < 0 || pageIndex >= totalPages)
            return null;
        const url = new URL(window.location.href);
        url.searchParams.set("p", pageIndex);
        console.log(`Fetching page: ${url.href}`);
        const doc = await fetchDocument(url.href);
        return doc ? extractThumbnailLinks(doc, pageIndex) : [];
    }

    function populateThumbsOnPage(pageIndex, newThumbs) {
        if (!newThumbs || newThumbs.length === 0) {
            console.warn("populateThumbsOnPage received null or empty thumb array, returning.");
            return;
        }
        let start = pageIndex * PAGINATION;
        for (let i = 0; i < newThumbs.length; i++) {
            thumbs[start + i] = newThumbs[i];
        }
    }

    function getPageIndexByImageIndex(imageIndex) {
        return Math.floor(imageIndex / PAGINATION);
    }

    const pageLocks = {};
    async function fetchAndPopulateThumbsOnPage(pageIndex) {
        if (pageLocks[pageIndex]) {
            return pageLocks[pageIndex];
        }

        const lockPromise = (async () => {
            const start = pageIndex * PAGINATION;
            const end = Math.min(start + PAGINATION, thumbs.length);
            let needFetch = false;

            for (let i = start; i < end; i++) {
                if (!thumbs[i]) {
                    needFetch = true;
                    break;
                }
            }
            if (!needFetch) {
                return null;
            }

            const newThumbs = await fetchGalleryPage(pageIndex);
            if (!newThumbs || newThumbs.length === 0) {
                return newThumbs;
            }

            populateThumbsOnPage(pageIndex, newThumbs);
            return newThumbs;
        })();

        pageLocks[pageIndex] = lockPromise;

        try {
            return await lockPromise;
        } finally {
            delete pageLocks[pageIndex];
        }
    }

    function preloadRange(start, end, reverse = false, useOriginalImages = false, maxWorkers = 5) {
        if (start < 0) start = 0;
        if (end >= thumbs.length) end = thumbs.length - 1;

        const indices = [];
        if (reverse) {
            for (let i = end; i >= start; i--) {
                indices.push(i);
            }
        } else {
            for (let i = start; i <= end; i++) {
                indices.push(i);
            }
        }
        return preloadIndices(indices, useOriginalImages, maxWorkers);
    }

    async function preloadIndices(indicesToPreload, useOriginalImages = false, maxWorkers = 5) {
        console.log(`Preloading indices: [${indicesToPreload.join(', ')}] with maxWorkers=${maxWorkers}`);

        const mediaLoadPool = new PromisePool(maxWorkers); // Renamed for clarity

        for (const index of indicesToPreload) {
            if (index < 0 || index >= thumbs.length) {
                console.log(`Preload: Index ${index} is out of bounds [0, ${thumbs.length - 1}]. Skipping.`);
                continue;
            }

            // --- Sequential Part: Load Media Metadata/URL ---
            let item;
            try {
                // Ensure the item data (including URL and isVideo flag) is available
                await loadImageUrlAtIndex(index); // Fetches metadata/URL if not already present
                item = thumbs[index]; // Get the potentially updated item
            } catch (error) {
                console.error(`Preload: Error fetching metadata/URL for index ${index}:`, error);
                continue; // Skip this index if metadata loading fails
            }
            // --- End Sequential Part ---

            // Check if item is valid and determine media type
            if (!item || item === 'deleted') {
                console.log(`Preload: Item at index ${index} is invalid or deleted. Skipping.`);
                continue;
            }

            const isVideo = item.isVideo === true;

            if (isVideo) {
                // For videos, preload metadata
                // Hint to the browser to fetch metadata by creating a temporary video element.
                const videoUrl = item.fullImageUrl;
                if (videoUrl) {
                    const tempVideo = document.createElement('video');
                    tempVideo.referrerPolicy = "no-referrer";
                    tempVideo.preload = 'metadata';
                    tempVideo.src = videoUrl;
                    // Don't append to DOM, don't wait. Just setting src triggers the browser based on 'preload'.
                    console.log(`Preload: Index ${index} is a video. Hinting browser to preload metadata for ${videoUrl}`);
                } else {
                    console.log(`Preload: Index ${index} is a video, but no URL found.`);
                }
                // No need to add to the pool, the browser handles this asynchronously.
            } else {
                // --- Handle Image Preloading ---
                let imageUrl = null;
                // Determine the correct image URL based on configuration
                if (item.originalImageUrl && (useOriginalImages || item.originalImageIsCached)) {
                    imageUrl = item.originalImageUrl;
                } else {
                    imageUrl = item.fullImageUrl;
                }

                if (imageUrl) {
                    // --- Concurrent Part: Submit Image Data Load Task to Pool ---
                    // Define the *task function* that the pool will execute later
                    const imageLoadTaskFactory = async () => {
                        // console.log(`Preload Pool: Starting image data load for index ${index} (URL: ${imageUrl})`);
                        const imgElement = new Image();
                        imgElement.referrerPolicy = "no-referrer";
                        imgElement.src = imageUrl; // Start loading
                        try {
                            await waitForMediaLoad(imgElement);
                            // console.log(`Preload Pool: Successfully loaded image data for index ${index}`);
                        } catch (err) {
                            // Handle/log errors for *individual* image loads within the task
                            console.error(`Preload Pool: Error loading image data for index ${index} (URL: ${imageUrl}):`, err);
                            // Do not re-throw here if you want other preloads to continue even if one fails
                        }
                    };

                    // Submit the task factory to the pool.
                    mediaLoadPool.run(imageLoadTaskFactory);
                } else {
                    console.log(`Preload: No valid image URL found for index ${index} after metadata load. Skipping image data load.`);
                }
            }
        }

        // After iterating through all indices and submitting tasks,
        // wait for all tasks managed by the pool (now only image loads) to complete.
        // console.log(`Preload: All indices processed. Waiting for ${mediaLoadPool.activePromises.size} active + ${mediaLoadPool.queuedTasks.length} queued image loads to complete...`);
        await mediaLoadPool.waitAll();

        // console.log("Preload: All requested indices processed and all image loading tasks finished.");
    }


    const indexLocks = {};
    async function loadImageUrlAtIndex(index, signal = null) { // Accept signal
        if (indexLocks[index]) {
            return indexLocks[index];
        }

        const lockPromise = _loadImageUrlAtIndexInternal(index, signal); // Pass signal
        indexLocks[index] = lockPromise;

        try {
            return await lockPromise;
        } finally {
            delete indexLocks[index];
        }
    }

    async function _loadImageUrlAtIndexInternal(index, signal = null) { // Accept signal
        console.log(`Loading image URL at index ${index}`);

        // 1. Check if the requested index is valid within the total possible range.
        if (index < 0 || index >= thumbs.length) {
            console.log(`Image index ${index} is out of range [0, ${thumbs.length - 1}]`);
            return;
        }

        // 2. Check if the data for this index needs to be fetched.
        if (thumbs[index] === null) {
            const pageIndex = Math.floor(index / PAGINATION);
            console.log(`Data for index ${index} is null. Fetching page ${pageIndex}.`);

            // Ensure the calculated page index is valid (should be due to initial bounds check, but good safety)
            if (pageIndex < 0 || pageIndex >= totalPages) {
                console.error(`Calculated invalid page index ${pageIndex} for image index ${index}.`);
                return; // Should not happen if thumbs.length is correct
            }

            // Fetch the page and let fetchAndPopulateThumbsOnPage update the global thumbs array.
            const newThumbs = await fetchAndPopulateThumbsOnPage(pageIndex);

            // Check if fetching was successful and if the specific index was populated.
            if (!newThumbs || newThumbs.length === 0) {
                console.error(`Failed to fetch or populate page ${pageIndex} containing index ${index}.`);
                // Decide how to handle: retry? show error? For now, just return.
                return;
            }
            // Verify that the specific index we need is now populated
            if (thumbs[index] === null) {
                console.error(`Index ${index} remains null after fetching page ${pageIndex}. Population failed.`);
                return;
            }
        }

        // 3. Check if the item at the index is marked as deleted.
        //    (Using 'deleted' string as per original code example)
        if (thumbs[index] === 'deleted') {
            console.log(`Image at index ${index} is marked as deleted.`);
            return;
        }

        // 4. We should now have valid thumb data at thumbs[index].
        const currentThumb = thumbs[index]; // Use a local variable for clarity

        // 5. Check if the full image URL is already cached for this thumb.
        if (currentThumb.fullImageUrl) {
            console.log(`Image URL(s) for index ${index} already cached.`);
            // Even if fullImageUrl exists, we might still need originalImageUrl
            if (!currentThumb.originalImageUrl) {
                // Continue to fetch potentially missing original URL
            } else {
                return; // Both URLs likely present or handled
            }
        }

        // Ensure the thumb object and required properties exist
        if (!currentThumb || !currentThumb.link || !currentThumb.link.href) {
            // A missing link href is only a warning when the current image has no full url.
            // (Might have been added via some other way that doesn't set link.href, e.g. via paste command)
            if (!currentThumb.fullImageUrl && !currentThumb.originalImageUrl) {
                console.warn(`Thumb data at index ${index} is invalid or missing link.href.`, currentThumb);
            }
            return;
        }
        const thumbHref = currentThumb.link.href;

        // 6. Full image URL is not cached, fetch it.
        // console.log(`Fetching full image URL for index ${index}`);
        let fullUrl = null;
        let originalUrl = null;
        try {
            [fullUrl, originalUrl] = await extractImageUrls(thumbHref, signal); // Pass signal
        } catch (error) {
            // Check if the error is due to the operation being aborted
            if (error.name === 'AbortError') {
                console.log(`Fetch aborted for image URL at index ${index} (${thumbHref})`);
            } else {
                console.error(`Error fetching image URL for index ${index} (${thumbHref}):`, error);
            }
            return;
        }


        // 7. Process the fetched URL.
        // Check if the item still exists at the index before assigning
        // (it might have been marked 'deleted' concurrently)
        if (thumbs[index] && thumbs[index] !== 'deleted') {
            if (thumbs[index] && thumbs[index] !== 'deleted') {
                thumbs[index].fullImageUrl = fullUrl;
                // If originalUrl wasn't found via separate link, assume fullUrl is the original
                if (!originalUrl && fullUrl) {
                    thumbs[index].originalImageUrl = fullUrl;
                } else if (originalUrl) {
                    thumbs[index].originalImageUrl = originalUrl;
                }
            }
        } else {
            console.error(`Could not extract any image URL for index ${index} from ${thumbHref}.`);
            // Optional: Mark as failed?
            // if (thumbs[index] && thumbs[index] !== 'deleted') {
            //    thumbs[index].loadError = true;
            // }
        }
    }

    /**
     * Returns a Promise that resolves when the media element has loaded sufficiently
     * (image fully loaded, video metadata loaded for dimensions), or rejects on error/timeout.
     * Handles cases where the media might already be ready.
     *
     * @param {HTMLImageElement | HTMLVideoElement} element The media element to monitor.
     * @param {number | null} [timeout=null] Optional timeout in milliseconds.
     * @returns {Promise<void>} A Promise that resolves on success, rejects on error/timeout.
     */
    async function waitForMediaLoad(element, timeout = null) {
        if (element instanceof HTMLImageElement) {
            // --- Initial Synchronous Checks ---
            if (element.complete && element.naturalWidth > 0) {
                return Promise.resolve();
            }
            if (!element.src || element.src === window.location.href) {
                // console.warn("Image src invalid or missing, resolving early:", element.src);
                return Promise.resolve();
            }

            // --- Asynchronous Waiting ---
            return new Promise((resolve, reject) => {
                const currentSrc = element.src;
                let timeoutId = null;

                const cleanup = () => {
                    element.removeEventListener('load', loadHandler);
                    element.removeEventListener('error', errorHandler);
                    if (timeoutId) clearTimeout(timeoutId);
                };

                const loadHandler = () => {
                    cleanup();

                    // Check if the modern .decode() method is available.
                    if (typeof element.decode === 'function') {
                        element.decode()
                            .then(() => {
                                resolve();
                            })
                            .catch(err => {
                                console.error("Image failed to decode:", currentSrc, err);
                                reject(new Error(`Failed to decode image: ${currentSrc}`));
                            });
                    } else {
                        resolve();
                    }
                };
                const errorHandler = (event) => {
                    console.error("Image failed to load:", currentSrc, event);
                    cleanup();
                    reject(new Error(`Failed to load image: ${currentSrc}`));
                };

                element.addEventListener('load', loadHandler);
                element.addEventListener('error', errorHandler);

                if (typeof timeout === 'number' && timeout > 0) {
                    timeoutId = setTimeout(() => {
                        cleanup();
                        reject(new Error(`Image load timed out after ${timeout}ms: ${currentSrc}`));
                    }, timeout);
                }

                if (element.complete && element.naturalWidth > 0) {
                    cleanup();
                    resolve();
                }
            });

        } else if (element instanceof HTMLVideoElement) {
            // --- Implement video logic (wait for metadata) ---

            // --- Initial Synchronous Checks ---
            // video.readyState >= 1 means metadata (including dimensions) is loaded.
            if (element.readyState >= 1) {
                // console.log("Video metadata already available:", element.src);
                return Promise.resolve(); // Already ready
            }

            if (!element.src || element.src === window.location.href) {
                // console.warn("Video src invalid or missing, resolving early:", element.src);
                // Resolve like the image case; allows Promise.all to proceed.
                return Promise.resolve();
            }

            // --- Asynchronous Waiting ---
            return new Promise((resolve, reject) => {
                const currentSrc = element.src;
                let timeoutId = null;

                // Define cleanup logic
                const cleanup = () => {
                    // console.log("Cleaning up video listeners/timeout for:", currentSrc);
                    element.removeEventListener('loadedmetadata', metadataHandler);
                    element.removeEventListener('error', errorHandler);
                    // Videos can also emit 'stalled' or 'suspend' which might be relevant
                    // but 'error' usually covers critical load failures.
                    if (timeoutId) {
                        clearTimeout(timeoutId);
                        timeoutId = null;
                    }
                };

                // Define event handlers
                const metadataHandler = () => {
                    // console.log("Video metadata loaded:", currentSrc);
                    cleanup();
                    resolve(); // Signal success (metadata ready)
                };

                const errorHandler = (event) => {
                    // The event itself might contain a MediaError object with more details
                    const error = element.error;
                    console.error("Video failed to load:", currentSrc, error ? `Code: ${error.code}, Message: ${error.message}` : 'Unknown error', event);
                    cleanup();
                    reject(new Error(`Failed to load video metadata: ${currentSrc}${error ? ` (${error.message})` : ''}`));
                };

                // Attach event listeners
                element.addEventListener('loadedmetadata', metadataHandler);
                element.addEventListener('error', errorHandler);

                // Set up timeout if specified
                if (typeof timeout === 'number' && timeout > 0) {
                    timeoutId = setTimeout(() => {
                        // console.warn(`Video metadata load timed out (${timeout}ms):`, currentSrc);
                        cleanup();
                        reject(new Error(`Video metadata load timed out after ${timeout}ms: ${currentSrc}`));
                    }, timeout);
                }

                // Double-check readyState *after* adding listeners.
                // This catches cases where metadata loaded synchronously between the initial
                // check and listener attachment.
                if (element.readyState >= 1) {
                    // console.log("Video became ready just after listeners were added:", currentSrc);
                    cleanup();
                    resolve();
                }
                // Note: If the video 'src' was set *before* this function was called,
                // and loading is in progress but not yet complete, the attached
                // listeners will catch the eventual 'loadedmetadata' or 'error' event.
                // Browsers might start loading metadata as soon as 'preload="metadata"' and 'src' are set.
            });

        } else {
            // Handle unsupported element types
            console.error("Unsupported element type for waitForMediaLoad:", element);
            return Promise.reject(new Error('Unsupported element type for waitForMediaLoad'));
        }
    }
    // ----------------------------------------------------------------------------------------------
    // providers.js
    // ----------------------------------------------------------------------------------------------

    /**
     * Abstract base class defining the interface for data access in GridView.
     */
    class GridDataProvider {
        constructor() {
            if (this.constructor === GridDataProvider) {
                throw new Error("Abstract classes can't be instantiated.");
            }
        }

        /**
         * Total number of items in this view.
         * @returns {number}
         */
        get length() {
            throw new Error("Method 'length' must be implemented.");
        }

        /**
         * Returns the data object for the view index.
         * @param {number} index - View index.
         * @returns {object|null} - The item data (thumb object) or null if not loaded.
         */
        getItem(index) {
            throw new Error("Method 'getItem' must be implemented.");
        }

        /**
         * Resolves the view index to the global gallery index.
         * Used for actions that require the global context (e.g. opening the viewer).
         * @param {number} index - View index.
         * @returns {number} - Global gallery index.
         */
        resolveIndex(index) {
            throw new Error("Method 'resolveIndex' must be implemented.");
        }

        /**
         * Checks if the item at the view index is marked as deleted.
         * @param {number} index - View index.
         * @returns {boolean}
         */
        isDeleted(index) {
            throw new Error("Method 'isDeleted' must be implemented.");
        }

        /**
         * Fetches thumbnail data for the given index.
         * @param {number} index - View index.
         * @returns {Promise}
         */
        async fetchThumbnail(index) {
            throw new Error("Method 'fetchThumbnail' must be implemented.");
        }

        /**
         * Fetches full image data for the given index.
         * @param {number} index - View index.
         * @returns {Promise}
         */
        async fetchFullImage(index) {
            throw new Error("Method 'fetchFullImage' must be implemented.");
        }

        /**
         * Returns display metadata for the item.
         * @param {number} index - View index.
         * @returns {object} { title: string|null, label: string|null, isCurrent: boolean }
         */
        getMetadata(index) {
            return { title: null, label: null, isCurrent: false };
        }

        get hasMetadata() {
            return false;
        }
    }

    /**
     * Implementation for the standard gallery view (all items).
     * Wraps the global 'thumbs' array and global fetch functions.
     */
    class GlobalGalleryProvider extends GridDataProvider {
        get length() {
            return thumbs.length;
        }

        getItem(index) {
            return thumbs[index];
        }

        resolveIndex(index) {
            return index;
        }

        isDeleted(index) {
            return thumbs[index] === 'deleted';
        }

        async fetchThumbnail(index) {
            const pageIndex = getPageIndexByImageIndex(index);
            if (pageIndex === null) return Promise.resolve();
            // fetchAndPopulateThumbsOnPage handles deduping via pageLocks
            return fetchAndPopulateThumbsOnPage(pageIndex);
        }

        async fetchFullImage(index) {
            // loadImageUrlAtIndex handles deduping via indexLocks
            return loadImageUrlAtIndex(index);
        }

        getMetadata(index) {
            return {
                title: null,
                label: (index + 1).toString(),
                isCurrent: false
            };
        }

        get hasMetadata() {
            return false;
        }
    }

    /**
     * Implementation for a subset of items (e.g., Chapter Sidebar).
     * Maps view indices to specific global indices.
     */
    class ChapterSubsetProvider extends GridDataProvider {
        constructor(chapterList) {
            super();
            this.chapterList = chapterList || [];
            // Create a mapping of View Index -> Global Index
            this.indices = this.chapterList.map(c => c.index);
            this._currentGlobalIndex = -1;
        }

        set currentGlobalIndex(index) {
            this._currentGlobalIndex = index;
        }

        get length() {
            return this.indices.length;
        }

        getItem(index) {
            if (index < 0 || index >= this.indices.length) return null;
            const globalIndex = this.indices[index];
            return thumbs[globalIndex];
        }

        resolveIndex(index) {
            if (index < 0 || index >= this.indices.length) return -1;
            return this.indices[index];
        }

        isDeleted(index) {
            if (index < 0 || index >= this.indices.length) return false;
            const globalIndex = this.indices[index];
            return thumbs[globalIndex] === 'deleted';
        }

        async fetchThumbnail(index) {
            if (index < 0 || index >= this.indices.length) return Promise.resolve();
            const globalIndex = this.indices[index];
            const pageIndex = getPageIndexByImageIndex(globalIndex);
            if (pageIndex === null) return Promise.resolve();
            return fetchAndPopulateThumbsOnPage(pageIndex);
        }

        async fetchFullImage(index) {
            if (index < 0 || index >= this.indices.length) return Promise.resolve();
            const globalIndex = this.indices[index];
            return loadImageUrlAtIndex(globalIndex);
        }

        getMetadata(index) {
            if (index < 0 || index >= this.indices.length) return { captionElement: null, isCurrent: false };

            const chapter = this.chapterList[index];
            const meta = formatChapterMetadata(chapter);

            // --- Is Current Logic ---
            let isCurrent = false;
            if (this._currentGlobalIndex !== -1) {
                const myStart = this.indices[index];
                const nextStart = (index + 1 < this.indices.length) ? this.indices[index + 1] : Infinity;
                if (this._currentGlobalIndex >= myStart && this._currentGlobalIndex < nextStart) {
                    isCurrent = true;
                }
            }

            // --- Construct HTML Element ---
            const captionContainer = document.createElement('div');
            captionContainer.className = 'provider-caption-root'; // Helper class for replacement
            captionContainer.style.marginTop = '6px';
            captionContainer.style.display = 'flex';
            captionContainer.style.flexDirection = 'column';
            captionContainer.style.gap = '2px';

            // Styles
            const highlightColor = 'rgba(0, 255, 208, 1)';
            const titleColor = isCurrent ? highlightColor : '#ddd';
            const labelColor = isCurrent ? highlightColor : '#aaa';
            const authorColor = isCurrent ? 'rgba(0, 255, 208, 0.8)' : '#888';
            // const fontWeight = isCurrent ? 'bold' : 'normal';

            // Top Row: Title (Left) -- Page Label (Right)
            const topRow = document.createElement('div');
            topRow.style.display = 'flex';
            topRow.style.justifyContent = 'space-between';
            topRow.style.alignItems = 'flex-start';
            topRow.style.gap = '8px';
            topRow.style.fontSize = '14px';
            topRow.style.lineHeight = '1.3';

            const titleSpan = document.createElement('span');
            titleSpan.textContent = meta.title || "Untitled";
            titleSpan.style.wordBreak = 'break-word';
            titleSpan.style.color = titleColor;
            titleSpan.style.fontWeight = 'bold';

            const labelSpan = document.createElement('span');
            labelSpan.textContent = `P. ${meta.pageLabel}`;
            labelSpan.style.whiteSpace = 'nowrap';
            labelSpan.style.color = labelColor;
            labelSpan.style.minWidth = 'fit-content';

            topRow.appendChild(titleSpan);
            topRow.appendChild(labelSpan);
            captionContainer.appendChild(topRow);

            // Bottom Row: Author (Right Aligned)
            if (meta.author) {
                const authorDiv = document.createElement('div');
                authorDiv.textContent = meta.author;
                authorDiv.style.textAlign = 'right';
                authorDiv.style.fontSize = '12px';
                authorDiv.style.color = authorColor;
                authorDiv.style.fontStyle = 'italic';
                captionContainer.appendChild(authorDiv);
            }

            return {
                captionElement: captionContainer,
                isCurrent: isCurrent
            };
        }

        get hasMetadata() {
            return true;
        }
    }// ----------------------------------------------------------------------------------------------
    // imageViewer.js
    // ----------------------------------------------------------------------------------------------

    class ImageViewer {
        parent = null;
        buttonContainer = null;

        // Toolbar buttons
        helpButton = null;
        chaptersButton = null;
        settingsButton = null;
        exitButton = null;
        prevButton = null;
        nextButton = null;
        rotateLeftButton = null;
        rotateRightButton = null;
        zoomInButton = null;
        zoomOutButton = null;
        galleryViewButton = null;
        dualPageButton = null;
        fullscreenButton = null;
        downloadButton = null;
        findGalleriesButton = null;
        gotoPageButton = null;

        imgContainer = null;
        imgDisplay = null;
        imgDisplay2 = null;
        isNavigating = false;
        sidebarVisible = false;
        useFullscreen = false;
        hasEnteredFullscreenOnce = false;
        sidebarHiddenTransform = null;
        sidebar = null; // GridView instance
        gridView = null; // GridView instance
        onExit = null; // Function accepting bool exitToPage
        pinSidebar = false;
        backwardNavigationCount = 0;
        currentRotation = 0;
        currentIndex = 0;
        currentAbortController = null; // Controller for the latest load operation
        currentLoadToken = null; // Add this to track the latest load request
        fitMode = "fit-window";
        currentZoom = 1;
        userChangedZoom = false;
        config;

        UI_TRANSPARENCY = 0.6;

        constructor(config, onExit = null) {
            this.config = config;
            this.onExit = onExit;

            this.fitMode = config.fitMode;
            this.pinSidebar = config.pinSidebar;
            this.useFullscreen = config.useFullscreen;
            this.rightToLeftMode = config.openInRightToLeftMode;
            this.dualPageMode = config.openInDualPageMode;
            this.dualLayout = config.dualLayout;
            this.autoplayEnabled = config.videoConfig.autoplay;
            this.loopEnabled = config.videoConfig.loop;

            this.blobCache = new Map(); // Stores { blob, size, type, lastAccessed }
            this.pendingFetches = new Map(); // Stores Promises for ongoing fetches
            this.currentCacheSize = 0; // In bytes
            this.cacheLimitMB = 50;

            this._createImageViewer();
            this._initializeEventListeners();

            this.inputHandler = new ViewerInputHandler(this, this.config);

            this._initializeHelpOverlay();

            this._initializeSidebar();

            this.parent.appendChild(this.gridParent);
            this.gridView = new GridView(new GlobalGalleryProvider(), this.gridParent, config.gridViewConfig, false);
        }

        isActive() {
            return this.parent.style.display === "block";
        }

        /**
         * Checks if a video element is currently being displayed in the specified slot.
         * @param {'primary' | 'secondary' | null} [position=null] - The display slot to check ('left' for primary, 'right' for secondary).
         *                          If null, checks if *any* video is displayed.
         * @returns {boolean} True if a video is displayed in the specified slot(s), false otherwise.
         */
        isShowingVideo(position = null) {
            const isPrimaryVideoShowing = this.videoDisplay.style.display === 'block';
            const isSecondaryVideoShowing = this.dualPageMode && this.videoDisplay2.style.display === 'block';

            if (position === 'primary') {
                return isPrimaryVideoShowing;
            } else if (position === 'secondary') {
                return isSecondaryVideoShowing;
            } else if (position === null) {
                return isPrimaryVideoShowing || isSecondaryVideoShowing;
            } else {
                console.warn(`isShowingVideo called with invalid position: ${position}`);
                return false; // Invalid position provided
            }
        }

        /**
          * Toggles the playback state (play/pause) of the specified video display(s).
          * If targetDisplay is null (default), toggles both visible videos, ensuring the secondary
          * video's state matches the primary video's resulting state.
          *
          * @param {'primary' | 'secondary' | null} [targetDisplay=null] - Which video display to toggle.
          *                      'primary', 'secondary', or null (default) for both.
          */
        toggleVideoPlayback(targetDisplay = null) { // Default set to null here
            const primaryVisible = this.isShowingVideo('primary');
            const secondaryVisible = this.isShowingVideo('secondary'); // Checks dualPageMode internally

            // Determine the target action (play or pause)
            // Priority: Primary state if primary is targeted (or null target),
            // otherwise Secondary state if only secondary is targeted.
            let shouldPlay = false;
            if (primaryVisible && (targetDisplay === 'primary' || targetDisplay === null)) {
                shouldPlay = this.videoDisplay.paused;
            } else if (secondaryVisible && targetDisplay === 'secondary') {
                shouldPlay = this.videoDisplay2.paused;
            } else if (secondaryVisible && targetDisplay === null && !primaryVisible) {
                // Toggling both, but primary isn't visible, use secondary's state
                shouldPlay = this.videoDisplay2.paused;
            }

            // Helper to apply the action and handle errors
            const applyState = (videoElement, name) => {
                if (shouldPlay) {
                    videoElement.play()?.catch(error => {
                        // Simplified notification - avoid flooding if both fail
                        if (name === 'primary' || !primaryVisible || targetDisplay !== null) {
                            console.error(`Error playing video (${name}):`, error);
                            createNotification(`Could not play video (${name}).`);
                        }
                    });
                } else {
                    videoElement.pause();
                }
            };

            // Apply to primary if it's targeted and visible
            if (primaryVisible && (targetDisplay === 'primary' || targetDisplay === null)) {
                applyState(this.videoDisplay, 'primary');
            } else if (targetDisplay === 'primary') {
                console.log("Primary video not visible, cannot toggle.");
            }

            // Apply to secondary if it's targeted and visible
            // Note: The *same* `shouldPlay` action is applied for synchronization when targetDisplay is null.
            if (secondaryVisible && (targetDisplay === 'secondary' || targetDisplay === null)) {
                applyState(this.videoDisplay2, 'secondary');
            } else if (targetDisplay === 'secondary') {
                console.log("Secondary video not visible, cannot toggle.");
            }

            if (targetDisplay !== 'primary' && targetDisplay !== 'secondary' && targetDisplay !== null) {
                console.warn(`Invalid targetDisplay specified for toggleVideoPlayback: ${targetDisplay}`);
            }
        }

        /**
         * Seeks the specified video display(s) by a given amount of time.
         * If targetDisplay is null (default), seeks both visible videos by the same amount.
         *
         * @param {number} time - The amount of time in seconds to seek.
         *            Positive values seek forward, negative values seek backward.
         * @param {'primary' | 'secondary' | null} [targetDisplay=null] - Which video display to seek.
         *                      'primary', 'secondary', or null (default) for both.
         */
        seekVideo(time, targetDisplay = null) {
            if (typeof time !== 'number' || isNaN(time)) {
                console.warn(`seekVideo called with invalid time value: ${time}`);
                return;
            }

            const primaryVisible = this.isShowingVideo('primary');
            const secondaryVisible = this.isShowingVideo('secondary'); // Checks dualPageMode internally

            // Helper function to apply the seek operation safely
            const applySeek = (videoElement, name) => {
                // Check if duration is available and valid before seeking
                if (videoElement.duration && !isNaN(videoElement.duration)) {
                    // currentTime assignment automatically clamps between 0 and duration
                    videoElement.currentTime += time;
                    // console.log(`Seeking video (${name}) by ${time}s. New time: ${videoElement.currentTime}`);
                } else {
                    console.log(`Cannot seek video (${name}): duration not available.`);
                }
            };

            // Seek primary if it's targeted and visible
            if (primaryVisible && (targetDisplay === 'primary' || targetDisplay === null)) {
                applySeek(this.videoDisplay, 'primary');
            } else if (targetDisplay === 'primary') {
                console.log("Primary video not visible, cannot seek.");
            }

            // Seek secondary if it's targeted and visible
            if (secondaryVisible && (targetDisplay === 'secondary' || targetDisplay === null)) {
                applySeek(this.videoDisplay2, 'secondary');
            } else if (targetDisplay === 'secondary') {
                console.log("Secondary video not visible, cannot seek.");
            }

            if (targetDisplay !== 'primary' && targetDisplay !== 'secondary' && targetDisplay !== null) {
                console.warn(`Invalid targetDisplay specified for seekVideo: ${targetDisplay}`);
            }
        }

        isGridViewActive() {
            return this.gridParent.style.display === "block";
        }

        toggleGridView(goToIndex = false) {
            if (this.isGridViewActive()) {
                this.gridParent.style.display = "none";
                this.gridView.stopLoading();
                if (goToIndex) this.loadAndShowIndex(this.savedIndexBeforeGridView);
                this.savedIndexBeforeGridView = null;
            } else {
                this.savedIndexBeforeGridView = this.currentIndex;
                this.gridParent.style.display = "block";
                if (!this.gridView.showCalled) {
                    this.gridView.showGridView();
                } else {
                    this.gridView.enableLoading();
                }
                this.gridView.scrollToIndex(this.currentIndex, false);
            }
        }

        rotateImage(delta) {
            this.currentRotation = (this.currentRotation + delta) % 360;
            if (this.currentRotation < 0) {
                this.currentRotation += 360;
            }
            this.updateTransforms();
        }

        /**
         * Zooms the image.
         * @param {number} direction - Positive to zoom in, negative to zoom out.
         * @param {number} [zoomFactor=1.1] - Zoom factor.
         * @param {boolean} [centerX=false] - Keep the horizontal center of the viewport anchored.
         * @param {boolean} [centerY=false] - Keep the vertical center of the viewport anchored.
         * @param {{x: number, y: number}|null} [anchor=null] - A specific anchor point {x, y} in viewport coordinates. Takes precedence over centerX/centerY.
         */
        zoom(direction, zoomFactor = 1.1, centerX = false, centerY = false, anchor = null) {
            const oldZoom = this.currentZoom;
            if (oldZoom <= 0) return;

            let newZoom = direction > 0 ? oldZoom * zoomFactor : oldZoom / zoomFactor;

            // Clamp zoom level
            newZoom = Math.max(this.minZoomLevel ?? 1, newZoom);

            if (Math.abs(newZoom - oldZoom) < 0.001) {
                return; // No significant change
            }

            // --- Store pre-zoom state for anchor calculation ---
            const parent = this.parent;
            const oldScrollLeft = parent.scrollLeft;
            const oldScrollTop = parent.scrollTop;
            const viewportWidth = parent.clientWidth;
            const viewportHeight = parent.clientHeight;
            const zoomRatio = newZoom / oldZoom;

            // --- Determine the anchor point in viewport coordinates ---
            let anchorX_viewport = null;
            let anchorY_viewport = null;

            if (anchor) {
                // A specific anchor point was provided, use it.
                anchorX_viewport = anchor.x;
                anchorY_viewport = anchor.y;
            } else {
                // Fallback to centerX/centerY flags for convenience.
                if (centerX) {
                    anchorX_viewport = viewportWidth / 2;
                }
                if (centerY) {
                    anchorY_viewport = viewportHeight / 2;
                }
            }

            this.currentZoom = newZoom;

            // --- Update Visuals (applies new scale and container size/pos) ---
            this.updateTransforms();

            // --- Adjust Scroll Position Conditionally to Maintain Anchor ---
            // Only adjust scroll if there's an anchor and we're actually zoomed in.
            if (this.currentZoom > 1 && (anchorX_viewport !== null || anchorY_viewport !== null)) {
                // Use requestAnimationFrame to ensure scroll update happens *after* the browser
                // has updated the element's dimensions and scrollWidth/scrollHeight.
                requestAnimationFrame(() => {
                    const maxScrollLeft = parent.scrollWidth - viewportWidth;
                    const maxScrollTop = parent.scrollHeight - viewportHeight;

                    let targetScrollLeft = parent.scrollLeft;
                    let targetScrollTop = parent.scrollTop;

                    // --- Horizontal Anchoring ---
                    if (anchorX_viewport !== null) {
                        // 1. Find the anchor's position relative to the full (old scaled) content
                        const anchorX_image = oldScrollLeft + anchorX_viewport;
                        // 2. Find where that point will be on the new scaled content
                        const newAnchorX_image = anchorX_image * zoomRatio;
                        // 3. Calculate the new scroll position to keep the anchor at the same viewport spot
                        const newScrollLeftTarget = newAnchorX_image - anchorX_viewport;
                        targetScrollLeft = Math.max(0, Math.min(newScrollLeftTarget, maxScrollLeft));
                    }

                    // --- Vertical Anchoring ---
                    if (anchorY_viewport !== null) {
                        const anchorY_image = oldScrollTop + anchorY_viewport;
                        const newAnchorY_image = anchorY_image * zoomRatio;
                        const newScrollTopTarget = newAnchorY_image - anchorY_viewport;
                        targetScrollTop = Math.max(0, Math.min(newScrollTopTarget, maxScrollTop));
                    }

                    if (parent.scrollLeft !== targetScrollLeft) {
                        parent.scrollLeft = targetScrollLeft;
                    }
                    if (parent.scrollTop !== targetScrollTop) {
                        parent.scrollTop = targetScrollTop;
                    }
                });

            } else { // Zooming out to 1 or less. Reset scroll.
                requestAnimationFrame(() => {
                    if (this.currentZoom <= 1) {
                        parent.scrollTop = 0;
                        parent.scrollLeft = 0;
                    }
                });
            }
        }

        /**
         * Marks an item as deleted, cleans up associated resources, refreshes grids,
         * and navigates away if the currently viewed item was deleted.
         * @param {number} index The index of the item to delete.
         */
        delete(index) {
            // 1. Validate Index
            if (index < 0 || index >= thumbs.length || thumbs[index] === 'deleted') {
                console.warn(`ImageViewer.delete: Invalid or already deleted index ${index}.`);
                return;
            }

            console.log(`ImageViewer.delete: Deleting index ${index}.`);
            const itemToDelete = thumbs[index]; // Get item data before marking as deleted

            // 2. Mark as Deleted
            thumbs[index] = 'deleted';

            // 3. Clean Up Blob Cache (if item existed and fallback was used)
            if (itemToDelete) {
                // Determine the URL that *might* be cached (prefer original if available)
                const potentialCachedUrl = itemToDelete.originalImageUrl || itemToDelete.fullImageUrl;
                if (potentialCachedUrl) {
                    this._evictCacheEntry(potentialCachedUrl); // Call the helper
                }
            }

            // 4. Refresh Grids
            this.refreshGrids();

            // 5. Handle Current Index Deletion & Navigation
            const displayedIndices = this._getDualPageIndices(this.currentIndex);
            const wasDisplayed = index === this.currentIndex || index === displayedIndices.primary || index === displayedIndices.secondary;

            if (wasDisplayed) {
                if (index < thumbs.length - 1) {
                    this.navigateForward();
                } else if (index > 0) {
                    this.navigateBack();
                }
            }
            // If the deleted index wasn't the current one, no navigation is needed.
        }

        refreshGrids() {
            this.sidebar?.refreshAll(); // Refresh sidebar grid
            this.gridView?.refreshAll(); // Refresh main gallery grid (when active)
        }

        _getOneToOneZoom() {
            // --- Determine Active Element and Get Dimensions ---
            const primaryElement = (this.videoDisplay.style.display === 'block') ? this.videoDisplay : this.imgDisplay;
            const primaryIsVideo = primaryElement === this.videoDisplay && primaryElement.style.display === 'block';
            let naturalW = 0, naturalH = 0;
            const MIN_ERROR_DIM = 100; // Consistent min dimension

            if (primaryElement.style.display === 'block') {
                naturalW = primaryIsVideo ? primaryElement.videoWidth : primaryElement.naturalWidth;
                naturalH = primaryIsVideo ? primaryElement.videoHeight : primaryElement.naturalHeight;
                // Apply MIN_ERROR_DIM logic for invalid or error states
                if (!primaryIsVideo && primaryElement.classList.contains('viewer-error-state')) {
                    naturalW = Math.max(naturalW, MIN_ERROR_DIM);
                    naturalH = Math.max(naturalH, MIN_ERROR_DIM);
                } else if (!primaryIsVideo && (!naturalW || naturalW <= 0 || !naturalH || naturalH <= 0)) {
                    // console.warn("1:1 Zoom: Primary image dimensions invalid, using min error dim.");
                    naturalW = MIN_ERROR_DIM; naturalH = MIN_ERROR_DIM;
                } else if (primaryIsVideo && (!naturalW || naturalW <= 0 || !naturalH || naturalH <= 0)) {
                    // console.warn("1:1 Zoom: Primary video dimensions invalid, using min error dim.");
                    naturalW = MIN_ERROR_DIM; naturalH = MIN_ERROR_DIM;
                }
            } else { // If primary not visible, use min dim as fallback
                // console.warn("1:1 Zoom: Primary element not visible, using min error dim.");
                naturalW = MIN_ERROR_DIM; naturalH = MIN_ERROR_DIM;
            }
            // Ensure not zero if still possible
            if (naturalW <= 0) naturalW = MIN_ERROR_DIM;
            if (naturalH <= 0) naturalH = MIN_ERROR_DIM;


            // --- Get Rotation and Viewport ---
            const currentRotation = this.currentRotation;
            const rotIs90 = currentRotation % 180 !== 0;
            const viewportWidth = this.parent.clientWidth;
            const viewportHeight = this.parent.clientHeight;
            if (viewportWidth <= 0 || viewportHeight <= 0) {
                console.warn("Cannot calculate 1:1 zoom: Viewport dimensions not available.");
                return 1; // Fallback
            }

            // Effective dimensions after rotation
            const effectiveW = rotIs90 ? naturalH : naturalW;
            const effectiveH = rotIs90 ? naturalW : naturalH;

            // --- Calculate baseScale (fit-to-screen scale) ---
            let baseScale = 1;
            const secondaryElement = (this.videoDisplay2.style.display === 'block') ? this.videoDisplay2 : this.imgDisplay2;
            // Check if secondary is *actually* displayed for dual page calculations
            const isDualPageVisible = this.dualPageMode && secondaryElement.style.display === 'block';
            let naturalW2 = 0, naturalH2 = 0;

            if (isDualPageVisible) {
                const secondaryIsVideo = secondaryElement === this.videoDisplay2;
                naturalW2 = secondaryIsVideo ? secondaryElement.videoWidth : secondaryElement.naturalWidth;
                naturalH2 = secondaryIsVideo ? secondaryElement.videoHeight : secondaryElement.naturalHeight;

                // Apply MIN_ERROR_DIM logic for invalid or error states
                if (!secondaryIsVideo && secondaryElement.classList.contains('viewer-error-state')) {
                    naturalW2 = Math.max(naturalW2, MIN_ERROR_DIM);
                    naturalH2 = Math.max(naturalH2, MIN_ERROR_DIM);
                } else if (!secondaryIsVideo && (!naturalW2 || naturalW2 <= 0 || !naturalH2 || naturalH2 <= 0)) {
                    // Use primary's dimensions if valid, else use min error dim.
                    if (naturalW > 0 && naturalH > 0 && naturalW !== MIN_ERROR_DIM) { // Check if primary has real dimensions
                        // console.warn("1:1 Zoom: Secondary dimensions invalid, using primary fallback.");
                        naturalW2 = naturalW; naturalH2 = naturalH;
                    } else {
                        // console.warn("1:1 Zoom: Secondary dimensions invalid, using min error dim.");
                        naturalW2 = MIN_ERROR_DIM; naturalH2 = MIN_ERROR_DIM;
                    }
                } else if (secondaryIsVideo && (!naturalW2 || naturalW2 <= 0 || !naturalH2 || naturalH2 <= 0)) {
                    // console.warn("1:1 Zoom: Secondary video dimensions invalid, using min error dim.");
                    naturalW2 = MIN_ERROR_DIM; naturalH2 = MIN_ERROR_DIM;
                }
                // Ensure W2/H2 are not zero if dual page is visible
                if (naturalW2 <= 0) naturalW2 = MIN_ERROR_DIM;
                if (naturalH2 <= 0) naturalH2 = MIN_ERROR_DIM;
            }

            // Calculate base scale based on whether dual page is effectively active
            let useDualForScale = isDualPageVisible;
            if (useDualForScale && (naturalW2 <= 0 || naturalH2 <= 0)) {
                // This check might be redundant due to above assignment, but safe
                useDualForScale = false;
            }

            if (useDualForScale) {
                let requiredWidthPerScale, requiredHeightPerScale;
                if (!rotIs90) { // Side-by-side
                    requiredWidthPerScale = naturalW + naturalW2;
                    requiredHeightPerScale = Math.max(naturalH, naturalH2);
                } else { // Top-and-bottom
                    requiredWidthPerScale = Math.max(naturalH, naturalH2);
                    requiredHeightPerScale = naturalW + naturalW2;
                }
                // Check for zero denominators
                const scaleLimitW = requiredWidthPerScale > 0 ? viewportWidth / requiredWidthPerScale : Infinity;
                const scaleLimitH = requiredHeightPerScale > 0 ? viewportHeight / requiredHeightPerScale : Infinity;
                baseScale = Math.min(scaleLimitW, scaleLimitH);
            } else { // Single page mode (or fallback)
                // effectiveW/H derived from naturalW/H which are guaranteed > 0 here
                const scaleLimitW = effectiveW > 0 ? viewportWidth / effectiveW : Infinity;
                const scaleLimitH = effectiveH > 0 ? viewportHeight / effectiveH : Infinity;
                baseScale = Math.min(scaleLimitW, scaleLimitH);
            }
            baseScale = Math.max(baseScale, 0); // Ensure non-negative


            // --- Calculate 1:1 Zoom Factor ---
            if (baseScale > 0) {
                return 1 / baseScale;
            } else {
                console.warn("Cannot calculate 1:1 zoom: baseScale is zero.");
                return 1; // Fallback
            }
        }

        _getFitWidthZoom() {
            // --- Determine Active Elements and Get Dimensions ---
            const primaryElement = (this.videoDisplay.style.display === 'block') ? this.videoDisplay : this.imgDisplay;
            const primaryIsVideo = primaryElement === this.videoDisplay && primaryElement.style.display === 'block';
            let naturalW1 = 0, naturalH1 = 0;
            const MIN_ERROR_DIM = 100; // Consistent min dimension

            if (primaryElement.style.display === 'block') {
                naturalW1 = primaryIsVideo ? primaryElement.videoWidth : primaryElement.naturalWidth;
                naturalH1 = primaryIsVideo ? primaryElement.videoHeight : primaryElement.naturalHeight;
                // Apply MIN_ERROR_DIM logic
                if (!primaryIsVideo && primaryElement.classList.contains('viewer-error-state')) {
                    naturalW1 = Math.max(naturalW1, MIN_ERROR_DIM);
                    naturalH1 = Math.max(naturalH1, MIN_ERROR_DIM);
                } else if (!primaryIsVideo && (!naturalW1 || naturalW1 <= 0 || !naturalH1 || naturalH1 <= 0)) {
                    // console.warn("Fit Width: Primary image dimensions invalid, using min error dim.");
                    naturalW1 = MIN_ERROR_DIM; naturalH1 = MIN_ERROR_DIM;
                } else if (primaryIsVideo && (!naturalW1 || naturalW1 <= 0 || !naturalH1 || naturalH1 <= 0)) {
                    // console.warn("Fit Width: Primary video dimensions invalid, using min error dim.");
                    naturalW1 = MIN_ERROR_DIM; naturalH1 = MIN_ERROR_DIM;
                }
            } else {
                // console.warn("Fit Width: Primary element not visible, using min error dim.");
                naturalW1 = MIN_ERROR_DIM; naturalH1 = MIN_ERROR_DIM;
            }
            // Ensure not zero
            if (naturalW1 <= 0) naturalW1 = MIN_ERROR_DIM;
            if (naturalH1 <= 0) naturalH1 = MIN_ERROR_DIM;

            // --- Get Rotation and Viewport ---
            const currentRotation = this.currentRotation;
            const rotIs90 = currentRotation % 180 !== 0;
            const viewportWidth = this.parent.clientWidth;
            const viewportHeight = this.parent.clientHeight;
            if (viewportWidth <= 0 || viewportHeight <= 0) {
                console.warn("Cannot calculate fit-width zoom: Viewport dimensions not available.");
                return 1; // Fallback
            }

            // --- Calculate the baseScale (fit-to-viewport scale) ---
            let baseScale = 1;
            const secondaryElement = (this.videoDisplay2.style.display === 'block') ? this.videoDisplay2 : this.imgDisplay2;
            let isDualPageVisible = this.dualPageMode && secondaryElement.style.display === 'block';
            let naturalW2 = 0, naturalH2 = 0;

            if (isDualPageVisible) {
                const secondaryIsVideoCheck = secondaryElement === this.videoDisplay2;
                naturalW2 = secondaryIsVideoCheck ? secondaryElement.videoWidth : secondaryElement.naturalWidth;
                naturalH2 = secondaryIsVideoCheck ? secondaryElement.videoHeight : secondaryElement.naturalHeight;

                // Apply MIN_ERROR_DIM logic
                if (!secondaryIsVideoCheck && secondaryElement.classList.contains('viewer-error-state')) {
                    naturalW2 = Math.max(naturalW2, MIN_ERROR_DIM);
                    naturalH2 = Math.max(naturalH2, MIN_ERROR_DIM);
                } else if (!secondaryIsVideoCheck && (!naturalW2 || naturalW2 <= 0 || !naturalH2 || naturalH2 <= 0)) {
                    if (naturalW1 > 0 && naturalH1 > 0 && naturalW1 !== MIN_ERROR_DIM) {
                        // console.warn("Fit Width: Secondary dimensions invalid, using primary fallback.");
                        naturalW2 = naturalW1; naturalH2 = naturalH1;
                    } else {
                        // console.warn("Fit Width: Secondary dimensions invalid, using min error dim.");
                        naturalW2 = MIN_ERROR_DIM; naturalH2 = MIN_ERROR_DIM;
                    }
                } else if (secondaryIsVideoCheck && (!naturalW2 || naturalW2 <= 0 || !naturalH2 || naturalH2 <= 0)) {
                    // console.warn("Fit Width: Secondary video dimensions invalid, using min error dim.");
                    naturalW2 = MIN_ERROR_DIM; naturalH2 = MIN_ERROR_DIM;
                }
                // Ensure W2/H2 are not zero if dual page is visible
                if (naturalW2 <= 0) naturalW2 = MIN_ERROR_DIM;
                if (naturalH2 <= 0) naturalH2 = MIN_ERROR_DIM;

                // If dimensions are still invalid after checks, treat as single page for scaling
                if (naturalW2 <= 0 || naturalH2 <= 0) {
                    isDualPageVisible = false;
                    // console.warn("Fit Width: Secondary dimensions invalid after fallback, treating as single for scale.");
                }
            }

            // Calculate base scale
            let useDualForScale = isDualPageVisible; // Use separate flag for clarity

            if (useDualForScale) {
                let requiredWidthPerScale, requiredHeightPerScale;
                if (!rotIs90) { // Side-by-side
                    requiredWidthPerScale = naturalW1 + naturalW2;
                    requiredHeightPerScale = Math.max(naturalH1, naturalH2);
                } else { // Top-and-bottom
                    requiredWidthPerScale = Math.max(naturalH1, naturalH2);
                    requiredHeightPerScale = naturalW1 + naturalW2;
                }
                const scaleLimitW = requiredWidthPerScale > 0 ? viewportWidth / requiredWidthPerScale : Infinity;
                const scaleLimitH = requiredHeightPerScale > 0 ? viewportHeight / requiredHeightPerScale : Infinity;
                baseScale = Math.min(scaleLimitW, scaleLimitH);
            } else { // Single page mode (or fallback)
                const effectiveW = rotIs90 ? naturalH1 : naturalW1; // Uses W1/H1 which are guaranteed > 0
                const effectiveH = rotIs90 ? naturalW1 : naturalH1;
                const scaleLimitW = effectiveW > 0 ? viewportWidth / effectiveW : Infinity;
                const scaleLimitH = effectiveH > 0 ? viewportHeight / effectiveH : Infinity;
                baseScale = Math.min(scaleLimitW, scaleLimitH);
            }
            baseScale = Math.max(baseScale, 0);


            // --- Calculate the desired final scale to achieve fit-width ---
            let desiredFinalScale = 1.0;
            let targetWidth = 0; // The width we want the content to scale to (viewport width)

            // Use potentially adjusted dimensions, use useDualForScale flag
            if (useDualForScale) { // W2/H2 validity checked above
                if (!rotIs90) { // Side-by-side: target width is W1+W2
                    targetWidth = naturalW1 + naturalW2;
                } else { // Top-and-bottom: target width is max(H1, H2)
                    targetWidth = Math.max(naturalH1, naturalH2);
                }
            } else { // Single page: target width is effectiveW
                targetWidth = rotIs90 ? naturalH1 : naturalW1; // Uses W1/H1 which are guaranteed > 0
            }

            if (targetWidth > 0) {
                desiredFinalScale = viewportWidth / targetWidth;
            } else {
                console.warn("Cannot calculate fit-width zoom: Target width is zero.");
                desiredFinalScale = baseScale > 0 ? baseScale : 1.0; // Fallback
            }
            desiredFinalScale = Math.max(desiredFinalScale, 0);


            // --- Calculate the required currentZoom ---
            let finalZoom = 1.0;
            if (baseScale > 0) {
                finalZoom = desiredFinalScale / baseScale;
            } else {
                console.warn("Cannot calculate fit-width zoom: baseScale is zero.");
                finalZoom = 1.0; // Fallback
            }

            // Ensure zoom doesn't go below the base 'fit' level (zoom=1).
            finalZoom = Math.max(1.0, finalZoom);
            return finalZoom;
        }

        pan(deltaX, deltaY) {
            if (this.currentZoom > 1) {
                this.parent.scrollBy(deltaX, deltaY);
            }
        }

        toggleDualPageMode() {
            this.dualPageMode = !this.dualPageMode;
            // Call loadAndShowIndex to refresh the view with the current index,
            // applying the new dual page mode logic.
            this.loadAndShowIndex(this.currentIndex);
        }

        toggleRightToLeftMode() {
            if (!this.dualPageMode) {
                this.toggleDualPageMode();
            }
            this.rightToLeftMode = !this.rightToLeftMode;
            this.loadAndShowIndex(this.currentIndex);
        }

        enableDualPageModeOrCycleLayout() {
            if (!this.dualPageMode) {
                this.dualPageMode = true;
            } else {
                const { primary: currentPrimaryIndex } = this._getDualPageIndices(this.currentIndex);
                if (currentPrimaryIndex === null) {
                    this.dualPageMode = false;
                    console.log("Could not determine left page, toggling back to Single Page Mode.");
                } else {
                    // The logic toggles between 'odd-first' and 'even-first' layouts.
                    // In LTR, if the primary (left) index is even, we're in `odd-first` layout and switch to `even-first`.
                    // In RTL, page order is swapped, so if the primary (left) index is even, we're already in `even-first` layout
                    // and must switch to `odd-first`. This XOR condition correctly handles the toggle for both modes.
                    if ((currentPrimaryIndex % 2 === 0) !== this.rightToLeftMode) {
                        this.dualLayout = 'even-first';
                    } else {
                        this.dualLayout = 'odd-first';
                    }
                }
            }
            this.loadAndShowIndex(this.currentIndex);
        }

        downloadCurrentImage() {
            if (this.isGridViewActive()) return;

            const { primary, secondary } = this._getDualPageIndices(this.currentIndex);
            const sStr = secondary ? "s" : "";

            createNotification(`Downloading original image${sStr}..`, 30);
            const items = [thumbs[primary]];
            if (secondary) items.push(thumbs[secondary]);

            for (let i = 0; i < items.length; i++) {
                const item = items[i];

                if (item.originalImageUrl) {
                    const imgElement = new Image();
                    imgElement.referrerPolicy = "no-referrer";
                    imgElement.src = item.originalImageUrl;
                    waitForMediaLoad(imgElement)
                        .then(() => {
                            saveImage(item.originalImageUrl);
                        })
                        .catch((error) => {
                            console.error("Failed to load original, downloading downscaled image:", error);
                            createNotification("Failed to load original, using downscaled.");
                            saveImage(item.fullImageUrl);
                        });
                } else {
                    saveImage(item.fullImageUrl);
                }
            }

            createNotification(`Image${sStr} saved`);
        }

        showGalleriesWithCurrentImage() {
            showGalleriesWithThisImage(thumbs[this.currentIndex].fullImageUrl);
        }

        async loadAndShowIndex(index) {
            const wasActive = this.isActive();
            const gridViewWasActive = this.isGridViewActive();
            if (this.isGridViewActive()) this.toggleGridView();

            // Ensure viewer is active/visible
            this._ensureViewerActive();

            // Prepare and Validate
            const prepResult = this._prepareLoadOperation(index);
            if (!prepResult) return; // Invalid index or error during prep
            const { controller, loadToken, targetIndex, navigatedBackwards } = prepResult;

            // Determine Display Indices & Update Label
            const { displayPrimaryIndex, displaySecondaryIndex } = this._getDisplayIndicesAndLabel(targetIndex);

            // Initiate Dimming
            const dimTimeoutId = this._initiateDimming(targetIndex, loadToken, wasActive, gridViewWasActive, displayPrimaryIndex, displaySecondaryIndex);

            try {
                // Fetch Required URLs
                await this._fetchRequiredUrls([displayPrimaryIndex, displaySecondaryIndex], controller.signal, loadToken);
                // Note: _fetchRequiredUrls throws AbortError if cancelled

                // Display Loaded Images (This now handles un-dimming internally per image)
                await this._displayLoadedImages(targetIndex, displayPrimaryIndex, displaySecondaryIndex, controller.signal, loadToken);
                // Note: _displayLoadedImages calls _show which throws AbortError if cancelled during its await

                // Post-Display Tasks (Sidebar, Scroll Anchor, Preload)
                this._performPostDisplayTasks(targetIndex, displayPrimaryIndex, displaySecondaryIndex, navigatedBackwards, controller.signal, loadToken);

            } catch (error) {
                // Handle Errors (This also handles un-dimming via helper)
                this._handleLoadError(error, targetIndex, loadToken);

            } finally {
                // Final Cleanup (This also handles final un-dimming via helper)
                this._finalizeLoadAttempt(loadToken, dimTimeoutId);
            }
        }

        navigateForward() {
            this.backwardNavigationCount = 0;

            // 1. Get current display state
            const { primary: currentPrimary, secondary: currentSecondary } = this._getDualPageIndices(this.currentIndex);

            // 2. Find the highest index currently displayed
            let maxCurrent = -1;
            if (currentPrimary !== null) {
                maxCurrent = currentPrimary;
            }
            if (currentSecondary !== null && currentSecondary > maxCurrent) {
                maxCurrent = currentSecondary;
            }
            if (maxCurrent === -1) {
                // If nothing is displayed (error state?), try navigating from currentIndex
                maxCurrent = this.currentIndex;
            }


            // 3. Calculate initial next target
            let nextTargetIndex = maxCurrent + 1;

            // 4. Skip deleted indices forward
            while (nextTargetIndex < thumbs.length && thumbs[nextTargetIndex] === 'deleted') {
                nextTargetIndex++;
            }

            // 5. Check bounds
            if (nextTargetIndex >= thumbs.length) {
                createNotification("Last page!");
                return;
            }

            // 6. Load the determined target index
            this.loadAndShowIndex(nextTargetIndex);
        }

        navigateBack() {
            this.backwardNavigationCount++;

            // 1. Get current display state
            const { primary: currentPrimary, secondary: currentSecondary } = this._getDualPageIndices(this.currentIndex);

            // 2. Find the lowest index currently displayed
            let minCurrent = -1;
            if (currentPrimary !== null) {
                minCurrent = currentPrimary;
            }
            if (currentSecondary !== null && currentSecondary < minCurrent) {
                minCurrent = currentSecondary;
            }
            if (minCurrent === -1) {
                // If nothing is displayed (error state?), try navigating from currentIndex
                minCurrent = this.currentIndex;
            }

            // 3. Calculate initial previous target
            let prevTargetIndex = minCurrent - 1;

            // 4. Skip deleted indices backward
            while (prevTargetIndex >= 0 && thumbs[prevTargetIndex] === 'deleted') {
                prevTargetIndex--;
            }

            // Needed for 'selected-first', as otherwise it would only go back one page
            // at a time. It should not affect the other layouts in theory, but let's
            // make it a special case anyways.
            if (this.dualPageMode && prevTargetIndex > 0 && this.dualLayout === 'selected-first') {
                prevTargetIndex--;
            }

            // 5. Check bounds
            if (prevTargetIndex < 0) {
                // Special case check for 'even-first' mode at index 1 or 0
                // If mode is 'even-first' and current primary was 1 (showing 1,2), target is 0.
                // If target 0 is valid, we should allow navigating to it.
                // The _getDualPageIndices handles showing only 0 if needed.
                if (this.dualLayout === 'even-first' && minCurrent === 1 && prevTargetIndex === -1 && thumbs.length > 0 && thumbs[0] !== 'deleted') {
                    prevTargetIndex = 0; // Allow navigating to index 0
                } else {
                    createNotification("First page!");
                    return;
                }
            }

            // 6. Load the determined target index
            this.loadAndShowIndex(prevTargetIndex);
        }

        goOrScrollToIndex(index) {
            if (this.isGridViewActive()) {
                this.gridView.scrollToIndex(index);
            } else {
                this.loadAndShowIndex(index);
            }
        }

        enterFullscreen() {
            this.hasEnteredFullscreenOnce = true;
            requestFullscreen(document.body);
        }

        exitFullscreen() {
            exitFullscreen();
        }

        toggleFullscreen() {
            this.useFullscreen = !isFullscreen();
            if (this.useFullscreen) {
                this.enterFullscreen();
            } else {
                this.exitFullscreen();
            }
        }

        closeViewer(exitToPage) {
            console.log('Closing viewer, exitToPage=', exitToPage);
            unlockPageScroll();
            this.parent.style.display = "none";

            // --- Pause Videos ---
            if (!this.videoDisplay.paused) {
                this.videoDisplay.currentTime = 0;
                this.videoDisplay.pause();
            }
            if (!this.videoDisplay2.paused) {
                this.videoDisplay2.currentTime = 0;
                this.videoDisplay2.pause();
            }
            // Clean up blob URLs
            this._revokeBlobUrl(this.videoDisplay);
            this._revokeBlobUrl(this.videoDisplay2);

            // Clear src to release resources
            this.videoDisplay.removeAttribute('src');
            this.videoDisplay2.removeAttribute('src');
            this.imgDisplay.removeAttribute('src');
            this.imgDisplay2.removeAttribute('src');


            // Abort any ongoing load operation
            if (this.currentAbortController) {
                this.currentAbortController.abort("Viewer closing"); // Add reason
                this.currentAbortController = null;
            }
            this.currentLoadToken = null; // Clear token as well


            // Reset state (maybe?)
            // Let's preserve zoom and rotation for now.
            this.userChangedZoom = false;
            // this.currentZoom = 1.0;
            // this.currentRotation = 0;

            const exitIndex = this.currentIndex;

            const wasFullscreen = isFullscreen();
            if (wasFullscreen) {
                const onFullscreenChange = () => {
                    if (document.fullscreenElement) return; // Still in fullscreen (maybe entered again?)
                    // Ensure cleanup happens only once
                    document.removeEventListener("fullscreenchange", onFullscreenChange);
                    if (this.onExit) {
                        console.log("Calling onExit after fullscreen exit.");
                        this.onExit(exitToPage, exitIndex);
                    }
                };
                document.addEventListener("fullscreenchange", onFullscreenChange);
                this.exitFullscreen();
            }

            if (this.isGridViewActive()) {
                this.toggleGridView(); // Ensure grid view is hidden and stopped
            }
            if (this.sidebarIsActive() && !this.pinSidebar) {
                this.sidebarHideInstant(); // Hide sidebar immediately if not pinned
            }
            if (this.chapterSidebarIsActive()) {
                this.toggleChapterSidebar(); // Hide chapter sidebar
            }
            if (this.isHelpOverlayVisible()) {
                this.toggleHelpOverlay(); // Hide help overlay
            }

            // Restore scroll position if we entered fullscreen
            // Only restore if we actually *used* fullscreen during this session
            if (this.hasEnteredFullscreenOnce && this.lastScrollPosition) {
                // *** ADDED *** Revoke any leftover blob URLs
                this._revokeBlobUrl(this.videoDisplay);
                this._revokeBlobUrl(this.videoDisplay2);
                // Delay slightly to allow fullscreen exit animation to complete?
                requestAnimationFrame(() => {
                    window.scrollTo(this.lastScrollPosition.x, this.lastScrollPosition.y);
                    this.lastScrollPosition = null; // Clear after restoring
                });
            } else {
                this.lastScrollPosition = null; // Clear if not used
            }


            this.hasEnteredFullscreenOnce = false; // Reset flag for next opening

            if (this.config.helpAndSettingsButtons === 'proximity') {
                this.buttonContainer.style.opacity = '0';
                this.buttonContainer.style.pointerEvents = 'none';
            }

            // Call onExit callback immediately if not handling fullscreen exit
            if (!wasFullscreen && this.onExit) {
                console.log("Calling onExit (not fullscreen).");
                this.onExit(exitToPage, exitIndex);
            }

            this.currentIndex = 0;
        }

        updateTransforms() {
            // --- Determine Active Elements and Media Types ---
            const primaryElement = (this.videoDisplay.style.display === 'block') ? this.videoDisplay : this.imgDisplay;
            const primaryIsVideo = primaryElement === this.videoDisplay && primaryElement.style.display === 'block';
            const secondaryElement = (this.videoDisplay2.style.display === 'block') ? this.videoDisplay2 : this.imgDisplay2;
            // isDualPageVisible: Check if dual mode is on AND secondary element is actually being displayed
            const isDualPageVisible = this.dualPageMode && secondaryElement.style.display === 'block';
            const secondaryIsVideo = isDualPageVisible && secondaryElement === this.videoDisplay2;


            // --- Handle Rotation ---
            let currentRotation = this.currentRotation;
            const rotIs90 = currentRotation % 180 !== 0;

            // --- Get Natural Media Dimensions (from active elements) ---
            let naturalW1 = 0, naturalH1 = 0;
            const MIN_ERROR_DIM = 100; // Min width/height for error placeholder visual

            if (primaryElement.style.display === 'block') {
                naturalW1 = primaryIsVideo ? primaryElement.videoWidth : primaryElement.naturalWidth;
                naturalH1 = primaryIsVideo ? primaryElement.videoHeight : primaryElement.naturalHeight;

                // Check for error state or invalid dimensions on the *image* element specifically
                // Videos have their own dimensions which should be valid if displayed.
                if (!primaryIsVideo && primaryElement.classList.contains('viewer-error-state')) {
                    // Assign minimum dimensions for error placeholder
                    naturalW1 = Math.max(naturalW1, MIN_ERROR_DIM);
                    naturalH1 = Math.max(naturalH1, MIN_ERROR_DIM);
                } else if (!primaryIsVideo && (!naturalW1 || naturalW1 <= 0 || !naturalH1 || naturalH1 <= 0)) {
                    // Treat other invalid image dimensions as error case for sizing.
                    // console.warn("Primary image dimensions invalid or zero, assigning min error dimensions.");
                    naturalW1 = MIN_ERROR_DIM;
                    naturalH1 = MIN_ERROR_DIM;
                } else if (primaryIsVideo && (!naturalW1 || naturalW1 <= 0 || !naturalH1 || naturalH1 <= 0)) {
                    // If video dimensions are somehow invalid/zero after load, treat similarly?
                    // console.warn("Primary video dimensions invalid or zero after load, assigning min error dimensions.");
                    naturalW1 = MIN_ERROR_DIM;
                    naturalH1 = MIN_ERROR_DIM;
                }
            } else {
                // If primary element isn't displayed at all, use MIN dimensions for robustness
                // This case shouldn't ideally happen if _show logic is correct.
                // console.warn("Primary element not displayed in updateTransforms, assigning min error dimensions.");
                naturalW1 = MIN_ERROR_DIM;
                naturalH1 = MIN_ERROR_DIM;
            }


            let naturalW2 = 0, naturalH2 = 0;
            if (isDualPageVisible) { // isDualPageVisible already implies secondaryElement is set and display=block
                naturalW2 = secondaryIsVideo ? secondaryElement.videoWidth : secondaryElement.naturalWidth;
                naturalH2 = secondaryIsVideo ? secondaryElement.videoHeight : secondaryElement.naturalHeight;

                // Check for error state or invalid dimensions on the *image* element specifically
                if (!secondaryIsVideo && secondaryElement.classList.contains('viewer-error-state')) {
                    naturalW2 = Math.max(naturalW2, MIN_ERROR_DIM);
                    naturalH2 = Math.max(naturalH2, MIN_ERROR_DIM);
                } else if (!secondaryIsVideo && (!naturalW2 || naturalW2 <= 0 || !naturalH2 || naturalH2 <= 0)) {
                    // Use primary's dimensions if valid, else use min error dim.
                    if (naturalW1 > 0 && naturalH1 > 0 && naturalW1 !== MIN_ERROR_DIM) { // Check if primary has real dimensions
                        // console.warn("Secondary image dimensions invalid, using primary as fallback.");
                        naturalW2 = naturalW1; naturalH2 = naturalH1;
                    } else {
                        // console.warn("Secondary image dimensions invalid, assigning min error dimensions.");
                        naturalW2 = MIN_ERROR_DIM; naturalH2 = MIN_ERROR_DIM;
                    }
                } else if (secondaryIsVideo && (!naturalW2 || naturalW2 <= 0 || !naturalH2 || naturalH2 <= 0)) {
                    // console.warn("Secondary video dimensions invalid or zero after load, assigning min error dimensions.");
                    naturalW2 = MIN_ERROR_DIM;
                    naturalH2 = MIN_ERROR_DIM;
                }
            }


            // --- Get Viewport ---
            const viewportWidth = this.parent.clientWidth;
            const viewportHeight = this.parent.clientHeight;
            // If viewport is zero, calculations below are meaningless. Return early.
            if (viewportWidth <= 0 || viewportHeight <= 0) {
                console.warn("Viewport dimensions are zero or negative in updateTransforms.");
                return;
            }


            // --- Set Fit Mode Zoom Level (if not manually zoomed) ---
            if (!this.userChangedZoom) {
                if (this.fitMode == "fit-width") {
                    this.currentZoom = this._getFitWidthZoom(); // Uses MIN_ERROR_DIM internally now
                } else if (this.fitMode == "one-to-one") {
                    this.currentZoom = this._getOneToOneZoom(); // Uses MIN_ERROR_DIM internally now
                } else { // Default to fit-window
                    this.currentZoom = 1.0;
                }
                // Set min zoom based on the calculated 'fit' zoom, but ensure it's not > 1
                // Ensure minZoomLevel is calculated based on the potentially adjusted fit-mode zoom.
                // The base 'fit-window' zoom (currentZoom=1) acts as the lower bound here.
                this.minZoomLevel = Math.min(this.currentZoom, 1.0);
            }

            // --- Calculate Base Scale (Fit-to-Viewport) ---
            let baseScale = 1;
            // Use the potentially adjusted naturalW1/H1/W2/H2 (which now include MIN_ERROR_DIM)
            // Ensure primary dimensions are positive before calculating scale
            if (naturalW1 <= 0 || naturalH1 <= 0) {
                console.error("Primary dimensions are still <= 0 before scale calculation. Setting scale to 0.");
                baseScale = 0; // Avoid division by zero
            } else {
                // Check secondary dimensions validity only if dual page is intended
                let useDualForScale = isDualPageVisible;
                if (useDualForScale && (naturalW2 <= 0 || naturalH2 <= 0)) {
                    console.warn("Secondary dimensions are <= 0 during scale calc, treating as single page for scaling.");
                    useDualForScale = false;
                }

                if (useDualForScale) {
                    let requiredWidthPerScale, requiredHeightPerScale;
                    if (!rotIs90) { // Side-by-side
                        requiredWidthPerScale = naturalW1 + naturalW2;
                        requiredHeightPerScale = Math.max(naturalH1, naturalH2);
                    } else { // Top-and-bottom
                        requiredWidthPerScale = Math.max(naturalH1, naturalH2);
                        requiredHeightPerScale = naturalW1 + naturalW2;
                    }
                    // Check for zero denominator before division
                    const scaleLimitW = requiredWidthPerScale > 0 ? viewportWidth / requiredWidthPerScale : Infinity;
                    const scaleLimitH = requiredHeightPerScale > 0 ? viewportHeight / requiredHeightPerScale : Infinity;
                    baseScale = Math.min(scaleLimitW, scaleLimitH);
                } else { // Single page mode (or fallback)
                    const effectiveW = rotIs90 ? naturalH1 : naturalW1;
                    const effectiveH = rotIs90 ? naturalW1 : naturalH1;
                    // Check for zero denominator before division
                    const scaleLimitW = effectiveW > 0 ? viewportWidth / effectiveW : Infinity;
                    const scaleLimitH = effectiveH > 0 ? viewportHeight / effectiveH : Infinity;
                    baseScale = Math.min(scaleLimitW, scaleLimitH);
                }
            }

            baseScale = Math.max(baseScale, 0); // Ensure non-negative scale

            // --- Final Scale incorporating User Zoom ---
            const finalScale = baseScale * this.currentZoom;
            console.log(`updateTransforms: baseScale=${baseScale}, currentZoom=${this.currentZoom}, finalScale=${finalScale}`);

            // --- Calculate Final CSS Dimensions for Media ---
            // Uses potentially adjusted W/H. If error, these will be MIN_ERROR_DIM * finalScale
            const primaryCssWidth = naturalW1 * finalScale;
            const primaryCssHeight = naturalH1 * finalScale;
            let secondaryCssWidth = 0, secondaryCssHeight = 0;
            // Use isDualPageVisible which confirms secondary is displayed and dimensions should be valid (>=MIN_ERROR_DIM)
            if (isDualPageVisible) {
                secondaryCssWidth = naturalW2 * finalScale;
                secondaryCssHeight = naturalH2 * finalScale;
            }


            // --- Apply Styles to Visible Media Elements ---
            const rotationTransform = `rotate(${currentRotation}deg)`;
            const primaryTransition = this.config.enableAnimations ? 'transform 0.3s ease-out' : 'none'; // Smoother ease-out
            const secondaryTransition = this.config.enableAnimations ? 'transform 0.3s ease-out' : 'none';

            primaryElement.style.width = primaryCssWidth + 'px';
            primaryElement.style.height = primaryCssHeight + 'px';
            primaryElement.style.transform = rotationTransform;
            // Apply transition only if animations are enabled AND it's not the error state
            // (error state might look weird transforming)
            primaryElement.style.transition = (this.config.enableAnimations && !primaryElement.classList.contains('viewer-error-state')) ? primaryTransition : 'none';


            if (isDualPageVisible) {
                secondaryElement.style.width = secondaryCssWidth + 'px';
                secondaryElement.style.height = secondaryCssHeight + 'px';
                secondaryElement.style.transform = rotationTransform;
                secondaryElement.style.transition = (this.config.enableAnimations && !secondaryElement.classList.contains('viewer-error-state')) ? secondaryTransition : 'none';
            } else {
                // Ensure *both* potential secondary elements have styles cleared if not visible
                this.imgDisplay2.style.width = 'auto'; this.imgDisplay2.style.height = 'auto';
                this.imgDisplay2.style.transform = ''; this.imgDisplay2.style.transition = '';
                this.videoDisplay2.style.width = 'auto'; this.videoDisplay2.style.height = 'auto';
                this.videoDisplay2.style.transform = ''; this.videoDisplay2.style.transition = '';
            }

            // --- Calculate Container Dimensions (based on final scaled media) ---
            let containerContentWidth, containerContentHeight;
            if (isDualPageVisible) {
                if (!rotIs90) { // Side-by-side
                    containerContentWidth = primaryCssWidth + secondaryCssWidth;
                    containerContentHeight = Math.max(primaryCssHeight, secondaryCssHeight);
                    this.imgContainer.style.flexDirection = "row";
                } else { // Top-and-bottom
                    containerContentWidth = Math.max(primaryCssWidth, secondaryCssWidth);
                    containerContentHeight = primaryCssHeight + secondaryCssHeight;
                    this.imgContainer.style.flexDirection = "column";
                }
            } else { // Single page
                containerContentWidth = primaryCssWidth;
                containerContentHeight = primaryCssHeight;
                this.imgContainer.style.flexDirection = "row"; // Default for single
            }

            // --- Calculate Container Visual Size and Position ---
            const visualContainerWidth = rotIs90 ? containerContentHeight : containerContentWidth;
            const visualContainerHeight = rotIs90 ? containerContentWidth : containerContentHeight;

            // Avoid negative dimensions which can cause issues
            const clampedVisualWidth = Math.max(0, visualContainerWidth);
            const clampedVisualHeight = Math.max(0, visualContainerHeight);

            let needsScrollX = clampedVisualWidth > viewportWidth;
            let needsScrollY = clampedVisualHeight > viewportHeight;

            console.log(`updateTransforms: clampedVisual=${clampedVisualWidth}x${clampedVisualHeight}, viewport=${viewportWidth}x${viewportHeight}`);
            console.log(`updateTransforms: needsSrollX=${needsScrollX}, needsScrollY=${needsScrollY}`);

            if (this.currentZoom === 1.0 && (needsScrollX || needsScrollY)) {
                // this shouldn't happen, but just in case.
                console.warn(`updateTransforms: Force removing scrollbars as currentZoom=1.0 (fit-window).`);
                needsScrollX = false;
                needsScrollY = false;
            }

            // Center container if smaller than viewport, align top-left if larger
            let containerTop = needsScrollY ? 0 : (viewportHeight - clampedVisualHeight) / 2;
            let containerLeft = needsScrollX ? 0 : (viewportWidth - clampedVisualWidth) / 2;

            // Ensure top/left are not negative if calculation somehow results in it
            containerTop = Math.max(0, containerTop);
            containerLeft = Math.max(0, containerLeft);


            // Apply position and size to the container
            this.imgContainer.style.top = `${containerTop}px`;
            this.imgContainer.style.left = `${containerLeft}px`;
            this.imgContainer.style.width = `${clampedVisualWidth}px`;
            this.imgContainer.style.height = `${clampedVisualHeight}px`;

            // --- Update Parent Overflow ---
            const oldOverflowX = this.parent.style.overflowX;
            const oldOverflowY = this.parent.style.overflowY;
            const newOverflowX = needsScrollX ? "auto" : "hidden";
            const newOverflowY = needsScrollY ? "auto" : "hidden";

            if (newOverflowX !== oldOverflowX) {
                this.parent.style.overflowX = newOverflowX;
                // Reset scroll only if changing *to* hidden (prevents jumpiness if already hidden)
                if (newOverflowX === 'hidden' && this.parent.scrollLeft > 0) {
                    // Use requestAnimationFrame to avoid potential race conditions with layout updates
                    requestAnimationFrame(() => { this.parent.scrollLeft = 0; });
                }
            }
            if (newOverflowY !== oldOverflowY) {
                this.parent.style.overflowY = newOverflowY;
                if (newOverflowY === 'hidden' && this.parent.scrollTop > 0) {
                    requestAnimationFrame(() => { this.parent.scrollTop = 0; });
                }
            }
        }

        _revokeBlobUrl(videoElement) {
            if (videoElement._currentBlobUrl) {
                URL.revokeObjectURL(videoElement._currentBlobUrl);
                videoElement._currentBlobUrl = null;
            }
        }

        _createImageViewer() {
            this.parent = document.createElement('div');
            this.parent.id = "Overlay";
            Object.assign(this.parent.style, {
                position: "fixed",
                top: "0",
                left: "0",
                width: "100vw",
                height: "100vh",
                backgroundColor: "rgba(0, 0, 0, 1)",
                display: "none", // Initially hidden
                overflowX: "hidden",
                overflowY: "hidden",
                zIndex: "9999",
                cursor: "default",
            });

            this.imgContainerContainer = document.createElement('div');
            this.imgContainerContainer.id = "imgContainerContainer";
            Object.assign(this.imgContainerContainer.style, {
                margin: "none",
                padding: "none",
                width: "100%",
                height: "100%",
            });

            // imgContainer: Positioned absolutely, calculations done in JS
            this.imgContainer = document.createElement("div");
            this.imgContainer.id = "imgContainer";
            Object.assign(this.imgContainer.style, {
                position: "absolute", // Manual positioning
                display: "flex", // Still use flex for internal layout (dual page)
                alignItems: "center", // Align images/videos within the flex row/column
                justifyContent: "center", // Center images/videos within the flex row/column
                gap: "0",
                margin: "",
                transform: "", // Rotations applied to images/videos directly
                transformOrigin: "",
                // Top/Left will be set dynamically
            });

            // --- Add Basic CSS for Error State and Message ---
            const styleSheet = document.createElement("style");
            styleSheet.textContent = `
      .viewer-error-state {
        background-color: #222; /* Dark background for the placeholder */
        border: 1px dashed #555; /* Dashed border */
        padding: 20px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        object-fit: contain; /* Prevent tiny gif from stretching weirdly */
        image-rendering: pixelated; /* Keep tiny gif sharp if scaled up */
        /* position: relative; /* Needed if error message was child */
      }
      .viewer-error-message {
        /* Position it relative to the imgContainer */
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.75);
        color: white;
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 13px;
        font-family: Arial, sans-serif;
        z-index: 10; /* Ensure it's above the image */
        text-align: center;
        max-width: 90%;
        word-break: break-word; /* Important for long URLs */
        box-sizing: border-box;
        pointer-events: all; /* Allow clicking links */
      }
      .viewer-error-message a {
         color: #9cf; /* Lighter blue for links */
         text-decoration: underline;
      }
    `;
            // Prepend to head to allow user styles potentially override later
            document.head.insertBefore(styleSheet, document.head.firstChild);


            // --- Create Image Elements ---
            this.imgDisplay = document.createElement("img");
            this.imgDisplay.id = 'imgDisplay';
            Object.assign(this.imgDisplay.style, {
                // transition: "transform 0.3s", // Apply transition dynamically if needed
                transformOrigin: "center",
                margin: "0",
                padding: "0",
                display: "none", // Initially hidden, shown based on media type
                maxWidth: "none",
                maxHeight: "none",
                width: "auto",
                height: "auto",
                // Transform (rotation) set dynamically
            });

            this.imgDisplay2 = document.createElement("img");
            this.imgDisplay2.id = 'imgDisplay2';
            Object.assign(this.imgDisplay2.style, {
                // transition: "transform 0.3s",
                transformOrigin: "center",
                margin: "0",
                padding: "0",
                display: "none", // Initially hidden
                maxWidth: "none",
                maxHeight: "none",
                width: "auto",
                height: "auto",
                // Transform (rotation) set dynamically
            });

            // --- Create Video Elements ---
            // Helper function to add hover controls to video elements
            const addVideoHoverControls = (videoElement) => {
                // Initially hide controls
                videoElement.controls = false;

                // Show controls on mouse enter
                videoElement.addEventListener('mouseenter', () => {
                    // Only show controls if the video element is currently displayed
                    if (videoElement.style.display === 'block') {
                        videoElement.controls = true;
                    }
                });

                // Hide controls on mouse leave
                videoElement.addEventListener('mouseleave', () => {
                    videoElement.controls = false;
                });
            };

            this.videoDisplay = document.createElement("video");
            this.videoDisplay.id = 'videoDisplay';
            this.videoDisplay.playsInline = true; // Important for mobile & some desktop contexts
            this.videoDisplay.preload = "metadata"; // Load dimensions without full video
            this.videoDisplay.muted = false;
            this.videoDisplay.loop = this.loopEnabled; // Set initial loop state
            Object.assign(this.videoDisplay.style, {
                // No transition on video transform by default
                transformOrigin: "center",
                margin: "0",
                padding: "0",
                display: "none", // Initially hidden, shown based on media type
                maxWidth: "none", // Allow explicit sizing
                maxHeight: "none",
                width: "auto",
                height: "auto",
                // Transform (rotation) set dynamically, potentially disabled for video
            });
            addVideoHoverControls(this.videoDisplay);

            this.videoDisplay2 = document.createElement("video");
            this.videoDisplay2.id = 'videoDisplay2';
            this.videoDisplay2.playsInline = true;
            this.videoDisplay2.preload = "metadata";
            this.videoDisplay2.muted = false;
            this.videoDisplay2.loop = this.loopEnabled; // Set initial loop state
            Object.assign(this.videoDisplay2.style, {
                // No transition on video transform by default
                transformOrigin: "center",
                margin: "0",
                padding: "0",
                display: "none", // Initially hidden
                maxWidth: "none",
                maxHeight: "none",
                width: "auto",
                height: "auto",
                // Transform (rotation) set dynamically
            });
            addVideoHoverControls(this.videoDisplay2);


            this.gridParent = document.createElement('div');
            Object.assign(this.gridParent.style, {
                position: "fixed",
                top: "0",
                left: "0",
                width: "100vw",
                height: "100vh",
                backgroundColor: "rgba(0, 0, 0, 1)",
                display: "none",
                zIndex: "99999",
                cursor: "default",
                overflow: "auto",
                // display: "none", // Already set
            });

            // Create container for buttons
            this.buttonContainer = document.createElement('div');
            Object.assign(this.buttonContainer.style, {
                position: 'fixed',
                top: '10px',
                right: '20px',
                display: 'flex',
                gap: '8px',
                zIndex: '10000', // Ensure buttons are above media container
                transition: 'opacity 0.3s ease',
            });

            this._initializeToolbarButtons();
            this.parent.appendChild(this.buttonContainer);
            this._updateToolbarButtons();


            if (this.config.viewerLabels !== 'disabled') {
                this.pageNumberLabel = document.createElement('span');
                Object.assign(this.pageNumberLabel.style, {
                    position: 'fixed',
                    bottom: '10px',
                    right: '20px',
                    backgroundColor: `rgba(0, 0, 0, ${this.UI_TRANSPARENCY})`,
                    color: 'white',
                    padding: '6px',
                    paddingTop: '4px',
                    fontSize: '18px',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    zIndex: '10000',
                    pointerEvents: 'none',
                    transition: 'opacity 0.3s ease',
                });

                if (this.config.viewerLabels === 'proximity') {
                    this.pageNumberLabel.style.opacity = '0';
                }

                this.parent.appendChild(this.pageNumberLabel);
            }

            // Append images AND videos to container, container to parent
            // Order might matter for flex layout if items have different dimensions before scaling
            this.imgContainer.appendChild(this.imgDisplay);
            this.imgContainer.appendChild(this.videoDisplay); // Append video counterpart
            this.imgContainer.appendChild(this.imgDisplay2);
            this.imgContainer.appendChild(this.videoDisplay2); // Append video counterpart
            this.imgContainerContainer.appendChild(this.imgContainer);
            this.parent.appendChild(this.imgContainerContainer);
            document.body.appendChild(this.parent);
            // Note: gridParent is appended separately when grid view is toggled.
        }

        _initializeToolbarButtons() {
            // Defines all toolbar buttons and their actions.
            this.buttonDefinitions = [
                {
                    prop: 'exitButton',
                    text: '⤬',
                    onClick: () => this.closeViewer(false),
                    altText: 'Exit viewer (Esc)',
                    offsetY: -2
                },
                {
                    prop: 'prevButton',
                    text: '←',
                    onClick: () => this.navigateBack(),
                    altText: 'Previous Page (Left Arrow)',
                    offsetY: 0
                },
                {
                    prop: 'nextButton',
                    text: '→',
                    onClick: () => this.navigateForward(),
                    altText: 'Next Page (Right Arrow)',
                    offsetY: 0
                },
                {
                    prop: 'rotateLeftButton',
                    text: '↺',
                    onClick: () => this.rotateImage(-90),
                    altText: 'Rotate Left (L)',
                    offsetY: -2
                },
                {
                    prop: 'rotateRightButton',
                    text: '↻',
                    onClick: () => this.rotateImage(90),
                    altText: 'Rotate Right (R)',
                    offsetY: -2
                },
                {
                    prop: 'zoomOutButton',
                    text: '-',
                    onClick: () => { this.userChangedZoom = true; this.zoom(-1); },
                    altText: 'Zoom Out (-)',
                    offsetY: 0
                },
                {
                    prop: 'zoomInButton',
                    text: '+',
                    onClick: () => { this.userChangedZoom = true; this.zoom(1); },
                    altText: 'Zoom In (+)',
                    offsetY: 0
                },
                {
                    prop: 'galleryViewButton',
                    text: '▦',
                    onClick: () => this.toggleGridView(),
                    altText: 'Toggle Gallery View (Backspace)',
                    offsetY: -1
                },
                {
                    prop: 'dualPageButton',
                    text: '◫',
                    onClick: () => this.toggleDualPageMode(),
                    altText: 'Toggle Dual Page Mode (Shift+D)',
                    offsetY: -1
                },
                {
                    prop: 'fullscreenButton',
                    text: '⛶',
                    onClick: () => this.toggleFullscreen(),
                    altText: 'Toggle Fullscreen (F)',
                    offsetY: -1
                },
                {
                    prop: 'downloadButton',
                    text: '⤓',
                    onClick: () => this.downloadCurrentImage(),
                    altText: 'Download Original Image (Shift+S)',
                    offsetY: 0
                },
                {
                    prop: 'findGalleriesButton',
                    text: '∈',
                    onClick: () => this.showGalleriesWithCurrentImage(),
                    altText: 'Find other galleries with this image (Shift+F)',
                    offsetY: -1
                },
                {
                    prop: 'gotoPageButton',
                    text: '⌕',
                    onClick: () => showGotoPageInput(),
                    altText: 'Goto Page (G)',
                    offsetY: -1,
                    offsetX: 1,
                },
                {
                    prop: 'chaptersButton',
                    text: '☰',
                    onClick: () => { this.toggleChapterSidebar(); },
                    altText: "Toggle Chapters (c)",
                    offsetY: -1,
                    condition: () => typeof chapterList !== 'undefined' && chapterList?.length,
                },
                {
                    prop: 'settingsButton',
                    text: '⚙',
                    onClick: () => {
                        if (this.config.showingUI()) {
                            this.config.closeUI();
                        } else {
                            this.config.showUI();
                        }
                    },
                    altText: "Edit Preferences (p)",
                    offsetY: -1,
                    offsetX: 1
                },
                {
                    prop: 'helpButton',
                    text: '?',
                    onClick: () => { this.toggleHelpOverlay(); },
                    altText: "Show Help (h)",
                    offsetY: 0
                }
            ];
        }

        _updateToolbarButtons() {
            this.buttonDefinitions.forEach(def => {
                if (def.condition === undefined || def.condition()) {
                    this[def.prop] = this._createButton(def.text, def.onClick, def.altText, def.offsetY, def.offsetX);
                }
            });

            const mode = this.config.helpAndSettingsButtons;

            if (mode === 'disabled') {
                this.buttonContainer.style.display = 'none';
                return;
            }

            this.buttonContainer.style.display = 'flex';

            if (mode === 'always') {
                this.buttonContainer.style.opacity = '1';
                this.buttonContainer.style.pointerEvents = 'auto';
            } else if (mode === 'proximity') {
                // Set initial state for proximity; mousemove handler will take over
                this.buttonContainer.style.opacity = '0';
                this.buttonContainer.style.pointerEvents = 'none';
            }

            // Clear container
            while (this.buttonContainer.firstChild) {
                this.buttonContainer.removeChild(this.buttonContainer.firstChild);
            }

            const buttonOrder = [
                { config: 'showHelpButton', button: this.helpButton },
                { config: 'showSettingsButton', button: this.settingsButton },
                { config: 'showChaptersButton', button: this.chaptersButton },
                { config: 'showGalleryViewButton', button: this.galleryViewButton },
                { config: 'showDualPageButton', button: this.dualPageButton },
                { config: 'showDownloadButton', button: this.downloadButton },
                { config: 'showFindGalleriesButton', button: this.findGalleriesButton },
                { config: 'showGotoPageButton', button: this.gotoPageButton },

                { config: 'showRotateButtons', button: this.rotateLeftButton },
                { config: 'showRotateButtons', button: this.rotateRightButton },
                { config: 'showZoomButtons', button: this.zoomOutButton },
                { config: 'showZoomButtons', button: this.zoomInButton },
                { config: 'showNavButtons', button: this.prevButton },
                { config: 'showNavButtons', button: this.nextButton },

                { config: 'showFullscreenButton', button: this.fullscreenButton },
                { config: 'showExitButton', button: this.exitButton },
            ];

            buttonOrder.forEach(item => {
                if (this.config[item.config] && item.button) {
                    this.buttonContainer.appendChild(item.button);
                }
            });
        }

        _initializeEventListeners() {
            this.parent.addEventListener("mousemove", (e) => {
                this._handleToolbarProximity(e);
                this._handlePageLabelProximity(e);
            });

            window.addEventListener("resize", () => {
                if (this.isActive()) this.updateTransforms();
            });
            document.addEventListener("fullscreenchange", () => {
                if (this.useFullscreen && !isFullscreen() && this.isActive()) {
                    this.closeViewer(this.config.exitToViewerPage);
                }
            });

            this._onSaveUnsubscribe = this.config.onSaveClick(() => this._handleConfigSave());
        }

        _handleToolbarProximity(e) {
            if (this.config.helpAndSettingsButtons !== 'proximity' || !this.isActive()) {
                return;
            }

            const proximityThreshold = 220; // pixels from the top
            if (e.clientY < proximityThreshold) {
                this.buttonContainer.style.opacity = '1';
                this.buttonContainer.style.pointerEvents = 'auto';
            } else {
                this.buttonContainer.style.opacity = '0';
                this.buttonContainer.style.pointerEvents = 'none';
            }
        }

        _handlePageLabelProximity(e) {
            if (this.config.viewerLabels !== 'proximity' || !this.isActive() || !this.pageNumberLabel) {
                return;
            }

            const verticalProximity = 220; // pixels from the bottom edge
            const horizontalProximity = this.pageNumberLabel.offsetWidth + 220;

            if (e.clientX > window.innerWidth - horizontalProximity && e.clientY > window.innerHeight - verticalProximity) {
                this.pageNumberLabel.style.opacity = '1';
            } else {
                this.pageNumberLabel.style.opacity = '0';
            }
        }

        // Applies new config values
        // Currently does not fully update the UI
        _handleConfigSave() {
            this.fitMode = this.config.fitMode;
            this.pinSidebar = this.config.pinSidebar;
            this.useFullscreen = this.config.useFullscreen;
            this.rightToLeftMode = this.config.openInRightToLeftMode;
            this.dualPageMode = this.config.openInDualPageMode;
            this.dualLayout = this.config.dualLayout;
            this.autoplayEnabled = this.config.videoConfig.autoplay;
            this.loopEnabled = this.config.videoConfig.loop;
            this.currentZoom = 1;

            this._updateToolbarButtons();

            // Handle page number label update
            if (this.pageNumberLabel) {
                this.pageNumberLabel.remove();
                this.pageNumberLabel = null;
            }
            if (this.config.viewerLabels !== 'disabled') {
                this.pageNumberLabel = document.createElement('span');
                Object.assign(this.pageNumberLabel.style, {
                    position: 'fixed',
                    bottom: '10px',
                    right: '20px',
                    backgroundColor: `rgba(0, 0, 0, ${this.UI_TRANSPARENCY})`,
                    color: 'white',
                    padding: '6px',
                    paddingTop: '4px',
                    fontSize: '18px',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    zIndex: '10000',
                    pointerEvents: 'none',
                    transition: 'opacity 0.3s ease',
                });
                if (this.config.viewerLabels === 'proximity') {
                    this.pageNumberLabel.style.opacity = '0';
                }
                this.parent.appendChild(this.pageNumberLabel);
            }

            if (!this.config.enableSidebar && this.sidebarIsActive()) {
                this.sidebarHideInstant();
            }

            if (this.isActive()) {
                this.loadAndShowIndex(this.currentIndex);
            }
        }

        _createButton(text, onClick, altText = "", offsetY = 0, offsetX = 0) {
            const button = document.createElement('button');
            button.title = altText || text; // Fallback to button text if no altText provided
            Object.assign(button.style, {
                width: this.config.buttonSize + 'px',
                height: this.config.buttonSize + 'px',
                borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.2)',
                background: `rgba(0,0,0,${this.UI_TRANSPARENCY})`,
                color: 'white',
                cursor: 'pointer',
                fontSize: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
            });

            // Create a span for the text content
            const textSpan = document.createElement('span');
            textSpan.textContent = text;
            textSpan.style.display = 'block';
            if (offsetX !== 0) {
                textSpan.style.transform += `translateX(${offsetX}px) `;
            }
            if (offsetY !== 0) {
                textSpan.style.transform += `translateY(${offsetY}px)`;
            }
            button.appendChild(textSpan);

            button.addEventListener('click', onClick);

            // Add hover feedback
            button.addEventListener('mouseenter', () => {
                button.style.background = 'rgba(255, 255, 255, 0.9)';
                button.style.color = 'black';
            });
            button.addEventListener('mouseleave', () => {
                button.style.background = `rgba(0,0,0,${this.UI_TRANSPARENCY})`;
                button.style.color = 'white';
            });

            // Add button to tracked buttons array
            if (!this._trackedButtons) {
                this._trackedButtons = [];
            }
            this._trackedButtons.push(button);

            return button;
        }

        _addClickAwayEventListener(element, activeCheckFunc, onClickAway, removeOnClickAway = true) {
            const clickAwayHandler = (e) => {
                if (activeCheckFunc() && !element.contains(e.target)) {
                    const isTrackedButton = this._trackedButtons?.some(button =>
                        button.contains(e.target)
                    );
                    if (!isTrackedButton) {
                        onClickAway();
                        if (removeOnClickAway) {
                            document.removeEventListener('click', clickAwayHandler);
                        }
                    }
                }
            };
            document.addEventListener('click', clickAwayHandler);

            // Return cleanup function
            return () => {
                document.removeEventListener('click', clickAwayHandler);
            };
        }

        isHelpOverlayVisible() {
            return this.helpOverlay.style.display === 'flex';
        }

        toggleHelpOverlay() {
            const isVisible = this.isHelpOverlayVisible();
            this.helpOverlay.style.display = isVisible ? 'none' : 'flex';

            if (!isVisible) {
                // Add click away listener when showing
                this._helpOverlayClickAwayCleanup = this._addClickAwayEventListener(
                    this.helpBox,
                    () => this.isHelpOverlayVisible(),
                    () => this.toggleHelpOverlay()
                );
            } else if (this._helpOverlayClickAwayCleanup) {
                this._helpOverlayClickAwayCleanup();
                this._helpOverlayClickAwayCleanup = null;
            }
        }

        _initializeHelpOverlay() {
            // Create overlay element with styles
            this.helpOverlay = document.createElement("div");
            this.helpOverlay.id = 'HelpOverlay';
            Object.assign(this.helpOverlay.style, {
                position: "fixed",
                top: "0px", // Use strings for CSS values
                left: "0px",
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                display: "none", // Initially hidden
                alignItems: "center",
                justifyContent: "center",
                zIndex: "2147483647", // Max z-index is usually fine
                padding: "14px",
                boxSizing: "border-box"
            });

            // Create help box element - This is now a Flex Container
            this.helpBox = document.createElement("div");
            Object.assign(this.helpBox.style, {
                backgroundColor: "rgb(34, 34, 34)", // Use rgb() format or hex #222
                color: "rgb(241, 241, 241)", // Use rgb() format or hex #f1f1f1
                borderRadius: "8px",
                // Padding moved to inner elements or adjusted later if needed
                // padding: "12px", // Remove outer padding if header/content manage their own
                maxWidth: "600px",
                width: "100%",
                maxHeight: "100%", // Constrains the overall box size
                // overflowY: "auto", // REMOVE - Scrolling handled by inner div
                boxShadow: "0 6px 12px rgba(0, 0, 0, 0.5)",
                fontFamily: "Arial, sans-serif",
                lineHeight: "1.6",
                fontSize: "13px",
                // position: "relative", // Not strictly needed if not using absolute inside
                display: "flex",    // Use Flexbox
                flexDirection: "column", // Stack children vertically
                overflow: "hidden"   // Hide any potential overflow from children before scroll kicks in
            });

            // --- Create Header Div ---
            const headerDiv = document.createElement("div");
            Object.assign(headerDiv.style, {
                display: "flex",
                justifyContent: "space-between", // Pushes title left, button right
                alignItems: "center",
                padding: "10px 12px", // Vertical and horizontal padding for the header
                borderBottom: "1px solid #444", // Separator line
                flexShrink: "0" // Prevent header from shrinking if content is large
            });

            // Create Title
            const title = document.createElement("strong"); // Use <strong> or h2/h3
            title.textContent = "Shortcuts";
            Object.assign(title.style, {
                fontSize: "1.1em", // Slightly larger than base font
                fontWeight: "bold"
            });

            // Create Close Button (remove position: absolute)
            const closeButton = document.createElement("button");
            closeButton.textContent = "×";
            Object.assign(closeButton.style, {
                // position: "absolute", // REMOVED
                // top: "8px",     // REMOVED
                // right: "8px",     // REMOVED
                background: "transparent",
                border: "none",
                color: "rgb(241, 241, 241)",
                fontSize: "24px",
                cursor: "pointer",
                padding: "0 4px", // Adjust padding slightly if needed
                lineHeight: "1", // Ensure it aligns nicely vertically
                marginLeft: "10px" // Add some space between title and button
            });
            closeButton.addEventListener("click", () => {
                this.toggleHelpOverlay(); // Assuming this function exists to hide the overlay
            });

            // Add title and button to header
            headerDiv.appendChild(title);
            headerDiv.appendChild(closeButton);

            // --- Create Table Wrapper for Scrolling ---
            const tableWrapper = document.createElement("div");
            Object.assign(tableWrapper.style, {
                overflowY: "auto",   // Enable vertical scrolling ONLY for this div
                flexGrow: "1",     // Allow this div to take up remaining vertical space
                minHeight: "0",    // Crucial for flex-grow + overflow to work correctly
                padding: "0 12px 12px 12px" // Add padding around the table (top padding from header)
            });


            const shortcuts = [
                { key: "Esc/Q", action: "Exit viewer (Shift+Q: exit to current page)" },
                { key: "Right/D/./Space", action: "Next Page (Shift+key: skip panning)" },
                { key: "Left/A/,", action: "Previous Page (Shift+key: skip panning)" },
                { key: "Shift+PageDown", action: "Next Chapter" },
                { key: "Shift+PageUp", action: "Previous Chapter" },
                { key: "Home", action: "First Page" },
                { key: "End", action: "Last Page" },
                { key: "+ / =", action: "Zoom In / Increase Grid Size" },
                { key: "- / _", action: "Zoom Out (Min: Fit screen) / Decrease Grid" },
                { key: "R / Ctrl+Right", action: "Rotate all 90°" },
                { key: "L / Ctrl+Left", action: "Rotate all -90°" },
                { key: "S", action: "Toggle sidebar pin" },
                { key: "C", action: "Show/hide chapter list" },
                { key: "G", action: "Go to page (available everywhere)" },
                { key: "Backspace", action: "Show/Hide gallery view" },
                { key: "Shift+D", action: "Toggle dual page mode" },
                { key: "Shift+A", action: "Enable dual page mode or cycle layout" },
                { key: "Shift+R", action: "Toggle right to left mode" },
                { key: "F", action: "Toggle fullscreen" },
                { key: "Delete", action: "Remove image" },
                { key: "Ctrl+C", action: "Copy image url" },
                { key: "Shift+C", action: "Copy image data" },
                { key: "Ctrl+V", action: "Replace image with clipboard data or url" },
                { key: "Shift+S", action: "Save original image" },
                { key: "Shift+F", action: "Find other galleries with this image" },
                { key: "P", action: "Open preferences (available everywhere)" },
                { key: "1", action: "Reset zoom to fit screen" },
                { key: "2", action: "Set 1:1 pixel zoom" },
                { key: "3", action: "Zoom to fill view width" },
                { key: "H or ?", action: "Show/Hide this help overlay" },
            ];

            // Build table inner HTML using a loop
            let rows = "";
            shortcuts.forEach((item, index) => {
                // Remove bottom border from the very last row for cleaner look
                const borderStyle = index === shortcuts.length - 1 ? "" : "border-bottom: 1px solid #333;";
                rows += `<tr style="${borderStyle}">
        <td style="padding: 8px; text-align: right; width: 30%; vertical-align: top; font-weight: bold;"><code>${item.key}</code></td>
        <td style="padding: 8px; text-align: left; vertical-align: top;">${item.action}</td>
      </tr>`;
            });

            // Use innerHTML on a new table element
            const table = document.createElement('table');
            Object.assign(table.style, {
                width: "100%",
                borderCollapse: "collapse"
                // Removed overflow and height styles
            });
            table.innerHTML = `<tbody>${rows}</tbody>`;

            // Add the table to the scrolling wrapper
            tableWrapper.appendChild(table);

            // --- Assemble the helpBox ---
            this.helpBox.appendChild(headerDiv);   // Add fixed header first
            this.helpBox.appendChild(tableWrapper);  // Add scrollable content below

            // Add helpBox to the main overlay
            this.helpOverlay.appendChild(this.helpBox);

            // Append overlay to the parent element (ensure 'this.parent' is defined correctly)
            if (this.parent) {
                this.parent.appendChild(this.helpOverlay);
            } else {
                console.error("Parent element for HelpOverlay not found!");
                // Fallback to body, though might not be ideal depending on context
                document.body.appendChild(this.helpOverlay);
            }

            // Add event listener to close overlay when clicking the background
            this.helpOverlay.addEventListener('click', (e) => {
                if (e.target === this.helpOverlay) { // Only close if backdrop itself is clicked
                    this.toggleHelpOverlay();
                    e.preventDefault();
                }
            });
        }

        _initializeSidebar() {
            this._createSidebarParent();
            this.sidebar = new GridView(new GlobalGalleryProvider(), this.sidebarParent, this.config.sidebarGridConfig, false);

            document.addEventListener('mousemove', async (e) => {
                this._sidebarShowOrHide(e);
            });
        }

        _createSidebarParent() {
            this.sidebarParent = document.createElement('div');
            let posCss = "";

            if (this.config.sidebarPosition === "right") {
                this.sidebarHiddenTransform = "translateX(100%)";
                posCss = `
      top: 0;
      right: 0;
      width: ${this.config.sidebarWidth}px;
      height: 100%;
      overflow-y: auto;
      box-shadow: -2px 0 5px rgba(0,0,0,0.2);
    `;
            } else if (this.config.sidebarPosition === "left") {
                this.sidebarHiddenTransform = "translateX(-100%)";
                posCss = `
      top: 0;
      left: 0;
      width: ${this.config.sidebarWidth}px;
      height: 100%;
      overflow-y: auto;
      box-shadow: 2px 0 5px rgba(0,0,0,0.2);
    `;
            }

            this.sidebarTransition = "transform 0.3s";
            const baseCss = `
    position: fixed;
    background: rgb(24,24,24);
    transform: ${this.sidebarHiddenTransform};
    transition: ${this.sidebarTransition};
    z-index: 999999;
    `;
            // Apply the combined CSS
            this.sidebarParent.style.cssText = baseCss + posCss;

            if (config.sidebarPosition === "top" || config.sidebarPosition === "bottom") {
                this.sidebarVisibleTransform = "translateY(0)";
            } else {
                this.sidebarVisibleTransform = "translateX(0)";
            }

            // Append to parent, not viewerContainer
            this.parent.appendChild(this.sidebarParent);
        }

        sidebarIsActive() {
            return this.sidebarVisible;
        }

        sidebarHideInstant() {
            this.sidebarParent.style.transition = "none";
            this.sidebarParent.style.transform = this.sidebarHiddenTransform;
            this.sidebarVisible = false;
            this.sidebar.stopLoading();
            setTimeout(() => {
                this.sidebarParent.style.transition = this.sidebarTransition;
            }, 0);
        }

        _sidebarShowOrHide(e = null) {
            const sameSideAsChapterSidebar = this.config.sidebarPosition === "left" && this.chapterSidebarIsActive();

            // Only expand sidebar if the viewer is active AND grid view is not shown
            if (!this.config.enableSidebar || !this.isActive() || this.isGridViewActive() || sameSideAsChapterSidebar) {
                // Ensure sidebar is hidden if grid view is shown or sidebar is disabled
                if (this.isGridViewActive() || !this.config.enableSidebar || sameSideAsChapterSidebar) {
                    this.sidebarParent.style.transform = this.sidebarHiddenTransform;
                    this.sidebarVisible = false;
                    this.sidebar.stopLoading();
                }
                return;
            }


            // Determine if the sidebar was hidden based on its transform value.
            const sidebarWasHidden = this.sidebarParent.style.transform === this.sidebarHiddenTransform;
            this.sidebarVisible = false;

            if (e) {
                let nearEdge = false;
                let overSidebar = false;

                if (this.config.sidebarPosition === "left") {
                    overSidebar = e.clientX <= this.config.sidebarWidth && !sidebarWasHidden;
                    nearEdge = e.clientX < 50;
                } else if (this.config.sidebarPosition === "right") {
                    overSidebar = e.clientX >= (window.innerWidth - this.config.sidebarWidth) && !sidebarWasHidden;
                    nearEdge = e.clientX > (window.innerWidth - 50);
                } else if (this.config.sidebarPosition === "top") {
                    overSidebar = e.clientY <= this.config.sidebarWidth && !sidebarWasHidden;
                    nearEdge = e.clientY < 50;
                } else if (this.config.sidebarPosition === "bottom") {
                    overSidebar = e.clientY >= (window.innerHeight - this.config.sidebarWidth) && !sidebarWasHidden;
                    nearEdge = e.clientY > (window.innerHeight - 50);
                }
                this.sidebarVisible = nearEdge || overSidebar;
            }

            // config.pinSidebar can force the sidebar visible.
            this.sidebarVisible |= this.pinSidebar;

            if (this.sidebarVisible) {
                this.sidebarParent.style.transform = this.sidebarVisibleTransform;
                if (!this.sidebar.showCalled) {
                    this.sidebar.showGridView();
                } else {
                    this.sidebar.enableLoading();
                }
                if (sidebarWasHidden) {
                    this.sidebar.scrollToIndex(this.currentIndex, false);
                }
            } else {
                this.sidebarParent.style.transform = this.sidebarHiddenTransform;
                this.sidebar.stopLoading();
            }
        }

        toggleChapterSidebar() {
            if (chapterList !== undefined && chapterList?.length > 0) {
                if (!this.chapterSidebar) {
                    this._createChapterSidebar();
                }

                this.chapterSidebar.toggle();
            }
        }

        _createChapterSidebar() {
            this.chapterSidebar = new ChapterSidebar(chapterList, {
                sidebarWidth: this.config.chapterSidebarWidth,
                currentIndex: this.currentIndex,
                useGridView: this.config.chapterSidebarEnableImages,
                onChapterClick: (index) => {
                    this.loadAndShowIndex(index);
                },
                onNotify: (msg) => {
                    createNotification(msg);
                }
            });
        }

        chapterSidebarIsActive() {
            return this.chapterSidebar && this.chapterSidebar.isActive();
        }

        _chapterSidebarHighlightCurrent() {
            this.chapterSidebar?.setCurrentIndex(this.currentIndex);
        }

        /**
         * Determines the primary and secondary indices to display based on the target index and dual page mode setting.
         * @param {number} targetIndex - The index the user intends to navigate to or view.
         * @returns {{primary: number | null, secondary: number | null}} - The indices to display. Returns null for an index if it's invalid, out of bounds, or marked as 'deleted'.
         */
        _getDualPageIndices(targetIndex) {
            if (!this.dualPageMode || targetIndex < 0 || targetIndex >= thumbs.length) {
                // Handle single page mode, or invalid target index
                const isValid = targetIndex >= 0 && targetIndex < thumbs.length && thumbs[targetIndex] !== 'deleted';
                return { primary: isValid ? targetIndex : null, secondary: null };
            }

            const layout = this.dualLayout;
            let primary = null;
            let secondary = null;
            const lastIndex = thumbs.length - 1;

            // --- Determine potential primary/secondary based on mode ---
            if (layout === 'selected-first') {
                // Always show targetIndex on left, targetIndex+1 on right if possible.
                primary = targetIndex;
                if (targetIndex < lastIndex) {
                    secondary = targetIndex + 1;
                }
            } else if (layout === 'odd-first') {
                // Left page (primary) must have odd page number (index is even)
                if (targetIndex % 2 === 0) { // Target is even (Page is odd) -> Target is primary
                    primary = targetIndex;
                    if (targetIndex < lastIndex) secondary = targetIndex + 1;
                } else { // Target is odd (Page is even) -> Previous index is primary
                    primary = targetIndex - 1;
                    secondary = targetIndex;
                }
            } else if (layout === 'even-first') {
                // Left page (primary) must have even page number (index is odd)
                if (targetIndex % 2 !== 0) { // Target is odd (Page is even) -> Target is primary
                    primary = targetIndex;
                    if (targetIndex < lastIndex) secondary = targetIndex + 1;
                } else { // Target is even (Page is odd) -> Previous index is primary (if possible)
                    if (targetIndex > 0) {
                        primary = targetIndex - 1;
                        secondary = targetIndex;
                    } else { // Target is 0 (Page 1) -> Show only page 1
                        primary = 0;
                        secondary = null;
                    }
                }
            }

            // --- Validate and Clean Up Indices ---
            const isValid = (idx) => idx !== null && idx >= 0 && idx < thumbs.length && thumbs[idx] !== 'deleted';

            if (!isValid(primary)) primary = null;
            if (!isValid(secondary)) secondary = null;

            // If primary became invalid, but secondary is valid, maybe promote secondary?
            // Or maybe the target was invalid to begin with. Let's keep it simple:
            // If the intended primary (based on logic) is invalid, it's null.
            if (primary === null && secondary !== null && this.dualPageMode) {
                // If aiming for dual page, but primary is invalid, show secondary as single?
                // This edge case depends on desired behavior. Showing only secondary might be confusing.
                // Let's return null primary, valid secondary for now. loadAndShowIndex will handle it.
                // console.warn(`_getDualPageIndices: Primary index ${primary} invalid, secondary ${secondary} valid.`);
            }

            // Ensure primary and secondary are not the same
            if (primary === secondary) secondary = null;

            // Interchange the indices in right-to-left mode *before* final promotion.
            if (this.rightToLeftMode) {
                [primary, secondary] = [secondary, primary];
            }

            // Final check: If we ended up with only a secondary index in dual mode, treat as single page secondary.
            // This can happen if the pairing logic results in an invalid primary index (e.g., at the start of a book).
            // It's also critical for RTL mode, where swapping might leave the primary slot empty.
            // Enforce that the primary slot is filled if at least one page is available.
            if (primary === null && secondary !== null) {
                primary = secondary;
                secondary = null;
            }

            return { primary, secondary };
        }

        /**
         * Creates and displays an error message div for a specific slot.
         * Removes any existing error message for that slot first.
         * @param {'primary' | 'secondary'} slot - The slot ('primary' or 'secondary').
         * @param {string} messageHtml - The HTML content for the error message.
         */
        _displayErrorMessage(slot, messageHtml) {
            // 1. Remove any existing error message specifically for this slot
            const existingErrorMsg = this.parent.querySelector(`.viewer-error-message[data-slot="${slot}"]`);
            if (existingErrorMsg) {
                existingErrorMsg.remove();
            }

            // 2. Create the new error message div
            const errorDiv = document.createElement('div');
            errorDiv.className = 'viewer-error-message'; // Apply base class
            errorDiv.setAttribute('data-slot', slot);
            errorDiv.innerHTML = messageHtml;

            // 3. Apply positioning styles based on mode
            if (this.dualPageMode) {
                errorDiv.style.maxWidth = '300px';
                errorDiv.style.transform = 'translateY(-50%)';
                errorDiv.style.left = (slot === 'primary') ? '0' : 'auto';
                errorDiv.style.right = (slot === 'primary') ? 'auto' : '0';
            } else {
                // Non-dual mode: center it
                errorDiv.style.maxWidth = '90%'; // Default max-width
                errorDiv.style.transform = 'translate(-50%, -50%)';
                errorDiv.style.left = '50%';
                errorDiv.style.right = 'auto'; // Important to reset right
            }

            // 4. Append the newly created and styled div
            this.parent.appendChild(errorDiv);
        }

        /**
         * Core display function. Sets sources, handles visibility of img/video elements,
         * waits for media load, and updates transforms. Handles null URLs by displaying an error state.
         * Attempts to load a fallback URL if the primary URL fails and `config.useFallbackImages` is true.
         * @param {object} urlObj - Object with primary and optional secondary URLs and their fallbacks.
         *            e.g., { primary: 'url1', primaryFallback: 'fallback1', secondary: 'url2', secondaryFallback: 'fallback2' }
         *            If urlObj.secondary is undefined, the secondary display is hidden.
         *            If a primary URL (e.g., urlObj.primary) is null, an error state is shown or fallback is attempted.
         * @param {object} isVideoObj - Object indicating if primary/secondary are videos. e.g., { primary: false, secondary: true }
         */
        async _show(urlObj, isVideoObj) {
            if (!this.isActive() && this.parent.style.display !== "block") {
                console.warn("_show called while viewer inactive, aborting.");
                return;
            }

            const mediaSetups = [];
            const ERROR_CLASS = 'viewer-error-state';

            const removeDim = (element) => {
                if (element && element.style.opacity !== '' && parseFloat(element.style.opacity) < 1) {
                    element.style.transition = 'none';
                    element.style.opacity = 1;
                    requestAnimationFrame(() => {
                        if (element.style.opacity === '1') {
                            element.style.removeProperty('opacity');
                            element.style.removeProperty('transition');
                        }
                    });
                } else if (element) {
                    element.style.removeProperty('opacity');
                    element.style.removeProperty('transition');
                }
            };

            // Helper to attempt loading a single URL (either primary or fallback)
            const attemptLoadMediaInternal = async (urlToLoad, isVideo, imgElement, videoElement, slotName, attemptType /* 'initial' or 'fallback' */) => {
                console.log(`_show: Attempting to load ${attemptType} URL for ${slotName}: ${fmtUrl(urlToLoad)}`);
                if (urlToLoad === null) { // Should not happen if called correctly, but safety.
                    return Promise.reject(new Error(`URL for ${slotName} (${attemptType}) is null.`));
                }

                let loadPromise;
                if (isVideo) {
                    imgElement.style.display = "none";
                    if (imgElement.src) imgElement.removeAttribute('src');
                    videoElement.referrerPolicy = "no-referrer";
                    this._revokeBlobUrl(videoElement);
                    if (videoElement.currentSrc !== urlToLoad) videoElement.src = urlToLoad;
                    videoElement.style.display = "block";
                    loadPromise = waitForMediaLoad(videoElement)
                        .catch(async (initialError) => {
                            const mediaErrorCode = videoElement.error?.code;
                            // This 'useFetchFallback' is for GM_xmlhttpRequest for videos, separate from image fallback.
                            if ((mediaErrorCode === 2 || mediaErrorCode === 4) && this.config.useFetchFallback) {
                                console.log(`Direct video load failed (Code: ${mediaErrorCode}). Attempting GM_xmlhttpRequest fallback for ${slotName} ${attemptType} URL: ${urlToLoad}`);
                                try {
                                    const fetchResult = await this.getCachedMediaBlob(urlToLoad);
                                    const blobUrl = fetchResult.blobUrl;
                                    this._revokeBlobUrl(videoElement);
                                    videoElement._currentBlobUrl = blobUrl;
                                    videoElement.src = blobUrl;
                                    return waitForMediaLoad(videoElement);
                                } catch (fetchError) {
                                    console.error(`GM_xmlhttpRequest fallback failed for ${slotName} ${attemptType} URL (${urlToLoad}):`, fetchError);
                                    throw initialError; // Propagate original error if GM_XHR fallback fails
                                }
                            }
                            throw initialError; // Propagate original error if not eligible for GM_XHR fallback
                        });
                } else { // Handle Image
                    videoElement.style.display = "none";
                    if (videoElement.src) videoElement.removeAttribute('src');
                    imgElement.referrerPolicy = "no-referrer";
                    if (imgElement.src !== urlToLoad) imgElement.src = urlToLoad;
                    imgElement.style.display = "block";
                    loadPromise = waitForMediaLoad(imgElement);
                }
                return loadPromise;
            };

            // --- Helper to manage element visibility and src, now with fallback logic ---
            const setupMediaElement = (imgElement, videoElement, initialAttemptUrl, fallbackAttemptUrl, isVideo, isPrimary) => {
                const slot = isPrimary ? 'primary' : 'secondary';

                const existingErrorMsg = this.parent.querySelector(`.viewer-error-message[data-slot="${slot}"]`);
                if (existingErrorMsg) existingErrorMsg.remove();
                imgElement.classList.remove(ERROR_CLASS);
                imgElement.style.backgroundColor = ''; imgElement.style.border = '';
                if (!videoElement.paused) { videoElement.loop = false; videoElement.pause(); videoElement.currentTime = 0; }

                let loadSequencePromise = (() => {
                    if (initialAttemptUrl === null) {
                        if (this.config.useFallbackImages && fallbackAttemptUrl) {
                            // console.log(`Initial URL for ${slot} is null. Attempting fallback: ${fallbackAttemptUrl}`);
                            return attemptLoadMediaInternal(fallbackAttemptUrl, isVideo, imgElement, videoElement, slot, 'fallback (due to null initial)')
                                .catch(errorFromFallback => {
                                    throw { type: 'load_failure', primaryError: new Error('Initial URL was null.'), fallbackError: errorFromFallback, initialUrl: null, fallbackUrl: fallbackAttemptUrl };
                                });
                        } else {
                            // No fallback or fallback not viable for an initially null URL
                            // console.log(`Initial URL for ${slot} is null, and no fallback specified or usable.`);
                            return Promise.reject({ type: 'explicit_null', url: null });
                        }
                    }
                    // Initial URL is not null, attempt to load it
                    return attemptLoadMediaInternal(initialAttemptUrl, isVideo, imgElement, videoElement, slot, 'initial')
                        .catch(errorFromPrimary => {
                            if (this.config.useFallbackImages && fallbackAttemptUrl && fallbackAttemptUrl !== initialAttemptUrl) {
                                console.warn(`Media load for ${slot} (${initialAttemptUrl}) failed. Attempting fallback: ${fallbackAttemptUrl}`);
                                return attemptLoadMediaInternal(fallbackAttemptUrl, isVideo, imgElement, videoElement, slot, 'fallback')
                                    .catch(errorFromFallback => {
                                        throw { type: 'load_failure', primaryError: errorFromPrimary, fallbackError: errorFromFallback, initialUrl: initialAttemptUrl, fallbackUrl: fallbackAttemptUrl };
                                    });
                            }
                            // No fallback configured, or fallback URL is same/invalid
                            throw { type: 'load_failure', primaryError: errorFromPrimary, initialUrl: initialAttemptUrl, fallbackUrl: null };
                        });
                })();


                const loadCompletionPromise = loadSequencePromise
                    .then(result => ({
                        status: 'fulfilled',
                        value: result,
                        setup: { imgElement, videoElement, isPrimary, initialUrl: initialAttemptUrl, fallbackUrl: fallbackAttemptUrl }
                    }))
                    .catch(errorInfo => ({
                        status: 'rejected',
                        reason: errorInfo, // Contains type, errors, urls
                        setup: { imgElement, videoElement, isPrimary, initialUrl: initialAttemptUrl, fallbackUrl: fallbackAttemptUrl }
                    }))
                    .finally(() => {
                        removeDim(imgElement);
                        removeDim(videoElement);
                    });

                // isErrorState for originalLoadPromise is now less relevant as completionPromise handles the outcome.
                // The key is how 'reason' is structured in case of rejection.
                return { originalLoadPromise: loadSequencePromise, loadCompletionPromise, isErrorState: false /* Deprecate this direct flag */, imgElement, videoElement, isPrimary, url: initialAttemptUrl };
            };

            // --- Setup Primary Media ---
            mediaSetups.push(setupMediaElement(this.imgDisplay, this.videoDisplay, urlObj.primary, urlObj.primaryFallback, isVideoObj.primary, true));

            // --- Setup Secondary Media ---
            const shouldDisplaySecondary = urlObj.secondary !== undefined;
            if (shouldDisplaySecondary) {
                mediaSetups.push(setupMediaElement(this.imgDisplay2, this.videoDisplay2, urlObj.secondary, urlObj.secondaryFallback, isVideoObj.secondary, false));
            } else {
                this.imgDisplay2.style.display = "none";
                this.imgDisplay2.classList.remove(ERROR_CLASS);
                if (this.imgDisplay2.src) this.imgDisplay2.removeAttribute('src');
                this.videoDisplay2.style.display = "none";
                if (!this.videoDisplay2.paused) { this.videoDisplay2.pause(); this.videoDisplay2.currentTime = 0; }
                if (this.videoDisplay2.src) this.videoDisplay2.removeAttribute('src');
                const existingSecondaryErrorMsg = this.parent.querySelector('.viewer-error-message[data-slot="secondary"]');
                if (existingSecondaryErrorMsg) existingSecondaryErrorMsg.remove();
            }

            const completionPromises = mediaSetups.map(setup => setup.loadCompletionPromise);

            try {
                const loadTimeout = 20000;
                const settledResults = await Promise.race([
                    Promise.all(completionPromises),
                    new Promise((_, reject) => setTimeout(() => reject(new Error('Media load process timeout')), loadTimeout))
                ]);

                if (Array.isArray(settledResults)) {
                    settledResults.forEach((result) => {
                        const { status, reason, setup } = result;
                        const { imgElement, videoElement, isPrimary } = setup; // initialUrl/fallbackUrl from setup can be used if needed
                        const slot = isPrimary ? 'primary' : 'secondary';

                        if (status === 'rejected') {
                            const errorDetails = reason; // This is our structured error object

                            videoElement.style.display = "none";
                            if (videoElement.src) videoElement.removeAttribute('src');
                            imgElement.style.display = "block";
                            imgElement.classList.add(ERROR_CLASS);

                            let messageHtml;
                            if (errorDetails.type === 'explicit_null') {
                                if (imgElement.src) imgElement.removeAttribute('src');
                                messageHtml = "Image not available";
                                console.warn(`_show: Explicit null URL for ${slot}, no viable fallback was found or used. URL was: ${errorDetails.url}`);
                            } else if (errorDetails.type === 'load_failure') {
                                const attemptedInitialUrl = errorDetails.initialUrl;
                                const attemptedFallbackUrl = errorDetails.fallbackUrl;

                                const displayInitial = typeof attemptedInitialUrl === 'string' ? attemptedInitialUrl : (attemptedInitialUrl === null ? '[Initial URL was null]' : '[Unknown Initial URL]');
                                const safeInitial = typeof attemptedInitialUrl === 'string' ? attemptedInitialUrl.replace(/"/g, '"').replace(/'/g, "'") : '#';

                                if (errorDetails.fallbackError && attemptedFallbackUrl) {
                                    console.error(`_show: Media load failed for ${slot} (tried initial: ${attemptedInitialUrl}, then fallback: ${attemptedFallbackUrl}):`, errorDetails.primaryError, errorDetails.fallbackError);
                                    const displayFallback = typeof attemptedFallbackUrl === 'string' ? attemptedFallbackUrl : '[Unknown Fallback URL]';
                                    const safeFallback = typeof attemptedFallbackUrl === 'string' ? attemptedFallbackUrl.replace(/"/g, '"').replace(/'/g, "'") : '#';
                                    messageHtml = `Failed to load: <a href="${safeInitial}" target="_blank" rel="noopener noreferrer">${displayInitial}</a>` +
                                        `<br>and fallback: <a href="${safeFallback}" target="_blank" rel="noopener noreferrer">${displayFallback}</a>`;
                                } else {
                                    console.error(`_show: Media load failed for ${slot} (tried initial: ${attemptedInitialUrl}, no fallback attempted or fallback failed silently/wasn't applicable):`, errorDetails.primaryError);
                                    messageHtml = `Failed to load: <a href="${safeInitial}" target="_blank" rel="noopener noreferrer">${displayInitial}</a>`;
                                }
                            } else {
                                console.error(`_show: Unknown error structure in _show for ${slot}:`, errorDetails);
                                messageHtml = "An unexpected error occurred loading media.";
                            }
                            this._displayErrorMessage(slot, messageHtml);
                        } else if (status === 'fulfilled') {
                            if (this.autoplayEnabled && videoElement.style.display === 'block' && videoElement.paused) {
                                videoElement.play().catch(e => console.warn(`Autoplay ${slot} failed:`, e));
                            }
                        }
                    });
                } else {
                    console.error("Media load process timed out.");
                    createNotification("Media timed out loading");
                    mediaSetups.forEach(({ imgElement, videoElement }) => {
                        removeDim(imgElement);
                        removeDim(videoElement);
                    });
                }
                this.updateTransforms();
            } catch (error) {
                console.error("Error during media loading phase (_show):", error);
                createNotification("Error loading media");
                mediaSetups.forEach(({ imgElement, videoElement }) => {
                    removeDim(imgElement);
                    removeDim(videoElement);
                });
                this.updateTransforms();
            } finally {
                clearTimeout(this._dimTimeout);
                this.parent.style.cursor = "default";
            }
        }

        _ensureViewerActive() {
            if (!this.isActive()) {
                console.log("Activating viewer in loadAndShowIndex");
                this.hasEnteredFullscreenOnce = false; // Reset flag when activating
                this.lastScrollPosition = { x: window.scrollX, y: window.scrollY };
                lockPageScroll();
                this.parent.style.display = "block";

                // Initial fullscreen check on activation
                if (this.useFullscreen && !isFullscreen()) {
                    this.enterFullscreen();
                } else if (!this.useFullscreen && isFullscreen()) {
                    this.exitFullscreen();
                }
                // Ensure sidebar state is correct on activation
                if (this.pinSidebar) {
                    this._sidebarShowOrHide(); // Make sure pinned sidebar shows
                } else {
                    this.sidebarHideInstant(); // Ensure non-pinned sidebar is hidden initially
                }
            }
        }

        // Validates index, handles 'deleted', sets up cancellation, pauses existing video
        _prepareLoadOperation(index) {
            // --- Pause Currently Playing Videos ---
            // Do this before validating the new index or aborting previous loads,
            // to ensure the currently visible video stops.
            if (this.videoDisplay.style.display === 'block' && !this.videoDisplay.paused) {
                // console.log("Pausing primary video before navigation.");
                this.videoDisplay.currentTime = 0;
                this.videoDisplay.pause();
            }
            if (this.videoDisplay2.style.display === 'block' && !this.videoDisplay2.paused) {
                // console.log("Pausing secondary video before navigation.");
                this.videoDisplay2.currentTime = 0;
                this.videoDisplay2.pause();
            }

            // --- Validate target index ---
            if (index === null || index < 0 || index >= thumbs.length) { // Added null check
                console.log(`Image index ${index} is out of range [0, ${thumbs.length - 1}]`);
                // Adjust for dual mode start or return null if truly invalid
                if (index === -1 && this.dualPageMode) index = 0;
                else return null;
            }
            // Handle deleted target index
            if (thumbs[index] === 'deleted') {
                console.log(`Image index ${index} is marked as deleted. Trying next available.`);
                let nextAvailable = index + 1;
                while (nextAvailable < thumbs.length && thumbs[nextAvailable] === 'deleted') {
                    nextAvailable++;
                }
                if (nextAvailable < thumbs.length) {
                    index = nextAvailable;
                } else {
                    let prevAvailable = index - 1;
                    while (prevAvailable >= 0 && thumbs[prevAvailable] === 'deleted') {
                        prevAvailable--;
                    }
                    if (prevAvailable >= 0) {
                        index = prevAvailable;
                    } else {
                        console.error("Cannot load index: Target and adjacent indices are deleted or out of bounds.");
                        createNotification("Cannot load image: Not available.");
                        return null; // No valid index found
                    }
                }
            }

            // --- Cancellation of Previous Load ---
            if (this.currentAbortController) {
                console.log("Aborting previous load operation.");
                this.currentAbortController.abort();
                // *** ADDED *** Also revoke blob URLs from the operation being cancelled
                this._revokeBlobUrl(this.videoDisplay);
                this._revokeBlobUrl(this.videoDisplay2);
            }
            const controller = new AbortController();
            this.currentAbortController = controller;
            const loadToken = Symbol();
            this.currentLoadToken = loadToken;

            this.isNavigating = true;
            const navigatedBackwards = this.backwardNavigationCount > 0; // Store direction before updating index
            this.currentIndex = index; // Update the main current index state

            return { controller, loadToken, targetIndex: index, navigatedBackwards };
        }

        // Determines display indices and updates label
        _getDisplayIndicesAndLabel(targetIndex) {
            const { primary: displayPrimaryIndex, secondary: displaySecondaryIndex } = this._getDualPageIndices(targetIndex);

            if (this.config.viewerLabels !== 'disabled' && this.pageNumberLabel) {
                if (displayPrimaryIndex !== null) {
                    let pageText = `${displayPrimaryIndex + 1}`;
                    if (displaySecondaryIndex !== null) {
                        pageText += `-${displaySecondaryIndex + 1}`;
                    }
                    pageText += ` / ${thumbs.length}`
                    this.pageNumberLabel.textContent = pageText;
                } else {
                    this.pageNumberLabel.textContent = "?";
                }
            }
            return { displayPrimaryIndex, displaySecondaryIndex };
        }

        // Sets up the dimming timeout
        _initiateDimming(targetIndex, loadToken, wasActive, gridViewWasActive, displayPrimaryIndex, displaySecondaryIndex) {
            const delayDimming = wasActive && !gridViewWasActive;
            const dimDelay = delayDimming ? 10 : 0; // Short delay only if viewer was already active
            const dimOpacity = 0.4;
            const dimTransition = delayDimming ? 'opacity 0.15s ease-in' : 'none'; // Apply transition only if delaying

            clearTimeout(this._dimTimeout); // Clear any previous dimming timeout

            this._dimTimeout = setTimeout(() => {
                // Check if the load operation associated with this timeout is still the current one
                if (this.currentIndex === targetIndex && this.currentLoadToken === loadToken) {
                    // Set cursor for the parent element
                    this.parent.style.cursor = "progress";

                    // Helper to apply dimming styles
                    const applyDim = (element) => {
                        if (element && element.style.display !== 'none') { // Only dim visible elements
                            element.style.transition = dimTransition;
                            element.style.opacity = dimOpacity;
                        }
                    };

                    // Dim primary slot (image or video) if it exists
                    if (displayPrimaryIndex !== null) {
                        applyDim(this.imgDisplay);
                        applyDim(this.videoDisplay);
                    }

                    // Dim secondary slot (image or video) if it exists and we are in dual page mode
                    if (this.dualPageMode && displaySecondaryIndex !== null) {
                        applyDim(this.imgDisplay2);
                        applyDim(this.videoDisplay2);
                    }
                }
            }, dimDelay);

            return this._dimTimeout; // Return the timeout ID
        }

        // Fetches required image URLs
        async _fetchRequiredUrls(indices, signal, loadToken) {
            const loadPromises = [];
            const uniqueIndices = [...new Set(indices.filter(idx => idx !== null))]; // Get unique, non-null indices

            for (const index of uniqueIndices) {
                // Check cancellation before initiating each load request
                if (this.currentLoadToken !== loadToken || signal.aborted) throw new DOMException('Aborted', 'AbortError');
                loadPromises.push(loadImageUrlAtIndex(index, signal));
            }

            // Wait for all load attempts to settle (resolve or reject)
            // Note: loadImageUrlAtIndex handles its internal errors and should resolve (e.g., with null)
            // rather than rejecting the Promise.all promise unless an unexpected error occurs.
            await Promise.all(loadPromises);

            // Post-await validation (check if token/signal still valid after waiting)
            if (this.currentLoadToken !== loadToken || signal.aborted) {
                throw new DOMException('Aborted', 'AbortError'); // Throw abort error to be caught
            }

            // We no longer validate URLs here. _displayLoadedImages will call _getMediaUrlAtIndex
            // which returns the result (URL or null) of the completed loadImageUrlAtIndex call.
        }

        // Adjusts scroll position before showing images
        _updateScrollPosition(navigatedBackwards) {
            if (this.currentZoom > 1) {
                let targetScrollY = navigatedBackwards ? this.parent.scrollHeight : 0;
                // TODO: Refine scroll anchoring if needed for specific dual modes.
                this.parent.scrollTo({ top: targetScrollY });
            }
        }

        // Displays the loaded images using _show*Page methods
        async _displayLoadedImages(targetIndex, displayPrimaryIndex, displaySecondaryIndex, signal, loadToken) {
            if (this.currentLoadToken !== loadToken || signal.aborted) {
                throw new DOMException('Aborted', 'AbortError');
            }

            // Fetch URL objects (which now include url and fallbackUrl)
            const primaryMediaInfo = this._getMediaUrlAtIndex(displayPrimaryIndex);
            const secondaryMediaInfo = this._getMediaUrlAtIndex(displaySecondaryIndex);

            const primaryItem = (displayPrimaryIndex !== null && displayPrimaryIndex >= 0 && displayPrimaryIndex < thumbs.length) ? thumbs[displayPrimaryIndex] : null;
            const secondaryItem = (displaySecondaryIndex !== null && displaySecondaryIndex >= 0 && displaySecondaryIndex < thumbs.length) ? thumbs[displaySecondaryIndex] : null;

            const primaryIsVideo = primaryItem?.isVideo ?? false;
            const secondaryIsVideo = secondaryItem?.isVideo ?? false;

            // Log failures if primary URL is null but item was expected
            if (displayPrimaryIndex !== null && primaryMediaInfo.url === null && primaryItem && primaryItem !== 'deleted') {
                console.warn(`Primary media (index ${displayPrimaryIndex}) has no valid URL to attempt.`);
            }

            const showSecondary = this.dualPageMode && displaySecondaryIndex !== null && secondaryItem !== 'deleted';
            if (showSecondary && displaySecondaryIndex !== null && secondaryMediaInfo.url === null && secondaryItem && secondaryItem !== 'deleted') {
                console.warn(`Secondary media (index ${displaySecondaryIndex}) has no valid URL to attempt for dual page mode.`);
            }

            await this._show(
                {
                    primary: primaryMediaInfo.url,
                    primaryFallback: primaryMediaInfo.fallbackUrl,
                    secondary: showSecondary ? secondaryMediaInfo.url : undefined,
                    secondaryFallback: showSecondary ? secondaryMediaInfo.fallbackUrl : undefined
                },
                {
                    primary: primaryIsVideo,
                    secondary: showSecondary ? secondaryIsVideo : false
                }
            );

            if (this.currentLoadToken !== loadToken || signal.aborted) {
                throw new DOMException('Aborted', 'AbortError');
            }
        }
        // Performs tasks after images are displayed
        _performPostDisplayTasks(targetIndex, displayPrimaryIndex, displaySecondaryIndex, navigatedBackwards, signal, loadToken) {
            if (this.currentLoadToken !== loadToken || signal.aborted) return; // Check before proceeding

            if (this.currentLoadToken === loadToken) {
                this.parent.style.cursor = "default"; // Reset cursor only if still current
            }

            // Update sidebar scroll position to the *target* index
            if (this.sidebarVisible) {
                this.sidebar.scrollToIndex(targetIndex, false);
            }

            // Set scroll position after layout update
            this._updateScrollPosition(navigatedBackwards);

            this._chapterSidebarHighlightCurrent();

            // Trigger preloading for neighbours
            if (displayPrimaryIndex !== null && this.config.preloadCount > 0) {
                const preloadCount = this.config.preloadCount;
                const preloadStartIndex = displaySecondaryIndex !== null ? displaySecondaryIndex + 1 : displayPrimaryIndex + 1;
                const preloadEndIndex = displayPrimaryIndex - 1;
                const useOriginal = this.config.useOriginalImages;
                const indicesToPreload = [];

                if (!navigatedBackwards) {
                    // Preload forward range
                    const forwardEnd = Math.min(preloadStartIndex + preloadCount - 1, thumbs.length - 1);
                    for (let i = preloadStartIndex; i <= forwardEnd; i++) {
                        indicesToPreload.push(i);
                    }
                    // Append the previous index (opposite direction)
                    indicesToPreload.push(preloadEndIndex);
                } else {
                    // Preload backward range
                    const backwardStart = Math.max(preloadEndIndex - preloadCount + 1, 0);
                    for (let i = preloadEndIndex; i >= backwardStart; i--) {
                        indicesToPreload.push(i);
                    }
                    // Append the next index (opposite direction)
                    indicesToPreload.push(preloadStartIndex);
                }
                preloadIndices(indicesToPreload, useOriginal);

            }
        }

        // Handles errors during the load process
        _handleLoadError(error, index, loadToken) {
            if (error.name === 'AbortError') {
                console.log(`Load operation for index ${index} aborted.`);
                // Don't show notification for aborts
            } else {
                console.error(`Error during loadAndShowIndex for index ${index}:`, error);
                createNotification(`Failed to load image ${index + 1}.`);
            }
            // Reset UI state only if this token is still current
            if (this.currentLoadToken === loadToken) {
                clearTimeout(this._dimTimeout); // Ensure dimming stops on error
                this.parent.style.cursor = "default";

                // Helper function to remove dimming effect from an element
                const removeDim = (element) => {
                    if (element && element.style.opacity !== '' && element.style.opacity !== '1') {
                        element.style.transition = 'none';
                        element.style.opacity = 1;
                        requestAnimationFrame(() => {
                            element.style.removeProperty('opacity');
                            element.style.removeProperty('transition');
                        });
                    } else if (element) {
                        element.style.removeProperty('opacity');
                        element.style.removeProperty('transition');
                    }
                };

                // Remove dimming from all elements explicitly on error/abort
                removeDim(this.imgDisplay);
                removeDim(this.videoDisplay);
                removeDim(this.imgDisplay2);
                removeDim(this.videoDisplay2);
                // *** ADDED *** Ensure final revoke just in case something failed silently
                this._revokeBlobUrl(this.videoDisplay);
                this._revokeBlobUrl(this.videoDisplay2);
                // *** ADDED *** Also revoke potential blob URLs on error/abort
                this._revokeBlobUrl(this.videoDisplay);
                this._revokeBlobUrl(this.videoDisplay2);
            }
        }

        // Finalizes the load attempt, resetting state
        _finalizeLoadAttempt(loadToken, dimTimeoutId) {
            // Helper function to remove dimming effect from an element
            const removeDim = (element) => {
                if (element && element.style.opacity !== '' && element.style.opacity !== '1') {
                    element.style.transition = 'none';
                    element.style.opacity = 1;
                    requestAnimationFrame(() => {
                        element.style.removeProperty('opacity');
                        element.style.removeProperty('transition');
                    });
                } else if (element) {
                    element.style.removeProperty('opacity');
                    element.style.removeProperty('transition');
                }
            };

            // Only reset state if this token is still the current one
            if (this.currentLoadToken === loadToken) {
                clearTimeout(dimTimeoutId); // Clear timeout regardless of success/fail
                this.parent.style.cursor = "default";
                this.currentAbortController = null; // Clear controller only if this was the last op
                this.isNavigating = false;

                // Final safety check: Ensure no dimming is left
                removeDim(this.imgDisplay);
                removeDim(this.videoDisplay);
                removeDim(this.imgDisplay2);
                removeDim(this.videoDisplay2);

            } else {
                // If a newer operation is already running, don't clear its state,
                // but maybe ensure dimming is cleared for elements associated with *this* old token?
                // The current approach handles this because removeDim is now called individually
                // when promises settle in _show. This block primarily handles the state variables.
            }
        }

        /**
        * Gets the appropriate media URL (image or video) for a given index,
        * considering configuration like useOriginalImages and useFallbackImages.
        * @param {number} index - The index of the thumb item.
        * @returns {{url: string | null, fallbackUrl: string | null}} - An object containing the primary URL to attempt (`url`)
        *                                and a potential fallback URL (`fallbackUrl`).
        *                                Both can be null if no suitable URL is found.
        */
        _getMediaUrlAtIndex(index) {
            if (index === null || index < 0 || index >= thumbs.length) {
                return { url: null, fallbackUrl: null };
            }
            const item = thumbs[index];
            if (!item || item === 'deleted') {
                return { url: null, fallbackUrl: null };
            }

            let primaryUrl = null;
            let fallbackUrl = null;

            if (item.isVideo) {
                primaryUrl = item.fullImageUrl || null;
                // No image fallback logic for videos in this implementation
            } else { // Is Image
                const originalImg = item.originalImageUrl;
                const fullImg = item.fullImageUrl;

                // Determine primary URL based on config.useOriginalImages and caching status
                if (this.config.useOriginalImages) {
                    if (originalImg && (item.originalImageIsCached || !fullImg)) {
                        // Prefer original if it exists AND (is cached OR fullImg is missing)
                        primaryUrl = originalImg;
                    } else if (fullImg) {
                        primaryUrl = fullImg;
                    } else { // Fallback to originalImg if fullImg was also missing
                        primaryUrl = originalImg || null;
                    }
                } else { // Not using original images
                    if (fullImg) {
                        primaryUrl = fullImg;
                    } else { // Fallback to originalImg if fullImg is missing
                        primaryUrl = originalImg || null;
                    }
                }

                // Determine fallback URL if config.useFallbackImages is true
                if (this.config.useFallbackImages) {
                    if (primaryUrl === originalImg && fullImg && fullImg !== originalImg) {
                        fallbackUrl = fullImg;
                    } else if (primaryUrl === fullImg && originalImg && originalImg !== fullImg) {
                        fallbackUrl = originalImg;
                    }
                    // If primaryUrl itself is null, but one of the image URLs exists,
                    // and wasn't chosen as primary (e.g., original not cached, full missing),
                    // it could potentially be a fallback if primaryUrl ended up null.
                    // However, the current logic aims to set primaryUrl if *any* URL is available.
                    // If primaryUrl is null, it means both originalImg and fullImg were likely null.
                }
            }
            return { url: primaryUrl, fallbackUrl: fallbackUrl };
        }

        /**
         * Retrieves media, utilizing an in-memory Blob cache with an LRU eviction strategy.
         * Creates a blob: URL for the retrieved Blob (either cached or newly fetched).
         * Handles concurrent requests for the same URL.
         * IMPORTANT: The caller is responsible for revoking the returned blobUrl.
         *
         * @param {string} mediaUrl The URL of the media to retrieve.
         * @returns {Promise<{ blobUrl: string, type: string | null }>} Resolves with blob URL and type.
         */
        async getCachedMediaBlob(mediaUrl) {
            // 1. Check for pending fetch
            if (this.pendingFetches.has(mediaUrl)) {
                console.log(`CACHE: Request for ${mediaUrl} already pending. Returning existing promise.`);
                return this.pendingFetches.get(mediaUrl);
            }

            // 2. Check cache
            if (this.blobCache.has(mediaUrl)) {
                const entry = this.blobCache.get(mediaUrl);
                console.log(`CACHE: Hit for ${mediaUrl} (Size: ${entry.size / 1024 / 1024} MB)`);

                // Update LRU: Move entry to the end by deleting and re-inserting
                this.blobCache.delete(mediaUrl);
                entry.lastAccessed = Date.now(); // Update timestamp (optional but good practice)
                this.blobCache.set(mediaUrl, entry);

                // Create a NEW blob URL for the cached blob
                const newBlobUrl = URL.createObjectURL(entry.blob);
                return Promise.resolve({ blobUrl: newBlobUrl, type: entry.type });
            }

            // 3. Not in cache, not pending - Initiate fetch
            console.log(`CACHE: Miss for ${mediaUrl}. Fetching...`);
            const fetchPromise = (async () => { // IIAFE to handle async/await inside promise constructor pattern
                try {
                    // Fetch the raw blob and type
                    const { blob, type } = await this._fetchMediaBlobAndType(mediaUrl);

                    // Check if blob exceeds total cache limit *before* eviction logic
                    const blobSize = blob.size;
                    const limitBytes = this.cacheLimitMB * 1024 * 1024;
                    if (blobSize > limitBytes) {
                        console.warn(`CACHE: Fetched blob size (${(blobSize / 1024 / 1024).toFixed(2)} MB) exceeds total cache limit (${this.cacheLimitMB} MB). Cannot cache ${mediaUrl}.`);
                        // Still create URL for immediate use, but don't cache
                        const blobUrl = URL.createObjectURL(blob);
                        return { blobUrl, type }; // Return directly without caching
                    }

                    // Ensure enough space in cache, evicting LRU if necessary
                    this._ensureCacheLimit(blobSize);

                    // Add the new blob to the cache
                    const newEntry = {
                        blob: blob,
                        size: blobSize,
                        type: type,
                        lastAccessed: Date.now()
                    };
                    this.blobCache.set(mediaUrl, newEntry);
                    this.currentCacheSize += blobSize;
                    console.log(`CACHE: Stored ${mediaUrl}. Cache size: ${(this.currentCacheSize / 1024 / 1024).toFixed(2)} MB / ${this.cacheLimitMB} MB`);

                    // Create blob URL for the newly cached blob
                    const blobUrl = URL.createObjectURL(blob);
                    return { blobUrl, type };

                } catch (error) {
                    console.error(`CACHE: Failed to fetch/process ${mediaUrl}:`, error);
                    throw error; // Re-throw error to be caught by the caller
                } finally {
                    // Remove from pending fetches once resolved or rejected
                    this.pendingFetches.delete(mediaUrl);
                }
            })(); // End IIAFE

            // Store the promise for concurrent requests
            this.pendingFetches.set(mediaUrl, fetchPromise);
            return fetchPromise;
        }

        /**
         * Internal function to fetch media using GM_xmlhttpRequest.
         * Resolves with the raw Blob object and its Content-Type.
         * NOTE: This does NOT create a blob: URL.
         *
         * @param {string} mediaUrl The URL of the media to fetch.
         * @returns {Promise<{ blob: Blob, type: string | null }>} A Promise resolving with the Blob and type.
         * @private
         */
        async _fetchMediaBlobAndType(mediaUrl) {
            // No config check here; the wrapper decides whether to call this.
            return new Promise((resolve, reject) => {
                console.log(`CACHE: Initiating GM fetch for: ${mediaUrl}`);
                GM_xmlhttpRequest({
                    method: "GET",
                    url: mediaUrl,
                    responseType: "blob",
                    onload: (response) => {
                        if (response.status >= 200 && response.status < 300) {
                            try {
                                const mediaBlob = response.response;
                                if (!mediaBlob || mediaBlob.size === 0) {
                                    reject(new Error(`CACHE: Received empty blob for ${mediaUrl}`));
                                    return;
                                }

                                let contentType = null;
                                if (response.responseHeaders) {
                                    const match = response.responseHeaders.match(/^content-type:\s*(.*)$/im);
                                    if (match && match[1]) {
                                        contentType = match[1].trim().split(';')[0];
                                    }
                                }
                                // Resolve with Blob and type
                                resolve({ blob: mediaBlob, type: contentType });
                            } catch (e) {
                                reject(new Error(`CACHE: Error processing response for ${mediaUrl}: ${e.message}`));
                            }
                        } else {
                            reject(new Error(`CACHE: Failed to fetch ${mediaUrl}: Server responded with status ${response.status} ${response.statusText}`));
                        }
                    },
                    onerror: (response) => {
                        reject(new Error(`CACHE: Network error fetching ${mediaUrl}: ${response.error || 'Unknown error'}`));
                    },
                    ontimeout: () => {
                        reject(new Error(`CACHE: Timeout fetching ${mediaUrl}`));
                    },
                    onabort: () => { // Handle abort if the outer operation is cancelled
                        reject(new Error(`CACHE: Request aborted for ${mediaUrl}`));
                    }
                    // We might need to pass the AbortSignal here if GM_xmlhttpRequest supports it
                    // signal: signal // If supported
                });
            });
        }

        /**
         * Ensures the cache size doesn't exceed the limit after adding an item of proposedSize.
         * Evicts items using an LRU strategy
         *
         * @param {number} proposedNewItemSize The size in bytes of the item about to be added.
         * @private
         */
        _ensureCacheLimit(proposedNewItemSize) {
            const limitBytes = this.cacheLimitMB * 1024 * 1024;

            // Calculate potential size if item is added
            let potentialSize = this.currentCacheSize + proposedNewItemSize;

            // Evict LRU items (first items in Map iteration) while over limit
            const cacheIterator = this.blobCache.keys(); // Get iterator for keys
            while (potentialSize > limitBytes && this.blobCache.size > 0) {
                const keyToRemove = cacheIterator.next().value; // Get the first (oldest) key
                if (!keyToRemove) break; // Should not happen if size > 0, but safety check

                const evicted = this._evictCacheEntry(keyToRemove);
                if (evicted) {
                    potentialSize = this.currentCacheSize + proposedNewItemSize; // Recalculate potential size
                } else {
                    console.error(`CACHE: Inconsistency during eviction for key ${keyToRemove}`);
                    break;
                }
            }

            // Optional: Final check if the new item *alone* is too big (already handled in getCachedMediaBlob)
            // if (proposedNewItemSize > limitBytes && this.blobCache.size === 0) {
            //  console.warn(`CACHE: New item size (${proposedNewItemSize} bytes) exceeds limit (${limitBytes} bytes) even after clearing cache.`);
            // }
        }

        /**
         * Removes a specific entry from the blob cache and updates the total cache size.
         * Logs the eviction.
         *
         * @param {string} mediaUrl The URL (key) of the cache entry to remove.
         * @returns {boolean} True if an entry was found and removed, false otherwise.
         * @private
         */
        _evictCacheEntry(mediaUrl) {
            if (this.blobCache.has(mediaUrl)) {
                const entryToRemove = this.blobCache.get(mediaUrl);
                if (entryToRemove) {
                    this.currentCacheSize -= entryToRemove.size;
                    // Ensure size doesn't go negative due to float precision or errors
                    if (this.currentCacheSize < 0) this.currentCacheSize = 0;
                    this.blobCache.delete(mediaUrl);
                    console.log(`CACHE: Evicted/Removed ${mediaUrl} (Size: ${(entryToRemove.size / 1024 / 1024).toFixed(2)} MB). New size: ${(this.currentCacheSize / 1024 / 1024).toFixed(2)} MB`);
                    return true;
                } else {
                    // Should not happen if .has() was true, but handle defensively
                    console.error(`CACHE: Inconsistency - found key ${mediaUrl} with .has() but .get() failed.`);
                    this.blobCache.delete(mediaUrl); // Attempt deletion anyway
                    return false;
                }
            } else {
                // console.warn(`CACHE: Attempted to evict non-existent key ${mediaUrl}`); // Optional warning
                return false;
            }
        }

    }// ----------------------------------------------------------------------------------------------
    // imageViewerInputHandler.js
    // ----------------------------------------------------------------------------------------------

    class ViewerInputHandler {
        constructor(imageViewerInstance, config) {
            this.viewer = imageViewerInstance;
            this.config = config;

            // State for smooth scroll acceleration
            this._lastSmoothScrollTime = 0;
            this._lastSmoothScrollDirection = 0;
            this._smoothScrollMultiplier = 1.0;

            // State for wheel-to-navigate logic
            this._lastWheelTime = 0;
            this._isContinuousScrollNavigating = false;
            this.WHEEL_NAV_DEBOUNCE_MS = 180;

            // Constants
            this.SMOOTH_ACCEL_RESET_TIMEOUT_MS = 100;
            this.SMOOTH_ACCEL_FACTOR = 1.15;
            this.SMOOTH_ACCEL_MAX_MULTIPLIER = 2.5;
            this.BASE_PAGE_SCROLL_FACTOR = 0.8;
            this.BASE_SCROLL_STEP = 250;

            // drag to zoom stuff
            this._dragging = false;
            this._lastX = 0;
            this._accumDX = 0;

            this._DRAG_PIXELS_PER_SCALE = 100;
            this._MAX_SCALE_PER_MOVE = 0.25;

            this._CLICK_THRESHOLD_PIXELS = 5;

            this._initializeListeners();
        }

        _initializeListeners() {
            // Bind handlers to maintain 'this' context and allow removal
            this._boundHandlePasteEvent = this._handlePasteEvent.bind(this);
            this._boundHandleCopyEvent = this._handleCopyEvent.bind(this);
            this._boundHandleKeyDown = this._handleKeyDown.bind(this);
            this._boundHandleWheel = this._handleWheel.bind(this);

            document.addEventListener("paste", this._boundHandlePasteEvent);
            document.addEventListener("copy", this._boundHandleCopyEvent);
            this.viewer.imgContainerContainer.addEventListener("wheel", this._boundHandleWheel, { passive: false });
            document.addEventListener("keydown", this._boundHandleKeyDown);

            this._boundPointerDown = this._onPointerDown.bind(this);
            this._boundPointerMove = this._onPointerMove.bind(this);
            this._boundPointerUp = this._onPointerUp.bind(this);

            this.viewer.imgContainerContainer.addEventListener('pointerdown', this._boundPointerDown);
            // 'pointermove' and 'pointerup' should be on a higher-level element to not lose the event
            window.addEventListener('pointermove', this._boundPointerMove);
            window.addEventListener('pointerup', this._boundPointerUp);
            window.addEventListener('pointercancel', this._boundPointerUp);
        }

        _onPointerDown(e) {
            // most of these safety checks aren't strictly needed, since the event is added to imgContainerContainer.
            if (!this.viewer.isActive() || this.viewer.isGridViewActive() || this.config.showingUI() || gotoPageInputIsVisible() ||
                this.viewer.chapterSidebarIsActive() ||
                this.viewer.isHelpOverlayVisible() || this.mediaExtractorUi?.isShown() ||
                e.target.closest('button, a, input, select, textarea')) {
                return;
            }

            if (e.button !== undefined && e.button !== 0) return;

            // We start an interaction, but we need to know if it's for zooming or just a potential click.
            // We'll use this flag in the pointerMove handler.
            this._isImageDrag = this.viewer.imgContainer.contains(e.target);

            e.preventDefault?.();

            this._dragging = true;

            // Store initial position for click detection.
            this._startX = e.clientX;
            this._startY = e.clientY;

            // Store positions for drag calculation (only used if _isImageDrag is true).
            this._lastX = e.clientX;
            this._lastY = e.clientY;
            this._accumProjection = 0;

            // Capture the pointer on the element where the drag-zoom is allowed.
            if (this._isImageDrag) {
                try { this.viewer.imgContainer.setPointerCapture?.(e.pointerId); } catch (_) { }
            }

            this._prevUserSelect = document.body.style.userSelect;
            document.body.style.userSelect = 'none';
        }

        _onPointerMove(e) {
            // Only perform zoom-drag if the interaction started on the image container.
            if (!this._dragging || !this._isImageDrag || !this.config.enableDragZoom) return;

            e.preventDefault?.();

            const dx = e.clientX - this._lastX;
            const dy = e.clientY - this._lastY;
            this._lastX = e.clientX;
            this._lastY = e.clientY;

            const projection = (dx + dy) / Math.SQRT2;
            this._accumProjection += projection;

            let rawScale = this._accumProjection / this._DRAG_PIXELS_PER_SCALE;
            if (Math.abs(rawScale) < 0.001) return;

            const sign = Math.sign(rawScale);
            let scale = Math.min(Math.abs(rawScale), this._MAX_SCALE_PER_MOVE) * sign;

            const direction = scale >= 0 ? 1 : -1;
            this.viewer.userChangedZoom = true;

            this.viewer.zoom(direction, 1.0 + Math.abs(scale), true, true);

            const consumedProjection = sign * Math.min(Math.abs(rawScale), this._MAX_SCALE_PER_MOVE) * this._DRAG_PIXELS_PER_SCALE;
            this._accumProjection -= consumedProjection;
        }

        _onPointerUp(e) {
            if (!this._dragging) {
                return;
            }

            const movedDistance = Math.hypot(e.clientX - this._startX, e.clientY - this._startY);

            // If it was a click (not a drag), and the target wasn't an interactive element
            if (movedDistance < this._CLICK_THRESHOLD_PIXELS) {
                this._onViewerClick(e);
            }

            // If a drag was initiated on the image, release its pointer capture.
            if (this._isImageDrag) {
                try { this.viewer.imgContainer.releasePointerCapture?.(e.pointerId); } catch (_) { }
            }

            // Reset state for the next interaction.
            this._dragging = false;
            this._isImageDrag = false;
            this._accumProjection = 0;

            if (this._prevUserSelect !== undefined) {
                document.body.style.userSelect = this._prevUserSelect;
                this._prevUserSelect = undefined;
            }
        }

        _onViewerClick(e) {
            if (this.config.clickToNextPage) {
                const rect = this.viewer.parent.getBoundingClientRect();
                const midpoint = rect.left + rect.width / 2;

                if (e.clientX > midpoint) {
                    this.viewer.navigateForward();
                } else {
                    this.viewer.navigateBack();
                }
            }
        }

        /**
         * Performs a smooth scroll, increasing the distance if called
         * repeatedly in the same direction within a short timeframe.
         * @param {Element} element The element to scroll.
         * @param {object} options Original scroll options (must include top and behavior: 'smooth').
         */
        smoothScrollWithAcceleration(element, options) {
            if (!element || typeof options?.top !== 'number' || options?.behavior !== 'smooth') {
                console.warn("Invalid arguments for smoothScrollWithAcceleration");
                if (element && options) element.scrollBy(options); // Try fallback
                return;
            }

            const now = Date.now();
            const intendedDeltaY = options.top;
            const currentDirection = Math.sign(intendedDeltaY); // -1 for up, 1 for down

            // --- Reset Check ---
            // Reset multiplier if direction changes or too much time has passed
            if (currentDirection !== this._lastSmoothScrollDirection ||
                (now - this._lastSmoothScrollTime) > this.SMOOTH_ACCEL_RESET_TIMEOUT_MS) {
                this._smoothScrollMultiplier = 1.0;
            }
            // --- Acceleration ---
            else {
                // Increase multiplier if conditions are met (same direction, quick succession)
                this._smoothScrollMultiplier = Math.min(
                    this.SMOOTH_ACCEL_MAX_MULTIPLIER,
                    this._smoothScrollMultiplier * this.SMOOTH_ACCEL_FACTOR
                );
            }

            const finalDeltaY = intendedDeltaY * this._smoothScrollMultiplier;
            element.scrollBy({ top: finalDeltaY, behavior: 'smooth' });

            // Update state for next call
            this._lastSmoothScrollTime = now;
            this._lastSmoothScrollDirection = currentDirection;
        }

        _navigateOrPan(direction, forceNavigate) {
            if (direction === 1) {
                const canScrollDown = this.viewer.currentZoom > 1 && this.viewer.parent.scrollHeight > this.viewer.parent.clientHeight;
                const isAtBottom = this.viewer.parent.scrollTop >= this.viewer.parent.scrollHeight - this.viewer.parent.clientHeight - 5; // Allow 5px tolerance

                if (this.config.panFirst && canScrollDown && !isAtBottom && !forceNavigate) {
                    // Pan down smoothly if panFirst is enabled and not at bottom
                    this.viewer.parent.scrollBy({ top: this.config.panStep * this.viewer.currentZoom, behavior: 'smooth' });
                } else {
                    // Otherwise, navigate forward
                    this.viewer.navigateForward();
                }
            } else {
                const canScrollUp = this.viewer.currentZoom > 1 && this.viewer.parent.scrollHeight > this.viewer.parent.clientHeight;
                const isAtTop = this.viewer.parent.scrollTop <= 5;

                if (this.config.panFirst && canScrollUp && !isAtTop && !forceNavigate) {
                    // Pan up smoothly if panFirst is enabled and not at top
                    this.viewer.parent.scrollBy({ top: -this.config.panStep * this.viewer.currentZoom, behavior: 'smooth' });
                } else {
                    // Otherwise, navigate back
                    this.viewer.navigateBack();
                }
            }
        }

        _handleWheel(e) {
            if (!this.viewer.isActive() || this.config.showingUI() || this.viewer.isGridViewActive()) {
                return;
            }

            const now = performance.now();
            const timeSinceLastWheel = now - this._lastWheelTime;
            this._lastWheelTime = now;

            const direction = e.deltaY < 0 ? 1 : -1;

            if (e.ctrlKey) {
                e.preventDefault();
                this.viewer.userChangedZoom = true;
                this.viewer.zoom(direction, 1.07, true, true);
                // const rect = this.viewer.parent.getBoundingClientRect();
                // this._zoomAnchor = {
                //     x: e.clientX - rect.left,
                //     y: e.clientY - rect.top
                // };
                // this.viewer.zoom(direction, 1.07, false, false, this._zoomAnchor);
                return; // Early exit for zoom
            }

            if (this.config.wheelToNextPage) {
                const isAtBottom = this.viewer.parent.scrollTop + 1 >= this.viewer.parent.scrollHeight - this.viewer.parent.clientHeight;
                const isAtTop = this.viewer.parent.scrollTop <= 1;
                const isNewScrollAction = timeSinceLastWheel > this.WHEEL_NAV_DEBOUNCE_MS;

                // Condition for scrolling down to next page
                if (direction === -1 && isAtBottom) {
                    // Navigate if it's either a new deliberate action OR we're already in a continuous navigation scroll.
                    if (isNewScrollAction || this._isContinuousScrollNavigating) {
                        e.preventDefault();
                        this.viewer.navigateForward();
                        this._isContinuousScrollNavigating = true; // Set/maintain the state
                    }
                    // Condition for scrolling up to previous page
                } else if (direction === 1 && isAtTop) {
                    // Symmetrical logic for navigating back
                    if (isNewScrollAction || this._isContinuousScrollNavigating) {
                        e.preventDefault();
                        this.viewer.navigateBack();
                        this._isContinuousScrollNavigating = true; // Set/maintain the state
                    }
                    // If we are not at a boundary or are scrolling away from it, reset the state.
                } else {
                    this._isContinuousScrollNavigating = false;
                }
            }
        }

        _hideCursorUntilMove() {
            // If a listener is already active, remove it to prevent conflicts.
            if (this.mouseMoveListener) {
                document.removeEventListener('mousemove', this.mouseMoveListener);
            }
            // If the style element still exists for some reason, remove it.
            if (this.cursorHidingStyleElement) {
                this.cursorHidingStyleElement.remove();
            }

            // 1. Create a <style> element.
            this.cursorHidingStyleElement = document.createElement('style');
            this.cursorHidingStyleElement.id = 'hide-cursor-style'; // Optional: for easier debugging

            // 2. Define a high-specificity CSS rule to hide the cursor everywhere.
            // The universal selector (*) and !important ensure this rule wins.
            const cssRule = `* { cursor: none !important; }`;

            this.cursorHidingStyleElement.innerHTML = cssRule;

            // 3. Add the <style> element to the document's head.
            document.head.appendChild(this.cursorHidingStyleElement);

            // 4. Define the function to run ONCE when the mouse moves.
            this.mouseMoveListener = () => {
                // The mouse has moved, so remove the injected style element.
                if (this.cursorHidingStyleElement) {
                    this.cursorHidingStyleElement.remove();
                    this.cursorHidingStyleElement = null; // Clean up reference
                }
                this.mouseMoveListener = null; // Clean up reference
            };

            // 5. Listen for the next mouse movement, then automatically clean up.
            document.addEventListener('mousemove', this.mouseMoveListener, { once: true });
        }

        _handleKeyDown(e) {
            if (!this.viewer.isActive() || this.config.showingUI() || this.mediaExtractorUi?.isShown()) {
                return;
            }

            if (e.ctrlKey) {
                if (!this.viewer.isGridViewActive()) {
                    if (e.key === "ArrowRight") {
                        this.viewer.rotateImage(90);
                        return;
                    }
                    if (e.key === "ArrowLeft") {
                        this.viewer.rotateImage(-90);
                        return;
                    }
                }
            }

            if (e.ctrlKey || e.altKey || e.metaKey || e.key === 'Alt') return;

            const targetElement = e.target;
            if (targetElement && (
                targetElement.tagName === 'INPUT' ||
                targetElement.tagName === 'TEXTAREA' ||
                targetElement.isContentEditable
            )) {
                return;
            }

            switch (e.key) {
                case "Escape":
                    if (this.viewer.isHelpOverlayVisible()) {
                        this.viewer.toggleHelpOverlay();
                    } else if (this.config.showingUI()) {
                        this.config.closeUI();
                    } else {
                        this.viewer.closeViewer(this.config.exitToViewerPage ^ e.shiftKey);
                    }
                    break;
                case "Backspace":
                    if (this.viewer.chapterSidebarIsActive()) this.viewer.toggleChapterSidebar();
                    if (this.viewer.sidebarIsActive()) this.viewer.sidebarHideInstant();
                    this.viewer.toggleGridView(true);
                    break;
                case "Home":
                    if (this.viewer.isGridViewActive()) {
                        this.viewer.gridView.scrollToIndex(0, false);
                    } else {
                        this.viewer.loadAndShowIndex(0);
                        this._hideCursorUntilMove();
                    }
                    break;
                case "End":
                    if (this.viewer.isGridViewActive()) {
                        this.viewer.gridView.scrollToIndex(thumbs.length - 1, false);
                    } else {
                        this.viewer.loadAndShowIndex(thumbs.length - 1);
                        this._hideCursorUntilMove();
                    }
                    break;
                case "PageUp":
                    if (e.shiftKey) {
                        if (this.viewer.currentIndex == 0) {
                            createNotification("First page!");
                            break;
                        }
                        if (!chapterList?.length) {
                            createNotification("No chapters available");
                            break;
                        }
                        const prevChapter = chapterList.slice().reverse().find(ch => ch.index < this.viewer.currentIndex);
                        if (prevChapter) {
                            this.viewer.loadAndShowIndex(prevChapter.index);
                            this._hideCursorUntilMove();
                        } else {
                            this.viewer.loadAndShowIndex(0);
                            this._hideCursorUntilMove();
                        }
                    } else if (this.viewer.isGridViewActive()) {
                        this.smoothScrollWithAcceleration(this.viewer.gridView.getContainer(), { top: -this.viewer.gridView.getContainer().clientHeight * this.BASE_PAGE_SCROLL_FACTOR, behavior: 'smooth' });
                        e.preventDefault(); // Prevent default page scroll
                    } else {
                        const canScrollUp = this.viewer.currentZoom > 1 && this.viewer.parent.scrollHeight > this.viewer.parent.clientHeight;
                        const isAtTop = this.viewer.parent.scrollTop <= 5; // 5px tolerance

                        if (canScrollUp && !isAtTop) {
                            this.viewer.parent.scrollTo({ top: 0, behavior: 'smooth' });
                        } else {
                            this.viewer.navigateBack();
                            this._hideCursorUntilMove();
                        }

                        e.preventDefault(); // Prevent default page scroll
                    }
                    break;
                case "PageDown":
                    if (e.shiftKey) {
                        if (this.viewer.currentIndex === thumbs.length - 1) {
                            createNotification("Last page!");
                            break;
                        }
                        if (!chapterList?.length) {
                            createNotification("No chapters available");
                            break;
                        }
                        const nextChapter = chapterList.find(ch => ch.index > this.viewer.currentIndex);
                        if (nextChapter) {
                            this.viewer.loadAndShowIndex(nextChapter.index);
                            this._hideCursorUntilMove();
                        } else {
                            this.viewer.loadAndShowIndex(thumbs.length - 1);
                            this._hideCursorUntilMove();
                        }
                    } else if (this.viewer.isGridViewActive()) {
                        this.smoothScrollWithAcceleration(this.viewer.gridView.getContainer(), { top: this.viewer.gridView.getContainer().clientHeight * this.BASE_PAGE_SCROLL_FACTOR, behavior: 'smooth' });
                        e.preventDefault(); // Prevent default page scroll
                    } else {
                        const canScrollDown = this.viewer.currentZoom > 1 && this.viewer.parent.scrollHeight > this.viewer.parent.clientHeight;
                        const isAtBottom = this.viewer.parent.scrollTop >= this.viewer.parent.scrollHeight - this.viewer.parent.clientHeight - 5; // Allow 5px tolerance

                        if (canScrollDown && !isAtBottom) {
                            this.viewer.parent.scrollTo({ top: this.viewer.parent.scrollHeight, behavior: 'smooth' });
                        } else {
                            this.viewer.navigateForward();
                            this._hideCursorUntilMove();
                        }

                        e.preventDefault(); // Prevent default page scroll
                    }
                    break;
                case "q":
                case "Q":
                    this.viewer.closeViewer(this.config.exitToViewerPage ^ e.shiftKey);
                    break;
                case "d":
                case ".":
                case "ArrowRight":
                case "Space":
                case " ":
                    if (!this.viewer.isGridViewActive()) {
                        e.preventDefault();

                        if (e.shiftKey && e.key === "ArrowRight" && this.viewer.isShowingVideo()) {
                            this.viewer.seekVideo(5)
                            break;
                        }

                        if (this.viewer.rightToLeftMode && this.config.reverseNavigationInRtlMode) {
                            this._navigateOrPan(-1, e.shiftKey);
                            this._hideCursorUntilMove();
                        } else {
                            this._navigateOrPan(1, e.shiftKey);
                            this._hideCursorUntilMove();
                        }
                    }
                    break;
                case "a":
                case ",":
                case "ArrowLeft":
                    if (!this.viewer.isGridViewActive()) {
                        e.preventDefault();

                        if (e.shiftKey && e.key === "ArrowLeft" && this.viewer.isShowingVideo()) {
                            this.viewer.seekVideo(-5);
                            break;
                        }

                        if (this.viewer.rightToLeftMode && this.config.reverseNavigationInRtlMode) {
                            this._navigateOrPan(1, e.shiftKey);
                            this._hideCursorUntilMove();
                        } else {
                            this._navigateOrPan(-1, e.shiftKey);
                            this._hideCursorUntilMove();
                        }
                    }
                    break;
                case "ArrowUp":
                    if (!this.viewer.isGridViewActive() && this.viewer.currentZoom > 1 && this.viewer.parent.scrollTop > 0) {
                        this.smoothScrollWithAcceleration(this.viewer.parent, { top: -this.BASE_SCROLL_STEP, behavior: 'smooth' });
                        e.preventDefault(); // Prevent default page scroll
                    }
                    else if (this.viewer.isGridViewActive()) {
                        this.smoothScrollWithAcceleration(this.viewer.gridView.getContainer(), { top: -this.BASE_SCROLL_STEP, behavior: 'smooth' });
                        e.preventDefault(); // Prevent default page scroll
                    }
                    break;
                case "ArrowDown":
                    if (!this.viewer.isGridViewActive() && this.viewer.currentZoom > 1 && this.viewer.parent.scrollTop < this.viewer.parent.scrollHeight - this.viewer.parent.clientHeight) {
                        this.smoothScrollWithAcceleration(this.viewer.parent, { top: this.BASE_SCROLL_STEP, behavior: 'smooth' });
                        e.preventDefault(); // Prevent default page scroll
                    }
                    else if (this.viewer.isGridViewActive()) {
                        this.smoothScrollWithAcceleration(this.viewer.gridView.getContainer(), { top: this.BASE_SCROLL_STEP, behavior: 'smooth' });
                        e.preventDefault(); // Prevent default page scroll
                    }
                    break;
                case "+":
                case "=": // Often shifted version of +
                    if (!this.viewer.isGridViewActive()) {
                        this.viewer.userChangedZoom = true;
                        this.viewer.zoom(1, 1.1, true, false);
                    } else {
                        this.config.gridViewConfig.numColumns--;
                        this.viewer.gridView.showGridView();
                    }
                    break;
                case "-":
                case "_": // Often shifted version of -
                    if (!this.viewer.isGridViewActive()) {
                        this.viewer.userChangedZoom = true;
                        this.viewer.zoom(-1, 1.1, true, false);
                    } else {
                        this.config.gridViewConfig.numColumns++;
                        this.viewer.gridView.showGridView();
                    }
                    break;
                case "r":
                    if (!this.viewer.isGridViewActive()) {
                        this.viewer.rotateImage(90);
                    }
                    break;
                case "l":
                    if (!this.viewer.isGridViewActive()) {
                        this.viewer.rotateImage(-90);
                    }
                    break;
                case "s":
                    if (!this.viewer.isGridViewActive() && this.config.enableSidebar) {
                        this.viewer.pinSidebar = !this.viewer.pinSidebar;
                        this.viewer._sidebarShowOrHide();
                    }
                    break;
                case "S":
                    this.viewer.downloadCurrentImage();
                    break;
                case "F":
                    this.viewer.showGalleriesWithCurrentImage();
                    break;
                case "D":
                    if (!this.viewer.isGridViewActive()) {
                        this.viewer.toggleDualPageMode();
                    }
                    break;
                case "R":
                    if (!this.viewer.isGridViewActive()) {
                        this.viewer.toggleRightToLeftMode();
                    }
                    break;
                case "A":
                    if (!this.viewer.isGridViewActive()) {
                        this.viewer.enableDualPageModeOrCycleLayout();
                    }
                    break;
                case "f":
                    this.viewer.toggleFullscreen();
                    break;
                case "Delete":
                    if (!this.viewer.isGridViewActive()) {
                        this.viewer.delete(this.viewer.currentIndex);
                        embeddedGridView?.refreshAll();
                    }
                    break;
                case "1": // Reset Zoom (Fit Screen)
                    if (!this.viewer.isGridViewActive()) {
                        this.viewer.userChangedZoom = false;
                        this.viewer.fitMode = "fit-window";
                        this.viewer.currentZoom = 1;
                        this.viewer.updateTransforms();
                    }
                    break;
                case "2": // 1:1 Pixel Zoom
                    if (!this.viewer.isGridViewActive()) {
                        this.viewer.userChangedZoom = false;
                        this.viewer.fitMode = "one-to-one";
                        this.viewer.updateTransforms();
                    }
                    break;
                case "3": // Zoom to Fill Width
                    if (!this.viewer.isGridViewActive()) {
                        this.viewer.userChangedZoom = false;
                        this.viewer.fitMode = "fit-width";
                        this.viewer.updateTransforms();
                    }
                    break;
                case "h":
                case "?": // Show/hide help overlay
                    this.viewer.toggleHelpOverlay();
                    break;
                case "c": // Show/hide chapter sidebar
                    this.viewer.toggleChapterSidebar();
                    break;
                case " ":
                case "Spacebar":
                    this.viewer.toggleVideoPlayback();
                    break;
                case "E":
                    if (!this.mediaExtractorUi) {
                        this.mediaExtractorUi = new MediaExtractorUI();
                    } else if (this.mediaExtractorUi.isShown()) {
                        this.mediaExtractorUi.close();
                        break;
                    }
                    this.mediaExtractorUi.onExtractionComplete((error, results) => {
                        if (error) {
                            return;
                        }

                        if (results?.length) {
                            for (let i = 0; i < results.length; i++) {
                                const result = results[i];
                                const index = i + this.viewer.currentIndex;
                                while (index >= thumbs.length) thumbs.push(null);

                                thumbs[index] = {
                                    fullImageUrl: result.url,
                                    isVideo: result.type === "video",
                                };
                            }

                            this.viewer.loadAndShowIndex(this.viewer.currentIndex);
                            this.viewer.refreshGrids();
                            embeddedGridView?.refreshAll();
                        }

                    });
                    this.mediaExtractorUi.render();
                    break;
                case "N":
                case "I":
                    console.log("Inserting a blank image at index", this.viewer.currentIndex + 1);
                    this._insertBlankImage();
                    break;
                case "C":
                    this._copyCurrentImage();
                    break;
            }
        }

        _insertBlankImage() {
            const item = {
                fullImageUrl: null
            };
            insertAfterIndex(thumbs, this.viewer.currentIndex, item);
            this.viewer.loadAndShowIndex(this.viewer.currentIndex + 1);
        }

        // Add these inside the ViewerInputHandler class or where appropriate

        // Regular expression to match common video file extensions
        _isVideoExtension(filename = '') {
            return /\.(mp4|webm|mov|ogg|avi|mkv)$/i.test(filename);
        }

        // Regular expression to match common image file extensions
        _isImageExtension(filename = '') {
            return /\.(jpe?g|png|gif|webp|svg|bmp|ico)$/i.test(filename);
        }

        // Function to parse MIME type from a Data URL
        _getMimeTypeFromDataUrl(dataUrl = '') {
            const match = dataUrl.match(/^data:([\w\/+-.]+)(?:;.*)?/);
            return match ? match[1].toLowerCase() : null; // e.g., 'image/png' or 'video/mp4'
        }

        /**
         * Tries to insert and load media at the given index.
         * Updates the viewer's state and associated grid views.
         *
         * @param {string} url - The blob:, data:, or http(s): URL to load.
         * @param {number} idx - The index in the thumbs array to update.
         * @param {boolean} isVideo - Whether the URL represents a video.
         * @returns {Promise<boolean>} - True if the media loaded successfully, false otherwise.
         */
        async insertImage(url, idx, isVideo) {
            const thumbItem = thumbs[idx];
            if (!thumbItem || thumbItem === 'deleted') {
                console.warn(`Cannot insert media at index ${idx}, item is invalid.`);
                return false; // Indicate failure
            }

            console.log(`Attempting to insert ${isVideo ? 'video' : 'image'} from URL: ${url.substring(0, 100)}... at index ${idx}`);

            // Update thumb data
            thumbItem.isVideo = isVideo;
            // For pasted content, we assume the pasted URL is both full and original for simplicity
            thumbItem.fullImageUrl = url;
            thumbItem.originalImageUrl = url; // Or null if we want to be strict? Let's keep it simple.
            thumbItem.imageUrlToLoad = null; // Clear any cached URL from loadImageUrlAtIndex
            thumbItem.imageElement = null;   // Clear any cached element

            // Force update in any visible grid views
            this.viewer.sidebar?.forceSetFullImage(idx, url); // Pass URL for immediate update if needed
            this.viewer.gridView?.forceSetFullImage(idx, url);
            embeddedGridView?.forceSetFullImage(idx, url); // Assuming embeddedGridView might exist

            // Reset viewer state before loading the new content
            this.viewer.userChangedZoom = false; // Allow fitMode to apply initially
            this.viewer.currentZoom = 1;
            this.viewer.currentRotation = 0;
            this.viewer.displayedRotation = 0;

            // --- Load and Verify ---
            try {
                document.body.style.cursor = "progress";

                // loadAndShowIndex will attempt to load the media using _show, which uses waitForMediaLoad
                await this.viewer.loadAndShowIndex(idx);

                // After loadAndShowIndex completes, check if the correct element loaded successfully
                const primaryElement = isVideo ? this.viewer.videoDisplay : this.viewer.imgDisplay;

                // Check if the primary display slot is showing the content we just set
                // Note: src might be blob: even if original was http: after fetchImageBlobUrl
                // So, checking dimensions is more reliable than src equality in some cases.
                const isPrimaryVisible = primaryElement.style.display === 'block';
                const hasValidDimensions = isVideo
                    ? primaryElement.videoWidth > 0
                    : primaryElement.naturalWidth > 0;

                // Check if the displayed src corresponds *roughly* to what we tried loading.
                // For data/blob URLs, currentSrc will be the same. For http, it might differ if redirected.
                // This check is less critical than dimensions.
                const srcMatches = primaryElement.currentSrc === url || primaryElement.src === url;

                if (isPrimaryVisible && hasValidDimensions) {
                    console.log(`Successfully loaded and displayed ${isVideo ? 'video' : 'image'} at index ${idx}.`);
                    // Optional: Force another transform update? Usually loadAndShowIndex handles it.
                    // this.viewer.updateTransforms();
                    return true; // Indicate success
                } else {
                    console.warn(`Failed to verify load for ${isVideo ? 'video' : 'image'} at index ${idx}. Visible: ${isPrimaryVisible}, Valid Dims: ${hasValidDimensions}, Src Matches: ${srcMatches}, currentSrc: ${primaryElement.currentSrc.substring(0, 100)}`);
                    return false; // Indicate failure
                }
            } catch (error) {
                console.error(`Error during loadAndShowIndex after paste for index ${idx}:`, error);
                return false; // Indicate failure
            } finally {
                document.body.style.cursor = "default";
            }
        }

        async _handlePasteEvent(e) {
            const targetElement = e.target;
            if (targetElement && (
                targetElement.tagName === 'INPUT' ||
                targetElement.tagName === 'TEXTAREA' ||
                targetElement.isContentEditable
            )) {
                return;
            }

            if (!this.viewer.isActive()) return;
            e.preventDefault();

            const currentIdx = this.viewer.currentIndex;

            if (this.config.pasteBehavior === "insert-new" && (thumbs[currentIdx].fullImageUrl || thumbs[currentIdx].originalImageUrl)) {
                this._insertBlankImage();
            }

            if (!thumbs[currentIdx] || thumbs[currentIdx] === 'deleted') {
                console.warn("Cannot paste as target thumb item is invalid or deleted.");
                createNotification("Cannot paste here");
                return;
            }

            const items = (e.clipboardData || window.clipboardData).items;
            this._processClipboardItems(items);
        }

        async _processClipboardItems(items) {
            const currentIdx = this.viewer.currentIndex;
            let foundMedia = false;
            let potentialTextItem = null;
            console.log(`Paste event detected with ${items.length} items.`);

            // --- Try Pasted Files First (Images or Videos) ---
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                // console.log(`Item ${i}: type = ${item.type}, kind = ${item.kind}`);
                if (item.kind === 'file' && (item.type.startsWith("image/") || item.type.startsWith("video/"))) {
                    const blob = item.getAsFile();
                    if (blob) {
                        const isVideo = blob.type.startsWith("video/");
                        console.log(`Found ${isVideo ? 'video' : 'image'} blob:`, blob);
                        const reader = new FileReader();
                        reader.onload = async (event) => { // Make onload async
                            const pastedDataUrl = event.target.result;
                            console.log(`Pasted ${isVideo ? 'video' : 'image'} data loaded (Data URL).`);
                            const success = await this.insertImage(pastedDataUrl, currentIdx, isVideo);
                            if (success) {
                                console.log(`Pasted ${isVideo ? 'video' : 'image'} data`);
                                foundMedia = true; // Set flag on successful insertion *here*
                            } else {
                                // Notification handled by insertImage/loadAndShowIndex
                            }
                        };
                        reader.onerror = (err) => {
                            console.error("FileReader error:", err);
                            createNotification(`Error reading pasted ${isVideo ? 'video' : 'image'}`);
                        }
                        reader.readAsDataURL(blob);
                        // Don't set foundMedia here, wait for reader.onload confirmation
                        // foundMedia = true; // Removed from here
                        break; // Stop after finding the first file
                    }
                } else if (item.kind === 'string' && item.type === 'text/plain' && !potentialTextItem) {
                    potentialTextItem = item;
                }
            }

            // Await potential file processing before checking text
            // (FileReader is async, but we broke the loop, so this is roughly okay)
            // A better approach might involve Promise.all if multiple files were processed.
            // For now, assuming we only process the first file:

            // --- If No File Found *or file processing failed*, Try Pasted Text (URL) ---
            if (!foundMedia && potentialTextItem) { // Check foundMedia status now
                console.log("No media file found or loaded, checking potential text item...");
                potentialTextItem.getAsString(async (pastedText) => { // Make callback async
                    pastedText = pastedText.trim();
                    if (!pastedText) {
                        console.log("Pasted text is empty.");
                        return;
                    }
                    console.log("Pasted text:", pastedText.substring(0, 100) + (pastedText.length > 100 ? '...' : ''));

                    let success = false;
                    let triedInsert = false;

                    // --- Handle data: URLs ---
                    if (pastedText.startsWith('data:')) {
                        console.log("Pasted text is a data: URL.");
                        triedInsert = true;
                        const mimeType = this._getMimeTypeFromDataUrl(pastedText);
                        if (mimeType) {
                            if (mimeType.startsWith('video/') || mimeType.startsWith('image/')) {
                                const isVideo = mimeType.startsWith('video/');
                                success = await this.insertImage(pastedText, currentIdx, isVideo);
                                if (success) {
                                    console.log(`Pasted ${isVideo ? 'video' : 'image'} from data URL`);
                                }
                            } else {
                                console.log("Pasted data is not an image or video");
                                createNotification("Paste is not image or video");
                            }
                        } else {
                            console.warn("Could not parse MIME type from data: URL.");
                            createNotification("Invalid data URL format");
                        }
                        // --- Handle URLs ---
                    } else if (/^[a-z0-9+.-]+:\/\/[^\s]+$/i.test(pastedText)) {
                        let isVideo = this._isVideoExtension(pastedText);
                        let isImage = this._isImageExtension(pastedText);

                        // If it looks like a URL but has no recognized media extension, assume image
                        if (!isVideo && !isImage) {
                            console.log("Pasted URL has no recognized media extension, fetching type..");
                            const type = await getMediaContentType(pastedText);
                            if (!type) {
                                console.warn("Could not retrieve type, assuming image");
                                isImage = true;
                            }

                            isImage = type.startsWith("image/");
                            isVideo = type.startsWith("video/");

                            if (!isImage && !isVideo) {
                                console.log("Pasted URL does not point to an image or video");
                                createNotification("Paste is not an image or video URL");
                                return;
                            }
                        } else {
                            console.log(`Pasted text looks like a ${isVideo ? 'video' : 'image'} URL.`);
                        }

                        if (isVideo) isImage = false; // Video takes precedence

                        if (isImage || isVideo) {
                            triedInsert = true;
                            // --- Attempt Direct Load ---
                            createNotification("Fetching media..", 30);
                            success = await this.insertImage(pastedText, currentIdx, isVideo);

                            if (success) {
                                console.log(`Pasted ${isVideo ? 'video' : 'image'} from URL`);
                                clearNotification();
                            } else {
                                console.warn(`Direct load failed for URL: ${pastedText}`);
                                // Notification handled internally, but now try cross-origin fetch

                                // --- If Direct Load Failed, Try Cross-Origin Fetch ---
                                const isPotentiallyCrossOrigin = !pastedText.startsWith(window.location.origin);
                                if (isPotentiallyCrossOrigin) {
                                    console.log("Direct load failed, attempting cross-origin fetch...");
                                    try {
                                        document.body.style.cursor = "progress";
                                        // fetchImageBlobUrl returns { blobUrl, type }
                                        const result = await fetchMediaBlobUrl(pastedText);

                                        // Check if we got the expected result object and a blobUrl
                                        if (result && result.blobUrl) {
                                            // Determine media type PRIMARILY from the fetched Content-Type header
                                            let fetchedIsVideo = false;
                                            if (result.type) { // Check if type was successfully extracted
                                                fetchedIsVideo = result.type.startsWith('video/');
                                                console.log(`Cross-origin fetch successful. Actual Type: ${result.type}. Blob URL: ${result.blobUrl.substring(0, 100)}...`);
                                            } else {
                                                // Fallback to guessing from original URL if Content-Type was missing
                                                fetchedIsVideo = isVideo; // Use the 'isVideo' flag guessed before
                                                console.warn(`Cross-origin fetch successful but Content-Type header was missing/unparsable. Falling back to guessed type (${fetchedIsVideo ? 'video' : 'image'}) from original URL.`);
                                            }

                                            // Try inserting the Blob URL using the DETECTED (or guessed) type
                                            success = await this.insertImage(result.blobUrl, currentIdx, fetchedIsVideo);

                                            if (success) {
                                                console.log(`Pasted ${fetchedIsVideo ? 'video' : 'image'} via cross-origin fetch`);
                                            } else {
                                                // Load failed. Notification likely handled by insertImage/loadAndShowIndex.
                                                console.log("Revoking unused/failed blob URL after failed load:", result.blobUrl.substring(0, 100));
                                                URL.revokeObjectURL(result.blobUrl); // Clean up memory
                                            }
                                        } else {
                                            // This case handles if fetchImageBlobUrl resolved without a blobUrl (shouldn't happen with current logic, but good check)
                                            console.error("Cross-origin fetch did not return a blob URL in the result object.");
                                            createNotification("Cross-origin fetch failed (no blob URL)");
                                        }
                                    } catch (error) {
                                        // Handle potential rejections from fetchImageBlobUrl
                                        console.error(`Cross-origin fetch failed for ${pastedText}:`, error);
                                        let errorMsg = "Cross-origin fetch failed";
                                        if (error instanceof Error && error.message) {
                                            errorMsg += `: ${error.message}`;
                                        } else if (typeof error === 'string') {
                                            errorMsg += `: ${error}`;
                                        }
                                        createNotification(errorMsg);
                                        // No blobUrl to revoke if fetchImageBlobUrl rejects
                                    } finally {
                                        document.body.style.cursor = "default";
                                    }
                                } else {
                                    console.log("URL is not cross-origin or direct load failed for other reasons.");
                                }
                                createNotification("Failed to fetch (check logs)");
                            }
                        } else {
                            console.log("Pasted text looks like a URL, but not a recognized media type.");
                            createNotification("URL does not point to known media type");
                        }
                        // --- Handle other text ---
                    } else {
                        console.log("Pasted text is not a data: or URL.");
                        createNotification("Paste does not contain media URL");
                    }

                    // Update foundMedia *after* all attempts for the text item
                    if (success) {
                        foundMedia = true;
                    }
                });
                // Need to wait for getAsString callback if it was called
                // This requires more complex promise handling, or we accept that foundMedia
                // might not be updated immediately if text pasting occurs.
                // Let's simplify: the notification inside getAsString is the primary feedback.

            }

            // Final check after potential async operations (might be slightly delayed)
            // This check is less reliable due to async nature of getAsString
            /*
            if (!foundMedia && !potentialTextItem && items.length > 0) {
                 console.log("No compatible media file or text URL found or loaded successfully.");
            } else if (items.length === 0) {
                 console.log("Paste event had no items.");
                 createNotification("Nothing found in clipboard to paste");
            }
            */
        }

        async _handleCopyEvent(e) {
            const targetElement = e.target;
            if (targetElement && (
                targetElement.tagName === 'INPUT' ||
                targetElement.tagName === 'TEXTAREA' ||
                targetElement.isContentEditable
            )) {
                return;
            }

            if (!this.viewer.isActive()) return;

            if (e) e.preventDefault();

            this._copyCurrentUrl();
        }

        async _copyCurrentUrl() {
            const item = thumbs[this.viewer.currentIndex];

            if (!item) {
                console.warn("Cannot copy as thumbs[currentIndex] is null");
                return;
            }

            const url = this.config.useOriginalImages && item.originalImageUrl
                ? item.originalImageUrl
                : item.fullImageUrl;

            if (!url) {
                console.warn("Cannot copy, missing url");
                return;
            }

            // Check if the Clipboard API (writeText) is supported
            if (!navigator.clipboard || !navigator.clipboard.writeText) {
                console.error("Clipboard API (writeText) not supported.");
                // Fallback for older browsers (less reliable)
                try {
                    const textArea = document.createElement("textarea");
                    textArea.value = url;
                    textArea.style.position = "fixed"; // Avoid scrolling
                    document.body.appendChild(textArea);
                    textArea.focus();
                    textArea.select();
                    const successful = document.execCommand('copy');
                    document.body.removeChild(textArea);
                    if (successful) {
                        console.log("Image URL copied to clipboard (fallback method).");
                        createNotification("Copied image URL");
                    } else {
                        throw new Error('Fallback copy failed');
                    }
                } catch (err) {
                    console.error("Failed to copy URL (fallback failed):", err);
                    createNotification("Error copying URL");
                }
                return;
            }

            // Use modern Clipboard API
            try {
                await navigator.clipboard.writeText(url);
                console.log("Image URL copied to clipboard:", url);
                createNotification("Copied image URL");
            } catch (err) {
                console.error("Failed to copy URL:", err);
                createNotification("Error copying URL");
                if (err.name === 'NotAllowedError') {
                    createNotification("Error: Clipboard permission denied.");
                }
            }
        }

        async _copyCurrentImage() {
            if (!navigator.clipboard?.write) {
                console.error('Clipboard API (write) not available. This may be due to an insecure context (non-HTTPS).');
                createNotification('Clipboard API is not available.');
                return false;
            }

            const imageElement = this.viewer.imgDisplay;

            if (!imageElement || !imageElement.complete) {
                console.warn("Cannot copy, the image element is not available or not fully loaded.");
                createNotification('Image is not ready to be copied.');
                return false;
            }

            try {
                // --- ATTEMPT 1: The Fast, Direct Method ---
                console.log("Attempting direct canvas copy...");
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                // Use naturalWidth/Height to get the image's intrinsic size, not its scaled display size
                canvas.width = imageElement.naturalWidth;
                canvas.height = imageElement.naturalHeight;

                // Draw the image from the <img> element onto the canvas
                ctx.drawImage(imageElement, 0, 0);

                // Convert the canvas to a PNG blob. This is the step that will throw a
                // SecurityError if the image source is cross-origin and lacks CORS headers.
                const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));

                if (!blob) {
                    // This should rarely happen for 'image/png' but is good practice to check
                    throw new Error('Canvas toBlob operation resulted in a null blob.');
                }

                const clipboardItem = new ClipboardItem({ 'image/png': blob });
                await navigator.clipboard.write([clipboardItem]);

                console.log('Image successfully copied directly from canvas!');
                createNotification(`Copied Image`);
                return true;

            } catch (error) {
                // Check if it's the specific error we expect when the canvas is tainted
                if (error instanceof DOMException && error.name === 'SecurityError') {
                    console.warn("Direct canvas copy failed due to CORS. Falling back to fetch method.");
                    // --- ATTEMPT 2: The Reliable Fallback Method ---
                    return this._copyCurrentImageWithFetch();
                } else {
                    // It was a different, unexpected error
                    console.error('Failed to copy image with direct method:', error);
                    createNotification(`Could not copy image. See console.\nError: ${error.message}`);
                    return false;
                }
            }
        }

        async _copyCurrentImageWithFetch() {
            const item = thumbs[this.viewer.currentIndex];

            if (!item) {
                console.warn("Cannot copy via fetch as thumbs[currentIndex] is null");
                return false;
            }

            const imageUrl = this.config.useOriginalImages && item.originalImageUrl
                ? item.originalImageUrl
                : item.fullImageUrl;

            if (!imageUrl) {
                console.warn("Cannot copy via fetch, missing url");
                return false;
            }

            try {
                console.log('Fetching image via fallback from:', imageUrl);
                createNotification("Fetching image..", 30);
                let { blob, type } = await fetchMediaDetails(imageUrl);

                const mimeType = type || blob.type;
                if (!mimeType) {
                    throw new Error('Could not determine the MIME type of the image.');
                }

                // Conversion to PNG is necessary for non-PNG types to ensure
                // compatibility with the clipboard API.
                if (mimeType !== 'image/png') {
                    console.log(`Original type is '${mimeType}'. Converting to PNG for clipboard.`);
                    blob = await convertToPngBlob(blob);
                }

                const clipboardItem = new ClipboardItem({ 'image/png': blob });
                await navigator.clipboard.write([clipboardItem]);

                console.log('Image successfully copied via fallback fetch!');
                createNotification("Copied Image");
                return true;

            } catch (error) {
                console.error('Failed to copy image using fallback fetch method:', error);
                createNotification(`Could not copy image. See console for details.\nError: ${error.message}`);
                return false;
            }
        }

        // Method to detach listeners
        destroy() {
            document.removeEventListener("paste", this._boundHandlePasteEvent);
            document.removeEventListener("copy", this._boundHandleCopyEvent);
            document.removeEventListener("keydown", this._boundHandleKeyDown);
            this.viewer.parent.removeEventListener("wheel", this._boundHandleWheel);
        }
    }
    // ----------------------------------------------------------------------------------------------
    // gridView.js
    // ----------------------------------------------------------------------------------------------

    class GridView {
        // --- Internal State and Calculated Values ---
        gridContainer;
        aspectRatio = 3 / 4;
        disableOnImageSelect = false;
        observeViaViewport = false;
        minMargin = 10;
        placeholderColor = '#cccccc';
        observerRootMargin = '200px 0px';
        itemPaddingBottom;
        placeholderBorderStyle;
        gridIntersectionObserver = null;
        itemsToLoadQueue = [];
        gridViewIsLoading = false;
        showCalled = false;
        disabled = false;
        loadingEnabled = true;
        initialIndex = 0;
        loadingStatus = new Map(); // Tracks status: 'pending', 'queued', 'loading', 'loaded', 'failed'
        _cachedGridItemRect = null; // Cache for grid item dimensions
        config; // To store passed configuration
        provider; // GridDataProvider instance

        /**
         * Initializes the GridView component.
         * @param {GridDataProvider} provider The data provider
         * @param {HTMLElement} parent The parent element to append the grid container to
         * @param {object} config Configuration object containing grid settings
         * @param {number} config.numColumns Number of columns in the grid
         * @param {boolean} config.showPageNumbers Whether to show index labels on grid items
         * @param {boolean} config.fetchFullImages Whether to actively fetch full images when items intersect.
         * @param {boolean} [observeViaViewport] Determines the root for the IntersectionObserver.
         * @param {boolean} [disableOnImageSelect=false] Whether to disable grid view when an image is clicked.
         */
        constructor(provider, parent, config, observeViaViewport, disableOnImageSelect = false) {
            if (!parent || !(parent instanceof Element)) {
                throw new Error("GridView requires a valid parent HTMLElement.");
            }
            if (!config) {
                throw new Error("GridView requires a config object.");
            }
            if (!provider) {
                throw new Error("GridView requires a data provider.");
            }
            if (typeof config.numColumns !== 'number' || typeof config.showPageNumbers !== 'boolean' || typeof config.fetchFullImages !== 'boolean') {
                throw new Error("GridView requires config object with 'numColumns' (number), 'gridLabels' (bool) and 'fetchFullImages' (bool).");
            }
            // Global function checks removed; we rely on the provider abstraction now.
            if (typeof getThumbOffset !== 'function') {
                // getThumbOffset is a utility helper for styling, can remain global or be moved
                throw new Error("GridView requires global 'getThumbOffset' function.");
            }

            // --- Calculate derived values (Internal) ---
            this.provider = provider;
            this.parent = parent;
            this.config = config;
            this.disableOnImageSelect = disableOnImageSelect;
            this.observeViaViewport = observeViaViewport;
            this.itemPaddingBottom = `${(1 / this.aspectRatio) * 100}%`;
            this.placeholderBorderStyle = `1px solid ${this.placeholderColor}`;
            this.initialIndex = 0;

            // --- Create the main grid container element (Internal) ---
            this.gridContainer = document.createElement('div');

            // --- Initial setup using globals ---
            this._initializeDOM();
        }

        /**
        * Appends the gridContainer to the global parent.
        * @private
        */
        _initializeDOM() {
            this.parent.appendChild(this.gridContainer);
            this.gridContainer.style.display = 'none';
            this.gridContainer.style.position = 'relative';
            this.gridContainer.style.overflow = 'auto'; // Should be auto or scroll
            this.gridContainer.style.height = '100%'; // Take full overlay height
            this.gridContainer.style.width = '100%';
            this.gridContainer.style.gap = `${this.minMargin}px`;
            this.gridContainer.style.boxSizing = 'border-box'; // Include padding/border in size
            // this.gridContainer.style.padding = `${this.minMargin}px`; // Add padding
        }

        /**
         * Handles the click event on a grid item.
         * @param {number} viewIndex - The view index of the clicked image.
         * @private
         */
        _handleGridItemClick(viewIndex) {
            if (!imageViewer) {
                console.error("Global 'imageViewer' does not exist.");
                return;
            }

            console.log(`GridView: Clicked view index ${viewIndex}`);

            this.stopLoading(); // Stop background loading

            const globalIndex = this.provider.resolveIndex(viewIndex);

            imageViewer.loadAndShowIndex(globalIndex) // Prioritize loading clicked item
                .catch(err => {
                    console.error(`Error loading image on click for index ${globalIndex}:`, err);
                })
                .finally(() => {
                    if (this.disableOnImageSelect) {
                        console.log(`GridView: Disabling grid view`);
                        this.disable();
                    }
                });
        }

        /**
         * Cleans up observers/queues.
         */
        stopLoading() {
            if (!this.loadingEnabled) return;

            console.log("GridView: Stopping loading and disconnecting observer");
            this.loadingEnabled = false;

            if (this.gridIntersectionObserver) {
                this.gridIntersectionObserver.disconnect();
                this.gridContainer.querySelectorAll('[data-index]').forEach(item => {
                    try {
                        this.gridIntersectionObserver.unobserve(item);
                    } catch (e) { /* Ignore errors if already unobserved */ }
                });
            }
            this.itemsToLoadQueue.length = 0;
            this.gridViewIsLoading = false;
        }

        /**
         * Checks if a full image is available for a grid item and updates it if necessary.
         * @param {HTMLElement} gridItem The grid item element.
         * @param {number} index The index of the grid item.
         * @private
         */
        _checkAndApplyFullImage(gridItem, index) {
            if (!this.config.fetchFullImages) return; // Only proceed if configured to fetch full images

            const thumb = this.provider.getItem(index);
            const currentStatus = this.loadingStatus.get(index) || 'pending';

            // Check if full image URL exists and the item isn't already loaded/failed or currently loading one
            if (thumb && thumb.fullImageUrl && currentStatus !== 'loaded' && currentStatus !== 'failed' && currentStatus !== 'loading') {
                // Check if the gridItem does *not* already have an <img> element (the full image)
                if (!gridItem.querySelector('img')) {
                    console.log(`GridView [${index}]: Found available full image during enableLoading. Updating.`);
                    this._updateGridItemImage(gridItem, index); // This will handle showing the full image
                }
            }
        }

        /**
        * Reenables image loading after stopLoading was called.
        */
        enableLoading() {
            if (this.loadingEnabled) return;
            console.log("GridView: Enabling loading and re-observing grid items");

            this._ensureObserverInitialized();
            this.loadingEnabled = true;

            this.gridContainer.querySelectorAll('[data-index]').forEach(gridItem => {
                const index = parseInt(gridItem.dataset.index, 10);
                if (isNaN(index)) return;

                const currentStatus = this.loadingStatus.get(index) || 'pending';
                const isFinalStatus = currentStatus === 'loaded' || currentStatus === 'failed';

                if (!isFinalStatus) {
                    if (this.gridIntersectionObserver) {
                        try {
                            this.gridIntersectionObserver.observe(gridItem);
                        } catch (e) {
                            console.warn(`GridView: Error observing item ${index} during enableLoading:`, e);
                        }
                    }
                }
            });
        }

        /**
         * Hides the grid view and cleans up observers/queues.
         */
        disable() {
            if (this.disabled) return;
            console.log("GridView: Disabling");
            this.gridContainer.style.display = 'none';
            this.stopLoading();
            this.disabled = true;
        }

        /**
         * Gets whether the grid view is currently visible.
         */
        isShown() {
            return this.gridContainer.style.display !== 'none';
        }

        /**
         * Forces the grid item at the specified index to display its full-resolution image.
         * @param {number} index The view index of the image item to update.
         * @returns {Promise<void>}
         * @public
         */
        async forceSetFullImage(index) {
            if (typeof index !== 'number' || index < 0 || index >= this.provider.length) {
                console.warn(`GridView: forceSetFullImage: Invalid index ${index}.`);
                return;
            }

            const gridItem = this.gridContainer.querySelector(`[data-index="${index}"]`);
            if (!gridItem) {
                console.warn(`GridView: forceSetFullImage: Could not find grid item element for index ${index}.`);
                return;
            }

            let thumb = this.provider.getItem(index);
            const currentStatus = this.loadingStatus.get(index) || 'pending';

            if (!thumb || !thumb.fullImageUrl) {
                console.log(`GridView: forceSetFullImage [${index}]: Full image URL not found. Fetching...`);
                try {
                    this.loadingStatus.set(index, 'loading');
                    await this.provider.fetchFullImage(index);
                    thumb = this.provider.getItem(index);
                    if (!thumb || !thumb.fullImageUrl) {
                        throw new Error(`Full image URL still missing after fetch attempt for index ${index}.`);
                    }
                    console.log(`GridView: forceSetFullImage [${index}]: Full image data fetched successfully.`);

                } catch (error) {
                    console.error(`GridView: forceSetFullImage [${index}]: Error fetching full image data:`, error);
                    this.loadingStatus.set(index, 'failed');
                    this._updateGridItemImage(gridItem, index);
                    if (this.gridIntersectionObserver) {
                        try { this.gridIntersectionObserver.unobserve(gridItem); } catch (e) { }
                    }
                    return;
                }
            } else {
                if (currentStatus !== 'loaded' && currentStatus !== 'failed') {
                    this.loadingStatus.set(index, 'loading');
                }
            }

            this._updateGridItemImage(gridItem, index);
        }

        /**
         * Calculates the expected width of a single grid item.
         * @returns {number | null} The calculated width in pixels, or null if calculation is not possible.
         * @private
         */
        _calculateGridItemWidth() {
            if (!this.gridContainer || !this.gridContainer.isConnected) {
                console.warn("GridView: Cannot calculate item width, grid container not ready.");
                return null;
            }

            const container = this.gridContainer;
            const numColumns = this.config.numColumns;

            const styles = window.getComputedStyle(container);
            const gapStyle = styles.columnGap;
            let gap = parseFloat(gapStyle);

            if (isNaN(gap)) {
                gap = this.minMargin;
            }

            const paddingLeft = parseFloat(styles.paddingLeft) || 0;
            const paddingRight = parseFloat(styles.paddingRight) || 0;

            const availableWidthForGrid = container.clientWidth - (paddingLeft + paddingRight);

            if (availableWidthForGrid <= 0) {
                console.warn(`GridView: Available width for grid is <= 0. Item width will be 0.`);
                return 0;
            }

            const totalGap = Math.max(0, numColumns - 1) * gap;
            const calculatedWidth = (availableWidthForGrid - totalGap) / numColumns;

            if (calculatedWidth < 0) {
                return 0;
            }

            return calculatedWidth;
        }

        /**
         * Updates the grid item with the best available image.
         * @param {HTMLElement} gridItem - The grid item (or container).
         * @param {number} index - The view index of the image.
         * @private
         */
        _updateGridItemImage(gridItem, index) {
            // Determine the target box for the image.
            // If hasMetadata=true, 'gridItem' is the Flex Container, and the image goes in .grid-image-box.
            // If hasMetadata=false, 'gridItem' is the .grid-image-box itself.
            let imageBox = gridItem;
            if (this.provider.hasMetadata) {
                imageBox = gridItem.querySelector('.grid-image-box');
                this._applyMetadataToElement(gridItem, index); // Update metadata visuals
            }

            if (!imageBox) return;

            const thumb = this.provider.getItem(index);
            const currentStatus = this.loadingStatus.get(index) || 'pending';
            let thumbnailApplied = false;

            // --- Special Handling for Videos ---
            if (thumb && thumb.isVideo === true) {
                const existingImg = imageBox.querySelector('img');
                if (existingImg) existingImg.remove();
                gridItem.style.background = 'none';

                gridItem.style.border = this.placeholderBorderStyle;
                gridItem.style.backgroundColor = this.placeholderColor;
                gridItem.style.opacity = '1';

                this.loadingStatus.set(index, 'loaded');
                if (this.gridIntersectionObserver) {
                    try { this.gridIntersectionObserver.unobserve(gridItem); } catch (e) { /* Ignore */ }
                }
                return;
            }

            // --- Clear things we are replacing ---
            const existingImg = imageBox.querySelector('img');
            if (existingImg) existingImg.remove();
            imageBox.style.background = 'none';
            imageBox.style.border = 'none';
            imageBox.style.backgroundColor = '';
            imageBox.style.opacity = '1';

            // --- Step 1: Try to Apply Thumbnail Background ---
            if (thumb && typeof thumb === 'object' && thumb.background && typeof getThumbOffset === 'function') {
                try {
                    // Calculate display width. 
                    // If hasMetadata, we have 4px padding on container, so imageBox is 8px narrower than grid track.
                    const rawWidth = this._calculateGridItemWidth();
                    const paddingOffset = this.provider.hasMetadata ? 8 : 0;
                    const currentWidth = rawWidth - paddingOffset;

                    const thumbOffset = getThumbOffset(thumb.background, currentWidth);
                    const scale = currentWidth / THUMB_WIDTH;

                    // For spritesheet logic, we need the global page index to know the sheet width.
                    const globalIndex = this.provider.resolveIndex(index);
                    const currentPageIndex = imageIndexToPageIndex(globalIndex);

                    const thumbSpritesheetWidth = getSpritesheetWidthForPage(currentPageIndex);

                    imageBox.style.background = thumb.background;
                    imageBox.style.backgroundPosition = `${thumbOffset}px 0px`;
                    if (galleryUsesSpritesheets) {
                        imageBox.style.backgroundSize = `${thumbSpritesheetWidth * scale}px auto`;
                    } else {
                        imageBox.style.backgroundSize = `100% auto`;
                    }
                    thumbnailApplied = true;

                } catch (e) {
                    console.error(`GridView [${index}]: Error applying thumbnail background:`, e);
                    imageBox.style.background = 'none';
                    thumbnailApplied = false;
                }
            }

            // --- Step 2: Try to Load Full Image ---
            if (thumb && typeof thumb === 'object' && thumb.fullImageUrl && currentStatus !== 'failed') {
                // console.log(`GridView [${index}]: Found full image URL.`);

                const img = document.createElement('img');
                img.src = thumb.fullImageUrl;
                img.referrerPolicy = "no-referrer";
                img.alt = `Image ${index + 1}`;
                img.style.position = 'absolute';
                img.style.top = '0';
                img.style.left = '0';
                img.style.width = '100%';
                img.style.objectFit = 'cover';
                img.style.display = 'block';
                img.style.opacity = '0'; // Start hidden
                img.style.transition = 'opacity 0.3s ease-in-out';
                img.style.zIndex = '1';

                img.onload = () => {
                    imageBox.style.border = 'none';
                    img.style.opacity = '1';

                    if (thumbnailApplied) {
                        img.addEventListener('transitionend', () => {
                            if (img.style.opacity === '1') {
                                imageBox.style.background = 'none';
                            }
                        }, { once: true });
                    }

                    this.loadingStatus.set(index, 'loaded');
                    if (this.gridIntersectionObserver) {
                        try { this.gridIntersectionObserver.unobserve(gridItem); } catch (e) { /* Ignore */ }
                    }
                };

                img.onerror = () => {
                    console.warn(`GridView [${index}]: Failed to load full image: ${thumb.fullImageUrl}`);
                    img.remove();
                    this.loadingStatus.set(index, 'failed');

                    if (!thumbnailApplied) {
                        imageBox.style.background = 'none';
                        imageBox.style.border = this.placeholderBorderStyle;
                        imageBox.style.backgroundColor = this.placeholderColor;
                    } else {
                        imageBox.style.border = 'none';
                        imageBox.style.backgroundColor = '';
                    }

                    if (this.gridIntersectionObserver) {
                        try { this.gridIntersectionObserver.unobserve(gridItem); } catch (e) { /* Ignore */ }
                    }
                };

                imageBox.appendChild(img);

            } else if (!thumbnailApplied) {
                // --- Step 3: Fallback to Placeholder ---
                // console.log(`GridView [${index}]: Applying placeholder.`);
                imageBox.style.background = 'none';
                imageBox.style.border = this.placeholderBorderStyle;
                imageBox.style.backgroundColor = this.placeholderColor;

                if (currentStatus !== 'failed' && currentStatus !== 'loading' && currentStatus !== 'queued' && currentStatus !== 'loaded') {
                    this.loadingStatus.set(index, 'pending');
                }
            }

            const finalStatusCheck = this.loadingStatus.get(index);
            if ((finalStatusCheck === 'loaded' || finalStatusCheck === 'failed') && this.gridIntersectionObserver) {
                try { this.gridIntersectionObserver.unobserve(gridItem); } catch (e) { /* Ignore */ }
            }
        }

        /**
         * Efficiently removes an item from the queue.
         * @param {number} indexToRemove - The index to remove.
         * @private
         */
        _removeFromQueue(indexToRemove) {
            this.itemsToLoadQueue = this.itemsToLoadQueue.filter(index => index !== indexToRemove);
        }

        /**
         * After loading an image, checks neighbors for newly available thumbnails and updates them.
         * @param {number} centerIndex - The view index of the image that was just loaded.
         * @private
         */
        _updateNeighborThumbnails(centerIndex) {
            const maxIndex = this.provider.length - 1;

            // Check backwards
            for (let i = centerIndex - 1; i >= Math.max(0, centerIndex - 1); i--) {
                const thumb = this.provider.getItem(i);
                if (!thumb) break; // Reached edge of loaded thumb data
                const status = this.loadingStatus.get(i);
                if (status === 'loaded' || status === 'failed' || (thumb && thumb.fullImageUrl)) {
                    break;
                }

                if (thumb.background) {
                    const gridItem = this.gridContainer.querySelector(`[data-index="${i}"]`);
                    if (gridItem && !gridItem.querySelector('img') && (!gridItem.style.backgroundImage || gridItem.style.backgroundImage === 'none')) {
                        this._updateGridItemImage(gridItem, i);
                    }
                }
            }

            // Check forwards
            for (let i = centerIndex + 1; i <= Math.min(maxIndex, centerIndex + 1); i++) {
                const thumb = this.provider.getItem(i);
                if (!thumb) break;
                const status = this.loadingStatus.get(i);
                if (status === 'loaded' || status === 'failed' || (thumb && thumb.fullImageUrl)) {
                    break;
                }

                if (thumb.background) {
                    const gridItem = this.gridContainer.querySelector(`[data-index="${i}"]`);
                    if (gridItem && !gridItem.querySelector('img') && (!gridItem.style.backgroundImage || gridItem.style.backgroundImage === 'none')) {
                        this._updateGridItemImage(gridItem, i);
                    }
                }
            }
        }


        /**
         * Processes the queue of items needing their full image URL loaded.
         * @private
         */
        async _processLoadQueue() {
            if (this.gridViewIsLoading) return;
            if (this.itemsToLoadQueue.length === 0) return;
            if (!this.loadingEnabled) return;

            this.gridViewIsLoading = true;
            const indexToLoad = this.itemsToLoadQueue.shift();

            const currentStatus = this.loadingStatus.get(indexToLoad);
            if (currentStatus !== 'queued') {
                // console.log(`GridView: Skipping load for index ${indexToLoad}, status is now ${currentStatus}.`);
                this.gridViewIsLoading = false;
                if (this.itemsToLoadQueue.length > 0) requestAnimationFrame(() => this._processLoadQueue());
                return;
            }

            const gridItem = this.gridContainer.querySelector(`[data-index="${indexToLoad}"]`);
            if (!gridItem) {
                this.loadingStatus.set(indexToLoad, 'failed');
                this.gridViewIsLoading = false;
                if (this.itemsToLoadQueue.length > 0) requestAnimationFrame(() => this._processLoadQueue());
                return;
            }

            try {
                this.loadingStatus.set(indexToLoad, 'loading');

                if (this.config.fetchFullImages) {
                    // --- Fetch Full Image Data ---
                    await this.provider.fetchFullImage(indexToLoad);

                    const currentGridItem = this.gridContainer.querySelector(`[data-index="${indexToLoad}"]`);
                    if (currentGridItem) {
                        this._updateGridItemImage(currentGridItem, indexToLoad);
                    } else {
                        const thumb = this.provider.getItem(indexToLoad);
                        if (thumb && thumb.fullImageUrl) {
                            if (this.loadingStatus.get(indexToLoad) !== 'failed') this.loadingStatus.set(indexToLoad, 'loaded');
                        } else if (this.loadingStatus.get(indexToLoad) === 'loading') {
                            this.loadingStatus.set(indexToLoad, 'failed');
                        }
                    }
                    this._updateNeighborThumbnails(indexToLoad);

                } else {
                    // --- Fetch Only Thumbnail Data ---
                    // console.log(`GridView: Fetching only thumbs for index ${indexToLoad}`);
                    await this.provider.fetchThumbnail(indexToLoad);

                    const currentGridItem = this.gridContainer.querySelector(`[data-index="${indexToLoad}"]`);
                    if (currentGridItem) {
                        this._updateGridItemImage(currentGridItem, indexToLoad);
                    }

                    this._updateNeighborThumbnails(indexToLoad);

                    if (this.loadingStatus.get(indexToLoad) === 'loading') {
                        this.loadingStatus.set(indexToLoad, 'loaded');
                        if (currentGridItem && this.gridIntersectionObserver) {
                            try { this.gridIntersectionObserver.unobserve(currentGridItem); } catch (e) { }
                        }
                    }
                }

            } catch (error) {
                console.error(`GridView: Error loading data for index ${indexToLoad}:`, error);
                this.loadingStatus.set(indexToLoad, 'failed');
                const currentGridItem = this.gridContainer.querySelector(`[data-index="${indexToLoad}"]`);
                if (currentGridItem) {
                    this._updateGridItemImage(currentGridItem, indexToLoad);
                    if (this.gridIntersectionObserver) {
                        try { this.gridIntersectionObserver.unobserve(currentGridItem); } catch (e) { }
                    }
                }
            } finally {
                this.gridViewIsLoading = false;
                if (this.itemsToLoadQueue.length > 0) {
                    requestAnimationFrame(() => this._processLoadQueue());
                }
            }
        }

        /**
         * The callback function for the IntersectionObserver.
         * @param {IntersectionObserverEntry[]} entries
         * @param {IntersectionObserver} observer
         * @private
         */
        _handleIntersection(entries, observer) {
            entries.forEach(entry => {
                const gridItem = entry.target;
                const index = parseInt(gridItem.dataset.index, 10);

                if (isNaN(index)) {
                    try { observer.unobserve(gridItem); } catch (e) { }
                    return;
                }

                if (entry.isIntersecting) {
                    // --- Item is entering the viewport ---

                    // Step 1: Update visual based on current data
                    this._updateGridItemImage(gridItem, index);

                    // Step 2: Check if further network loading is needed
                    const updatedStatus = this.loadingStatus.get(index) || 'pending';
                    const thumb = this.provider.getItem(index);
                    const hasFullImage = thumb && thumb.fullImageUrl;
                    const isFinalStatus = updatedStatus === 'loaded' || updatedStatus === 'failed';

                    // Needs network action if: status isn't final AND (we need full images OR thumb data might be missing)
                    const needsNetworkAction = !isFinalStatus && (this.config.fetchFullImages || !thumb?.background);

                    if (needsNetworkAction) {
                        // --- Independent Thumbnail Fetch ---
                        if (!thumb || !thumb.background) {
                            // console.log(`GridView: Item ${index} missing thumb. Triggering fetch.`);
                            this.provider.fetchThumbnail(index)
                                .then(() => {
                                    // Update visuals for items that might now have thumbnails (this one and neighbors)
                                    const currentItem = this.gridContainer.querySelector(`[data-index="${index}"]`);
                                    if (currentItem) this._updateGridItemImage(currentItem, index);
                                    this._updateNeighborThumbnails(index);
                                })
                                .catch(err => {
                                    console.error(`GridView: Thumb fetch for index ${index} failed:`, err);
                                });
                        }

                        // --- Full Image Queueing ---
                        if (this.config.fetchFullImages) {
                            this.itemsToLoadQueue.push(index);
                            this.loadingStatus.set(index, 'queued');
                            this._processLoadQueue();
                        } else if (!thumb || !thumb.background) {
                            // If not fetching full images, but we needed the thumb, we queue it to ensure status updates correctly
                            this.itemsToLoadQueue.push(index);
                            this.loadingStatus.set(index, 'queued');
                            this._processLoadQueue();
                        }
                    }
                    else if (hasFullImage && !isFinalStatus) {
                        this._updateGridItemImage(gridItem, index);
                    }
                } else {
                    // --- Item is leaving the viewport ---
                    const currentStatus = this.loadingStatus.get(index) || 'pending';
                    if (currentStatus === 'queued') {
                        this._removeFromQueue(index);
                        this.loadingStatus.set(index, 'pending');
                    }
                }
            });
        }


        /**
         * Creates a single grid item element.
         * @param {number} index - The view index of the image.
         * @returns {HTMLElement} The configured grid item element.
         * @private
         */
        _createGridItem(index) {
            // --- Branch based on Metadata Availability ---
            // If the provider has no metadata (standard grid), we use a simpler, bare-bones structure.
            // If it has metadata (chapter grid), we use the card-like flex structure with padding.

            if (!this.provider.hasMetadata) {
                // --- Simple Grid Item (Standard View) ---
                const gridItem = document.createElement('div');
                gridItem.dataset.index = index;
                gridItem.className = 'grid-image-box'; // Treated as the image box itself
                gridItem.style.position = 'relative';
                gridItem.style.overflow = 'hidden';
                gridItem.style.width = '100%';
                gridItem.style.height = '0';
                gridItem.style.paddingBottom = this.itemPaddingBottom;
                gridItem.style.cursor = 'pointer';
                gridItem.style.boxSizing = 'border-box';

                // Placeholder state
                gridItem.style.backgroundColor = this.placeholderColor;
                gridItem.style.border = this.placeholderBorderStyle;

                // Floating Page Number
                if (this.config.showPageNumbers) {
                    const indexLabel = document.createElement('span');
                    const globalIndex = this.provider.resolveIndex(index);
                    indexLabel.textContent = (globalIndex !== -1 ? globalIndex : index) + 1;

                    indexLabel.style.position = 'absolute';
                    indexLabel.style.top = '2px';
                    indexLabel.style.left = '2px';
                    indexLabel.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
                    indexLabel.style.color = 'white';
                    indexLabel.style.padding = '3px 6px';
                    indexLabel.style.fontSize = '14px';
                    indexLabel.style.borderRadius = '4px';
                    indexLabel.style.fontWeight = 'bold';
                    indexLabel.style.zIndex = '10';
                    indexLabel.style.pointerEvents = 'none';
                    gridItem.appendChild(indexLabel);
                }

                gridItem.addEventListener('click', () => this._handleGridItemClick(index));
                return gridItem;
            }

            // --- Complex Grid Item (Metadata View) ---
            const container = document.createElement('div');
            container.dataset.index = index; // The observer and logic look for this on the root
            container.style.display = 'flex';
            container.style.flexDirection = 'column';
            container.style.cursor = 'pointer';
            container.style.boxSizing = 'border-box';
            container.style.transition = 'background-color 0.2s, box-shadow 0.2s';
            container.style.borderRadius = '4px';
            container.style.padding = '4px'; // Spacing for highlight border (subtract from width calc)

            // --- Image Box ---
            const imageBox = document.createElement('div');
            imageBox.className = 'grid-image-box';
            imageBox.style.position = 'relative';
            imageBox.style.overflow = 'hidden';
            imageBox.style.width = '100%';
            imageBox.style.height = '0';
            imageBox.style.paddingBottom = this.itemPaddingBottom;

            imageBox.style.backgroundColor = this.placeholderColor;
            imageBox.style.border = this.placeholderBorderStyle;
            imageBox.style.borderRadius = '2px';

            // Floating Page Number (Optional even in metadata view)
            if (this.config.showPageNumbers) {
                const indexLabel = document.createElement('span');
                const globalIndex = this.provider.resolveIndex(index);
                indexLabel.textContent = (globalIndex !== -1 ? globalIndex : index) + 1;

                indexLabel.style.position = 'absolute';
                indexLabel.style.top = '2px';
                indexLabel.style.left = '2px';
                indexLabel.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
                indexLabel.style.color = 'white';
                indexLabel.style.padding = '3px 6px';
                indexLabel.style.fontSize = '14px';
                indexLabel.style.borderRadius = '4px';
                indexLabel.style.fontWeight = 'bold';
                indexLabel.style.zIndex = '10';
                indexLabel.style.pointerEvents = 'none';
                imageBox.appendChild(indexLabel);
            }

            container.appendChild(imageBox);

            // --- Caption Area ---
            // We do not construct the caption here anymore. 
            // We rely on _applyMetadataToElement to fetch and append the element from the provider.
            // This ensures GridView doesn't care about the content structure.

            container.addEventListener('click', () => this._handleGridItemClick(index));

            // Initial metadata render
            this._applyMetadataToElement(container, index);

            return container;
        }

        /**
         * Applies metadata (title, highlight) to an element.
         * @private
         */
        _applyMetadataToElement(container, index) {
            if (!this.provider.hasMetadata) return;

            const { captionElement, isCurrent } = this.provider.getMetadata(index);

            // Highlighting (Container Style)
            if (isCurrent) {
                container.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                container.style.boxShadow = '0 0 0 1px rgba(0, 255, 208, 0.5)'; // Cyan-ish tint
            } else {
                container.style.backgroundColor = 'transparent';
                container.style.boxShadow = 'none';
            }

            // Content Update (HTML Element from Provider)
            if (this.config.showCaptions) {
                const existingCaption = container.querySelector('.provider-caption-root');

                // If the provider returned an element
                if (captionElement) {
                    if (existingCaption) {
                        // Replace existing
                        container.replaceChild(captionElement, existingCaption);
                    } else {
                        // Append new
                        container.appendChild(captionElement);
                    }
                } else if (existingCaption) {
                    // Provider returned null but we have an old one? Remove it.
                    existingCaption.remove();
                }
            }
        }

        /**
         * Refreshes metadata (highlights, text) for all visible items.
         * Does not reload images.
         */
        updateMetadata() {
            const items = Array.from(this.gridContainer.querySelectorAll('[data-index]'));
            items.forEach(item => {
                const index = parseInt(item.dataset.index, 10);
                if (!isNaN(index)) {
                    this._applyMetadataToElement(item, index);
                }
            });
        }


        /**
         * Prepares the grid container for display.
         * @private
         */
        _prepareGridContainer() {
            this.gridContainer.innerHTML = ''; // Clear previous items

            if (this.gridIntersectionObserver) {
                this.gridIntersectionObserver.disconnect();
                this.gridContainer.querySelectorAll('[data-index]').forEach(item => {
                    try {
                        this.gridIntersectionObserver.unobserve(item);
                    } catch (e) { /* Ignore errors if already unobserved */ }
                });
            }
            this.itemsToLoadQueue.length = 0;
            this.gridViewIsLoading = false;

            this.loadingStatus.clear();
            this._cachedGridItemRect = null;

            if (!this.gridIntersectionObserver) {
                this._ensureObserverInitialized();
            } else {
                this.gridIntersectionObserver.disconnect();
            }

            this.gridContainer.style.display = 'grid';
            this.gridContainer.style.gridTemplateColumns = `repeat(${this.config.numColumns}, 1fr)`;
        }

        /**
         * Initializes intersection observer if needed.
         * @private
         */
        _ensureObserverInitialized() {
            if (!this.gridIntersectionObserver) {
                const observerRoot = this.observeViaViewport ? null : this.gridContainer;
                const observerOptions = {
                    root: observerRoot,
                    rootMargin: this.observerRootMargin,
                    threshold: 0
                };
                this.gridIntersectionObserver = new IntersectionObserver(
                    this._handleIntersection.bind(this),
                    observerOptions
                );
            }
        }

        /**
        * Scrolls the grid view to the specified image index.
        * @param {number} index - The view index of the image to scroll to.
        * @param {boolean} [highlight=false] - Whether to temporarily highlight the scrolled-to item.
        */
        scrollToIndex(index, highlight = true) {
            if (index === null || index < 0 || index >= this.provider.length) {
                console.warn(`GridView: scrollToIndex: Invalid index ${index}.`);
                return;
            }
            requestAnimationFrame(() => {
                const targetItem = this.gridContainer.querySelector(`[data-index="${index}"]`);
                if (targetItem) {
                    console.log(`GridView: Scrolling to index ${index}`);
                    targetItem.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'nearest' });

                    if (highlight) {
                        const fadeInDuration = 200;
                        const holdDuration = 800;
                        const fadeOutDuration = 800;
                        const highlightBoxShadow = '0 0 30px 10px rgba(255, 255, 200, 1.0)';

                        const cleanupHighlight = (item) => {
                            if (item._highlightTimeout) clearTimeout(item._highlightTimeout);
                            if (item._cleanupTimeout) clearTimeout(item._cleanupTimeout);
                            item.style.removeProperty('outline');
                            item.style.removeProperty('box-shadow');
                            item.style.removeProperty('transition');
                            item.style.removeProperty('z-index');
                            delete item._highlightTimeout;
                            delete item._cleanupTimeout;
                        };

                        cleanupHighlight(targetItem);

                        targetItem.style.zIndex = '2';
                        targetItem.style.transition = `box-shadow ${fadeInDuration}ms ease-in`;
                        targetItem.style.boxShadow = '';

                        requestAnimationFrame(() => {
                            requestAnimationFrame(() => {
                                targetItem.style.boxShadow = highlightBoxShadow;

                                targetItem._highlightTimeout = setTimeout(() => {
                                    targetItem.style.transition = `box-shadow ${fadeOutDuration}ms ease-out`;
                                    targetItem.style.boxShadow = '';

                                    targetItem._cleanupTimeout = setTimeout(() => {
                                        cleanupHighlight(targetItem);
                                    }, fadeOutDuration);
                                }, fadeInDuration + holdDuration);
                            });
                        });
                    }
                } else {
                    console.warn(`GridView: scrollToIndex: Could not find grid item for index ${index}.`);
                }
            });
        }

        /**
        * Displays the grid view, creating items and setting up observers.
        * @param {number | null} [initialIndex=null] - Optional view index to scroll into view.
        */
        showGridView(initialIndex = null) {
            console.log(`GridView: showGridView called, initialIndex: ${initialIndex}`);
            this.showCalled = true;
            this.loadingEnabled = true;
            this.initialIndex = initialIndex;
            const currentTotalImages = this.provider.length;

            this._prepareGridContainer();

            if (currentTotalImages > 0) {
                this.gridContainer.style.display = 'grid';

                let itemsCreated = 0;
                for (let i = 0; i < currentTotalImages; i++) {
                    // Check deletion via provider
                    if (this.provider.isDeleted(i)) {
                        continue;
                    }

                    this.loadingStatus.set(i, 'pending');
                    const gridItem = this._createGridItem(i);

                    this.gridContainer.appendChild(gridItem);
                    itemsCreated++;

                    if (this.gridIntersectionObserver) {
                        this.gridIntersectionObserver.observe(gridItem);
                    }
                }

                requestAnimationFrame(() => {
                    if (initialIndex !== null && initialIndex >= 0 && initialIndex < currentTotalImages) {
                        this.scrollToIndex(initialIndex, false);
                    }
                });

            } else {
                this.gridContainer.innerHTML = '<p style="text-align: center; grid-column: 1 / -1; color: #555; padding: 20px;">No images to display.</p>';
                this.gridContainer.style.display = 'block';
            }

            this.disabled = false;
        }

        /**
         * Scrolls the grid container by the specified amount.
         */
        scrollBy(x, y) {
            if (typeof y === 'number') {
                this.gridContainer.scrollBy(x, y);
            } else {
                this.gridContainer.scrollBy(x);
            }
        }

        /**
         * Returns the grid container element.
         */
        getContainer() {
            return this.gridContainer;
        }

        /**
         * Refreshes all currently displayed grid items.
         */
        refreshAll() {
            console.log("GridView: Refreshing all grid items.");
            const items = Array.from(this.gridContainer.querySelectorAll('[data-index]'));

            items.forEach(gridItem => {
                const index = parseInt(gridItem.dataset.index, 10);
                if (isNaN(index)) return;

                if (this.provider.isDeleted(index)) {
                    // console.log(`GridView [refreshAll]: Item ${index} marked as deleted. Removing grid item.`);
                    if (this.gridIntersectionObserver) {
                        try { this.gridIntersectionObserver.unobserve(gridItem); } catch (e) { /* Ignore */ }
                    }
                    gridItem.remove();
                    this.loadingStatus.delete(index);
                } else {
                    this._updateGridItemImage(gridItem, index);
                }
            });
        }
    }// ----------------------------------------------------------------------------------------------
    // chapterSidebar.js
    // ----------------------------------------------------------------------------------------------

    class ChapterSidebar {
        /**
         * @param {Array} chapterList - Array of chapter objects {index, linkText, description}
         * @param {Object} options - Configuration and callbacks
         * @param {HTMLElement} parentElement - Where to append the sidebar (default: document.body)
         */
        constructor(chapterList, options = {}, parentElement = document.body) {
            this.chapterList = chapterList || [];
            this.parent = parentElement;

            // Default configuration
            this.config = Object.assign({
                sidebarWidth: 300,
                // Callback when a chapter is clicked
                onChapterClick: (index) => console.log('Chapter clicked:', index),
                // Callback for notifications
                onNotify: (msg) => console.log('Notification:', msg),
                // Current index tracker
                currentIndex: -1,

                useGridView: true,
            }, options);

            this.sidebar = null;
            this.clickAwayCleanup = null;
        }

        /**
         * Toggles the visibility of the sidebar
         */
        toggle() {
            if (!this.chapterList || this.chapterList.length === 0) {
                this.config.onNotify("No chapters available");
                return;
            }

            if (!this.sidebar) {
                this._create();
            }

            const isVisible = this.isActive();
            this.sidebar.style.display = isVisible ? 'none' : 'block';

            if (!isVisible) {
                // It is now opening
                this._setupClickAway();
                this._highlightCurrent();
            } else {
                // It is now closing
                this._cleanupClickAway();
            }
        }

        /**
         * Updates the current chapter index and refreshes highlighting
         * @param {Number} index 
         */
        setCurrentIndex(index) {
            this.config.currentIndex = index;
            if (this.isActive()) {
                this._highlightCurrent();
            }
        }

        /**
         * Check if sidebar is currently visible
         */
        isActive() {
            return this.sidebar && this.sidebar.style.display === 'block';
        }

        // ==========================================
        // Internal Private Methods
        // ==========================================

        _create() {
            // Create sidebar container
            this.sidebar = document.createElement('div');
            Object.assign(this.sidebar.style, {
                position: 'fixed',
                top: '0',
                left: '0',
                width: `${this.config.sidebarWidth}px`,
                height: '100vh',
                backgroundColor: 'rgb(24,24,24)',
                color: '#fff',
                overflowY: 'auto',
                padding: '20px',
                boxSizing: 'border-box',
                zIndex: '9999999',
                boxShadow: '2px 0 5px rgba(0,0,0,0.2)',
                display: 'none'
            });

            // Create title
            const title = document.createElement('h3');
            title.textContent = 'Chapters';
            Object.assign(title.style, {
                margin: '0 0 20px 0',
                fontSize: '18px',
                fontWeight: 'bold',
                textAlign: 'center'
            });
            this.sidebar.appendChild(title);

            // Add CSS styles
            const style = document.createElement('style');
            style.textContent = `
            .cs-chapter-table { width: 100%; border-collapse: collapse; }
            .cs-chapter-table tr { border-bottom: 1px solid #333; cursor: pointer; }
            .cs-chapter-table td { padding: 8px; vertical-align: top; }
            .cs-chapter-number {
                text-align: right; font-size: 13px; font-weight: bold;
                color: #f1f1f1; white-space: nowrap; width: 1%;
            }
            .cs-chapter-desc { text-align: left; font-size: 13px; color: #aaa; word-break: break-word; }
            .cs-chapter-table tr:hover .cs-chapter-desc { color: #fff; }
            .cs-chapter-table tr:hover { background-color: rgba(255, 255, 255, 0.03); }
            .cs-chapter-current-highlight td { color: rgba(0, 255, 208, 1); }
        `;
            this.sidebar.appendChild(style);

            if (!this.config.useGridView) {
                this._createTableSidebar();
            } else {
                this._createGridViewSidebar();
            }

            this.parent.appendChild(this.sidebar);
        }

        _createGridViewSidebar() {
            this.gridContainer = document.createElement('div');
            this.gridContainer.className = 'cs-chapter-grid';

            // Keep reference to provider to update current index
            this.provider = new ChapterSubsetProvider(this.chapterList);

            const gridViewConfig = {
                showPageNumbers: false, // Badge over image
                showCaptions: true,    // Text below image
                numColumns: 1,
                fetchFullImages: true,
            }

            this.gridView = new GridView(this.provider, this.gridContainer, gridViewConfig, false);

            this.sidebar.appendChild(this.gridContainer);

            this.gridView.showGridView();
        }

        _createTableSidebar() {
            const table = document.createElement('table');
            table.className = 'cs-chapter-table';

            this.chapterList.forEach((chapter) => {
                const tr = document.createElement('tr');

                tr.addEventListener('click', () => {
                    this.config.onChapterClick(chapter.index);
                });

                // Chapter Number Cell
                const tdNumber = document.createElement('td');
                tdNumber.className = 'cs-chapter-number';
                tdNumber.textContent = chapter.index + 1;

                // Description Cell
                const tdDesc = document.createElement('td');
                tdDesc.className = 'cs-chapter-desc';

                // --- Text Processing Logic ---
                const meta = formatChapterMetadata(chapter);
                if (meta.author) {
                    tdDesc.innerHTML = `${meta.title}<br>${meta.author}`;
                } else {
                    tdDesc.textContent = meta.title;
                }
                // -----------------------------------------------------

                tr.appendChild(tdNumber);
                tr.appendChild(tdDesc);
                table.appendChild(tr);
            });

            this.sidebar.appendChild(table);
        }

        _highlightCurrent() {
            if (!this.isActive()) return;

            if (this.config.useGridView && this.gridView && this.provider) {
                // For Grid View: Update provider state and refresh visual metadata
                this.provider.currentGlobalIndex = this.config.currentIndex;
                this.gridView.updateMetadata();
                return;
            }

            // --- Table View Logic ---
            const rows = this.sidebar.querySelectorAll('.cs-chapter-table tr');
            rows.forEach(row => row.classList.remove('cs-chapter-current-highlight'));

            let currentChapterIdx = null;
            for (let i = 0; i < this.chapterList.length; i++) {
                const chapter = this.chapterList[i];
                if (this.config.currentIndex >= chapter.index) {
                    currentChapterIdx = i;
                } else {
                    break;
                }
            }

            if (currentChapterIdx !== null && rows[currentChapterIdx]) {
                rows[currentChapterIdx].classList.add('cs-chapter-current-highlight');
            }
        }

        _setupClickAway() {
            // Delay adding the event listener slightly so the click that opened 
            // the sidebar doesn't immediately close it.
            setTimeout(() => {
                const clickHandler = (e) => {
                    if (this.isActive() && !this.sidebar.contains(e.target)) {
                        this.toggle();
                    }
                };
                document.addEventListener('click', clickHandler);
                this.clickAwayCleanup = () => document.removeEventListener('click', clickHandler);
            }, 0);
        }

        _cleanupClickAway() {
            if (this.clickAwayCleanup) {
                this.clickAwayCleanup();
                this.clickAwayCleanup = null;
            }
        }
    }/**
 * @typedef {object} MediaResult
 * @property {string} url - The final extracted media URL.
 * @property {string} type - The determined media type ('image', 'video', or a custom type from config).
 * @property {string} sourceUrl - The URL of the page where this media item was found.
 * @property {number} depth - The recursion depth at which this was found (0 is the initial page).
 * @property {Element} [element] - The specific element (img, video, etc.) if extracted directly (might be null/undefined if from deep recursion context).
 */

    /**
     * @typedef {object} CustomSelectorConfig
     * @property {string} selector - The CSS selector or XPath expression.
     * @property {'css' | 'xpath'} type - The type of the selector.
     * @property {string} attribute - Attribute for direct extraction OR attribute with the link URL (if following).
     * @property {string} [mediaType] - Optional: Explicitly define the type label (e.g., 'image', 'video', 'galleryThumb'). If omitted, the extractor attempts to auto-detect 'image' or 'video' based on element or URL; otherwise defaults to 'custom'. This label is applied *after* filtering.
     * @property {RegExp|null} [styleUrlRegex=null] - Optional regex for extracting URL from style attribute. Must contain one capturing group for the URL.
     * @property {boolean} [followLink=false] - If true, use 'attribute' value as URL and fetch recursively.
     * @property {Partial<ExtractorConfig>|null} [nextConfig=null] - Config for the page loaded *after* following the link. Required if followLink is true.
     * @property {Array<string>|null} [allowedMediaTypes=null] - Optional: If followLink is false, only extract if the determined media type (using _determineMediaType) is one of these (e.g., ['video']). If null, extract regardless of type.
     */

    /**
     * @typedef {object} ExtractorConfig
     * @property {boolean} [extractImages=true] - Whether to extract <img> elements on the current level.
     * @property {boolean} [extractVideos=true] - Whether to extract <video> elements on the current level.
     * @property {Array<CustomSelectorConfig>} [customSelectors=[]] - Array of custom selectors.
     * @property {number | null | undefined} [maxDepth] - Optional maximum recursion depth. If null/undefined/Infinity, depth is limited only by config structure and cycle detection. 0 means initial page only.
     * @property {number} [concurrency=5] - How many links to follow in parallel.
     */

    class MediaExtractor {

        /** @type {Required<ExtractorConfig>} */
        static DEFAULT_CONFIG = {
            extractImages: true,
            extractVideos: true,
            customSelectors: [],
            maxDepth: Infinity, // Default to no explicit depth limit
            concurrency: 5
        };

        // Common media file extensions for auto-detection
        static IMAGE_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'ico', 'tif', 'tiff']);
        static VIDEO_EXTENSIONS = new Set(['mp4', 'webm', 'ogg', 'mov', 'avi', 'wmv', 'flv', 'mkv', 'm4v']);

        /**
         * Merges user config with defaults or parent config. Ensures 'maxDepth' is a non-negative number or Infinity.
         * Ignores 'maxDepth' properties within nested nextConfigs during resolution.
         * Inherits 'concurrency' from parentConfig if not specified in userConfig.
         * @param {Partial<ExtractorConfig>} [userConfig={}] The specific config for the current level (e.g., nextConfig).
         * @param {Required<ExtractorConfig>} [parentConfig=null] The resolved config of the parent level (null for the initial call).
         * @returns {Required<ExtractorConfig>} The fully resolved configuration for the current level.
         * @private
         */
        _resolveConfig(userConfig = {}, parentConfig = null) {
            // Start with defaults
            let resolved = { ...MediaExtractor.DEFAULT_CONFIG };

            // 1. Inherit concurrency from parent if userConfig doesn't specify it
            if (userConfig.concurrency === undefined || userConfig.concurrency === null || userConfig.concurrency <= 0) {
                if (parentConfig && parentConfig.concurrency > 0) {
                    resolved.concurrency = parentConfig.concurrency;
                }
                // Otherwise, it keeps the DEFAULT_CONFIG.concurrency
            } else {
                resolved.concurrency = userConfig.concurrency;
            }

            // 2. Merge top-level simple properties (excluding concurrency)
            if (userConfig.extractImages !== undefined) resolved.extractImages = userConfig.extractImages;
            if (userConfig.extractVideos !== undefined) resolved.extractVideos = userConfig.extractVideos;

            // 3. Handle maxDepth specifically (only initial top-level matters for limit)
            if (parentConfig === null) {
                if (userConfig.maxDepth !== undefined && userConfig.maxDepth !== null && userConfig.maxDepth >= 0) {
                    resolved.maxDepth = Number(userConfig.maxDepth);
                } else if (userConfig.hasOwnProperty('maxDepth')) {
                    console.warn(`MediaExtractor: Invalid or null top-level 'maxDepth' provided (${userConfig.maxDepth}). Defaulting to Infinity (no limit).`);
                    resolved.maxDepth = Infinity;
                }
                // Otherwise, it keeps default Infinity
            } else {
                // Inherit parent's resolved maxDepth for structural consistency
                resolved.maxDepth = parentConfig.maxDepth;
            }

            // 4. Merge customSelectors carefully
            resolved.customSelectors = (userConfig.customSelectors || []).map(cs => {
                // Basic structure with defaults
                const resolvedCs = {
                    // No default mediaType here; it's determined later or falls back to 'custom'
                    followLink: false,
                    nextConfig: null,
                    styleUrlRegex: null,
                    allowedMediaTypes: null, // <<< Renamed and default added
                    ...cs // User overrides
                };

                // Validate required fields
                if (!resolvedCs.selector || !resolvedCs.type || !resolvedCs.attribute) {
                    console.error("MediaExtractor: Custom selector is missing required fields (selector, type, attribute):", cs);
                    return null; // Mark for filtering
                }

                // Validate/prepare nextConfig if following link
                if (resolvedCs.followLink && !resolvedCs.nextConfig) {
                    console.warn(`MediaExtractor: Custom selector has followLink=true but no nextConfig. Recursion for this selector will use inherited/default config for the next level. Selector:`, resolvedCs.selector);
                    resolvedCs.nextConfig = {}; // Ensure object exists for next _resolveConfig call
                }

                // Validate styleUrlRegex if provided
                if (resolvedCs.styleUrlRegex && !(resolvedCs.styleUrlRegex instanceof RegExp)) {
                    console.error(`MediaExtractor: Invalid styleUrlRegex (must be a RegExp instance) for selector: ${resolvedCs.selector}`);
                    resolvedCs.styleUrlRegex = null; // Invalidate it
                }

                return resolvedCs;
            }).filter(cs => cs !== null); // Filter out invalid selectors

            return resolved;
        }


        /**
         * Fetches HTML content.
         * @param {string} url
         * @returns {Promise<string>}
         * @private
         */
        async _fetchHtml(url) {
            // In a real userscript, use GM_xmlhttpRequest or GM.xmlHttpRequest
            // For simulation/testing, you might use fetch if CORS allows or a proxy
            console.debug(`MediaExtractor: Fetching ${url}`);
            return new Promise((resolve, reject) => {
                // Assuming GM_xmlhttpRequest is available in the execution context
                if (typeof GM_xmlhttpRequest === 'undefined') {
                    console.error("MediaExtractor: GM_xmlhttpRequest is not available. Cannot fetch URL:", url);
                    return reject(new Error("GM_xmlhttpRequest is not defined. Ensure the script runs in a userscript manager environment (e.g., Tampermonkey, Greasemonkey) with appropriate @grant privileges."));
                }
                GM_xmlhttpRequest({
                    method: "GET",
                    url: url,
                    headers: { // Add some common headers to mimic a browser
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
                        "Accept-Language": "en-US,en;q=0.9",
                    },
                    timeout: 30000, // 30 second timeout
                    onload: function (response) {
                        if (response.status >= 200 && response.status < 400) { // Allow redirects (3xx) usually handled by browser/GM
                            resolve(response.responseText);
                        } else {
                            const errorDetails = response.responseText ? `: ${response.responseText.substring(0, 200)}` : '';
                            reject(new Error(`HTTP error! status: ${response.status} for ${url}${errorDetails}`));
                        }
                    },
                    onerror: function (response) {
                        reject(new Error(`Network error fetching ${url}: ${response.error || 'Unknown error'}`));
                    },
                    ontimeout: function () {
                        reject(new Error(`Request timed out for ${url}`));
                    },
                    onabort: function () {
                        reject(new Error(`Request aborted for ${url}`));
                    }
                });
            });
        }

        /**
         * Extracts a URL from a DOM element attribute or style.
         * @param {Element} element
         * @param {string} attributeName
         * @param {string} baseUrl
         * @param {RegExp|null} [styleUrlRegex=null] - Regex for style attribute extraction. Must have one capturing group.
         * @returns {string|null} The absolute URL or null.
         * @private
         */
        _extractUrlFromAttribute(element, attributeName, baseUrl, styleUrlRegex = null) {
            let rawUrl = null;

            if (attributeName.toLowerCase() === 'style' && styleUrlRegex instanceof RegExp) {
                const styleContent = element.getAttribute('style');
                if (styleContent) {
                    const match = styleContent.match(styleUrlRegex);
                    // Use the first capturing group (index 1)
                    if (match && match[1]) {
                        rawUrl = match[1].trim().replace(/&/g, '&'); // Decode entities just in case
                    }
                }
            } else {
                // Handle data-* attributes correctly
                if (attributeName.startsWith('data-')) {
                    // Convert kebab-case attribute name to camelCase dataset property name
                    const datasetName = attributeName.substring(5).replace(/-([a-z])/g, (g) => g[1].toUpperCase());
                    rawUrl = element.dataset[datasetName];
                    // Fallback to getAttribute if dataset property is undefined (less common but possible)
                    if (rawUrl === undefined) {
                        rawUrl = element.getAttribute(attributeName);
                    }
                } else {
                    rawUrl = element.getAttribute(attributeName);
                }
            }


            if (rawUrl) {
                rawUrl = rawUrl.trim();
                if (rawUrl) {
                    // Skip javascript:, mailto:, #fragment links specifically for 'href'
                    if (attributeName.toLowerCase() === 'href' && /^(javascript:|mailto:|#)/i.test(rawUrl)) {
                        // console.debug(`MediaExtractor: Skipping non-media link: ${rawUrl}`);
                        return null;
                    }
                    try {
                        // Resolve relative URLs against the base URL
                        return new URL(rawUrl, baseUrl).href;
                    } catch (e) {
                        // Ignore invalid URLs
                        console.warn(`MediaExtractor: Skipping invalid URL "${rawUrl}" found in attribute "${attributeName}" on element <${element.tagName.toLowerCase()}> on page ${baseUrl}`, e.message);
                        return null;
                    }
                }
            }
            return null;
        }

        /**
         * Helper to run async tasks with controlled concurrency.
         * @template T
         * @param {Array<() => Promise<T>>} taskFns - Array of functions returning promises.
         * @param {number} concurrency - Max tasks in parallel.
         * @returns {Promise<Array<T | {error: Error}>>} - Promise with results or error objects.
         * @private
         */
        async _runWithConcurrency(taskFns, concurrency) {
            const results = new Array(taskFns.length);
            let taskIndex = 0;
            const totalTasks = taskFns.length;
            const workers = [];
            const effectiveConcurrency = Math.max(1, Math.min(concurrency, totalTasks));

            for (let i = 0; i < effectiveConcurrency; i++) {
                workers.push((async () => {
                    while (taskIndex < totalTasks) {
                        const currentIndex = taskIndex++;
                        const taskFn = taskFns[currentIndex];

                        if (taskFn) {
                            try {
                                results[currentIndex] = await taskFn();
                            } catch (error) {
                                const err = (error instanceof Error) ? error : new Error(String(error || 'Unknown error in concurrent task'));
                                console.error(`MediaExtractor: Error in concurrent task index ${currentIndex}:`, err.message);
                                results[currentIndex] = { error: err }; // Store error marker
                            }
                        }
                    }
                })());
            }

            await Promise.all(workers);
            return results;
        }

        /**
         * Determines the media type based on element tag, URL extension, or falls back.
         * Respects the explicitly provided mediaType from the config.
         * @param {Element} element The source DOM element.
         * @param {string|null} url The extracted URL.
         * @param {string|undefined} [configMediaType] The mediaType specified in the CustomSelectorConfig.
         * @returns {string} The determined media type (e.g., 'image', 'video', 'custom', or configMediaType).
         * @private
         */
        _determineMediaType(element, url, configMediaType) {
            // 1. Explicit Override: If a mediaType is provided in the config, use it.
            if (configMediaType) {
                return configMediaType;
            }

            // 2. Element Type Check: Infer from common media tags.
            const tagName = element.tagName.toUpperCase();
            if (tagName === 'IMG') return 'image';
            if (tagName === 'VIDEO') return 'video';
            // Check <source> specifically if its parent is <video>
            if (tagName === 'SOURCE' && element.closest('video')) return 'video';
            // Could add checks for AUDIO, PICTURE > SOURCE etc. if needed

            // 3. URL Extension Check: Attempt to infer from the URL path.
            if (url) {
                try {
                    const parsedUrl = new URL(url);
                    // Get path without query string or hash
                    const pathname = parsedUrl.pathname;
                    // Extract the last part after '.'
                    const extensionMatch = pathname.match(/\.([^.?#]+)(?:[?#]|$)/);
                    if (extensionMatch && extensionMatch[1]) {
                        const ext = extensionMatch[1].toLowerCase();
                        if (MediaExtractor.IMAGE_EXTENSIONS.has(ext)) return 'image';
                        if (MediaExtractor.VIDEO_EXTENSIONS.has(ext)) return 'video';
                    }
                } catch (e) {
                    // Ignore URL parsing errors; cannot determine type from extension.
                    console.warn(`MediaExtractor: Could not parse URL for extension check: ${url}`, e.message);
                }
            }

            // 4. Fallback: If no type determined, default to 'custom'.
            return 'custom';
        }


        /**
         * Parses HTML, extracts direct media, and identifies tasks for recursive calls based on config structure.
         * @param {string} htmlString
         * @param {string} baseUrl
         * @param {Required<ExtractorConfig>} config - The configuration resolved for THIS level.
         * @param {number} currentDepth
         * @param {number} initialMaxDepth - The maxDepth value set at the START of the crawl (can be Infinity).
         * @param {Set<string>} visitedUrls - Set of URLs visited in the current crawl path.
         * @returns {Promise<{directResults: Array<MediaResult>, followTasks: Array<() => Promise<Array<MediaResult>>>}>}
         * @private
         */
        async _parseHtmlAndIdentifyTasks(htmlString, baseUrl, config, currentDepth, initialMaxDepth, visitedUrls) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlString, 'text/html');
            const directResults = [];
            const followTasks = [];

            // Use a Map to associate elements with the rules that matched them
            // Key: Element, Value: Array<{source: 'img'|'video'|'custom', configIndex?: number}>
            const candidateElements = new Map();
            const addCandidate = (element, sourceInfo) => {
                if (!candidateElements.has(element)) {
                    candidateElements.set(element, []);
                }
                candidateElements.get(element).push(sourceInfo);
            };

            // 1. Standard image/video extraction
            if (config.extractImages) {
                doc.querySelectorAll('img[src]').forEach(el => addCandidate(el, { source: 'img' }));
            }
            if (config.extractVideos) {
                doc.querySelectorAll('video').forEach(el => {
                    // Check video[src] OR video > source[src]
                    if (el.hasAttribute('src') || el.querySelector('source[src]')) {
                        addCandidate(el, { source: 'video' });
                    }
                });
            }

            // 2. Custom selector processing
            config.customSelectors.forEach((customConfig, index) => {
                if (!customConfig.selector || !customConfig.type || !customConfig.attribute) return; // Already validated in _resolveConfig, but check again

                try {
                    let nodes = [];
                    if (customConfig.type === 'css') {
                        nodes = Array.from(doc.querySelectorAll(customConfig.selector));
                    } else if (customConfig.type === 'xpath') {
                        const xpathResult = doc.evaluate(customConfig.selector, doc, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
                        let node;
                        while ((node = xpathResult.iterateNext())) {
                            if (node instanceof Element) {
                                nodes.push(node);
                            }
                        }
                    }

                    nodes.forEach(el => {
                        if (el instanceof Element) { // Ensure it's an element
                            addCandidate(el, { source: 'custom', configIndex: index });
                        }
                    });
                } catch (e) {
                    console.error(`MediaExtractor: Error processing custom selector ${customConfig.type}: "${customConfig.selector}" on ${baseUrl}`, e);
                }
            });

            // 3. Sort elements by document order for predictable processing
            const sortedElements = Array.from(candidateElements.keys()).sort((a, b) => {
                const position = a.compareDocumentPosition(b);
                if (position & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
                if (position & Node.DOCUMENT_POSITION_PRECEDING) return 1;
                return 0;
            });


            // 4. Process sorted elements, prioritizing custom rules and avoiding duplicate processing per element
            for (const element of sortedElements) {
                const matchingSources = candidateElements.get(element);
                let processedForDirectMedia = false; // Found media URL directly from this element?
                let processedForLinkFollow = false; // Followed a link from this element?

                // --- Check Custom Rules First ---
                for (const sourceInfo of matchingSources) {
                    if (sourceInfo.source === 'custom') {
                        const customConfig = config.customSelectors[sourceInfo.configIndex];
                        if (!customConfig) continue; // Should not happen

                        // A. Handle Link Following
                        if (customConfig.followLink) {
                            if (processedForLinkFollow) continue; // Only follow one link per element

                            const linkUrl = this._extractUrlFromAttribute(element, customConfig.attribute, baseUrl);

                            if (linkUrl && !visitedUrls.has(linkUrl)) {
                                if (currentDepth + 1 >= initialMaxDepth) {
                                    // Depth limit reached, don't queue
                                } else {
                                    visitedUrls.add(linkUrl); // Mark visited *before* queueing task
                                    processedForLinkFollow = true;

                                    const taskFn = () => {
                                        const resolvedNextConfig = this._resolveConfig(customConfig.nextConfig || {}, config);
                                        return this._processUrlRecursive(
                                            linkUrl,
                                            resolvedNextConfig,
                                            currentDepth + 1,
                                            initialMaxDepth,
                                            new Set(visitedUrls) // Pass a copy for branch isolation
                                        );
                                    };
                                    followTasks.push(taskFn);
                                }
                            } else if (linkUrl && visitedUrls.has(linkUrl)) {
                                // Already visited on this path
                            }
                            // Link following typically takes precedence over direct extraction *from the same rule*.
                            // If a different rule extracts media directly, that's handled below.
                        }
                        // B. Handle Direct Media Extraction (Custom Rule)
                        else { // customConfig.followLink is false
                            if (processedForDirectMedia) continue; // Already got media from this element

                            const mediaUrl = this._extractUrlFromAttribute(element, customConfig.attribute, baseUrl, customConfig.styleUrlRegex);
                            if (mediaUrl) {
                                // Determine the potential media type *before* adding
                                const potentialType = this._determineMediaType(element, mediaUrl, customConfig.mediaType);

                                // <<< START: Apply the allowedMediaTypes filter >>>
                                let shouldExtract = true; // Assume yes by default
                                // Check if the filter is defined and is an array
                                if (customConfig.allowedMediaTypes && Array.isArray(customConfig.allowedMediaTypes)) {
                                    // Check if the determined type is NOT in the allowed list
                                    if (!customConfig.allowedMediaTypes.includes(potentialType)) {
                                        // console.debug(`MediaExtractor: Skipping ${mediaUrl} - type '${potentialType}' not in allowedMediaTypes [${customConfig.allowedMediaTypes.join(', ')}] for selector ${customConfig.selector}`);
                                        shouldExtract = false; // Type not allowed, skip it
                                    }
                                }
                                // <<< END: Apply the allowedMediaTypes filter >>>

                                if (shouldExtract) {
                                    directResults.push({
                                        url: mediaUrl,
                                        type: potentialType, // Use the type determined (respecting configMediaType override within _determineMediaType)
                                        sourceUrl: baseUrl,
                                        depth: currentDepth,
                                        element: element
                                    });
                                    processedForDirectMedia = true;
                                }
                            }
                        }
                    }
                } // End loop through custom sources for this element

                // --- Standard Element Processing (if not already handled by custom rule) ---
                if (!processedForDirectMedia) {
                    const isVideoTag = matchingSources.some(s => s.source === 'video');
                    const isImageTag = matchingSources.some(s => s.source === 'img');

                    // Standard Video: Check <video src> then <source src>
                    if (isVideoTag && config.extractVideos) { // Check config again
                        let videoUrl = this._extractUrlFromAttribute(element, 'src', baseUrl);
                        if (!videoUrl) {
                            const sourceElements = element.querySelectorAll('source[src]');
                            for (const sourceElement of sourceElements) {
                                videoUrl = this._extractUrlFromAttribute(sourceElement, 'src', baseUrl);
                                if (videoUrl) break; // Use first valid source
                            }
                        }
                        if (videoUrl) {
                            // Type is inherently 'video' here
                            directResults.push({ url: videoUrl, type: 'video', sourceUrl: baseUrl, depth: currentDepth, element: element });
                            processedForDirectMedia = true;
                        }
                    }

                    // Standard Image: Check <img src> (only if not already processed)
                    if (!processedForDirectMedia && isImageTag && config.extractImages) { // Check config again
                        const imgUrl = this._extractUrlFromAttribute(element, 'src', baseUrl);
                        if (imgUrl) {
                            // Type is inherently 'image' here
                            directResults.push({ url: imgUrl, type: 'image', sourceUrl: baseUrl, depth: currentDepth, element: element });
                            processedForDirectMedia = true;
                        }
                    }
                }
            } // End loop through sorted elements

            return { directResults, followTasks };
        }


        /**
         * Internal recursive method. Checks depth limit against initialMaxDepth.
         * Uses a copy of visitedUrls for each branch.
         * @param {string} url
         * @param {Required<ExtractorConfig>} config - Config resolved for THIS level.
         * @param {number} currentDepth
         * @param {number} initialMaxDepth - The maxDepth from the initial call (can be Infinity).
         * @param {Set<string>} visitedUrlsOnPath - Set of URLs visited on the *current specific branch* of the crawl.
         * @returns {Promise<Array<MediaResult>>}
         * @private
         */
        async _processUrlRecursive(url, config, currentDepth, initialMaxDepth, visitedUrlsOnPath) {
            // --- Depth Check ---
            if (currentDepth >= initialMaxDepth) {
                if (initialMaxDepth !== Infinity) {
                    console.debug(`MediaExtractor: Max depth (${initialMaxDepth}) reached at depth ${currentDepth}. Stopping branch at ${url}.`);
                }
                return [];
            }

            // --- Cycle Check --- (Handled before call via visitedUrls.add)

            try {
                console.log(`MediaExtractor: [Depth ${currentDepth}] Fetching and processing: ${url} (Concurrency: ${config.concurrency})`);
                const htmlContent = await this._fetchHtml(url);
                console.log(htmlContent);

                // Parse, extract direct media, identify next tasks
                const { directResults, followTasks } = await this._parseHtmlAndIdentifyTasks(
                    htmlContent,
                    url,
                    config,
                    currentDepth,
                    initialMaxDepth,
                    visitedUrlsOnPath // Pass the set for this path
                );

                // --- Execute recursive calls concurrently ---
                let nestedResults = [];
                if (followTasks.length > 0) {
                    const effectiveConcurrency = config.concurrency;
                    console.log(`MediaExtractor: [Depth ${currentDepth}] Following ${followTasks.length} links from ${url} (Concurrency: ${effectiveConcurrency})...`);
                    const taskResults = await this._runWithConcurrency(followTasks, effectiveConcurrency);
                    nestedResults = taskResults.filter(r => r && !r.error).flat(); // Flatten results, filter errors
                    console.log(`MediaExtractor: [Depth ${currentDepth}] Finished following ${followTasks.length} links from ${url}. Found ${nestedResults.length} nested items.`);
                }

                // Combine results from this page and nested calls
                return [...directResults, ...nestedResults];

            } catch (error) {
                console.error(`MediaExtractor: [Depth ${currentDepth}] Failed to process URL ${url}:`, error.message);
                // console.error(error); // Optional: Log full stack trace
                return []; // Return empty for this failed branch
            }
        }

        /**
         * PUBLIC METHOD: Initiates the recursive extraction.
         * @param {string} url - The initial URL.
         * @param {Partial<ExtractorConfig>} [userConfig={}] - User configuration.
         * @returns {Promise<Array<MediaResult>>} A promise resolving to an array of found media results.
         */
        async extractFromUrl(url, userConfig = {}) {
            console.log(`MediaExtractor: Starting extraction from ${url}`);

            // 1. Resolve initial config and determine the effective max depth limit
            const initialConfig = this._resolveConfig(userConfig, null);
            const effectiveMaxDepth = initialConfig.maxDepth; // Number or Infinity

            if (effectiveMaxDepth !== Infinity) {
                console.log(`MediaExtractor: Configured with maxDepth limit: ${effectiveMaxDepth}`);
            } else {
                console.log(`MediaExtractor: No explicit maxDepth limit. Depth controlled by config structure and cycle detection.`);
            }

            // 2. Initialize visited set for the starting path
            const initialVisitedUrls = new Set();
            try {
                // Normalize starting URL before adding
                const startUrl = new URL(url).href;
                initialVisitedUrls.add(startUrl);

                // 3. Start the recursive process
                const allMediaResults = await this._processUrlRecursive(
                    startUrl,
                    initialConfig,
                    0,             // Start depth
                    effectiveMaxDepth,
                    initialVisitedUrls
                );

                console.log(`MediaExtractor: Extraction complete. Found ${allMediaResults.length} total media items starting from ${url}.`);
                if (allMediaResults.length === 0 && effectiveMaxDepth !== 0) {
                    console.log("MediaExtractor: Hint - If 0 results, check config (selectors, attributes, followLink structure), network logs (F12) for fetch errors/redirects, or website structure changes.");
                }

                // Optional: Deduplicate results based on URL if needed
                // const uniqueResults = Array.from(new Map(allMediaResults.map(item => [item.url, item])).values());
                // return uniqueResults;
                return allMediaResults;

            } catch (error) {
                // Catch errors during initial setup (e.g., invalid initial URL) or the top-level process call
                console.error(`MediaExtractor: Critical failure during extraction starting from ${url}:`, error.message);
                console.error(error);
                return []; // Return empty on critical failure
            }
        }
    } const CONFIG_STORAGE_PREFIX = 'mediaExtractorConfig_';
    const CONFIG_LIST_KEY = 'mediaExtractorConfig_list';
    const CONFIG_LAST_USED_KEY = 'mediaExtractorConfig_lastUsed';

    class MediaExtractorUI {
        /**
         * @param {string} [containerId=null] - Optional ID of the HTML element to render into.
         *                                      If null, UI will be rendered in a centered modal overlay.
         */
        constructor(containerId = null) {
            this.targetElement = null;
            if (containerId) {
                this.targetElement = document.getElementById(containerId);
                if (!this.targetElement) {
                    throw new Error(`MediaExtractorUI: Container element with ID "${containerId}" not found.`);
                }
            }
            this.extractor = new MediaExtractor(); // Assuming MediaExtractor is available
            this.uniqueIdCounter = 0;
            this._isShown = false;
            this.uiRoot = null; // Will hold the main UI container element (inside modal or target)
            this.overlayElement = null; // For modal mode
            this.modalElement = null; // For modal mode
            this.boundKeyHandler = this._handleKeyPress.bind(this); // Bind escape handler
            this.extractionCompleteCallbacks = []; // Initialize callbacks array

            // --- Define the UI structure ---

            // Definition for top-level ExtractorConfig fields
            // NOTE: maxDepth was removed previously
            this.TOP_LEVEL_CONFIG_FIELDS = [
                { key: 'extractImages', label: 'Extract <img> tags', type: 'checkbox', defaultValue: true },
                { key: 'extractVideos', label: 'Extract <video> tags', type: 'checkbox', defaultValue: true },
                { key: 'concurrency', label: 'Concurrency:', type: 'number', defaultValue: 5, min: 1 },
                // The 'customSelectors' field is handled specially by _renderCustomSelectorList
            ];

            this.CUSTOM_SELECTOR_FIELDS = [
                { key: 'selector', label: 'Selector (CSS or XPath):', type: 'text', placeholder: 'e.g., .my-image a', required: true },
                { key: 'type', label: 'Selector Type:', type: 'select', options: { css: 'CSS', xpath: 'XPath' }, defaultValue: 'css', required: true },
                { key: 'attribute', label: 'Attribute (for URL/Link):', type: 'text', placeholder: 'e.g., href, src, data-src, style', required: true },
                {
                    key: 'styleUrlRegex', label: 'Style Regex (if attr=style):', type: 'text', placeholder: 'e.g., url\\(["\']?(.*?)["\']?\\)',
                    valueGetter: (input) => input.value.trim() ? new RegExp(input.value.trim()) : null,
                    valueSetter: (value) => value instanceof RegExp ? value.source : ''
                },
                // --- MOVED & MODIFIED ---
                {
                    key: 'allowedMediaTypes',
                    label: 'Extract Only If URL is..',
                    type: 'select',
                    options: { // Key: value sent to valueGetter/received from valueSetter, Value: Display text
                        'all': 'Any',
                        'image': 'Image',
                        'video': 'Video'
                    },
                    defaultValue: 'all', // UI default corresponds to 'all'
                    // helpText: '...', // <<< Removed helpText
                    valueGetter: (selectElement) => {
                        switch (selectElement.value) {
                            case 'image': return ['image'];
                            case 'video': return ['video'];
                            case 'all':
                            default: return null; // null means no filtering
                        }
                    },
                    valueSetter: (value) => {
                        if (Array.isArray(value)) {
                            if (value.includes('image') && value.length === 1) return 'image';
                            if (value.includes('video') && value.length === 1) return 'video';
                        }
                        return 'all'; // Default to 'all' if null or unrecognized array
                    }
                },
                // --- Follow Link now comes after Allowed Types ---
                {
                    key: 'followLink', label: 'Follow Link (Extract from linked page)', type: 'checkbox', defaultValue: false,
                    onChange: this._handleFollowLinkChange // Keep existing handler
                }
                // 'nextConfig' is handled implicitly when 'followLink' is true
            ];
        }

        // --- Core Methods (render, close, _addStyles) ---

        _getNextId() {
            return `me-ui-${this.uniqueIdCounter++}`;
        }

        _addStyles() {
            const styleId = 'media-extractor-ui-styles';
            if (document.getElementById(styleId)) return;

            const css = `
            /* Basic UI styles */
            .media-extractor-ui {
                font-family: sans-serif;
                border: 1px solid #444; /* Darker border */
                padding: 15px;
                border-radius: 5px;
                background-color: #333; /* Dark gray background */
                color: #eee; /* Light text color */
                margin: 0; /* Reset margin for modal context */
            }
            .media-extractor-ui fieldset { border: 1px solid #555; padding: 10px; margin-bottom: 15px; border-radius: 4px; }
            .media-extractor-ui legend { font-weight: bold; padding: 0 5px; color: #eee; } /* Light legend color */
            .media-extractor-ui label { display: block; margin-bottom: 3px; font-size: 0.9em; color: #ccc; } /* Lighter label color */
            .media-extractor-ui .field-wrapper { margin-bottom: 0.75em; }
            .media-extractor-ui .field-wrapper label { display: block; margin-bottom: 3px; font-size: 0.9em; color: #ccc;} /* Lighter label color */
            .media-extractor-ui .field-wrapper.checkbox-field label { display: inline-block; margin-left: 5px; vertical-align: middle;}
             /* Adjust alignment for checkbox */
            .media-extractor-ui .field-wrapper.checkbox-field input[type="checkbox"] {
                 vertical-align: middle;
                 margin-right: 0; /* Remove default margin if label handles spacing */
            }

            .media-extractor-ui input[type="text"],
            .media-extractor-ui input[type="number"],
            .media-extractor-ui select,
            .media-extractor-ui textarea {
                width: 95%; padding: 6px; margin-bottom: 2px; /* Smaller bottom margin */
                border: 1px solid #666; /* Slightly darker border */
                border-radius: 3px; box-sizing: border-box;
                background-color: #444; /* Darker input background */
                color: #eee; /* Light input text */
            }
             /* Reduce bottom margin specifically for text/number/select/textarea inside the wrapper */
            .media-extractor-ui .field-wrapper input[type="text"],
            .media-extractor-ui .field-wrapper input[type="number"],
            .media-extractor-ui .field-wrapper select,
            .media-extractor-ui .field-wrapper textarea {
                 margin-bottom: 2px;
            }

            .media-extractor-ui .config-section { padding: 10px; margin-top: 10px; background-color: #3a3a3a; border-radius: 3px; } /* Slightly lighter section bg */
            .media-extractor-ui .custom-selector-group { border: 1px solid #555; padding: 10px 10px 15px 10px; margin-bottom: 10px; background-color: #383838; position: relative; border-radius: 4px; } /* Slightly lighter group bg */
            .media-extractor-ui .custom-selector-group legend { font-size: 0.95em; font-weight: normal; color: #ddd; } /* Lighter legend */
            .media-extractor-ui .nested-config { margin-left: 20px; padding-left: 15px; border-left: 2px solid #007bff; margin-top: 10px; display: none; /* Hidden by default */ }
            .media-extractor-ui button { padding: 8px 15px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 5px; font-size: 1em; }
            .media-extractor-ui button:hover { background-color: #0056b3; }
            .media-extractor-ui .remove-button { background-color: #dc3545; font-size: 0.8em; padding: 3px 8px; position: absolute; top: 5px; right: 5px; }
            .media-extractor-ui .remove-button:hover { background-color: #c82333; }
            .media-extractor-ui .add-button { background-color: #28a745; font-size: 0.9em; padding: 5px 10px; margin-top: 10px; }
            .media-extractor-ui .add-button:hover { background-color: #218838; }
            .media-extractor-ui .output-area { margin-top: 15px; padding: 10px; background-color: #444; border: 1px solid #666; border-radius: 4px; font-family: monospace; white-space: pre-wrap; word-wrap: break-word; min-height: 50px; max-height: 200px; overflow-y: auto; color: #ccc; } /* Darker output, lighter text */
            .media-extractor-ui .output-area.extracting { color: #66aaff; } /* Lighter blue */
            .media-extractor-ui .output-area.error { color: #ff8080; font-weight: bold; } /* Lighter red */
            .media-extractor-ui .output-area.success { color: #80ff80; } /* Lighter green */
            .media-extractor-ui .config-options-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; margin-bottom: 10px; }
            .media-extractor-ui .custom-selector-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; }
            .media-extractor-ui .field-help-text { font-size: 0.8em; color: #aaa; margin-top: 2px; } /* Adjust help text color */

            /* Config Management styles */
            .media-extractor-ui .config-management {
                display: flex;
                flex-wrap: wrap; /* Allow wrapping on smaller screens */
                align-items: center; /* Align items vertically */
                gap: 10px; /* Spacing between elements */
                padding: 10px;
                background-color: #3a3a3a; /* Match config section */
                border-radius: 3px;
                margin-bottom: 15px; /* Space below this section */
            }
            .media-extractor-ui .config-management label {
                margin-bottom: 0; /* Remove default bottom margin */
                margin-right: 5px; /* Space after label */
                font-size: 0.9em;
                 color: #ccc;
            }
            .media-extractor-ui .config-management select,
            .media-extractor-ui .config-management input[type="text"] {
                flex-grow: 1; /* Allow select and input to take available space */
                width: auto; /* Override default width */
                min-width: 150px; /* Ensure minimum width */
                 padding: 5px; /* Slightly smaller padding */
                 margin-bottom: 0; /* Remove default bottom margin */
                 font-size: 0.9em;
            }
             .media-extractor-ui .config-management input[type="text"] {
                 /* Specific styling for save name input */
                 background-color: #444;
                 border: 1px solid #666;
                 color: #eee;
             }
            .media-extractor-ui .config-management button {
                padding: 5px 10px; /* Smaller button padding */
                font-size: 0.9em; /* Smaller font size */
                margin: 0 2px; /* Adjust margin */
                flex-shrink: 0; /* Prevent buttons from shrinking too much */
            }
             .media-extractor-ui .config-management .delete-config-button {
                 background-color: #dc3545;
             }
             .media-extractor-ui .config-management .delete-config-button:hover {
                 background-color: #c82333;
             }
            .media-extractor-ui .config-management .config-status {
                font-size: 0.85em;
                color: #aaa;
                margin-left: 10px; /* Space from buttons */
                flex-basis: 100%; /* Force status to new line if needed */
                text-align: left; /* Align left */
            }

            /* Modal specific styles */
            .media-extractor-overlay {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background-color: rgba(0, 0, 0, 0.7); /* Slightly darker overlay */
                display: flex;
                justify-content: center; align-items: center; z-index: 9999999;
                padding: 20px; box-sizing: border-box;
            }
            .media-extractor-modal {
                /* Background handled by inner .media-extractor-ui now */
                padding: 0; /* Padding applied to inner */
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.4); /* Adjust shadow */
                max-width: 95%;
                width: 850px; max-height: 90vh; overflow-y: auto; position: relative;
                background-color: #333; /* Set modal background same as UI */
                border: 1px solid #444; /* Match border */
            }
            .media-extractor-modal-close {
                position: absolute; top: 8px; right: 12px; font-size: 1.8em;
                font-weight: bold; color: #aaa; background: none; border: none;
                cursor: pointer; line-height: 1; padding: 0 5px; z-index: 1; /* Ensure button is clickable */
            }
            .media-extractor-modal-close:hover { color: #fff; } /* Brighter hover */

            .media-extractor-ui .field-wrapper.field-disabled-by-follow label,
            .media-extractor-ui .field-wrapper.field-disabled-by-follow select:disabled {
                color: #777; /* Dim the label */
                cursor: not-allowed;
            }
            .media-extractor-ui .field-wrapper.field-disabled-by-follow select:disabled {
                background-color: #555; /* Darker background for disabled select */
                opacity: 0.7;
            }
        `;
            const styleElement = document.createElement('style');
            styleElement.id = styleId;
            styleElement.textContent = css;
            document.head.appendChild(styleElement);
        }

        isShown() {
            return this._isShown;
        }

        render() {
            this._addStyles();
            this.close(); // Clear previous modal if exists
            this._isShown = true;

            if (this.targetElement) {
                // ... (rendering into target element, no escape listener needed)
                this.targetElement.innerHTML = '';
                this.uiRoot = document.createElement('div');
                this.uiRoot.classList.add('media-extractor-ui');
                this._buildUIContent(this.uiRoot);
                this.targetElement.appendChild(this.uiRoot);
                this._loadLastUsedConfig(); // Load last used config after building

            } else { // Render into a modal
                this.overlayElement = document.createElement('div');
                this.overlayElement.classList.add('media-extractor-overlay');
                this.overlayElement.addEventListener('click', (e) => {
                    if (e.target === this.overlayElement) this.close();
                });

                this.modalElement = document.createElement('div');
                this.modalElement.classList.add('media-extractor-modal');

                // uiRoot container now inside modal
                this.uiRoot = document.createElement('div');
                this.uiRoot.classList.add('media-extractor-ui');

                const closeButton = document.createElement('button');
                closeButton.type = 'button';
                closeButton.classList.add('media-extractor-modal-close');
                closeButton.innerHTML = '×';
                closeButton.title = 'Close (Esc)'; // Hint for escape key
                closeButton.onclick = () => this.close();
                this.modalElement.appendChild(closeButton); // Append to modal, not uiRoot

                this._buildUIContent(this.uiRoot); // Build inside uiRoot

                this.modalElement.appendChild(this.uiRoot); // Add uiRoot content to modal
                this.overlayElement.appendChild(this.modalElement);
                document.body.appendChild(this.overlayElement);

                // Add Escape key listener for modal mode
                document.addEventListener('keydown', this.boundKeyHandler);

                this._loadLastUsedConfig(); // Load last used config after building
            }
        }

        close() {
            if (this.overlayElement && this.overlayElement.parentNode) {
                this.overlayElement.parentNode.removeChild(this.overlayElement);
                // Remove Escape key listener when closing
                document.removeEventListener('keydown', this.boundKeyHandler);
            }
            this.overlayElement = null;
            this.modalElement = null;
            this._isShown = false;
            // If rendering into target, don't clear uiRoot unless desired
            // If modal, clearing uiRoot isn't strictly necessary as it's removed with the modal
        }

        // --- UI Building ---

        /**
         * Builds the main form structure within the parent element.
         * @param {HTMLElement} parentElement - Usually this.uiRoot.
         * @private
         */
        _buildUIContent(parentElement) {
            parentElement.innerHTML = ''; // Clear previous content

            const form = document.createElement('form');
            form.addEventListener('submit', (e) => e.preventDefault());

            // --- Configuration Management Section ---
            const configMgmtFieldset = document.createElement('fieldset');
            configMgmtFieldset.innerHTML = '<legend>Configuration Management</legend>';
            const configMgmtDiv = document.createElement('div');
            configMgmtDiv.classList.add('config-management');
            configMgmtDiv.dataset.role = 'config-management-area';

            // Dropdown for saved configs
            const selectLabel = document.createElement('label');
            selectLabel.htmlFor = this._getNextId() + '-config-select';
            selectLabel.textContent = 'Saved Configs:';
            const configSelect = document.createElement('select');
            configSelect.id = selectLabel.htmlFor;
            configSelect.dataset.role = 'config-select';
            configSelect.innerHTML = '<option value="">--- Select Config ---</option>'; // Default option

            // Input for naming config
            const saveNameLabel = document.createElement('label');
            saveNameLabel.htmlFor = this._getNextId() + '-config-save-name';
            saveNameLabel.textContent = 'Save/Update As:';
            const configSaveName = document.createElement('input');
            configSaveName.type = 'text';
            configSaveName.id = saveNameLabel.htmlFor;
            configSaveName.dataset.role = 'config-save-name';
            configSaveName.placeholder = 'Enter config name';

            // Buttons
            // --- REMOVED Load Button ---
            // const loadButton = document.createElement('button');
            // loadButton.type = 'button';
            // loadButton.textContent = 'Load';
            // loadButton.dataset.role = 'load-config-btn';
            // loadButton.onclick = () => this._handleLoadConfigClick(); // Removed

            const saveButton = document.createElement('button');
            saveButton.type = 'button';
            saveButton.textContent = 'Save';
            saveButton.dataset.role = 'save-config-btn';
            saveButton.onclick = () => this._handleSaveConfigClick();

            const deleteButton = document.createElement('button');
            deleteButton.type = 'button';
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('delete-config-button');
            deleteButton.dataset.role = 'delete-config-btn';
            deleteButton.onclick = () => this._handleDeleteConfigClick();

            // Status message area
            const statusSpan = document.createElement('span');
            statusSpan.classList.add('config-status');
            statusSpan.dataset.role = 'config-status-message';
            statusSpan.textContent = ''; // Initially empty

            // --- MODIFIED: Add listener to load config instantly and update save name ---
            configSelect.addEventListener('change', this._handleConfigSelectChange.bind(this));


            configMgmtDiv.appendChild(selectLabel);
            configMgmtDiv.appendChild(configSelect);
            // configMgmtDiv.appendChild(loadButton); // Removed
            configMgmtDiv.appendChild(saveNameLabel);
            configMgmtDiv.appendChild(configSaveName);
            configMgmtDiv.appendChild(saveButton);
            configMgmtDiv.appendChild(deleteButton);
            configMgmtDiv.appendChild(statusSpan);
            configMgmtFieldset.appendChild(configMgmtDiv);
            form.appendChild(configMgmtFieldset);

            // --- Start URL Section (existing) ---
            const urlFieldset = document.createElement('fieldset');
            urlFieldset.innerHTML = '<legend>Start URL</legend>';
            const urlLabel = document.createElement('label');
            const urlInputId = this._getNextId() + '-start-url';
            urlLabel.htmlFor = urlInputId;
            urlLabel.textContent = 'Enter the initial URL to extract from:';
            const urlInput = document.createElement('input');
            urlInput.type = 'text';
            urlInput.id = urlInputId;
            urlInput.placeholder = 'https://example.com/page';
            urlInput.required = true;
            urlInput.dataset.role = 'start-url-input'; // Add role for easier selection
            urlFieldset.appendChild(urlLabel);
            urlFieldset.appendChild(urlInput);
            form.appendChild(urlFieldset);

            // --- Top Level Configuration Section (existing) ---
            const topLevelFieldset = document.createElement('fieldset');
            topLevelFieldset.innerHTML = '<legend>Extraction Configuration (Top Level)</legend>';
            topLevelFieldset.dataset.role = 'top-level-config-fieldset'; // Add role
            const topLevelConfigDiv = document.createElement('div');
            topLevelConfigDiv.classList.add('config-section', 'config-options-grid'); // Use grid layout
            topLevelConfigDiv.dataset.depth = '0'; // Mark depth
            this._renderConfigSection(
                topLevelConfigDiv,
                this.TOP_LEVEL_CONFIG_FIELDS,
                MediaExtractor.DEFAULT_CONFIG, // Initial defaults
                0
            );
            topLevelFieldset.appendChild(topLevelConfigDiv);
            form.appendChild(topLevelFieldset);

            // --- Custom Selectors Section (existing) ---
            const csFieldset = document.createElement('fieldset');
            csFieldset.innerHTML = `<legend>Custom Selectors</legend>`;
            csFieldset.dataset.role = 'custom-selectors-fieldset'; // Add role
            this._renderCustomSelectorList(csFieldset, MediaExtractor.DEFAULT_CONFIG.customSelectors || [], 0);
            form.appendChild(csFieldset);

            // --- Controls & Output (existing) ---
            const controlsFieldset = document.createElement('fieldset');
            controlsFieldset.innerHTML = '<legend>Control & Output</legend>';
            this._renderControls(controlsFieldset);
            form.appendChild(controlsFieldset);

            parentElement.appendChild(form);

            // Populate the config dropdown after the UI is built
            this._populateConfigDropdown();
            // NOTE: Loading last used config is now handled in render() after this function completes
        }

        /**
      * Renders a configuration section based on a field definition array.
      * @param {HTMLElement} parentElement - The container element for this section.
      * @param {Array<object>} fieldsDefinition - Array describing the fields.
      * @param {object} currentConfigData - The current data object for this config level.
      * @param {number} depth - The current nesting depth (0 for top level).
      * @param {object} [sectionDataAttributes={}] - Optional data attributes for the section.
      * @private
      */
        _renderConfigSection(parentElement, fieldsDefinition, currentConfigData, depth, sectionDataAttributes = {}) {
            // Add data attributes to the parent element itself
            for (const attr in sectionDataAttributes) {
                parentElement.dataset[attr] = sectionDataAttributes[attr];
            }

            fieldsDefinition.forEach(fieldDef => {
                // Skip fields handled elsewhere (like customSelectors list itself)
                if (fieldDef.key === 'customSelectors' || fieldDef.key === 'nextConfig') {
                    return;
                }
                // Skip concurrency field if rendering a nested config (depth > 0)
                if (fieldDef.key === 'concurrency' && depth > 0) {
                    return;
                }

                // Get the current value for this field
                const currentValue = currentConfigData?.[fieldDef.key] ?? fieldDef.defaultValue;

                // Create and append the field
                this._renderFormField(parentElement, fieldDef, currentValue, depth);
            });
        }

        /**
         * Renders a single form field based on its definition.
         * @param {HTMLElement} parentElement - The container to append the field to.
         * @param {object} fieldDef - The field definition object.
         * @param {*} currentValue - The current value for the field.
         * @param {number} depth - Current nesting depth.
         * @private
         */
        _renderFormField(parentElement, fieldDef, currentValue, depth) {
            const wrapper = document.createElement('div');
            wrapper.classList.add('field-wrapper');
            const fieldId = this._getNextId() + '-' + fieldDef.key;

            let inputElement;
            const label = document.createElement('label');
            label.htmlFor = fieldId;
            label.textContent = fieldDef.label;

            switch (fieldDef.type) {
                case 'checkbox':
                    wrapper.classList.add('checkbox-field'); // Add class for specific styling
                    inputElement = document.createElement('input');
                    inputElement.type = 'checkbox';
                    inputElement.checked = currentValue === true;
                    // Place checkbox before label for common layout
                    wrapper.appendChild(inputElement);
                    wrapper.appendChild(label); // Label now appears after checkbox
                    break;

                case 'select':
                    inputElement = document.createElement('select');
                    for (const value in fieldDef.options) {
                        const option = document.createElement('option');
                        option.value = value;
                        option.textContent = fieldDef.options[value];
                        if (value === currentValue) {
                            option.selected = true;
                        }
                        inputElement.appendChild(option);
                    }
                    wrapper.appendChild(label);
                    wrapper.appendChild(inputElement);
                    break;

                case 'number':
                    inputElement = document.createElement('input');
                    inputElement.type = 'number';
                    if (fieldDef.min !== undefined) inputElement.min = fieldDef.min;
                    if (fieldDef.max !== undefined) inputElement.max = fieldDef.max;
                    if (fieldDef.step !== undefined) inputElement.step = fieldDef.step;
                    inputElement.placeholder = fieldDef.placeholder || '';
                    // Use valueSetter if provided, otherwise default behavior
                    inputElement.value = fieldDef.valueSetter ? fieldDef.valueSetter(currentValue) : (currentValue ?? '');
                    wrapper.appendChild(label);
                    wrapper.appendChild(inputElement);
                    break;

                case 'textarea':
                    inputElement = document.createElement('textarea');
                    inputElement.rows = fieldDef.rows || 3;
                    inputElement.placeholder = fieldDef.placeholder || '';
                    inputElement.value = fieldDef.valueSetter ? fieldDef.valueSetter(currentValue) : (currentValue ?? '');
                    wrapper.appendChild(label);
                    wrapper.appendChild(inputElement);
                    break;

                case 'text':
                default:
                    inputElement = document.createElement('input');
                    inputElement.type = 'text';
                    inputElement.placeholder = fieldDef.placeholder || '';
                    inputElement.value = fieldDef.valueSetter ? fieldDef.valueSetter(currentValue) : (currentValue ?? '');
                    wrapper.appendChild(label);
                    wrapper.appendChild(inputElement);
                    break;
            }

            inputElement.id = fieldId;
            inputElement.dataset.key = fieldDef.key; // Crucial for data collection
            if (fieldDef.required) {
                inputElement.required = true;
            }

            // Add help text if defined
            if (fieldDef.helpText) {
                const helpText = document.createElement('p');
                helpText.classList.add('field-help-text');
                helpText.textContent = fieldDef.helpText;
                wrapper.appendChild(helpText);
            }

            // Attach change listener if defined
            if (fieldDef.onChange && typeof fieldDef.onChange === 'function') {
                inputElement.addEventListener('change', (event) => fieldDef.onChange(event, wrapper, depth));
            }

            // Append the whole wrapper to the parent
            parentElement.appendChild(wrapper);
        }

        /**
         * Renders the list of custom selectors and the "Add" button.
         * @param {HTMLElement} parentElement - The fieldset element to contain the list.
         * @param {Array<object>} currentSelectorsData - Array of custom selector config objects.
         * @param {number} depth - The depth level this list belongs to.
         * @private
         */
        _renderCustomSelectorList(parentElement, currentSelectorsData, depth) {
            const selectorsListDiv = document.createElement('div');
            selectorsListDiv.classList.add('custom-selectors-list');
            selectorsListDiv.dataset.depth = depth; // Store depth for context

            // Render existing selectors
            currentSelectorsData.forEach((csData, index) => {
                this._addCustomSelector(selectorsListDiv, csData, depth, index);
            });

            parentElement.appendChild(selectorsListDiv);

            // Add "Add Custom Selector" button
            const addButton = document.createElement('button');
            addButton.type = 'button';
            addButton.textContent = '+ Add Custom Selector';
            addButton.classList.add('add-button');
            addButton.onclick = () => {
                // Add a new selector with default values
                this._addCustomSelector(selectorsListDiv, {}, depth, selectorsListDiv.children.length);
            };
            parentElement.appendChild(addButton);
        }

        /**
     * Renders a single custom selector group UI.
     * @param {HTMLElement} listContainerElement - The div holding all selector groups.
     * @param {object} selectorData - The configuration data for this specific selector.
     * @param {number} listDepth - The depth of the list container itself.
     * @param {number} index - The index of this selector in the list.
     * @private
     */
        _addCustomSelector(listContainerElement, selectorData, listDepth, index) {
            const groupFieldset = document.createElement('fieldset');
            groupFieldset.classList.add('custom-selector-group');
            groupFieldset.dataset.isCustomSelector = 'true'; // Mark as a selector group
            groupFieldset.dataset.depth = listDepth; // Carry over depth
            groupFieldset.innerHTML = `<legend>Selector #${index + 1}</legend>`;

            const gridContainer = document.createElement('div');
            gridContainer.classList.add('custom-selector-grid'); // Apply grid layout

            // Render fields for this custom selector using its definition and loaded data
            this._renderConfigSection(
                gridContainer,
                this.CUSTOM_SELECTOR_FIELDS,
                selectorData, // Pass the specific data for this selector
                listDepth // Depth is the same as the list container
            );

            groupFieldset.appendChild(gridContainer);

            // --- Nested Configuration Handling ---
            const nestedConfigContainer = document.createElement('div');
            nestedConfigContainer.classList.add('nested-config');
            nestedConfigContainer.classList.add('config-options-grid');
            nestedConfigContainer.dataset.role = 'nested-config-container'; // For easy selection

            // Check the *loaded* data to determine initial state
            const shouldShowNested = selectorData?.followLink === true && selectorData?.nextConfig;

            if (shouldShowNested) {
                const nextConfigData = selectorData.nextConfig || {};
                const nextDepth = listDepth + 1;
                nestedConfigContainer.style.display = 'block'; // Show it

                // --- Recursive Update Logic integrated here for loading ---
                // We need helper functions similar to those in _updateUIFromConfig,
                // but adapted for rendering within this context. Let's reuse the main ones.

                // Helper function (could be refactored out, but placed here for clarity)
                const updateOrRenderSection = (parent, fieldsDef, configLevelData, depth, dataAttrs = {}) => {
                    // Clear existing content before rendering/updating
                    // parent.innerHTML = ''; // Don't clear here, _renderConfigSection appends

                    // Use _renderConfigSection to build the fields based on loaded data
                    this._renderConfigSection(parent, fieldsDef, configLevelData, depth, dataAttrs);
                };

                // Helper function
                const updateOrRenderCustomSelectors = (listParent, selectorsData, depth) => {
                    // Clear existing selectors first
                    const existingList = listParent.querySelector('.custom-selectors-list');
                    if (existingList) existingList.remove();
                    const existingAddButton = listParent.querySelector('.add-button');
                    if (existingAddButton) existingAddButton.remove(); // Also remove old add button

                    // Use _renderCustomSelectorList to rebuild the list based on loaded data
                    this._renderCustomSelectorList(listParent, selectorsData || [], depth);
                };
                // --- End Helpers ---

                // Render/Update the nested top-level fields
                updateOrRenderSection(
                    nestedConfigContainer,
                    this.TOP_LEVEL_CONFIG_FIELDS,
                    nextConfigData,
                    nextDepth,
                    { configType: 'nested-top-level' }
                );

                // Render/Update the nested custom selector list recursively
                // We need a container *within* nestedConfigContainer for the nested list+button
                const nestedCsListWrapper = document.createElement('div'); // Create a wrapper
                nestedCsListWrapper.dataset.role = 'nested-custom-selectors-wrapper';
                nestedConfigContainer.appendChild(nestedCsListWrapper); // Append wrapper
                updateOrRenderCustomSelectors(
                    nestedCsListWrapper, // Pass the wrapper as the parent
                    nextConfigData.customSelectors || [],
                    nextDepth
                );

            } else {
                // Ensure it's hidden if followLink is false or no nextConfig exists
                nestedConfigContainer.style.display = 'none';
                // Optionally render empty structure when hidden? Or leave empty?
                // Leaving it empty is simpler and _handleFollowLinkChange will populate if needed.
            }
            // Append the (potentially populated or empty/hidden) container
            groupFieldset.appendChild(nestedConfigContainer);


            // Add Remove Button
            const removeButton = document.createElement('button');
            removeButton.type = 'button';
            removeButton.textContent = 'Remove';
            removeButton.classList.add('remove-button');
            removeButton.onclick = () => {
                groupFieldset.remove();
                // Optional: Renumber legends after removal
                this._renumberSelectorLegends(listContainerElement);
            };
            groupFieldset.appendChild(removeButton);

            listContainerElement.appendChild(groupFieldset);
        }

        /** Helper to renumber selector legends after removal */
        _renumberSelectorLegends(listContainerElement) {
            const groups = listContainerElement.querySelectorAll('.custom-selector-group');
            groups.forEach((group, index) => {
                const legend = group.querySelector('legend');
                if (legend) {
                    legend.textContent = `Selector #${index + 1}`;
                }
            });
        }


        /**
         * Event handler for the 'followLink' checkbox change.
         * Shows/hides the nested config section AND enables/disables the allowedMediaTypes dropdown.
         * NOTE: Defined as an arrow function property to automatically bind 'this'.
         * @param {Event} event - The change event object.
         * @param {HTMLElement} fieldWrapper - The wrapper div of the checkbox field.
         * @param {number} depth - The depth where this checkbox resides.
         * @private
         */
        _handleFollowLinkChange = (event, fieldWrapper, depth) => { // Arrow function syntax
            const checkbox = event.target;
            const groupFieldset = fieldWrapper.closest('.custom-selector-group');
            if (!groupFieldset) return;

            const nestedConfigContainer = groupFieldset.querySelector('.nested-config[data-role="nested-config-container"]');
            // Find the allowedMediaTypes dropdown within the same group
            const allowedTypesSelect = groupFieldset.querySelector('select[data-key="allowedMediaTypes"]');

            if (!nestedConfigContainer) {
                console.warn("Nested config container not found during followLink change.");
                // Still proceed to enable/disable dropdown if found
            }

            if (checkbox.checked) {
                // --- Nested Config Handling (Show) ---
                if (nestedConfigContainer) {
                    nestedConfigContainer.style.display = 'block';
                    // Only render if it's empty (first time being checked)
                    if (nestedConfigContainer.children.length === 0) {
                        const nextDepth = depth + 1;
                        // 'this' here correctly refers to the MediaExtractorUI instance
                        this._renderConfigSection(
                            nestedConfigContainer,
                            this.TOP_LEVEL_CONFIG_FIELDS,
                            {}, // Start with defaults for nested config
                            nextDepth,
                            { configType: 'nested-top-level' }
                        );
                        // Create a wrapper for the nested list and button
                        const nestedCsListWrapper = document.createElement('div');
                        nestedCsListWrapper.dataset.role = 'nested-custom-selectors-wrapper';
                        nestedConfigContainer.appendChild(nestedCsListWrapper);
                        this._renderCustomSelectorList(
                            nestedCsListWrapper, // Pass the wrapper
                            [], // Start with empty list for nested
                            nextDepth
                        );
                    }
                }
                // --- Allowed Types Handling (Disable) ---
                if (allowedTypesSelect) {
                    allowedTypesSelect.disabled = true;
                    // Optional: Add a class for visual styling when disabled due to followLink
                    allowedTypesSelect.closest('.field-wrapper')?.classList.add('field-disabled-by-follow');
                }

            } else { // Checkbox is UNchecked
                // --- Nested Config Handling (Hide) ---
                if (nestedConfigContainer) {
                    nestedConfigContainer.style.display = 'none';
                    // Optional: Clear the content when hiding to reset state?
                    // nestedConfigContainer.innerHTML = '';
                }
                // --- Allowed Types Handling (Enable) ---
                if (allowedTypesSelect) {
                    allowedTypesSelect.disabled = false;
                    allowedTypesSelect.closest('.field-wrapper')?.classList.remove('field-disabled-by-follow');
                }
            }
        } // End of arrow function




        /**
         * Renders the control buttons and output area. (Largely unchanged)
         * @param {HTMLElement} parentElement - The DOM element to append controls to.
         * @private
         */
        _renderControls(parentElement) {
            const extractButton = document.createElement('button');
            extractButton.type = 'button';
            extractButton.textContent = 'Extract Media';
            extractButton.dataset.role = 'extract-btn';
            extractButton.onclick = () => this._handleExtractClick();

            const outputArea = document.createElement('div');
            outputArea.classList.add('output-area');
            outputArea.dataset.role = 'output-area';
            outputArea.textContent = 'Click "Extract Media" or press Enter to start.';

            parentElement.appendChild(extractButton);
            parentElement.appendChild(outputArea);
        }

        // --- Data Collection ---

        /**
         * Reads the configuration from the UI elements within a given section.
         * Handles nested configurations recursively.
         * @param {HTMLElement} sectionElement - The element containing the config section UI (e.g., config-section, custom-selector-group, nested-config).
         * @param {Array<object>} fieldsDefinition - The definition array used to build this section (or a dummy definition for structural reads like customSelectors).
         * @param {number} depth - The nesting depth of the section being read (0 for top-level).
         * @returns {object} The config object derived from the UI fields.
         * @private
         */
        _getConfigFromUI(sectionElement, fieldsDefinition, depth) {
            const config = {};

            // --- 1. Read Simple Fields Defined by fieldsDefinition ---
            fieldsDefinition.forEach(fieldDef => {
                const key = fieldDef.key;
                // Skip keys handled structurally (like the container for custom selectors or nested config itself)
                if (key === 'customSelectors' || key === 'nextConfig') {
                    return;
                }
                // Skip reading concurrency if reading a nested config (depth > 0)
                if (key === 'concurrency' && depth > 0) {
                    return;
                }

                // Find input element (checking direct children wrappers first)
                let inputElement = null;
                const wrapper = Array.from(sectionElement.querySelectorAll(':scope > .field-wrapper')).find(
                    wrap => wrap.querySelector(`[data-key="${key}"]`)
                );
                inputElement = wrapper ? wrapper.querySelector(`[data-key="${key}"]`) : null;

                // Fallback: Check direct children if not in a wrapper (less common now)
                if (!inputElement) {
                    inputElement = sectionElement.querySelector(`:scope > [data-key="${key}"]`);
                }
                // Fallback: Check any descendant (needed for custom selector fields within grid)
                if (!inputElement) {
                    inputElement = sectionElement.querySelector(`[data-key="${key}"]`);
                }


                if (!inputElement) {
                    // console.warn(`_getConfigFromUI: Could not find input element for key "${key}" at depth ${depth} in section:`, sectionElement);
                    // Assign default value only if the field is expected at this depth
                    if (!(key === 'concurrency' && depth > 0)) {
                        config[key] = fieldDef.defaultValue;
                    }
                    return; // Skip to next field definition
                }

                // Extract value using getter or default logic
                if (fieldDef.valueGetter) {
                    config[key] = fieldDef.valueGetter(inputElement);
                } else {
                    switch (inputElement.type) {
                        case 'checkbox':
                            config[key] = inputElement.checked;
                            break;
                        case 'number':
                            const numVal = parseFloat(inputElement.value);
                            config[key] = isNaN(numVal) && !(key === 'concurrency' && depth > 0) ? fieldDef.defaultValue : numVal;
                            break;
                        case 'select-one':
                            // Assign default only if value is empty AND the field is expected
                            config[key] = inputElement.value === '' && !(key === 'concurrency' && depth > 0) ? fieldDef.defaultValue : inputElement.value;
                            if (config[key] === undefined && inputElement.value === '') {
                                config[key] = fieldDef.defaultValue;
                            }
                            break;
                        case 'textarea':
                        case 'text':
                        default:
                            const trimmedValue = inputElement.value.trim();
                            // Assign default only if value is empty AND the field is expected
                            config[key] = trimmedValue === '' && !(key === 'concurrency' && depth > 0) ? fieldDef.defaultValue : trimmedValue;
                            if (config[key] === undefined && trimmedValue === '') {
                                config[key] = fieldDef.defaultValue;
                            }
                            break;
                    }
                }
            }); // End of simple field processing

            // --- 2. Handle Nested Structures (Custom Selectors List) ---
            // This part runs regardless of the fieldsDefinition passed, but only populates
            // config.customSelectors if a list is found within sectionElement.

            // --- MODIFICATION START: Find the list container more flexibly ---
            let selectorListDiv = sectionElement.querySelector(':scope > .custom-selectors-list'); // Check direct child
            if (!selectorListDiv) {
                // If not direct, check within the known nested wrapper structure
                const nestedWrapper = sectionElement.querySelector(':scope > div[data-role="nested-custom-selectors-wrapper"]');
                if (nestedWrapper) {
                    selectorListDiv = nestedWrapper.querySelector(':scope > .custom-selectors-list');
                    // console.log(`_getConfigFromUI (depth ${depth}): Found nested selector list inside wrapper.`, selectorListDiv);
                }
            }
            /* else {
                console.log(`_getConfigFromUI (depth ${depth}): Found direct selector list.`, selectorListDiv);
            }
   
            if (!selectorListDiv && sectionElement.dataset.role !== 'config-section') { // Don't log for sections not expected to have list
                // console.log(`_getConfigFromUI (depth ${depth}): No selector list found in section.`, sectionElement);
            } */
            // --- MODIFICATION END ---


            if (selectorListDiv) {
                config.customSelectors = []; // Initialize array for this level
                const selectorGroups = selectorListDiv.querySelectorAll(':scope > .custom-selector-group');

                selectorGroups.forEach(group => {
                    // Get config for this specific selector group using its fields definition
                    // The depth passed here is the depth of the *list* container (selectorListDiv.dataset.depth or fallback to current depth)
                    const groupDepth = parseInt(selectorListDiv.dataset.depth, 10) || depth;
                    const csConfig = this._getConfigFromUI(group, this.CUSTOM_SELECTOR_FIELDS, groupDepth);

                    // --- 3. Handle Nested Config *within* a Custom Selector Group (Recursive Part) ---
                    if (csConfig.followLink) {
                        const nestedContainer = group.querySelector(':scope > .nested-config[data-role="nested-config-container"]');
                        const nestedDepth = groupDepth + 1; // Calculate nested depth

                        if (nestedContainer && nestedContainer.style.display !== 'none' && nestedContainer.children.length > 0) {
                            // console.log(`_getConfigFromUI (depth ${depth}): Reading nested config for group at depth ${groupDepth}. Nested container found.`, nestedContainer);

                            // Recursively get the *entire* nested config object (top-level fields and its own selectors)
                            // by calling _getConfigFromUI on the nestedContainer.
                            // Pass both field definitions so it reads everything inside.
                            // We don't need two separate calls anymore. _getConfigFromUI will handle reading
                            // both simple fields and the custom selector list *within* the nestedContainer.
                            const fullNestedConfig = this._getConfigFromUI(
                                nestedContainer,
                                this.TOP_LEVEL_CONFIG_FIELDS, // Provide definitions for simple fields inside
                                nestedDepth // Pass the correct nested depth
                                // The function will *also* look for a custom selector list inside nestedContainer
                            );


                            // The result 'fullNestedConfig' will have keys from TOP_LEVEL_CONFIG_FIELDS
                            // AND potentially a 'customSelectors' key if a list was found inside.
                            csConfig.nextConfig = fullNestedConfig;


                            // console.log(`_getConfigFromUI (depth ${depth}): Finished reading nested config. Result:`, JSON.parse(JSON.stringify(csConfig.nextConfig)));

                        } else {
                            // console.log(`_getConfigFromUI (depth ${depth}): Nested container for group at depth ${groupDepth} is hidden or empty. Setting nextConfig to empty object.`);
                            // If followLink is checked but container is hidden/empty, provide empty config or null?
                            // Let's use null for consistency with the 'else' branch.
                            csConfig.nextConfig = null; // Changed from {} to null
                        }
                    } else {
                        csConfig.nextConfig = null; // Ensure it's null if not following
                    }

                    // Add the complete custom selector config (with potential nextConfig) if valid
                    if (csConfig.selector && csConfig.type && csConfig.attribute) {
                        config.customSelectors.push(csConfig);
                    } else {
                        // Avoid logging warning for empty selector groups the user hasn't filled yet
                        const isEmpty = !(csConfig.selector || csConfig.type || csConfig.attribute || csConfig.followLink);
                        if (!isEmpty) {
                            console.warn("MediaExtractorUI: Skipping custom selector due to missing required fields (selector, type, or attribute):", group, csConfig);
                        }
                    }
                }); // End loop through selector groups

                // If no valid custom selectors were added, remove the empty array
                if (config.customSelectors && config.customSelectors.length === 0) {
                    delete config.customSelectors;
                }
            } // End if (selectorListDiv)

            return config;
        } // End _getConfigFromUI


        // --- Event Handling & Extraction ---

        /**
     * Handles the click event of the "Extract" button.
     * @private
     */
        async _handleExtractClick() {
            if (!this.uiRoot) {
                console.error("MediaExtractorUI: UI Root not found. Cannot extract.");
                this._notifyExtractionComplete(new Error("UI Root not found"), null); // Notify listeners of failure
                return;
            }

            const startUrlInput = this.uiRoot.querySelector('input[data-role="start-url-input"]');
            const outputArea = this.uiRoot.querySelector('.output-area[data-role="output-area"]');
            const extractButton = this.uiRoot.querySelector('button[data-role="extract-btn"]');

            if (!startUrlInput || !outputArea || !extractButton) {
                console.error("MediaExtractorUI: Core UI elements not found.");
                if (outputArea) outputArea.textContent = "Error: UI elements missing.";
                this._notifyExtractionComplete(new Error("Core UI elements not found"), null); // Notify listeners of failure
                return;
            }

            const startUrl = startUrlInput.value.trim();
            let urlError = null;
            if (!startUrl) {
                urlError = new Error('Please enter a valid Start URL.');
            } else {
                try { new URL(startUrl); } catch (e) {
                    urlError = new Error(`Invalid Start URL format: ${e.message}`);
                }
            }

            if (urlError) {
                outputArea.textContent = `Error: ${urlError.message}`;
                outputArea.className = 'output-area error';
                startUrlInput.focus();
                this._notifyExtractionComplete(urlError, null); // Notify listeners of failure
                return;
            }


            // Get config from the top-level section
            const topLevelConfigDiv = this.uiRoot.querySelector('.config-section[data-depth="0"]');
            if (!topLevelConfigDiv) {
                const configError = new Error('Could not find top-level configuration section.');
                outputArea.textContent = `Error: ${configError.message}`;
                outputArea.className = 'output-area error';
                this._notifyExtractionComplete(configError, null); // Notify listeners of failure
                return;
            }

            // Read config using the new data-driven method
            let userConfig;
            try {
                // Find the top-level custom selectors list container (usually inside the fieldset)
                const topLevelCsListContainer = this.uiRoot.querySelector('fieldset > .custom-selectors-list[data-depth="0"]');

                // Read top-level fields (passing depth 0)
                const topLevelFields = this._getConfigFromUI(topLevelConfigDiv, this.TOP_LEVEL_CONFIG_FIELDS, 0);

                // Read custom selectors (passing depth 0 for the list container)
                // Pass the container's parent fieldset to find the list inside
                const customSelectorsData = topLevelCsListContainer ? this._getConfigFromUI(topLevelCsListContainer.parentNode, [{ key: 'customSelectors' }], 0) : {};

                userConfig = {
                    ...topLevelFields,
                    // Make sure customSelectors is an array even if none were found
                    customSelectors: customSelectorsData.customSelectors || []
                };

            } catch (configError) {
                console.error("MediaExtractorUI: Error reading configuration from UI.", configError);
                outputArea.textContent = `Error reading UI configuration: ${configError.message}`;
                outputArea.className = 'output-area error';
                this._notifyExtractionComplete(configError, null); // Notify listeners of failure
                return;
            }

            outputArea.scrollIntoView();
            outputArea.textContent = `Starting extraction from: ${startUrl}...\nConfiguration:\n${JSON.stringify(userConfig, (key, value) => value instanceof RegExp ? value.toString() : value, 2)}`;
            outputArea.className = 'output-area extracting';
            extractButton.disabled = true;
            extractButton.textContent = 'Extracting...';
            console.log("MediaExtractorUI: Starting extraction with config:", JSON.parse(JSON.stringify(userConfig))); // Deep copy for logging

            const startTime = performance.now();
            let results = null;
            let error = null;

            try {
                // Assuming this.extractor.extractFromUrl exists and works with the config structure
                results = await this.extractor.extractFromUrl(startUrl, userConfig);
                const endTime = performance.now();
                const duration = ((endTime - startTime) / 1000).toFixed(2);
                console.log(`MediaExtractorUI: Extraction finished in ${duration} seconds.`);
                console.log("MediaExtractorUI: Results:", results);
                if (results.length > 0) {
                    outputArea.textContent = `Extraction complete!\nFound ${results.length} media items in ${duration} seconds.\n\nResults logged to the browser console (Press F12).`;
                    outputArea.textContent += `\n\nFirst ${Math.min(results.length, 20)} results:\n` + results.slice(0, 20).map(r => `- [${r.type}@d${r.depth}] ${r.url}`).join('\n');
                    outputArea.className = 'output-area success';
                } else {
                    outputArea.textContent = "Extractor found no results. Check console for details.";
                    outputArea.className = 'output-area error';
                }
            } catch (extractionError) {
                const endTime = performance.now();
                const duration = ((endTime - startTime) / 1000).toFixed(2);
                console.error("MediaExtractorUI: Extraction failed.", extractionError);
                outputArea.textContent = `Error during extraction after ${duration} seconds: ${extractionError.message}\nSee console for details.`;
                outputArea.className = 'output-area error';
                error = extractionError; // Store error
            } finally {
                extractButton.disabled = false;
                extractButton.textContent = 'Extract Media';
                // Notify listeners after everything is done
                this._notifyExtractionComplete(error, results);
            }
        }

        /**
     * Handles key presses
     * @param {KeyboardEvent} event
     * @private
     */
        _handleKeyPress(event) {
            if (event.key === 'Escape') {
                this.close();
            } else if (event.key === 'Enter') {
                this._handleExtractClick();
            }
        }

        /**
     * Registers a callback function to be executed when media extraction completes.
     * @param {function(Error|null, Array<MediaResult>|null): void} callback - The function to call.
     *        It receives an error object (or null if successful) as the first argument,
     *        and the array of results (or null if an error occurred) as the second argument.
     */
        onExtractionComplete(callback) {
            if (typeof callback === 'function') {
                this.extractionCompleteCallbacks.push(callback);
            } else {
                console.warn("MediaExtractorUI: Attempted to register a non-function as an extraction complete callback.");
            }
        }

        /**
    * Notifies all registered extraction complete listeners.
    * @param {Error|null} error - The error object if extraction failed, otherwise null.
    * @param {Array<MediaResult>|null} results - The array of results if extraction succeeded, otherwise null.
    * @private
    */
        _notifyExtractionComplete(error, results) {
            this.extractionCompleteCallbacks.forEach((callback, index) => {
                try {
                    callback(error, results);
                } catch (e) {
                    console.error(`MediaExtractorUI: Error executing extraction complete callback at index ${index}:`, e);
                }
            });
        }

        /**
         * Populates the saved configuration dropdown from GM storage.
         * Handles potential errors during loading or parsing the list.
         * @private
         */
        _populateConfigDropdown() {
            if (!this.uiRoot) {
                console.error("MediaExtractorUI: Cannot populate dropdown, UI Root not found.");
                return;
            }
            const selectElement = this.uiRoot.querySelector('select[data-role="config-select"]');
            if (!selectElement) {
                console.error("MediaExtractorUI: Cannot populate dropdown, select element not found.");
                return;
            }

            // Clear existing options except the default placeholder
            selectElement.length = 1; // Keep only the "--- Select Config ---" option

            let configList = [];
            try {
                const configListJson = GM_getValue(CONFIG_LIST_KEY, '[]');
                console.log("MediaExtractorUI: Raw config list JSON from storage:", configListJson); // Log raw value

                if (configListJson) {
                    configList = JSON.parse(configListJson);
                    if (!Array.isArray(configList)) {
                        console.warn('MediaExtractorUI: Invalid format for config list in storage (not an array). Resetting.', configList);
                        configList = [];
                        GM_setValue(CONFIG_LIST_KEY, '[]'); // Reset if invalid format
                    }
                } else {
                    console.warn('MediaExtractorUI: Config list key not found or empty in storage. Initializing.');
                    configList = [];
                    GM_setValue(CONFIG_LIST_KEY, '[]'); // Initialize if missing
                }

                console.log("MediaExtractorUI: Parsed config list:", configList); // Log parsed list

                if (configList.length > 0) {
                    configList.sort(); // Sort names alphabetically
                    configList.forEach(name => {
                        if (typeof name === 'string' && name.trim() !== '') { // Ensure it's a non-empty string
                            const option = document.createElement('option');
                            option.value = name;
                            option.textContent = name;
                            selectElement.appendChild(option);
                            // console.log(`MediaExtractorUI: Added option: ${name}`); // Uncomment for verbose logging
                        } else {
                            console.warn("MediaExtractorUI: Skipping invalid entry in config list:", name);
                        }
                    });
                } else {
                    console.log("MediaExtractorUI: Config list is empty. No options added.");
                }

            } catch (e) {
                console.error('MediaExtractorUI: Error parsing config list from storage:', e);
                // Optionally reset the list if parsing fails critically
                try {
                    GM_setValue(CONFIG_LIST_KEY, '[]');
                    console.log("MediaExtractorUI: Reset config list due to parsing error.");
                } catch (resetError) {
                    console.error("MediaExtractorUI: Failed to reset config list after parsing error:", resetError);
                }
                // Ensure dropdown is empty (except placeholder) after error
                selectElement.length = 1;
            }
            console.log("MediaExtractorUI: Dropdown population complete. Current options:", selectElement.options.length);
        }

        /**
         * Handles the click event for the "Save Config" button.
         * Reads the current UI config, validates the name, and saves to GM storage.
         * Stores the saved name as the last used config.
         * @private
         */
        _handleSaveConfigClick() {
            if (!this.uiRoot) return;

            const saveNameInput = this.uiRoot.querySelector('input[data-role="config-save-name"]');
            const statusSpan = this.uiRoot.querySelector('.config-status[data-role="config-status-message"]');
            const selectElement = this.uiRoot.querySelector('select[data-role="config-select"]');
            const startUrlInput = this.uiRoot.querySelector('input[data-role="start-url-input"]'); // Get Start URL input

            if (!saveNameInput || !statusSpan || !selectElement || !startUrlInput) { // Check for startUrlInput too
                console.error("Config Management or Start URL UI elements not found for saving.");
                if (statusSpan) statusSpan.textContent = "Error: UI elements missing.";
                return;
            }

            const configName = saveNameInput.value.trim();
            if (!configName) {
                statusSpan.textContent = "Error: Please enter a name for the configuration.";
                saveNameInput.focus();
                return;
            }
            if (configName.includes('_') || configName.includes(' ')) {
                statusSpan.textContent = "Error: Config name cannot contain spaces or underscores.";
                saveNameInput.focus();
                return;
            }


            let currentConfig;
            try {
                // Reuse the logic from _handleExtractClick to get the full config object
                const topLevelConfigDiv = this.uiRoot.querySelector('.config-section[data-depth="0"]');
                const topLevelCsFieldset = this.uiRoot.querySelector('fieldset[data-role="custom-selectors-fieldset"]'); // Get the fieldset

                if (!topLevelConfigDiv || !topLevelCsFieldset) {
                    throw new Error('Could not find configuration sections.');
                }

                const topLevelFields = this._getConfigFromUI(topLevelConfigDiv, this.TOP_LEVEL_CONFIG_FIELDS, 0);
                // Pass the fieldset containing the list to _getConfigFromUI for custom selectors
                const customSelectorsData = this._getConfigFromUI(topLevelCsFieldset, [{ key: 'customSelectors' }], 0);

                // --- Get Start URL ---
                const startUrlValue = startUrlInput.value.trim();

                currentConfig = {
                    startUrl: startUrlValue, // Add start URL here
                    ...topLevelFields,
                    customSelectors: customSelectorsData.customSelectors || []
                };

                // Clean up potential empty nextConfig objects if followLink is false
                const cleanConfig = (config) => {
                    if (config.customSelectors) {
                        config.customSelectors.forEach(cs => {
                            if (!cs.followLink) {
                                delete cs.nextConfig; // Remove nextConfig if followLink is false
                            } else if (cs.nextConfig) {
                                cleanConfig(cs.nextConfig); // Recursively clean nested configs
                            }
                        });
                    }
                };
                cleanConfig(currentConfig);


            } catch (configError) {
                console.error("MediaExtractorUI: Error reading configuration for saving.", configError);
                statusSpan.textContent = `Error reading UI config: ${configError.message}`;
                return;
            }

            try {
                const configKey = CONFIG_STORAGE_PREFIX + configName;
                const configJson = JSON.stringify(currentConfig, (key, value) => {
                    // Special handling for RegExp during serialization
                    if (value instanceof RegExp) {
                        return { __type: 'RegExp', source: value.source, flags: value.flags };
                    }
                    return value;
                });


                // Update the list of names
                const configListJson = GM_getValue(CONFIG_LIST_KEY, '[]');
                let configList = JSON.parse(configListJson);
                if (!Array.isArray(configList)) configList = []; // Ensure it's an array

                if (!configList.includes(configName)) {
                    configList.push(configName);
                    GM_setValue(CONFIG_LIST_KEY, JSON.stringify(configList));
                }

                // Save the actual config
                GM_setValue(configKey, configJson);

                // Refresh the dropdown
                this._populateConfigDropdown();
                // Ensure the newly saved/updated config is selected
                selectElement.value = configName;

                statusSpan.textContent = `Configuration "${configName}" saved successfully.`;
                console.log(`MediaExtractorUI: Config "${configName}" saved.`, currentConfig);

                // --- ADDED: Store as last used config ---
                this._setLastUsedConfig(configName);
                // --- END ADDED ---

            } catch (e) {
                console.error('MediaExtractorUI: Error saving configuration to storage:', e);
                statusSpan.textContent = `Error saving config: ${e.message}`;
            }
        }

        /**
         * Handles the click event for the "Delete Config" button.
         * Removes the selected configuration from GM storage, updates the list,
         * refreshes the dropdown, and resets the selection.
         * @private
         */
        _handleDeleteConfigClick() {
            if (!this.uiRoot) return;

            const selectElement = this.uiRoot.querySelector('select[data-role="config-select"]');
            const statusSpan = this.uiRoot.querySelector('.config-status[data-role="config-status-message"]');
            const saveNameInput = this.uiRoot.querySelector('input[data-role="config-save-name"]');

            if (!selectElement || !statusSpan || !saveNameInput) {
                console.error("Config Management UI elements not found for deleting.");
                if (statusSpan) statusSpan.textContent = "Error: UI elements missing.";
                return;
            }

            const configName = selectElement.value;
            if (!configName) {
                statusSpan.textContent = "Please select a configuration to delete.";
                return;
            }

            // Use a more specific confirmation message
            if (!confirm(`Are you sure you want to permanently delete the configuration "${configName}"? This cannot be undone.`)) {
                statusSpan.textContent = "Deletion cancelled.";
                return;
            }

            try {
                const configKey = CONFIG_STORAGE_PREFIX + configName;

                // 1. Remove the config itself
                GM_deleteValue(configKey);
                console.log(`MediaExtractorUI: Deleted config data for key: ${configKey}`);

                // 2. Update the list of names
                const configListJson = GM_getValue(CONFIG_LIST_KEY, '[]');
                let configList = [];
                try {
                    configList = JSON.parse(configListJson);
                    if (!Array.isArray(configList)) { // Ensure it's an array
                        console.warn("MediaExtractorUI: Config list was not an array, resetting during delete.", configList);
                        configList = [];
                    }
                } catch (parseError) {
                    console.error("MediaExtractorUI: Error parsing config list during delete, resetting.", parseError);
                    configList = [];
                }

                const originalLength = configList.length;
                configList = configList.filter(name => name !== configName); // Filter out the deleted name

                if (configList.length < originalLength) {
                    GM_setValue(CONFIG_LIST_KEY, JSON.stringify(configList));
                    console.log(`MediaExtractorUI: Updated config list in storage after deleting "${configName}". New list:`, configList);
                } else {
                    console.warn(`MediaExtractorUI: Config name "${configName}" not found in the stored list during deletion.`);
                }


                // 3. Refresh the dropdown using the updated list from storage
                this._populateConfigDropdown();

                // --- IMPORTANT FIXES ---
                // 4. Explicitly reset the dropdown selection to the default placeholder
                selectElement.value = ''; // Set value to the placeholder's value

                // 5. Clear the save name input, regardless of whether it matched the deleted item
                saveNameInput.value = '';

                // 6. Clear the last used config if the deleted one was the last used
                const lastUsed = GM_getValue(CONFIG_LAST_USED_KEY);
                if (lastUsed === configName) {
                    this._setLastUsedConfig(null); // Clear it
                    console.log(`MediaExtractorUI: Cleared last used config setting as "${configName}" was deleted.`);
                }
                // --- END FIXES ---

                statusSpan.textContent = `Configuration "${configName}" deleted successfully.`;
                console.log(`MediaExtractorUI: Config "${configName}" deleted.`);
                // Optionally, trigger a UI reset to default state after deletion?
                // this._handleConfigSelectChange({ target: { value: '' } }); // Simulate selecting "--- Select ---"

            } catch (e) {
                console.error(`MediaExtractorUI: Error deleting configuration "${configName}":`, e);
                statusSpan.textContent = `Error deleting config: ${e.message}`;
            }
        }
        /**
         * Updates the UI elements to reflect the state of a loaded configuration object.
         * @param {object} configData - The configuration object to load into the UI.
         * @private
         */
        _updateUIFromConfig(configData) {
            if (!this.uiRoot || !configData) return;

            console.log("Updating UI from config:", JSON.parse(JSON.stringify(configData))); // Log deep copy

            // Helper function to update a single config section
            const updateSection = (parentElement, fieldsDefinition, currentConfigLevelData, depth) => {
                if (!currentConfigLevelData) {
                    console.warn(`_updateUIFromConfig: No config data provided for section at depth ${depth} in parent:`, parentElement);
                    return;
                }

                fieldsDefinition.forEach(fieldDef => {
                    const key = fieldDef.key;
                    if (key === 'customSelectors' || key === 'nextConfig') return;
                    if (key === 'concurrency' && depth > 0) return;

                    let inputElement = parentElement.querySelector(`[data-key="${key}"]`);
                    if (!inputElement) {
                        const wrapper = Array.from(parentElement.querySelectorAll(':scope > .field-wrapper')).find(
                            wrap => wrap.querySelector(`[data-key="${key}"]`)
                        );
                        inputElement = wrapper ? wrapper.querySelector(`[data-key="${key}"]`) : null;
                    }

                    if (inputElement) {
                        const valueToSet = currentConfigLevelData.hasOwnProperty(key) ? currentConfigLevelData[key] : fieldDef.defaultValue;
                        const displayValue = fieldDef.valueSetter ? fieldDef.valueSetter(valueToSet) : (valueToSet ?? '');

                        switch (inputElement.type) {
                            case 'checkbox':
                                inputElement.checked = valueToSet === true;
                                // --- MODIFICATION START ---
                                // ALWAYS call the onChange handler *after* setting the value
                                // if one is defined, to ensure dependent UI updates correctly on load.
                                if (fieldDef.onChange) {
                                    // We need to simulate the event object minimally and find the wrapper.
                                    const pseudoEvent = { target: inputElement };
                                    const fieldWrapper = inputElement.closest('.field-wrapper');
                                    if (fieldWrapper) {
                                        // Call the handler directly with the necessary context.
                                        // Assuming the handler is bound correctly (like _handleFollowLinkChange).
                                        try {
                                            fieldDef.onChange(pseudoEvent, fieldWrapper, depth);
                                        } catch (e) {
                                            console.error(`Error executing onChange handler for key "${key}" during config load:`, e);
                                        }
                                    } else {
                                        console.warn(`Could not find field wrapper for key "${key}" during onChange trigger on load.`);
                                    }
                                }
                                // --- MODIFICATION END ---
                                break;
                            case 'number':
                            case 'text':
                            case 'select-one':
                            case 'textarea':
                            default:
                                const previousValue = inputElement.value; // Store previous value
                                inputElement.value = displayValue;
                                // Trigger change event for select/text/etc. if value changed and handler exists
                                if (inputElement.value !== previousValue && fieldDef.onChange) {
                                    // For non-checkboxes, dispatching event might still be okay,
                                    // but manual call like above is also an option. Let's keep dispatch for now.
                                    const event = new Event('change', { bubbles: true });
                                    inputElement.dispatchEvent(event);
                                }
                                break;
                        }
                    } else if (!(key === 'concurrency' && depth > 0)) {
                        console.warn(`_updateUIFromConfig: Input element not found for key "${key}" at depth ${depth}`, parentElement);
                    }
                });
            }; // End of updateSection helper

            // --- Update Start URL (no change) ---
            const startUrlInput = this.uiRoot.querySelector('input[data-role="start-url-input"]');
            if (startUrlInput) {
                startUrlInput.value = configData.startUrl || '';
            } else {
                console.error("_updateUIFromConfig: Start URL input not found.");
            }

            // --- Update Top-Level Fields (no change) ---
            const topLevelConfigDiv = this.uiRoot.querySelector('.config-section[data-depth="0"]');
            if (topLevelConfigDiv) {
                updateSection(topLevelConfigDiv, this.TOP_LEVEL_CONFIG_FIELDS, configData, 0);
            } else {
                console.error("_updateUIFromConfig: Top-level config section not found.");
            }

            // --- Update Top-Level Custom Selectors (no change in this part) ---
            const topLevelCsFieldset = this.uiRoot.querySelector('fieldset[data-role="custom-selectors-fieldset"]');
            if (topLevelCsFieldset) {
                // Define updateCustomSelectors helper inside or ensure it's accessible
                const updateCustomSelectors = (listContainerParent, selectorsData, depth) => {
                    let listContainer = listContainerParent.querySelector('.custom-selectors-list');
                    if (listContainer) {
                        listContainer.innerHTML = ''; // Clear existing
                    } else {
                        console.warn("_updateUIFromConfig: custom-selectors-list container not found, creating.", listContainerParent);
                        listContainer = document.createElement('div');
                        listContainer.classList.add('custom-selectors-list');
                        listContainer.dataset.depth = depth;
                        const addButton = listContainerParent.querySelector('.add-button');
                        if (addButton) { listContainerParent.insertBefore(listContainer, addButton); }
                        else { listContainerParent.appendChild(listContainer); }
                    }
                    if (Array.isArray(selectorsData)) {
                        selectorsData.forEach((csData, index) => {
                            this._addCustomSelector(listContainer, csData, depth, index);
                        });
                    }
                };
                updateCustomSelectors(topLevelCsFieldset, configData.customSelectors || [], 0);
            } else {
                console.error("_updateUIFromConfig: Top-level custom selectors fieldset not found.");
            }

        } // End of _updateUIFromConfig

        /**
     * Stores the name of the last successfully loaded or saved configuration.
     * @param {string} configName - The name of the configuration.
     * @private
     */
        _setLastUsedConfig(configName) {
            try {
                if (configName) {
                    GM_setValue(CONFIG_LAST_USED_KEY, configName);
                } else {
                    // If configName is empty/null, remove the key
                    GM_deleteValue(CONFIG_LAST_USED_KEY);
                }
            } catch (e) {
                console.error("MediaExtractorUI: Error setting last used config:", e);
            }
        }

        /**
 * Loads and parses a configuration object from storage by its name.
 * Handles RegExp deserialization.
 * @param {string} configName - The name of the configuration to load.
 * @returns {object|null} The loaded configuration object, or null if not found or error occurs.
 * @private
 */
        _loadConfigByName(configName) {
            if (!configName) return null;

            const configKey = CONFIG_STORAGE_PREFIX + configName;
            try {
                const configJson = GM_getValue(configKey);
                if (!configJson) {
                    console.warn(`MediaExtractorUI: Configuration "${configName}" not found in storage.`);
                    return null;
                }

                const config = JSON.parse(configJson, (key, value) => {
                    // Special handling for RegExp during deserialization
                    if (value && typeof value === 'object' && value.__type === 'RegExp') {
                        return new RegExp(value.source, value.flags);
                    }
                    return value;
                });
                return config;

            } catch (e) {
                console.error(`MediaExtractorUI: Error loading or parsing configuration "${configName}":`, e);
                return null;
            }
        }

        /**
         * Handles the 'change' event on the saved configurations dropdown.
         * Loads the selected configuration instantly into the UI, or resets the UI
         * to defaults if the placeholder option is selected.
         * @param {Event} event - The change event object.
         * @private
         */
        _handleConfigSelectChange(event) {
            if (!this.uiRoot) return;

            const selectElement = event.target;
            const configName = selectElement.value;
            const statusSpan = this.uiRoot.querySelector('.config-status[data-role="config-status-message"]');
            const saveNameInput = this.uiRoot.querySelector('input[data-role="config-save-name"]');

            if (!statusSpan || !saveNameInput) {
                console.error("Config Management UI elements not found for handling select change.");
                return;
            }

            // Always update the save name input to match the selection
            saveNameInput.value = configName;
            statusSpan.textContent = ''; // Clear previous status

            if (!configName) {
                // "--- Select Config ---" chosen - Reset UI to defaults
                console.log("MediaExtractorUI: Resetting UI to defaults.");

                // --- Create a default config object ---
                const defaultConfig = {
                    startUrl: '', // Empty Start URL
                    customSelectors: [] // Empty custom selectors list
                };
                // Populate with defaults from TOP_LEVEL_CONFIG_FIELDS definition
                this.TOP_LEVEL_CONFIG_FIELDS.forEach(fieldDef => {
                    // Only add if it has a defined defaultValue, excluding structural keys
                    if (fieldDef.defaultValue !== undefined && fieldDef.key !== 'customSelectors') {
                        defaultConfig[fieldDef.key] = fieldDef.defaultValue;
                    }
                });
                // Also ensure nested defaults like concurrency are present if defined in MediaExtractor defaults
                if (typeof MediaExtractor !== 'undefined' && MediaExtractor.DEFAULT_CONFIG) {
                    Object.assign(defaultConfig, { // Merge, letting our specific defaults take precedence
                        concurrency: MediaExtractor.DEFAULT_CONFIG.concurrency ?? 5 // Example default
                        // Add other potential base defaults if needed
                    });
                }
                // --- End default config object creation ---


                try {
                    this._updateUIFromConfig(defaultConfig); // Apply defaults to UI
                    statusSpan.textContent = "UI reset to defaults.";
                    this._setLastUsedConfig(null); // Clear last used config name as none is selected
                } catch (e) {
                    console.error("MediaExtractorUI: Error resetting UI to defaults:", e);
                    statusSpan.textContent = "Error resetting UI.";
                }

                return; // Stop processing, UI is reset
            }

            // --- Proceed with loading the selected config ---
            const config = this._loadConfigByName(configName);

            if (config) {
                try {
                    this._updateUIFromConfig(config);
                    statusSpan.textContent = `Configuration "${configName}" loaded.`;
                    console.log(`MediaExtractorUI: Config "${configName}" loaded via dropdown.`, config);
                    this._setLastUsedConfig(configName); // Store as last used
                } catch (e) {
                    console.error(`MediaExtractorUI: Error applying configuration "${configName}" to UI:`, e);
                    statusSpan.textContent = `Error applying config: ${e.message}`;
                    // Failed to apply, clear last used?
                    this._setLastUsedConfig(null);
                }
            } else {
                // Config wasn't found or failed to parse (error logged in _loadConfigByName)
                statusSpan.textContent = `Error loading "${configName}". Check console.`;
                // Clear last used if loading failed
                this._setLastUsedConfig(null);
                // Optionally reset UI fully here too? Or leave the previous state?
                // Leaving previous state might be less confusing than a sudden reset on load failure.
                // this._handleConfigSelectChange({ target: { value: '' } }); // Simulate selecting "--- Select ---"
            }
        }

        /**
 * Attempts to load the last used configuration when the UI is initialized.
 * Updates the UI, dropdown selection, and save name input if successful.
 * @private
 */
        _loadLastUsedConfig() {
            if (!this.uiRoot) return;

            const lastUsedName = GM_getValue(CONFIG_LAST_USED_KEY);
            if (!lastUsedName) {
                console.log("MediaExtractorUI: No last used configuration found.");
                return; // Nothing to load
            }

            console.log(`MediaExtractorUI: Found last used config name: "${lastUsedName}". Attempting to load.`);
            const config = this._loadConfigByName(lastUsedName);

            if (config) {
                const selectElement = this.uiRoot.querySelector('select[data-role="config-select"]');
                const saveNameInput = this.uiRoot.querySelector('input[data-role="config-save-name"]');
                const statusSpan = this.uiRoot.querySelector('.config-status[data-role="config-status-message"]');

                try {
                    this._updateUIFromConfig(config);

                    // Update dropdown and save name input
                    if (selectElement) selectElement.value = lastUsedName;
                    if (saveNameInput) saveNameInput.value = lastUsedName;
                    if (statusSpan) statusSpan.textContent = `Loaded last used config: "${lastUsedName}".`;

                    console.log(`MediaExtractorUI: Successfully loaded and applied last used config "${lastUsedName}".`);
                } catch (e) {
                    console.error(`MediaExtractorUI: Error applying last used config "${lastUsedName}" to UI:`, e);
                    if (statusSpan) statusSpan.textContent = `Error applying last config: ${e.message}`;
                    // Clear last used if applying failed?
                    // this._setLastUsedConfig(null);
                }
            } else {
                // Config not found or failed parse (error logged in _loadConfigByName)
                // Remove the invalid last used key
                console.warn(`MediaExtractorUI: Could not load last used config "${lastUsedName}", removing stored key.`);
                this._setLastUsedConfig(null);
                const statusSpan = this.uiRoot.querySelector('.config-status[data-role="config-status-message"]');
                if (statusSpan) statusSpan.textContent = `Could not load last config: "${lastUsedName}".`;
            }
        }
    }// ----------------------------------------------------------------------------------------------
    // main.js
    // ----------------------------------------------------------------------------------------------

    // ----------------------------------------------------------------------------------------------
    // DEFAULT CONFIGURATION
    // ----------------------------------------------------------------------------------------------

    const defaultConfigValues = {
        viewerAppearance: {
            _tabName: "Viewer (Appearance)",
            _subgroup: false, // To access values with config.key instead of config.groupName.key
            useFullscreen: { default: true, label: "Open in Fullscreen", requiresReload: false },
            openInDualPageMode: { default: false, label: "Open in dual page mode", requiresReload: false },
            openInRightToLeftMode: { default: false, label: "Open in right to left mode", requiresReload: false },
            fitMode: { default: "fit-window", label: "Default Fit Mode", choices: ["fit-window", "fit-width", "one-to-one"], requiresReload: false },
            dualLayout: { default: "selected-first", label: "Dual page layout", choices: ["selected-first", "odd-first", "even-first"], requiresReload: false },
            viewerLabels: {
                default: "always", label: "Page Number Visibility", requiresReload: false,
                choices: ["proximity", "always", "disabled"]
            },
            enableAnimations: { default: false, label: "Enable smooth animations", hidden: true },
            zoomAnimation: { default: true, label: "Enable Zoom Animation", hidden: true, requiresReload: false },
        },
        viewerBehavior: {
            _tabName: "Viewer (Behavior)",
            _subgroup: false,
            reverseNavigationInRtlMode: { default: false, label: "Reverse Navigation in Right to Left mode", requiresReload: false },
            exitToViewerPage: { default: false, label: "Highlight Current Page After Exiting", requiresReload: false },
            useOriginalImages: { default: false, label: "Use original images (slower, limited)", requiresReload: false },
            useFallbackImages: {
                default: true, label: "Use original images as fallback", requiresReload: false,
                condition: ["viewerBehavior.useOriginalImages", false], onConditionFail: { label: "Use webp images as fallback" }
            },
            enableFallbackStyling: { default: true, label: "Enable fallback styling for /s/ links", requiresReload: false },
            alwaysRestoreViewer: { default: false, label: "Always restore viewer after reload" },
            wheelToNextPage: { default: false, label: "Enable scroll to go to previous or next page", requiresReload: false },
            clickToNextPage: { default: false, label: "Enable click on left/right side to go to previous or next page", requiresReload: false },
            enableDragZoom: { default: true, label: "Enable drag to zoom", requiresReload: false },
            panFirst: { default: true, label: "Pan before changing page when zoomed", requiresReload: false },
            panStep: { default: 250, label: "Pan step", requiresReload: false, condition: ["viewerBehavior.panFirst", true] },
            preloadCount: { default: 5, label: "Number of Images to Preload", requiresReload: false },
            pasteBehavior: { default: "insert-new", label: "Paste Behavior", requiresReload: false, choices: ["insert-new", "overwrite-current"] },
            useFetchFallback: { default: true, label: "Use fetch fallback for videos", hidden: true, requiresReload: false },
        },
        toolbar: {
            _tabName: "Toolbar",
            _subgroup: false,
            helpAndSettingsButtons: {
                default: "always", label: "Toolbar Visibility", requiresReload: false,
                choices: ["proximity", "always", "disabled"]
            },
            buttonSize: { default: 38, label: "Button Size (in pixels)", requiresReload: false },
            showHelpButton: { default: true, label: "Help Button (?)", requiresReload: false },
            showSettingsButton: { default: true, label: "Settings Button (⚙)", requiresReload: false },
            showChaptersButton: { default: true, label: "Chapters Button (☰)", requiresReload: false },
            showGalleryViewButton: { default: true, label: "'Show Gallery View' Button (▦)", requiresReload: false },
            showDualPageButton: { default: true, label: "'Toggle Dual Page' Button (◫)", requiresReload: false },
            showDownloadButton: { default: false, label: "'Download Current Image' Button (⤓)", requiresReload: false },
            showFindGalleriesButton: { default: false, label: "'Find Galleries With This Image' Button (∈)", requiresReload: false },
            showGotoPageButton: { default: true, label: "'Go To Page' Button (⌕)", requiresReload: false },
            showRotateButtons: { default: false, label: "Rotate Buttons (↶ ↷)", requiresReload: false },
            showZoomButtons: { default: false, label: "Zoom Buttons (+ -)", requiresReload: false },
            showNavButtons: { default: false, label: "Navigation Buttons (← →)", requiresReload: false },
            showFullscreenButton: { default: true, label: "'Toggle Fullscreen' Button (⛶)", requiresReload: false },
            showExitButton: { default: true, label: "Exit Button (×)", requiresReload: false },
        },
        sidebar: {
            _tabName: "Sidebars",
            imageSidebar: {
                _sectionName: "Image Sidebar",
                enableSidebar: { default: true, label: "Enable Sidebar" },
                pinSidebar: { default: false, label: "Pin Sidebar", requiresReload: false, condition: ["sidebar.enableSidebar", true] },
                sidebarGridConfig: {
                    showPageNumbers: { default: true, label: "Show page numbers", condition: ["sidebar.enableSidebar", true] },
                    numColumns: { default: 1, label: "Number of columns", hidden: true },
                    fetchFullImages: { default: true, label: "Fetch full images", requiresReload: false, condition: ["sidebar.enableSidebar", true] },
                },
                sidebarPosition: { default: "left", label: "Sidebar Position", choices: ["left", "right"], condition: ["sidebar.enableSidebar", true] },
                sidebarWidth: { default: 400, label: "Sidebar Width", condition: ["sidebar.enableSidebar", true] },
                _subgroup: false,
            },
            chapterSidebar: {
                _sectionName: "Chapter Sidebar",
                chapterSidebarWidth: { default: 350, label: "Chapter Sidebar Width" },
                chapterSidebarEnableImages: { default: true, label: "Show Images" },
                // chapterSidebarGridConfig: {
                //     showPageNumbers: { default: true, label: "Show page numbers", hidden: true },
                //     numColumns: { default: 1, label: "Number of columns", hidden: true },
                //     fetchFullImages: { default: true, label: "Fetch full images", requiresReload: false, hidden: true },
                // },
                _subgroup: false,
            },
            _subgroup: false,
        },
        gallery: {
            _tabName: "Gallery",
            gridViewConfig: {
                showPageNumbers: { default: false, label: "Show page numbers" },
                fetchFullImages: { default: true, label: "Fetch full images", requiresReload: false },
                numColumns: { default: 4, label: "Number of columns" },
            },
            _subgroup: false,
        },
        embeddedGallery: {
            _tabName: "Embedded Gallery",
            replaceDefaultGridView: { default: true, label: "Enable (replaces default grid view)" },
            embeddedViewFullWidth: {
                default: false, label: "Make embedded gallery view span the full width",
                condition: ["embeddedGallery.replaceDefaultGridView", true]
            },
            embeddedGridGotoOpensViewer: {
                default: false, label: "Goto box opens viewer instead of scrolling", requiresReload: false,
                condition: ["embeddedGallery.replaceDefaultGridView", true]
            },
            embeddedGridViewConfig: {
                showPageNumbers: { default: false, label: "Show page numbers", condition: ["embeddedGallery.replaceDefaultGridView", true] },
                fetchFullImages: { default: true, label: "Fetch full images", condition: ["embeddedGallery.replaceDefaultGridView", true] },
                numColumns: { default: 4, label: "Number of columns", condition: ["embeddedGallery.replaceDefaultGridView", true] },
            },
            _subgroup: false,
        },
        videoConfig: {
            _tabName: "Video",
            _hidden: true,
            autoplay: { default: true, label: "Autoplay Videos" },
            loop: { default: true, label: "Loop Playback" },
        },
    };


    // ----------------------------------------------------------------------------------------------
    // CONSTANTS & STATE
    // ----------------------------------------------------------------------------------------------

    const PAGINATION = 20;
    const THUMB_WIDTH = 200;
    const THUMB_HEIGHT = 284;

    const baseUrl = `${window.location.protocol}//${window.location.host}`;

    // initialized in init()
    let galleryId = null;
    let totalPages = null;
    let totalGalleryImages = null;
    let galleryUsesSpritesheets = null;

    let config = null; // Config
    let thumbs = null; // ThumbCollection
    let chapterList = null;

    let imageViewer = null; // ImageViewer
    let embeddedGridView = null; // GridView

    // ----------------------------------------------------------------------------------------------
    // INITIALIZATION
    // ----------------------------------------------------------------------------------------------

    function initializeGlobalShortcuts() {
        document.addEventListener("keydown", (e) => {
            if (e.ctrlKey || e.altKey || e.metaKey) return;

            const targetElement = e.target;
            if (targetElement && (
                targetElement.tagName === 'INPUT' ||
                targetElement.tagName === 'TEXTAREA' ||
                targetElement.isContentEditable
            )) {
                return;
            }

            if (e.key === 'g' || e.key === 'G') {
                e.preventDefault(); // Prevent 'g' from being typed
                showGotoPageInput();
                return;
            } else if (e.key === 'p' || e.key === 'P') {
                if (config.showingUI()) {
                    config.closeUI();
                } else {
                    config.showUI();
                }
            } else if (e.key === "+" || e.key === "=") {
                if (embeddedGridView?.isShown()) {
                    config.embeddedGridViewConfig.numColumns--;
                    embeddedGridView.showGridView();
                }
            } else if (e.key === "-" || e.key === "_") {
                if (embeddedGridView?.isShown()) {
                    config.embeddedGridViewConfig.numColumns++;
                    embeddedGridView.showGridView();
                }
            }
        });
    }

    function initializeThumbnailListeners() {
        thumbs.forEach((thumbObj, index) => {
            if (!thumbObj)
                return;
            thumbObj.link.addEventListener("click", (e) => {
                e.preventDefault();
                imageViewer.loadAndShowIndex(index);
            });
        });
    }

    function processComments() {
        const c6Divs = document.querySelectorAll('.c6');
        let bestResult = null;
        let maxSuitableLinks = 0;

        // First pass: try to find comments with chapter links.
        c6Divs.forEach(div => {
            const suitableLinks = [];
            const links = div.querySelectorAll('a');

            links.forEach(link => {
                const href = link.getAttribute('href');
                // Check if href exists and contains the gallery id with a hyphen.
                if (href && href.includes(`${galleryId}-`)) {
                    const match = href.match(/\d+$/);
                    if (match) {
                        const index = parseInt(match[0], 10) - 1;
                        // Add click event for imageViewer.
                        link.addEventListener('click', (e) => {
                            e.preventDefault();
                            imageViewer.loadAndShowIndex(index);
                        });

                        // Extract the text description immediately following the <a> element.
                        let description = "";
                        let sibling = link.nextSibling;
                        while (sibling) {
                            if (sibling.nodeType === Node.TEXT_NODE) {
                                if (sibling.textContent.includes('\n')) {
                                    description += sibling.textContent.split('\n')[0];
                                    break;
                                } else {
                                    description += sibling.textContent;
                                }
                            } else if (
                                sibling.nodeType === Node.ELEMENT_NODE &&
                                sibling.tagName.toUpperCase() === "BR"
                            ) {
                                break;
                            }
                            sibling = sibling.nextSibling;
                        }
                        description = description.trim();

                        suitableLinks.push({
                            href: href,
                            index: index,
                            linkText: link.innerText.trim(),
                            description: description
                        });
                    }
                }
            });

            // Record the comment if it has at least two suitable links and more than any previous comment.
            if (suitableLinks.length >= 2 && suitableLinks.length > maxSuitableLinks) {
                bestResult = suitableLinks;
                maxSuitableLinks = suitableLinks.length;
            }
        });

        if (bestResult) {
            bestResult.sort((a, b) => a.index - b.index);
            return bestResult;
        }

        /************
         * BONUS: If no chapter list with links was found,
         * fallback to scanning comments for chapter lines.
         *
         * We pre-process the innerHTML for each comment by replacing two or more <br>
         * (and variants like <br/> or <br />) with a single <br> then convert <br> to newline.
         * This helps in cases like your example where double <br> can disrupt the line splitting.
         ************/
        let bestTextResult = null;
        let maxMatchingLines = 0;

        // Regex matching: optional leading zeroes, digits, then one of colon, period, or space followed by optional spaces and text.
        const chapterLineRegex = /^0*(\d+)[\:\.\s]\s*(.+)$/;

        c6Divs.forEach(div => {
            // Use innerHTML to capture <br> tags.
            let html = div.innerHTML;
            // Replace two or more consecutive <br> variants with a single <br>.
            html = html.replace(/(<br\s*\/?>\s*){2,}/gi, '<br>');
            // Replace remaining <br> tags with newline.
            const text = html.replace(/<br\s*\/?>/gi, '\n');
            // Split into lines.
            const lines = text.split(/\r?\n/);
            let matchingLines = [];
            let consecutiveBlock = [];

            // Iterate through each line, tracking consecutive matching lines.
            lines.forEach(line => {
                const trimmedLine = line.trim();
                if (trimmedLine === '') {
                    // Reset block if blank, preserving the longest block found so far.
                    if (consecutiveBlock.length > matchingLines.length) {
                        matchingLines = consecutiveBlock.slice();
                    }
                    consecutiveBlock = [];
                    return;
                }
                const match = trimmedLine.match(chapterLineRegex);
                if (match) {
                    consecutiveBlock.push({
                        index: parseInt(match[1], 10) - 1,
                        description: match[2].trim(),
                        line: trimmedLine
                    });
                } else {
                    if (consecutiveBlock.length > matchingLines.length) {
                        matchingLines = consecutiveBlock.slice();
                    }
                    consecutiveBlock = [];
                }
            });
            // Final check after the loop.
            if (consecutiveBlock.length > matchingLines.length) {
                matchingLines = consecutiveBlock.slice();
            }
            // Save this comment's chapter block if it has at least 2 entries and outperforms previous ones.
            if (matchingLines.length >= 2 && matchingLines.length > maxMatchingLines) {
                bestTextResult = matchingLines;
                maxMatchingLines = matchingLines.length;
            }
        });

        if (bestTextResult) {
            bestTextResult.sort((a, b) => a.index - b.index);
            return bestTextResult;
        }

        return null;
    }

    function initializeEmbeddedGridView() {
        const gridParent = document.getElementById('gdt');

        if (gridParent.classList.contains('gt100')) {
            // automatically set to 200x thumb size, because YAEV can't handle 100x
            document.location = document.location + "/?inline_set=ts_200";
        }

        gridParent.innerHTML = '';
        gridParent.className = 'gt200-nogrid'; // disables default grid css

        if (config.embeddedViewFullWidth) {
            gridParent.style.maxWidth = "none";
        }

        const headers = document.getElementsByClassName('gtb');
        const comments = document.getElementById('cdiv');

        for (let i = 0; i < headers.length; i++) {
            const element = headers[i];
            element.innerHTML = '';
            element.style.height = '10px';
        }

        // Create combined floating navigation button
        const navButton = document.createElement('div');
        navButton.style.position = 'fixed';
        navButton.style.bottom = '20px';
        navButton.style.right = '20px';
        navButton.style.zIndex = '1000';
        navButton.style.display = 'flex';
        navButton.style.flexDirection = 'column';
        navButton.style.gap = '4px';

        const upButton = document.createElement('button');
        upButton.textContent = '▲';
        upButton.style.padding = '12px 24px';
        upButton.style.fontSize = '18px';
        upButton.style.fontWeight = 'bold';
        upButton.style.backgroundColor = '#444';
        upButton.style.color = '#fff';
        upButton.style.border = 'none';
        upButton.style.borderRadius = '4px';
        upButton.style.cursor = 'pointer';
        upButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        upButton.addEventListener('click', () => {
            window.scrollTo(0, 0);
        });

        const downButton = document.createElement('button');
        downButton.textContent = '▼';
        downButton.style.padding = '12px 24px';
        downButton.style.fontSize = '18px';
        downButton.style.fontWeight = 'bold';
        downButton.style.backgroundColor = '#444';
        downButton.style.color = '#fff';
        downButton.style.border = 'none';
        downButton.style.borderRadius = '4px';
        downButton.style.cursor = 'pointer';
        downButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        downButton.addEventListener('click', () => {
            if (comments) {
                comments.scrollIntoView();
            }
        });

        navButton.appendChild(upButton);
        navButton.appendChild(downButton);
        document.body.appendChild(navButton);

        const provider = new GlobalGalleryProvider();
        embeddedGridView = new GridView(provider, gridParent, config.embeddedGridViewConfig, true);
        embeddedGridView.showGridView();

        // Remove some unnecessary buttons when "enable thumbnail selector on gallery screen" is enabled in the site settings
        const gdo = document.querySelector('#gdo');
        if (gdo) {
            const lastDiv = document.querySelector('#gdo > div:last-child > div');
            if (lastDiv) {
                // automatically set to 200x thumb size, because YAEV can't handle 100x
                console.log(lastDiv);
                const thaChild = Array.from(lastDiv.querySelectorAll('div.tha'))
                    .find(el => el.textContent.trim() === '200x');
                if (thaChild) {
                    document.location = document.location + "/?inline_set=ts_200";
                }
            }
            if (gdo.parentElement) {
                gdo.parentElement.removeChild(gdo);
            }
        }
    }

    // Fallback logic for /s/ urls
    function doFallback() {
        const resizeAndCenterImage = () => {
            const img = document.getElementById("img");
            if (!img) {
                console.warn("No image element found.");
                return;
            }

            if (!img.complete) {
                console.warn("Image not loaded, ignoring.");
                return;
            }

            const naturalWidth = img.naturalWidth;
            const naturalHeight = img.naturalHeight;
            if (!naturalWidth || !naturalHeight) {
                console.warn("Image dimension values missing, ignoring.");
                return;
            }

            // Calculate dimensions and scaling factor to fit the image inside the window.
            const scale = Math.min(window.innerWidth / naturalWidth, window.innerHeight / naturalHeight);
            const newWidth = naturalWidth * scale;
            const newHeight = naturalHeight * scale;

            // Remove any width/height attributes and update inline styles.
            img.removeAttribute("width");
            img.removeAttribute("height");
            img.style.width = newWidth + "px";
            img.style.height = newHeight + "px";

            // Scroll vertically to center the image.
            const imgRectBefore = img.getBoundingClientRect();
            const imgCenterY = window.scrollY + imgRectBefore.top + newHeight / 2;
            const targetScrollY = imgCenterY - window.innerHeight / 2;
            window.scrollTo(window.scrollX, targetScrollY);

            // Remove any existing horizontal translate before recalculating.
            img.style.transform = '';
            const imgRect = img.getBoundingClientRect();
            const currentImgLeft = imgRect.left;
            const desiredImgLeft = (window.innerWidth - newWidth) / 2;
            const translationX = desiredImgLeft - currentImgLeft;
            img.style.transform = `translateX(${translationX}px)`;
        };

        const attachResizeOnImageLoad = () => {
            const img = document.getElementById("img");
            if (!img) return;

            if (img.complete) {
                resizeAndCenterImage();
                // Second pass after a short delay to override other scripts
                setTimeout(resizeAndCenterImage, 100);
            } else {
                img.removeEventListener('load', attachResizeOnImageLoad);
                img.addEventListener('load', attachResizeOnImageLoad);
            }
        };

        const checkAndApplyFallback = () => {
            if (window.location.pathname.startsWith('/s/')) {
                attachResizeOnImageLoad();
            } else {
                console.log("Current URL doesn't match '/s/'; fallback operations not needed.");
            }
        };

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) {
                        if (node.id === "img" || (node.querySelector && node.querySelector("#img"))) {
                            attachResizeOnImageLoad();
                        }
                    }
                });
            });
        });

        if (document.body) {
            observer.observe(document.body, { childList: true, subtree: true });
        } else {
            window.addEventListener('DOMContentLoaded', () => {
                observer.observe(document.body, { childList: true, subtree: true });
            });
        }

        window.addEventListener('locationchange', () => {
            checkAndApplyFallback();
        });

        checkAndApplyFallback();
    }

    async function init() {
        config = new Config("YAEV Preferences", defaultConfigValues, true, true);

        if (config.enableFallbackStyling && window.location.pathname.startsWith('/s/')) {
            console.warn("/s/ urls are not supported unless they refer to an image in the same gallery id. Please open the image from its index page.");
            console.log("Applying fallback styling and exiting.");
            doFallback();
            return;
        }

        galleryId = getGalleryId();
        totalPages = getTotalPages();
        totalGalleryImages = getTotalImages();
        const intialPageIndex = getPageIndexFromUrl(window.location.href);

        console.log(`Extracted values:\nGallery ID: ${galleryId}\nTotal Images: ${totalGalleryImages}\nTotal Pages: ${totalPages}\nInitial Page: ${intialPageIndex + 1}`);

        const saveIndex = () => {
            if (imageViewer?.isActive()) {
                const currentIndex = imageViewer.currentIndex;
                GM_setValue('_savedViewerIndex', [galleryId, currentIndex]);
                console.log(`Saved current index ${currentIndex} for gallery ${galleryId} for reload`);
            }
        };

        config.onReload(saveIndex);

        if (config.alwaysRestoreViewer) {
            window.addEventListener('beforeunload', saveIndex);
        }

        thumbs = createThumbCollection(new Array(totalGalleryImages).fill(null));

        const initialThumbs = extractThumbnailLinks(document, intialPageIndex);
        // console.log(initialThumbs);
        if (!initialThumbs?.length) {
            console.warn('Could not extract pages');
        } else {
            console.log(`Extracted ${initialThumbs.length} items from the current page=${intialPageIndex + 1}`);
            console.log(`First image element:`, initialThumbs[0]);

            if (!initialThumbs[0]?.background) {
                console.warn("First image element missing background property. Failed to extract thumbs.");
            } else {
                try {
                    galleryUsesSpritesheets = determineIfSpritesheets(initialThumbs);
                    console.log(`Gallery uses spritesheets: ${galleryUsesSpritesheets}`);
                } catch (e) {
                    console.error(`Error while trying to determine if gallery uses spritesheets:`, e);
                }
            }
        }

        if (galleryUsesSpritesheets === null) {
            console.warn(`Unable to determine if gallery uses spritesheets. Assuming yes.`);
            galleryUsesSpritesheets = true;
        }

        populateThumbsOnPage(intialPageIndex, initialThumbs);

        initializeGlobalShortcuts();

        if (!config.replaceDefaultGridView) {
            initializeThumbnailListeners();
        } else {
            initializeEmbeddedGridView();
        }

        try {
            chapterList = processComments();
            if (chapterList) {
                console.log(`Found possible chapter list:`, chapterList);
            }
        } catch (e) {
            console.error(`Error processing comments: ${e}`);
        }

        imageViewer = new ImageViewer(config, (exitToPage, exitIndex) => {
            if (config.replaceDefaultGridView && embeddedGridView) {
                embeddedGridView.enableLoading();
            }
            if (exitToPage) {
                if (!config.replaceDefaultGridView) {
                    const page = thumbs[exitIndex].page;
                    const url = new URL(window.location.href);
                    url.searchParams.set("p", page);
                    console.log(`Loading page ${page}`);
                    window.location.href = url.href;
                } else if (embeddedGridView) {
                    embeddedGridView.scrollToIndex(exitIndex);
                }
            }
        });

        // Check for saved index from previous reload
        const savedData = GM_getValue('_savedViewerIndex', null);
        if (savedData !== null) {
            const [savedGalleryId, savedIndex] = savedData;
            if (savedGalleryId === galleryId) {
                console.log(`Restoring saved index ${savedIndex} for gallery ${galleryId}`);
                GM_deleteValue('_savedViewerIndex');
                imageViewer.loadAndShowIndex(savedIndex);
            } else {
                console.log(`Saved index ${savedIndex} is for different gallery ${savedGalleryId}, deleting`);
                GM_deleteValue('_savedViewerIndex');
            }
        }
    }

    init();

})();
