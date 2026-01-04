// ==UserScript==
// @name          Boostcamp to Liftosaur Converter
// @namespace     http://tampermonkey.net/
// @version       1
// @description   Converts Boostcamp workout programs to a Liftosaur script, compatible with both desktop and mobile layouts, combines sets for similar exercises, handles linear progression, and allows interactive mapping of unmatched exercise names.
// @author        Drigtime
// @icon          https://www.google.com/s2/favicons?sz=64&domain=boostcamp.app
// @license       MIT
// @match         https://www.boostcamp.app/coaches/*/*
// @match         https://www.boostcamp.app/users/*
// @grant         GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/537618/Boostcamp%20to%20Liftosaur%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/537618/Boostcamp%20to%20Liftosaur%20Converter.meta.js
// ==/UserScript==

(function () {
    'use strict';    

    // --- Liftosaur Exercise List ---
    // This array contains the official Liftosaur exercise names to which Boostcamp names will be mapped.
    const LIFTOSAUR_EXERCISES = [
        "Ab Wheel, Bodyweight",
        "Arnold Press, Dumbbell",
        "Arnold Press, Kettlebell",
        "Around The World, Dumbbell",
        "Back Extension, Bodyweight",
        "Back Extension, Leverage Machine",
        "Ball Slams, Medicine Ball",
        "Battle Ropes, Bodyweight",
        "Behind The Neck Press, Barbell",
        "Behind The Neck Press, Smith Machine",
        "Behind The Neck Press, Band",
        "Bench Dip, Bodyweight",
        "Bench Press, Barbell",
        "Bench Press, Cable",
        "Bench Press, Dumbbell",
        "Bench Press, Smith Machine",
        "Bench Press, Band",
        "Bench Press, Kettlebell",
        "Bench Press Close Grip, Barbell",
        "Bench Press Close Grip, Smith Machine",
        "Bench Press Close Grip, EZ Bar",
        "Bench Press Wide Grip, Barbell",
        "Bench Press Wide Grip, Smith Machine",
        "Bent Over One Arm Row, Dumbbell",
        "Bent Over Row, Barbell",
        "Bent Over Row, Cable",
        "Bent Over Row, Dumbbell",
        "Bent Over Row, Smith Machine",
        "Bent Over Row, Band",
        "Bent Over Row, Leverage Machine",
        "Bicep Curl, Barbell",
        "Bicep Curl, Cable",
        "Bicep Curl, Dumbbell",
        "Bicep Curl, Band",
        "Bicep Curl, Leverage Machine",
        "Bicep Curl, EZ Bar",
        "Bicycle Crunch, Bodyweight",
        "Box Squat, Barbell",
        "Box Squat, Dumbbell",
        "Bulgarian Split Squat, Dumbbell",
        "Cable Crossover, Cable",
        "Cable Crunch, Cable",
        "Cable Kickback, Cable",
        "Cable Pull Through, Cable",
        "Cable Twist, Barbell",
        "Cable Twist, Cable",
        "Cable Twist, Band",
        "Cable Twist, Bodyweight",
        "Cable Twist, Leverage Machine",
        "Calf Press on Leg Press, Leverage Machine",
        "Calf Press on Seated Leg Press, Leverage Machine",
        "Chest Dip, Bodyweight",
        "Chest Fly, Barbell",
        "Chest Fly, Cable",
        "Chest Fly, Dumbbell",
        "Chest Fly, Leverage Machine",
        "Chest Press, Band",
        "Chest Press, Leverage Machine",
        "Chin Up, Bodyweight",
        "Chin Up, Leverage Machine",
        "Clean, Barbell",
        "Clean and Jerk, Barbell",
        "Concentration Curl, Barbell",
        "Concentration Curl, Cable",
        "Concentration Curl, Dumbbell",
        "Concentration Curl, Band",
        "Cross Body Crunch, Bodyweight",
        "Crunch, Cable",
        "Crunch, Bodyweight",
        "Crunch, Leverage Machine",
        "Deadlift, Barbell",
        "Deadlift, Cable",
        "Deadlift, Dumbbell",
        "Deadlift, Smith Machine",
        "Deadlift, Band",
        "Deadlift, Kettlebell",
        "Deadlift, Leverage Machine",
        "Deadlift High Pull, Barbell",
        "Decline Bench Press, Dumbbell",
        "Decline Bench Press, Smith Machine",
        "Deficit Deadlift, Barbell",
        "Deficit Deadlift, Trap Bar",
        "Elliptical Machine, Leverage Machine",
        "Face Pull, Band",
        "Flat Knee Raise, Bodyweight",
        "Flat Leg Raise, Bodyweight",
        "Front Raise, Barbell",
        "Front Raise, Cable",
        "Front Raise, Dumbbell",
        "Front Raise, Band",
        "Front Raise, Bodyweight",
        "Front Squat, Barbell",
        "Front Squat, Cable",
        "Front Squat, Dumbbell",
        "Front Squat, Smith Machine",
        "Front Squat, Kettlebell",
        "Glute Bridge, Barbell",
        "Glute Bridge, Dumbbell",
        "Glute Bridge, Band",
        "Glute Bridge March, Bodyweight",
        "Glute Kickback, Cable",
        "Glute Kickback, Band",
        "Goblet Squat, Dumbbell",
        "Goblet Squat, Kettlebell",
        "Good Morning, Barbell",
        "Good Morning, Smith Machine",
        "Good Morning, Leverage Machine",
        "Hack Squat, Barbell",
        "Hack Squat, Smith Machine",
        "Hammer Curl, Cable",
        "Hammer Curl, Dumbbell",
        "Hammer Curl, Band",
        "Handstand Push Up, Bodyweight",
        "Hang Clean, Kettlebell",
        "Hanging Leg Raise, Cable",
        "Hanging Leg Raise, Bodyweight",
        "High Row, Cable",
        "High Row, Leverage Machine",
        "Hip Abductor, Cable",
        "Hip Abductor, Band",
        "Hip Abductor, Bodyweight",
        "Hip Abductor, Leverage Machine",
        "Hip Adductor, Leverage Machine",
        "Hip Thrust, Barbell",
        "Hip Thrust, Band",
        "Hip Thrust, Bodyweight",
        "Hip Thrust, Leverage Machine",
        "Incline Bench Press, Barbell",
        "Incline Bench Press, Cable",
        "Incline Bench Press, Dumbbell",
        "Incline Bench Press, Smith Machine",
        "Incline Bench Press Wide Grip, Barbell",
        "Incline Chest Fly, Cable",
        "Incline Chest Fly, Dumbbell",
        "Incline Chest Press, Dumbbell",
        "Incline Chest Press, Band",
        "Incline Chest Press, Leverage Machine",
        "Incline Curl, Dumbbell",
        "Incline Row, Barbell",
        "Incline Row, Dumbbell",
        "Inverted Row, Bodyweight",
        "Jackknife Sit Up, Bodyweight",
        "Jump Squat, Barbell",
        "Jump Squat, Bodyweight",
        "Kettlebell Swing, Dumbbell",
        "Kettlebell Swing, Kettlebell",
        "Kneeling Pulldown, Band",
        "Knees to Elbows, Bodyweight",
        "Lat Pulldown, Cable",
        "Lat Pulldown, Leverage Machine",
        "Lateral Raise, Cable",
        "Lateral Raise, Dumbbell",
        "Lateral Raise, Band",
        "Lateral Raise, Kettlebell",
        "Lateral Raise, Leverage Machine",
        "Leg Extension, Band",
        "Leg Extension, Leverage Machine",
        "Leg Press, Smith Machine",
        "Leg Press, Leverage Machine",
        "Legs Up Bench Press, Barbell",
        "Lunge, Barbell",
        "Lunge, Cable",
        "Lunge, Dumbbell",
        "Lunge, Bodyweight",
        "Lying Bicep Curl, Cable",
        "Lying Bicep Curl, Dumbbell",
        "Lying Leg Curl, Band",
        "Lying Leg Curl, Leverage Machine",
        "Muscle Up, Bodyweight",
        "Oblique Crunch, Bodyweight",
        "Overhead Press, Barbell",
        "Overhead Press, Dumbbell",
        "Overhead Press, EZ Bar",
        "Overhead Squat, Barbell",
        "Overhead Squat, Dumbbell",
        "Pec Deck, Leverage Machine",
        "Pendlay Row, Barbell",
        "Pistol Squat, Kettlebell",
        "Pistol Squat, Bodyweight",
        "Pistol Squat, Leverage Machine",
        "Plank, Bodyweight",
        "Preacher Curl, Barbell",
        "Preacher Curl, Dumbbell",
        "Preacher Curl, Leverage Machine",
        "Preacher Curl, EZ Bar",
        "Pull Up, Band",
        "Pull Up, Bodyweight",
        "Pull Up, Leverage Machine",
        "Pullover, Barbell",
        "Pullover, Dumbbell",
        "Push Press, Barbell",
        "Push Press, Dumbbell",
        "Push Press, Kettlebell",
        "Push Press, Bodyweight",
        "Push Up, Band",
        "Push Up, Bodyweight",
        "Reverse Crunch, Cable",
        "Reverse Crunch, Bodyweight",
        "Reverse Curl, Barbell",
        "Reverse Curl, Cable",
        "Reverse Curl, Dumbbell",
        "Reverse Curl, Band",
        "Reverse Fly, Dumbbell",
        "Reverse Fly, Band",
        "Reverse Fly, Leverage Machine",
        "Reverse Hyperextension, Band",
        "Reverse Hyperextension, Leverage Machine",
        "Reverse Lunge, Barbell",
        "Reverse Lunge, Dumbbell",
        "Reverse Lunge, Kettlebell",
        "Reverse Lunge, Bodyweight",
        "Reverse Wrist Curl, Barbell",
        "Reverse Wrist Curl, Dumbbell",
        "Reverse Wrist Curl, EZ Bar",
        "Romanian Deadlift, Barbell",
        "Romanian Deadlift, Dumbbell",
        "Russian Twist, Cable",
        "Russian Twist, Dumbbell",
        "Russian Twist, Bodyweight",
        "Safety Squat Bar Squat, Barbell",
        "Seated Calf Raise, Barbell",
        "Seated Calf Raise, Dumbbell",
        "Seated Calf Raise, Leverage Machine",
        "Seated Front Raise, Barbell",
        "Seated Front Raise, Dumbbell",
        "Seated Leg Curl, Leverage Machine",
        "Seated Leg Press, Leverage Machine",
        "Seated Overhead Press, Barbell",
        "Seated Palms Up Wrist Curl, Dumbbell",
        "Seated Row, Cable",
        "Seated Row, Band",
        "Seated Row, Leverage Machine",
        "Seated Wide Grip Row, Cable",
        "Shoulder Press, Cable",
        "Shoulder Press, Dumbbell",
        "Shoulder Press, Smith Machine",
        "Shoulder Press, Band",
        "Shoulder Press, Leverage Machine",
        "Shoulder Press Parallel Grip, Dumbbell",
        "Shrug, Barbell",
        "Shrug, Cable",
        "Shrug, Dumbbell",
        "Shrug, Smith Machine",
        "Shrug, Band",
        "Shrug, Leverage Machine",
        "Side Bend, Cable",
        "Side Bend, Dumbbell",
        "Side Bend, Band",
        "Side Crunch, Cable",
        "Side Crunch, Band",
        "Side Crunch, Bodyweight",
        "Side Hip Abductor, Barbell",
        "Side Hip Abductor, Bodyweight",
        "Side Hip Abductor, Leverage Machine",
        "Side Lying Clam, Bodyweight",
        "Side Plank, Bodyweight",
        "Single Leg Bridge, Bodyweight",
        "Single Leg Deadlift, Dumbbell",
        "Single Leg Deadlift, Bodyweight",
        "Single Leg Glute Bridge Bent Knee, Bodyweight",
        "Single Leg Glute Bridge On Bench, Bodyweight",
        "Single Leg Glute Bridge Straight Leg, Bodyweight",
        "Single Leg Hip Thrust, Barbell",
        "Single Leg Hip Thrust, Bodyweight",
        "Single Leg Hip Thrust, Leverage Machine",
        "Sissy Squat, Bodyweight",
        "Sit Up, Kettlebell",
        "Sit Up, Bodyweight",
        "Skullcrusher, Barbell",
        "Skullcrusher, Cable",
        "Skullcrusher, Dumbbell",
        "Skullcrusher, EZ Bar",
        "Snatch, Dumbbell",
        "Split Squat, Barbell",
        "Split Squat, Dumbbell",
        "Split Squat, Band",
        "Split Squat, Kettlebell",
        "Split Squat, Bodyweight",
        "Squat, Barbell",
        "Squat, Dumbbell",
        "Squat, Smith Machine",
        "Squat, Bodyweight",
        "Squat, Leverage Machine",
        "Squat Row, Band",
        "Standing Calf Raise, Barbell",
        "Standing Calf Raise, Cable",
        "Standing Calf Raise, Dumbbell",
        "Standing Calf Raise, Bodyweight",
        "Standing Calf Raise, Leverage Machine",
        "Standing Row, Cable",
        "Standing Row Close Grip, Cable",
        "Standing Row Rear Delt With Rope, Cable",
        "Standing Row Rear Delt, Horizontal, With Rope, Cable",
        "Standing Row V-Bar, Cable",
        "Step up, Barbell",
        "Step up, Dumbbell",
        "Step up, Band",
        "Step up, Bodyweight",
        "Stiff Leg Deadlift, Barbell",
        "Stiff Leg Deadlift, Dumbbell",
        "Stiff Leg Deadlift, Band",
        "Straight Leg Deadlift, Barbell",
        "Straight Leg Deadlift, Dumbbell",
        "Straight Leg Deadlift, Band",
        "Straight Leg Deadlift, Kettlebell",
        "Sumo Deadlift, Barbell",
        "Sumo Deadlift High Pull, Barbell",
        "Superman, Dumbbell",
        "Superman, Bodyweight",
        "T Bar Row, Leverage Machine",
        "Thruster, Barbell",
        "Toes To Bar, Bodyweight",
        "Trap Bar Deadlift, Trap Bar",
        "Triceps Dip, Bodyweight",
        "Triceps Dip, Leverage Machine",
        "Triceps Extension, Barbell",
        "Triceps Extension, Cable",
        "Triceps Extension, Dumbbell",
        "Triceps Extension, Band",
        "Triceps Pushdown, Cable",
        "Upright Row, Barbell",
        "Upright Row, Cable",
        "Upright Row, Dumbbell",
        "Upright Row, Band",
        "V Up, Dumbbell",
        "V Up, Band",
        "V Up, Bodyweight",
        "Wide Pull Up, Bodyweight",
        "Wrist Curl, Barbell",
        "Wrist Curl, Dumbbell",
        "Wrist Curl, EZ Bar",
        "Wrist Roller, Bodyweight",
        "Zercher Squat, Barbell"
    ];

    // Global map to store manual mappings for the current session
    const manualMappings = new Map();

    // --- UI Elements ---

    /**
     * Creates and appends the "Convert to Liftosaur Program" button to the DOM.
     * @returns {HTMLButtonElement} The created button element.
     */
    function createConvertButton() {
        const button = document.createElement('button');
        button.id = 'convertBoostcampToLiftosaur';
        button.textContent = 'Convert to Liftosaur Program';
        button.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 10000;
            padding: 10px 15px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transition: background-color 0.3s ease, transform 0.2s ease;
        `;
        button.onmouseover = () => button.style.backgroundColor = '#45a049';
        button.onmouseout = () => button.style.backgroundColor = '#4CAF50';
        button.onmousedown = () => button.style.transform = 'scale(0.98)';
        button.onmouseup = () => button.style.transform = 'scale(1)';
        document.body.appendChild(button);
        return button;
    }

    /**
     * Creates and appends the modal dialog for displaying the Liftosaur text to the DOM.
     * @returns {{modal: HTMLDivElement, textArea: HTMLTextAreaElement}} An object containing the modal and textarea elements.
     */
    function createModal() {
        const modal = document.createElement('div');
        modal.id = 'liftosaurTextModal';
        modal.style.cssText = `
            display: none; /* Hidden by default */
            position: fixed; /* Stay in place */
            z-index: 10001; /* Sit on top */
            left: 0;
            top: 0;
            width: 100%; /* Full width */
            height: 100%; /* Full height */
            overflow: auto; /* Enable scroll if needed */
            background-color: rgba(0,0,0,0.7); /* Black w/ opacity */
            justify-content: center; /* Center content horizontally */
            align-items: center; /* Center content vertically */
        `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background-color: #fefefe;
            margin: auto;
            padding: 20px;
            border: 1px solid #888;
            width: 80%;
            max-width: 700px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            position: relative;
            animation: fadeIn 0.3s;
        `;

        const closeButton = document.createElement('span');
        closeButton.textContent = '×';
        closeButton.style.cssText = `
            color: #aaa;
            float: right;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
            position: absolute;
            top: 10px;
            right: 20px;
        `;
        closeButton.onclick = () => modal.style.display = 'none';

        const title = document.createElement('h2');
        title.textContent = 'Liftosaur Program Text';
        title.style.marginBottom = '15px';
        title.style.color = '#333'; // Using style.color instead of direct property for consistency

        const textArea = document.createElement('textarea');
        textArea.id = 'liftosaurTextOutput';
        textArea.readOnly = true;
        textArea.style.cssText = `
            width: calc(100% - 20px);
            height: 300px;
            padding: 10px;
            margin-bottom: 15px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-family: 'Courier New', Courier, monospace;
            font-size: 14px;
            resize: vertical;
        `;

        const copyButton = document.createElement('button');
        copyButton.textContent = 'Copy to Clipboard';
        copyButton.style.cssText = `
            padding: 10px 15px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            transition: background-color 0.3s ease;
        `;
        copyButton.onmouseover = () => copyButton.style.backgroundColor = '#0056b3';
        copyButton.onmouseout = () => copyButton.style.backgroundColor = '#007bff';
        copyButton.onclick = () => {
            textArea.select();
            // Use modern Clipboard API if available, fallback to execCommand
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(textArea.value)
                    .then(() => alertMessage('Program text copied to clipboard!'))
                    .catch(err => {
                        console.error('Failed to copy using Clipboard API:', err);
                        document.execCommand('copy'); // Fallback
                        alertMessage('Program text copied to clipboard (fallback)!');
                    });
            } else {
                document.execCommand('copy'); // Fallback for older browsers or restricted environments
                alertMessage('Program text copied to clipboard!');
            }
        };

        modalContent.appendChild(closeButton);
        modalContent.appendChild(title);
        modalContent.appendChild(textArea);
        modalContent.appendChild(copyButton);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        // Add simple fade-in animation style globally via GM_addStyle
        GM_addStyle(`
            @keyframes fadeIn {
                from { opacity: 0; transform: scale(0.95); }
                to { opacity: 1; transform: scale(1); }
            }
        `);

        return { modal, textArea };
    }

    /**
     * Displays a custom alert message at the bottom center of the screen.
     * @param {string} message The message to display.
     */
    function alertMessage(message) {
        const existingAlert = document.getElementById('customAlert');
        if (existingAlert) {
            existingAlert.remove(); // Remove any previous alert
        }

        const alertDiv = document.createElement('div');
        alertDiv.id = 'customAlert';
        alertDiv.textContent = message;
        alertDiv.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #333;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 10002;
            opacity: 0;
            transition: opacity 0.5s ease-in-out;
        `;
        document.body.appendChild(alertDiv);

        setTimeout(() => {
            alertDiv.style.opacity = '1'; // Fade in
        }, 10); // Small delay to trigger transition

        setTimeout(() => {
            alertDiv.style.opacity = '0'; // Fade out
            // Remove the element after transition ends to clean up DOM
            alertDiv.addEventListener('transitionend', () => alertDiv.remove());
        }, 3000);
    }

    /**
     * Displays a modal for the user to select a Liftosaur exercise name.
     * This function is asynchronous and will pause execution until user makes a choice.
     * @param {string} unmatchedBoostcampName The Boostcamp exercise name that couldn't be automatically matched.
     * @returns {Promise<string>} A promise that resolves with the selected Liftosaur exercise name, or the original Boostcamp name if cancelled.
     */
    async function showExerciseSelectionModal(unmatchedBoostcampName) {
        return new Promise((resolve) => {
            const modal = document.createElement('div');
            modal.id = 'exerciseSelectionModal';
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0,0,0,0.8);
                z-index: 10003;
                display: flex;
                justify-content: center;
                align-items: center;
            `;

            const modalContent = document.createElement('div');
            modalContent.style.cssText = `
                background-color: #fefefe;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.5);
                width: 90%;
                max-width: 600px;
                max-height: 80%;
                display: flex;
                flex-direction: column;
                animation: fadeIn 0.3s;
            `;

            const title = document.createElement('h3');
            title.textContent = `Map "${unmatchedBoostcampName}" to a Liftosaur Exercise`;
            title.style.marginBottom = '15px';
            title.style.color = '#333';

            const searchInput = document.createElement('input');
            searchInput.type = 'text';
            searchInput.placeholder = 'Search Liftosaur exercises...';
            searchInput.style.cssText = `
                width: calc(100% - 20px);
                padding: 10px;
                margin-bottom: 15px;
                border: 1px solid #ddd;
                border-radius: 5px;
                font-size: 14px;
            `;

            const exerciseListContainer = document.createElement('div');
            exerciseListContainer.style.cssText = `
                flex-grow: 1;
                overflow-y: auto;
                border: 1px solid #eee;
                border-radius: 5px;
                padding: 10px;
                margin-bottom: 15px;
                background-color: #f9f9f9;
            `;

            let selectedExerciseElement = null; // Store the DOM element of the selected exercise

            const renderList = (filter = '') => {
                exerciseListContainer.innerHTML = ''; // Clear previous list
                // Split filter by space for multi-word search
                const filterWords = filter.toLowerCase().split(/\s+/).filter(Boolean);
                const filteredExercises = LIFTOSAUR_EXERCISES.filter(name => {
                    return filterWords.every(word => name.toLowerCase().includes(word));
                });

                if (filteredExercises.length === 0) {
                    const noResults = document.createElement('div');
                    noResults.textContent = 'No matching exercises found.';
                    noResults.style.padding = '10px';
                    noResults.style.color = '#888';
                    exerciseListContainer.appendChild(noResults);
                }

                filteredExercises.forEach(name => {
                    const item = document.createElement('div');
                    item.textContent = name;
                    item.style.cssText = `
                        padding: 8px 10px;
                        cursor: pointer;
                        border-bottom: 1px solid #eee;
                    `;
                    item.onmouseover = () => item.style.backgroundColor = '#e6f7ff';
                    item.onmouseout = () => {
                        if (item !== selectedExerciseElement) {
                            item.style.backgroundColor = '';
                        }
                    };
                    item.onclick = () => {
                        if (selectedExerciseElement) {
                            selectedExerciseElement.style.backgroundColor = ''; // Deselect previous
                        }
                        selectedExerciseElement = item;
                        item.style.backgroundColor = '#bae7ff'; // Highlight selected
                    };
                    exerciseListContainer.appendChild(item);
                });
            };

            searchInput.addEventListener('input', (e) => renderList(e.target.value));
            renderList(); // Initial render

            const buttonContainer = document.createElement('div');
            buttonContainer.style.cssText = `
                display: flex;
                justify-content: flex-end;
                gap: 10px;
            `;

            const selectButton = document.createElement('button');
            selectButton.textContent = 'Select';
            selectButton.style.cssText = `
                padding: 10px 15px;
                background-color: #007bff;
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 14px;
                transition: background-color 0.3s ease;
            `;
            selectButton.onmouseover = () => selectButton.style.backgroundColor = '#0056b3';
            selectButton.onmouseout = () => selectButton.style.backgroundColor = '#007bff';
            selectButton.onclick = () => {
                modal.remove();
                if (selectedExerciseElement) {
                    manualMappings.set(unmatchedBoostcampName, selectedExerciseElement.textContent); // Store mapping
                    resolve(selectedExerciseElement.textContent);
                } else {
                    alertMessage("No exercise selected. Using original Boostcamp name as fallback.");
                    resolve(unmatchedBoostcampName); // Resolve with original if nothing selected
                }
            };

            const cancelButton = document.createElement('button');
            cancelButton.textContent = 'Cancel';
            cancelButton.style.cssText = `
                padding: 10px 15px;
                background-color: #6c757d;
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 14px;
                transition: background-color 0.3s ease;
            `;
            cancelButton.onmouseover = () => cancelButton.style.backgroundColor = '#5a6268';
            cancelButton.onmouseout = () => cancelButton.style.backgroundColor = '#6c757d';
            cancelButton.onclick = () => {
                modal.remove();
                alertMessage("Exercise mapping cancelled. Using original Boostcamp name as fallback.");
                resolve(unmatchedBoostcampName); // Resolve with original Boostcamp name on cancel
            };

            buttonContainer.appendChild(cancelButton);
            buttonContainer.appendChild(selectButton);

            modalContent.appendChild(title);
            modalContent.appendChild(searchInput);
            modalContent.appendChild(exerciseListContainer);
            modalContent.appendChild(buttonContainer);
            modal.appendChild(modalContent);
            document.body.appendChild(modal);
        });
    }

    // --- Core Logic ---

    /**
     * Attempts to parse the Boostcamp program page and extract workout data.
     * This function now uses the specific HTML classes provided by the user for both desktop and mobile.
     *
     * IMPORTANT: The selectors used here are highly specific to Boostcamp's current HTML structure.
     * If Boostcamp updates its website, these selectors may break, and the script will need to be updated.
     *
     * @returns {object} A structured object representing the program.
     */
    async function parseBoostcampPage() { // Made async
        const program = {
            programName: document.querySelector('h1')?.textContent.trim() || 'Boostcamp Program',
            weeks: []
        };

        // Detect if the layout is mobile based on the presence of a mobile-specific container
        const isMobileLayout = document.querySelector('.content--Sn2m') !== null;

        if (isMobileLayout) {
            // --- Mobile Parsing Logic ---
            // On mobile, we assume only the current week is displayed and being parsed.
            let currentWeekNumber = 1; // Default to Week 1
            const weekSpan = document.querySelector('.week--OXam');
            if (weekSpan) {
                const match = weekSpan.textContent.match(/(\d+) \/ (\d+) Weeks/);
                if (match && match[1]) {
                    currentWeekNumber = parseInt(match[1]);
                }
            }
            // Initialize program.weeks with only the current week
            program.weeks.push({ weekNumber: currentWeekNumber, days: [] });

            // Find all day cards for the current week on mobile
            const mobileDayCards = document.querySelectorAll('.content--Sn2m .card--aUh2');
            if (mobileDayCards.length === 0) {
                console.warn("No day cards found for mobile layout. Check selectors for '.content--Sn2m .card--aUh2'.");
                alertMessage("Could not find workout days on mobile. Program structure might have changed.");
                return program;
            }

            for (const cardEl of mobileDayCards) { // Use for...of with await
                const exercisesForDayCard = await parseDayContent(cardEl); // Await here
                program.weeks[0].days.push(...exercisesForDayCard); // Add to the single current week
            }

        } else {
            // --- Desktop Parsing Logic (Original) ---
            // Get all week title elements to determine the total number of weeks
            const weekTitleElementsDesktop = document.querySelectorAll('.weekTitle--dAB_');
            const numWeeks = weekTitleElementsDesktop.length;

            if (numWeeks === 0) {
                console.warn("No week title elements found for desktop layout. The script might not be on a program page or selectors are outdated.");
                alertMessage("Could not find program weeks on desktop. Ensure you are on a Boostcamp program page.");
                return program;
            }

            // Find all unique day content blocks (e.g., containing all Day 1 Pull variations)
            const desktopDayContentBlocks = document.querySelectorAll('.contentWrapper--WadF .item_content--VmQp');
            if (desktopDayContentBlocks.length === 0) {
                console.warn("No desktop day content blocks found. Check selectors for '.contentWrapper--WadF .item_content--VmQp'.");
                alertMessage("Could not find day content blocks on desktop. Program structure might have changed.");
                return program;
            }

            // Initialize weeks structure with empty days arrays
            for (let i = 0; i < numWeeks; i++) {
                program.weeks.push({
                    weekNumber: i + 1,
                    days: []
                });
            }

            // Iterate through each unique day type block (e.g., "Day 1 Pull", "Day 2 Push")
            for (const dayBlock of desktopDayContentBlocks) { // Use for...of with await
                // Get all individual workout cards for THIS SPECIFIC DAY TYPE across all weeks
                const specificDayWorkoutCards = dayBlock.querySelectorAll('.card--kta9');

                // Distribute these workout cards to their respective weeks
                for (const [cardIndex, cardEl] of specificDayWorkoutCards.entries()) { // Use for...of with entries
                    // The cardIndex corresponds to the week number (0-indexed)
                    if (cardIndex < numWeeks) {
                        const exercisesForDayCard = await parseDayContent(cardEl); // Await here
                        program.weeks[cardIndex].days.push(...exercisesForDayCard);
                    } else {
                        console.warn(`Card found for week ${cardIndex + 1} but only ${numWeeks} weeks expected. Skipping.`);
                    }
                }
            }
        }

        // After populating, sort exercises within each week by their `dayName` to ensure correct order
        // This assumes day names are consistently "Day 1 ...", "Day 2 ...", etc.
        program.weeks.forEach(week => {
            week.days.sort((a, b) => {
                const dayNumA = parseInt(a.dayName.match(/Day (\d+)/)?.[1] || 0);
                const dayNumB = parseInt(b.dayName.match(/Day (\d+)/)?.[1] || 0);
                return dayNumA - dayNumB;
            });
        });

        return program;
    }

    /**
     * Parses content within a single "day" element (div.card--kta9 for desktop, div.card--aUh2 for mobile).
     * This function now handles multiple sets with different parameters within a single exercise row,
     * and uses selectors compatible with both desktop and mobile layouts.
     * It also extracts linear progression values.
     * @param {HTMLElement} dayEl The DOM element representing a day's workout card.
     * @returns {Promise<Array<object>>} A promise that resolves with an array of exercise objects, one for each exercise listed on that day card.
     */
    async function parseDayContent(dayEl) { // Made async
        // Extract day name from the title element (e.g., "Day 1 Pull" or "Day 1")
        const dayNameEl = dayEl.querySelector('.title--AsSg') || dayEl.querySelector('.title--svL5 .day--Dtal');
        const dayName = dayNameEl ? dayNameEl.textContent.trim() : 'Unknown Day';

        const exercises = [];

        // Select all exercise rows within this day card (compatible with both desktop and mobile)
        // Try desktop selector first, then mobile
        let exerciseRows = dayEl.querySelectorAll('.ant-row.row--6n56');
        if (exerciseRows.length === 0) {
            exerciseRows = dayEl.querySelectorAll('.ant-row.ant-row-no-wrap.row--94do');
        }

        for (const rowEl of exerciseRows) { // Use for...of with await
            let fullBoostcampExerciseName = rowEl.querySelector('.exerciseName--P2pn')?.textContent.trim() ||
                rowEl.querySelector('.card_title_name--DVH9')?.textContent.trim() ||
                'Unknown Exercise';

            // First, apply Boostcamp's internal equipment parsing logic
            // This converts "Bench Press (Barbell)" to "Bench Press, Barbell"
            let formattedBoostcampName = fullBoostcampExerciseName;
            // const equipmentMatch = fullBoostcampExerciseName.match(/\(([^)]+)\)/);
            // if (equipmentMatch && equipmentMatch[1]) {
            //     const equipment = equipmentMatch[1].trim();
            //     formattedBoostcampName = fullBoostcampExerciseName.replace(/\s*\([^)]+\)\s*/, '').trim();
            //     formattedBoostcampName = `${formattedBoostcampName}, ${equipment}`;
            // }

            // Now, find the best match in the Liftosaur exercises array
            const finalExerciseName = await findLiftosaurExerciseName(formattedBoostcampName); // Await here

            // Get all individual set, rep, and intensity elements for this exercise row
            // These are collected per-set, so their indices should align.
            let setElements = Array.from(rowEl.querySelectorAll('.setNum--tksc')); // Desktop selector
            let repElements = Array.from(rowEl.querySelectorAll('.reps--AyKp')); // Desktop selector
            let intensityElements = Array.from(rowEl.querySelectorAll('.ant-col.headerItem--Dhbw:last-child div')); // Desktop selector

            // If desktop selectors didn't yield results, try mobile selectors
            if (setElements.length === 0) {
                const mobileSetsCol = rowEl.querySelector('.ant-col.ant-col-xs-8:nth-child(1)');
                const mobileRepsCol = rowEl.querySelector('.ant-col.ant-col-xs-8:nth-child(2)');
                const mobileIntensityCol = rowEl.querySelector('.ant-col.ant-col-xs-8:nth-child(3)');

                if (mobileSetsCol && mobileRepsCol && mobileIntensityCol) {
                    setElements = Array.from(mobileSetsCol.querySelectorAll('div'));
                    repElements = Array.from(mobileRepsCol.querySelectorAll('span')); // Reps are inside spans in mobile
                    intensityElements = Array.from(mobileIntensityCol.querySelectorAll('div'));
                }
            }

            const setDetails = [];
            let linearProgressionValue = null; // Initialize per exercise row

            for (let i = 0; i < setElements.length; i++) {
                const sets = setElements[i]?.textContent.trim() || null;
                let reps = repElements[i]?.textContent.replace(/reps/g, '').replace(/ secs/g, 's').trim() || null;
                let rawIntensityText = intensityElements[i] ? intensityElements[i].textContent.trim() : null;
                let intensityForSet = null; // This will be the intensity for the current set

                if (rawIntensityText) {
                    const lpMatch = rawIntensityText.match(/^\+(\d+)(lbs|lb)$/i); // Match "+Xlbs" or "+Xlb"
                    if (lpMatch) {
                        linearProgressionValue = `${lpMatch[1]}lb`; // Store the value for LP (e.g., "5lb")
                        // Do NOT set intensityForSet for this specific set, as LP is a global exercise property in Liftosaur
                    } else {
                        // Process RPE or percentage as before
                        intensityForSet = rawIntensityText.replace(/RPE /g, '@').replace(/\*$/, '').trim();
                        if (intensityForSet === '-') {
                            intensityForSet = null;
                        }
                    }
                }
                setDetails.push({ sets, reps, intensity: intensityForSet });
            }

            const combinedExercise = {
                name: finalExerciseName, // Use the name found in Liftosaur_EXERCISES
                dayName: dayName,
                setsDetails: setDetails,
                linearProgression: linearProgressionValue // Add LP value to the exercise object
            };

            exercises.push(combinedExercise);
        }
        return exercises;
    }

    /**
     * Helper function to get a canonical (simplified) exercise name for grouping purposes.
     * This helps in combining sets for exercises that Liftosaur considers the same.
     * @param {string} exerciseName The full exercise name (e.g., "Overhead Press, Barbell").
     * @returns {string} The canonical exercise name (e.g., "Overhead Press").
     */
    function getCanonicalExerciseName(exerciseName) {
        // Remove common equipment suffixes and anything after a comma for grouping
        let canonicalName = exerciseName.replace(/, (Barbell|Dumbbell|Cable|Machine|Bodyweight|Leverage Machine|EZ Bar|Medicine Ball|Band|Kettlebell|Trap Bar)$/i, '').trim();
        // Also remove common variations in parentheses if they are not core to the base name
        canonicalName = canonicalName.replace(/\s*\((Close Grip|Weighted|Sumo|V-Handle|Single Arm)\)\s*/i, '').trim();
        return canonicalName;
    }

    /**
     * Finds the best matching Liftosaur exercise name from a predefined list.
     * This function attempts various matching strategies to find the closest Liftosaur name.
     * If no strong match is found, it will prompt the user for manual selection.
     * @param {string} boostcampName The formatted Boostcamp exercise name (e.g., "Bench Press, Barbell").
     * @returns {Promise<string>} A promise that resolves with the best matching Liftosaur exercise name, or the user's selected name.
     */
    async function findLiftosaurExerciseName(boostcampName) {
        // 1. Check if this Boostcamp name has already been manually mapped in this session
        if (manualMappings.has(boostcampName)) {
            return manualMappings.get(boostcampName);
        }

        const lowerBoostcampName = boostcampName.toLowerCase();

        // Strategy 1: Exact match (case-insensitive)
        for (const liftosaurName of LIFTOSAUR_EXERCISES) {
            if (lowerBoostcampName === liftosaurName.toLowerCase()) {
                return liftosaurName;
            }
        }

        // Strategy 2: Match every word in the Boostcamp name against Liftosaur names
        const cleanBoostcampName = lowerBoostcampName.replaceAll(/[,()]/g, '').replaceAll(/\s+/g, ' ').trim();
        const boostcampWords = cleanBoostcampName.split(' ');
        const filteredExercises = LIFTOSAUR_EXERCISES.filter(name => {
            return boostcampWords.every(word => name.toLowerCase().includes(word));
        });
        if (filteredExercises.length === 1) {
            return filteredExercises[0]; // Return the only match found
        }

        // Strategy 3: Sometime the previous strategy might fail because of multiple matches, like "Overhead Press Barbell", and it will find "Seated Overhead Press, Barbell" and "Overhead Press, Barbell".
        // In this case, one is has the same words, the same number of words, and the other has more words.
        if (filteredExercises.length > 1) {
            const exactMatches = filteredExercises.filter(name => {
                const nameWords = name.toLowerCase().split(' ');
                return nameWords.length === boostcampWords.length && boostcampWords.every(word => nameWords.includes(word));
            });
            if (exactMatches.length === 1) {
                return exactMatches[0]; // Return the exact match found
            }
        }

        // 4. If no good match found, prompt the user for manual selection
        console.warn(`No strong Liftosaur match found for "${boostcampName}". Prompting user for selection.`);
        return await showExerciseSelectionModal(boostcampName); // Await user input
    }

    /**
     * Converts the parsed program data into Liftosaur's plain text format.
     * Liftosaur format:
     * # Week X
     * ## Day Y [Name]
     * Exercise Name / 3x5, 1x5+, 1xAMRAP @8
     * Another Exercise / 3x8-12 @7
     * This function now groups sets for exercises that Liftosaur considers the same and adds linear progression.
     * @param {object} programData The structured program data.
     * @returns {string} The program in Liftosaur text format.
     */
    function convertToLiftosaurText(programData) {
        let liftosaurText = '';

        programData.weeks.forEach(week => {
            liftosaurText += `# Week ${week.weekNumber}\n`;

            // Group exercises by dayName within each week for consistent output
            const daysMap = new Map();
            week.days.forEach(ex => {
                const dayKey = ex.dayName;
                if (!daysMap.has(dayKey)) {
                    daysMap.set(dayKey, []);
                }
                daysMap.get(dayKey).push(ex);
            });

            // Sort day names to ensure consistent order (e.g., Day 1, Day 2, Day 3)
            const sortedDayNames = Array.from(daysMap.keys()).sort((a, b) => {
                const dayNumA = parseInt(a.match(/Day (\d+)/)?.[1] || 0);
                const dayNumB = parseInt(b.match(/Day (\d+)/)?.[1] || 0);
                return dayNumA - dayNumB;
            });

            sortedDayNames.forEach(dayName => {
                liftosaurText += `## ${dayName}\n`;
                const exercisesForDay = daysMap.get(dayName);

                // Group exercises by their canonical name to combine sets for similar exercises
                const groupedExercisesByCanonicalName = new Map();
                exercisesForDay.forEach(exercise => {
                    const canonicalName = getCanonicalExerciseName(exercise.name);
                    if (!groupedExercisesByCanonicalName.has(canonicalName)) {
                        groupedExercisesByCanonicalName.set(canonicalName, {
                            primaryName: exercise.name, // Store the first encountered specific name
                            setsDetails: [],
                            linearProgression: null // Initialize LP for grouped exercise
                        });
                    }
                    const existingEntry = groupedExercisesByCanonicalName.get(canonicalName);
                    // If a more specific name (longer) is encountered later for the same canonical exercise, update it.
                    // This ensures "Bench Press, Barbell" takes precedence over "Bench Press" if both exist.
                    if (exercise.name.length > existingEntry.primaryName.length) {
                        existingEntry.primaryName = exercise.name;
                    }
                    existingEntry.setsDetails.push(...exercise.setsDetails);

                    // If this exercise has LP, apply it to the grouped entry
                    // Assuming only one LP rule per exercise, take the first one found.
                    if (exercise.linearProgression && !existingEntry.linearProgression) {
                        existingEntry.linearProgression = exercise.linearProgression;
                    }
                });

                groupedExercisesByCanonicalName.forEach((groupedData, canonicalName) => {
                    const exerciseName = groupedData.primaryName; // Use the most specific name for the output line
                    const setsDetails = groupedData.setsDetails;
                    const linearProgression = groupedData.linearProgression; // Get LP for this grouped exercise

                    // Map each set detail to its string representation including intensity
                    let setsRepsIntensityPart = setsDetails.map(s => {
                        if (s.sets && s.reps) {
                            // Only include intensity if it's not null (i.e., not an LP indicator that was removed)
                            return `${s.sets}x${s.reps}${s.intensity ? ' ' + s.intensity : ''}`;
                        }
                        return ''; // Return empty string for invalid set details
                    }).filter(Boolean).join(', '); // Filter out empty strings and join with comma and space

                    // Construct the final line for Liftosaur
                    let line = `${exerciseName} / ${setsRepsIntensityPart}`;

                    // Append linear progression if present
                    if (linearProgression) {
                        line += ` / progress: lp(${linearProgression})`;
                    }
                    liftosaurText += `${line}\n`;
                });
                liftosaurText += '\n'; // Add a blank line between days for readability
            });
            liftosaurText += '\n'; // Add a blank line between weeks
        });

        return liftosaurText.trim(); // Remove any trailing newlines
    }

    // --- Main Execution ---
    /**
     * Initializes the userscript by creating the button and modal, and attaching event listeners.
     */
    function initialize() {
        const convertButton = createConvertButton();
        const { modal, textArea } = createModal();

        convertButton.addEventListener('click', async () => { // Made async
            try {
                const programData = await parseBoostcampPage(); // Await here
                if (programData.weeks.length > 0 && programData.weeks[0].days.length > 0) { // Only show modal if parsing was successful and data exists
                    textArea.value = convertToLiftosaurText(programData);
                    modal.style.display = 'flex'; // Show modal
                } else {
                    alertMessage("No program data found to convert. Please ensure the page has loaded correctly and contains workout information.");
                }
            } catch (error) {
                console.error("Error converting program:", error);
                alertMessage("Failed to convert program. Check console for details. The script's parsing logic might need adjustment due to website changes.");
            }
        });
    }

    // Run initialization when the document is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();
