// ==UserScript==
// @name         Twitter-reload
// @namespace    twitter.com/Amgm_life
// @version      0.11
// @description  Twitterを自動更新
// @author       Amgm
// @match        https://twitter.com/home*
// @icon         https://abs.twimg.com/responsive-web/client-web/icon-ios.b1fc7275.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428216/Twitter-reload.user.js
// @updateURL https://update.greasyfork.org/scripts/428216/Twitter-reload.meta.js
// ==/UserScript==

(function() {
    let $mark = null;
    setInterval(()=>{
        if (window.scrollY <= 10) {
            reloadTL($mark);
        }
    }
    , 6000);

    setInterval(()=>{
        $mark = createMarkIcon() || $mark;
    }
    , 200);

    const keyInfo = {
        pressed: new Set()
    };
    let isBoosting = false;
    document.addEventListener("keydown", e => {
        keyInfo.pressed.add(e.keyCode);
        if (keyInfo.pressed.has(16) && keyInfo.pressed.has(17)) {
            if (!isBoosting) {
                isBoosting = true;
                const reload = () => {
                    if (isBoosting) {
                        reloadTL($mark);
                        setTimeout(reload, 500)
                    }
                }
                reload();
            }
        } else {
            isBoosting = false;
        }
    });
    document.addEventListener("keyup", e => {
        keyInfo.pressed.delete(e.keyCode);
        isBoosting = false;
    });

}
)();

function createMarkIcon() {
    const $header = document.querySelector("main h2")
    if ($header && !$header.querySelector(".msmn-Twitter_AutoReload-icon")) {
        const $mark = document.createElement("span");
        $mark.classList.add("msmn-Twitter_AutoReload-icon");
        $mark.style.display = "inline-block";
        $mark.style.width = "1em";
        $mark.style.height = "1em";
        $mark.style.backgroundColor = "rgb(100, 200, 255)";
        $mark.style.borderRadius = "1em";
        $mark.style.transition = ".5s";

        $header.insertBefore($mark, $header.children[0]);

        return $mark;
    }
}

function removeOtherAccounts(displayAccounts) {
    setTimeout(()=>{
        const $articleWraps = document.querySelectorAll('section[role="region"]>div>div>div');

        const displayAccountSet = new Set(displayAccounts);
        for (let $articleWrap of $articleWraps) {
            const $article = $articleWrap.querySelector("article");
            if ($article) {
                const accountId = $article.querySelector('[data-testid="tweet"]>div:nth-child(2)>div:nth-child(1)>div>div:nth-child(1)>div:nth-child(1)>div:nth-child(1)>a>div>div:nth-child(2)>div>span').textContent.slice(1);
                if (displayAccountSet.has(accountId)) {} else {
                    if ($articleWrap.getBoundingClientRect().top <= window.innerHeight)
                        console.log("removed"),
                        $articleWrap.remove();
                }
            }
        }
    }
    , 900);
}

function reloadTL($mark) {
    if ($mark === void 0) throw new Error("引数 $mark が与えられていません。");
    const $button_reload = document.querySelector('main h2')?.parentElement?.parentElement;
    if ($button_reload != null) {
        console.log("tried reloading");
        try {
            $button_reload.click();
        } catch(e) {
            console.log(e);
        }
        if ($mark) {
            $mark.style.transition = "0s";
            setTimeout(()=>{
                $mark.style.backgroundColor = "rgb(255, 200, 100)";
                setTimeout(()=>{
                    $mark.style.transition = ".5s";
                    $mark.style.backgroundColor = "rgb(100, 200, 255)"
                }
                , 100);
            }
            )
        }
    }
}