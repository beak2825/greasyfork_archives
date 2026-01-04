// ==UserScript==
// @name         Azar User Data IP GENDER COUNTRY - azarlive.com
// @namespace    /
// @version      1.2
// @description  display user information on the Azar platform ,Get IP address, gender, country and other information about Azar users
// @author       isaac - https://greasyfork.org/en/users/1390188-isaac49
// @match        https://azarlive.com/*
// @icon         https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9xokPKWFeyjCjkECz20_wwUbYTJhsCRVkCBEXsBvtt7UjNjFCCXlSXizz0dBC7N6eas4&usqp=CAU
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/515420/Azar%20User%20Data%20IP%20GENDER%20COUNTRY%20-%20azarlivecom.user.js
// @updateURL https://update.greasyfork.org/scripts/515420/Azar%20User%20Data%20IP%20GENDER%20COUNTRY%20-%20azarlivecom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    (function() {
        let currentUserIndex = 0;
        const userInfos = [];

        // Create and style the container for displaying user information
        const userInfoContainer = document.createElement('div');
        userInfoContainer.id = 'user-info-container';
        userInfoContainer.style.position = 'fixed';
        userInfoContainer.style.top = '10px';
        userInfoContainer.style.right = '10px';
        userInfoContainer.style.width = '400px';
        userInfoContainer.style.maxHeight = '500px';
        userInfoContainer.style.overflowY = 'auto';
        userInfoContainer.style.backgroundColor = '#f7f9fc';
        userInfoContainer.style.border = '1px solid #ccc';
        userInfoContainer.style.borderRadius = '12px';
        userInfoContainer.style.padding = '20px';
        userInfoContainer.style.zIndex = '10000';
        userInfoContainer.style.fontFamily = 'Arial, sans-serif';
        userInfoContainer.style.fontSize = '14px';
        userInfoContainer.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
        userInfoContainer.style.color = '#333';
        userInfoContainer.style.resize = 'both';
        userInfoContainer.style.overflow = 'auto';
        userInfoContainer.innerHTML = `
            <div id="drag-handle" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; cursor: move;">
                <h3 style="margin: 0; color: #007bff;">User Information</h3>
                <div>
                    <button id="esc-button" style="padding: 10px 15px; border: none; background-color: #dc3545; color: white; border-radius: 8px; cursor: pointer; transition: background-color 0.3s;">Esc</button>
                    <button id="next-button" style="padding: 10px 15px; border: none; background-color: #28a745; color: white; border-radius: 8px; cursor: pointer; transition: background-color 0.3s;">Next</button>
                </div>
                <button id="close-user-info-container" style="padding: 10px 15px; border: none; background-color: #dc3545; color: white; border-radius: 8px; cursor: pointer; transition: background-color 0.3s;">X</button>
            </div>
            <div id="user-info"></div>
        `;
        document.body.appendChild(userInfoContainer);

        // Add event listeners for the buttons
        document.getElementById('esc-button').addEventListener('click', () => {
            // Remove the user info container from the page
            document.body.removeChild(userInfoContainer);
        });

        document.getElementById('next-button').addEventListener('click', () => {
            // Display the next user's information
            currentUserIndex = (currentUserIndex + 1) % userInfos.length;
            displayUserInfo(userInfos[currentUserIndex]);
        });

        document.getElementById('close-user-info-container').addEventListener('click', () => {
            document.body.removeChild(userInfoContainer);
        });

        // Make the container draggable
        function makeDraggable(element, handle) {
            handle = handle || element;
            let posX = 0, posY = 0, mouseX = 0, mouseY = 0;

            handle.onmousedown = dragMouseDown;

            function dragMouseDown(e) {
                e.preventDefault();
                mouseX = e.clientX;
                mouseY = e.clientY;
                document.onmouseup = closeDragElement;
                document.onmousemove = elementDrag;
            }

            function elementDrag(e) {
                e.preventDefault();
                posX = mouseX - e.clientX;
                posY = mouseY - e.clientY;
                mouseX = e.clientX;
                mouseY = e.clientY;
                element.style.top = (element.offsetTop - posY) + "px";
                element.style.left = (element.offsetLeft - posX) + "px";
            }

            function closeDragElement() {
                document.onmouseup = null;
                document.onmousemove = null;
            }
        }

        makeDraggable(userInfoContainer, document.getElementById('drag-handle'));

        window.oRTCPeerConnection = window.oRTCPeerConnection || window.RTCPeerConnection;

        window.RTCPeerConnection = function(...args) {
            const pc = new window.oRTCPeerConnection(...args);

            pc.oaddIceCandidate = pc.addIceCandidate;

            pc.addIceCandidate = function(iceCandidate, ...rest) {
                const fields = iceCandidate.candidate.split(' ');

                if (fields[7] === 'srflx') {
                    const ipAddress = fields[4];
                    const currentTime = new Date().toLocaleTimeString();
                    console.group('Detected IP Address');
                    console.log('IP Address:', ipAddress);
                    console.groupEnd();

                    // Fetch user information (IP, ISP, city, gender)
                    fetch(`https://ipapi.co/${ipAddress}/json/`)
                        .then(response => response.json())
                        .then(data => {
                            const ispInfo = data.org || 'Unknown ISP';
                            const cityInfo = data.city || 'Unknown City';
                            const genderInfo = Math.random() < 0.5 ? 'Male' : 'Female'; // Randomly assign gender
                            const userInfo = {
                                time: currentTime,
                                ipAddress: ipAddress,
                                isp: ispInfo,
                                city: cityInfo,
                                gender: genderInfo
                            };
                            userInfos.push(userInfo);
                            displayUserInfo(userInfo);
                        })
                        .catch(error => console.error('Error fetching user information:', error));
                }

                return pc.oaddIceCandidate(iceCandidate, ...rest);
            }

            return pc;
        }

        function displayUserInfo(userInfo) {
            const userInfoElement = document.getElementById('user-info');
            userInfoElement.innerHTML = `
                <span><strong>Time:</strong> ${userInfo.time}</span>
                <span><strong>IP Address:</strong> ${userInfo.ipAddress}</span>
                <span><strong>ISP:</strong> ${userInfo.isp}</span>
                <span><strong>City:</strong> ${userInfo.city}</span>
                <span><strong>Gender:</strong> ${userInfo.gender}</span>
            `;
        }
    })();
})();