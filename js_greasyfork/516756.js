// ==UserScript==
// @name         CGRandButton
// @namespace    http://cinemageddon.net/
// @version      1.2
// @description  Better CG Button
// @match        *://cinemageddon.net/details.php*
// @match        *://cinemageddon.net/browse.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/516756/CGRandButton.user.js
// @updateURL https://update.greasyfork.org/scripts/516756/CGRandButton.meta.js
// ==/UserScript==

(function() {
    // set keepAbsolute to false if you don't like the button following you around as you scroll
    let keepAbsolute = true;

    // if in main torrent viewing page, make sure the button NEVER follows you around ever because it sucks
    if (window.location.href.includes('cinemageddon.net/browse.php')) {
        keepAbsolute = false;
    }

    // find OG random button
    const randomButton = document.querySelector('a[href^="/details.php?id="]');

    if (!randomButton) {
        console.warn("No random link found on this page for some reason.");
        return;
    }

    // here comes the new button
    const newRandomButton = document.createElement('a');
    newRandomButton.textContent = "Random";
    newRandomButton.href = randomButton.href;
    // button look
    const styles = {
        padding: "10px 20px",
        backgroundColor: "#333",
        color: "#FC9E00", // CG orange, baby!
        fontSize: "18px",
        fontFamily: "Arial, sans-serif",
        fontWeight: "bold",
        border: "2px solid #FC9E00",
        borderRadius: "3px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.6)",
        zIndex: "9999",
        cursor: "pointer",
        textDecoration: "none",
        top: "10px",
        left: "50%",
        transform: "translateX(-50%)",
        marginTop: "20px",
        position: keepAbsolute ? "fixed" : "absolute",
        transition: "all 0.3s ease"
    };
    
    // CSS hover over animation
    Object.assign(newRandomButton.style, styles);

    newRandomButton.addEventListener('mouseover', function() {
        newRandomButton.style.backgroundColor = "#FC9E00";
        newRandomButton.style.color = "#333";
    });

    newRandomButton.addEventListener('mouseout', function() {
        newRandomButton.style.backgroundColor = "#333";
        newRandomButton.style.color = "#FC9E00";
    });

    newRandomButton.addEventListener('click', async function(event) {
        event.preventDefault();
        
        newRandomButton.style.animation = "shake 0.4s ease";
        
        await new Promise(resolve => setTimeout(resolve, 400));
        
        newRandomButton.style.animation = "";
        window.location.href = newRandomButton.href;
    });

    document.body.appendChild(newRandomButton);

    // CSS button press
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0% { transform: translateX(-50%) translateY(0); }
            25% { transform: translateX(-50%) translateY(-2px); }
            50% { transform: translateX(-50%) translateY(2px); }
            75% { transform: translateX(-50%) translateY(-2px); }
            100% { transform: translateX(-50%) translateY(0); }
        }
    `;
    document.head.appendChild(style);
})();
