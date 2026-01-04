// ==UserScript==
// @name         Spicychat CRO Helper
// @namespace    http://tampermonkey.net/
// @version      1.23 // Added Simple/Advanced/Expert modes and changed default roll category to "DICE".
// @description  Adds a draggable, resizable popover with tools (Action, Inventory, Perception, Settings) for Spicychat, Character.ai, and JanitorAI.
// @author       Darkeyev2, [REDACTED], Gemini 1.5 Pro, Claude
// @match        https://spicychat.ai/*
// @match        https://character.ai/*
// @match        https://*.character.ai/*
// @match        https://janitorai.com/chats/*
// @match        https://*.janitorai.com/chats/*
// @match        https://www.janitorai.com/chats/*
// @match        https://janitorai.com/characters/*
// @match        https://*.janitorai.com/characters/*
// @match        https://www.janitorai.com/characters/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=spicychat.ai
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537525/Spicychat%20CRO%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/537525/Spicychat%20CRO%20Helper.meta.js
// ==/UserScript==

// --- CRO (Character, Roll, Outcome) System Scales Data ---
// This object defines the various outcome scales used by the CRO system.
// Each scale has a name and a set of outcomes keyed by the d10 roll result (1-10).
const CRO_SCALES_DATA = Object.freeze({
  croScales: Object.freeze({
    main: Object.freeze({
      name: "Main Outcome",
      outcomes: Object.freeze({
        "1": "Critical Failure (significant setback)",
        "2": "Major Failure (clear consequence)",
        "3": "Simple Failure (no progress)",
        "4": "Poor Attempt (close, but falls short)",
        "5": "Complication (a problem emerges)",
        "6": "Minor Success (limited progress)",
        "7": "Weak Success (achieves goal, barely)",
        "8": "Clear Success (achieves goal)",
        "9": "Strong Success (achieves goal cleanly)",
        "10": "Critical Success (exceeds expectations)"
      })
    }),
    physical: Object.freeze({
      name: "Physical",
      outcomes: Object.freeze({
        "1": "Harsh Consequence (clear physical cost or injury)",
        "2": "Strained Effort (body struggles, fatigue sets in)",
        "3": "Forced Failure (pushing through but can't complete)",
        "4": "Rough Attempt (partial progress, noticeable strain)",
        "5": "Taxing Success (achieves goal but at physical cost)",
        "6": "Adequate Performance (body cooperates, gets it done)",
        "7": "Steady Control (confident execution)",
        "8": "Strong Performance (body responds well)",
        "9": "Smooth Execution (effortless feel)",
        "10": "Perfect Form (exactly as intended, if not better)"
      })
    }),
    manual: Object.freeze({
      name: "Manual",
      outcomes: Object.freeze({
        "1": "Complete Mishap (task goes wrong, clear setback)",
        "2": "Sloppy Work (barely functional, obvious flaws)",
        "3": "Sloppy Work (barely functional, obvious flaws)",
        "4": "Rough Execution (works but crude, noticeable imperfections)",
        "5": "Rough Execution (works but crude, noticeable imperfections)",
        "6": "Competent Work (solid execution, minor rough edges)",
        "7": "Competent Work (solid execution, minor rough edges)",
        "8": "Clean Execution (smooth work, well-handled)",
        "9": "Clean Execution (smooth work, well-handled)",
        "10": "Precise Control (exactly as intended, no wasted motion)"
      })
    }),
    mental: Object.freeze({
      name: "Mental",
      outcomes: Object.freeze({
        "1": "Analysis Paralysis (ex. overthinking, endless loops, decision paralysis, etc.)",
        "2": "Tunnel Vision (ex. fixation, missing alternatives, rigid thinking, etc.)",
        "3": "Emotional Bias (ex. wishful thinking, fear-driven reasoning, prejudice, etc.)",
        "4": "Scattered Focus (ex. jumping between ideas, unfocused effort, etc.)",
        "5": "Logical Analysis (ex. step-by-step reasoning, systematic breakdown, etc.)",
        "6": "Pattern Recognition (ex. connections, similarities, recurring themes, etc.)",
        "7": "Practical Application (ex. real-world solutions, functional thinking, etc.)",
        "8": "Creative Synthesis (ex. novel combinations, innovative approaches, etc.)",
        "9": "Abstract Reasoning (ex. theoretical concepts, pure logic, philosophy, etc.)",
        "10": "Intuitive Leap (ex. sudden understanding, gut insights, breakthrough moments, etc.)"
      })
    }),
    social: Object.freeze({
      name: "Social",
      outcomes: Object.freeze({
        "1": "Momentum Lost (interaction creates resistance or withdrawal)",
        "2": "Momentum Lost (interaction creates resistance or withdrawal)",
        "3": "Awkward Exchange (stilted, uncomfortable social flow)",
        "4": "Awkward Exchange (stilted, uncomfortable social flow)",
        "5": "Neutral Transaction (stalling, neither builds nor damages social standing)",
        "6": "Neutral Transaction (stalling, neither builds nor damages social standing)",
        "7": "Strong Rapport (builds connection and cooperation)",
        "8": "Strong Rapport (builds connection and cooperation)",
        "9": "Lasting Impact (memorable interaction, doors open)",
        "10": "Lasting Impact (memorable interaction, doors open)"
      })
    }),
    perception: Object.freeze({
      name: "Perception",
      outcomes: Object.freeze({
        "1": "Physical State (ex. appearance, condition, immediate qualities, etc.)",
        "2": "Physical State (ex. appearance, condition, immediate qualities, etc.)",
        "3": "Functional Aspect (ex. role, purpose, capabilities, etc.)",
        "4": "Functional Aspect (ex. role, purpose, capabilities, etc.)",
        "5": "Contextual Clues (ex. connections, significance, anomalies, etc.)",
        "6": "Contextual Clues (ex. connections, significance, anomalies, etc.)",
        "7": "Hidden Elements (ex. concealed aspects, overlooked details, etc.)",
        "8": "Hidden Elements (ex. concealed aspects, overlooked details, etc.)",
        "9": "Temporal Traces (ex. history, recent changes, accumulated effects, etc.)",
        "10": "Temporal Traces (ex. history, recent changes, accumulated effects, etc.)"
      })
    }),
    fortune: Object.freeze({
      name: "Fortune",
      outcomes: Object.freeze({
        "1": "Bad Timing (unfavorable coincidence)",
        "2": "Unlucky Turn (circumstances hinder, disadvantage)",
        "3": "Unlucky Turn (circumstances hinder, disadvantage)",
        "4": "Unlucky Turn (circumstances hinder, disadvantage)",
        "5": "Unlucky Turn (circumstances hinder, disadvantage)",
        "6": "Lucky Break (favorable circumstance, advantage)",
        "7": "Lucky Break (favorable circumstance, advantage)",
        "8": "Lucky Break (favorable circumstance, advantage)",
        "9": "Lucky Break (favorable circumstance, advantage)",
        "10": "Perfect Timing (major positive turn of events)"
      })
    }),
    stealth: Object.freeze({
      name: "Stealth",
      outcomes: Object.freeze({
        "1": "Fully Exposed (immediate detection, alarm raised)",
        "2": "Clearly Spotted (presence and intent obvious)",
        "3": "Obviously Noticed (seen but intent unclear)",
        "4": "Suspicion Raised (traces left, heightened awareness)",
        "5": "Minor Disturbance (small signs noticed)",
        "6": "Barely Avoided (close call, narrowly unnoticed)",
        "7": "Successfully Hidden (avoided direct detection)",
        "8": "Cleanly Unnoticed (no awareness triggered)",
        "9": "Seamless Passage (no signs of presence)",
        "10": "Perfect Concealment (completely undetected, no trace)"
      })
    }),
    itemFocus: Object.freeze({
      name: "Item Focus",
      outcomes: Object.freeze({
        "1": "Material Properties (ex. composition, durability, craftsmanship quality, etc.)",
        "2": "Material Properties (ex. composition, durability, craftsmanship quality, etc.)",
        "3": "Functional Design (ex. intended purpose, how it works, efficiency, etc.)",
        "4": "Functional Design (ex. intended purpose, how it works, efficiency, etc.)",
        "5": "Historical Context (ex. age, previous use, wear patterns, etc.)",
        "6": "Historical Context (ex. age, previous use, wear patterns, etc.)",
        "7": "Hidden Features (ex. concealed mechanisms, subtle details, etc.)",
        "8": "Contextual Significance (ex. relevance to situation, connections, etc.)",
        "9": "Contextual Significance (ex. relevance to situation, connections, etc.)",
        "10": "Symbolic Meaning (ex. cultural importance, personal resonance, etc.)"
      })
    }),
    timeAndFortune: Object.freeze({
      name: "Time & Fortune",
      outcomes: Object.freeze({
        "1": "Deep Troubles (Time passed under notably difficult background conditions)",
        "2": "Mostly Downs (The period felt marked by a generally negative trend)",
        "3": "Problems Mount (Minor issues seemed to consistently arise or worsen)",
        "4": "Felt Resisted (The period generally felt resistant or effortful)",
        "5": "Slight Drag (Progress or stability felt subtly held back during this time)",
        "6": "Slight Boost (Progress or stability felt subtly helped along during this time)",
        "7": "Easy Flow (The period generally felt smooth or cooperative)",
        "8": "Things Align (Minor opportunities seemed to consistently arise or improve)",
        "9": "Mostly Ups (The period felt marked by a generally positive trend)",
        "10": "Great Fortune (Time passed under notably favourable background conditions)"
      })
    }),
  }),
  pushingLimitsScale: Object.freeze({
    name: "Pushing Limits",
    outcomes: Object.freeze({
      "1": "Severe Backfire (major negative consequence)",
      "2": "Costly Failure (significant setback, clear price paid)",
      "3": "Costly Failure (significant setback, clear price paid)",
      "4": "Painful Attempt (falls short, noticeable strain or cost)",
      "5": "Painful Attempt (falls short, noticeable strain or cost)",
      "6": "Strained Success (goal met, but with visible effort)",
      "7": "Strained Success (goal met, but with visible effort)",
      "8": "Hard-Won Achievement (success despite the odds)",
      "9": "Hard-Won Achievement (success despite the odds)",
      "10": "Breakthrough Performance (exceeds expectations)"
    })
  }),
  inventoryFindScale: Object.freeze({
    name: "Find Scale",
    outcomes: Object.freeze({
      "1": "Empty Search (nothing useful found)",
      "2": "Empty Search (nothing useful found)",
      "3": "Mundane Items (basic, expected contents)",
      "4": "Mundane Items (basic, expected contents)",
      "5": "Useful Basics (practical items for current situation)",
      "6": "Useful Basics (practical items for current situation)",
      "7": "Helpful Resources (relevant, contextually appropriate)",
      "8": "Helpful Resources (relevant, contextually appropriate)",
      "9": "Valuable Discovery (significantly useful items)",
      "10": "Perfect Find (exactly what's needed right now)"
    })
  })
});

(function() {
  'use strict';

  // --- MODULE: CRO_Config ---
  // Stores all static configuration for the CRO Helper.
  window.CRO_Config = {
    // Default dimensions and positioning for the popover and trigger button.
    defaultPopoverWidth: 320,
    defaultPopoverHeight: 520,
    minPopoverWidth: 300,
    minPopoverHeight: 360,
    maxPopoverHeightRatio: 0.85, // Maximum height as a ratio of window inner height.
    triggerBottomOffset: '15px',
    defaultTriggerLeftOffset: '15px',
    popoverBottomOffset: '75px', // Space from the bottom of the viewport.
    loadDelay: 1000, // Milliseconds to wait before initializing the script.
    cornerHandleSize: '12px', // Size of corner resize handles.
    edgeHandleThickness: '8px', // Thickness of edge resize handles.
    TOOLBAR_WIDTH: 50, // Width of the vertical toolbar in pixels.
    ERROR_MESSAGE_DURATION: 3000, // How long error messages are displayed.

    // Validation constants for inputs.
    validation: {
      MIN_ROLL: 1, MAX_ROLL: 10, DICE_FACES: 10,
      MIN_MODIFIER: -3, MAX_MODIFIER: 3,
      MIN_STAKES: -3, MAX_STAKES: 3,
    },
    // Animation constants.
    animation: {
      DICE_ANIMATION_DURATION: 1000, // Duration of the dice roll animation in ms.
    },

    // Base keys for GM_setValue/GM_getValue. Domain will be appended for site-specific storage.
    storageKeys: {
      POS_WIDTH_BASE: 'cro-helper-width',
      POS_HEIGHT_BASE: 'cro-helper-height',
      POS_LEFT_BASE: 'cro-helper-left',
      THEME_BASE: 'cro-helper-theme',
      MODE_BASE: 'cro-helper-mode' // Key for Simple/Advanced/Expert mode
    },
    // IDs for key HTML elements.
    ids: {
      HELPER_CONTAINER: 'cro-helper-container',
      TRIGGER_BUTTON: 'cro-helper-trigger',
      CLOSE_BUTTON: 'cro-helper-close-button',
      HEADER: 'cro-helper-header',
      TOOLBAR: 'cro-helper-toolbar',
      MAIN_CONTENT_AREA: 'cro-helper-main-content',
      RESIZE_TL: 'cro-helper-resize-tl',
      RESIZE_TR: 'cro-helper-resize-tr',
      RESIZE_TOP: 'cro-helper-resize-handle-top',
      OUTPUT_ACTION: 'cro-helper-output-action',
      ACTION_ERROR_MESSAGE: 'cro-action-error-message'
    },
    // CSS class names used throughout the script.
    classNames: {
      VISIBLE: 'cro-helper-visible', HIDDEN: 'cro-helper-hidden', INPUT: 'cro-input',
      BUTTON: 'cro-button', ROLL_BUTTON: 'cro-roll-button', OUTPUT_AREA: 'cro-output-area',
      COPY_BUTTON: 'cro-copy-button', SEND_BUTTON: 'cro-send-button', DICE_ROLLING: 'dice-rolling',
      DRAGGING_BODY: 'cro-dragging', RESIZING_BODY: 'cro-resizing', TOOLBAR_BUTTON: 'cro-toolbar-button',
      SCREEN_CONTENT_WRAPPER: 'cro-screen-content-wrapper', SCREEN_TITLE: 'cro-screen-title',
      SCREEN_SUBHEADING: 'cro-screen-subheading', SCREEN_DESCRIPTION: 'cro-screen-description',
      ACTION_MODIFIER_CONTAINER: 'cro-action-modifiers', CHECKBOX_LABEL: 'cro-checkbox-label',
      SLIDER: 'cro-slider', SLIDER_VALUE: 'cro-slider-value', THEME_BUTTON: 'cro-theme-button',
      ERROR_MESSAGE: 'cro-error-message', INPUT_ERROR: 'cro-input-error', INPUT_GROUP: 'cro-input-group',
      INPUT_WRAPPER: 'cro-input-wrapper', INPUT_ARROW: 'cro-input-arrow',
      INPUT_WITH_BUTTON: 'cro-input-with-button', INPUT_DIALOGUE: 'cro-input-dialogue',
      INPUT_ACTION_DESC: 'cro-input-action', INPUT_NUMBER: 'cro-input-number',
      INPUT_SELECT: 'cro-input-select', SLIDER_GROUP: 'cro-slider-group',
      OUTPUT_CONTAINER: 'cro-output-container', OUTPUT_BUTTONS_GROUP: 'cro-output-buttons',
      // Classes for UI Modes
      DIALOGUE_INPUT_GROUP: 'dialogue-input-group', MODIFIER_SLIDER_GROUP: 'modifier-slider-group',
      SCALE_SELECT_GROUP: 'scale-select-group',
    },
    // Predefined themes with their color palettes.
    themes: {
      "Default Dark": Object.freeze({ background: '#121212', text: '#e0e0e0', border: '#333333', headerBackground: '#1e1e1e', textareaBackground: '#0f0f0f', italicColor: '#ff80ab', accent: '#bb86fc', focusBorder: '#333333', errorColor: '#cf6679', buttonIconColor: '#b0b0b0', buttonTextColor: '#e0e0e0', buttonBackground: '#333333', buttonHoverBg: '#444444', buttonActiveBg: '#555555', copySuccessBg: '#03dac6', deleteButtonBg: '#cf6679', deleteButtonHoverBg:'#de778a', scrollbarTrack: '#1e1e1e', scrollbarThumb: '#444444', scrollbarThumbHover:'#555555', croOutputBackground: '#0f0f0f', croInputBorder: '#333333', croRainbowBorder1:  '#C70039', croRainbowBorder2:  '#FF8333', croRainbowBorder3:  '#FFBF00', croRainbowBorder4:  '#33FF57', croRainbowBorder5:  '#339BFF', croRainbowBorder6:  '#9B33FF', croRainbowBorder7:  '#FF33A1', resizeHandleColor: '#555555', toolbarActiveBg: '#555555', toolbarActiveIcon: '#e0e0e0', themeButtonBg: '#333333', themeButtonHoverBg: '#444444', themeButtonActiveBg:'#bb86fc', themeButtonActiveText: '#000000' }),
      "Solarized Dark": Object.freeze({ background: '#201c16', text: '#ffffce', border: '#29241c', headerBackground: '#29241c', textareaBackground: '#181410', italicColor: '#e91e63', accent: '#0072f5', focusBorder: '#524939', errorColor: '#ff6b6b', buttonIconColor: '#9b8a6b', buttonTextColor: '#c7bbaa', buttonBackground: '#3a342a', buttonHoverBg: '#4a4236', buttonActiveBg: '#524939', copySuccessBg: '#138E42', deleteButtonBg: '#a03030', deleteButtonHoverBg:'#bf4040', scrollbarTrack: '#2b2b2b', scrollbarThumb: '#555555', scrollbarThumbHover:'#777777', croOutputBackground: '#100e0b', croInputBorder: '#3a342a', croRainbowBorder1: '#C70039', croRainbowBorder2: '#FF8333', croRainbowBorder3: '#FFBF00', croRainbowBorder4: '#33FF57', croRainbowBorder5: '#339BFF', croRainbowBorder6: '#9B33FF', croRainbowBorder7: '#FF33A1', resizeHandleColor: '#524939', toolbarActiveBg: '#524939', toolbarActiveIcon: '#ffffce', themeButtonBg: '#3a342a', themeButtonHoverBg: '#4a4236', themeButtonActiveBg:'#0072f5', themeButtonActiveText: '#ffffff' }),
      "Midnight Blue": Object.freeze({ background: '#1a1d2a', text: '#d0d8f0', border: '#2a2d40', headerBackground: '#222536', textareaBackground: '#151724', italicColor: '#ff79c6', accent: '#88aaff', focusBorder: '#505870', errorColor: '#ff7575', buttonIconColor: '#a0a8c0', buttonTextColor: '#d0d8f0', buttonBackground: '#30344d', buttonHoverBg: '#40445f', buttonActiveBg: '#505870', copySuccessBg: '#3ba371', deleteButtonBg: '#c04050', deleteButtonHoverBg:'#d05060', scrollbarTrack: '#222536', scrollbarThumb: '#40445f', scrollbarThumbHover:'#505870', croOutputBackground: '#10121a', croInputBorder: '#30344d', croRainbowBorder1: '#ff79c6', croRainbowBorder2: '#ff9f80', croRainbowBorder3: '#f1fa8c', croRainbowBorder4: '#50fa7b', croRainbowBorder5: '#8be9fd', croRainbowBorder6: '#bd93f9', croRainbowBorder7: '#ff79c6', resizeHandleColor: '#505870', toolbarActiveBg: '#505870', toolbarActiveIcon: '#d0d8f0', themeButtonBg: '#30344d', themeButtonHoverBg: '#40445f', themeButtonActiveBg:'#88aaff', themeButtonActiveText: '#151724' }),
      "Simple Light": Object.freeze({ background: '#ffffff', text: '#212121', border: '#e0e0e0', headerBackground: '#f5f5f5', textareaBackground: '#fcfcfc', italicColor: '#d81b60', accent: '#1976d2', focusBorder: '#1976d2', errorColor: '#e53935', buttonIconColor: '#616161', buttonTextColor: '#212121', buttonBackground: '#e0e0e0', buttonHoverBg: '#d6d6d6', buttonActiveBg: '#bdbdbd', copySuccessBg: '#4caf50', deleteButtonBg: '#e53935', deleteButtonHoverBg:'#d32f2f', scrollbarTrack: '#f1f1f1', scrollbarThumb: '#c1c1c1', scrollbarThumbHover:'#a8a8a8', croOutputBackground: '#f0f0f0', croInputBorder: '#e0e0e0', croRainbowBorder1: '#d81b60', croRainbowBorder2: '#ff7043', croRainbowBorder3: '#ffc107', croRainbowBorder4: '#4caf50', croRainbowBorder5: '#2196f3', croRainbowBorder6: '#673ab7', croRainbowBorder7: '#e91e63', resizeHandleColor: '#bdbdbd', toolbarActiveBg: '#bdbdbd', toolbarActiveIcon: '#212121', themeButtonBg: '#e0e0e0', themeButtonHoverBg: '#d6d6d6', themeButtonActiveBg:'#1976d2', themeButtonActiveText: '#ffffff' })
    },
    // Configurations for different supported chat sites.
    siteConfigs: {
      'spicychat.ai': {
        // More robust selector for Spicychat, not relying on placeholder text.
        chatInputSelector: 'div[class*="rounded-\\[13px\\]"][class*="focus-within:border-blue-9"] textarea',
      },
      'character.ai': {
        chatInputSelector: 'textarea[placeholder^="Message "]', // Assumes English placeholder.
      },
        'janitorai.com': {
            chatInputSelector: 'div[class*="_chatInputContainer"] textarea',
        },
    },
    // Functions to get SVG icon strings, dynamically colored based on the current theme.
    getIconColor: () => window.CRO_State.editorColors.buttonIconColor,
    getActiveIconColor: () => window.CRO_State.editorColors.toolbarActiveIcon || window.CRO_State.editorColors.text,
    copyIconSVG: () => `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${window.CRO_Config.getIconColor()}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>`,
    sendIconSVG: () => `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${window.CRO_Config.getIconColor()}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 3 3 9-3 9 19-9Z"></path><path d="M6 12h16"></path></svg>`,
    diceIconSVG: (size = 18, color = window.CRO_Config.getIconColor()) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><circle cx="12" cy="12" r="1"></circle><circle cx="18" cy="6" r="1"></circle><circle cx="6" cy="18" r="1"></circle></svg>`,
    inventoryIconSVG: (size = 18, color = window.CRO_Config.getIconColor()) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
    perceptionIconSVG: (size = 18, color = window.CRO_Config.getIconColor()) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>`,
    settingsIconSVG: (size = 18, color = window.CRO_Config.getIconColor()) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 7h-9"/><path d="M14 17H4"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/></svg>`,
    closeIconSVG: () => `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,

    // References to the outcome scales defined globally.
    croScales: CRO_SCALES_DATA.croScales,
    pushingLimitsScale: CRO_SCALES_DATA.pushingLimitsScale,
    inventoryFindScale: CRO_SCALES_DATA.inventoryFindScale,

    // Retrieves the outcome description for a given scale and roll value.
    getScaleOutcome: (scaleKey, rollValue, isPushingLimits = false) => {
      const C = window.CRO_Config;
      const scaleData = isPushingLimits ? C.pushingLimitsScale : (C.croScales[scaleKey] || C.croScales.main);
      if (!scaleData || !scaleData.outcomes) {
        console.warn(`[CRO Helper] Scale data or outcomes not found for key: ${scaleKey}, pushingLimits: ${isPushingLimits}. Using fallback.`);
        return `Outcome ${rollValue} (Scale Undefined)`;
      }
      return scaleData.outcomes[rollValue] || `Outcome ${rollValue} (Undefined in Scale)`;
    },
    // Array to store screen configurations (populated by CRO_App.initScreensConfig).
    screens: [],
  };

  // --- MODULE: CRO_State ---
  // Manages the dynamic state of the CRO Helper UI and interactions.
  window.CRO_State = {
    // DOM element references, populated by CRO_UI.createElements.
    helperContainer: null, triggerButton: null, closeButton: null, header: null, toolbar: null,
    mainContentArea: null, resizeHandleTL: null, resizeHandleTR: null, resizeHandleTop: null,
    // UI visibility and interaction states.
    isHelperVisible: false,
    animationFrameIds: new Map(), // Stores requestAnimationFrame IDs for active animations.
    isDraggingTrigger: false, didDragTrigger: false, dragOffsetX: 0, // Trigger button drag state.
    activeResizeHandle: null, // ID of the currently active resize handle.
    startX: 0, startY: 0, startWidth: 0, startHeight: 0, startLeft: 0, // Popover resize/drag state.
    activeScreenId: 'cro_generator', // ID of the currently displayed screen in the popover.
    errorTimeout: null, // Timeout ID for clearing error messages.
    // Theme and site-specific state.
    editorColors: { ...window.CRO_Config.themes["Default Dark"] }, // Current theme's color palette.
    currentThemeName: "Default Dark", // Name of the currently active theme.
    currentMode: "simple", // 'simple', 'advanced', or 'expert'
    currentSiteKey: null // Key identifying the current website (e.g., 'spicychat.ai').
  };

  // --- MODULE: CRO_ElementCache ---
  // Caches frequently accessed DOM elements to improve performance.
  window.CRO_ElementCache = {
    chatInput: null, // Cached reference to the main chat input textarea.
    lastChatInputCheck: 0, // Timestamp of the last time the chat input was queried.
    CACHE_DURATION: 5000, // How long to cache the chat input element before re-querying (in ms).

    // Gets the main chat input textarea, using caching and site-specific selectors.
    getChatInput() {
      const now = Date.now();
      if (!this.chatInput || (now - this.lastChatInputCheck > this.CACHE_DURATION) || !document.body.contains(this.chatInput)) {
        const siteConfig = window.CRO_Utils.getCurrentSiteConfig();
        if (siteConfig && siteConfig.chatInputSelector) {
          this.chatInput = document.querySelector(siteConfig.chatInputSelector);
        } else {
          console.warn(`[CRO Helper] No chat input selector configured for this site: ${window.location.hostname}. Trying generic selectors.`);
          // Fallback to a list of common selectors if no specific config is found.
          const genericSelectors = [
            'textarea[placeholder^="Message"]',
            'textarea[placeholder^="Messag"]',
            'textarea.chakra-textarea[placeholder^="Enter to send chat"]',
            'textarea[data-id="chat-input"]',
            'textarea#chat-input',
            'textarea[name="chat_input"]'
          ];
          for (const selector of genericSelectors) {
            this.chatInput = document.querySelector(selector);
            if (this.chatInput) break;
          }
          if (!this.chatInput) {
            console.error("[CRO Helper] Could not find chat input with generic selectors either.");
          }
        }
        this.lastChatInputCheck = now;
      }
      return this.chatInput;
    },
    // Invalidates the cached chat input element.
    invalidate() {
      this.chatInput = null;
      this.lastChatInputCheck = 0;
    }
  };

  // --- MODULE: CRO_ErrorHandler ---
  // Provides error handling utilities.
  window.CRO_ErrorHandler = {
    // Wraps a function in a try-catch block for robust error handling.
    withErrorBoundary(fn, fallback = null, context = 'Unknown Function') {
      return (...args) => {
        try {
          return fn(...args);
        } catch (error) {
          console.error(`[CRO Helper ErrorBoundary] Error in ${context}:`, error.message, error.stack);
          if (typeof fallback === 'function') {
            try {
              return fallback(...args);
            } catch (fallbackError) {
              console.error(`[CRO Helper ErrorBoundary] Error in fallback for ${context}:`, fallbackError.message, fallbackError.stack);
              return null;
            }
          }
          return null;
        }
      };
    },
    // Validates input values based on type and constraints.
    validateInput(value, type, constraints = {}) {
      const C = window.CRO_Config.validation;
      const errors = [];
      switch (type) {
        case 'rollValue':
          const num = parseInt(value, 10);
          if (isNaN(num)) {
            errors.push('Raw Roll must be a number.');
          } else if (num < (constraints.min || C.MIN_ROLL) || num > (constraints.max || C.MAX_ROLL)) {
            errors.push(`Raw Roll must be between ${constraints.min || C.MIN_ROLL} and ${constraints.max || C.MAX_ROLL}.`);
          }
          break;
        default:
          errors.push(`Unknown validation type: ${type}`);
      }
      return { isValid: errors.length === 0, errors };
    }
  };

  // --- MODULE: CRO_Utils ---
  // Contains general utility functions for the script.
  window.CRO_Utils = {
    // Converts a camelCase key to a CSS variable name (e.g., 'buttonBackground' -> '--cro-helper-button-background').
    keyToCssVar: (key) => {
      const cssVar = key.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`);
      return `--cro-helper-${cssVar}`;
    },
    // Gets the popover's bottom offset from the configuration.
    getPopoverBottomPx: () => parseInt(window.CRO_Config.popoverBottomOffset, 10) || 75,
    // Formats a slider value (e.g., positive numbers get a '+' prefix).
    formatSliderValue: (value) => {
      const num = parseInt(value, 10);
      return num > 0 ? `+${num}` : `${num}`;
    },
    // Creates a standard input group (label + input element).
    createInputGroup: (labelText, inputId, inputConfig = {}) => {
      const C = window.CRO_Config;
      const group = document.createElement('div');
      group.classList.add(C.classNames.INPUT_GROUP);
      if (inputConfig.fullWidth) group.classList.add('cro-full-width');
      if (inputConfig.groupClass) group.classList.add(inputConfig.groupClass);

      const label = document.createElement('label');
      label.textContent = labelText;
      label.htmlFor = inputId;

      const inputElement = document.createElement(inputConfig.elementType || 'input');
      inputElement.id = inputId;
      Object.assign(inputElement, inputConfig.attributes || {});
      inputElement.classList.add(C.classNames.INPUT);
      if (inputConfig.customClass) inputElement.classList.add(inputConfig.customClass);

      group.appendChild(label);
      group.appendChild(inputElement);
      return { group, input: inputElement, label };
    },
    // Creates a slider input group (label + slider + value display).
    createSliderGroup: (labelText, sliderId, valueDisplayId, config = {}) => {
      const C = window.CRO_Config;
      const group = document.createElement('div');
      group.classList.add(C.classNames.INPUT_GROUP, C.classNames.SLIDER_GROUP);
      if (config.groupClass) group.classList.add(config.groupClass);

      const label = document.createElement('label');
      label.textContent = labelText;
      label.htmlFor = sliderId;

      const slider = document.createElement('input');
      slider.type = 'range';
      slider.id = sliderId;
      slider.min = config.min || '-3';
      slider.max = config.max || '3';
      slider.step = config.step || '1';
      slider.value = config.value || '0';
      if (config.title) slider.title = config.title;
      slider.classList.add(C.classNames.SLIDER);

      const valueSpan = document.createElement('span');
      valueSpan.id = valueDisplayId;
      valueSpan.classList.add(C.classNames.SLIDER_VALUE);
      valueSpan.textContent = window.CRO_Utils.formatSliderValue(slider.value);

      window.CRO_UI.EventManager.addListener(slider, 'input', () => {
        valueSpan.textContent = window.CRO_Utils.formatSliderValue(slider.value);
      });

      group.appendChild(label);
      group.appendChild(slider);
      group.appendChild(valueSpan);
      return { group, slider, valueDisplay: valueSpan };
    },
    // Creates a checkbox input with a label.
    createCheckbox: (id, labelText, titleText) => {
      const C = window.CRO_Config;
      const label = document.createElement('label');
      label.classList.add(C.classNames.CHECKBOX_LABEL);
      if (titleText) label.title = titleText;

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = id;
      if (titleText) checkbox.title = titleText;

      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(` ${labelText}`));
      return { label, checkbox };
    },
    // Determines and returns a consistent key for the current website.
    getCurrentSiteKey: () => {
      if (window.CRO_State.currentSiteKey) return window.CRO_State.currentSiteKey;

      const hostname = window.location.hostname.toLowerCase();
      if (hostname.includes('spicychat.ai')) {
        window.CRO_State.currentSiteKey = 'spicychat.ai';
      } else if (hostname.includes('character.ai')) {
        window.CRO_State.currentSiteKey = 'character.ai';
      } else if (hostname.includes('janitorai.com')) {
        window.CRO_State.currentSiteKey = 'janitorai.com';
      } else {
        console.warn("[CRO Helper] Unknown site, using generic site key:", hostname);
        window.CRO_State.currentSiteKey = 'generic'; // Fallback for unmatched sites.
      }
      return window.CRO_State.currentSiteKey;
    },
    // Retrieves the configuration object for the current site.
    getCurrentSiteConfig: () => {
      const siteKey = window.CRO_Utils.getCurrentSiteKey();
      return window.CRO_Config.siteConfigs[siteKey] || null;
    }
  };

  // --- MODULE: CRO_Persistence ---
  // Handles loading and saving of script state using GM_getValue and GM_setValue.
  // All persistent state is now scoped per-domain.
  window.CRO_Persistence = {
    // Loads popover position, size, and theme from storage for the current domain.
    loadPersistentState: () => {
      const C = window.CRO_Config;
      const S = window.CRO_State;
      const siteKey = window.CRO_Utils.getCurrentSiteKey();

      // Load App settings (Theme and Mode)
      S.currentMode = GM_getValue(`${C.storageKeys.MODE_BASE}-${siteKey}`, 'simple');
      const savedThemeName = GM_getValue(`${C.storageKeys.THEME_BASE}-${siteKey}`, "Default Dark");
      if (C.themes[savedThemeName]) {
        S.currentThemeName = savedThemeName;
        S.editorColors = { ...C.themes[savedThemeName] };
      } else {
        S.currentThemeName = "Default Dark";
        S.editorColors = { ...C.themes["Default Dark"] };
      }

      // Load UI Position and Size
      const savedWidth = parseInt(GM_getValue(`${C.storageKeys.POS_WIDTH_BASE}-${siteKey}`, C.defaultPopoverWidth), 10);
      const savedHeight = parseInt(GM_getValue(`${C.storageKeys.POS_HEIGHT_BASE}-${siteKey}`, C.defaultPopoverHeight), 10);
      const savedLeft = parseInt(GM_getValue(`${C.storageKeys.POS_LEFT_BASE}-${siteKey}`, C.defaultTriggerLeftOffset), 10);

      // Constrain popover position and size to viewport and configured limits.
      const maxLeft = window.innerWidth - Math.max(C.minPopoverWidth, savedWidth) - 5;
      const constrainedLeft = Math.max(5, Math.min(savedLeft, maxLeft));

      if (S.triggerButton) S.triggerButton.style.left = `${constrainedLeft}px`;
      if (S.helperContainer) S.helperContainer.style.left = `${constrainedLeft}px`;

      const bottomOffsetPx = window.CRO_Utils.getPopoverBottomPx();
      const maxH = Math.max(C.minPopoverHeight, window.innerHeight * C.maxPopoverHeightRatio - bottomOffsetPx);
      const constrainedWidth = Math.max(C.minPopoverWidth, savedWidth);
      const constrainedHeight = Math.max(C.minPopoverHeight, Math.min(savedHeight, maxH));

      if (S.helperContainer) {
        S.helperContainer.style.width = `${constrainedWidth}px`;
        S.helperContainer.style.height = `${constrainedHeight}px`;
      }
    },
    // Saves popover position and size to storage for the current domain.
    savePositionAndSize: (left, width, height) => {
      const C = window.CRO_Config;
      const siteKey = window.CRO_Utils.getCurrentSiteKey();
      GM_setValue(`${C.storageKeys.POS_LEFT_BASE}-${siteKey}`, left);
      GM_setValue(`${C.storageKeys.POS_WIDTH_BASE}-${siteKey}`, width);
      GM_setValue(`${C.storageKeys.POS_HEIGHT_BASE}-${siteKey}`, height);
    },
    // Saves the current theme setting to storage for the current domain.
    saveThemeSetting: (themeName) => {
      const siteKey = window.CRO_Utils.getCurrentSiteKey();
      GM_setValue(`${window.CRO_Config.storageKeys.THEME_BASE}-${siteKey}`, themeName);
    },
    // Saves the UI mode setting to storage for the current domain.
    saveModeSetting: (mode) => {
        const siteKey = window.CRO_Utils.getCurrentSiteKey();
        GM_setValue(`${window.CRO_Config.storageKeys.MODE_BASE}-${siteKey}`, mode);
    }
  };

  // --- MODULE: CRO_ThemeManager ---
  // Manages applying themes and updating UI elements based on the current theme.
  window.CRO_ThemeManager = {
    // Applies all colors from the current theme to CSS variables and updates theme-dependent icons.
    updateGlobalStyles: () => {
      const S = window.CRO_State;
      const C = window.CRO_Config;
      const UI = window.CRO_UI;

      // Set CSS variables for all colors in the current theme.
      for (const key in S.editorColors) {
        if (Object.prototype.hasOwnProperty.call(S.editorColors, key)) {
          document.documentElement.style.setProperty(window.CRO_Utils.keyToCssVar(key), S.editorColors[key]);
        }
      }

      // Update icons that depend on theme colors.
      if (S.triggerButton) S.triggerButton.innerHTML = C.diceIconSVG(20);
      if (S.closeButton) S.closeButton.innerHTML = C.closeIconSVG();
      if (S.toolbar) UI.Toolbar.render(); // Toolbar icons are theme-dependent.

      // Update icons within the main content area if it's rendered.
      const currentContent = document.getElementById(C.ids.MAIN_CONTENT_AREA);
      if (currentContent) {
        currentContent.querySelectorAll(`.${C.classNames.COPY_BUTTON}`).forEach(btn => btn.innerHTML = C.copyIconSVG());
        currentContent.querySelectorAll(`.${C.classNames.SEND_BUTTON}`).forEach(btn => btn.innerHTML = C.sendIconSVG());
        currentContent.querySelectorAll(`.${C.classNames.ROLL_BUTTON}`).forEach(btn => btn.innerHTML = C.diceIconSVG(16));
        // Update active state of theme buttons in settings screen.
        if (S.activeScreenId === 'settings_screen') {
          const themeButtonsContainer = currentContent.querySelector('.cro-theme-buttons-container');
          if (themeButtonsContainer) {
            themeButtonsContainer.querySelectorAll(`.${C.classNames.THEME_BUTTON}`).forEach(btn => {
              btn.classList.toggle('active', btn.dataset.themeName === S.currentThemeName);
            });
          }
        }
      }
    },
    // Applies a new theme by name, saves it, and updates global styles.
    applyAndSaveTheme: (themeName) => {
      const C = window.CRO_Config;
      const S = window.CRO_State;
      if (C.themes[themeName]) {
        S.currentThemeName = themeName;
        S.editorColors = { ...C.themes[themeName] };
        window.CRO_Persistence.saveThemeSetting(themeName); // Saves per-domain.
        window.CRO_ThemeManager.updateGlobalStyles();
      } else {
        console.warn(`[CRO Helper] Theme "${themeName}" not found.`);
      }
    }
  };

  // --- MODULE: CRO_UI ---
  // Manages UI creation, event handling, and screen rendering.
  window.CRO_UI = {
    EventManager: {
      activeListeners: new Map(), // Stores active event listeners for cleanup.
      // Adds an event listener with error boundary and tracking.
      addListener(element, event, handler, options = {}) {
        if (!element) {
          console.warn("[CRO EventManager] Attempted to add listener to null element for event:", event);
          return null;
        }
        const wrappedHandler = window.CRO_ErrorHandler.withErrorBoundary(handler, null, `EventListener (${event} on ${element.id || element.tagName})`);
        element.addEventListener(event, wrappedHandler, options);
        const listenerId = `${element.id || 'el'}-${event}-${Date.now()}-${Math.random().toString(36).substring(2,7)}`;
        this.activeListeners.set(listenerId, { element, event, handler: wrappedHandler, options });
        return listenerId;
      },
      // Removes a tracked event listener.
      removeListener(listenerId) {
        const listener = this.activeListeners.get(listenerId);
        if (listener) {
          listener.element.removeEventListener(listener.event, listener.handler, listener.options);
          this.activeListeners.delete(listenerId);
        }
      },
      // Removes all tracked event listeners (e.g., on script unload if implemented).
      cleanupAll() {
        for (const id of this.activeListeners.keys()) {
          this.removeListener(id);
        }
        console.log("[CRO EventManager] All listeners cleaned up.");
      }
    },
    StyleSheets: {
      // Generates a string of CSS variables from the current theme's editorColors.
      generateCSSVariables: () => {
        const S = window.CRO_State;
        return Object.entries(S.editorColors).map(([key, value]) => `${window.CRO_Utils.keyToCssVar(key)}: ${value};`).join('\n');
      },
      // Returns the base CSS for the script, including :root variables.
      getBaseStyles: () => `
        :root {
          ${window.CRO_UI.StyleSheets.generateCSSVariables()}
          --cro-bg: var(--cro-helper-background);
          --cro-text: var(--cro-helper-text);
          --cro-border: var(--cro-helper-border);
          --cro-header-bg: var(--cro-helper-header-background);
          --cro-input-bg: var(--cro-helper-textarea-background);
          --cro-input-border: var(--cro-helper-cro-input-border);
          --cro-output-bg: var(--cro-helper-cro-output-background);
          --cro-focus-border: var(--cro-helper-focus-border);
          --cro-accent: var(--cro-helper-accent);
          --cro-icon-color: var(--cro-helper-button-icon-color);
          --cro-btn-text: var(--cro-helper-button-text-color);
          --cro-btn-bg: var(--cro-helper-button-background);
          --cro-btn-hover-bg: var(--cro-helper-button-hover-bg);
          --cro-btn-active-bg: var(--cro-helper-button-active-bg);
          --cro-copy-success-bg: var(--cro-helper-copy-success-bg);
          --cro-italic-color: var(--cro-helper-italic-color);
          --cro-scrollbar-track: var(--cro-helper-scrollbar-track);
          --cro-scrollbar-thumb: var(--cro-helper-scrollbar-thumb);
          --cro-scrollbar-thumb-hover: var(--cro-helper-scrollbar-thumb-hover);
          --cro-resize-handle: var(--cro-helper-resize-handle-color);
          --cro-toolbar-active-bg: var(--cro-helper-toolbar-active-bg);
          --cro-toolbar-active-icon: var(--cro-helper-toolbar-active-icon);
          --cro-theme-btn-bg: var(--cro-helper-theme-button-bg);
          --cro-theme-btn-hover-bg: var(--cro-helper-theme-button-hover-bg);
          --cro-theme-btn-active-bg: var(--cro-helper-theme-button-active-bg);
          --cro-theme-btn-active-text: var(--cro-helper-theme-button-active-text);
          --cro-error-text-color: var(--cro-helper-error-color, #ff6b6b);
          --cro-error-border-color: var(--cro-helper-error-color, #ff6b6b);
        }
        body.${window.CRO_Config.classNames.DRAGGING_BODY},
        body.${window.CRO_Config.classNames.RESIZING_BODY} {
          user-select: none;
          -webkit-user-select: none;
        }
      `,
      // Returns CSS for animations (e.g., dice roll border).
      getAnimationStyles: () => {
        const C = window.CRO_Config;
        return `
          @keyframes cro-helper-rainbow-border {
            0%, 100% { border-color: var(--cro-helper-cro-rainbow-border1); }
            14% { border-color: var(--cro-helper-cro-rainbow-border2); }
            28% { border-color: var(--cro-helper-cro-rainbow-border3); }
            42% { border-color: var(--cro-helper-cro-rainbow-border4); }
            57% { border-color: var(--cro-helper-cro-rainbow-border5); }
            71% { border-color: var(--cro-helper-cro-rainbow-border6); }
            85% { border-color: var(--cro-helper-cro-rainbow-border7); }
          }
          .${C.classNames.INPUT}.${C.classNames.DICE_ROLLING} {
            border-width: 1px !important;
            border-style: solid !important;
            animation-name: cro-helper-rainbow-border;
            animation-duration: ${C.animation.DICE_ANIMATION_DURATION / 1000}s;
            animation-timing-function: linear;
            animation-iteration-count: infinite;
          }
        `;
      },
      // Returns CSS for UI components (popover, buttons, inputs, etc.).
      getComponentStyles: () => {
        const C = window.CRO_Config;
        return `
          #${C.ids.TRIGGER_BUTTON} { position: fixed; bottom: ${C.triggerBottomOffset}; z-index: 10000; width: 44px; height: 44px; background-color: var(--cro-header-bg); color: var(--cro-icon-color); border: 1px solid var(--cro-border); border-radius: 50%; cursor: grab; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 10px rgba(0,0,0,0.3); transition: transform 0.2s ease-out, background-color 0.2s; }
          #${C.ids.TRIGGER_BUTTON}:active { cursor: grabbing; }
          #${C.ids.TRIGGER_BUTTON}:hover { background-color: var(--cro-btn-hover-bg); transform: scale(1.1); }
          #${C.ids.TRIGGER_BUTTON} svg { stroke: var(--cro-icon-color); pointer-events: none; }
          #${C.ids.HELPER_CONTAINER} { position: fixed; bottom: ${C.popoverBottomOffset}; z-index: 10001; background-color: var(--cro-bg); border: 1px solid var(--cro-border); border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.4); display: flex; flex-direction: column; transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out; opacity: 0; transform: translateY(20px) scale(0.95); pointer-events: none; overflow: hidden; resize: none; }
          #${C.ids.HELPER_CONTAINER}.${C.classNames.VISIBLE} { opacity: 1; transform: translateY(0) scale(1); pointer-events: auto; }
          #${C.ids.HELPER_CONTAINER} > div:nth-of-type(2) { display: flex; flex-grow: 1; overflow: hidden; /* This is the bodyContainer */ }
          #${C.ids.RESIZE_TL}, #${C.ids.RESIZE_TR}, #${C.ids.RESIZE_TOP} { position: absolute; background: transparent; z-index: 10; }
          #${C.ids.RESIZE_TL}, #${C.ids.RESIZE_TR} { top: 0; width: ${C.cornerHandleSize}; height: ${C.cornerHandleSize}; }
          #${C.ids.RESIZE_TL} { left: 0; cursor: nwse-resize; }
          #${C.ids.RESIZE_TR} { right: 0; cursor: nesw-resize; }
          #${C.ids.RESIZE_TOP} { top: 0; left: ${C.cornerHandleSize}; right: ${C.cornerHandleSize}; height: ${C.edgeHandleThickness}; cursor: ns-resize; }
          #${C.ids.HEADER} { position: relative; display: flex; justify-content: space-between; align-items: center; padding: 6px ${C.cornerHandleSize} 6px ${C.cornerHandleSize}; background-color: var(--cro-header-bg); color: var(--cro-text); font-weight: 500; font-size: 14px; border-bottom: 1px solid var(--cro-border); flex-shrink: 0; cursor: default; /* Default for header, handles override for dragging */ }
          #${C.ids.HEADER} span { flex-grow: 1; text-align: center; margin: 0 5px; /* For title */ }
          #${C.ids.CLOSE_BUTTON} { background: none; border: none; padding: 4px; margin-left: 5px; cursor: pointer; color: var(--cro-icon-color); border-radius: 4px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; z-index: 5; /* Ensure clickable over handles */ position: relative; }
          #${C.ids.CLOSE_BUTTON}:hover { background-color: var(--cro-btn-hover-bg); }
          #${C.ids.CLOSE_BUTTON} svg { width: 16px; height: 16px; stroke: var(--cro-icon-color); }
          #${C.ids.TOOLBAR} { width: ${C.TOOLBAR_WIDTH}px; flex-shrink: 0; background-color: var(--cro-header-bg); border-right: 1px solid var(--cro-border); display: flex; flex-direction: column; align-items: center; padding-top: 10px; gap: 10px; overflow-y: auto; scrollbar-width: none; /* Firefox */ }
          #${C.ids.TOOLBAR}::-webkit-scrollbar { display: none; /* Chrome, Safari, Opera */ }
          .${C.classNames.TOOLBAR_BUTTON} { background: none; border: none; padding: 8px; width: calc(100% - 10px); max-width: 40px; height: 40px; border-radius: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background-color 0.2s; color: var(--cro-icon-color); margin: 0 5px; }
          .${C.classNames.TOOLBAR_BUTTON} svg { stroke: var(--cro-icon-color); width: 20px; height: 20px; transition: stroke 0.2s; }
          .${C.classNames.TOOLBAR_BUTTON}:hover { background-color: var(--cro-btn-hover-bg); }
          .${C.classNames.TOOLBAR_BUTTON}.active { background-color: var(--cro-toolbar-active-bg); }
          .${C.classNames.TOOLBAR_BUTTON}.active svg { stroke: var(--cro-toolbar-active-icon); }
          #${C.ids.MAIN_CONTENT_AREA} { flex-grow: 1; overflow-y: auto; overflow-x: hidden; position: relative; /* For absolute positioned children if any */ scrollbar-width: thin; scrollbar-color: var(--cro-scrollbar-thumb) var(--cro-scrollbar-track); }
          #${C.ids.MAIN_CONTENT_AREA}::-webkit-scrollbar { width: 8px; }
          #${C.ids.MAIN_CONTENT_AREA}::-webkit-scrollbar-track { background: var(--cro-scrollbar-track); }
          #${C.ids.MAIN_CONTENT_AREA}::-webkit-scrollbar-thumb { background-color: var(--cro-scrollbar-thumb); border-radius: 4px; border: 2px solid var(--cro-scrollbar-track); }
          #${C.ids.MAIN_CONTENT_AREA}::-webkit-scrollbar-thumb:hover { background-color: var(--cro-scrollbar-thumb-hover); }
          /* --- UI Mode Styles --- */
          #${C.ids.MAIN_CONTENT_AREA}.mode-simple .${C.classNames.DIALOGUE_INPUT_GROUP},
          #${C.ids.MAIN_CONTENT_AREA}.mode-simple .${C.classNames.MODIFIER_SLIDER_GROUP},
          #${C.ids.MAIN_CONTENT_AREA}.mode-simple .${C.classNames.SCALE_SELECT_GROUP},
          #${C.ids.MAIN_CONTENT_AREA}.mode-simple .${C.classNames.ACTION_MODIFIER_CONTAINER} {
            display: none !important;
          }
          #${C.ids.MAIN_CONTENT_AREA}.mode-advanced .${C.classNames.ACTION_MODIFIER_CONTAINER} {
            display: none !important;
          }
          .${C.classNames.SCREEN_CONTENT_WRAPPER} { padding: 10px 15px; display: flex; flex-direction: column; gap: 0px; /* Default, specific screens might override */ }
          .${C.classNames.SCREEN_TITLE} { margin: 0 0 10px 0; padding-bottom: 5px; font-size: 16px; font-weight: 500; color: var(--cro-text); border-bottom: 1px solid var(--cro-border); }
          .${C.classNames.SCREEN_SUBHEADING} { margin: 10px 0 5px 0; font-size: 14px; font-weight: 500; color: var(--cro-text); }
          .${C.classNames.SCREEN_DESCRIPTION} { font-size: 13px; color: var(--cro-text); margin: 5px 0 15px 0; line-height: 1.4; }
          .${C.classNames.SLIDER_GROUP} { flex-wrap: nowrap; /* Ensure slider and value stay on one line */ }
          .${C.classNames.SLIDER} { flex-grow: 1; height: 18px; cursor: pointer; margin: 0 5px; -webkit-appearance: none; appearance: none; background: var(--cro-input-border); border-radius: 3px; outline-color: var(--cro-focus-border); }
          .${C.classNames.SLIDER}::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 14px; height: 14px; background: var(--cro-icon-color); border-radius: 50%; cursor: pointer; border: 1px solid var(--cro-border); }
          .${C.classNames.SLIDER}::-moz-range-thumb { width: 14px; height: 14px; background: var(--cro-icon-color); border-radius: 50%; cursor: pointer; border: 1px solid var(--cro-border); }
          .${C.classNames.SLIDER_VALUE} { font-size: 13px; min-width: 2.5em; text-align: right; color: var(--cro-text); font-weight: 500; }
          .cro-divider { border: none; height: 1px; background-color: var(--cro-border); margin: 12px 0; flex-shrink: 0; }
          .${C.classNames.INPUT_GROUP} { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; /* Allow wrapping for smaller widths */ margin-bottom: 8px; }
          .${C.classNames.INPUT_GROUP}.cro-full-width { flex-wrap: nowrap; align-items: flex-start; /* For textareas */ }
          .${C.classNames.INPUT_GROUP}.cro-full-width label { margin-top: 5px; /* Align label with textarea top */ }
          .${C.classNames.INPUT_GROUP} label { font-size: 13px; color: var(--cro-text); width: 75px; /* Fixed width for label alignment */ text-align: right; flex-shrink: 0; }
          .${C.classNames.INPUT} { flex-grow: 1; padding: 5px 8px; background-color: var(--cro-input-bg); color: var(--cro-text); border: 1px solid var(--cro-input-border); border-radius: 4px; font-size: 13px; outline: none; min-width: 60px; /* Prevent inputs from becoming too small */ transition: border-color 0.2s; font-family: inherit; }
          .${C.classNames.INPUT}.${C.classNames.INPUT_ERROR} { border-color: var(--cro-error-border-color) !important; box-shadow: 0 0 0 1px var(--cro-error-border-color) !important; }
          .${C.classNames.INPUT_DIALOGUE}, .${C.classNames.INPUT_ACTION_DESC} { resize: vertical; min-height: 40px; /* Taller textareas */ flex-basis: 100%; background-color: var(--cro-input-bg) !important; /* Ensure consistent bg */ }
          .${C.classNames.INPUT_NUMBER} { width: 60px; flex-grow: 0; text-align: center; -moz-appearance: textfield; /* Firefox */ }
          .${C.classNames.INPUT_NUMBER}::-webkit-outer-spin-button, .${C.classNames.INPUT_NUMBER}::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; /* Chrome, Safari, Edge */ }
          .${C.classNames.INPUT_SELECT} { min-width: 120px; appearance: none; background-image: url('data:image/svg+xml;utf8,<svg fill="${encodeURIComponent(window.CRO_State.editorColors.text || '#e0e0e0')}" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>'); background-repeat: no-repeat; background-position: right 8px center; padding-right: 30px; }
          .${C.classNames.INPUT}:focus { border-color: var(--cro-focus-border) !important; box-shadow: 0 0 0 1px var(--cro-focus-border); animation: none !important; /* Stop dice roll animation on focus */ }
          .${C.classNames.INPUT_WRAPPER} { display: flex; position: relative; align-items: center; flex-grow: 1; }
          .${C.classNames.INPUT_ARROW} { position: absolute; right: 5px; top: 50%; transform: translateY(-50%); font-size: 10px; color: var(--cro-icon-color); pointer-events: none; }
          .${C.classNames.INPUT_WITH_BUTTON} { display: flex; align-items: center; gap: 5px; flex-grow: 1; }
          .${C.classNames.INPUT_WITH_BUTTON} .${C.classNames.INPUT_NUMBER} { flex-grow: 1; }
          .${C.classNames.ROLL_BUTTON} { padding: 0; font-size: 14px; background-color: var(--cro-btn-bg); color: var(--cro-btn-text); border: 1px solid var(--cro-border); border-radius: 4px; cursor: pointer; transition: background-color 0.2s, opacity 0.2s; line-height: 1; flex-shrink: 0; width: 28px; height: 28px; display: inline-flex; align-items: center; justify-content: center; }
          .${C.classNames.ROLL_BUTTON}:disabled { opacity: 0.5; cursor: not-allowed; background-color: var(--cro-btn-bg); }
          .${C.classNames.ROLL_BUTTON}:disabled svg { stroke: var(--cro-icon-color); }
          .${C.classNames.ROLL_BUTTON} svg { width: 16px; height: 16px; stroke: var(--cro-icon-color); }
          .${C.classNames.ROLL_BUTTON}:hover:not(:disabled) { background-color: var(--cro-btn-hover-bg); }
          .${C.classNames.BUTTON} { padding: 6px 12px; font-size: 13px; background-color: var(--cro-btn-bg); color: var(--cro-btn-text); border: 1px solid var(--cro-border); border-radius: 4px; cursor: pointer; transition: background-color 0.2s; align-self: flex-start; margin-top: 5px; }
          .${C.classNames.BUTTON}:hover { background-color: var(--cro-btn-hover-bg); }
          .${C.classNames.OUTPUT_CONTAINER} { display: flex; flex-direction: column; margin-top: 8px; }
          .${C.classNames.ERROR_MESSAGE} { color: var(--cro-error-text-color); font-size: 12px; padding: 4px 0; margin-bottom: 4px; text-align: center; }
          .${C.classNames.OUTPUT_AREA} { width: 100%; box-sizing: border-box; padding: 8px; border: 1px solid var(--cro-border); border-radius: 4px; background-color: var(--cro-output-bg) !important; color: var(--cro-text); font-size: 13px; line-height: 1.5; resize: none; white-space: pre-wrap; font-family: inherit; }
          .${C.classNames.OUTPUT_AREA} em { font-style: italic; color: var(--cro-italic-color); }
          .${C.classNames.OUTPUT_BUTTONS_GROUP} { display: flex; justify-content: flex-end; gap: 5px; margin-top: 5px; }
          .${C.classNames.COPY_BUTTON}, .${C.classNames.SEND_BUTTON} { background-color: transparent; border: none; padding: 4px; width: 28px; height: 28px; border-radius: 4px; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; transition: background-color 0.2s, opacity 0.2s; }
          .${C.classNames.COPY_BUTTON} svg, .${C.classNames.SEND_BUTTON} svg { width: 16px; height: 16px; stroke: var(--cro-icon-color); }
          .${C.classNames.COPY_BUTTON}:hover, .${C.classNames.SEND_BUTTON}:hover { background-color: var(--cro-header-bg); }
          .${C.classNames.COPY_BUTTON}:disabled, .${C.classNames.SEND_BUTTON}:disabled { opacity: 0.5; cursor: default; }
          .${C.classNames.COPY_BUTTON}.flash-success { background-color: var(--cro-copy-success-bg) !important; transition: background-color 0.1s ease-out; }
          .${C.classNames.COPY_BUTTON}.flash-success svg { stroke: var(--cro-text) !important; }
          .${C.classNames.ACTION_MODIFIER_CONTAINER} { margin-top: 15px; padding-top: 10px; border-top: 1px dashed var(--cro-border); }
          .${C.classNames.ACTION_MODIFIER_CONTAINER} .${C.classNames.SCREEN_SUBHEADING} { margin-top: 0; margin-bottom: 10px; }
          .${C.classNames.CHECKBOX_LABEL} { display: flex; align-items: center; gap: 6px; font-size: 13px; cursor: pointer; color: var(--cro-text); }
          .${C.classNames.CHECKBOX_LABEL} input[type="checkbox"] { cursor: pointer; accent-color: var(--cro-accent); }
          .cro-settings-section { margin-bottom: 20px; }
          .cro-theme-buttons-container { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 10px; margin-top: 5px; }
          .${C.classNames.THEME_BUTTON} { padding: 8px 12px; font-size: 13px; border-radius: 4px; cursor: pointer; transition: background-color 0.2s, color 0.2s, border-color 0.2s; border: 1px solid var(--cro-border); background-color: var(--cro-theme-btn-bg); color: var(--cro-btn-text); text-align: center; }
          .${C.classNames.THEME_BUTTON}:hover { background-color: var(--cro-theme-btn-hover-bg); }
          .${C.classNames.THEME_BUTTON}.active { background-color: var(--cro-theme-btn-active-bg) !important; color: var(--cro-theme-btn-active-text) !important; border-color: var(--cro-theme-btn-active-bg) !important; font-weight: bold; }
          /* Hide number input spinners */
          input[type=number]::-webkit-inner-spin-button,
          input[type=number]::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          input[type=number] {
            -moz-appearance: textfield; /* Firefox */
          }
        `;
      }
    },
    // Creates all core HTML elements for the popover and trigger button.
    createElements: () => {
      const S = window.CRO_State;
      const C = window.CRO_Config;

      S.triggerButton = document.createElement('button');
      S.triggerButton.id = C.ids.TRIGGER_BUTTON;
      S.triggerButton.title = 'Toggle CRO Helper (Drag to move)';
      document.body.appendChild(S.triggerButton); // Icon set by ThemeManager

      S.helperContainer = document.createElement('div');
      S.helperContainer.id = C.ids.HELPER_CONTAINER;
      S.helperContainer.classList.add(C.classNames.HIDDEN);

      S.header = document.createElement('div');
      S.header.id = C.ids.HEADER;

      // Resize handles
      S.resizeHandleTL = document.createElement('div');
      S.resizeHandleTL.id = C.ids.RESIZE_TL;
      S.resizeHandleTL.title = "Resize (Top-Left)";
      S.header.appendChild(S.resizeHandleTL);

      S.resizeHandleTR = document.createElement('div');
      S.resizeHandleTR.id = C.ids.RESIZE_TR;
      S.resizeHandleTR.title = "Resize (Top-Right)";
      S.header.appendChild(S.resizeHandleTR);

      S.resizeHandleTop = document.createElement('div');
      S.resizeHandleTop.id = C.ids.RESIZE_TOP;
      S.resizeHandleTop.title = "Resize (Top Edge)";
      S.header.appendChild(S.resizeHandleTop);

      const titleSpan = document.createElement('span');
      titleSpan.textContent = 'CRO Helper';
      // titleSpan.style.textAlign = 'center'; // Centered by flex in header
      // titleSpan.style.flexGrow = '1';

      S.closeButton = document.createElement('button');
      S.closeButton.id = C.ids.CLOSE_BUTTON;
      S.closeButton.title = 'Close CRO Helper';
      S.header.appendChild(titleSpan);
      S.header.appendChild(S.closeButton); // Icon set by ThemeManager

      // Main body container for toolbar and content area
      const bodyContainer = document.createElement('div');
      // Styles applied directly or via CSS: display: flex; flex-grow: 1; overflow: hidden;

      S.toolbar = document.createElement('div');
      S.toolbar.id = C.ids.TOOLBAR;

      S.mainContentArea = document.createElement('div');
      S.mainContentArea.id = C.ids.MAIN_CONTENT_AREA;

      bodyContainer.appendChild(S.toolbar);
      bodyContainer.appendChild(S.mainContentArea);

      S.helperContainer.appendChild(S.header);
      S.helperContainer.appendChild(bodyContainer);
      document.body.appendChild(S.helperContainer);
    },
    // Injects all necessary CSS into the page.
    injectStyles: () => {
      GM_addStyle(window.CRO_UI.StyleSheets.getBaseStyles());
      GM_addStyle(window.CRO_UI.StyleSheets.getComponentStyles());
      GM_addStyle(window.CRO_UI.StyleSheets.getAnimationStyles());
    },
    // Applies the correct UI mode class to the main content area.
    applyUIMode: () => {
        const S = window.CRO_State;
        if (S.mainContentArea) {
            S.mainContentArea.classList.remove('mode-simple', 'mode-advanced', 'mode-expert');
            S.mainContentArea.classList.add(`mode-${S.currentMode}`);
        }
    },
    Toolbar: {
      // Renders the toolbar buttons based on configured screens.
      render: () => {
        const S = window.CRO_State;
        const C = window.CRO_Config;
        if (!S.toolbar) return;
        S.toolbar.innerHTML = ''; // Clear existing buttons

        C.screens.forEach(screen => {
          const button = document.createElement('button');
          button.classList.add(C.classNames.TOOLBAR_BUTTON);
          button.dataset.screenId = screen.id;
          button.title = screen.label;

          const isActive = screen.id === S.activeScreenId;
          button.innerHTML = screen.iconSVG(isActive); // Get themed icon
          button.classList.toggle('active', isActive);

          window.CRO_UI.EventManager.addListener(button, 'click', () => window.CRO_UI.Screens.switchScreen(screen.id));
          S.toolbar.appendChild(button);
        });
      },
      // Handles mouse wheel scrolling over the toolbar to switch screens.
      handleWheelScroll: (event) => {
        const S = window.CRO_State;
        const C = window.CRO_Config;
        if (!S.toolbar.contains(event.target)) return; // Only act if scrolling over toolbar
        event.preventDefault();
        event.stopPropagation();

        const currentIndex = C.screens.findIndex(screen => screen.id === S.activeScreenId);
        if (currentIndex === -1) return; // Should not happen

        let nextIndex = currentIndex + (event.deltaY > 0 ? 1 : (event.deltaY < 0 ? -1 : 0));
        nextIndex = Math.max(0, Math.min(nextIndex, C.screens.length - 1)); // Clamp index

        if (nextIndex !== currentIndex) {
          window.CRO_UI.Screens.switchScreen(C.screens[nextIndex].id);
        }
      }
    },
    Screens: {
      // Helper to create the basic structure for a screen (title, description).
      _createScreenContainer: (targetContainer, title, description) => {
        const C = window.CRO_Config;
        targetContainer.innerHTML = ''; // Clear previous content

        const contentDiv = document.createElement('div');
        contentDiv.classList.add(C.classNames.SCREEN_CONTENT_WRAPPER);
        targetContainer.appendChild(contentDiv);

        const titleElement = document.createElement('h5');
        titleElement.textContent = title;
        titleElement.classList.add(C.classNames.SCREEN_TITLE);
        contentDiv.appendChild(titleElement);

        if (description) {
          const descElement = document.createElement('p');
          descElement.textContent = description;
          descElement.classList.add(C.classNames.SCREEN_DESCRIPTION);
          contentDiv.appendChild(descElement);
        }
        return contentDiv; // Return the direct parent for adding more elements
      },
      // Adds primary input fields (Dialogue, Action, Skill) to a screen.
      _addPrimaryInputFields: (contentDiv, elements, skillDatalistId) => {
        const C = window.CRO_Config;
        const S = window.CRO_State;
        const Utils = window.CRO_Utils;

        // Dialogue input (textarea)
        const dialogueGroupConfig = {
          elementType: 'textarea',
          attributes: { placeholder: "(Optional) Character's spoken words", rows: 2 }, // Textarea height
          customClass: C.classNames.INPUT_DIALOGUE,
          fullWidth: true,
          groupClass: C.classNames.DIALOGUE_INPUT_GROUP // For hiding in simple mode
        };
        const dialogueElements = Utils.createInputGroup('Dialogue:', 'cro-helper-dialogue', dialogueGroupConfig);
        elements.dialogueInput = dialogueElements.input;
        contentDiv.appendChild(dialogueElements.group);

        // Action Description input (textarea)
        const actionDescGroupConfig = {
          elementType: 'textarea',
          attributes: { placeholder: "e.g., pick the lock", rows: 2 }, // Textarea height
          customClass: C.classNames.INPUT_ACTION_DESC,
          fullWidth: true
        };
        const actionDescElements = Utils.createInputGroup('Action:', 'cro-helper-action', actionDescGroupConfig);
        elements.actionDescInput = actionDescElements.input;
        contentDiv.appendChild(actionDescElements.group);

        // Skill input (text input with datalist for suggestions)
        const skillGroup = document.createElement('div');
        skillGroup.classList.add(C.classNames.INPUT_GROUP);
        const skillInputLabel = document.createElement('label');
        skillInputLabel.textContent = 'Skill:';
        skillInputLabel.htmlFor = `cro-helper-skill`;

        const skillInputWrapper = document.createElement('div');
        skillInputWrapper.classList.add(C.classNames.INPUT_WRAPPER);
        elements.skillInput = document.createElement('input');
        elements.skillInput.type = 'text';
        elements.skillInput.id = `cro-helper-skill`;
        elements.skillInput.placeholder = 'e.g., SOCIAL, MANUAL';
        elements.skillInput.classList.add(C.classNames.INPUT);
        if (S.currentMode !== 'simple') {
            elements.skillInput.setAttribute('list', skillDatalistId);
        }

        const skillArrow = document.createElement('span'); // Decorative arrow for select-like appearance
        skillArrow.classList.add(C.classNames.INPUT_ARROW);
        skillArrow.innerHTML = '▾';

        const skillDataList = document.createElement('datalist');
        skillDataList.id = skillDatalistId;

        // Curated list of skill suggestions
        const skillSuggestions = [
            'DICE', 'PHYSICAL', 'MANUAL', 'MENTAL', 'SOCIAL',
            'PERCEPTION', 'FORTUNE', 'STEALTH', 'ITEM FOCUS'
        ];

        skillSuggestions.forEach(skill => {
          const option = document.createElement('option');
          option.value = skill;
          skillDataList.appendChild(option);
        });

        skillInputWrapper.appendChild(elements.skillInput);
        skillInputWrapper.appendChild(skillArrow);
        skillGroup.appendChild(skillInputLabel);
        skillGroup.appendChild(skillInputWrapper);
        skillGroup.appendChild(skillDataList); // Datalist must be appended to the document
        contentDiv.appendChild(skillGroup);
      },
      // Adds Modifier slider, Raw Roll input (with dice button), and Scale select dropdown.
      _addRollAndScaleControls: (contentDiv, elements) => {
        const C = window.CRO_Config;
        const Utils = window.CRO_Utils;

        // Modifier Slider
        const modifierSliderElements = Utils.createSliderGroup(
          'Modifier:', 'cro-helper-modifier', 'cro-helper-modifier-value',
          {
              min: C.validation.MIN_MODIFIER, max: C.validation.MAX_MODIFIER, value: 0, title: 'Adjust difficulty modifier.',
              groupClass: C.classNames.MODIFIER_SLIDER_GROUP // For hiding in simple mode
          }
        );
        elements.modifierSlider = modifierSliderElements.slider;
        contentDiv.appendChild(modifierSliderElements.group);

        // Raw Roll Input with Dice Button
        const resultGroup = document.createElement('div');
        resultGroup.classList.add(C.classNames.INPUT_GROUP);
        const resultInputLabel = document.createElement('label');
        resultInputLabel.textContent = 'Raw Roll:';
        resultInputLabel.htmlFor = `cro-helper-result`;

        const resultInputWrapper = document.createElement('div');
        resultInputWrapper.classList.add(C.classNames.INPUT_WITH_BUTTON);
        elements.resultInput = document.createElement('input');
        elements.resultInput.type = 'number';
        elements.resultInput.id = `cro-helper-result`;
        elements.resultInput.min = C.validation.MIN_ROLL;
        elements.resultInput.max = C.validation.MAX_ROLL;
        elements.resultInput.step = '1';
        elements.resultInput.placeholder = `${C.validation.MIN_ROLL}-${C.validation.MAX_ROLL}`;
        elements.resultInput.classList.add(C.classNames.INPUT, C.classNames.INPUT_NUMBER);

        elements.rollButtonAction = document.createElement('button');
        elements.rollButtonAction.innerHTML = C.diceIconSVG(16); // Themed icon
        elements.rollButtonAction.classList.add(C.classNames.ROLL_BUTTON);

        resultInputWrapper.appendChild(elements.resultInput);
        resultInputWrapper.appendChild(elements.rollButtonAction);
        resultGroup.appendChild(resultInputLabel);
        resultGroup.appendChild(resultInputWrapper);
        contentDiv.appendChild(resultGroup);

        // Scale Select Dropdown
        const scaleGroupConfig = {
            elementType: 'select',
            customClass: C.classNames.INPUT_SELECT,
            groupClass: C.classNames.SCALE_SELECT_GROUP // For hiding in simple mode
        };
        const scaleElements = Utils.createInputGroup('Scale:', 'cro-helper-scale', scaleGroupConfig);
        elements.scaleSelect = scaleElements.input;
        const scalesToShow = {...C.croScales}; // Make a copy to potentially modify
        if (C.croScales.itemFocus) scalesToShow.itemFocus = C.croScales.itemFocus; // Ensure itemFocus is included

        for (const scaleKey in scalesToShow) {
          if (Object.prototype.hasOwnProperty.call(scalesToShow, scaleKey) && scaleKey !== "timeAndFortune") { // Exclude timeAndFortune for now
            const option = document.createElement('option');
            option.value = scaleKey;
            option.textContent = scalesToShow[scaleKey].name;
            elements.scaleSelect.appendChild(option);
          }
        }
        contentDiv.appendChild(scaleElements.group);
      },
      // Adds the output textarea and Copy/Send buttons.
      _addOutputAreaAndActions: (contentDiv, elements) => {
        const C = window.CRO_Config;
        elements.generateActionButton = document.createElement('button');
        elements.generateActionButton.textContent = 'Generate Action Roll';
        elements.generateActionButton.classList.add(C.classNames.BUTTON);
        contentDiv.appendChild(elements.generateActionButton);

        const actionOutputContainer = document.createElement('div');
        actionOutputContainer.classList.add(C.classNames.OUTPUT_CONTAINER);

        elements.errorDisplay = document.createElement('div');
        elements.errorDisplay.id = C.ids.ACTION_ERROR_MESSAGE;
        elements.errorDisplay.classList.add(C.classNames.ERROR_MESSAGE);
        elements.errorDisplay.style.display = 'none'; // Initially hidden
        actionOutputContainer.appendChild(elements.errorDisplay);

        elements.actionOutputArea = document.createElement('textarea');
        elements.actionOutputArea.id = C.ids.OUTPUT_ACTION;
        elements.actionOutputArea.readOnly = true;
        elements.actionOutputArea.rows = 5; // Default height
        elements.actionOutputArea.classList.add(C.classNames.OUTPUT_AREA);

        const actionButtonsGroup = document.createElement('div');
        actionButtonsGroup.classList.add(C.classNames.OUTPUT_BUTTONS_GROUP);

        elements.copyActionButton = document.createElement('button');
        elements.copyActionButton.innerHTML = C.copyIconSVG(); // Themed icon
        elements.copyActionButton.title = 'Copy Action Roll Text';
        elements.copyActionButton.classList.add(C.classNames.COPY_BUTTON);
        elements.copyActionButton.style.display = 'none'; // Hidden until output is generated

        elements.sendActionButton = document.createElement('button');
        elements.sendActionButton.innerHTML = C.sendIconSVG(); // Themed icon
        elements.sendActionButton.title = 'Send Action Roll to Chat Input';
        elements.sendActionButton.classList.add(C.classNames.SEND_BUTTON);
        elements.sendActionButton.style.display = 'none'; // Hidden until output is generated

        actionButtonsGroup.appendChild(elements.copyActionButton);
        actionButtonsGroup.appendChild(elements.sendActionButton);
        actionOutputContainer.appendChild(elements.actionOutputArea);
        actionOutputContainer.appendChild(actionButtonsGroup);
        contentDiv.appendChild(actionOutputContainer);
      },
      // Adds modifier controls (Stakes slider, Pushing Limits checkbox, Guarded Approach checkbox).
      _addActionModifiers: (contentDiv, elements) => {
        const C = window.CRO_Config;
        const Utils = window.CRO_Utils;

        const modifierContainer = document.createElement('div');
        modifierContainer.classList.add(C.classNames.ACTION_MODIFIER_CONTAINER);

        const modifierTitle = document.createElement('h6');
        modifierTitle.textContent = "Action Modifiers";
        modifierTitle.classList.add(C.classNames.SCREEN_SUBHEADING);
        modifierContainer.appendChild(modifierTitle);

        // Stakes Slider
        const stakesSliderElements = Utils.createSliderGroup(
          'Stakes:', `cro-helper-stakes`, `cro-helper-stakes-value`,
          { min: C.validation.MIN_STAKES, max: C.validation.MAX_STAKES, value: 0, title: 'Adjust stakes: Higher risk for higher reward/harsher failure.' }
        );
        elements.stakesSlider = stakesSliderElements.slider;
        modifierContainer.appendChild(stakesSliderElements.group);

        // Checkboxes for Pushing Limits and Guarded Approach
        const checkboxContainer = document.createElement('div');
        checkboxContainer.style.cssText = 'display: flex; flex-direction: column; gap: 5px; margin-top: 8px;';

        const pushElements = Utils.createCheckbox('cro-push-limit', 'Pushing Limits', 'Attempt action beyond normal capabilities with harsher failure scale.');
        elements.pushCheck = pushElements.checkbox;
        checkboxContainer.appendChild(pushElements.label);

        const guardElements = Utils.createCheckbox('cro-guard-approach', 'Guarded Approach', 'Minimize critical failure (roll 1 becomes 2) at cost of critical success (roll 10 becomes 9).');
        elements.guardCheck = guardElements.checkbox;
        checkboxContainer.appendChild(guardElements.label);

        modifierContainer.appendChild(checkboxContainer);
        contentDiv.appendChild(modifierContainer);
      },
      // Binds event listeners for the Action Roller screen's interactive elements.
      _bindActionRollerEvents: (elements) => {
        const C = window.CRO_Config;
        const S = window.CRO_State;
        const UI = window.CRO_UI;
        const ErrorHandler = window.CRO_ErrorHandler;

        // Auto-select scale based on skill input
        UI.EventManager.addListener(elements.skillInput, 'input', () => {
          if (S.currentMode === 'simple') return; // Don't auto-select in simple mode
          const skillValue = elements.skillInput.value.trim().toLowerCase();
          let matchedScaleKey = null;
          for (const scaleKey in C.croScales) {
            if (Object.prototype.hasOwnProperty.call(C.croScales, scaleKey)) { // Ensure it's an own property
              if (C.croScales[scaleKey].name.toLowerCase() === skillValue || scaleKey.toLowerCase() === skillValue) {
                matchedScaleKey = scaleKey;
                break;
              }
            }
          }
          if (matchedScaleKey && elements.scaleSelect.value !== matchedScaleKey) {
            elements.scaleSelect.value = matchedScaleKey;
          }
        });

        // Dice roll button
        UI.EventManager.addListener(elements.rollButtonAction, 'click', () => {
          const finalRoll = Math.floor(Math.random() * C.validation.DICE_FACES) + 1;
          UI.Interactions.animateDiceRoll(elements.resultInput, elements.rollButtonAction, finalRoll);
        });

        // Generate Action Roll button
        const generateActionHandler = () => {
          let errors = [];
          let fieldsToHighlight = [];
          const dialogueDesc = elements.dialogueInput.value.trim();
          const actionDescRaw = elements.actionDescInput.value.trim();

          // Validate that either dialogue or action description is provided
          if (S.currentMode !== 'simple' && !dialogueDesc && !actionDescRaw) {
            errors.push("Dialogue or Action description is required.");
            fieldsToHighlight.push(elements.dialogueInput, elements.actionDescInput);
          } else if (S.currentMode === 'simple' && !actionDescRaw) {
              errors.push("Action description is required.");
              fieldsToHighlight.push(elements.actionDescInput);
          }


          // Auto-roll if result is empty
          if (elements.resultInput.value.trim() === '') {
            elements.resultInput.value = Math.floor(Math.random() * C.validation.DICE_FACES) + 1;
          }

          // Validate raw roll input
          const rollValidation = ErrorHandler.validateInput(elements.resultInput.value, 'rollValue', { min: C.validation.MIN_ROLL, max: C.validation.MAX_ROLL });
          if (!rollValidation.isValid) {
            errors.push(...rollValidation.errors);
            fieldsToHighlight.push(elements.resultInput);
          }

          // If errors, display them and stop
          if (errors.length > 0) {
            UI.Interactions.displayActionError(errors.join(' '), fieldsToHighlight);
            elements.actionOutputArea.value = ''; // Clear output
            elements.copyActionButton.style.display = 'none';
            elements.sendActionButton.style.display = 'none';
            return;
          }

          // Clear previous errors if any
          if (elements.errorDisplay) elements.errorDisplay.style.display = 'none';
          document.querySelectorAll(`.${C.classNames.INPUT_ERROR}`).forEach(el => el.classList.remove(C.classNames.INPUT_ERROR));

          // Gather values for calculation
          const skill = elements.skillInput.value.trim().toUpperCase() || 'DICE'; // Default changed to DICE
          let rawDieRoll = parseInt(elements.resultInput.value, 10);
          const difficultyModifier = parseInt(elements.modifierSlider.value, 10);
          const selectedScaleKey = (S.currentMode === 'simple') ? 'main' : elements.scaleSelect.value;
          const stakesValue = parseInt(elements.stakesSlider.value, 10);
          const isPushingLimits = elements.pushCheck.checked;
          const isGuarded = elements.guardCheck.checked;

          // Calculate result
          let resultAfterDifficulty = rawDieRoll + difficultyModifier;
          let resultBeforeStakes = resultAfterDifficulty;

          // Apply Guarded Approach: adjust result before stakes, only if it's an extreme roll
          if (isGuarded) {
            if (resultAfterDifficulty <= C.validation.MIN_ROLL) { // Handle modified rolls that go to 1 or less
                resultBeforeStakes = C.validation.MIN_ROLL + 1;
            } else if (resultAfterDifficulty >= C.validation.MAX_ROLL) { // Handle modified rolls that go to 10 or more
                resultBeforeStakes = C.validation.MAX_ROLL - 1;
            }
          }

          let finalResult = resultBeforeStakes; // Start with the (potentially) guarded result

          // Apply Stakes: based on the raw d10 roll
          if (stakesValue !== 0) {
            if (rawDieRoll < 5) { // Check rawDieRoll, not modified roll
              finalResult = resultBeforeStakes - stakesValue;
            } else { // rawDieRoll >= 5
              finalResult = resultBeforeStakes + stakesValue;
            }
          }

          // Clamp final result to be within 1-10 range
          finalResult = Math.max(C.validation.MIN_ROLL, Math.min(C.validation.MAX_ROLL, finalResult));

          const outcomeDesc = C.getScaleOutcome(selectedScaleKey, finalResult, isPushingLimits);

          // Format output string
          let outputString = "";
          if (S.currentMode !== 'simple' && dialogueDesc) {
            outputString += (dialogueDesc.startsWith('"') && dialogueDesc.endsWith('"')) ? `${dialogueDesc}\n` : `"${dialogueDesc}"\n`;
          }
          if (actionDescRaw) {
            outputString += (actionDescRaw.startsWith('*') && actionDescRaw.endsWith('*')) ? `${actionDescRaw}\n` : `*${actionDescRaw.replace(/^\*|\*$/g, '')}*\n`;
          }
          outputString += `**${skill} ROLL**\n*${finalResult}/${C.validation.DICE_FACES} - ${outcomeDesc}*`;

          elements.actionOutputArea.value = outputString.trim();
          elements.copyActionButton.style.display = 'inline-flex';
          elements.sendActionButton.style.display = 'inline-flex';
        };
        UI.EventManager.addListener(elements.generateActionButton, 'click', ErrorHandler.withErrorBoundary(generateActionHandler, null, 'GenerateActionRoll'));

        // Copy and Send button listeners
        UI.EventManager.addListener(elements.copyActionButton, 'click', () => UI.Interactions.handleCopy(elements.actionOutputArea.value, elements.copyActionButton));
        UI.EventManager.addListener(elements.sendActionButton, 'click', () => UI.Interactions.handleSend(elements.actionOutputArea.value));
      },
      // Switches the displayed screen in the main content area.
      switchScreen: (screenId) => {
        const S = window.CRO_State;
        const C = window.CRO_Config;
        const UI = window.CRO_UI;
        const screenData = C.screens.find(s => s.id === screenId);

        if (!screenData || !S.mainContentArea) {
          console.error(`[CRO Helper] Screen data or main content area not found for ID: ${screenId}`);
          return;
        }

        S.activeScreenId = screenId;

        // Update toolbar button active states and icons
        if (S.toolbar) {
          S.toolbar.querySelectorAll(`.${C.classNames.TOOLBAR_BUTTON}`).forEach(btn => {
            const isActive = btn.dataset.screenId === screenId;
            btn.classList.toggle('active', isActive);
            const btnScreenData = C.screens.find(s => s.id === btn.dataset.screenId);
            if (btnScreenData) btn.innerHTML = btnScreenData.iconSVG(isActive); // Update icon based on active state
          });
        }

        S.mainContentArea.innerHTML = ''; // Clear previous screen content
        screenData.renderFunc(S.mainContentArea); // Call the screen's render function
        UI.applyUIMode(); // Apply the correct mode class after rendering
      },
      // Renders the Action Roller screen.
      renderActionRollerScreen: (targetContainer) => {
        const Screens = window.CRO_UI.Screens;
        const contentDiv = Screens._createScreenContainer(targetContainer, 'Action Roll', 'Generate a formatted roll for character actions based on skill, difficulty, and optional modifiers like Stakes or Pushing Limits.');
        const elements = {}; // To store references to created input elements
        const skillDatalistId = `cro-helper-skill-list-${Date.now()}`; // Unique ID for datalist

        Screens._addPrimaryInputFields(contentDiv, elements, skillDatalistId);
        Screens._addRollAndScaleControls(contentDiv, elements);
        Screens._addOutputAreaAndActions(contentDiv, elements);
        Screens._addActionModifiers(contentDiv, elements); // Add Stakes, Push Limits, Guarded Approach
        Screens._bindActionRollerEvents(elements); // Attach event listeners
      },
      // Renders a generic screen for simple dice rolls (Inventory, Perception).
      renderSimpleRollScreen: (targetContainer, config) => {
        const C = window.CRO_Config;
        const UI = window.CRO_UI;
        targetContainer.innerHTML = ''; // Clear previous content

        const contentDiv = UI.Screens._createScreenContainer(targetContainer, config.title, config.description);
        const outputId = `cro-helper-output-${config.id}`;

        const outputSection = document.createElement('div');
        // Structure for button, output area, and copy/send buttons
        outputSection.innerHTML = `
          <button class="${C.classNames.BUTTON}" id="cro-roll-${config.id}-btn" style="align-self: center;">${config.buttonText}</button>
          <div class="${C.classNames.OUTPUT_CONTAINER}" style="margin-top: 15px;">
            <textarea id="${outputId}" class="${C.classNames.OUTPUT_AREA}" readonly rows="3"></textarea>
            <div class="${C.classNames.OUTPUT_BUTTONS_GROUP}">
              <button id="cro-copy-${config.id}-btn" class="${C.classNames.COPY_BUTTON}" style="display: none;" title="Copy ${config.title} Text">${C.copyIconSVG()}</button>
              <button id="cro-send-${config.id}-btn" class="${C.classNames.SEND_BUTTON}" style="display: none;" title="Send ${config.title} to Chat">${C.sendIconSVG()}</button>
            </div>
          </div>
        `;
        contentDiv.appendChild(outputSection);

        // Get references to the newly created elements
        const rollButton = contentDiv.querySelector(`#cro-roll-${config.id}-btn`);
        const outputArea = contentDiv.querySelector(`#${outputId}`);
        const copyButton = contentDiv.querySelector(`#cro-copy-${config.id}-btn`);
        const sendButton = contentDiv.querySelector(`#cro-send-${config.id}-btn`);

        // Add event listener for the roll button
        UI.EventManager.addListener(rollButton, 'click', () => {
          const rollResult = Math.floor(Math.random() * C.validation.DICE_FACES) + 1;
          outputArea.value = config.generateOutput(rollResult);
          copyButton.style.display = 'inline-flex'; // Show copy/send buttons
          sendButton.style.display = 'inline-flex';
        });
        // Add event listeners for copy and send buttons
        UI.EventManager.addListener(copyButton, 'click', () => UI.Interactions.handleCopy(outputArea.value, copyButton));
        UI.EventManager.addListener(sendButton, 'click', () => UI.Interactions.handleSend(outputArea.value));
      },
      // Renders the Inventory Check screen.
      renderInventoryCheckScreen: (targetContainer) => {
        window.CRO_UI.Screens.renderSimpleRollScreen(targetContainer, {
          id: 'inventory',
          title: 'Inventory Check',
          description: 'Roll a d10 to see what mundane or useful items your character finds on their person (pockets, bag, etc.) without searching for something specific.',
          buttonText: 'Roll Inventory Check',
          generateOutput: (rollResult) => {
            const C = window.CRO_Config;
            const findDesc = C.inventoryFindScale.outcomes[rollResult] || `Unknown find (${rollResult})`;
            return `**INVENTORY CHECK**\n*${rollResult}/${C.validation.DICE_FACES} - ${findDesc}*`;
          }
        });
      },
      // Renders the Perception Check screen.
      renderPerceptionCheckScreen: (targetContainer) => {
        window.CRO_UI.Screens.renderSimpleRollScreen(targetContainer, {
          id: 'perception',
          title: 'Perception Check',
          description: 'Roll a d10 to determine what your character notices or senses in their environment or about others.',
          buttonText: 'Roll Perception',
          generateOutput: (rollResult) => {
            const C = window.CRO_Config;
            const perceptionDescription = C.getScaleOutcome('perception', rollResult); // Uses the main getScaleOutcome
            return `**PERCEPTION ROLL**\n*${rollResult}/${C.validation.DICE_FACES} - ${perceptionDescription}*`;
          }
        });
      },
      // Renders the Settings screen.
      renderSettingsScreen: (targetContainer) => {
        const C = window.CRO_Config;
        const S = window.CRO_State;
        const UI = window.CRO_UI;
        const Persist = window.CRO_Persistence;
        const contentDiv = UI.Screens._createScreenContainer(targetContainer, 'Settings');

        // UI Mode Selection Section
        const modeSection = document.createElement('div');
        modeSection.classList.add('cro-settings-section');
        const modeTitle = document.createElement('h6');
        modeTitle.textContent = 'Mode';
        modeTitle.classList.add(C.classNames.SCREEN_SUBHEADING);
        modeSection.appendChild(modeTitle);

        const modeButtonsContainer = document.createElement('div');
        modeButtonsContainer.classList.add('cro-theme-buttons-container');
        ['Simple', 'Advanced', 'Expert'].forEach(mode => {
            const button = document.createElement('button');
            button.textContent = mode;
            button.classList.add(C.classNames.THEME_BUTTON);
            const modeValue = mode.toLowerCase();
            button.dataset.modeName = modeValue;
            button.classList.toggle('active', modeValue === S.currentMode);

            UI.EventManager.addListener(button, 'click', () => {
                S.currentMode = modeValue;
                Persist.saveModeSetting(S.currentMode);
                UI.applyUIMode();
                // Update active class on all mode buttons
                modeButtonsContainer.querySelectorAll(`.${C.classNames.THEME_BUTTON}`).forEach(btn => {
                    btn.classList.toggle('active', btn.dataset.modeName === S.currentMode);
                });
            });
            modeButtonsContainer.appendChild(button);
        });
        modeSection.appendChild(modeButtonsContainer);
        contentDiv.appendChild(modeSection);

        // Theme selection section
        const themeSection = document.createElement('div');
        themeSection.classList.add('cro-settings-section');
        const themeTitle = document.createElement('h6');
        themeTitle.textContent = 'Theme';
        themeTitle.classList.add(C.classNames.SCREEN_SUBHEADING);
        themeSection.appendChild(themeTitle);

        const themeButtonsContainer = document.createElement('div');
        themeButtonsContainer.classList.add('cro-theme-buttons-container');
        themeButtonsContainer.title = 'Select a visual theme for the helper popover.';

        Object.keys(C.themes).forEach(themeName => {
          const button = document.createElement('button');
          button.textContent = themeName;
          button.classList.add(C.classNames.THEME_BUTTON);
          button.dataset.themeName = themeName;
          button.title = `Apply ${themeName} theme.`;
          button.classList.toggle('active', themeName === S.currentThemeName); // Set active state
          UI.EventManager.addListener(button, 'click', () => {
            window.CRO_ThemeManager.applyAndSaveTheme(themeName);
            // Update active class on all theme buttons
            themeButtonsContainer.querySelectorAll(`.${C.classNames.THEME_BUTTON}`).forEach(btn => {
              btn.classList.toggle('active', btn.dataset.themeName === themeName);
            });
          });
          themeButtonsContainer.appendChild(button);
        });
        themeSection.appendChild(themeButtonsContainer);
        contentDiv.appendChild(themeSection);
      }
    },
    Interactions: {
      // Handles copying text to the clipboard.
      handleCopy: (textToCopy, buttonElement) => {
        if (!textToCopy || !buttonElement || buttonElement.disabled) return;
        try {
          GM_setClipboard(textToCopy);
          buttonElement.classList.add('flash-success');
          buttonElement.disabled = true;
          setTimeout(() => {
            buttonElement.classList.remove('flash-success');
            buttonElement.disabled = false;
          }, 800);
        } catch (err) {
          console.error('[CRO Helper] Failed to copy text: ', err);
          const originalHTML = buttonElement.innerHTML;
          buttonElement.innerHTML = 'Error!';
          buttonElement.disabled = true;
          setTimeout(() => {
            buttonElement.innerHTML = window.CRO_Config.copyIconSVG(); // Restore original icon
            buttonElement.disabled = false;
          }, 2000);
        }
      },
      // Handles sending text to the main chat input of the page.
      handleSend: (textToSend) => {
        const mainInput = window.CRO_ElementCache.getChatInput();
        if (!mainInput || !textToSend) {
          console.warn("[CRO Helper] Chat input not found or text empty.");
          return;
        }
        // Use native setter to ensure framework reactivity if applicable
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
        nativeInputValueSetter.call(mainInput, textToSend);
        // Dispatch events to simulate user input
        const inputEvent = new Event('input', { bubbles: true });
        const changeEvent = new Event('change', { bubbles: true });
        mainInput.dispatchEvent(inputEvent);
        mainInput.dispatchEvent(changeEvent);
        mainInput.focus(); // Focus the input after sending
      },
      // Animates the dice roll input field.
      animateDiceRoll: (inputElement, buttonElement, finalRollValue) => {
        const C = window.CRO_Config;
        const S = window.CRO_State;
        if (!inputElement || !buttonElement) return;

        // Clear any existing animation for this element
        if (S.animationFrameIds.has(inputElement)) {
          cancelAnimationFrame(S.animationFrameIds.get(inputElement));
          S.animationFrameIds.delete(inputElement);
        }

        buttonElement.disabled = true; // Disable button during animation
        inputElement.classList.add(C.classNames.DICE_ROLLING); // Add animation class

        const duration = C.animation.DICE_ANIMATION_DURATION;
        const startTime = Date.now();

        const animate = window.CRO_ErrorHandler.withErrorBoundary(() => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeOutProgress = 1 - Math.pow(1 - progress, 3); // Ease-out cubic

          // Show random numbers for most of the animation
          if (progress < 0.85) { // Show random numbers for 85% of the duration
            if (Math.random() > easeOutProgress * 0.5) { // Randomly update to make it feel more dynamic
              inputElement.value = Math.floor(Math.random() * C.validation.DICE_FACES) + 1;
            }
          } else {
            // Set the final roll value towards the end
            inputElement.value = finalRollValue;
          }

          if (progress < 1) {
            const animId = requestAnimationFrame(animate);
            S.animationFrameIds.set(inputElement, animId);
          } else {
            // Animation complete
            inputElement.value = finalRollValue;
            inputElement.classList.remove(C.classNames.DICE_ROLLING);
            buttonElement.disabled = false;
            S.animationFrameIds.delete(inputElement);
          }
        }, null, 'DiceRollAnimation');

        const initialAnimId = requestAnimationFrame(animate);
        S.animationFrameIds.set(inputElement, initialAnimId);
      },
      // Displays an error message related to action generation.
      displayActionError: (message, fieldsToHighlight = []) => {
        const C = window.CRO_Config;
        const S = window.CRO_State;
        const errorDisplay = document.getElementById(C.ids.ACTION_ERROR_MESSAGE);
        if (!errorDisplay) {
          console.error("[CRO Helper] Error display element not found.");
          return;
        }
        errorDisplay.textContent = message;
        errorDisplay.style.display = 'block';

        // Highlight erroneous input fields
        fieldsToHighlight.forEach(field => {
          if (field) {
            field.classList.add(C.classNames.INPUT_ERROR);
            // Remove error highlight on focus or input
            const clearErrorOnFocus = () => {
              field.classList.remove(C.classNames.INPUT_ERROR);
              field.removeEventListener('focus', clearErrorOnFocus);
              field.removeEventListener('input', clearErrorOnInput);
              // Hide general error message if no other fields are highlighted
              if (!document.querySelector(`.${C.classNames.INPUT_ERROR}`)) {
                errorDisplay.style.display = 'none';
              }
            };
            const clearErrorOnInput = clearErrorOnFocus; // Same logic for input
            field.addEventListener('focus', clearErrorOnFocus);
            field.addEventListener('input', clearErrorOnInput);
          }
        });

        // Auto-hide error message after a duration
        clearTimeout(S.errorTimeout);
        S.errorTimeout = setTimeout(() => {
          errorDisplay.style.display = 'none';
          fieldsToHighlight.forEach(field => field?.classList.remove(C.classNames.INPUT_ERROR));
        }, C.ERROR_MESSAGE_DURATION);
      }
    },
    // Adds all core event listeners for UI interactions (drag, resize, clicks).
    addEventListeners: () => {
      const S = window.CRO_State;
      const C = window.CRO_Config;
      const UI = window.CRO_UI;
      const Persist = window.CRO_Persistence;

      if (!S.triggerButton || !S.helperContainer || !S.closeButton ||
          !S.resizeHandleTL || !S.resizeHandleTR || !S.resizeHandleTop || !S.toolbar) {
        console.error("[CRO Helper] Cannot add listeners, crucial elements missing.");
        return;
      }

      // Toggle popover visibility on trigger button click (if not dragged)
      UI.EventManager.addListener(S.triggerButton, 'click', (e) => {
        if (e.detail === 1 && !S.didDragTrigger) { // Only toggle on single click, not after drag
          S.isHelperVisible = !S.isHelperVisible;
          S.helperContainer.classList.toggle(C.classNames.HIDDEN, !S.isHelperVisible);
          S.helperContainer.classList.toggle(C.classNames.VISIBLE, S.isHelperVisible);
          if (S.isHelperVisible && S.activeScreenId === 'cro_generator') {
            const firstInput = S.helperContainer.querySelector('#cro-helper-dialogue');
            if (firstInput) firstInput.focus();
          }
        }
        S.didDragTrigger = false; // Reset drag flag
      });

      // Close popover
      UI.EventManager.addListener(S.closeButton, 'click', () => {
        S.isHelperVisible = false;
        S.helperContainer.classList.add(C.classNames.HIDDEN);
        S.helperContainer.classList.remove(C.classNames.VISIBLE);
      });

      // Drag trigger button
      UI.EventManager.addListener(S.triggerButton, 'mousedown', (e) => {
        if (e.button !== 0) return; // Only left-click
        S.isDraggingTrigger = true;
        S.didDragTrigger = false; // Reset before potential drag
        S.dragOffsetX = e.clientX - S.triggerButton.offsetLeft;
        document.body.classList.add(C.classNames.DRAGGING_BODY);
        S.triggerButton.style.transition = 'none'; // Disable transitions during drag
        S.helperContainer.style.transition = 'none';
        e.preventDefault();
      });

      // Resize popover using handles
      [S.resizeHandleTL, S.resizeHandleTR, S.resizeHandleTop].forEach(handle => {
        UI.EventManager.addListener(handle, 'mousedown', (e) => {
          if (e.button !== 0) return;
          S.activeResizeHandle = handle.id;
          S.startX = e.clientX; S.startY = e.clientY;
          S.startWidth = S.helperContainer.offsetWidth;
          S.startHeight = S.helperContainer.offsetHeight;
          S.startLeft = S.helperContainer.offsetLeft;
          document.body.classList.add(C.classNames.RESIZING_BODY);
          S.helperContainer.style.transition = 'none';
          e.preventDefault();
          e.stopPropagation(); // Prevent header drag
        });
      });

      // Mousemove for dragging and resizing
      UI.EventManager.addListener(document, 'mousemove', (e) => {
        const bottomOffsetPx = window.CRO_Utils.getPopoverBottomPx();
        const maxH = Math.max(C.minPopoverHeight, window.innerHeight - bottomOffsetPx - 20); // Min 20px from top

        if (S.isDraggingTrigger) {
          S.didDragTrigger = true; // Mark that a drag occurred
          let newLeft = e.clientX - S.dragOffsetX;
          const currentWidth = S.helperContainer.offsetWidth; // Use popover width for boundary calc
          const maxLeft = window.innerWidth - currentWidth - 5; // 5px padding from right edge
          newLeft = Math.max(5, Math.min(newLeft, maxLeft)); // 5px padding from left edge
          S.triggerButton.style.left = `${newLeft}px`;
          S.helperContainer.style.left = `${newLeft}px`; // Keep popover aligned with trigger
        } else if (S.activeResizeHandle) {
          const deltaX = e.clientX - S.startX;
          const deltaY = e.clientY - S.startY;
          let newWidth = S.startWidth;
          let newHeight = S.startHeight;
          let newLeft = S.startLeft;

          if (S.activeResizeHandle === C.ids.RESIZE_TR) { // Top-right handle
            newWidth = Math.max(C.minPopoverWidth, S.startWidth + deltaX);
            newHeight = Math.max(C.minPopoverHeight, Math.min(S.startHeight - deltaY, maxH));
          } else if (S.activeResizeHandle === C.ids.RESIZE_TL) { // Top-left handle
            newWidth = S.startWidth - deltaX;
            newHeight = Math.max(C.minPopoverHeight, Math.min(S.startHeight - deltaY, maxH));
            newLeft = S.startLeft + deltaX; // Adjust left position
            if (newWidth < C.minPopoverWidth) { // Prevent shrinking beyond min width from left
              newLeft = S.startLeft + (S.startWidth - C.minPopoverWidth);
              newWidth = C.minPopoverWidth;
            }
          } else if (S.activeResizeHandle === C.ids.RESIZE_TOP) { // Top edge handle
            newHeight = Math.max(C.minPopoverHeight, Math.min(S.startHeight - deltaY, maxH));
          }

          // Constrain left position if resizing from left
          newLeft = Math.max(5, Math.min(newLeft, window.innerWidth - newWidth - 5));
          if (newLeft !== S.startLeft && (S.activeResizeHandle === C.ids.RESIZE_TL )) {
             S.helperContainer.style.left = `${newLeft}px`;
             S.triggerButton.style.left = `${newLeft}px`; // Keep trigger aligned
          }
          S.helperContainer.style.width = `${newWidth}px`;
          S.helperContainer.style.height = `${newHeight}px`;
        }
      });

      // Mouseup to end drag/resize
      UI.EventManager.addListener(document, 'mouseup', () => {
        let stateChanged = false;
        if (S.isDraggingTrigger || S.activeResizeHandle) {
          stateChanged = true;
        }
        S.isDraggingTrigger = false;
        S.activeResizeHandle = null;
        document.body.classList.remove(C.classNames.DRAGGING_BODY, C.classNames.RESIZING_BODY);
        S.triggerButton.style.transition = ''; // Restore transitions
        S.helperContainer.style.transition = '';
        if (stateChanged) {
          Persist.savePositionAndSize(
            S.helperContainer.offsetLeft,
            S.helperContainer.offsetWidth,
            S.helperContainer.offsetHeight
          );
        }
      });

      // Toolbar scroll for screen switching
      UI.EventManager.addListener(S.toolbar, 'wheel', UI.Toolbar.handleWheelScroll, { passive: false });
    }
  };

  // --- MODULE: CRO_App ---
  // Main application module to initialize and manage the script.
  window.CRO_App = {
    // Initializes the screen configurations.
    initScreensConfig: () => {
      const C = window.CRO_Config;
      // Defines the available screens, their labels, icons, and rendering functions.
      C.screens = [
        { id: 'cro_generator',    label: 'Action',     iconSVG: (isActive) => C.diceIconSVG(20, isActive ? C.getActiveIconColor() : C.getIconColor()),       renderFunc: window.CRO_UI.Screens.renderActionRollerScreen },
        { id: 'inventory_check',  label: 'Inventory',  iconSVG: (isActive) => C.inventoryIconSVG(20, isActive ? C.getActiveIconColor() : C.getIconColor()),  renderFunc: window.CRO_UI.Screens.renderInventoryCheckScreen },
        { id: 'perception_check', label: 'Perception', iconSVG: (isActive) => C.perceptionIconSVG(20, isActive ? C.getActiveIconColor() : C.getIconColor()),renderFunc: window.CRO_UI.Screens.renderPerceptionCheckScreen },
        { id: 'settings_screen',  label: 'Settings',   iconSVG: (isActive) => C.settingsIconSVG(20, isActive ? C.getActiveIconColor() : C.getIconColor()),    renderFunc: window.CRO_UI.Screens.renderSettingsScreen }
      ];
    },
    // Initializes the entire CRO Helper script.
    initialize: () => {
      const C = window.CRO_Config;
      const S = window.CRO_State;
      const App = window.CRO_App;
      const Persist = window.CRO_Persistence;
      const UI = window.CRO_UI;
      const ThemeMan = window.CRO_ThemeManager;

      console.log(`[CRO Helper] Initializing v${GM_info.script.version} for site: ${window.CRO_Utils.getCurrentSiteKey()}`);
      // Prevent multiple initializations.
      if (document.getElementById(C.ids.HELPER_CONTAINER)) {
        console.log('[CRO Helper] Already initialized.');
        return;
      }

      App.initScreensConfig();        // Define screen structures.
      Persist.loadPersistentState();  // Load all settings (pos, size, theme, mode).
      UI.createElements();            // Create main DOM elements.
      ThemeMan.updateGlobalStyles();  // Apply loaded theme to fresh elements.
      UI.injectStyles();              // Inject all CSS.
      // Position is already set by loadPersistentState, which is now called earlier
      UI.addEventListeners();         // Add core event listeners.
      UI.applyUIMode();               // Apply the loaded UI mode.

      // Ensure a valid screen is active.
      if (!C.screens.find(s => s.id === S.activeScreenId)) {
        S.activeScreenId = C.screens[0]?.id || null; // Default to first screen.
      }
      if (S.activeScreenId) {
        UI.Screens.switchScreen(S.activeScreenId);
      }
      console.log('[CRO Helper] Initialized.');
    }
  };

    // --- Script Execution Start ---
    // This section orchestrates the initialization and visibility of the CRO Helper.

    let croHelperMainObserver = null;
    let croHelperLastPathname = window.location.pathname;
    let croHelperInitializedOnce = false; // Tracks if CRO_App.initialize() has been called at least once

    // Function to check if the current page is a chat page.
    function isChatPage() {
        const path = window.location.pathname;
        // Universal check for all supported sites:
        // - Spicychat & C.ai use '/chat'
        // - Janitor.ai uses '/chats/' or '/characters/'
        return path.includes('/chat') || path.includes('/chats/') || path.includes('/characters/');
    }

    // Function to show the CRO Helper UI elements that should always be visible on a chat page.
    function showCroHelperBaseUI() {
        const S = window.CRO_State;
        if (S.triggerButton) {
            S.triggerButton.style.display = 'flex'; // Or its original display style from CSS
        }
        // The main popover's visibility (S.isHelperVisible) is managed by user interaction.
        // We just ensure the trigger is available.
    }

    // Function to hide all CRO Helper UI elements.
    function hideCroHelperFullUI() {
        const S = window.CRO_State;
        const C = window.CRO_Config;
        if (S.triggerButton) {
            S.triggerButton.style.display = 'none';
        }
        if (S.helperContainer) {
            S.helperContainer.classList.add(C.classNames.HIDDEN);
            S.helperContainer.classList.remove(C.classNames.VISIBLE);
            S.isHelperVisible = false; // Reset popover visibility state
        }
    }

    // Main logic to run on DOM changes or SPA navigation.
    function manageCroHelperVisibilityAndInitialization() {
        if (isChatPage()) {
            // We are on a chat page.
            if (!croHelperInitializedOnce) {
                // Attempt to initialize only if not done before.
                let chatInput = window.CRO_ElementCache.getChatInput();
                if (chatInput) {
                    console.log(`[CRO Helper] Chat page + input found for ${window.CRO_Utils.getCurrentSiteKey()}. Running main initialization.`);
                    window.CRO_App.initialize();
                    croHelperInitializedOnce = true; // Mark that initialization has run.
                    showCroHelperBaseUI(); // Ensure trigger is visible after init.
                } else {
                    // console.log("[CRO Helper] On chat page, but chat input not found yet. Observer will retry.");
                }
            } else {
                // Already initialized, just ensure the base UI (trigger button) is visible.
                showCroHelperBaseUI();
            }
        } else {
            // Not on a chat page. If UI was initialized, hide it.
            if (croHelperInitializedOnce) {
                // console.log("[CRO Helper] Not on a chat page. Hiding UI.");
                hideCroHelperFullUI();
            }
        }
    }

    // Setup the main MutationObserver.
    function setupMainCroObserver() {
        if (croHelperMainObserver) {
            return; // Already set up
        }

        croHelperMainObserver = new MutationObserver(window.CRO_ErrorHandler.withErrorBoundary(() => {
            if (window.location.pathname !== croHelperLastPathname) {
                // console.log(`[CRO Helper] Pathname changed from ${croHelperLastPathname} to ${window.location.pathname}. Re-evaluating UI.`);
                croHelperLastPathname = window.location.pathname;
                window.CRO_ElementCache.invalidate(); // Important on navigation
            }
            manageCroHelperVisibilityAndInitialization();
        }, null, "MainCroObserverCallback"));

        const appRoot = document.getElementById('root') || document.body;
        croHelperMainObserver.observe(appRoot, {
            childList: true,
            subtree: true
        });
        console.log("[CRO Helper] Main observer started to manage UI visibility and initialization.");
    }


    // Initial execution logic when the script loads.
    function initialScriptLoadExecution() {
        console.log("[CRO Helper] Script loaded. Performing initial check.");
        manageCroHelperVisibilityAndInitialization(); // Attempt to init/show/hide based on current URL

        // If not initialized and on a chat page, the observer will catch it when elements appear.
        // If not initialized and not on a chat page, the observer will catch navigation to a chat page.
        // If already initialized (e.g. direct load to chat page), the UI will be shown.
        setupMainCroObserver(); // Ensure observer is always running after first load.
    }

    // Delay initial execution slightly to allow the SPA to settle a bit,
    // especially after `document-idle`.
    if (document.readyState === 'complete') {
        setTimeout(initialScriptLoadExecution, 200); // Short delay if page already complete
    } else {
        window.addEventListener('load', () => {
            setTimeout(initialScriptLoadExecution, 200); // Short delay after window load
        });
    }

})();