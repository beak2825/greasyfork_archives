// ==UserScript==
// @name         IdlePixel Chat window resizer handle
// @namespace    com.zlef.idlepixel
// @version      1.0.0
// @description  Resize the chat window to your heart's content
// @author       Zlef
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20220905
// @downloadURL https://update.greasyfork.org/scripts/479305/IdlePixel%20Chat%20window%20resizer%20handle.user.js
// @updateURL https://update.greasyfork.org/scripts/479305/IdlePixel%20Chat%20window%20resizer%20handle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class ChatResizer extends IdlePixelPlusPlugin {
        constructor() {
            super("chatresizer", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                }
            });
        }

        onLogin() {
            // Add the resizable handle to the chat window
            this.addResizableHandle();
        }

        addResizableHandle() {
            // Assuming the chat window has an ID of 'game-chat' and the game has an ID of 'game-screen'
            const chat = $('#game-chat');
            const game = $('#game-screen');

            // Create the resizer div and insert it between the game and chat divs
            const resizer = $('<div id="chat-resizer-handle"></div>');
            resizer.insertAfter(game); // Place the resizer after the game div

            // Make the resizer handle interactive
            resizer.draggable({
                axis: 'x',
                containment: 'parent', // Contain the drag within the parent element
                drag: (event, ui) => {
                    const totalWidth = game.width() + chat.width();
                    const gameWidth = ui.position.left;
                    const chatWidth = totalWidth - gameWidth;

                    // Update the widths of game and chat divs
                    game.width(gameWidth);
                    chat.width(chatWidth);

                    // Move the chat div to the new position
                    chat.css('left', gameWidth);
                }
            });

            // Style the handle
            resizer.css({
                width: '5px',
                height: '100%',
                cursor: 'ew-resize',
                'background-color': 'gray',
                position: 'absolute',
                top: 0,
                // Position the resizer to the left edge of the chat div
                left: game.width()
            });

            // Initial position adjustment for chat
            chat.css({
                position: 'absolute', // Make the chat div absolute
                left: game.width(), // Position it next to the game div
                width: chat.width() // Set the initial width if needed
            });

        }
    }

    // Update class initialiser
    const plugin = new ChatResizer();
    IdlePixelPlus.registerPlugin(plugin);

})();
