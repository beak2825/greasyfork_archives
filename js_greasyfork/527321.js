(function () {
    'use strict';

    // ==UserScript==
    // @name         Extra Practice
    // @namespace    https://github.com/mrpassiontea/Extra-Practice
    // @version      2.0.0
    // @description  Practice your current level's Radicals and Kanji with standard, english -> Kanji, and combination mode!
    // @author       @mrpassiontea
    // @match        https://www.wanikani.com/
    // @match        *://*.wanikani.com/dashboard
    // @match        *://*.wanikani.com/dashboard?*
    // @copyright    2025, mrpassiontea
    // @grant        none
    // @grant        window.onurlchange
    // @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
    // @require      https://unpkg.com/wanakana@5.3.1/wanakana.min.js
    // @license      MIT; http://opensource.org/licenses/MIT
    // @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/527321/Extra%20Practice.user.js
// @updateURL https://update.greasyfork.org/scripts/527321/Extra%20Practice.meta.js
    // ==/UserScript==


    const SELECTORS = {
        DIV_LEVEL_PROGRESS_CONTENT: "div.wk-panel__content div.level-progress-dashboard",
        DIV_CONTENT_WRAPPER: "div.level-progress-dashboard__content",
        DIV_CONTENT_TITLE: "div.level-progress-dashboard__content-title"
    };

    const DB_VALUES = {
        DB_NAME: "wkof.file_cache",
        USER_RECORD: "Apiv2.user",
        SUBJECT_RECORD: "Apiv2.subjects",
        FILE_STORE: "files"
    };

    const DB_ERRORS = {
        OPEN: "Failed to open database",
        USER_LEVEL: "Failed to retrieve user level",
        SUBJECT_DATA: "Failed to retrieve subjects data"
    };

    const PRACTICE_MODES = {
        STANDARD: 'standard',
        ENGLISH_TO_KANJI: 'englishToKanji',
        COMBINED: 'combined'
    };

    const modalTemplate = `
    <div id="ep-practice-modal">
        <div id="ep-practice-modal-content">
            <div id="ep-practice-modal-welcome">
                <h1>Hello, <span id="username"></span></h1>
                <h2>Please select all the Radicals that you would like to include in your practice session</h2>
            </div>
            <button id="ep-practice-modal-select-all">Select All</button>
            <div id="ep-practice-modal-grid"></div>
            <div id="ep-practice-modal-footer">
                <button id="ep-practice-modal-start" disabled>Start Review (0 Selected)</button>
                <button id="ep-practice-modal-close">Exit</button>
            </div>
        </div>
    </div>
`;

    const reviewModalTemplate = `
    <div id="ep-review-modal">
        <div id="ep-review-modal-wrapper">
            <div id="ep-review-modal-header">
                <div id="ep-review-progress">
                    <span id="ep-review-progress-correct">0</span>
                </div>
                <button id="ep-review-exit">End Review</button>
            </div>

            <div id="ep-review-content">
                <div id="ep-review-character"></div>

                <div id="ep-review-input-section">
                    <input type="text" id="ep-review-answer" placeholder="Enter meaning..." tabindex="1" autofocus />
                    <button id="ep-review-submit" tabindex="2">Submit</button>
                </div>

                <div id="ep-review-result" style="display: none;">
                    <div id="ep-review-result-message"></div>
                    <button id="ep-review-show-hint" style="display: none;">Show Answer</button>
                </div>

                <div id="ep-review-explanation" style="display: none;">
                    <h3>
                        <span id="ep-review-meaning-label">Meaning:</span>
                        <span id="ep-review-meaning"></span>
                    </h3>
                    <div class="mnemonic-container">
                        <span id="ep-review-mnemonic-label">Mnemonic:</span>
                        <div id="ep-review-mnemonic"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
`;

    // Theme constants for consistent values across the application
    const theme = {
        colors: {
            radical: "#0598e4",
            kanji: "#eb019c",
            white: "#FFFFFF",
            black: "#000000",
            gray: {
                100: "#F3F4F6",
                200: "#E5E7EB",
                300: "#D1D5DB",
                400: "#9CA3AF",
                600: "#4B5563",
                700: "#374151",
                800: "#1F2937"},
            overlay: {
                dark: "rgba(0, 0, 0, 0.9)"},
            success: "#10B981",
            error: "#EF4444",
            info: "#3B82F6"
        },
        spacing: {
            xs: "0.5rem",    // 8px
            sm: "0.75rem",   // 12px
            md: "1rem",      // 16px
            lg: "1.5rem",    // 24px
            xl: "2rem"},
        typography: {
            fontSize: {
                xs: "0.875rem",    // 14px
                sm: "1rem",        // 16px
                md: "1.25rem",     // 20px
                lg: "1.5rem",      // 24px
                xl: "2rem",        // 32px
                "2xl": "6rem"      // 96px (for the big character display)
            },
            fontWeight: {
                normal: "400",
                medium: "500",
                bold: "700"
            }
        },
        borderRadius: {
            sm: "3px",
            md: "4px",
            lg: "8px"
        },
        zIndex: {
            modal: 99999
        }
    };

    // Common style mixins for reusable patterns
    const mixins = {
        modalBackdrop: {
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            zIndex: theme.zIndex.modal
        }};

    // Component-specific styles
    const styles = {
        layout: {
            contentTitle: {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
            }
        },

        buttons: {
            practice: {
                radical: {
                    marginBottom: theme.spacing.md,
                    backgroundColor: theme.colors.radical,
                    padding: theme.spacing.sm,
                    borderRadius: theme.borderRadius.sm,
                    color: theme.colors.white,
                    fontWeight: theme.typography.fontWeight.medium,
                    cursor: "pointer"
                },
                kanji: {
                    marginBottom: theme.spacing.md,
                    backgroundColor: theme.colors.kanji,
                    padding: theme.spacing.sm,
                    borderRadius: theme.borderRadius.sm,
                    color: theme.colors.white,
                    fontWeight: theme.typography.fontWeight.medium,
                    cursor: "pointer"
                }
            }
        },

        practiceModal: {
            backdrop: {
                ...mixins.modalBackdrop,
                backgroundColor: theme.colors.overlay.dark,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center"
            },
            contentWrapper: {
                width: "100%",
                maxWidth: "800px",
                padding: `0 ${theme.spacing.xl}`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
            },
            welcomeText: {
                container: {
                    color: theme.colors.white,
                    textAlign: "center",
                    fontSize: theme.typography.fontSize.sm,
                    marginBottom: theme.spacing.md,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    maxWidth: "750px"
                },
                username: {
                    fontSize: theme.typography.fontSize.xl,
                    marginBottom: theme.spacing.md
                }
            },
            grid: {
                display: "grid",
                gridTemplateColumns: "repeat(5, minmax(100px, 1fr))",
                gap: theme.spacing.md,
                padding: `${theme.spacing.md} ${theme.spacing.xl}`,
                maxHeight: "50vh",
                maxWidth: "600px",
                margin: "0 auto",
                justifyContent: "center"
            },
            radical: {
                base: {
                    background: "rgba(255, 255, 255, 0.1)",
                    border: "2px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: theme.borderRadius.lg,
                    padding: theme.spacing.md,
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    transition: "all 0.2s ease"
                },
                selected: {
                    background: "rgba(5, 152, 228, 0.3)",
                    border: `2px solid ${theme.colors.radical}`
                },
                character: {
                    fontSize: theme.typography.fontSize.xl,
                    color: theme.colors.white
                }},
            buttons: {
                start: {
                    base: {
                        padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
                        borderRadius: theme.borderRadius.md,
                        border: "none",
                        fontWeight: theme.typography.fontWeight.medium,
                        transition: "all 0.2s ease",
                        cursor: "pointer",
                        color: theme.colors.white
                    },
                    radical: {
                        backgroundColor: theme.colors.radical,
                        '&:hover': {
                            backgroundColor: theme.colors.radical,
                            opacity: 0.9
                        }
                    },
                    kanji: {
                        backgroundColor: theme.colors.kanji,
                        '&:hover': {
                            backgroundColor: theme.colors.kanji,
                            opacity: 0.9
                        }
                    }
                },
                selectAll: {
                    color: theme.colors.white,
                    background: "transparent",
                    border: `1px solid ${theme.colors.white}`,
                    cursor: "pointer",
                    fontSize: theme.typography.fontSize.xs,
                    marginBottom: theme.spacing.md,
                    padding: theme.spacing.sm,
                    borderRadius: theme.borderRadius.sm,
                    fontWeight: theme.typography.fontWeight.bold,
                    transition: "all 0.2s ease"
                },
                exit: {
                    border: `1px solid ${theme.colors.white}`,
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                    color: theme.colors.black,
                    fontWeight: theme.typography.fontWeight.medium,
                    borderRadius: theme.borderRadius.sm,
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                }
            },
            footer: {
                padding: `${theme.spacing.md} ${theme.spacing.xl}`,
                display: "flex",
                justifyContent: "center",
                width: "100%",
                maxWidth: "600px",
                gap: theme.spacing.md
            },
            modeSelector: {
                container: {
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginBottom: theme.spacing.xl,
                    width: "100%",
                    maxWidth: "600px"
                },
                label: {
                    color: theme.colors.white,
                    fontSize: theme.typography.fontSize.md,
                    marginBottom: theme.spacing.md
                },
                options: {
                    display: "flex",
                    gap: theme.spacing.md,
                    justifyContent: "center",
                    width: "100%"
                },
                option: {
                    base: {
                        padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                        borderRadius: theme.borderRadius.md,
                        border: `2px solid ${theme.colors.gray[400]}`,
                        backgroundColor: "transparent",
                        color: theme.colors.white,
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        fontSize: theme.typography.fontSize.sm,
                        fontWeight: theme.typography.fontWeight.medium,
                        '&:hover': {
                            borderColor: theme.colors.kanji,
                            backgroundColor: "rgba(235, 1, 156, 0.1)"
                        }
                    },
                    selected: {
                        borderColor: theme.colors.kanji,
                        backgroundColor: "rgba(235, 1, 156, 0.2)"
                    }
                }
            }},

        reviewModal: {
            container: {
                backgroundColor: theme.colors.white,
                borderRadius: theme.borderRadius.lg,
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                maxWidth: "600px",
                width: "100%",
                display: "flex",
                flexDirection: "column"
            },
            header: {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: theme.spacing.lg,
                borderBottom: `1px solid ${theme.colors.gray[200]}`,
                gap: theme.spacing.md
            },
            progress: {
                fontWeight: theme.typography.fontWeight.bold,
                fontSize: theme.typography.fontSize.md,
                color: theme.colors.gray[800]
            },
            content: {
                padding: theme.spacing.xl,
                display: "flex",
                flexDirection: "column",
                width: "100%",
                gap: theme.spacing.xl,
            },
            character: {
                fontSize: theme.typography.fontSize["2xl"],
                color: theme.colors.gray[800],
                marginBottom: theme.spacing.xl,
                textAlign: "center"
            },
            inputSection: {
                width: "100%",
                display: "flex",
                gap: theme.spacing.md,
                marginBottom: theme.spacing.xl
            },
            input: {
                flex: "1",
                padding: theme.spacing.sm,
                fontSize: theme.typography.fontSize.sm,
                borderRadius: theme.borderRadius.md,
                border: `1px solid ${theme.colors.gray[300]}`
            },
            buttons: {
                submit: {
                    backgroundColor: theme.colors.info,
                    color: theme.colors.white,
                    padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
                    borderRadius: theme.borderRadius.md,
                    border: "none",
                    fontWeight: theme.typography.fontWeight.medium,
                    cursor: "pointer",
                    transition: "background-color 0.2s ease",
                    "&:hover": {
                        backgroundColor: "#2563EB"
                    }
                },
                exit: {
                    backgroundColor: "transparent",
                    color: theme.colors.kanji,
                    border: `1px solid ${theme.colors.kanji}`,
                    borderRadius: theme.borderRadius.md,
                    padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
                    fontWeight: theme.typography.fontWeight.medium,
                    cursor: "pointer",
                    transition: "background-color 0.2s ease",
                    "&:hover": {
                        backgroundColor: theme.colors.gray[100]
                    }
                },
                hint: {
                    backgroundColor: "transparent",
                    color: theme.colors.info,
                    border: `1px solid ${theme.colors.info}`,
                    borderRadius: theme.borderRadius.md,
                    padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
                    cursor: "pointer",
                    transition: "background-color 0.2s ease",
                    "&:hover": {
                        backgroundColor: theme.colors.gray[100]
                    }
                }
            },
            results: {
                message: {
                    fontSize: theme.typography.fontSize.lg,
                    fontWeight: theme.typography.fontWeight.bold,
                    marginBottom: theme.spacing.md,
                    color: theme.colors.info,
                    textAlign: "center",
                    "&.correct": {
                        color: theme.colors.success
                    },
                    "&.incorrect": {
                        color: theme.colors.error
                    }
                }
            },
            explanation: {
                lineHeight: "1.6",
                color: theme.colors.gray[600],
                fontSize: theme.typography.fontSize.md,
                meaningLabel: {
                    display: "inline-block",
                    fontWeight: theme.typography.fontWeight.normal,
                    fontSize: theme.typography.fontSize.md,
                    color: theme.colors.gray[800],
                    marginRight: theme.spacing.xs
                },
                meaningText: {
                    display: "inline-block",
                    fontWeight: theme.typography.fontWeight.bold,
                    fontSize: theme.typography.fontSize.md,
                    color: theme.colors.radical[800],
                    textDecoration: "none"
                },
                mnemonicContainer: {
                    marginTop: theme.spacing.md,
                    textAlign: "left",
                    lineHeight: "1.6"
                },
                mnemonicLabel: {
                    display: "block",
                    fontWeight: theme.typography.fontWeight.bold,
                    fontSize: theme.typography.fontSize.md,
                    color: theme.colors.gray[800],
                    marginBottom: theme.spacing.xs
                },
                mnemonic: {
                    color: theme.colors.gray[600],
                    fontSize: theme.typography.fontSize.md
                },
                mnemonicHighlight: {
                    backgroundColor: theme.colors.gray[200],
                    padding: `0 ${theme.spacing.xs}`,
                    borderRadius: theme.borderRadius.sm,
                    color: theme.colors.gray[800]
                }
            },
            kanjiOption: {
                base: {
                    padding: theme.spacing.lg,
                    borderRadius: theme.borderRadius.md,
                    border: `2px solid ${theme.colors.gray[300]}`,
                    backgroundColor: theme.colors.white,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s ease",
                    '&:hover': {
                        borderColor: theme.colors.kanji,
                        backgroundColor: "rgba(235, 1, 156, 0.1)"
                    }
                },
                selected: {
                    borderColor: theme.colors.kanji,
                    backgroundColor: "rgba(235, 1, 156, 0.2)"
                }
            }
        }
    };

    const PRACTICE_TYPES = {
        RADICAL: "radical",
        KANJI: "kanji"
    };

    const MODAL_STATES$1 = {
        READY: "ready"
    };

    const EVENTS$1 = {
        CLOSE: "close",
        START_REVIEW: "startReview"
    };

    class BaseReviewSession {
        constructor(selectedItems) {
            if (new.target === BaseReviewSession) {
                throw new Error("BaseReviewSession is an abstract class and cannot be instantiated directly.");
            }
            this.originalItems = selectedItems;
            this.currentItem = null;
        }

        shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }

        nextItem() {
            throw new Error("nextItem() must be implemented by derived classes");
        }

        checkAnswer(userAnswer) {
            throw new Error("checkAnswer() must be implemented by derived classes");
        }

        isComplete() {
            throw new Error("isComplete() must be implemented by derived classes");
        }

        getProgress() {
            throw new Error("getProgress() must be implemented by derived classes");
        }
    }

    class KanjiReviewSession extends BaseReviewSession {
        constructor(config) {
            super(config.items);
            this.mode = config.mode || PRACTICE_MODES.STANDARD;
            this.allUnlockedKanji = config.allUnlockedKanji || [];
            this.allCards = [];
            this.remainingItems = [];
            
            // Progress tracking
            this.correctMeanings = new Set();
            this.correctReadings = new Set();
            this.correctRecognition = new Set();
            
            // Initialize cards based on mode
            this.initializeCards();
        }

        initializeCards() {
            switch (this.mode) {
                case PRACTICE_MODES.STANDARD:
                    this.initializeStandardCards();
                    break;
                case PRACTICE_MODES.ENGLISH_TO_KANJI:
                    this.initializeRecognitionCards();
                    break;
                case PRACTICE_MODES.COMBINED:
                    this.initializeStandardCards();
                    this.initializeRecognitionCards();
                    break;
            }
            
            // Shuffle all cards together
            this.remainingItems = this.shuffleArray([...this.allCards]);
        }

        initializeStandardCards() {
            this.originalItems.forEach(kanji => {
                // Add meaning card
                this.allCards.push({
                    ...kanji,
                    type: "meaning",
                    questionType: "What is the meaning of this kanji?"
                });
                
                // Add reading card
                this.allCards.push({
                    ...kanji,
                    type: "reading",
                    questionType: "What is the reading of this kanji?"
                });
            });
        }

        initializeRecognitionCards() {
            this.originalItems.forEach(kanji => {
                const primaryMeaning = kanji.meanings.find(m => m.primary)?.meaning;
                
                // Create recognition card
                this.allCards.push({
                    ...kanji,
                    type: "recognition",
                    questionType: "Select the kanji that means",
                    meaningToMatch: primaryMeaning,
                    options: this.generateKanjiOptions(kanji)
                });
            });
        }

        generateKanjiOptions(correctKanji) {
            const numberOfOptions = 4;
            const options = [correctKanji];
            
            // Create a pool of incorrect options from the selected kanji
            const availableOptions = this.originalItems.filter(k => k.id !== correctKanji.id);

            
            // Randomly select additional options from the available pool
            while (options.length < numberOfOptions && availableOptions.length > 0) {
                const randomIndex = Math.floor(Math.random() * availableOptions.length);
                const selectedOption = availableOptions[randomIndex];
                options.push(selectedOption);
                availableOptions.splice(randomIndex, 1);
            }

            // If we still need more options (rare case when very few kanji are selected)
            // fill remaining slots with kanji from allUnlockedKanji
            if (options.length < numberOfOptions) {
                const additionalOptions = this.allUnlockedKanji.filter(k => 
                    !options.some(selected => selected.id === k.id) && 
                    !this.originalItems.some(selected => selected.id === k.id)
                );

                while (options.length < numberOfOptions && additionalOptions.length > 0) {
                    const randomIndex = Math.floor(Math.random() * additionalOptions.length);
                    const selectedOption = additionalOptions[randomIndex];
                    options.push(selectedOption);
                    additionalOptions.splice(randomIndex, 1);
                }
            }
            
            return this.shuffleArray(options);
        }

        nextItem() {
            if (this.remainingItems.length === 0) {
                // Get items that haven't been answered correctly
                const remainingUnlearned = [];
                
                this.originalItems.forEach(kanji => {
                    switch (this.mode) {
                        case PRACTICE_MODES.STANDARD:
                            if (!this.correctMeanings.has(kanji.id)) {
                                remainingUnlearned.push({
                                    ...kanji,
                                    type: "meaning",
                                    questionType: "What is the meaning of this kanji?"
                                });
                            }
                            if (!this.correctReadings.has(kanji.id)) {
                                remainingUnlearned.push({
                                    ...kanji,
                                    type: "reading",
                                    questionType: "What is the reading of this kanji?"
                                });
                            }
                            break;
                        case PRACTICE_MODES.ENGLISH_TO_KANJI:
                            if (!this.correctRecognition.has(kanji.id)) {
                                const primaryMeaning = kanji.meanings.find(m => m.primary)?.meaning;
                                remainingUnlearned.push({
                                    ...kanji,
                                    type: "recognition",
                                    questionType: "Select the kanji that means",
                                    meaningToMatch: primaryMeaning,
                                    options: this.generateKanjiOptions(kanji)
                                });
                            }
                            break;
                        case PRACTICE_MODES.COMBINED:
                            if (!this.correctMeanings.has(kanji.id)) {
                                remainingUnlearned.push({
                                    ...kanji,
                                    type: "meaning",
                                    questionType: "What is the meaning of this kanji?"
                                });
                            }
                            if (!this.correctReadings.has(kanji.id)) {
                                remainingUnlearned.push({
                                    ...kanji,
                                    type: "reading",
                                    questionType: "What is the reading of this kanji?"
                                });
                            }
                            if (!this.correctRecognition.has(kanji.id)) {
                                const primaryMeaning = kanji.meanings.find(m => m.primary)?.meaning;
                                remainingUnlearned.push({
                                    ...kanji,
                                    type: "recognition",
                                    questionType: "Select the kanji that means",
                                    meaningToMatch: primaryMeaning,
                                    options: this.generateKanjiOptions(kanji)
                                });
                            }
                            break;
                    }
                });

                // Shuffle the remaining items
                if (remainingUnlearned.length > 0) {
                    this.remainingItems = this.shuffleArray(remainingUnlearned);
                }
            }

            this.currentItem = this.remainingItems.shift();
            return this.currentItem;
        }

        checkAnswer(userAnswer) {
            if (!this.currentItem) return false;

            let isCorrect = false;

            switch (this.currentItem.type) {
                case "meaning":
                    isCorrect = this.checkMeaningAnswer(userAnswer);
                    if (isCorrect) this.correctMeanings.add(this.currentItem.id);
                    break;
                    
                case "reading":
                    isCorrect = this.checkReadingAnswer(userAnswer);
                    if (isCorrect) this.correctReadings.add(this.currentItem.id);
                    break;
                    
                case "recognition":
                    isCorrect = parseInt(userAnswer) === this.currentItem.id;
                    if (isCorrect) this.correctRecognition.add(this.currentItem.id);
                    break;
            }

            return isCorrect;
        }

        checkMeaningAnswer(userAnswer) {
            const normalizedUserAnswer = userAnswer.toLowerCase().trim();
            
            // Check primary meanings
            const isPrimaryCorrect = this.currentItem.meanings.some(m => 
                m.meaning.toLowerCase() === normalizedUserAnswer
            );
            
            if (isPrimaryCorrect) return true;
            
            // Check auxiliary meanings
            return this.currentItem.auxiliaryMeanings.some(m => 
                m.meaning.toLowerCase() === normalizedUserAnswer
            );
        }

        checkReadingAnswer(userAnswer) {
            const userReading = userAnswer.trim();
            return this.currentItem.readings.some(r => r.reading === userReading);
        }

        isComplete() {
            const progress = this.getProgress();
            return progress.current === progress.total;
        }

        getProgress() {
            const totalKanji = this.originalItems.length;
            let total, current;

            switch (this.mode) {
                case PRACTICE_MODES.STANDARD:
                    total = totalKanji * 2; // One point each for meaning and reading
                    current = this.correctMeanings.size + this.correctReadings.size;
                    return {
                        total,
                        current,
                        meaningProgress: this.correctMeanings.size,
                        readingProgress: this.correctReadings.size
                    };

                case PRACTICE_MODES.ENGLISH_TO_KANJI:
                    total = totalKanji; // One point for each recognition test
                    current = this.correctRecognition.size;
                    return {
                        total,
                        current,
                        recognitionProgress: this.correctRecognition.size
                    };

                case PRACTICE_MODES.COMBINED:
                    total = totalKanji * 3; // One point each for meaning, reading, and recognition
                    current = this.correctMeanings.size + 
                             this.correctReadings.size + 
                             this.correctRecognition.size;
                    return {
                        total,
                        current,
                        meaningProgress: this.correctMeanings.size,
                        readingProgress: this.correctReadings.size,
                        recognitionProgress: this.correctRecognition.size
                    };

                default:
                    return {
                        total: 0,
                        current: 0
                    };
            }
        }
    }

    class RadicalReviewSession extends BaseReviewSession {
        constructor(config) {
            super(config.items);
            this.remainingItems = this.shuffleArray([...config.items]);
            this.correctAnswers = new Set();
        }

        nextItem() {
            if (this.remainingItems.length === 0) {
                const remainingUnlearned = this.originalItems.filter(item => !this.correctAnswers.has(item.id));

                if (remainingUnlearned.length === 1) {
                    this.remainingItems = remainingUnlearned;
                } else {
                    this.remainingItems = this.shuffleArray(
                        remainingUnlearned.filter(item => !this.currentItem || item.id !== this.currentItem.id)
                    );
                }
            }
            this.currentItem = this.remainingItems.shift();
            return this.currentItem;
        }

        checkAnswer(userAnswer) {
            const isCorrect = this.currentItem.meaning.toLowerCase() === userAnswer.toLowerCase();
            if (isCorrect) {
                this.correctAnswers.add(this.currentItem.id);
            }
            return isCorrect;
        }

        isComplete() {
            return this.correctAnswers.size === this.originalItems.length;
        }

        getProgress() {
            const totalRadicals = this.originalItems.length;
            let current = this.correctAnswers.size;

            return {
                current,
                total: totalRadicals,
                remaining: totalRadicals - current,
                percentComplete: Math.round((current / totalRadicals) * 100)
            };
        }
    }

    function disableScroll() {
        const scrollPosition = window.scrollY || document.documentElement.scrollTop;

        $("html, body").css({
            overflow: "hidden",
            height: "100%",
            position: "fixed",
            top: `-${scrollPosition}px`,
            width: "100%",
        });
    }

    function enableScroll() {
        const scrollPosition = parseInt($("html").css("top")) * -1;

        $("html, body").css({
            overflow: "auto",
            height: "auto",
            position: "static",
            top: "auto",
            width: "auto",
        });

        window.scrollTo(0, scrollPosition);
    }

    // Cache for SVG content to avoid repeated fetches
    const svgCache = new Map();

    async function loadSvgContent(url) {
        if (svgCache.has(url)) {
            return svgCache.get(url);
        }
        
        const response = await fetch(url);
        const svgContent = await response.text();
        svgCache.set(url, svgContent);
        return svgContent;
    }

    class RadicalGrid {
        constructor(radicals, onSelectionChange) {
            this.radicals = radicals;
            this.selectedRadicals = new Set();
            this.onSelectionChange = onSelectionChange;
            this.$container = null;
        }

        updateRadicalSelection($element, radical, isSelected) {
            $element.css(
                isSelected 
                    ? { ...styles.practiceModal.radical.base, ...styles.practiceModal.radical.selected }
                    : styles.practiceModal.radical.base
            );

            if (isSelected) {
                this.selectedRadicals.add(radical.id);
            } else {
                this.selectedRadicals.delete(radical.id);
            }

            this.onSelectionChange(this.selectedRadicals);
        }

        toggleAllRadicals(shouldSelect) {
            if (shouldSelect) {
                this.radicals.forEach(radical => this.selectedRadicals.add(radical.id));
            } else {
                this.selectedRadicals.clear();
            }

            this.$container.find(".radical-selection-item").each((_, element) => {
                const $element = $(element);
                const radicalId = parseInt($element.data("radical-id"));
                this.updateRadicalSelection(
                    $element,
                    this.radicals.find(r => r.id === radicalId),
                    shouldSelect
                );
            });

            this.onSelectionChange(this.selectedRadicals);
        }

        getSelectedRadicals() {
            return Array.from(this.selectedRadicals).map(id => 
                this.radicals.find(radical => radical.id === id)
            );
        }

        async createRadicalElement(radical) {
            const $element = $("<div>")
                .addClass("radical-selection-item")
                .css(styles.practiceModal.radical.base)
                .data("radical-id", radical.id)
                .append(
                    $("<div>")
                        .addClass("radical-character")
                        .css(styles.practiceModal.radical.character)
                        .text(radical.character || "")
                )
                .on("click", () => {
                    const isCurrentlySelected = this.selectedRadicals.has(radical.id);
                    this.updateRadicalSelection($element, radical, !isCurrentlySelected);
                });

            if (!radical.character && radical.svg) {
                try {
                    const svgContent = await loadSvgContent(radical.svg);
                    $element.find(".radical-character").html(svgContent);
                    const svg = $element.find("svg")[0];
                    if (svg) {
                        svg.setAttribute("width", "100%");
                        svg.setAttribute("height", "100%");
                    }
                } catch (error) {
                    console.error("Error loading SVG:", error);
                    $element.find(".radical-character").text(radical.meaning);
                }
            }

            return $element;
        }

        async render() {
            this.$container = $("<div>")
                .css(styles.practiceModal.grid);

            // Create and append all radical elements
            const radicalElements = await Promise.all(
                this.radicals.map(radical => this.createRadicalElement(radical))
            );
            
            radicalElements.forEach($element => this.$container.append($element));
            
            return this.$container;
        }
    }

    class RadicalSelectionModal {
        constructor(radicals) {
            this.radicals = radicals;
            this.state = MODAL_STATES$1.READY;
            this.totalRadicals = radicals.length;
            this.$modal = null;
            this.radicalGrid = null;
            this.callbacks = new Map();
        }

        on(event, callback) {
            this.callbacks.set(event, callback);
            return this;
        }

        emit(event, data) {
            const callback = this.callbacks.get(event);
            if (callback) callback(data);
        }

        updateSelectAllButton(selectedCount) {
            const selectAllButton = $("#ep-practice-modal-select-all");
            const isAllSelected = selectedCount === this.totalRadicals;
            
            selectAllButton
                .text(isAllSelected ? "Deselect All" : "Select All")
                .css({
                    color: isAllSelected ? theme.colors.error : theme.colors.white,
                    borderColor: isAllSelected ? theme.colors.error : theme.colors.white
                });
        }

        updateStartButton(selectedCount) {
            const startButton = $("#ep-practice-modal-start");
            
            if (selectedCount > 0) {
                startButton
                    .prop("disabled", false)
                    .text(`Start Review (${selectedCount} Selected)`)
                    .css({
                        ...styles.practiceModal.buttons.start.base,
                        ...styles.practiceModal.buttons.start.radical
                    });
            } else {
                startButton
                    .prop("disabled", true)
                    .text("Start Review (0 Selected)")
                    .css({
                        ...styles.practiceModal.buttons.start.base,
                        ...styles.practiceModal.buttons.start.radical,
                        ...styles.practiceModal.buttons.start.disabled
                    });
            }
        }

        handleSelectionChange(selectedRadicals) {
            const selectedCount = selectedRadicals.size;
            this.updateSelectAllButton(selectedCount);
            this.updateStartButton(selectedCount);
        }

        async render() {
            this.$modal = $(modalTemplate).appendTo("body");
            
            $("#username").text($("p.user-summary__username:first").text());
            
            this.$modal.css(styles.practiceModal.backdrop);
            $("#ep-practice-modal-welcome").css(styles.practiceModal.welcomeText.container);
            $("#ep-practice-modal-welcome h1").css(styles.practiceModal.welcomeText.username);
            $("#ep-practice-modal-footer").css(styles.practiceModal.footer);
            $("#ep-practice-modal-start").css({
                ...styles.practiceModal.buttons.start.base,
                ...styles.practiceModal.buttons.start.radical,
                ...styles.practiceModal.buttons.start.disabled
            });
            $("#ep-practice-modal-select-all").css(styles.practiceModal.buttons.selectAll);
            $("#ep-practice-modal-content").css(styles.practiceModal.contentWrapper);
            $("#ep-practice-modal-close").css(styles.practiceModal.buttons.exit);

            this.radicalGrid = new RadicalGrid(
                this.radicals,
                this.handleSelectionChange.bind(this)
            );

            const $grid = await this.radicalGrid.render();
            $("#ep-practice-modal-grid").replaceWith($grid);

            this.updateStartButton(0);

            $("#ep-practice-modal-select-all").on("click", () => {
                const isSelectingAll = $("#ep-practice-modal-select-all").text() === "Select All";
                this.radicalGrid.toggleAllRadicals(isSelectingAll);
            });

            $("#ep-practice-modal-close").on("click", () => {
                this.emit(EVENTS$1.CLOSE);
            });

            $("#ep-practice-modal-start").on("click", () => {
                const selectedRadicals = this.radicalGrid.getSelectedRadicals();
                if (selectedRadicals.length > 0) {
                    this.emit(EVENTS$1.START_REVIEW, selectedRadicals);
                }
            });

            return this.$modal;
        }

        remove() {
            if (this.$modal) {
                this.$modal.remove();
                this.$modal = null;
            }
        }
    }

    const REVIEW_STATES = {
        ANSWERING: "answering",
        REVIEWING: "reviewing"};

    const REVIEW_EVENTS = {
        CLOSE: "close",
        NEXT_ITEM: "nextItem",
        COMPLETE: "complete",
        STUDY_AGAIN: "studyAgain"
    };

    class ReviewCard {
        constructor(item, state = REVIEW_STATES.ANSWERING) {
            this.item = item;
            this.state = state;
            this.$container = null;
            this.isKanji = !!this.item.readings;
            this.selectedOption = null;
            this.handleKanjiSelection = this.handleKanjiSelection.bind(this);
        }

        handleKanjiSelection(event, option) {
            const $selectedElement = $(event.currentTarget);
            
            this.$container.find('.kanji-option').css(styles.reviewModal.kanjiOption.base);
            
            $selectedElement.css({
                ...styles.reviewModal.kanjiOption.base,
                ...styles.reviewModal.kanjiOption.selected
            });
        
            this.selectedOption = option.id;
            
            const $submitButton = this.$container.find('#ep-review-submit');
            $submitButton
                .prop('disabled', false)
                .css({
                    ...styles.reviewModal.buttons.submit,
                    opacity: 1,
                    cursor: "pointer"
                });
        }


        getQuestionText() {
            if (this.item.type === "recognition") {
                return ["Select the kanji that means ", this.createEmphasisSpan(this.item.meaningToMatch)];
            }
            
            if (!this.isKanji) {
                return ["What is the meaning of this ", this.createEmphasisSpan("radical"), "?"];
            }
        
            if (this.item.type === "reading") {
                const readingType = this.item.readings.find(r => r.primary)?.type;
                const readingText = readingType === "onyomi" ? "on'yomi" : "kun'yomi";
                return ["What is the ", this.createEmphasisSpan(readingText), " reading for this kanji?"];
            }
        
            return ["What is the ", this.createEmphasisSpan("meaning"), " of this kanji?"];
        }
        
        createEmphasisSpan(text) {
            return $("<span>")
                .text(text)
                .css({
                    fontWeight: theme.typography.fontWeight.bold,
                    color: this.isKanji ? theme.colors.kanji : theme.colors.radical,
                    padding: `${theme.spacing.xs}`,
                    borderRadius: theme.borderRadius.sm,
                    backgroundColor: this.isKanji ? 
                        "rgba(235, 1, 156, 0.1)" : 
                        "rgba(5, 152, 228, 0.1)"
                });
        }

        createKanjiOption(option) {
            const $option = $("<div>")
                .addClass("kanji-option")
                .css(styles.reviewModal.kanjiOption.base)
                .data("kanji-id", option.id)
                .append(
                    $("<div>")
                        .addClass("kanji-character")
                        .css({
                            fontSize: theme.typography.fontSize["2xl"],
                            color: theme.colors.gray[800],
                            textAlign: "center"
                        })
                        .text(option.character)
                );

            $option.on("click", (event) => this.handleKanjiSelection(event, option));
            
            return $option;
        }

        async renderCharacter() {
            const $character = $("<div>")
                .addClass("ep-review-character")
                .css(styles.reviewModal.character);

            if (this.item.character) {
                $character.text(this.item.character);
            } else if (this.item.svg) {
                try {
                    const svgContent = await loadSvgContent(this.item.svg);
                    $character.html(svgContent);
                    const svg = $character.find("svg")[0];
                    if (svg) {
                        svg.setAttribute("width", "100%");
                        svg.setAttribute("height", "100%");
                    }
                } catch (error) {
                    console.error("Error loading SVG:", error);
                    $character.text(this.item.meaning);
                }
            }

            return $character;
        }

        async renderAnsweringState() {
            const $content = $("<div>").addClass("ep-review-content");
        
            if (this.item.type === "recognition") {
                return this.renderRecognitionCard($content);
            } else {
                const $character = await this.renderCharacter();
                const $question = $("<div>")
                    .addClass("ep-review-question")
                    .css({
                        fontSize: theme.typography.fontSize.lg,
                        marginBottom: theme.spacing.lg,
                        color: theme.colors.gray[700]
                    });
        
                const questionContent = this.getQuestionText();
                questionContent.forEach(content => {
                    if (content instanceof jQuery) {
                        $question.append(content);
                    } else {
                        $question.append(document.createTextNode(content));
                    }
                });
        
                const $inputSection = $("<div>")
                    .addClass("ep-review-input-section")
                    .css(styles.reviewModal.inputSection)
                    .append(
                        $("<input>")
                            .attr({
                                type: "text",
                                id: "ep-review-answer",
                                placeholder: this.item.type === "reading" ? "Enter reading..." : "Enter meaning...",
                                tabindex: "1",
                                autofocus: true
                            })
                            .css(styles.reviewModal.input),
                        $("<button>")
                            .attr("id", "ep-review-submit")
                            .text("Submit")
                            .attr("tabindex", "2")
                            .css(styles.reviewModal.buttons.submit)
                    );
        
                $content.append($character);
                $content.append($question);
                $content.append($inputSection);
                
                return $content;
            }
        }

        async renderStandardAnsweringCard($content) {
            const $character = await this.renderCharacter();
            const $question = $("<div>")
                .addClass("ep-review-question")
                .css({
                    fontSize: theme.typography.fontSize.lg,
                    marginBottom: theme.spacing.lg,
                    color: theme.colors.gray[700]
                });

            const questionContent = this.getQuestionText();
            questionContent.forEach(content => {
                if (content instanceof jQuery) {
                    $question.append(content);
                } else {
                    $question.append(document.createTextNode(content));
                }
            });

            const $inputSection = $("<div>")
                .addClass("ep-review-input-section")
                .css(styles.reviewModal.inputSection)
                .append(
                    $("<input>")
                        .attr({
                            type: "text",
                            id: "ep-review-answer",
                            placeholder: this.item.type === "reading" ? "Enter reading..." : "Enter meaning...",
                            tabindex: "1",
                            autofocus: true
                        })
                        .css(styles.reviewModal.input),
                    $("<button>")
                        .attr("id", "ep-review-submit")
                        .text("Submit")
                        .attr("tabindex", "2")
                        .css(styles.reviewModal.buttons.submit)
                );

            return $content.append($character, $question, $inputSection);
        }

        async renderRecognitionCard($content) {
            const $questionContainer = $("<div>")
                .css({
                    textAlign: "center",
                    marginBottom: theme.spacing.xl
                });

            const $question = $("<div>")
                .addClass("ep-review-question")
                .css({
                    fontSize: theme.typography.fontSize.lg,
                    color: theme.colors.gray[700],
                    marginBottom: theme.spacing.md
                });

            const questionContent = this.getQuestionText();
            questionContent.forEach(content => {
                if (content instanceof jQuery) {
                    $question.append(content);
                } else {
                    $question.append(document.createTextNode(content));
                }
            });

            $questionContainer.append($question);

            const $optionsGrid = $("<div>")
                .css({
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: theme.spacing.lg,
                    padding: theme.spacing.xl,
                    maxWidth: "500px",
                    margin: "0 auto"
                });

            this.item.options.forEach(option => {
                $optionsGrid.append(this.createKanjiOption(option));
            });

            const $submitButton = $("<button>")
                .attr({
                    id: "ep-review-submit",
                    disabled: true
                })
                .text("Submit")
                .css({
                    ...styles.reviewModal.buttons.submit,
                    opacity: 0.5,
                    cursor: "not-allowed"
                });

            const $submitButtonContainer = $("<div>")
                .css({
                    textAlign: "center",
                    marginTop: theme.spacing.xl
                })
                .append($submitButton);

            return $content.append($questionContainer, $optionsGrid, $submitButtonContainer);
        }

        processMnemonic(mnemonic) {
            if (!mnemonic) return "";

            if (!this.isKanji) {
                return mnemonic.replace(/<radical>(.*?)<\/radical>/g, (_, content) => 
                    `<span style="background-color: ${theme.colors.radical}; padding: 0 ${theme.spacing.xs}; border-radius: ${theme.borderRadius.sm}; color: ${theme.colors.white}">${content}</span>`
                );
            }

            return mnemonic
                .replace(/<radical>(.*?)<\/radical>/g, (_, content) => 
                    `<span style="background-color: ${theme.colors.radical}; padding: 0 ${theme.spacing.xs}; border-radius: ${theme.borderRadius.sm}; color: ${theme.colors.white}">${content}</span>`
                )
                .replace(/<kanji>(.*?)<\/kanji>/g, (_, content) => 
                    `<span style="background-color: ${theme.colors.kanji}; padding: 0 ${theme.spacing.xs}; border-radius: ${theme.borderRadius.sm}; color: ${theme.colors.white}">${content}</span>`
                )
                .replace(/<reading>(.*?)<\/reading>/g, (_, content) => 
                    `<span style="background-color: ${theme.colors.gray[200]}; padding: 0 ${theme.spacing.xs}; border-radius: ${theme.borderRadius.sm}; color: ${theme.colors.gray[800]}">${content}</span>`
                );
        }

        async renderReviewingState() {
            const $content = $("<div>").addClass("ep-review-content");
            const $character = await this.renderCharacter();
            const $explanation = $("<div>")
                .addClass("ep-review-explanation")
                .css(styles.reviewModal.explanation);

            const primaryReading = this.item.readings?.find(r => r.primary);
            const primaryMeaning = this.item.meanings?.find(m => m.primary);

            const $continueButton = $("<button>")
            .attr("id", "ep-review-continue")
            .text("Continue Review")
            .css({
                ...styles.reviewModal.buttons.submit,
                minWidth: "120px",
                display: "block",
                margin: "30px auto 0"
            });
            
            const $buttonContainer = $("<div>")
                .addClass("ep-review-buttons")
                .css({ 
                    display: "flex",
                    gap: theme.spacing.md,
                    justifyContent: "center",
                    marginTop: theme.spacing.xl
                })
                .append($continueButton);

            // Handle non-kanji (radical) review state
            if (!this.isKanji) {
                $content.append(
                    $character,
                    $explanation.append(
                        $("<h3>").append(
                            $("<span>")
                                .text("Meaning: ")
                                .css(styles.reviewModal.explanation.meaningLabel),
                            $("<a>")
                                .attr({
                                    href: this.item.documentationUrl,
                                    target: "_blank",
                                    title: `Click to learn more about: ${this.item.meaning}`
                                })
                                .text(this.item.meaning)
                                .css(styles.reviewModal.explanation.meaningText)
                        ),
                        $("<div>")
                            .addClass("ep-mnemonic-container")
                            .css(styles.reviewModal.explanation.mnemonicContainer)
                            .append(
                                $("<span>")
                                    .text("Mnemonic:")
                                    .css(styles.reviewModal.explanation.mnemonicLabel),
                                $("<div>")
                                    .addClass("ep-review-mnemonic")
                                    .html(this.processMnemonic(this.item.meaningMnemonic))
                                    .css(styles.reviewModal.explanation.mnemonic)
                            )
                    )
                );

                $content.append($buttonContainer);
                return $content;
            }

            // Handle kanji review states based on question type
            switch (this.item.type) {
                case "recognition":
                    $explanation.append(
                        this.createExplanationSection(
                            "Meaning",
                            this.item.meaningToMatch,
                            this.item.meaningMnemonic,
                            true
                        )
                    );

                    if (primaryReading) {
                        const readingType = primaryReading.type === "onyomi" ? "On'yomi" : "Kun'yomi";
                        $explanation.append(
                            this.createExplanationSection(
                                "Reading",
                                `${readingType}: ${primaryReading.reading}`,
                                this.item.readingMnemonic,
                                false
                            )
                        );
                    }
                    break;

                case "reading":
                    if (primaryReading) {
                        const readingType = primaryReading.type === "onyomi" ? "On'yomi" : "Kun'yomi";
                        $explanation.append(
                            this.createExplanationSection(
                                "Reading",
                                `${readingType}: ${primaryReading.reading}`,
                                this.item.readingMnemonic,
                                true
                            )
                        );
                    }

                    if (primaryMeaning) {
                        $explanation.append(
                            this.createExplanationSection(
                                "Meaning",
                                primaryMeaning.meaning,
                                this.item.meaningMnemonic,
                                false
                            )
                        );
                    }
                    break;

                case "meaning":
                    if (primaryMeaning) {
                        $explanation.append(
                            this.createExplanationSection(
                                "Meaning",
                                primaryMeaning.meaning,
                                this.item.meaningMnemonic,
                                true
                            )
                        );
                    }

                    if (primaryReading) {
                        const readingType = primaryReading.type === "onyomi" ? "On'yomi" : "Kun'yomi";
                        $explanation.append(
                            this.createExplanationSection(
                                "Reading",
                                `${readingType}: ${primaryReading.reading}`,
                                this.item.readingMnemonic,
                                false
                            )
                        );
                    }
                    break;
            }

            

            $content.append($character, $explanation);
            $content.append($buttonContainer);

            return $content;
        }

        createExplanationSection(title, answer, mnemonic, isExpanded) {
            const $section = $("<div>")
                .addClass("explanation-section")
                .css({
                    marginBottom: theme.spacing.md,
                    width: "100%",
                    display: "block"
                });
        
            const $header = $("<div>")
                .css({
                    display: "block",
                    padding: `${theme.spacing.sm} 0`,
                    width: "100%",
                    borderBottom: `1px solid ${theme.colors.gray[200]}`,
                });
                

            const $headerContent = $("<div>")
                .css({
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    width: "100%"
                }).append(
                    $("<span>")
                        .text(isExpanded ? "▼" : "▶")
                        .css({ 
                            color: theme.colors.gray[600],
                            marginRight: theme.spacing.sm,
                            fontSize: theme.typography.fontSize.md,
                            flexShink: 0
                        }),
                    $("<h3>")
                        .text(title)
                        .css({
                            margin: 0,
                            color: theme.colors.gray[800],
                            fontWeight: theme.typography.fontWeight.medium,
                            fontSize: theme.typography.fontSize.md,
                            flex: 1
                        })
                );
            
            $header.append($headerContent);
        
            const $content = $("<div>")
                .css({
                    display: isExpanded ? "block" : "none",
                    paddingLeft: theme.spacing.xl,
                    paddingTop: theme.spacing.md,
                    paddingBottom: theme.spacing.md
                });
        
            if (title.toLowerCase() === "reading") {
                // Extract reading type and format display
                const readingType = this.item.readings.find(r => r.primary)?.type;
                const formattedType = readingType === "onyomi" ? "On'yomi" : "Kun'yomi";
                
                $content.append(
                    $("<div>")
                        .css({
                            fontSize: theme.typography.fontSize.lg,
                            color: theme.colors.gray[800],
                            marginBottom: theme.spacing.md
                        })
                        .append(
                            $("<span>")
                                .text(`${formattedType}: `)
                                .css({
                                    color: theme.colors.gray[600],
                                    fontSize: theme.typography.fontSize.md
                                }),
                            $("<span>")
                                .text(this.item.readings.find(r => r.primary)?.reading || "")
                        )
                );
        
                if (mnemonic) {
                    $content.append(
                        $("<div>")
                            .addClass("ep-mnemonic-container")
                            .css(styles.reviewModal.explanation.mnemonicContainer)
                            .append(
                                $("<span>")
                                    .text("Mnemonic:")
                                    .css(styles.reviewModal.explanation.mnemonicLabel),
                                $("<div>")
                                    .addClass("ep-review-mnemonic")
                                    .html(this.processMnemonic(mnemonic))
                                    .css(styles.reviewModal.explanation.mnemonic)
                            )
                    );
                }
            } else {
                const meaningText = this.item.type === "recognition" 
                    ? this.item.meaningToMatch
                    : this.item.meanings.find(m => m.primary)?.meaning;
        
                $content.append(
                    $("<div>")
                        .css({
                            fontSize: theme.typography.fontSize.lg,
                            color: theme.colors.gray[800],
                            marginBottom: theme.spacing.md
                        })
                        .text(meaningText)
                );
        
                if (mnemonic) {
                    $content.append(
                        $("<div>")
                            .addClass("ep-mnemonic-container")
                            .css(styles.reviewModal.explanation.mnemonicContainer)
                            .append(
                                $("<span>")
                                    .text("Mnemonic:")
                                    .css(styles.reviewModal.explanation.mnemonicLabel),
                                $("<div>")
                                    .addClass("ep-review-mnemonic")
                                    .html(this.processMnemonic(mnemonic))
                                    .css(styles.reviewModal.explanation.mnemonic)
                            )
                    );
                }
            }
        
            $header.on("click", function() {
                const $content = $(this).siblings("div");
                const isVisible = $content.is(":visible");
                $content.slideToggle(200);
                const $arrow = $(this).find("span").first();
                $arrow.text(isVisible ? "▶" : "▼");
            });
        
            return $section.append($header, $content);
        }

        async render() {
            this.$container = $("<div>")
                .addClass("ep-review-card")
                .css({
                    padding: theme.spacing.xl,
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    gap: theme.spacing.xl
                });
        
            const $characterContainer = $("<div>")
                .css({
                    textAlign: "center",
                    width: "100%"
                });
        
            const $contentContainer = $("<div>")
                .css({
                    width: "100%",
                    textAlign: "left"
                });
        
            const content = await (this.state === REVIEW_STATES.ANSWERING
                ? this.renderAnsweringState()
                : this.renderReviewingState());
        
            if (this.state === REVIEW_STATES.ANSWERING) {
                const $character = content.find(".ep-review-character").detach();
                $characterContainer.append($character);
                
                $contentContainer.append(content);
            } else {
                const $character = content.find(".ep-review-character").detach();
                $characterContainer.append($character);
                
                $contentContainer.append(content.find(".ep-review-explanation"));
            }
        
            this.$container.append($characterContainer, $contentContainer);
            return this.$container;
        }

        async updateState(newState) {
            if (this.state === newState) return;
            
            this.state = newState;
            const content = this.state === REVIEW_STATES.ANSWERING
                ? await this.renderAnsweringState()
                : await this.renderReviewingState();

            this.$container.empty().append(content);
        }

        getAnswer() {
            if (this.item.type === "recognition") {
                return this.selectedOption?.toString() || "";
            }
            return $("#ep-review-answer").val()?.trim() || "";
        }

        remove() {
            if (this.$container) {
                this.$container.remove();
                this.$container = null;
            }
        }
    }

    class ReviewSessionModal {
        constructor(reviewSession) {
            this.reviewSession = reviewSession;
            this.state = REVIEW_STATES.ANSWERING;
            this.$modal = null;
            this.currentCard = null;
            this.callbacks = new Map();
            this.isKanjiSession = !!this.reviewSession.correctMeanings;

            // Session configuration for Play Again
            this.sessionConfig = {
                mode: this.reviewSession.mode,
                items: this.reviewSession.originalItems,
            };

            if (this.sessionConfig.mode !== "radical") {
                this.sessionConfig.allUnlockedKanji = this.reviewSession.allUnlockedKanji;
            }
        
            this.handlePlayAgain = this.handlePlayAgain.bind(this);
            this.handleAnswer = this.handleAnswer.bind(this);
            this.handleNextItem = this.handleNextItem.bind(this);
            this.showHint = this.showHint.bind(this);
            this.setupInput = this.setupInput.bind(this);
            this.showCurrentItem = this.showCurrentItem.bind(this);
            this.updateProgress = this.updateProgress.bind(this);
            this.showReviewInterface = this.showReviewInterface.bind(this);
            this.hideReviewInterface = this.hideReviewInterface.bind(this);
            this.showInputInterface = this.showInputInterface.bind(this);
            this.hideInputInterface = this.hideInputInterface.bind(this);
            this.showCompletionScreen = this.showCompletionScreen.bind(this);
        }

        // Setup Hiragana Keyboard
        setupInput() {
            const input = document.querySelector("#ep-review-answer");
            if (!input) return;

            const currentItem = this.reviewSession.currentItem;
            if (!currentItem) return;

            if (this.isKanjiSession && currentItem.type === "reading") {
                wanakana.bind(input, {
                    IMEMode: "toHiragana",
                    useObsoleteKana: false,
                    passRomaji: false,
                    upcaseKatakana: false,
                    convertLongVowelMark: true
                });
            }
        }

        on(event, callback) {
            this.callbacks.set(event, callback);
            return this;
        }

        emit(event, data) {
            const callback = this.callbacks.get(event);
            if (callback) callback(data);
        }

        handlePlayAgain() {
            const newSession = this.isKanjiSession ? new KanjiReviewSession({
                items: this.sessionConfig.items,
                mode: this.sessionConfig.mode,
                allUnlockedKanji: this.sessionConfig.allUnlockedKanji
            }) : new RadicalReviewSession({
                items: this.sessionConfig.items,
                mode: "radical",
            });

            // Initialize new session
            newSession.nextItem();

            // Clean up current modal
            this.remove();

            const newModal = new ReviewSessionModal(newSession);
            newModal
                .on(REVIEW_EVENTS.CLOSE, () => {
                    enableScroll();
                    newModal.remove();
                })
                .on(REVIEW_EVENTS.STUDY_AGAIN, () => {
                    newModal.remove();
                    enableScroll();
                    if (this.isKanjiSession) {
                        handleKanjiPractice();
                    } else {
                        handleRadicalPractice();
                    }
                });
            
                return newModal.render();
        }

        updateProgress() {
            const progress = this.reviewSession.getProgress();
            const mode = this.reviewSession.mode;
            let progressText;

            switch (mode) {
                case PRACTICE_MODES.ENGLISH_TO_KANJI:
                    progressText = `${progress.recognitionProgress}/${progress.total} Correct`;
                    break;
                case PRACTICE_MODES.COMBINED:
                    progressText = `Meanings: ${progress.meaningProgress}/${progress.total/3} | ` +
                                 `Readings: ${progress.readingProgress}/${progress.total/3} | ` +
                                 `Recognition: ${progress.recognitionProgress}/${progress.total/3}`;
                    break;
                case PRACTICE_MODES.STANDARD:
                    progressText = `Meanings: ${progress.meaningProgress}/${progress.total/2} | ` +
                                 `Readings: ${progress.readingProgress}/${progress.total/2}`;
                    break;
                default: // RADICAL 
                    progressText = `${progress.current}/${progress.total/1} Correct`;
            }

            $("#ep-review-progress-correct").html(progressText);

            if (mode === PRACTICE_MODES.COMBINED) {
                $("#ep-review-progress-correct").css({
                    fontSize: theme.typography.fontSize.xs
                });
            }
            
        }

        showReviewInterface() {
            $("#ep-review-result").show();
            $("#ep-review-result-message").show();
            $("#ep-review-explanation").show();
            $(".ep-review-buttons").hide();
        }

        hideReviewInterface() {
            $("#ep-review-result").hide();
            $("#ep-review-result-message").hide();
            $("#ep-review-explanation").hide();
            $("#ep-review-show-hint").hide();
            $(".ep-review-buttons").show();
        }

        showInputInterface() {
            $("#ep-review-input-section").show();
            $("#ep-review-answer").val("").prop("disabled", false);
            $("#ep-review-submit").show();
            $("#ep-review-answer").focus();

            this.setupInput();
        }

        hideInputInterface() {
            $("#ep-review-input-section").hide();
            $("#ep-review-submit").hide();
            $("#ep-review-answer").prop("disabled", true);
        }

        async showCurrentItem() {
            const currentItem = this.reviewSession.currentItem;
            
            if (this.currentCard) {
                this.currentCard.remove();
            }
        
            this.state = REVIEW_STATES.ANSWERING;
            this.hideReviewInterface();
            
            this.currentCard = new ReviewCard(currentItem, REVIEW_STATES.ANSWERING);
            const $card = await this.currentCard.render();
            
            // Clear and append the new card
            $("#ep-review-content").empty().append($card);
            
            // Ensure input is focused after rendering
            if (currentItem.type !== "recognition") {
                const $input = $("#ep-review-answer");
                if ($input.length) {
                    $input.focus();
                    this.setupInput();
                }
            }
        }

        async handleAnswer() {
            const currentCard = this.currentCard;
            if (!currentCard) return;
        
            const userAnswer = currentCard.getAnswer();
            if (!userAnswer) return;
        
            const isCorrect = this.reviewSession.checkAnswer(userAnswer);
            
            $(".ep-review-input-section, .ep-review-question, .ep-review-content, .kanji-option, #ep-review-submit").hide();
            $(".ep-review-character").css({
                marginBottom: "0"
            });
        
            // Create result container if it doesn't exist
            if ($("#ep-review-result-container").length === 0) {
                $(".ep-review-card").append(
                    $("<div>")
                        .attr("id", "ep-review-result-container")
                        .css({
                            ...styles.reviewModal.content,
                            padding: 0
                        })
                );
            }
        
            if (isCorrect) {
                $("#ep-review-result-container")
                    .empty()
                    .append(
                        $("<div>")
                            .attr("id", "ep-review-result-message")
                            .text("Correct!")
                            .css({
                                ...styles.reviewModal.results.message,
                                color: theme.colors.success,
                            })
                    );
                    
                this.updateProgress();
                setTimeout(() => this.handleNextItem(), 1000);
            } else {
                $("#ep-review-result-container")
                    .empty()
                    .append(
                        $("<div>")
                            .attr("id", "ep-review-result-message")
                            .text("Incorrect")
                            .css({
                                ...styles.reviewModal.results.message,
                                color: theme.colors.error,
                            }),
                        $("<div>")
                            .addClass("ep-review-buttons")
                            .css({ 
                                display: "flex",
                                gap: theme.spacing.md,
                                justifyContent: "center" 
                            })
                            .append(
                                $("<button>")
                                    .attr("id", "ep-review-show-hint")
                                    .text("Show Answer")
                                    .css({
                                        ...styles.reviewModal.buttons.hint,
                                        minWidth: "120px"
                                    }),
                                $("<button>")
                                    .attr("id", "ep-review-continue")
                                    .text("Continue Review")
                                    .css({
                                        ...styles.reviewModal.buttons.submit,
                                        minWidth: "120px"
                                    })
                            )
                    );
            }
        }

        async showHint() {
            await this.currentCard.updateState(REVIEW_STATES.REVIEWING);
        }

        async handleNextItem() {
            if (this.reviewSession.isComplete()) {
                this.showCompletionScreen();
                return;
            }

            this.reviewSession.nextItem();
            await this.showCurrentItem();
            this.emit(REVIEW_EVENTS.NEXT_ITEM);
        }

        showCompletionScreen() {
            const progress = this.reviewSession.getProgress();
            const mode = this.reviewSession.mode;
            
            let languageLearningQuotes;

            if (this.isKanjiSession) {
                languageLearningQuotes = [
                    "Every kanji you learn unlocks new understanding",
                    "One character a day",
                    "Continuation is power",
                    "Each review strengthens your kanji recognition",
                    "Little by little, steadily",
                    "Each character you master opens new doors to understanding",
                    "Your journey through the world of kanji grows stronger each day"
                ]; 
            } else {
                languageLearningQuotes = [
                    "Every radical mastered unlocks new understanding",
                    "Building your foundation, one radical at a time",
                    "Mastering radicals today, recognizing kanji tomorrow",
                    "Each radical review strengthens your foundation",
                    "Little by little, your radical knowledge grows",
                    "Each radical you master opens new paths of understanding",
                    "Your journey through radicals grows stronger each day",
                    "Steady progress in radicals paves the way forward",
                    "Your radical knowledge builds the bridge to comprehension"
                ];
            }
            
            const randomQuote = languageLearningQuotes[
                Math.floor(Math.random() * languageLearningQuotes.length)
            ];

            let completionMessage;
            switch (mode) {
                case PRACTICE_MODES.ENGLISH_TO_KANJI:
                    completionMessage = `Review completed!<br>${progress.recognitionProgress}/${progress.total} Correct`;
                    break;
                case PRACTICE_MODES.COMBINED:
                    completionMessage = `Review completed!<br>` +
                        `Meanings: ${progress.meaningProgress}/${progress.total/3} | ` +
                        `Readings: ${progress.readingProgress}/${progress.total/3} | ` +
                        `Recognition: ${progress.recognitionProgress}/${progress.total/3}`;
                    break;
                case PRACTICE_MODES.STANDARD:
                    completionMessage = `Review completed!<br>` +
                        `Meanings: ${progress.meaningProgress}/${progress.total/2} | ` +
                        `Readings: ${progress.readingProgress}/${progress.total/2}`;
                    break;
                default:
                    completionMessage = `Review completed!`;
                    
            }

            const $completionContent = $("<div>")
                .css({
                    textAlign: "center",
                    padding: theme.spacing.xl
                })
                .append(
                    $("<h1>")
                        .html(completionMessage)
                        .css({
                            ...styles.reviewModal.progress,
                            marginBottom: theme.spacing.lg
                        }),
                    $("<p>")
                        .text(`"${randomQuote}"`)
                        .css({
                            color: theme.colors.gray[600],
                            marginBottom: theme.spacing.xl,
                            fontStyle: "italic"
                        }),
                        $("<div>")
                        .css({
                            display: "flex",
                            gap: theme.spacing.md,
                            justifyContent: "center"
                        })
                        .append(
                            $("<button>")
                                .text("Play Again")
                                .css({
                                    ...styles.reviewModal.buttons.submit,
                                    backgroundColor: theme.colors.success,
                                    minWidth: "120px"
                                })
                                .on("click", this.handlePlayAgain),
                            $("<button>")
                                .text("Study Different Items")
                                .css({
                                    ...styles.reviewModal.buttons.submit,
                                    minWidth: "120px"
                                })
                                .on("click", () => {
                                    this.emit(REVIEW_EVENTS.STUDY_AGAIN);
                                })
                        )
                );

            $("#ep-review-content").empty().append($completionContent);
            this.emit(REVIEW_EVENTS.COMPLETE, { progress });
        }

        async render() {
            this.$modal = $(reviewModalTemplate).appendTo("body");
            
            this.$modal.css({
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.9)",
                zIndex: theme.zIndex.modal,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            });

            $("#ep-review-modal-wrapper").css(styles.reviewModal.container);
            $("#ep-review-modal-header").css(styles.reviewModal.header);
            $("#ep-review-progress").css(styles.reviewModal.progress);
            $("#ep-review-exit").css(styles.reviewModal.buttons.exit);

            // Set up event delegation
            this.$modal
                .on("click", "#ep-review-submit", this.handleAnswer)
                .on("keypress", "#ep-review-answer", (e) => {
                    if (e.which === 13) {
                        this.handleAnswer();
                    }
                })
                .on("click", "#ep-review-show-hint", this.showHint)
                .on("click", "#ep-review-continue", this.handleNextItem);

            $("#ep-review-exit").on("click", () => {
                this.emit(REVIEW_EVENTS.CLOSE);
            });

            this.updateProgress();
            await this.showCurrentItem();

            return this.$modal;
        }

        remove() {
            if (this.currentCard) {
                this.currentCard.remove();
            }

            const input = document.querySelector("#ep-review-answer");
            if (input) {
                wanakana.unbind(input);
            }

            if (this.$modal) {
                this.$modal.remove();
                this.$modal = null;
            }
        }
    }

    // Assumption: User has wkof.file_cache for the IndexedDB operations to work

    async function getCurrentUserLevel() {    
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_VALUES.DB_NAME, 1);
            
            request.onsuccess = (event) => {
                
                const db = event.target.result;
                const transaction = db.transaction([DB_VALUES.FILE_STORE], "readonly");
                const store = transaction.objectStore(DB_VALUES.FILE_STORE);
                const getUser = store.get(DB_VALUES.USER_RECORD);
                
                getUser.onsuccess = () => {
                    const userData = getUser.result;
                    resolve(userData.content.data.level);
                };
                
                getUser.onerror = () => {
                    reject(handleError("USER_LEVEL"));
                };
            };
            
            request.onerror = () => {
                reject(handleError("OPEN"));
            };
        });
    }

    async function getCurrentLevelRadicals() {
        try {
            const userLevel = await getCurrentUserLevel();
            
            return new Promise((resolve, reject) => {
                const request = indexedDB.open(DB_VALUES.DB_NAME, 1);
                
                request.onsuccess = (event) => {
                    const db = event.target.result;
                    const transaction = db.transaction([DB_VALUES.FILE_STORE], "readonly");
                    const store = transaction.objectStore(DB_VALUES.FILE_STORE);
                    const getSubjects = store.get(DB_VALUES.SUBJECT_RECORD);
                    
                    getSubjects.onsuccess = () => {
                        const subjectsData = getSubjects.result;
                        
                        const currentLevelRadicals = Object.values(subjectsData.content.data)
                            .filter(subject => 
                                subject.object === "radical" && 
                                subject.data.level === userLevel
                            )
                            .map(radical => ({
                                id: radical.id,
                                character: radical.data.characters,
                                meaning: radical.data.meanings[0].meaning,
                                documentationUrl: radical.data.document_url,
                                meaningMnemonic: radical.data.meaning_mnemonic,
                                svg: radical.data.character_images.find(img => 
                                    img.content_type === "image/svg+xml"
                                )?.url || null
                            }));
                        
                        resolve(currentLevelRadicals);
                    };
                    
                    getSubjects.onerror = () => {
                        reject(handleError("SUBJECT_DATA"));
                    };
                };
                
                request.onerror = () => {
                    reject(handleError("OPEN"));
                };
            });
        } catch (error) {
            console.error("Error in getCurrentLevelRadicals:", error);
            throw error;
        }
    }

    async function getCurrentLevelKanji() {
        return new Promise(async (resolve, reject) => {
            const userLevel = await getCurrentUserLevel();

            const request = indexedDB.open('wkof.file_cache', 1);
            
            request.onsuccess = (event) => {
                const db = event.target.result;
                const transaction = db.transaction(['files'], 'readonly');
                const store = transaction.objectStore('files');
                
                Promise.all([
                    new Promise(resolve => {
                        store.get('Apiv2.assignments').onsuccess = (e) => 
                            resolve(e.target.result.content.data);
                    }),
                    new Promise(resolve => {
                        store.get('Apiv2.subjects').onsuccess = (e) => 
                            resolve(e.target.result.content.data);
                    })
                ]).then(([assignments, subjects]) => {
                    const unlockedKanjiIds = new Set(
                        Object.values(assignments)
                            .filter(a => a.data.subject_type === "kanji")
                            .map(a => a.data.subject_id)
                    );

                    // Helper function to get radical information
                    const getRadicalInfo = (radicalId) => {
                        const radical = subjects[radicalId];
                        if (!radical) return null;
                        
                        return {
                            id: radical.id,
                            character: radical.data.characters,
                            meaning: radical.data.meanings[0].meaning,
                            svg: radical.data.character_images?.find(img => 
                                img.content_type === 'image/svg+xml'
                            )?.url || null
                        };
                    };
                    
                    const currentLevelKanji = Object.values(subjects)
                        .filter(subject => 
                            subject.object === "kanji" && 
                            subject.data.level === userLevel &&
                            unlockedKanjiIds.has(subject.id)
                        )
                        .map(kanji => ({
                            id: kanji.id,
                            character: kanji.data.characters,
                            meanings: kanji.data.meanings.filter(m => m.accepted_answer),
                            readings: kanji.data.readings.filter(r => r.accepted_answer),
                            meaningMnemonic: kanji.data.meaning_mnemonic,
                            meaningHint: kanji.data.meaning_hint,
                            readingMnemonic: kanji.data.reading_mnemonic,
                            readingHint: kanji.data.reading_hint,
                            documentUrl: kanji.data.document_url,
                            radicals: kanji.data.component_subject_ids
                                .map(getRadicalInfo)
                                .filter(Boolean),
                            auxiliaryMeanings: kanji.data.auxiliary_meanings
                                ?.filter(m => m.type === "whitelist")
                                ?? []
                        }));
                    
                    resolve(currentLevelKanji);
                });
            };

            request.onerror = (error) => reject(error);
        });
    }

    function handleError(type) {
        if (type == "OPEN") {
            return new Error(DB_ERRORS.OPEN);
        }

        if (type == "USER_LEVEL") {
            return new Error(DB_ERRORS.USER_LEVEL);
        }

        if (type == "SUBJECT_DATA") {
            return new Error(DB_ERRORS.SUBJECT_DATA);
        }
    }

    async function handleRadicalPractice() {
        try {
            disableScroll();
            const radicals = await getCurrentLevelRadicals();
            
            const selectionModal = new RadicalSelectionModal(radicals)
                .on(EVENTS$1.CLOSE, () => {
                    enableScroll();
                    selectionModal.remove();
                })
                .on(EVENTS$1.START_REVIEW, (selectedRadicals) => {
                    selectionModal.remove();
                    startRadicalReview(selectedRadicals);
                });

            await selectionModal.render();

        } catch (error) {
            console.error("Error in radical practice:", error);
            enableScroll();
        }
    }

    async function startRadicalReview(selectedRadicals) {
        try {
            const session = {
                items: selectedRadicals,
                mode: "radical",
            };

            const reviewSession = new RadicalReviewSession(session);
            reviewSession.nextItem();

            const reviewModal = new ReviewSessionModal(reviewSession);

            reviewModal
                .on(REVIEW_EVENTS.CLOSE, () => {
                    const progress = reviewSession.getProgress();
                    $("#ep-review-modal-header").remove();
                    $("#ep-review-content")
                        .empty()
                        .append(
                            $("<div>")
                                .css(styles.reviewModal.content)
                                .append([
                                    $("<p>", { 
                                        css: {
                                            ...styles.reviewModal.progress,
                                            marginBottom: 0
                                        },
                                        text: `${progress.current}/${progress.total} Correct (${progress.percentComplete}%)` 
                                    }), 
                                    $("<p>", {
                                        css: {
                                            marginTop: 0,
                                            textAlign: "center"
                                        },
                                        text: "Closing..."
                                    })
                                ])
                        );

                    setTimeout(() => {
                        enableScroll();
                        reviewModal.remove();
                    }, 1000);
                })
                .on(REVIEW_EVENTS.STUDY_AGAIN, () => {
                    reviewModal.remove();
                    enableScroll();
                    handleRadicalPractice();
                });

            await reviewModal.render();
        } catch (error) {
            console.error("Error in startRadicalReview:", error);
            enableScroll();
        }
    }

    const MODAL_STATES = {
        READY: "ready"
    };

    const EVENTS = {
        CLOSE: "close",
        START_REVIEW: "startReview"
    };

    class KanjiGrid {
        constructor(kanji, onSelectionChange) {
            this.kanji = kanji;
            this.selectedKanji = new Set();
            this.onSelectionChange = onSelectionChange;
            this.$container = null;
        }

        updateKanjiSelection($element, kanji, isSelected) {
            const baseStyles = {
                ...styles.practiceModal.radical.base,
                border: `2px solid ${isSelected ? theme.colors.kanji : 'rgba(255, 255, 255, 0.2)'}`,
                background: isSelected ? 'rgba(235, 1, 156, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                transition: 'all 0.2s ease',
                '&:hover': {
                    borderColor: theme.colors.kanji,
                    background: isSelected ? 'rgba(235, 1, 156, 0.3)' : 'rgba(255, 255, 255, 0.2)'
                }
            };

            $element.css(baseStyles);

            if (isSelected) {
                this.selectedKanji.add(kanji.id);
            } else {
                this.selectedKanji.delete(kanji.id);
            }

            this.onSelectionChange(this.selectedKanji);
        }

        toggleAllKanji(shouldSelect) {
            if (shouldSelect) {
                this.kanji.forEach(kanji => this.selectedKanji.add(kanji.id));
            } else {
                this.selectedKanji.clear();
            }

            this.$container.find(".kanji-selection-item").each((_, element) => {
                const $element = $(element);
                const kanjiId = parseInt($element.data("kanji-id"));
                this.updateKanjiSelection(
                    $element,
                    this.kanji.find(k => k.id === kanjiId),
                    shouldSelect
                );
            });

            this.onSelectionChange(this.selectedKanji);
        }

        getSelectedKanji() {
            return Array.from(this.selectedKanji).map(id => 
                this.kanji.find(kanji => kanji.id === id)
            );
        }

        createKanjiElement(kanji) {
            const $element = $("<div>")
                .addClass("kanji-selection-item")
                .css({
                    ...styles.practiceModal.radical.base,
                    position: "relative"
                })
                .data("kanji-id", kanji.id)
                .append(
                    $("<div>")
                        .addClass("kanji-character")
                        .css({
                            fontSize: theme.typography.fontSize.xl,
                            color: theme.colors.white
                        })
                        .text(kanji.character)
                );

            $element
                .on("click", () => {
                    const isCurrentlySelected = this.selectedKanji.has(kanji.id);
                    this.updateKanjiSelection($element, kanji, !isCurrentlySelected);
                });

            return $element;
        }

        async render() {
            this.$container = $("<div>")
                .css({
                    ...styles.practiceModal.grid,
                    gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))"
                });

            this.kanji.forEach(kanji => {
                const $element = this.createKanjiElement(kanji);
                this.$container.append($element);
            });
            
            return this.$container;
        }
    }

    class KanjiSelectionModal {
        constructor(kanji, allUnlockedKanji) {
            this.kanji = kanji;
            this.allUnlockedKanji = allUnlockedKanji;
            this.selectedMode = PRACTICE_MODES.STANDARD;
            this.state = MODAL_STATES.READY;
            this.totalKanji = kanji.length;
            this.$modal = null;
            this.kanjiGrid = null;
            this.callbacks = new Map();
        }

        on(event, callback) {
            this.callbacks.set(event, callback);
            return this;
        }

        emit(event, data) {
            const callback = this.callbacks.get(event);
            if (callback) callback(data);
        }

        validateSelection(selectedCount) {
            const minRequired = {
                [PRACTICE_MODES.STANDARD]: 1,
                [PRACTICE_MODES.ENGLISH_TO_KANJI]: 4,
                [PRACTICE_MODES.COMBINED]: 4
            };

            const required = minRequired[this.selectedMode];
            const isValid = selectedCount >= required;
            const startButton = $("#ep-practice-modal-start");

            if (isValid) {
                startButton
                    .prop("disabled", false)
                    .text(`Start Review (${selectedCount} Selected)`)
                    .css({
                        ...styles.practiceModal.buttons.start.base,
                        ...styles.practiceModal.buttons.start.kanji,
                        opacity: 1,
                        cursor: "pointer"
                    });
            } else {
                startButton
                    .prop("disabled", true)
                    .text(`Select at least ${required} kanji`)
                    .css({
                        ...styles.practiceModal.buttons.start.base,
                        ...styles.practiceModal.buttons.start.kanji,
                        opacity: 0.5,
                        cursor: "not-allowed"
                    });
            }
        }

        updateSelectAllButton(selectedCount) {
            const selectAllButton = $("#ep-practice-modal-select-all");
            const isAllSelected = selectedCount === this.totalKanji;
            
            selectAllButton
                .text(isAllSelected ? "Deselect All" : "Select All")
                .css({
                    color: isAllSelected ? theme.colors.error : theme.colors.white,
                    borderColor: isAllSelected ? theme.colors.error : theme.colors.white,
                    '&:hover': {
                        borderColor: isAllSelected ? theme.colors.error : theme.colors.kanji
                    }
                });
        }

        handleSelectionChange(selectedKanji) {
            const selectedCount = selectedKanji.size;
            this.updateSelectAllButton(selectedCount);
            this.validateSelection(selectedCount);
        }

        createModeSelector() {
            const $container = $("<div>")
                .css(styles.practiceModal.modeSelector.container);

            const $label = $("<div>")
                .text("Select Practice Mode")
                .css(styles.practiceModal.modeSelector.label);

            const $options = $("<div>")
                .css(styles.practiceModal.modeSelector.options);

            const createOption = (mode, label) => {
                const $option = $("<button>")
                    .text(label)
                    .css({
                        ...styles.practiceModal.modeSelector.option.base,
                        ...(this.selectedMode === mode ? styles.practiceModal.modeSelector.option.selected : {})
                    })
                    .on("click", () => {
                        $options.find("button").css(styles.practiceModal.modeSelector.option.base);
                        $option.css({
                            ...styles.practiceModal.modeSelector.option.base,
                            ...styles.practiceModal.modeSelector.option.selected
                        });
                        
                        this.selectedMode = mode;
                        const currentSelection = this.kanjiGrid.getSelectedKanji();
                        this.validateSelection(currentSelection.length);
                    });
                return $option;
            };

            $options.append(
                createOption(PRACTICE_MODES.STANDARD, "Standard Practice"),
                createOption(PRACTICE_MODES.ENGLISH_TO_KANJI, "English → Kanji"),
                createOption(PRACTICE_MODES.COMBINED, "Combined Practice")
            );

            return $container.append($label, $options);
        }

        async render() {
            this.$modal = $(modalTemplate).appendTo("body");
            
            $("#username").text($("p.user-summary__username:first").text());
            
            this.$modal.css(styles.practiceModal.backdrop);
            $("#ep-practice-modal-welcome").css(styles.practiceModal.welcomeText.container);
            $("#ep-practice-modal-welcome h1").css(styles.practiceModal.welcomeText.username);
            $("#ep-practice-modal-welcome h2")
                .text("Please select the Kanji characters you would like to practice")
                .css({
                    color: theme.colors.white,
                    opacity: 0.9
                });

            const $modeSelector = this.createModeSelector();
            $modeSelector.insertAfter("#ep-practice-modal-welcome");

            $("#ep-practice-modal-footer").css(styles.practiceModal.footer);
            $("#ep-practice-modal-content").css(styles.practiceModal.contentWrapper);
            
            // Initial disabled state with kanji color scheme
            $("#ep-practice-modal-start").css({
                ...styles.practiceModal.buttons.start.base,
                ...styles.practiceModal.buttons.start.kanji,
                opacity: 0.5,
                cursor: "not-allowed"
            });

            $("#ep-practice-modal-select-all").css({
                ...styles.practiceModal.buttons.selectAll,
                '&:hover': {
                    borderColor: theme.colors.kanji
                }
            });

            $("#ep-practice-modal-close").css({
                ...styles.practiceModal.buttons.exit,
                '&:hover': {
                    borderColor: theme.colors.kanji,
                    color: theme.colors.kanji
                }
            });

            this.kanjiGrid = new KanjiGrid(
                this.kanji,
                this.handleSelectionChange.bind(this)
            );

            const $grid = await this.kanjiGrid.render();
            $("#ep-practice-modal-grid").replaceWith($grid);

            $("#ep-practice-modal-select-all").on("click", () => {
                const isSelectingAll = $("#ep-practice-modal-select-all").text() === "Select All";
                this.kanjiGrid.toggleAllKanji(isSelectingAll);
            });

            $("#ep-practice-modal-close").on("click", () => {
                this.emit(EVENTS.CLOSE);
            });

            $("#ep-practice-modal-start").on("click", () => {
                const selectedKanji = this.kanjiGrid.getSelectedKanji();
                const minRequired = {
                    [PRACTICE_MODES.STANDARD]: 1,
                    [PRACTICE_MODES.ENGLISH_TO_KANJI]: 4,
                    [PRACTICE_MODES.COMBINED]: 4
                };

                if (selectedKanji.length >= minRequired[this.selectedMode]) {
                    this.emit(EVENTS.START_REVIEW, {
                        kanji: selectedKanji,
                        mode: this.selectedMode,
                        allUnlockedKanji: this.allUnlockedKanji
                    });
                }
            });

            return this.$modal;
        }

        remove() {
            if (this.$modal) {
                this.$modal.remove();
                this.$modal = null;
            }
        }
    }

    async function handleKanjiPractice() {
        try {
            disableScroll();
            const kanji = await getCurrentLevelKanji();
            
            const selectionModal = new KanjiSelectionModal(kanji, kanji)  // Using current level kanji as unlocked list for now
                .on(EVENTS.CLOSE, () => {
                    enableScroll();
                    selectionModal.remove();
                })
                .on(EVENTS.START_REVIEW, (data) => {
                    selectionModal.remove();
                    startKanjiReview(data.kanji, data.mode, data.allUnlockedKanji);
                });

            await selectionModal.render();

        } catch (error) {
            console.error("Error in kanji practice:", error);
            enableScroll();
        }
    }

    async function startKanjiReview(selectedKanji, mode, allUnlockedKanji) {
        try {
            const reviewSession = new KanjiReviewSession({ 
                items: selectedKanji, 
                mode: mode,
                allUnlockedKanji: allUnlockedKanji
            });
            
            reviewSession.nextItem();

            const reviewModal = new ReviewSessionModal(reviewSession);

            reviewModal
                .on(REVIEW_EVENTS.CLOSE, () => {
                    const progress = reviewSession.getProgress();
                    $("#ep-review-modal-header").remove();

                    const closingContent = [$("<p>", {
                        css: {
                            marginTop: 0,
                            textAlign: "center"
                        },
                        text: "Closing..."
                    })];

                    $("#ep-review-content")
                        .empty()
                        .append(
                            $("<div>")
                                .css(styles.reviewModal.content)
                                .append((() => {
                                    if (reviewSession.mode === PRACTICE_MODES.STANDARD) {
                                        closingContent.unshift($("<p>", { 
                                            css: {
                                                ...styles.reviewModal.progress,
                                                marginBottom: 0
                                            },
                                            text: `Meanings: ${progress.meaningProgress}/${progress.total/2} - Readings: ${progress.readingProgress}/${progress.total/2}`
                                        }));
                                        return closingContent;
                                    } else if (reviewSession.mode === PRACTICE_MODES.ENGLISH_TO_KANJI) {
                                        closingContent.unshift($("<p>", { 
                                            css: {
                                                ...styles.reviewModal.progress,
                                                marginBottom: 0
                                            },
                                            text: `${progress.recognitionProgress}/${progress.total} Correct`
                                        }));
                                        return closingContent;
                                    } else { // COMBINATION PRACTICE_MODE
                                        closingContent.unshift($("<p>", { 
                                            css: {
                                                ...styles.reviewModal.progress,
                                                marginBottom: 0
                                            },
                                            text: `Meanings: ${progress.meaningProgress}/${progress.total/3} | ` +
                                                `Readings: ${progress.readingProgress}/${progress.total/3} | ` +
                                                `Recognition: ${progress.recognitionProgress}/${progress.total/3}`
                                        }));
                                        return closingContent;
                                    }
                                })())
                        );

                    setTimeout(() => {
                        enableScroll();
                        reviewModal.remove();
                    }, 1000);
                })
                .on(REVIEW_EVENTS.STUDY_AGAIN, () => {
                    reviewModal.remove();
                    enableScroll();
                    handleKanjiPractice();
                });

            await reviewModal.render();
        } catch (error) {
            console.error("Error in startKanjiReview:", error);
            enableScroll();
        }
    }

    class PracticeButton {
        constructor(type) {
            this.type = type;
            this.buttonStyle = this.getButtonStyle();
            this.handleClick = this.handleClick.bind(this);
        }

        getButtonStyle() {
            return this.type === PRACTICE_TYPES.RADICAL
                ? styles.buttons.practice.radical
                : styles.buttons.practice.kanji;
        }

        async handleClick() {
            try {
                if (this.type === PRACTICE_TYPES.RADICAL) {
                    await handleRadicalPractice();
                } else {
                    await handleKanjiPractice();
                }
            } catch (error) {
                console.error(`Error handling ${this.type} practice:`, error);
            }
        }

        render() {
            const $button = $("<button>")
                .attr("id", `ep-${this.type}-btn`)
                .text("Practice")
                .css(this.buttonStyle)
                .on("click", this.handleClick);

            const selector = `${SELECTORS.DIV_LEVEL_PROGRESS_CONTENT} ${SELECTORS.DIV_CONTENT_WRAPPER} ${SELECTORS.DIV_CONTENT_TITLE}`;
            
            // Doing a conditional check to add the practice button to the correct DIV.
            const targetSelector = this.type === PRACTICE_TYPES.RADICAL
                ? `${selector}:first`
                : `${selector}:last`;

            $button.appendTo(targetSelector);

            return $button;
        }
    }

    function initializePracticeButtons() {
        // First style the containers where the "PRACTICE" buttons be
        $(`${SELECTORS.DIV_LEVEL_PROGRESS_CONTENT} ${SELECTORS.DIV_CONTENT_WRAPPER} ${SELECTORS.DIV_CONTENT_TITLE}`)
            .css(styles.layout.contentTitle);

        const radicalButton = new PracticeButton(PRACTICE_TYPES.RADICAL);
        const kanjiButton = new PracticeButton(PRACTICE_TYPES.KANJI);

        radicalButton.render();
        kanjiButton.render();
    }

    $(document).ready(() => {
        initializePracticeButtons();
    });

})();
//# sourceMappingURL=extra-practice.user.js.map
