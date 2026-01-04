// ==UserScript==
// @name         Torn Blood bag quick use
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Adds a buttons to quickly use blood bags to med out or self hosp 
// @author       MoAlaa[2774213]
// @match        *://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531179/Torn%20Blood%20bag%20quick%20use.user.js
// @updateURL https://update.greasyfork.org/scripts/531179/Torn%20Blood%20bag%20quick%20use.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Blood type to item ID mapping
    const bloodTypes = {
        'A+': 732,
        'A-': 733,
        'AB+': 736,
        'AB-': 737,
        'B+': 734,
        'B-': 735,
        'O+': 738,
        'O-': 739
    };

    const IPECAC_SYRUP_ID = 1363;

    // Incompatible type for hospitalization (real-world based)
    function getHospitalItemID(bloodType) {
        if (bloodType === 'AB+') return IPECAC_SYRUP_ID; // AB+ uses Ipecac
        const incompatibles = {
            'A+': 'B+', // A+ can’t take B+
            'A-': 'B-', // A- can’t take B-
            'AB-': 'B+', // AB- can’t take B+
            'B+': 'A+', // B+ can’t take A+
            'B-': 'A-', // B- can’t take A-
            'O+': 'A+', // O+ can’t take A+
            'O-': 'B+' // O- can’t take B+
        };
        return bloodTypes[incompatibles[bloodType]] || bloodTypes['B+']; // Fallback
    }

    // Shared styles function
    function applyButtonStyles(button) {
        button.style.zIndex = '1000';
        button.style.width = '60px';
        button.style.height = '60px';
        button.style.border = 'none';
        button.style.borderRadius = '50%';
        button.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
        button.style.fontSize = '18px';
        button.style.fontFamily = 'Arial, sans-serif';
        button.style.fontWeight = 'bold';
        button.style.cursor = 'pointer';
        button.style.display = 'flex';
        button.style.alignItems = 'center';
        button.style.justifyContent = 'center';
        button.style.opacity = '0';
        button.style.transition = 'transform 0.2s ease, opacity 0.3s ease, box-shadow 0.2s ease';

        setTimeout(() => {
            button.style.opacity = '1';
        }, 100);

        button.addEventListener('mouseover', () => {
            button.style.transform = 'scale(1.1)';
            button.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.4)';
        });
        button.addEventListener('mouseout', () => {
            button.style.transform = 'scale(1)';
            button.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
        });
        button.addEventListener('touchstart', () => {
            button.style.transform = 'scale(1.1)';
            button.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.4)';
        });
        button.addEventListener('touchend', () => {
            button.style.transform = 'scale(1)';
            button.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
        });
    }

    // Create the "Med" button
    const medButton = document.createElement('button');
    medButton.innerText = 'Med';
    medButton.style.position = 'fixed';
    medButton.style.top = '35%';
    medButton.style.right = '30px';
    medButton.style.background = 'linear-gradient(135deg, #4CAF50, #2E7D32)';
    medButton.style.color = '#fff';
    applyButtonStyles(medButton);

    // Create the "Hosp" button
    const hospButton = document.createElement('button');
    hospButton.innerText = 'Hosp';
    hospButton.style.position = 'fixed';
    hospButton.style.top = 'calc(35% + 70px)';
    hospButton.style.right = '30px';
    hospButton.style.background = 'linear-gradient(135deg, #D32F2F, #B71C1C)';
    hospButton.style.color = '#fff';
    applyButtonStyles(hospButton);

    document.body.appendChild(medButton);
    document.body.appendChild(hospButton);

    // Check or set blood type
    function setupBloodType() {
        let bloodType = localStorage.getItem('tornBloodType');
        if (!bloodType) {
            bloodType = prompt('Enter your preferred blood type (e.g., A+, O-, AB+):');
            if (bloodType) {
                bloodType = bloodType.toUpperCase().trim();
                if (bloodTypes[bloodType]) {
                    localStorage.setItem('tornBloodType', bloodType);
                    alert(`Blood type set to ${bloodType}. "Med" to heal, "Hosp" to hospitalize!`);
                } else {
                    alert('Invalid blood type! Use: A+, A-, AB+, AB-, B+, B-, O+, O-');
                }
            }
            return false;
        }
        return bloodType;
    }

    // Function to use the blood bag (replenish health)
    function useBloodBag() {
        const bloodType = setupBloodType();
        if (!bloodType) return;

        const itemID = bloodTypes[bloodType];
        fetch('https://www.torn.com/item.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: `step=useItem&itemID=${itemID}&fac=1`,
            credentials: 'include'
        })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            if (data.success) {
                console.log('Success:', data.text);
                medButton.innerText = bloodType;
            } else {
                console.log('Failed response:', data);
                alert('Failed to use blood bag: ' + (data.text || 'Unknown error'));
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error using blood bag. Check console for details.');
        });
    }

    // Function to hospitalize
    function hospitalize() {
        const bloodType = setupBloodType();
        if (!bloodType) return;

        const hospItemID = getHospitalItemID(bloodType);
        const isIpecac = hospItemID === IPECAC_SYRUP_ID;
        fetch('https://www.torn.com/item.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: `step=useItem&itemID=${hospItemID}&fac=1`,
            credentials: 'include'
        })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            if (data.success) {
                console.log('Hospitalized:', data.text);
                hospButton.innerText = 'Hosp';
                
            } else {
                console.log('Failed response:', data);
                alert('Failed to hospitalize: ' + (data.text || 'Unknown error'));
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error hospitalizing. Check console for details.');
        });
    }

    medButton.addEventListener('click', useBloodBag);
    hospButton.addEventListener('click', hospitalize);
})();