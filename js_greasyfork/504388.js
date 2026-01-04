// ==UserScript==
// @name         Moderator Panel YouTubeDrawaria
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Moderator panel for Drawaria
// @author       YouTubeDrawaria
// @match        https://drawaria.online/modpanel
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/504388/Moderator%20Panel%20YouTubeDrawaria.user.js
// @updateURL https://update.greasyfork.org/scripts/504388/Moderator%20Panel%20YouTubeDrawaria.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Verify if the page has fully loaded
    window.addEventListener('load', function() {
        console.log('Page has fully loaded.');

        // Clear original page content
        document.body.innerHTML = '';

        // Change the page title
        document.title = 'Mod Panel - Drawaria';

        // Create and add the moderator panel container with effects
        let modPanelContainer = document.createElement('div');
        modPanelContainer.id = 'mod-panel';
        modPanelContainer.style.display = 'flex';
        modPanelContainer.style.height = '100vh';
        modPanelContainer.style.transition = 'all 0.5s ease';

        // Moderator panel content with modern effects and colors
        modPanelContainer.innerHTML = `
    <div id="mod-sidebar" style="width: 250px; background: linear-gradient(135deg, #1e3a8a, #3b82f6); color: #fff; padding: 20px; box-shadow: 0 0 15px rgba(0, 0, 0, 0.2); transition: width 0.3s ease;">
        <img src="https://drawaria.online/apple-touch-icon.png" alt="Logo" style="display: block; margin: 0 auto 20px auto; width: 80px; height: 80px;">
        <h1 style="font-size: 24px; margin-bottom: 20px; text-align: center;">Moderation Panel</h1>
        <ul style="list-style: none; padding: 0;">
            <li style="margin-bottom: 10px; transition: all 0.3s;"><a href="#" data-section="home" style="color: #fff; text-decoration: none;">Home</a></li>
            <li style="margin-bottom: 10px; transition: all 0.3s;"><a href="#" data-section="user-management" style="color: #fff; text-decoration: none;">User Management</a></li>
            <li style="margin-bottom: 10px; transition: all 0.3s;"><a href="#" data-section="content-management" style="color: #fff; text-decoration: none;">Content Management</a></li>
            <li style="margin-bottom: 10px; transition: all 0.3s;"><a href="#" data-section="reports" style="color: #fff; text-decoration: none;">Reports</a></li>
        </ul>
    </div>
            <div id="mod-content" style="flex: 1; padding: 20px; background: #f9fafb; border-radius: 8px; box-shadow: 0 0 15px rgba(0, 0, 0, 0.1); margin: 20px; overflow-y: auto; transition: all 0.3s ease;">
                <div id="home" class="mod-section active" style="display: block; animation: fadeIn 0.5s;">
                    <h2>Welcome to the Moderation Panel</h2>
                    <p>This panel is designed to help you manage the Drawaria community efficiently. Here you can:</p>
                    <ul style="list-style: disc; padding-left: 20px;">
                        <li>Manage users and their actions.</li>
                        <li>Review and manage reported content.</li>
                        <li>Resolve issues and maintain a safe and friendly environment.</li>
                    </ul>
                    <p>Select an option from the sidebar to get started.</p>
                    <div style="margin-top: 20px;">
                        <h3>News and Updates</h3>
                        <p>Last update: 2024-08-19</p>
                        <ul style="list-style: disc; padding-left: 20px;">
                            <li>Improved UI for the moderation panel.</li>
                            <li>New tools for content management.</li>
                            <li>Optimized reporting system.</li>
                            <br><a href="https://www.youtube.com/@YouTubeDrawaria?sub_confirmation=1" target="_blank" style="color: #3b82f6; text-decoration: none;">Moderator Guidelines</a>
                        </ul>
                    </div>
                </div>
                <div id="user-management" class="mod-section" style="display: none; animation: fadeIn 0.5s;">
                    <h2>User Management</h2>
                    <div class="mod-option" style="margin-bottom: 15px;">
                        <label for="playername" style="display: block; margin-bottom: 5px; font-weight: bold;">Rename Player</label>
                        <input type="text" id="playername" placeholder="Type name" value="" maxlength="30" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; transition: all 0.3s ease;">
                    </div>
                    <div class="mod-option" style="margin-bottom: 15px;">
                        <button id="rename-user" style="width: 100%; padding: 10px; border: none; border-radius: 4px; background: #3b82f6; color: #fff; cursor: pointer; transition: background 0.3s ease;">Rename Player</button>
                    </div>
<div class="mod-option" style="margin-bottom: 15px;">
                        <label for="playername" style="display: block; margin-bottom: 5px; font-weight: bold;">Mute Player</label>
                        <input type="text" id="playername" placeholder="Type name" value="" maxlength="30" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; transition: all 0.3s ease;">
                    </div>
                    <div class="mod-option" style="margin-bottom: 15px;">
                        <button id="muted-user" style="width: 100%; padding: 10px; border: none; border-radius: 4px; background: #3b82f6; color: #fff; cursor: pointer; transition: background 0.3s ease;">Mute Player</button>
                    </div>
                    <div class="mod-option" style="margin-bottom: 15px;">
                        <label for="avatarcontainer" style="display: block; margin-bottom: 5px; font-weight: bold;">Ban Player</label>
                        <div id="avatarcontainer">
                            <img id="selfavatarimage" src="/avatar/cache/86e33830-86ea-11ec-8553-bff27824cf71.jpg" style="border-radius: 50%; box-shadow: 0 0 10px rgba(0, 0, 0, 0.2); transition: transform 0.3s ease;">
                        </div>
                    </div>
                    <div class="mod-option" style="margin-bottom: 15px;">
                        <button id="ban-user" style="width: 100%; padding: 10px; border: none; border-radius: 4px; background: #3b82f6; color: #fff; cursor: pointer; transition: background 0.3s ease;">Ban Player</button>
                    </div>
                </div>
                <div id="content-management" class="mod-section" style="display: none; animation: fadeIn 0.5s;">
                    <h2>Content Management</h2>
                    <div class="mod-option" style="margin-bottom: 15px;">
                        <label for="content-id" style="display: block; margin-bottom: 5px; font-weight: bold;">Content ID</label>
                        <input type="text" id="content-id" placeholder="Content ID" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; transition: all 0.3s ease;">
                    </div>
                    <div class="form-group" style="margin-bottom: 15px;">
                        <label for="content-reason" class="col-form-label" style="display: block; margin-bottom: 5px; font-weight: bold;">Reason</label>
                        <select id="content-reason" class="custom-select" required="" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; transition: all 0.3s ease;">
                            <option value="">&nbsp;</option>
                            <option value="hacking">Hacking / exploits</option>
                            <option value="sexual">Sexual drawings</option>
                            <option value="inappropriate">Inappropriate comments</option>
                            <option value="offensive">Offensive content</option>
                            <option value="spam">Spam</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div class="mod-option" style="margin-bottom: 15px;">
                        <button id="delete-content" style="width: 100%; padding: 10px; border: none; border-radius: 4px; background: #3b82f6; color: #fff; cursor: pointer; transition: background 0.3s ease;">Delete Content</button>
                    </div>
                </div>
                <div id="reports" class="mod-section" style="display: none; animation: fadeIn 0.5s;">
                    <h2>Reports</h2>
                    <div class="mod-option" style="margin-bottom: 15px;">
                        <label for="report-id" style="display: block; margin-bottom: 5px; font-weight: bold;">Report ID</label>
                        <input type="text" id="report-id" placeholder="Report ID" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; transition: all 0.3s ease;">
                    </div>
                    <div class="form-group" style="margin-bottom: 15px;">
                        <label for="report-reason" class="col-form-label" style="display: block; margin-bottom: 5px; font-weight: bold;">Reason</label>
                        <select id="report-reason" class="custom-select" required="" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; transition: all 0.3s ease;">
                            <option value="">&nbsp;</option>
                            <option value="hack">Hacking / exploits</option>
                            <option value="bot">Bot</option>
                            <option value="spam">Spamming</option>
                            <option value="content">Inappropriate drawings / Offensive content</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div class="mod-option" style="margin-bottom: 15px;">
                        <button id="resolve-report" style="width: 100%; padding: 10px; border: none; border-radius: 4px; background: #3b82f6; color: #fff; cursor: pointer; transition: background 0.3s ease;">Resolve Report</button>
                    </div>
                </div>
            </div>
        `;

        // Add the container to the body of the page
        document.body.appendChild(modPanelContainer);

        // Functions to handle interactions with smooth animations
        document.querySelectorAll('#mod-sidebar a').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const sectionId = this.getAttribute('data-section');
                document.querySelectorAll('.mod-section').forEach(section => {
                    section.classList.remove('active');
                    section.style.display = 'none';
                });
                document.getElementById(sectionId).classList.add('active');
                document.getElementById(sectionId).style.display = 'block';
                document.getElementById(sectionId).style.animation = 'fadeIn 0.5s';
            });
        });

        document.getElementById('ban-user').addEventListener('click', function() {
            alert('Player banned.');
        });

        document.getElementById('rename-user').addEventListener('click', function() {
            alert('Player Renamed.');
        });

         document.getElementById('muted-user').addEventListener('click', function() {
            alert('Player Muted.');
        });

        document.getElementById('delete-content').addEventListener('click', function() {
            alert('Content deleted.');
        });

        document.getElementById('resolve-report').addEventListener('click', function() {
            alert('Report resolved.');
        });

        // Replace the page content with effects
        let newContent = document.createElement('div');
        newContent.style.textAlign = 'center';
        newContent.style.fontSize = '24px';
        newContent.style.marginTop = '20px';
        // newContent.textContent = 'Drawaria Mod Panel';
        newContent.style.animation = 'fadeIn 0.5s ease-in-out';

        // Array of avatars with random names
        const avatars = [
            { id: '86e33830-86ea-11ec-8553-bff27824cf71', name: 'YouTube' },
            { id: 'bfbe3620-1d5e-11ef-acaf-250da20bac69', name: 'Senko' },
            { id: '418e4160-cb1f-11ed-a71d-ab56d3db7ea6', name: 'Anya' },
            { id: '98bb4180-226a-11ed-9fd3-c3a00b129da4', name: 'Shiv' },
            { id: 'c8408150-dc14-11ec-9fd3-c3a00b129da4', name: 'Tyre' },
            { id: 'a272cd50-0d42-11ef-acaf-250da20bac69', name: 'Luna' },
            { id: '52bee980-1dee-11ef-acaf-250da20bac69', name: 'Mikasa' },
            { id: 'e39f20a0-d3fc-11ee-bf00-7b802f1ca94b', name: 'Natsu' },
            { id: '2b3925e0-0425-11ed-9fd3-c3a00b129da4', name: 'Luffy' },
            { id: '331c1bb0-1e03-11ef-acaf-250da20bac69', name: 'Ethan' }
        ];

        // Function to generate the list of avatars
        function generateAvatarList() {
            const avatarContainer = document.getElementById('avatarcontainer');
            avatarContainer.innerHTML = ''; // Clear the container before adding new avatars

            avatars.forEach(avatar => {
                const avatarDiv = document.createElement('div');
                avatarDiv.style.display = 'inline-block';
                avatarDiv.style.marginRight = '10px';
                avatarDiv.style.cursor = 'pointer';
                avatarDiv.style.transition = 'transform 0.3s ease';
                avatarDiv.title = avatar.name;

                const avatarImg = document.createElement('img');
                avatarImg.src = `/avatar/cache/${avatar.id}.jpg`;
                avatarImg.style.width = '60';
                avatarImg.style.height = '60px';
                avatarImg.style.borderRadius = '50%';
                avatarImg.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.2)';
                avatarImg.style.transition = 'transform 0.3s ease';

                avatarDiv.appendChild(avatarImg);
                avatarContainer.appendChild(avatarDiv);

                // Event to change the selected avatar and update the name
                avatarDiv.addEventListener('click', function() {
                    document.getElementById('selfavatarimage').src = `/avatar/cache/${avatar.id}.jpg`;
                    document.getElementById('playername').value = avatar.name;
                    avatarDiv.style.transform = 'scale(1.2)';
                    setTimeout(() => {
                        avatarDiv.style.transform = 'scale(1)';
                    }, 300);
                });
            });
        }

        // Call the function to generate the list of avatars
        generateAvatarList();

        // Add the new content to the body of the page
        document.body.appendChild(newContent);
    });
})();

// CSS Animations
const style = document.createElement('style');
style.innerHTML = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    body, html {
    font-family: Calibri;
    line-height: 1.15;
    -webkit-text-size-adjust: 100%;
    -webkit-tap-highlight-color: transparent;
    }
`;
document.head.appendChild(style);
