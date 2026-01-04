// ==UserScript==
// @name        BlockBlockAdBlock
// @namespace   ZOWEB
// @version     3
// @description Blocks BlockAdBlock scripts. Toggleable if required.
// @match       *://*/*
// @run-at      document-start
// @license     MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/373960/BlockBlockAdBlock.user.js
// @updateURL https://update.greasyfork.org/scripts/373960/BlockBlockAdBlock.meta.js
// ==/UserScript==

function addFunction(func, exec) {
    // wait for document.head
    const int = setInterval(() => {
        if (!document.head) return;

        console.debug("Inserting script.");
        const script = document.createElement("script");
        script.textContent = "-" + func + (exec ? "()" : "");
        document.head.appendChild(script);
        setTimeout(script.remove.bind(script), 0);

        clearInterval(int);
    }, 0);
}

addFunction(function() {
    let hasEvaled = false, firstEvalId, firstEvalCode;

    const oldEval = window.eval;

    function runEval(d) {
        const id = Math.floor(Math.random() * 20), runChecker = Math.floor(Math.random() * 255).toString(16);

        function b(checker) {
            if (checker === runChecker) {
                console.warn("bbab * Running eval script!");
                return oldEval(d);
            } else console.error("bbab * Invalid checker! Eval will only run with the checker specified.");
        }

        if (!hasEvaled) {
            hasEvaled = true;
            firstEvalId = id;
            firstEvalCode = runChecker;

            runFirstTime();
        }

        if (localStorage.getItem("bbab") !== "disable") {
            console.warn("     * ---- * --- * --- * ---- *");
            console.warn("bbab * Eval script was blocked *");
            console.warn("bbab * From:", (new Error()).stack.split("\n")[1]);
            console.warn("bbab *  [ To run this script, type the following into the console: ]");
            console.warn("bbab *  [   window._bbab_" + id + "(\"" + runChecker + "\") ]");
            console.warn("bbab *  [ To print this script, type the following into the console: ]");
            console.warn("bbab *  [   window._bbab_p_" + id + " ]");

            window["_bbab_" + id] = a => b(a);
            window["_bbab_" + id].toString = () => "[function BlockBlockAdBlock]";
            window["_bbab_p_" + id] = d;
        } else {
            console.warn("bbab * Letting through eval script as we are disabled.");
            return oldEval(d);
        }

        return new Error("Eval script was blocked.");
    }

    window.eval = d => runEval(d);
    window.eval.toString = () => "function eval() {\n    [native code]\n}";
    window.eval.toString.toString = () => "function toString() {\n    [native code]\n}";

    const elem = document.createElement("p");
    const targeter = document.createElement("button");
    const hider = document.createElement("button");

    function runFirstTime() {
        console.info("Inserting popup if enabled");

        // if we've visited this page multiple times add a popup to say so
        if (localStorage.getItem("bbab.visited") === "yes") {
            elem.id = "BBAB_POPUP";
            elem.style.position = "fixed";
            elem.style.bottom = ".5em";
            elem.style.right = ".5em";
            elem.style.padding = "1em";
            elem.style.backgroundColor = "#314159";
            elem.style.color = "#eff4ff";
            elem.style.borderRadius = "3px";
            elem.style.fontFamily = "sans-serif";
            elem.style.fontSize = "16px";
            elem.style.zIndex = "999999";

            const href = document.createElement("a");
            href.href = "#";
            href.style.color = "#99a9e6";
            href.style.textDecoration = "underline";

            const reloadLink = document.createElement("a");
            reloadLink.href = "#";
            reloadLink.style.color = "#99a9e6";
            reloadLink.style.textDecoration = "underline";
            reloadLink.textContent = "Reload to update";
            reloadLink.onclick = location.reload.bind(location, true);

            const antiDMCA = document.createElement("small");
            antiDMCA.style.fontSize = "0.75em";
            antiDMCA.style.display = "none";
            antiDMCA.textContent = "Note: blocking BlockAdBlock is not against the DMCA (as much as they want you to think it is)";
            window.addEventListener("keydown", e => {
                if (e.key !== "F12") return;
                antiDMCA.style.display = "";
            });

            if (localStorage.getItem("bbab") !== "disable") {
                elem.textContent = "Disabling your adblocker on pages you visit frequently will help them survive. ";
                href.textContent = "Turn off BlockBlockAdBlock";

                href.addEventListener("click", e => {
                    e.preventDefault();

                    localStorage.setItem("bbab", "disable");

                    elem.remove();
                    window["_bbab_" + firstEvalId](firstEvalCode);
                });
            } else {
                elem.textContent = "";
                href.textContent = "Enable BBAB";

                href.addEventListener("click", e => {
                    e.preventDefault();

                    localStorage.setItem("bbab", "enable");

                    elem.textContent = "";
                    elem.appendChild(reloadLink);
                });
            }

            elem.appendChild(href);
            elem.appendChild(document.createElement("br"));
            elem.appendChild(antiDMCA);

            console.debug("Inserting elem");
            document.body.appendChild(elem);
        }
        localStorage.setItem("bbab.visited", "yes");
    }

    window.onload = () => {
        console.debug("Checking if we've been blocked");

        // add another element incase BlockAdBlock does magic
        // which seems to hide from MutationObservers????????
        targeter.style.zIndex = "999999";
        targeter.style.position = "fixed";
        targeter.style.left = "4em";
        targeter.style.bottom = ".5em";
        targeter.style.borderRadius = "3px";
        targeter.style.backgroundColor = "#eff4ff";
        targeter.style.border = "1px solid #314159";
        targeter.style.color = "#314159";
        targeter.style.cursor = "pointer";
        targeter.style.fontFamily = "sans-serif";
        targeter.style.fontSize = "16px";
        targeter.style.padding = ".1em .3em";
        targeter.textContent = "Delete Annoying Element";

        hider.style.zIndex = "999999";
        hider.style.position = "fixed";
        hider.style.left = ".5em";
        hider.style.bottom = ".5em";
        hider.style.borderRadius = "3px";
        hider.style.backgroundColor = "#eff4ff";
        hider.style.border = "1px solid #314159";
        hider.style.color = "#314159";
        hider.style.cursor = "pointer";
        hider.style.fontFamily = "sans-serif";
        hider.style.fontSize = "16px";
        hider.style.padding = ".1em .3em";
        hider.style.transition = "200ms ease-out";
        hider.textContent = "[Hide]";

        function toggleElements() {
            if (localStorage.getItem("bbab.visibility") === "visible") {
                targeter.style.display = "none";
                elem.style.display = "none";
                localStorage.setItem("bbab.visibility", "hidden");

                hider.style.bottom = "-.7em";
                hider.textContent = "____";
            } else {
                hider.textContent = "[Hide]";
                targeter.style.display = "";
                elem.style.display = "";
                localStorage.setItem("bbab.visibility", "visible");

                hider.style.bottom = ".5em";
            }
        }

        // toggle twice to go back to normal
        toggleElements();
        toggleElements();

        document.body.appendChild(hider);
        document.body.appendChild(targeter);

        hider.onclick = () => toggleElements();
        targeter.onclick = () => {
            const overlay = document.createElement("div");
            overlay.style.position = "fixed";
            overlay.style.zIndex = "99999";
            overlay.style.background = "rgba(255,255,255,0.6)";
            overlay.style.cursor = "select";
            overlay.style.pointerEvents = "none";
            overlay.style.border = "1px dashed black";
            document.body.appendChild(overlay);

            targeter.style.pointerEvents = "none";
            targeter.style.opacity = "0.4";
            hider.style.pointerEvents = "none";
            hider.style.opacity = "0.4";
            elem.style.pointerEvents = "none";
            elem.style.opacity = "0.4";

            let target = {remove(){}};
            function mouseMove(e) {
                target = e.target;
                const targetPos = target.getBoundingClientRect();

                overlay.style.top = `${targetPos.top}px`;
                overlay.style.left = `${targetPos.left}px`;
                overlay.style.width = `${targetPos.width}px`;
                overlay.style.height = `${targetPos.height}px`;
            }

            function mouseDown(e) {
                e.preventDefault();

                window.removeEventListener("mousemove", mouseMove);
                window.removeEventListener("mousedown", mouseDown);
                window.removeEventListener("keydown", keyDown);
                target.remove();
                overlay.remove();

                targeter.style.pointerEvents = "";
                targeter.style.opacity = "";
                hider.style.pointerEvents = "";
                hider.style.opacity = "";
                elem.style.pointerEvents = "";
                elem.style.opacity = "";
            }

            function keyDown(e) {
                console.log(e.key);
                if (e.key !== "Esc") return;

                e.preventDefault();

                window.removeEventListener("mousemove", mouseMove);
                window.removeEventListener("mousedown", mouseDown);
                window.removeEventListener("keydown", keyDown);
                overlay.remove();

                targeter.style.pointerEvents = "";
                targeter.style.opacity = "";
                hider.style.pointerEvents = "";
                hider.style.opacity = "";
                elem.style.pointerEvents = "";
                elem.style.opacity = "";
            }

            window.addEventListener("mousemove", mouseMove);
            window.addEventListener("mousedown", mouseDown);
            window.addEventListener("keydown",   keyDown);
        };

        if (localStorage.getItem("bbab") !== "disable" && document.getElementById("babasbmsgx") !== null) document.getElementById("babasbmsgx").remove();

    };
}, true);

console.info("You are being protected.");
