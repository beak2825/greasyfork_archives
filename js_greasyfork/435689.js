// ==UserScript==
// @name		Melvor Idle - Close Offline Progress Pop-up
// @namespace	http://tampermonkey.net/
// @version		0.1.3
// @description	Automatically dismisses offline progress pop-up when it's displaying less than 10 minutes of progress.
// @author		Xander#8896
// @match		https://*.melvoridle.com/*
// @exclude		https://wiki.melvoridle.com/*
// @noframes
// @grant		none
// @downloadURL https://update.greasyfork.org/scripts/435689/Melvor%20Idle%20-%20Close%20Offline%20Progress%20Pop-up.user.js
// @updateURL https://update.greasyfork.org/scripts/435689/Melvor%20Idle%20-%20Close%20Offline%20Progress%20Pop-up.meta.js
// ==/UserScript==


function script() {
    function closeModal() {
        if (Swal.isVisible() && ! Swal.isLoading()) {
            let title = Swal.getTitle()
            if (title && title.innerText == "Welcome Back!") {
                let desc = Swal.getHtmlContainer()
                if (desc) {
                    let text = desc.innerText
                    let nbsp = " "
                    let seconds = 0
                    let textFound = false

                    let threshold = 600

                    if (text.includes(nbsp + "hour")) {
                        seconds = seconds + 3600 * parseInt(text.split(nbsp + "hour")[0].split(" ").at(-1))
                        textFound = true
                    }
                    if (text.includes(nbsp + "minute")) {
                        seconds = seconds + 60 * parseInt(text.split(nbsp + "minute")[0].split(" ").at(-1))
                        textFound = true
                    }
                    if (text.includes(nbsp + "second")) {
                        seconds = seconds + parseInt(text.split(nbsp + "second")[0].split(" ").at(-1))
                        textFound = true
                    }

                    if (textFound && seconds <= threshold) {
                        console.log("Offline Progress Modal closed: " + seconds + " seconds.")
                        Swal.closeModal()
                    }
                }
            }
        }
    }

    var intervalId = setInterval(closeModal, 100);
}

function loadScript() {
	if (typeof confirmedLoaded !== typeof undefined && confirmedLoaded) {
		clearInterval(scriptLoader);
		const scriptElement = document.createElement('script');
		scriptElement.textContent = `try {(${script})();} catch (e) {console.log(e);}`;
		document.body.appendChild(scriptElement).parentNode.removeChild(scriptElement);
	}
}
 
const scriptLoader = setInterval(loadScript, 200);