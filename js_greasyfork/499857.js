// ==UserScript==
// @name         soc
// @namespace    http://tampermonkey.net/
// @version      7239
// @description  空投
// @author       开启数字空投财富的发掘之旅
// @match        https://odyssey.sonic.game/task/check-in
// @match        https://web.telegram.org/k/#@EggDrop_GombleBot
// @match        *://*.odyssey.sonic.game/*
// @match        https://testnet.humanity.org/login
// @match        *://*.web.telegram.org/*
// @match        *://*.bithub.77-bit.com/*
// @match        https://testnet.tower.fi/faucet
// @match        *://*.www.coresky.com/*
// @match        *://*.share.coresky.com/*
// @match        *://*.privy.abs.xyz/*
// @match        *://*.app.mahojin.ai/*
// @match        https://stake.apr.io/*
// @match        *://*.api.x.com/*
// @match        *://*.www.parasail.network/*
// @match        https://monadscore.xyz/*
// @match        *://*.0xvm.com/*
// @match        https://hub.beamable.network/modules/*
// @match        *://app.crystal.exchange/*
// @match        *://testnet.somnia.network/*
// @match        *://*.cess.network/*
// @match        *://*.monad-test.kinza.finance/*
// @match        *://*.www.youtube.com/*
// @match        *://*.earn.taker.xyz/*
// @match        *://*.testnet.humanity.org/*
// @match        https://validators.0xvm.com/
// @match        https://0xvm.com/honor
// @match        https://sosovalue.com/exp
// @match        https://sosovalue.com/ja/exp
// @match        https://sosovalue.com/*/exp
// @match        https://earn.taker.xyz/
// @match        https://www.magicnewton.com/portal/rewards
// @match        https://www.communitygaming.io/*
// @match        *://*.app.jogojogo.game/*
// @match        https://testnet.humanity.org/dashboard
// @match        https://cryptopond.xyz/modelfactory/detail/306250?tab=4&newTopic=true
// @match        https://cryptopond.xyz/ideas
// @match        https://cryptopond.xyz/modelfactory/detail/306250?tab=4
// @match        https://quest.redactedairways.com/home
// @match        https://cryptopond.xyz/ideas/create
// @match        https://testnet-faucet.reddio.com
// @match        https://cryptopond.xyz/points?tab=competition
// @match        https://cryptopond.xyz/points?tab=idea
// @match        https://wallet.litas.io/miner
// @match        https://wallet.litas.io/login
// @match        https://cryptopond.xyz/ideas/*
// @match       https://dashboard.layeredge.io/
// @match        *://*.x.com/*
// @match        https://app.olab.xyz/*
// @match        *://*.cryptopond.xyz/*
// @match        *://*.breadnbutter.fun/login*
// @match        *://accounts.google.com/*
// @match        *://*.twitter.com/*
// @match        *://*.tampermonkey.net/*
// @match        https://cess.network/merkle/*
// @match        https://m.breadnbutter.fun/home
// @match        *://*.blockx.fun/*
// @match        https://m.breadnbutter.fun/login
// @match        *://*.infinity.theoriq.ai/*
// @match        *://*.sidequest.rcade.game/*
// @match        *://*.space3.gg/*
// @match        *://*.genesis.chainbase.com/*
// @match        *://*.baidu.com/*
// @match        *://*.mission.swanchain.io/*
// @match        *://*.backpack.app/*
// @match        *://*.task.onenesslabs.io/*
// @match        *://*.glob.shaga.xyz/*
// @match        *://*.avalon.online/*
// @match        *://*.pentagon.games/*
// @match        *://*.app.infinityai.network/*
// @match        *://*.points.reddio.com/*
// @match        *://*.communitygaming.io/*
// @match        *://*.adamdefi.io/*
// @match        https://tenzen.ten.xyz/
// @match        *://*.testnet.kappalending.com/*
// @match        *://*.testnet.zulunetwork.io/*
// @match        *://*.testnet.grofidex.io/*
// @match        *://*.u2quest.io/*
// @match        *://*.faucet.uniultra.xyz/*
// @match        *://*.testnet.blockfun.io/*
// @match        *://*.miles.plumenetwork.xyz/*
// @match        *://www.baidu.com/*
// @match        *://*.plume.ambient.finance/*
// @match        *://*.faucet.plumenetwork.xyz/*
// @match        *://*.theiachat.chainbase.com/*
// @match        *://*.genesis.chainbase.com/*
// @match        *://*.landshare-plume-sandbox.web.app/*
// @match        *://*.plume.kuma.bond/*
// @match        https://testnet.dashboard.burnt.com/*
// @match        https://miles.plumenetwork.xyz/nest-staking
// @match        https://miles.plumenetwork.xyz/plume-arc
// @match        https://app.mysticfinance.xyz/en/lend
// @match        https://dev-plume.landx.co/
// @match        https://app.elyfi.world/pools/plumetestnet/10
// @match        https://app.solidviolet.com/tokens/1
// @match        https://adamdefi.io/swap
// @match        https://dev-plume.landx.co/products/xBasket
// @match        https://pentagon.games/sign-in
// @match        https://testnet.musicprotocol.finance/
// @match        https://testnet.kappalending.com/#/market
// @match        https://app.pluralfinance.com/plume-testnet/?signed_in=true
// @match        https://app.pluralfinance.com/plume-testnet/
// @match        https://testnet.zulunetwork.io/lwazi?code=6S4TVJ
// @match        https://x.com/Wizzwoods_game*
// @match        https://twitter.com/Wizzwoods_game*
// @match        https://glob.shaga.xyz/main
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/499857/soc.user.js
// @updateURL https://update.greasyfork.org/scripts/499857/soc.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (window.location.hostname !== 'cryptopond.xyz') {
        return;
    }
    
    //document.body.style.zoom = '50%';

    setInterval(() => {
        var targetURL = 'https://cryptopond.xyz/modelfactory/detail/[id]'
        if (window.location.href === targetURL) {
            console.log("✅ 当前页面匹配，启动 60 秒自动刷新...");

            setInterval(() => {
                window.open('https://cryptopond.xyz/modelfactory/detail/306250?tab=4', '_self'); // 重定向
            }, 6000);
        }
    }, 5000);

    const clame =setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.includes('Sign in with Google') &&
                !button.hasAttribute('disabled')) {
                console.log('找到可点击的按钮，正在点击...');
                button.click();

            }
        });
    }, 5000);
})();

(function() {
    var targetURL = 'https://app.union.build/faucet'
    if (window.location.href === targetURL) {
        console.log("✅ 当前页面匹配，启动 60 秒自动刷新...");

        setInterval(() => {
            console.log("🔄 正在刷新页面...");
            location.reload();
        }, 60000);
    }
 })();

(function() {
    'use strict';

    // 定义目标表单的 action URL 模式
    const oauthFormActionPattern = /https:\/\/x\.com\/oauth\/authorize/;

    // 页面加载完成后执行
    window.addEventListener('load', function() {
        // 获取页面中所有 <form> 标签
        const forms = document.getElementsByTagName('form');
        let hasOauthForm = false;

        // 遍历所有表单，检查是否匹配 OAuth 授权
        for (let form of forms) {
            if (oauthFormActionPattern.test(form.action)) {
                hasOauthForm = true;
                console.log('找到 OAuth 授权表单:', form.action);
                break;
            }
        }

        // 如果找到 OAuth 表单，尝试点击 id 为 "allow" 的按钮
        if (hasOauthForm) {
            const allowButton = document.getElementById('allow');
            if (allowButton) {
                console.log('找到授权按钮，正在点击...');
                allowButton.click();
            } else {
                console.log('未找到 id="allow" 的授权按钮');
            }
        } else {
            console.log('未找到 OAuth 授权表单');
        }
    });
})();

HTMLElement.prototype.randomClick = function() {
    const rect = this.getBoundingClientRect();

    // 计算随机点击位置
    const xOffset = Math.random() * rect.width;
    const yOffset = Math.random() * rect.height;
    const x = rect.left + xOffset;
    const y = rect.top + yOffset;

    // 创建并触发点击事件
    this.dispatchEvent(new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        clientX: x,
        clientY: y
    }));
};

function checkTextContent(selector, expectedText) {
    try {
        var element = document.querySelector(selector);
        if (element.textContent.trim() === expectedText) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
    }
}
const clickEvent = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
});

function refreshPageRandomly() {
    const minSeconds = 150;
    const maxSeconds = 200;
    const randomSeconds = Math.floor(Math.random() * (maxSeconds - minSeconds + 1)) + minSeconds;
    setTimeout(function() {
        location.reload();
    }, randomSeconds * 1000);
}

const originalStringify = JSON.stringify;

(function() {
    'use strict';

    // Check if the current URL is the desired one
    const targetUrl = 'https://cryptopond.xyz/modelfactory/detail/306250?tab=4';
    if (window.location.href !== targetUrl) {
        return; // Exit the script if the URL does not match
    }

    // Function to handle the div click
    function handleDivClick(event) {
        const parentDiv = event.currentTarget; // The div that was clicked
        // Perform the actions you want when the div is clicked
        console.log('Clicked the parent div:', parentDiv);
        // Add your additional code for div clicks here
    }

    // Function to handle button click
    function handleButtonClick(event) {
        event.stopPropagation(); // Prevent the event from bubbling up to the parent div
        const button = event.currentTarget;
        const parentDiv = button.closest('div'); // Adjust the selector if needed
        if (parentDiv) {
            parentDiv.click(); // Optionally, simulate a click on the parent div (if needed)
            console.log('Clicked the button:', button);
        }
    }

    // Function to check and add event listeners
    function checkForButtons() {
        const buttons = document.querySelectorAll('.chakra-button.css-18wgwna');
        const divs = document.querySelectorAll('div'); // Select all divs or a more specific selector

        if (buttons.length > 0) {
            buttons.forEach(button => {
                if (!button.dataset.listenerAdded) {
                    button.addEventListener('click', handleButtonClick);
                    button.dataset.listenerAdded = 'true'; // Mark listener as added
                    console.log('Added click listener to button:', button);
                }
            });
        }

        if (divs.length > 0) {
            divs.forEach(div => {
                if (!div.dataset.listenerAdded) {
                    div.addEventListener('click', handleDivClick);
                    div.dataset.listenerAdded = 'true'; // Mark listener as added
                    console.log('Added click listener to div:', div);
                }
            });
        }
    }

    // Set an interval to check for the button every 1 second
    const interval = setInterval(checkForButtons, 1000);


})();

(function() {
    var falg = false;var falg1 = false;var falg2 = false;var falg3 = true;var falg4 = true;
    var falg5 = true;var falg6 = true;var falg7 = false;var falg8 = true;var falg9 = true;
    var falg10 = true;var falg11 = true;var falg12 = true;var falg13 = false;var falg14 = false;
    var falg15 = false;var falg16 = false;var falg17 = true;var falg18 = true;var falg19 = true;
    var falg20 = true;var falg21 = true;var falg22 = true;var falg23 = true; var falg24 = true;
    var falg25 = true;var falg26 = true;var falg27 = true;var falg28 = true;const baseId = 'radix-\\:r';var j = 1;
    const start = 1;const end = 10;var falg29 = true;var falg30 = true;var falg31 = true;var falg32 = true;var falg33 = true;var falg34= true;
    'use strict';
    var swback = true;
    var falgClick = false;
    let elapsedTime = 0
    let i = sessionStorage.getItem('i');
// 用于标记是否已经连接的全局变量
    let isConnected = false;
    // 用于标记是否已经执行过第一次连接操作的全局变量
    let firstConnectionAttempted = false;
    function performPostConnectionAction() {
        // 查找第二个连接按钮并点击它
        let secondButton = document.querySelector('button[data-testid="rk-account-button"]');
        if (secondButton) {
            secondButton.click();
            console.log('执行连接后的后续操作（点击第二个按钮）');
        } else {
            console.log('未找到第二个连接按钮');
        }
    }

    var d = 0;
    var s = 0;
    var c = true;
    var c1 = 0;
    var e = true;
    var e1 = 0;
    setInterval(() => {
        if (document.readyState === "complete") {
            if (window.location.href == 'https://points.reddio.com/task' || window.location.href == 'https://points.reddio.com/task?invite_code=2IFX9'){
                window.open('https://app.nexus.xyz/', '_self')
            }
        }
    },100000)
    const Connect = setInterval(() => {
        if (document.readyState === "complete") {
            if (window.location.href == 'https://points.reddio.com/task' || window.location.href == 'https://points.reddio.com/task?invite_code=2IFX9'){
                const buttons = document.querySelectorAll('button');
                buttons.forEach(button => {
                    if (button.textContent.includes('CONNECT') &&
                        !button.hasAttribute('disabled')) {
                        button.click();
                        clearInterval(Connect)
                    }
                });
            }
        }
    },1000)
    setInterval(() => {
        if (document.readyState === "complete") {

            if (window.location.href == 'https://points.reddio.com/task' || window.location.href == 'https://points.reddio.com/task?invite_code=2IFX9'){
                // 查找包含特定任务的元素
                const tasks = document.querySelectorAll('div._7hms063 div._7hms066 span');

                tasks.forEach(task => {
                    if (task.textContent.includes('Daily Task: Claim RED tokens from the Testnet Faucet')) {
                        const taskDiv = task.closest('div._7hms063');
                        const goButton = taskDiv.querySelector('button._7hms069');
                        if (goButton && c) {
                            goButton.click();
                            c1++;
                            if(c1>=2){c=false}
                        }
                    }
                    if (task.textContent.includes('Daily Task: Execute one Bridge transaction')) {
                        const taskDiv = task.closest('div._7hms063');
                        const goButton = taskDiv.querySelector('button._7hms069');
                        if (goButton && e) {
                            goButton.click();
                            e1++;
                            if(e1>=2){e=false}
                        }
                    }
                    if (task.textContent.includes('Complete one Testnet transfer on your wallet')) {
                        const taskDiv = task.closest('div._7hms063');
                        const goButton = taskDiv.querySelector('button._7hms069');
                        if (goButton) {
                            goButton.click();
                            s++;
                        }else{
                            if(!c && !e){
                                window.open('https://app.nexus.xyz/', '_self')
                            }
                        }
                        if(s>4){
                           window.open('https://app.nexus.xyz/', '_self');
                        }
                    }
                });
            }
        }
    },6000)
    setInterval(() => {
        if (window.location.href === 'https://app.infinityai.network/campaign/7') {
            var eam ="body > div:nth-child(1) > main > div.chakra-stack.css-1yxzzu5 > div > div > header > div > div.chakra-stack.css-1p1s3e6 > div.chakra-stack.css-hg4op0 > a:nth-child(1)"
            simulateButtonClick(eam)
        }
        if (window.location.href == 'https://odyssey.sonic.game/task/ring-lottery' && falg){
            refreshPageRandomly();
            var num = document.querySelector("body > div.flex.flex-col.md\\:flex-row > div.flex.flex-col.w-full.md\\:w-4\\/5.px-4.py-8.md\\:px-\\[120px\\].md\\:py-\\[120px\\] > div > div.flex.flex-col-reverse.md\\:flex-col.mt-0 > div.flex.flex-row.items-start.gap-20.mt-8.md\\:mt-20 > div.flex-wrap.flex-row.gap-10.border.border-solid.border-white\\/20.text-white\\/60.relative.px-10.py-10.rounded-xl.w-\\[470px\\].hidden.md\\:flex > div > div > div > div.w-full.flex.flex-row.justify-between > div > button > span")
            const confirmButton = Array.from(document.querySelectorAll('button')).find(button => button.textContent === 'Confirm' || button.textContent === 'Continue');
            if (confirmButton) {
                confirmButton.dispatchEvent(clickEvent);JSON.stringify({ clicked: true, confirmButton: confirmButton.outerHTML })
            }
            if(i>=30){
                sessionStorage.setItem('i', 1);
                //window.open('https://odyssey.sonic.game/task/milestone', '_self');
            }
            for (let i = start; i <= end; i++) {
                const dynamicId = `${baseId}${i}\\:`;
                const element = document.querySelector(`#${dynamicId}`);
                if (element) {
                    falg34=false;
                    j=1;
                }
                if(!element){
                    j++;
                }
                if(j>=9){
                    falg34=true;
                }
            }
            if(falg34 && falg){
                var draw = document.querySelector("body > div.flex.flex-col.md\\:flex-row > div.flex.flex-col.w-full.md\\:w-4\\/5.px-4.py-8.md\\:px-\\[120px\\].md\\:py-\\[120px\\] > div > div.flex.flex-col-reverse.md\\:flex-col.mt-0 > div.flex.flex-row.items-start.gap-20.mt-8.md\\:mt-20 > div.flex-wrap.flex-row.gap-10.border.border-solid.border-white\\/20.text-white\\/60.relative.px-10.py-10.rounded-xl.w-\\[470px\\].hidden.md\\:flex > div > div > div > button")
                if (draw) {
                    i++;
                    if(i===null){
                        sessionStorage.setItem('i','1');
                    }
                    sessionStorage.setItem('i', i.toString());
                    console.log("点击了一次");
                    draw.dispatchEvent(clickEvent);JSON.stringify({ clicked: true, draw: draw.outerHTML })
                }
            }
        }

        //REDDIO
        var paly = document.querySelector("#app > section > main > div.w-100 > div > div.body.mb-100 > div.reward-card.w-100 > div > div.reward-card-btn.btn.font-20")
        if(paly && falg){
            falg=false;
            paly.dispatchEvent(clickEvent);
            JSON.stringify({ clicked: true, paly: paly.outerHTML });
        }
        if (window.location.href === 'https://mission.swanchain.io/?invitYT0UDcz') {
            var btn2 = document.querySelector("#tab-SocialMission");
            if (btn2 && falg34) {
                falg34=false;
                btn2.click()
                btn2.addEventListener('focus', function() {
                    console.log('Button focused');
                });
                btn2.addEventListener('blur', function() {
                    console.log('Button blurred');
                });
                btn2.addEventListener('keydown', function(event) {
                    console.log('Key down event:', event.key);
                });
            }
        }
        //}

        if (window.location.href === 'https://odyssey.sonic.game/task/mystery-nft') {
            setTimeout(function() {
                window.open('https://odyssey.sonic.game/task/milestone', '_self');
            }, 200000);
            var btnmin = document.querySelector("body > div.flex.flex-col.md\\:flex-row > div.flex.flex-col.w-full.md\\:w-4\\/5.px-4.py-8.md\\:px-\\[120px\\].md\\:py-\\[120px\\] > div > div:nth-child(3) > div.hidden.md\\:flex.flex-col.gap-6.mt-20 > div:nth-child(1) > div > div > div.w-full.xl\\:w-auto.flex.gap-2 > button.items-center.justify-center.whitespace-nowrap.ring-offset-background.focus-visible\\:outline-none.focus-visible\\:ring-2.focus-visible\\:ring-ring.focus-visible\\:ring-offset-2.disabled\\:pointer-events-none.disabled\\:opacity-30.disabled\\:cursor-not-allowed.px-4.py-2.inline-flex.gap-1.w-1\\/2.xl\\:w-\\[102px\\].h-12.text-base.text-white.font-semibold.font-orbitron.rounded.transition-all.duration-300.bg-\\[\\#0000FF\\].hover\\:bg-\\[\\#0000FF\\]\\/80.active\\:bg-\\[\\#0000FF\\]\\/60");
            var afbtn = document.querySelector("body > div.flex.flex-col.md\\:flex-row > div.flex.flex-col.w-full.md\\:w-4\\/5.px-4.py-8.md\\:px-\\[120px\\].md\\:py-\\[120px\\] > div > div:nth-child(3) > div.hidden.md\\:flex.flex-col.gap-6.mt-20 > div:nth-child(1) > div > div > div.w-full.xl\\:w-auto.flex.gap-2 > button.items-center.justify-center.whitespace-nowrap.ring-offset-background.focus-visible\\:outline-none.focus-visible\\:ring-2.focus-visible\\:ring-ring.focus-visible\\:ring-offset-2.disabled\\:pointer-events-none.disabled\\:opacity-30.disabled\\:cursor-not-allowed.px-4.py-2.inline-flex.gap-1.w-1\\/2.xl\\:w-\\[102px\\].h-12.text-base.text-white.font-semibold.font-orbitron.rounded.transition-all.duration-300.bg-\\[\\#0000FF\\]\\/80.hover\\:bg-\\[\\#0000FF\\].opacity-30.cursor-not-allowed > svg");
            if (btnmin && !afbtn) {
                window.focus();
                i++;
                if(i===null){
                    sessionStorage.setItem('i','1');
                }
                btnmin.click();
                JSON.stringify({ clicked: true, btnmin: btnmin.outerHTML });
                sessionStorage.setItem('i', i.toString());
            }
        }
        if (document.readyState === "complete") {
            if (window.location.href.includes('https://odyssey.sonic.game/task/milestone') || window.location.href.includes('https://odyssey.sonic.game/task/check-in') || window.location.href.includes('https://odyssey.sonic.game/task/mystery-nft')) {
                var conwall = document.querySelector("body > nav > div > div.gap-6.xl\\:gap-8.flex.items-center > button.inline-flex.whitespace-nowrap.rounded.ring-offset-background.focus-visible\\:outline-none.focus-visible\\:ring-2.focus-visible\\:ring-ring.focus-visible\\:ring-offset-2.disabled\\:pointer-events-none.disabled\\:opacity-30.disabled\\:cursor-not-allowed.px-4.py-2.min-w-\\[90px\\].h-8.xl\\:min-w-\\[200px\\].md\\:10.xl\\:h-12.justify-center.items-center.bg-\\[\\#0000FF\\].font-orbitron.font-bold.text-white.text-sm.md\\:text-sm.xl\\:text-base.transition-all.duration-300.hover\\:bg-\\[\\#0000FF\\]\\/80.active\\:bg-\\[\\#0000FF\\]\\/60.cursor-pointer")
                if(!conwall){
                    falg=true;
                }
                if(conwall){
                    conwall.dispatchEvent(clickEvent);JSON.stringify({ clicked: true, conwall: conwall.outerHTML });
                    falg=false;
                }
                // 获取包含钱包列表的ul元素
                var walletList = document.querySelector('div[role="dialog"] ul');

                if (walletList) {
                    // 获取所有的li元素
                    var walletItems = walletList.querySelectorAll('li');

                    // 遍历所有的li元素
                    walletItems.forEach(function(item) {
                        // 查找包含钱包名称的span元素
                        var walletName = item.querySelector('div.flex.items-center span');

                        // 查找"Connect"或"Install"按钮
                        var walletButton = item.querySelector('div.inline-flex, a.inline-flex');

                        if (walletName && walletName.textContent.trim() === 'Backpack' && walletButton) {
                            // 触发点击事件
                            walletButton.dispatchEvent(clickEvent);
                            console.log('Clicked on Backpack wallet button');
                            console.log(JSON.stringify({ clicked: true, walletButton: walletButton.outerHTML }));
                        }
                    });
                } else {
                    console.log('Wallet list not found');
                }
                if(falg){
                    var contion = document.querySelector("#radix-\\:rq\\: > div:nth-child(2) > button.inline-flex.items-center.justify-center.whitespace-nowrap.rounded.text-sm.font-medium.ring-offset-background.focus-visible\\:outline-none.focus-visible\\:ring-2.focus-visible\\:ring-ring.focus-visible\\:ring-offset-2.disabled\\:pointer-events-none.disabled\\:opacity-30.disabled\\:cursor-not-allowed.px-4.py-2.w-full.h-12.bg-\\[\\#0000FF\\].hover\\:bg-\\[\\#0000FF\\]\\/80.active\\:bg-\\[\\#0000FF\\]\\/50.text-white.font-orbitron.transition-colors.duration-300.mt-12")
                    if(contion){
                        contion.dispatchEvent(clickEvent);
                        console.log(JSON.stringify({ clicked: true, contion: contion.outerHTML }));
                    }
                    var checkInButton = document.querySelector("body > div.flex.flex-col.md\\:flex-row > div.flex.flex-col.w-full.md\\:w-4\\/5.px-4.py-8.md\\:px-\\[120px\\].md\\:py-\\[120px\\] > div > div:nth-child(3) > div.flex.flex-wrap.flex-row.gap-10.border.border-solid.border-white\\/20.text-white\\/60.max-w-\\[1024px\\].md\\:mt-20.w-full.relative.p-6.md\\:p-10.rounded-none.md\\:rounded-xl > div > div > div.hidden.md\\:flex.flex-row.items-center.justify-between > button");
                    if (checkInButton) {
                        if (!checkInButton.disabled && !checkInButton.classList.contains('opacity-30')) {
                            checkInButton.dispatchEvent(clickEvent);

                            console.log('Clicked on Check-in button');
                            console.log(JSON.stringify({ clicked: true, buttonHTML: checkInButton.outerHTML }));
                        } else {
                            if (window.location.href == 'https://odyssey.sonic.game/task/check-in') {
                                function checkMysteryBoxCount() {
                                    const xpath = "//*[@id='radix-:r0:']/div/div/div[1]/div[1]/div/div/div/div[1]/span";
                                    const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
                                    const element = result.singleNodeValue;

                                    if (element) {
                                        const count = element.textContent.trim();
                                        console.log(`Mystery box count: ${count}`);
                                        if (count === '0') {
                                            console.log("No mystery boxes available");
                                            return true; // 设置 falg1 为 true
                                        }
                                    } else {
                                        console.log("Couldn't find mystery box count element");
                                    }
                                    return false;
                                }

                                function checkAndSetFlag() {
                                    if (window.location.href === 'https://odyssey.sonic.game/task/check-in') {
                                        const RES=checkMysteryBoxCount();
                                        if (RES) {
                                            falg1=true;
                                            // 这里可以添加其他需要执行的操作
                                        }
                                    }
                                }
                                setInterval(() => {
                                    if(!falg1){
                                        checkAndSetFlag();
                                    }
                                },1000);

                                window.addEventListener('load', checkAndSetFlag);
                            }
                            if(!falg1){
                                openAllMysteryBoxes().then(() => {
                                    console.log("Script execution completed");
                                }).catch((error) => {
                                    console.error("Unhandled error in script execution:", error);
                                });
                            }
                        }
                    } else {
                        console.log('Check-in button not found');
                    }
                    // 通用点击函数
                    function clickElement(selector) {
                        return new Promise((resolve, reject) => {
                            const element = document.querySelector(selector);
                            if (element && !falg1) {
                                console.log(falg1);
                                element.dispatchEvent(clickEvent);
                                console.log(`Clicked element: ${selector}`);
                                console.log(JSON.stringify({ clicked: true, element: element.outerHTML }));
                                setTimeout(resolve, 2000);
                            } else {
                                console.log(`Element not found: ${selector}`);
                                //reject(new Error(`Element not found: ${selector}`));
                            }
                        });
                    }
                    function elementExists(selector) {
                        return document.querySelector(selector) !== null;
                    }

                    function waitForElementToDisappear(selector, timeout = 30000) {
                        return new Promise((resolve) => {
                            const startTime = Date.now();
                            const checkElement = () => {
                                if (!elementExists(selector)) {
                                    resolve();
                                } else if (Date.now() - startTime > timeout) {
                                    console.log(`Timeout waiting for element to disappear: ${selector}`);
                                    resolve();
                                } else {
                                    setTimeout(checkElement, 500);
                                }
                            };
                            checkElement();
                        });
                    }

                    // 主函数
                    async function openAllMysteryBoxes() {
                        try {
                            // 检查是否已经在开盒子页面
                            if (!elementExists("#radix-\\:rn\\:")) {
                                console.log("Starting to open mystery boxes");
                                // 点击右上角的开盒子按钮
                                await clickElement("body > nav > div > div.gap-6.xl\\:gap-8.flex.items-center > button:nth-child(1)");
                                await new Promise(resolve => setTimeout(resolve, 2000));

                                // 点击"Open Mystery Box"按钮
                                await clickElement("#radix-\\:r0\\: > div > div > div.w-full.h-full.absolute.transition-transform.duration-300.translate-x-0 > div.flex.flex-col.px-4.pb-6.pt-2.md\\:py-6 > button");
                                await new Promise(resolve => setTimeout(resolve, 2000));
                            } else {
                                console.log("Already on the mystery box page");
                            }

                            // 选择"Open All"选项
                            await clickElement("#radix-\\:rn\\: > div:nth-child(2) > div.group.flex.flex-row.justify-between.text-base.rounded.border.border-solid.px-5.py-4.cursor-pointer.hover\\:border-\\[\\#FBB042\\].transition-colors.border-white\\/50.bg-transparent");
                            await new Promise(resolve => setTimeout(resolve, 1000));

                            // 点击"Open"按钮确认
                            await clickElement("#radix-\\:rn\\: > div:nth-child(4) > button.inline-flex.items-center.justify-center.whitespace-nowrap.rounded.text-sm.font-medium.ring-offset-background.focus-visible\\:outline-none.focus-visible\\:ring-2.focus-visible\\:ring-ring.focus-visible\\:ring-offset-2.disabled\\:pointer-events-none.disabled\\:opacity-30.disabled\\:cursor-not-allowed.text-primary-foreground.h-10.px-4.py-2.transition-all.duration-300.cursor-pointer.bg-\\[\\#0000FF\\].hover\\:bg-\\[\\#0000FF\\]\\/80.active\\:bg-\\[\\#0000FF\\]\\/60");

                            console.log("Waiting for mystery box operation to complete...");
                            await waitForElementToDisappear("#radix-\\:rn\\:");
                            console.log("Mystery box operation completed or timed out");

                            console.log("All mystery boxes opened successfully");
                        } catch (error) {
                            console.error("Error opening mystery boxes:", error);
                        }
                    }

                }
            }
        }
        let Number = Math.floor(Math.random() * 5) + 1;
        var sw ="#root > header > div > div > div:nth-child(2) > div > button"
        if(!falg){simulateButtonClick(sw).then((result) => {if(result){falg=true;}})}
        var user = document.querySelector("#radix-\\:rc\\: > div")
        if(user && user.innerHTML != "Select Wallet"){falg2=true;}
        var onebtn = document.querySelector("#root > div.max-w-7xl.mx-auto.min-h-\\[calc\\(100vh-132px\\)\\].p-3.md\\:p-6 > div > div.w-100 > div.w-full > div > div.flex.flex-col.p-5 > div > div > button:nth-child(1)")
        if(!falgClick && onebtn){
            falgClick=true;
            if(i===null){
                sessionStorage.setItem('i','1');
            }else{
                if(i<30){
                    onebtn.dispatchEvent(clickEvent);JSON.stringify({ clicked: true, onebtn: onebtn.outerHTML });i++;sessionStorage.setItem('i', i.toString());
                }else{
                    sessionStorage.removeItem('i');window.open('https://odyssey.sonic.game/task/milestone', '_self');
                }
            }
        }
        if(onebtn){setTimeout(function() {if(falg5){location.reload();}}, 50000);}
        var suss = document.querySelector("#root > div.max-w-7xl.mx-auto.min-h-\\[calc\\(100vh-132px\\)\\].p-3.md\\:p-6 > div > div.w-100 > div.w-full > div > div.flex.flex-col.p-5 > div > button > span > svg > path")
        if(suss){location.reload();}
    },3000)

    let followClickedCount = 0;
    const observer = new MutationObserver(() => {
        if (window.location.href.includes("x.com") || window.location.href.includes("twitter.com") || window.location.href.includes("discord.com") || window.location.href.includes("https://api.x.com/oauth/authorize")) {
            const currentUrl = new URL(window.location.href);
            const currentPath = currentUrl.pathname;
            let xComIndex = "";
            if(currentUrl.href.indexOf("x.com")){
                xComIndex=currentUrl.href.indexOf("x.com")
            }
            if(currentUrl.href.indexOf("api.x.com")){
                xComIndex=currentUrl.href.indexOf("api.x.com")
            }
            if(currentUrl.href.indexOf("discord.com")){
                xComIndex=currentUrl.href.indexOf("discord.com")
            }
            const hasTwoSegments = xComIndex !== -1 && (currentUrl.href.slice(xComIndex + 5).split('/').length - 1) >= 2 || currentUrl.href.includes('?') || currentUrl.href.includes('&');
            if(window.location.href.includes("x.com")){
                const popup = document.querySelector('div[data-testid="confirmationSheetDialog"]');
                if (popup) {
                    try {
                        const repostButton = Array.from(popup.querySelectorAll('*')).find(el => el.innerHTML.trim().includes('Repost') || el.innerHTML.trim().includes('Post'));
                        if (repostButton) {
                            setTimeout(() => {
                                repostButton.click();
                                setTimeout(() => {window.close();}, 6000);
                            }, 2000);
                        }
                    } catch (error) {
                        console.error("点击弹窗按钮时出错:", error);
                    }
                }

                const allElements = Array.from(document.querySelectorAll('*'));
                allElements.forEach(el => {
                    const buttonText = el.innerHTML.trim();
                    if (['Repost', 'Authorize app', '授权', 'Post', 'Like', 'Follow'].includes(buttonText) && el.tagName === 'BUTTON') {
                        setTimeout(() => {
                            el.click();
                            setTimeout(() => {window.close();}, 6000);
                        }, 2000);
                    }
                });
                const authorizeSpan = allElements.find(span => span.innerHTML.trim() === 'Authorize app' && span.tagName === 'SPAN');
                if (authorizeSpan) {
                    const button = authorizeSpan.closest('button');
                    if (button) {
                        setTimeout(() => {
                            button.click();
                            observer.disconnect();
                            setTimeout(() => {window.close();}, 6000);
                        }, 2000);
                    }
                }
                const followButton = allElements.find(el =>['Follow', 'Authorize app', 'Repost', 'Post', 'Like'].some(text => el.innerHTML.trim().includes(text)) && el.tagName === 'BUTTON');
                if (followButton) {
                    setTimeout(() => {
                        followButton.click();
                        observer.disconnect();
                        setTimeout(() => {window.close();}, 6000);
                    }, 2000);

                }
                const followInput = allElements.find(input =>input.tagName === 'INPUT' && input.type === 'submit' && ['Follow', 'Authorize app', 'Repost', 'Post', 'Like'].includes(input.value.trim()));
                if (followButton) {
                    setTimeout(() => {
                        followButton.click();
                        observer.disconnect();
                        setTimeout(() => {window.close();}, 6000);
                    }, 2000);
                }

                const specificInput = allElements.find(input => input.tagName === 'INPUT' && input.type === 'submit' && input.value === "Authorize app");
                if (specificInput) {
                    setTimeout(() => {
                        specificInput.click();
                        observer.disconnect();
                        setTimeout(() => {window.close();}, 6000);
                    }, 2000);
                }
            }
        }
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();

Object.defineProperty(JSON.stringify, 'name', { value: 'stringify' });

JSON.stringify.toString = originalStringify.toString.bind(originalStringify);

const randomDelay = Math.floor(Math.random() * (4500 - 500 + 1)) + 500;

const random = Math.floor(Math.random() * (2500 - 500 + 1)) + 500;

function simulateButtonClick(selector, expectedText = null) {
    return new Promise((resolve) => {const button = document.querySelector(selector);
        if (!button) {resolve(false);return;}
        if (expectedText !== null) {const buttonText = button.innerHTML.trim();
            if (buttonText === expectedText) {console.log("Button text matches expected text.");} else {console.log(`Button text does not match. Expected: "${expectedText}", Found: "${buttonText}"`);resolve(false);return;}}
        setTimeout(() => {
            button.dispatchEvent(clickEvent);
            JSON.stringify({ clicked: true, button: button.outerHTML });
            resolve(true);
        }, 4000);
    });
}

function a8(){
    safeClickWithTryCatch("#__next > main > div > div.header.a8-header-desktop--container > div > div > div > div:nth-child(2) > div > div:nth-child(1) > button > span:nth-child(2)");
    const elementsToClick = [1, 2 ,3, 4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
    for (const index of elementsToClick) {
        const selector = `#daily-checkin-container > div.space-3-row.css-5rvl8y > div.space-3-col.space-3-col-24.overlay-container.css-5rvl8y > div > div:nth-child(1) > div > div:nth-child(${index}) > div > div > div > div.space-3-col.space-3-col-24.col-align-end.overlay-container.checkin-reward-card__contents--thumb-container.css-5rvl8y > div > div > div > img`;
        safeClickWithTryCatch(selector);
        const sv = `#daily-checkin-container > div.space-3-row.css-5rvl8y > div.space-3-col.space-3-col-24.overlay-container.css-5rvl8y > div > div:nth-child(1) > div > div:nth-child(${index}) > div > div > div > div.space-3-col.space-3-col-24.col-align-end.overlay-container.checkin-reward-card__contents--thumb-container.css-5rvl8y > div.sp3-swiper-container.sp3-swiper-pagination-inner > div.swiper.swiper-initialized.swiper-horizontal.streak-reward-thumbs-sw-inner.swiper-backface-hidden > div > div > div > img`
        safeClickWithTryCatch(sv);
    }
}
function game(){
    safeClickWithTryCatch("body > div.ReactModalPortal > div > div > div > div > button > img");
    var btnspan = "#root > div > div > div.main > div.content > div > div.spin-container > div > button";
    safeClickWithTryCatch(btnspan);
    var spanTwo ="body > div.ReactModalPortal > div > div > div > div > button.spin-btn";
    safeClickWithTryCatch(spanTwo);
}

function safeClickWithTryCatch(targetElement) {
    try {
        var element = document.querySelector(targetElement);
        if (element) {
            element.dispatchEvent(clickEvent);
            JSON.stringify({ clicked: true, element: element.outerHTML });
            return true;
        }
    } catch (error) {
        return false;
    }
}

JSON.stringify = function(...args) {
    const randomSuffix = Math.random().toString(36).substring(2, 7);
    return originalStringify.apply(this, args);
};

function generateRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

const invalidEvent = new Event('invalid', { bubbles: true, cancelable: true });

function generateRandomNumberString(length) {
    const characters = '0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

function randomy(min, max) {
    return new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * (max - min + 1) + min)));
}

async function waitForElement(selector, timeout = 30000) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
        const element = document.querySelector(selector);
        if (element) {
            return element;
        }
        await randomy(50, 150);
    }
    throw new Error(`Element ${selector} not found within ${timeout}ms`);
}

async function simulateHumanClick(element) {
    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width / 2 + (Math.random() - 0.5) * 10;
    const y = rect.top + rect.height / 2 + (Math.random() - 0.5) * 10;

    element.dispatchEvent(new MouseEvent('mousemove', {
        bubbles: true,
        cancelable: true,
        clientX: x,
        clientY: y
    }));

    await randomy(50, 150);

    element.dispatchEvent(new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        clientX: x,
        clientY: y
    }));
}

async function simulatePaste(element, text) {
    const pasteEvent = new ClipboardEvent('paste', {
        bubbles: true,
        cancelable: true,
        clipboardData: new DataTransfer()
    });
    pasteEvent.clipboardData.setData('text/plain', text);
    element.dispatchEvent(pasteEvent);
    document.execCommand('insertText', false, text);
}

async function clickElement(selector, expectedText = null) {
    try {
        const element = await waitForElement(selector);
        if (expectedText) {
            const elementText = element.innerText.trim().toUpperCase();
            const expectedUpperText = expectedText.trim().toUpperCase();
            if (elementText !== expectedUpperText) {
                console.log(`Text mismatch: Expected "${expectedUpperText}", found "${elementText}"`);
                return false;
            }
        }
        await simulateHumanClick(element);
        console.log(`Clicked element: ${selector}`);
        return true;
    } catch (error) {
        console.error(`Error clicking element ${selector}:`, error);
        return false;
    }
}
function setNativeInputValue(element, value) {
    const prototype = Object.getPrototypeOf(element);
    const descriptor = Object.getOwnPropertyDescriptor(prototype, 'value');
    if (descriptor && descriptor.set) {
        descriptor.set.call(element, value);
    } else {
        element.value = value;
    }
    element.dispatchEvent(new Event('input', {bubbles:true}));
    element.dispatchEvent(new Event('change', {bubbles:true}));
}
async function inputText(selector, eventType, inputValue, isPaste = false) {
    try {
        const inputElement = await waitForElement(selector);

        if (inputElement.value !== '') {
            console.log(`Input field ${selector} is not empty. Skipping input.`);
            return false;
        }

        inputElement.focus();
        await randomy(100, 300);

        setNativeInputValue(inputElement, inputValue);

        inputElement.dispatchEvent(new Event(eventType, { bubbles: true, cancelable: true }));
        await randomy(100, 300);
        inputElement.blur();

        // 验证输入是否成功
        if (inputElement.value === inputValue.toString()) {
            console.log(`Input completed for ${selector}`);
            return true;
        } else {
            console.log(`Input verification failed for ${selector}`);
            return false;
        }
    } catch (error) {
        console.error(`Error inputting text for ${selector}:`, error);
        return false;
    }
}

(function() {
    var falg1 = true;
    var falg2 = true;
    var falg3 = true;
    var falg4 = true;
    var i = 0;
    let result = '';
    'use strict';
    setInterval(async () => {
        if (window.location.href == 'https://adamdefi.io/swap'){
            const swapSelector = "#__nuxt > div.default-wrap.min-h-screen.pb-24.font-poppins.flex.flex-col.items-stretch > div.main > div > div.panel > div:nth-child(2) > div:nth-child(2) > div.flex-1.pr-2 > input";
            if(falg4){
                falg4=false;
                const randomValue = generateRandomFloat(0.000015, 0.00002);
                const inputResult = await inputText(swapSelector, 'input', randomValue);
                if (inputResult) {
                    falg4 = false;
                }
                setTimeout(() => {
                    const inputswap = document.querySelector("#__nuxt > div.default-wrap.min-h-screen.pb-24.font-poppins.flex.flex-col.items-stretch > div.main > div > div.panel > div:nth-child(2) > div:nth-child(2) > div.flex-1.pr-2 > input")
                    if(inputswap){
                        if (inputswap.value===null) {
                            falg4=true;
                        }
                    }
                },30000)
            }
        }
        if (window.location.href == 'https://adamdefi.io/pool/add'){
             const poolSelector = "#__nuxt > div.default-wrap.min-h-screen.pb-24.font-poppins.flex.flex-col.items-stretch > div.main > div > div > div.panel.\\!pt-10 > div.mt-5 > div > div:nth-child(1) > div:nth-child(2) > div.flex-1.pr-2 > input";
            if(falg4){
                falg4=false;
                const randomValue = generateRandomFloat(0.00001, 0.000015);
                const inputResult = await inputText(poolSelector, 'input', randomValue);
                if (inputResult) {
                    falg4 = false;
                }
                setTimeout(() => {
                    const inputswappool = document.querySelector("#__nuxt > div.default-wrap.min-h-screen.pb-24.font-poppins.flex.flex-col.items-stretch > div.main > div > div.panel > div:nth-child(2) > div:nth-child(2) > div.flex-1.pr-2 > input")
                    if(inputswappool){
                        if (inputswappool.value===null) {
                            falg4=true;
                        }
                    }
                },30000)
            }
        }
        if (window.location.href === 'https://testnet.kappalending.com/#/market') {
            const popup = document.querySelector('.MuiDialogContent-root');
            if (popup) {
                const inputs = popup.querySelectorAll('input');
                inputs.forEach(input => {
                    const inputValue = parseFloat(input.value);
                    if (inputValue <= 0 || isNaN(inputValue)) {
                        input.focus();
                        const randomValue = generateRandomFloat(0.00001, 0.00001);
                        document.execCommand('insertText', false, randomValue.toString());
                        input.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                });
            }
        }
    }, 5000);
})();

(function() {
    'use strict';

    if (window.location.hostname === 'www.baidu.com') {
        console.log('Detected Baidu, opening BreadnButter in a new tab.');
        GM_openInTab('https://www.breadnbutter.fun', { active: true, insert: true });
    }

    if (window.location.hostname === 'www.breadnbutter.fun') {
        console.log('Detected BreadnButter page.');

        function randomDelay(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        function clickFirstElement() {
            const firstElement = document.evaluate('/html/body/div[3]/div[2]/div[2]/div/div[1]/div[4]/button', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (firstElement) {
                setTimeout(() => {
                    console.log('Clicking the first element...');
                    firstElement.click();
                    clickSecondElement();
                }, randomDelay(1000, 2000));
            } else {
                console.log('First element not found, retrying...');
                setTimeout(clickFirstElement, randomDelay(2000, 3000));
            }
        }

        function clickSecondElement() {
            const secondElement = document.evaluate('/html/body/div[3]/div[2]/div[2]/div/div[3]/div[4]/button[2]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (secondElement) {
                setTimeout(() => {
                    console.log('Clicking the second element...');
                    secondElement.click();
                }, randomDelay(1000, 2000));
            } else {
                console.log('Second element not found, retrying...');
                setTimeout(clickSecondElement, randomDelay(2000, 3000));
            }
        }

        window.addEventListener('load', () => {
            console.log('Page loaded, starting to click elements...');
            setTimeout(clickFirstElement, randomDelay(3000, 5000));
        });
    }
})();

(function() {
    'use strict';

    // 在百度主页上执行
    if (window.location.hostname === 'www.baidu.com') {
        console.log('Detected Baidu, opening XtremeVerse in a new tab.');
        GM_openInTab('https://xnet.xtremeverse.xyz/earn?index=1', { active: true, insert: true });
    }

    // 在XtremeVerse Earn页面上执行
    if (window.location.hostname === 'xnet.xtremeverse.xyz' && window.location.pathname === '/earn') {
        console.log('Detected XtremeVerse Earn page.');

        // 设置随机延时函数
        function randomDelay(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        // 确保点击成功，使用`.click()`，并检测点击后页面是否有变化
        function ensureClick(button, callback) {
            let retryCount = 0;

            function tryClick() {
                if (button) {
                    button.click();
                    console.log('Trying to click Verify button...');

                    // 检查按钮是否消失或状态是否改变
                    setTimeout(() => {
                        if (document.contains(button) && retryCount < 5) {  // 如果按钮还存在且重试次数小于5
                            retryCount++;
                            console.log(`Button still present, retrying click... (${retryCount})`);
                            tryClick();  // 再次尝试点击
                        } else if (retryCount >= 5) {
                            console.log('Max retries reached, moving to next step.');
                            if (callback) callback();  // 达到重试次数限制，继续下一步
                        } else {
                            console.log('Button successfully clicked and processed.');
                            if (callback) callback();  // 成功点击后继续
                        }
                    }, randomDelay(1000, 2000));  // 等待1到2秒后检查
                }
            }

            tryClick();
        }

        // 查找并点击所有 "Verify" 按钮
        function clickVerifyButtons(callback) {
            const verifyButtons = document.querySelectorAll('div.SocialFarming__FarmButton-sc-neia86-8.kJBPou');
            if (verifyButtons.length > 0) {
                console.log(`Found ${verifyButtons.length} Verify button(s), clicking them one by one.`);
                let index = 0;

                function clickNextVerifyButton() {
                    if (index < verifyButtons.length) {
                        setTimeout(() => {
                            ensureClick(verifyButtons[index], () => {
                                console.log(`Clicked Verify button ${index + 1}.`);
                                index++;
                                setTimeout(clickNextVerifyButton, randomDelay(2000, 3000));  // 间隔2到3秒点击下一个
                            });
                        }, randomDelay(1000, 2000));  // 初次点击延时1到2秒
                    } else {
                        console.log('All Verify buttons clicked, proceeding to next elements.');
                        if (callback) callback();  // 完成Verify按钮点击后，继续下一步
                    }
                }

                clickNextVerifyButton();
            } else {
                console.log('No Verify buttons found, proceeding to next elements.');
                if (callback) callback();  // 如果没有找到Verify按钮，直接进行下一步
            }
        }

        // 点击第一个元素
        function clickFirstElement() {
            const firstElement = document.evaluate('//*[@id="bodyNode"]/div[4]/div[1]/div/div[1]/div[2]/div[2]/div[2]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (firstElement) {
                setTimeout(() => {
                    console.log('Clicking the first element...');
                    firstElement.click();

                    // 点击完第一个元素后再点击所有Verify按钮
                    setTimeout(() => clickVerifyButtons(clickSecondElement), randomDelay(3000, 5000));
                }, randomDelay(1000, 2000));  // 延迟1到2秒后点击
            }
        }

        // 点击第二个元素
        function clickSecondElement() {
            const secondElement = document.evaluate('//*[@id="bodyNode"]/div[4]/div[1]/div/div[2]/div/div/div[2]/div[2]/div[2]/div/div/div/div[3]/div', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (secondElement) {
                setTimeout(() => {
                    console.log('Clicking the second element...');
                    secondElement.click();

                    // 点击第二个元素后等待并点击第三个元素
                    setTimeout(clickThirdElement, randomDelay(3000, 5000));  // 延迟3到5秒后点击第三个元素
                }, randomDelay(1000, 2000));  // 延迟1到2秒后点击
            }
        }

        // 点击第三个元素
        function clickThirdElement() {
            const thirdElement = document.evaluate('//*[@id="dialog-:r0:"]/div/div/div/div/div/div[3]/div[1]/div/button/span', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (thirdElement) {
                setTimeout(() => {
                    console.log('Clicking the third element...');
                    thirdElement.click();
                }, randomDelay(1000, 2000));  // 延迟1到2秒后点击
            }
        }

        // 页面加载完成后的操作
        window.addEventListener('load', () => {
            console.log('Page loaded, starting to click elements...');
            setTimeout(clickFirstElement, randomDelay(3000, 5000));  // 页面加载完成后延迟3到5秒后开始点击第一个元素
        });
    }
})();

(function() {
    'use strict';

    const targetPath = 'https://theiachat.chainbase.com/chat/';
    const targetPath1 = 'https://theiachat.chainbase.com/';

        // 定义按钮的选择器


        // 定义点击函数
        function clickButton(selector) {
            const button = document.querySelector(selector);
            if (button) {
                button.randomClick();
                return true;
            }
        }

    setInterval(() => {
        if (window.location.href.includes(targetPath) || window.location.href.includes(targetPath1)) {
            const button1Selector = "#root > div > div.w-full.flex.flex-col.flex-1.max-md\\:\\[\\&_\\*\\]\\.text-\\[14px\\].relative.min-h-\\[100vh\\] > div.flex.flex-1.flex-col.overflow-hidden > div > div.w-full.flex.flex-col.justify-center.md\\:w-\\[var\\(--chat-input-width\\)\\].m-auto.relative.max-xl\\:px-4 > div.mb-\\[1rem\\] > div > div > div:nth-child(1) > button";
            const button2Selector = "#dialogue-0x > div.feedback-container.flex.flex-grow-\\[100\\].\\32 xl\\:min-w-\\[320px\\].\\32 xl\\:max-w-\\[477px\\].border-solid.border-t-\\[\\#DFE4EC\\].max-2xl\\:border-t-1 > div > div > div > div > div > div > div:nth-child(3) > button";
            var con = document.querySelector("#root > div > div.w-full.flex.flex-col.flex-1.max-md\\:\\[\\&_\\*\\]\\.text-\\[14px\\].relative.min-h-\\[100vh\\] > nav > header > ul > li.text-medium.whitespace-nowrap.box-border.list-none.data-\\[active\\=true\\]\\:font-semibold.mx-4.my-2\\.5.connect-wallet > button")
            if(!con && document.querySelector("#root > div > div.w-full.flex.flex-col.flex-1.max-md\\:\\[\\&_\\*\\]\\.text-\\[14px\\].relative.min-h-\\[100vh\\] > nav > header > ul > li.text-medium.whitespace-nowrap.box-border.list-none.data-\\[active\\=true\\]\\:font-semibold.mx-4.my-2\\.5.connect-wallet > div")){
                clickButton(button1Selector);
                const result = clickButton(button2Selector);
                if(result){
                    setTimeout(() => {window.close();}, 3000);
                }
            }
        }
    }, 3000);

})();


(function() {
    'use strict';
    let foundButton = false;
    // 随机整数生成函数
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // 等待指定的毫秒数
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 等待特定的 CSS 选择器出现
    function waitForSelector(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const interval = 500; // 每 500ms 检查一次
            let elapsedTime = 0;

            const timer = setInterval(() => {
                const element = document.querySelector(selector);
                if (element) {
                    clearInterval(timer);
                    resolve(element);
                } else {
                    elapsedTime += interval;
                    if (elapsedTime >= timeout) {
                        clearInterval(timer);
                        reject(new Error(`等待选择器 ${selector} 超时`));
                    }
                }
            }, interval);
        });
    }

    // 等待特定的 XPath 出现
    function waitForXPath(xpath, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const interval = 500; // 每 500ms 检查一次
            let elapsedTime = 0;

            const timer = setInterval(() => {
                const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
                const element = result.singleNodeValue;
                if (element) {
                    clearInterval(timer);
                    resolve(element);
                } else {
                    elapsedTime += interval;
                    if (elapsedTime >= timeout) {
                        clearInterval(timer);
                        reject(new Error(`等待 XPath ${xpath} 超时`));
                    }
                }
            }, interval);
        });
    }

    // 主函数
    async function main() {
        console.log('脚本开始执行');

        // 区域1的选择器
        const area1Selector = '#social-quests > section:nth-child(1) > div.max-h-\\[320px\\].md\\:max-h-\\[260px\\].desktop\\:max-h-\\[340px\\].overflow-auto.md\\:max-w-\\[720px\\].desktop\\:max-w-\\[950px\\].mt-4.w-full.mx-auto > div > div:nth-child(1)';

        // 等待区域1出现
        let area1;
        try {
            area1 = await waitForSelector(area1Selector, 10000);
            console.log('区域1已找到');
        } catch (error) {
            console.error('未找到区域1，脚本结束');
            return;
        }

        // 定义循环执行的函数
        async function executeSteps() {
            while (true) {
                // 第一步：检查判断属性是否为0
                const attributeElement = area1.querySelector('span.text-primary');
                if (attributeElement && attributeElement.textContent.trim() === '0') {
                    console.log('判断属性为0，脚本结束');
                    break;
                } else {
                    console.log('判断属性不为0，开始执行第二步');

                    for (let i = 1; i <= 10; i++) {
                        const buttonXPath = `//*[@id="social-quests"]/section[2]/div/div/div[${i}]/div/div/button[1]`;
                        const button = document.evaluate(buttonXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

                        if (button) {
                            const buttonText = button.textContent.replace(/\s+/g, '').toLowerCase();
                            if (['like', 'retweet', 'follow', 'continue'].includes(buttonText)) {
                                // 确保按钮可见
                                button.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                // 等待一下
                                await delay(500);
                                // 使用更可靠的点击方法
                                button.focus();
                                button.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
                                console.log(`已点击按钮：${button.textContent.trim()}`);
                                foundButton = true;
                                break; // Exit loop after clicking the button
                            }
                        } else {
                            // 第二步：点击区域1中的元素1
                            const buttons = area1.querySelectorAll('button');
                            for (let button of buttons) {
                                const buttonText = button.textContent.replace(/\s+/g, '').toLowerCase();
                                if (['like', 'retweet', 'follow', 'continue'].includes(buttonText)) {
                                    // 确保按钮可见
                                    button.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                    // 等待一下
                                    await delay(500);
                                    // 使用更可靠的点击方法
                                    button.focus();
                                    button.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
                                    console.log(`已点击按钮：${button.textContent.trim()}`);
                                    foundButton = true;
                                    break;
                                }
                            }
                        }
                    }

                    if (!foundButton) {
                        console.log('未找到匹配的按钮，等待2秒后重试');
                        await delay(2000);
                        continue;
                    }

                    // 监测小窗口1的出现并处理
                    await handlePopup();

                    // 随机延迟1-2秒后继续下一次循环
                    const randomDelay = getRandomInt(1000, 2000);
                    console.log(`等待 ${randomDelay} 毫秒后继续`);
                    await delay(randomDelay);
                }
            }
        }

        // 处理小窗口1的函数
        async function handlePopup() {
            const popupXpath = '//*[@id="root"]/div/div[2]/div/div[4]/div';

            try {
                // 等待小窗口1出现
                let popup = await waitForXPath(popupXpath, 10000);
                console.log('小窗口1已出现');

                // 持续监测并点击小窗口1中的元素1
                while (true) {
                    // 重新获取 popup 元素，防止内容变化导致引用失效
                    popup = document.evaluate(popupXpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                    if (!popup) {
                        console.log('小窗口1已消失');
                        break;
                    }

                    const popupButtons = popup.querySelectorAll('button');
                    let foundPopupButton = false;
                    for (let button of popupButtons) {
                        const buttonText = button.textContent.replace(/\s+/g, '').toLowerCase();
                        if (['like', 'retweet', 'follow', 'continue'].includes(buttonText)) {
                            // 确保按钮可见
                            button.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            // 等待一下
                            await delay(500);
                            // 使用更可靠的点击方法
                            button.focus();
                            button.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
                            console.log(`已点击小窗口中的按钮：${button.textContent.trim()}`);
                            foundPopupButton = true;
                            // 等待一下以便处理后续动作
                            await delay(1000);
                            break;
                        }
                    }

                    if (!foundPopupButton) {
                        console.log('未找到小窗口中的匹配按钮，等待1秒后重试');
                        await delay(1000);
                    }
                }

            } catch (error) {
                console.error('未检测到小窗口1');
            }
        }

        // 开始执行步骤
        await executeSteps();

        console.log('脚本已完成');
    }

    if (window.location.href=='https://quest.redactedairways.com/home'){
        // 等待页面完全加载后执行主函数
        window.addEventListener('load', () => {
            // 随机延迟1-3秒后开始执行
            const initialDelay = getRandomInt(1000, 3000);
            console.log(`页面加载完成，等待 ${initialDelay} 毫秒后开始执行脚本`);
            setTimeout(() => {
                main();
            }, initialDelay);
        });
    }

})();


(function() {
    'use strict';
    // Function to check if the URL contains a specific Google account path
    function checkGoogleAccountPath() {
        if (window.location.href.includes('https://accounts.google.com')) {
            console.log('URL contains Google account path.');
            // Find and click the div containing an email address
            const emailDiv = document.querySelector('div[data-email*="@gmail.com"]');
            if (emailDiv) {
                emailDiv.click();
                console.log('Clicked the div containing an email address.');
            }
        }
    }

    // Function to click a button with text "Continue"
    function clickContinueButton() {
        const continueButton = Array.from(document.querySelectorAll('button')).find(button => button.textContent.includes('Continue') || button.textContent.includes('Doorgaan') || button.textContent.includes('Continuar'));
        if (continueButton) {
            continueButton.click();
            console.log('Clicked the button with text "Continue".');
        }
    }

    // Function to handle password input and click the "Next" button
    function handlePasswordInput() {
        const passwordInput = document.querySelector('input[type="password"]');
        const nextButton = Array.from(document.querySelectorAll('button')).find(button => button.textContent.includes('下一步') || button.textContent.includes('Next') || button.textContent.includes('Volgende') || button.textContent.includes('Siguiente'));

        if (passwordInput && nextButton) {
            if (passwordInput.value === '') {
                passwordInput.value = 'Shichui123.'; // Replace with the actual password
                console.log('Entered password.');
            }
            if (nextButton && passwordInput.value !== '') {
                nextButton.click();
                console.log('Clicked the "Next" button.');
            }
        }
    }

    // Set an interval to continuously scan and perform actions
    setInterval(() => {
        if (window.location.href.includes('accounts.google.com')) {
            checkGoogleAccountPath();
            clickContinueButton();
            handlePasswordInput();
        }
    }, 2000); // Adjust the interval time as needed (2000ms = 2 seconds)

    document.addEventListener('DOMContentLoaded', () => {
        //clickButton();
    });

})();

var wizbox = true;
(function() {
    'use strict';

    function observeUrlChange() {
        let lastUrl = location.href;
        console.log('开始监听URL变化，当前URL:', lastUrl);

        new MutationObserver(() => {
            const currentUrl = location.href;
            if (currentUrl !== lastUrl) {
                console.log('检测到URL变化:', {
                    from: lastUrl,
                    to: currentUrl
                });
                lastUrl = currentUrl;
                handlePage(currentUrl);
            }
        }).observe(document, {subtree: true, childList: true});
    }

    function handlePage(url) {
        console.log('开始处理页面:', url);

        const urlParts = url.split('/');
        const isStatusPage = urlParts.includes('status');

        console.log('URL解析结果:', {
            urlParts,
            isStatusPage,
            fullURL: url
        });

        if (isStatusPage) {
            handleStatusPage();
        }

        else if (url.match(/https:\/\/(x|twitter)\.com\/Wizzwoods_game\/?$/) || url.match(/https:\/\/(x|twitter)\.com\/WizzwoodsGame\/?$/)) {
            handleMainPage();
        }
    }

    function handleMainPage() {

        const boxInterval = setInterval(() => {

            const treasureBoxes = [
                ...document.querySelectorAll('img[src*="tbox"]'),
            ];

            let foundBox = false;

            treasureBoxes.forEach(box => {
                if (box && box.offsetParent !== null) {
                    foundBox = true;
                    wizbox=false;
                    console.log('发现宝箱元素:', {
                        id: box.id,
                        class: box.className,
                        src: box.src
                    });

                    try {
                        box.click();
                    } catch (error) {
                        console.error('❌ 点击宝箱失败:', error);
                    }
                }
            });

            if (!foundBox) {
                console.log('本次扫描未发现宝箱 - ' + new Date().toLocaleTimeString());
            }
        }, 5000);

        window._boxInterval = boxInterval;
    }

    function handleStatusPage() {
        console.log('检测到状态页面，准备评论...');
        let hasCommented = false;


        if (window._boxInterval) {
            clearInterval(window._boxInterval);
        }

        const commentInterval = setInterval(() => {
            if (hasCommented) {
                console.log('已经评论过，跳过...');
                return;
            }

            const selectors = [
                'div[data-testid="tweetTextarea_0"]',
                'div[aria-label="Post text"][contenteditable="true"]',
                'div[aria-label="回复"][contenteditable="true"]',
                'div[role="textbox"]'
            ];

            console.log('尝试查找评论框，使用选择器:', selectors);

            const commentBox = document.querySelector(selectors.join(','));

            if (commentBox) {
                try {
                    commentBox.focus();
                    commentBox.click();

                    const commentText = 'wizzwoods';
                    document.execCommand('insertText', false, commentText);

                    if (!commentBox.textContent) {
                        commentBox.textContent = commentText;
                        commentBox.dispatchEvent(new InputEvent('input', {
                            bubbles: true,
                            cancelable: true,
                        }));
                    }

                    hasCommented = true;

                    // 查找并点击发送按钮
                    const buttonInterval = setInterval(() => {
                        const replyButton = document.querySelector('[data-testid="tweetButtonInline"]');
                        if (replyButton) {
                            replyButton.click();
                            clearInterval(buttonInterval);

                            const backButton = document.querySelector('[data-testid="app-bar-back"]');
                            if (backButton) {
                               console.log('找到返回按钮，点击返回');
                                backButton.click();
                            } else {
                                console.log('未找到返回按钮');
                            }
                        }
                    }, 1000);

                    clearInterval(commentInterval);
                } catch (error) {
                    console.error('填写评论失败:', error);
                }
            } else {
                console.log('等待评论框出现...');
            }
        }, 2000);
    }
    if (location.href.includes('x.com')) {
        observeUrlChange();
        handlePage(window.location.href);
    }
})();

(function() {
    'use strict';

    // 检查并点击MetaMask按钮的函数
    async function checkAndClickMetaMask() {
        // 检查URL是否匹配
        if (window.location.href === 'https://points.reddio.com/task?invite_code=2IFX9') {
            // 查找所有按钮
            const buttons = document.querySelectorAll('button');

            // 遍历按钮寻找包含MetaMask的元素
            for (const button of buttons) {
                if (button.textContent.includes('MetaMask')) {
                    console.log('找到MetaMask按钮');

                    // 确保按钮可见和可交互
                    if (button.offsetParent !== null && !button.disabled) {
                        try {
                            button.click();
                            console.log('点击了MetaMask按钮');
                            return true;
                        } catch (error) {
                            console.error('点击按钮时发生错误:', error);
                        }
                    }
                }
            }
        }
        return false;
    }

    // 定期检查按钮
    function startChecking() {
        // 首次检查
        checkAndClickMetaMask();

        // 设置定期检查
        setInterval(async () => {
            await checkAndClickMetaMask();
        }, 10000); // 每3秒检查一次
    }

    // 页面加载完成后开始检查
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startChecking);
    } else {
        startChecking();
    }
})();



// 等待元素加载并点击的函数
function waitAndClickReward() {
    const checkInterval = setInterval(() => {
        // 使用更精确的选择器，包含 data-v 属性
        const rewardButton = document.querySelector('div[data-v-1fc95287].bottom:not(.disable)');

        if (rewardButton && rewardButton.textContent.includes('Claim daily reward') && !rewardButton.classList.contains('disable')) {
            console.log('Found reward button:', rewardButton);

            // 确保按钮可见且可交互
            if (isElementVisible(rewardButton) && isElementClickable(rewardButton)) {
                clearInterval(checkInterval);

                // 使用原生点击事件
                try {
                    rewardButton.click();
                    console.log('Clicked reward button');
                } catch (e) {
                    // 如果原生点击失败，尝试创建点击事件
                    console.log('Native click failed, trying click event');
                    const clickEvent = new MouseEvent('click', {
                        bubbles: true,
                        cancelable: true
                    });
                    rewardButton.dispatchEvent(clickEvent);
                }
            }
        } else {
            console.log('Reward button not ready yet');
        }
    }, 2000); // 每2秒检查一次

    // 60秒后停止检查
    setTimeout(() => {
        clearInterval(checkInterval);
        console.log('Stopped checking for reward button');
    }, 60000);
}

// 检查元素是否可见
function isElementVisible(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.width > 0 &&
        rect.height > 0 &&
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// 检查元素是否可点击
function isElementClickable(element) {
    const style = window.getComputedStyle(element);
    return style.display !== 'none' &&
           style.visibility !== 'hidden' &&
           style.opacity !== '0' &&
           !element.disabled;
}

function tourl() {
    setInterval(function() {
        // 使用更精确的XPath选择器
        const timerXPath = '//*[@id="app"]/div/div[2]/div/div[2]/div[1]/div[1]/div[2]/div[3]/div[1]/div[1]';
        const timerElement = document.evaluate(timerXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        if (timerElement) {
            const timerText = timerElement.textContent.trim();
            console.log("Found timer:", timerText);

            // 检查时间格式并判断是否需要跳转
            if (timerText !== "00:00:00") {
                console.log(`Timer is ${timerText}, redirecting...`);
                window.location.href = "https://app.olab.xyz/taskCenter";
            }
        } else {
            // 备用选择器
            const backupTimerElement = document.querySelector('.tiem .text');
            if (backupTimerElement) {
                const timerText = backupTimerElement.textContent.trim();
                console.log("Found timer with backup selector:", timerText);

                if (timerText !== "00:00:00") {
                    console.log(`Timer is ${timerText}, redirecting...`);
                    window.location.href = "https://app.olab.xyz/taskCenter";
                }
            } else {
                console.log("Timer element not found with any selector");
            }
        }
    }, 3000);
}
// 主函数
(function() {
    'use strict';
    var falg = true;
    // 检查URL是否匹配
    if (window.location.href.includes('testnet.humanity.org/dashboard')) {
        //每10秒检查一次
        setInterval(function() {
            if (document.readyState === 'complete') {
                if (falg) {
                    falg = false;
                    tourl();
                    waitAndClickReward();
                }
            }
        },5000)
    }
})();


(function () {
    'use strict';

    // XPath for the first element
    const element1XPath = '//*[@id="root"]/div[1]/div/main/div[4]/div/div[1]';

    // Track if SPIN has been clicked
    let spinClicked = false;

    // Function to find and click the SPIN button based on its text
    function clickSpinButton() {
        if (spinClicked) return; // Prevent multiple clicks

        const buttons = Array.from(document.querySelectorAll('button')); // Get all button elements
        const targetButton = buttons.find(button => button.textContent.trim() === "SPIN"); // Find the button by text
        if (targetButton) {
            targetButton.click(); // Click the target button
            setTimeout(function() {
                window.open('https://cryptopond.xyz/modelfactory/detail/306250?tab=4', '_self')
            }, 8 * 1000);
            spinClicked = true; // Mark SPIN as clicked
        }
        const CLAIMED = buttons.find(button => button.textContent.trim() === "CLAIMED"); // Find the button by text
        if(CLAIMED){
            setTimeout(function() {
                window.open('https://cryptopond.xyz/modelfactory/detail/306250?tab=4', '_self')
            }, 2 * 1000);
        }
    }

    function getElementByXPath(xpath) {
        const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        return result.singleNodeValue; // Return the first matching node
    }

    function clickElementsInSequence() {
        const element1 = getElementByXPath(element1XPath);
        if (element1) {
            element1.click(); // Click the first element
            console.log('Clicked element 1');
            setTimeout(clickSpinButton, 2000);
        }
    }

    if (window.location.href == 'https://glob.shaga.xyz/main'){
        setTimeout(function() {
            window.open('https://cryptopond.xyz/modelfactory/detail/306250?tab=4', '_self')
        }, 80 * 1000);
        const observer = new MutationObserver(clickElementsInSequence);
        observer.observe(document.body, { childList: true, subtree: true });
    }
})();

(function() {
    'use strict';

    // 延迟60秒后执行
    setTimeout(function() {
        // 确保页面路径正确
        if (window.location.href === "https://x.com/Wizzwoods_game" || window.location.href === "https://x.com/WizzwoodsGame") {
            // 获取页面的高度
            const scrollHeight = document.documentElement.scrollHeight;

            // 滑动10秒的动画
            let startTime = null;
            const scrollDuration = 10000; // 10秒
            const scrollDistance = scrollHeight; // 滑动整个页面的高度

            function scrollStep(timestamp) {
                if (!startTime) startTime = timestamp;
                let progress = timestamp - startTime;
                let scrollPosition = Math.min(progress / scrollDuration * scrollDistance, scrollDistance);
                window.scrollTo(0, scrollPosition);

                if (progress < scrollDuration && wizbox) {
                    requestAnimationFrame(scrollStep); // 继续滑动
                }
            }

            // 开始滑动
            requestAnimationFrame(scrollStep);
        }
    }, 60000); // 60秒后执行
})();


(function () {
    'use strict';
    if (window.location.href=='https://testnet.humanity.org/dashboard') {
        setTimeout(function() {
            window.location.href = 'https://app.olab.xyz/taskCenter';
        }, 60000);
        // 定义点击函数
        function clickSkipButton() {
            // 查找所有 div 元素
            const divElements = document.querySelectorAll('div');
            for (const div of divElements) {
                if (div.textContent.trim().toLowerCase() === 'skip') { // 匹配文本内容为 'skip'
                    console.log("找到 'skip' 按钮，正在点击...");
                    div.click(); // 执行点击操作
                    return true; // 找到后返回 true
                }
            }
            console.log("'skip' 按钮未找到，继续观察...");
            return false; // 未找到返回 false
        }

        // 首次尝试点击按钮
        if (clickSkipButton()) {
            console.log("'skip' 按钮已成功点击！");
        } else {
            console.log("初始化时未找到 'skip' 按钮，启动观察者...");
        }

        // 使用 MutationObserver 监控 DOM 的变化
        const observer = new MutationObserver(() => {
            if (clickSkipButton()) {
                console.log("'skip' 按钮已通过观察者点击，停止观察...");
                observer.disconnect(); // 找到并点击后停止观察
            }
        });

        // 配置观察目标
        observer.observe(document.body, {
            childList: true, // 监控直接子节点的变化
            subtree: true,
        });
    }
})();


(function() {
    'use strict';

    // 等待页面加载完成
    window.addEventListener('load', function() {
        console.log("脚本已加载，等待处理...");


        // 自动点击“连接钱包”按钮
        function clickConnectWalletButton() {
            const connectWalletButton = document.querySelector('[data-testid="connect-wallet-button"]');
            if (connectWalletButton) {
                console.log("找到连接钱包按钮，准备点击...");
                connectWalletButton.click();

                // 等待几秒钟后选择“MetaMask”
                setTimeout(selectMetaMaskOption, 1000);
            } else {
                console.log("未找到连接钱包按钮，稍后重试...");
                setTimeout(clickConnectWalletButton, 1000);
            }
        }

        // 自动选择“MetaMask”选项
        function selectMetaMaskOption() {
            const metaMaskOption = document.querySelector('[data-testid="rk-wallet-option-metaMask"]');
            if (metaMaskOption) {
                console.log("找到MetaMask选项，准备点击...");
                metaMaskOption.click();

                // 等待 MetaMask 操作完成后寻找“发送消息”按钮
                setTimeout(clickSendMessageButton, 2000);
            } else {
                console.log("未找到MetaMask选项，稍后重试...");
                setTimeout(selectMetaMaskOption, 1000);
            }
        }

        // 自动点击“发送消息”按钮
        function clickSendMessageButton() {
            const sendMessageButton = document.querySelector('[data-testid="rk-auth-message-button"]');
            if (sendMessageButton) {
                console.log("找到发送消息按钮，准备点击...");
                sendMessageButton.click();
            } else {
                console.log("未找到发送消息按钮，稍后重试...");
                setTimeout(clickSendMessageButton, 1000);
            }
        }

    if (window.location.href=='https://testnet.humanity.org/login') {
        clickConnectWalletButton();
    }

    });
})();

(function () {
    'use strict';
    // 选择器正确转义

    setInterval(() => {
        // 使用 XPath 查找目标元素
        var xpath = "//div[@class='text-white text-sm font-semibold' and text()='H']";
        var element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        // 检查是否找到了元素
        if (element) {
             window.open('https://testnet-faucet.reddio.com/', '_self');
            // 停止定时器
            clearInterval(this);
        }
    }, 3000); // 每 3 秒检查一次

    const findAndClickButton = function () {

        // 定义目标按钮的 XPath
        const xpath = '/html/body/main/div[2]/div[4]/div[2]/div[4]/div[6]/button';

        // 设置定时器周期性检查按钮状态
        const intervalId = setInterval(function () {
            // 查询目标按钮
            const targetButton = document.evaluate(
                xpath,
                document,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
            ).singleNodeValue;

            // 检查是否找到按钮
            if (targetButton) {
                console.log('Found button element:', targetButton);

                // 检查按钮是否禁用
                if (!targetButton.disabled) {
                    console.log('Button is enabled, checking text content...');

                    // 获取按钮的文本内容
                    const buttonText = targetButton.textContent.trim();

                    // 判断按钮文本是否符合条件
                    if (/Starting\s*Mining/i.test(buttonText) || buttonText.includes("Activate Miner")) {
                        console.log('Button text matches "Starting Mining", attempting to click...');

                        // 尝试点击按钮
                        try {
                            targetButton.click();

                            // 停止定时器
                            clearInterval(intervalId);
                            console.log('Timer cleared after button click.');
                        } catch (error) {
                            console.error('Error while trying to click the button:', error);
                        }
                    } else {
                        console.log('Button text does not match "Starting Mining".');
                    }
                } else {
                    console.log('Button is disabled, will try again.');
                }
            } else {
                console.log('Button not found in DOM using the given XPath.');
            }
        }, 1000);
    };

    // 检查当前页面 URL 是否匹配目标 URL
    if (window.location.href == 'https://earn.taker.xyz/?start=KTKZP' || window.location.href == 'https://earn.taker.xyz/') {
        findAndClickButton();
        const RunNode =setInterval(() => {
            const buttons = document.querySelectorAll('div');
            buttons.forEach(button => {
                if (button.textContent.includes('MetaMask') &&
                    !button.hasAttribute('disabled')) {
                    console.log('找到可点击的按钮，正在点击...');
                    button.click();
                    clearInterval(RunNode)
                } else if (button.hasAttribute('disabled')) {
                    console.log('按钮不可点击，跳过');
                }
            });
        }, 2000);
    }

})();


(function() {
    'use strict';

    if (window.location.href=='https://earn.taker.xyz/' || window.location.href=='https://earn.taker.xyz?start=KTKZP') {
        // 定义两个标志，分别用于记录是否已经点击过 MetaMask div 和 Connect Wallet 按钮
        let isMetaMaskClicked = false;
        let isConnectWalletClicked = false;

        const intervalId = setInterval(() => {
            // 循环遍历 r1 到 r30
            for (let i = 1; i <= 100; i++) {
                for (let j = 1; j <= 3; j++) {
                    const panelSelector = `#headlessui-popover-panel-\\:r${i}\\: > div > div > div:nth-child(${j})`;
                    const divElement = document.querySelector(panelSelector);
                    if (divElement) {
                        if (divElement.textContent.includes('MetaMask')) {
                            divElement.click();
                            break;
                        }
                    }
                }
            }


            // 查找包含 "Connect Wallet" 文本且具有 text-white 类的 button 元素
            const connectWalletButtons = document.querySelectorAll('button.text-white');

            connectWalletButtons.forEach(button => {
                // 如果按钮文本是 "Connect Wallet" 且没有被点击过
                if (button.textContent.trim() === "Connect Wallet" && !isConnectWalletClicked) {
                    button.click();
                    console.log('已点击连接钱包按钮');
                    isConnectWalletClicked = true; // 设置标志，表示已点击 Connect Wallet 按钮
                }
            });
        }, 5000); // 每秒扫描一次，确保足够的时间等待元素加载
    }

})();

(function() {
    'use strict';

    // Helper function to click a button and close the window after a short delay
    const clickButton = (button) => {
        setTimeout(() => {
            button.click();
            setTimeout(() => { window.close(); }, 3000);
        }, 2000);
    };

    // Helper function to get element by XPath
    const getElementByXPath = (xpath) => {
        const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        return result.singleNodeValue;
    };

    if (window.location.href.includes("x.com") || window.location.href.includes("twitter.com") || window.location.href.includes("discord.com") || window.location.href.includes("https://api.x.com/oauth/authorize")) {
        // Handle the main follow action with XPath check and text validation
        const handleFollowAction = () => {
            const buttonXPath = '//*[@id="react-root"]/div/div/div[2]/main/div/div/div/div[1]/div/div[3]/div/div/div[1]/div[2]/div[1]/div[2]/div/div[1]/button'; // XPath to the Follow button
            const followButton = getElementByXPath(buttonXPath);

            if (followButton && followButton.textContent.trim().includes('Follow')) {
                clickButton(followButton);
                return true; // Stop further actions after the first button click
            }
            return false;
        };

        const observer = new MutationObserver(async () => {
            if (window.location.href.includes("x.com") || window.location.href.includes("twitter.com") || window.location.href.includes("discord.com") || window.location.href.includes("https://api.x.com/oauth/authorize")) {
                // Keep observing and act as soon as the Follow button appears
                const buttonXPath = '//*[@id="react-root"]/div/div/div[2]/main/div/div/div/div[1]/div/div[3]/div/div/div[1]/div[2]/div[1]/div[2]/div/div[1]/button'; // XPath to the Follow button
                const followButton = getElementByXPath(buttonXPath);

                if (followButton && followButton.textContent.trim().includes('Follow')) {
                    clickButton(followButton);
                    observer.disconnect(); // Stop observing after clicking the first button
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
})();

(function() {
    'use strict';

    // 定时器检查按钮并点击
    setInterval(function() {
        // 获取页面上所有符合类名的按钮
        const buttons = document.querySelectorAll('.chakra-button.css-nc15jr');

        buttons.forEach(button => {
            if(button){
                if (button.textContent.trim() === "Got It" || button.textContent.trim() === "Continue") {
                    button.click();
                }
            }
        });
    }, 3000);
})();

// https://wallet.litas.io/miner
//listas
(function() {
    'use strict';
    var i = 0
    // 检查页面是否符合要求
    if (window.location.href === 'https://wallet.litas.io/miner' || window.location.href === 'https://wallet.litas.io/login') {
        // 获取当前页面缩放百分比
        function getZoomPercentage() {
            const scale = window.outerWidth / document.documentElement.clientWidth;
            return scale * 100;
        }

        // 创建显示缩放百分比的元素
        const zoomDisplay = document.createElement('div');
        zoomDisplay.style.position = 'fixed';
        zoomDisplay.style.top = '10px';
        zoomDisplay.style.right = '10px';
        zoomDisplay.style.backgroundColor = '#000';
        zoomDisplay.style.color = '#fff';
        zoomDisplay.style.padding = '5px';
        zoomDisplay.style.zIndex = 9999;

        // 更新缩放百分比显示
        function updateZoomDisplay() {
            const percentage = getZoomPercentage();
            if(percentage>60){
                window.open('https://www.magicnewton.com/portal/rewards', '_self');
            }
            zoomDisplay.textContent = `缩放百分比: ${percentage}%`;
        }

        // 首次加载时显示缩放百分比
        updateZoomDisplay();
        document.body.appendChild(zoomDisplay);

        // 监听页面缩放事件并更新显示
        window.addEventListener('resize', updateZoomDisplay);
        
        setInterval(function() {
            if(document.body.style.zoom > '75%'){
                alert("大于")
            }
        }, 3000);
        const buttonss = document.getElementsByTagName('button');
        for (let btn of buttonss) {
            if (btn.textContent.trim() === 'Upgrade' && i<2) {
                // 找到匹配的按钮后模拟点击
                btn.click();
                i++
                console.log('Upgrade 按钮已点击');
            }
        }
        // 设置定时器
        const timer = setInterval(() => {
            if(window.location.href === 'https://wallet.litas.io/wallet'){
                window.location.href = "https://wallet.litas.io/miner";
            }
            // 找到按钮
            const buttons = Array.from(document.querySelectorAll('button'));
            const claimButton = buttons.find(button => button.textContent.trim() === 'CLAIM');

            // 如果找到按钮则点击
            if (claimButton) {
                claimButton.click(); // 点击CLAIM按钮
                console.log("CLAIM button clicked."); // 调试信息
                setTimeout(() => {
                    window.location.href = "https://www.magicnewton.com/portal/rewards";
                }, 6000); // 30秒延迟
                // 清除定时器，确保只点击一次
                clearInterval(timer);

            } else {
                console.log("CLAIM button not found."); // 调试信息
            }
            setTimeout(() => {
                window.location.href = "https://www.magicnewton.com/portal/rewards";
            }, 60000); // 30秒延迟
        }, 3000); // 每秒检查一次按钮
    }
})();

(function() {
    'use strict';

    // 检查页面是否符合要求
    if (window.location.href === 'https://earn.taker.xyz/') {
        setInterval(() => {
            window.location.reload(); // 刷新页面
        }, 200000); // 每秒检查一次按钮
        // 设置延时后跳转
    }

})();

//newton
(function() {
    if (window.location.hostname !== 'www.magicnewton.com') {
        return;
    }
        // 日志和状态管理
    const log = (message) => console.log(`[Magic Newton Automator ${new Date().toLocaleTimeString()}]: ${message}`);
    const state = {
        runs: GM_getValue('runs', 0),
        successfulClicks: GM_getValue('successfulClicks', 0),
        failedClicks: GM_getValue('failedClicks', 0)
    };

    // 工具函数（保持不变）
    const randomDelay = (min, max) => new Promise(resolve =>
        setTimeout(resolve, Math.floor(Math.random() * (max - min + 1) + min))
    );

    const waitForElement = async (selector, timeout = 20000) => {
        const start = Date.now();
        while (Date.now() - start < timeout) {
            const element = document.querySelector(selector);
            if (element && element.offsetParent !== null && getComputedStyle(element).display !== 'none') {
                log(`找到元素: ${selector}`);
                return element;
            }
            await randomDelay(300, 500);
        }
        log(`未找到元素: ${selector}`);
        return null;
    };

    const clickElement = async (element, description, isElement7 = false) => {
        if (!element) {
            log(`${description} 未找到`);
            state.failedClicks++;
            return false;
        }

        let preClickState = isElement7 ? getElementState(element) : null;

        element.click();
        log(`${description} 点击触发`);
        await randomDelay(500, 1000);

        if (isElement7) {
            const postClickState = getElementState(element);
            const stateChanged = hasStateChanged(preClickState, postClickState);

            if (stateChanged) {
                log(`${description} 点击有效`);
                state.successfulClicks++;
                return true;
            } else {
                log(`${description} 点击无效`);
                state.failedClicks++;
                return false;
            }
        }
        return true;
    };

    const getElementState = (element) => ({
        className: element.className,
        color: getComputedStyle(element).color,
        textContent: element.textContent.trim(),
        backgroundColor: getComputedStyle(element).backgroundColor,
        isVisible: element.offsetParent !== null
    });

    const hasStateChanged = (pre, post) =>
        pre.className !== post.className ||
        pre.color !== post.color ||
        pre.textContent !== post.textContent ||
        pre.backgroundColor !== post.backgroundColor ||
        pre.isVisible !== post.isVisible;

    const filterElement7List = (elements) => {
        return Array.from(elements).filter(element => {
            const style = getComputedStyle(element);
            const classList = element.className;
            const text = element.textContent.trim();

            const conditions = [
                { check: style.backgroundColor === 'rgba(0, 0, 0, 0)' && style.border === 'none' && style.boxShadow === 'none' && style.color === 'rgb(255, 255, 255)', reason: '透明样式' },
                { check: classList.includes('tile-changed') && style.color === 'rgb(167, 153, 255)' && text === '1', reason: '紫色 "1"' },
                { check: classList.includes('tile-changed') && style.color === 'rgb(0, 204, 143)' && text === '2', reason: '绿色 "2"' },
                { check: classList.includes('tile-changed') && style.color === 'rgb(255, 213, 148)' && text === '3', reason: '黄色 "3"' }
            ];

            const excluded = conditions.find(c => c.check);
            if (excluded) {
                log(`排除元素7: ${excluded.reason}`);
                return false;
            }
            return true;
        });
    };

    const checkElement2_1 = async (timeout = 10000) => {
        const selector = 'p.gGRRlH.WrOCw.AEdnq.gTXAMX.gsjAMe';
        const start = Date.now();
        while (Date.now() - start < timeout) {
            const elements = document.querySelectorAll(selector);
            for (const el of elements) {
                if (getComputedStyle(el).color === 'rgb(0, 0, 0)' && el.textContent.trim() === 'Return Home') {
                    log(`找到元素2-1`);
                    return el;
                }
            }
            await randomDelay(300, 500);
        }
        return null;
    };

    // 主执行函数
    const executeScript = async () => {
        try {
            state.runs++;
            log(`开始第 ${state.runs} 次运行`);

            await randomDelay(2000, 5000);

            const selectors = {
                element1: 'body > div.dMMuNs.kcKISj > div.fPSBzf.bYPztT.dKLBtz.iRgpoQ.container-page-loaded > div.fPSBzf.container-content > div > div:nth-child(2) > div:nth-child(2) > div > div > div > div > div > button > div > p',
                element2: 'body > div.dMMuNs.kcKISj > div.fPSBzf.bYPztT.dKLBtz.iRgpoQ.container-page-loaded > div.fPSBzf.container-content > div > div:nth-child(1) > div.jsx-f1b6ce0373f41d79.info-tooltip-control > button > div > p',
                element3: 'body > div.dMMuNs.kcKISj > div.fPSBzf.bYPztT.dKLBtz.iRgpoQ.container-page-loaded > div.fPSBzf.container-content > div > div.jsx-f1b6ce0373f41d79.info-tooltip-control > button > div > p',
                element4: 'body > div.dMMuNs.kcKISj > div.fPSBzf.bYPztT.dKLBtz.iRgpoQ.container-page-loaded > div.fPSBzf.container-content > div > div:nth-child(1) > div:nth-child(2) > button > div > p',
                element5: 'body > div.dMMuNs.kcKISj > div.fPSBzf.bYPztT.dKLBtz.iRgpoQ.container-page-loaded > div.fPSBzf.container-content > div > div:nth-child(2) > div:nth-child(1) > div > div > div > div > div > button > div > p',
                element6: 'body > div.dMMuNs.kcKISj > div.fPSBzf.bYPztT.dKLBtz.iRgpoQ.container-page-loaded > div.fPSBzf.container-content > div > div.fPSBzf.bYPztT.bYPznK.hdAwi.fzoLlu.qbeer.kiKDyH.dnFyWD.kcKISj.VrCRh.icmKIQ > div:nth-child(2) > div.fPSBzf.cMGtQw.gEYBVn.hYZFkb.jweaqt.jTWvec.hlUslA.fOVJNr.jNyvxD > div > div > div.fPSBzf.bYPztT.bYPznK.pezuA.cMGtQw.pBppg.dMMuNs > button > div',
                element7: 'div.tile.jetbrains',
                element8: 'body > div.dMMuNs.kcKISj > div.fPSBzf.bYPztT.dKLBtz.iRgpoQ.container-page-loaded > div.fPSBzf.container-content > div > div.fPSBzf.bYPztT.bYPznK.pezuA.cMGtQw.pBppg.dMMuNs > button:nth-child(1) > div' // 修复为正确的选择器
            };

            // 执行点击序列
            await clickElement(await waitForElement(selectors.element1), "元素1");

            const element2_1 = await checkElement2_1();
            if (element2_1) {
                await clickElement(element2_1, "元素2-1");
            } else {
                await clickElement(await waitForElement(selectors.element2), "元素2");
                await clickElement(await waitForElement(selectors.element3), "元素3");
                await clickElement(await waitForElement(selectors.element4), "元素4");
            }

            await clickElement(await waitForElement(selectors.element5), "元素5");
            await clickElement(await waitForElement(selectors.element6), "元素6");

            // 元素7和8的循环
            const maxAttempts = 3;
            const maxFailures = 7;
            let clickFailures = 0;

            for (let i = 0; i < maxAttempts && clickFailures < maxFailures; i++) {
                log(`循环 ${i + 1}/${maxAttempts}`);

                while (clickFailures < maxFailures) {
                    const element7List = filterElement7List(document.querySelectorAll(selectors.element7));
                    if (!element7List.length) {
                        log('无可用元素7');
                        break;
                    }

                    const element7 = element7List[Math.floor(Math.random() * element7List.length)];
                    const success = await clickElement(element7, "元素7", true);

                    if (!success) {
                        clickFailures++;
                        log(`点击失败计数: ${clickFailures}/${maxFailures}`);
                        continue;
                    }

                    const element8 = await waitForElement(selectors.element8, 1000);
                    if (element8) {
                        await clickElement(element8, "元素8");
                        break;
                    }
                    await randomDelay(1000, 2000);
                }
                await randomDelay(2000, 3000);
            }

            // 保存状态
            GM_setValue('runs', state.runs);
            GM_setValue('successfulClicks', state.successfulClicks);
            GM_setValue('failedClicks', state.failedClicks);

            log(`执行完成 - 总运行: ${state.runs}, 成功点击: ${state.successfulClicks}, 失败点击: ${state.failedClicks}`);
            window.location.href = 'https://testnet.humanity.org/onboarding';
            await randomDelay(5000, 10000);

        } catch (error) {
            log(`错误: ${error.message}`);
            GM_setValue('runs', state.runs);
            GM_setValue('successfulClicks', state.successfulClicks);
            GM_setValue('failedClicks', state.failedClicks);
            await randomDelay(5000, 10000);
            window.location.href = 'https://testnet.humanity.org/onboarding';
        }
    };

       executeScript();

})();


(function() {
    'use strict';

    // 获取当前页面的路径
    const currentPath = window.location.pathname;

    // 定义一个延迟执行的函数
    function delayAction(action, delay) {
        setTimeout(action, delay);
    }

    // 检查当前域名是否为 app.olab.xyz
    if (window.location.hostname !== 'app.olab.xyz') {
        console.warn('脚本只在 app.olab.xyz 域名下运行');
        return; // 如果不是该域名，则退出
    } else if (currentPath === "/home") {
        // 如果当前路径为 /home, 跳转到 /taskCenter
        window.location.href = "https://app.olab.xyz/taskCenter";
    } else if (currentPath === "/login" || currentPath === "/taskCenter") {
        // 延迟点击 "I Understand" 按钮（只点击一次）
        if (!localStorage.getItem('clickedUnderstand')) {
            setInterval(() => {
                const understandButton = document.querySelector('button.chakra-button.css-13tudwa');
                if (understandButton) {
                    understandButton.click();
                    localStorage.setItem('clickedUnderstand', 'true'); // 标记为已点击
                    console.log('点击了 I Understand 按钮');
                }
            }, 1000);
        }

        // 延迟点击 MetaMask 图标按钮（只点击一次）
        setInterval(() => {
            const metaMaskButton = document.querySelector('button.chakra-button.css-1t8vnpq img[alt="MetaMask"]');
            if (metaMaskButton) {
                metaMaskButton.click();
            }
        }, 6000);
    }

    // 如果路径是 /taskCenter，使用文本查找点击 "Check-in" 按钮（只点击一次）
    if (currentPath === "/taskCenter") {
        setInterval(() => {
            const checkInButton = Array.from(document.querySelectorAll('button'))
                .find(button => button.textContent.includes('Check-in'));

            if (checkInButton) {
                checkInButton.click();
                console.log('点击了 Check-in 按钮');
            }
        }, 5000); // 延迟 3 秒
        setInterval(function() {
            const h1s = Array.from(document.querySelectorAll('h1'))
                .find(button => button.textContent.includes('Sorry, you have been blocked'));
            if(h1s){
                window.location.href = 'https://app.olab.xyz/taskCenter';
            }
            const done = Array.from(document.querySelectorAll('button'))
                .find(button => button.textContent.includes('Done'));
            if(done){
                window.location.href = 'https://0xvm.com/honor';
            }
            if(window.location.href === 'https://app.olab.xyz/home'){
                window.location.href = 'https://app.olab.xyz/taskCenter';
            }
        },1000)
    }
})();






(function() {
    'use strict';

    var checkP = true;
    var f =1
    // 检测文本语言的函数
    function detectLanguage(text) {
        const chinesePattern = /[\u4e00-\u9fa5]/; // 简体/繁体中文字符范围
        const englishPattern = /^[A-Za-z0-9\s]+$/; // 英文和数字
        const japanesePattern = /[\u3040-\u30ff\u31f0-\u31ff\u4e00-\u9fa5]/; // 日文字符范围
        const koreanPattern = /[\uac00-\ud7af]/; // 韩文字符范围
        const traditionalChinesePattern = /[\u4e00-\u9fa5]/; // 繁体中文

        if (chinesePattern.test(text)) {
            return "Chinese (Simplified/Traditional)";
        } else if (englishPattern.test(text)) {
            return "English";
        } else if (japanesePattern.test(text)) {
            return "Japanese";
        } else if (koreanPattern.test(text)) {
            return "Korean";
        } else if (traditionalChinesePattern.test(text)) {
            return "Traditional Chinese (Taiwan)";
        }
        return "Unknown";
    }

    function handlePopup() {
        const popup = document.querySelector('[class*="absolute"][class*="cursor-pointer"]');
        if (popup && checkP) {
            console.log("Popup detected, closing it.");
            popup.click();
            return true;
        }
        return false;
    }

    // 点击按钮的函数，逐个检查并点击第一个有效按钮
    function clickButtons() {
        if(checkP){
            const buttons = document.querySelectorAll('.grid.mt-3.grid-cols-2.gap-3 button');
            let clicked = false;

            console.log("Starting to check buttons...");

            // 遍历按钮，点击第一个有效按钮
            for (let i = 0; i < buttons.length; i++) {
                console.log(`Checking button ${i + 1}:`);
                const button = buttons[i];
                // 判断按钮文本是否为"検証"（检查），并且按钮没有禁用
                if (!button.disabled && button.innerText.trim() === "検証") {
                    console.log(`Button ${i + 1} is enabled and has the correct text, clicking it...`);
                    button.click();
                    console.log(`Clicked button ${i + 1} in grid mt-3.`);
                    clicked = true;
                    break;
                } else if (button.disabled) {
                    console.log(`Button ${i + 1} is disabled, checking next button.`);
                } else {
                    console.log(`Button ${i + 1} has incorrect text, checking next button.`);
                }
            }

            if (clicked) {
                console.log("Button clicked successfully, stopping interval.");
                setTimeout(() => {
                    console.log("Waiting 60 seconds before running again.");
                    startClicking();
                }, 60000);
            } else {
                console.log("No available buttons to click.");
            }
        }
    }


    let allDisabled = 0;
    let MaxValue = 0;
    setInterval(() => {
        clickButtons();
        if (allDisabled>=5) {
            window.location.href = 'https://2fa.run/';
        }
    }, 3000);

    function waitForButtonAndClick() {
        console.log("Waiting for buttons to load...");
        const intervalId = setInterval(() => {
            const buttons = document.querySelectorAll('.grid.mt-3 button');

            if (buttons.length > 0) {
                //handlePopup();
                console.log("Buttons found, attempting to click...");
                for (let i = 0; i < buttons.length; i++) {
                    if (!buttons[i].disabled) {
                        buttons[i].click();
                        allDisabled = 0; // Reset
                    } else {
                        allDisabled++;
                        console.log(`Button ${i} is disabled.`);
                    }
                }
                console.log(`${allDisabled} buttons are disabled.`);
            } else {
                console.log("No buttons found, retrying...");
            }
            clearInterval(intervalId);
            setTimeout(waitForButtonAndClick, 60000);

        }, 3000);
    }


    // 启动定时器
    function startClicking() {
        if(checkP){
            console.log("Starting the clicking process...");
            waitForButtonAndClick();
        }
    }

    if (location.href.includes('sosovalue.com')) {
        try {
            setTimeout(() => {
                const LogIn = setInterval(() => {
                    // 使用主要class选择所有可能的按钮
                    const buttons = document.querySelectorAll('button.MuiButtonBase-root.MuiIconButton-root');

                    // 定义多语言登录文本数组
                    const loginTexts = [
                        'ログイン',    // 日文
                        '登录',       // 中文简体
                        '登錄',       // 中文繁体
                        'Log In',     // 英文
                        '로그인',     // 韩文
                        'Sign In',    // 英文备选
                        '登入'        // 中文备选
                    ];

                    buttons.forEach(button => {
                        if (button && !button.hasAttribute('disabled')) {
                            // 检查按钮文本是否包含任意一种登录文本
                            const buttonText = button.textContent.trim();
                            const isLoginButton = loginTexts.some(text =>
                                                                  buttonText.includes(text)
                                                                 );

                            const googleInterval = setInterval(() => {
                                // 使用更具体的选择器
                                const buttons = document.querySelectorAll('button.MuiButtonBase-root.MuiButton-root');

                                buttons.forEach(button => {
                                    // 检查是否启用且包含Google文本
                                    const buttonText = button.textContent.trim();
                                    if (button &&
                                        !button.hasAttribute('disabled') &&
                                        buttonText.includes('Google')) {
                                        console.log('找到Google按钮，尝试点击:', button); // 调试信息
                                        button.click();
                                        clearInterval(googleInterval);
                                        return;
                                    }
                                });

                                // 如果没找到，输出调试信息
                                if (buttons.length === 0) {
                                    console.log('未找到任何匹配的按钮');
                                }
                            }, 1000); // 缩短到1秒检查一次

                            if (isLoginButton) {
                                button.click();
                                clearInterval(LogIn);
                                return; // 找到并点击后退出循环
                            }
                        }
                    });
                }, 5000);
                startClicking();
            }, 10000); // 10000毫秒即10秒
        } catch (error) {
            console.error("An error occurred:", error);
        }
    }
})();

//Pond Ai Get Api
(function() {
    'use strict';

    if (location.href === 'https://cryptopond.xyz/ideas/create') {
        fillInForm();
        setInterval(() => {
            location.reload();
        }, 60000);
    }
    


    async function Textt(inputValue) {
        try {
            const targetElement = await waitForElement('p.bn-inline-content');
            if (!targetElement) {
                console.error('Could not find paragraph element');
                return false;
            }

            targetElement.textContent = '';
            await randomDelay(2000, 3000); // Use random delay

            targetElement.textContent = inputValue;
            targetElement.dispatchEvent(new Event('input', { bubbles: true }));
            targetElement.dispatchEvent(new Event('change', { bubbles: true }));

            if (targetElement.textContent === inputValue.toString()) {
                const saveButtons = document.querySelectorAll('button');
                for (const button of saveButtons) {
                    if (button.textContent.includes('Save')) {
                        setTimeout(() => {
                            window.open('https://wallet.litas.io/miner', '_self');
                        }, 8000);
                        button.click();
                        break;
                    }
                }
                return true;
            } else {
                console.log('Input verification failed for the target paragraph element');
                return false;
            }
        } catch (error) {
            console.error('Error inputting text for the target paragraph element:', error);
            return false;
        }
    }

    function waitForElement(selector, timeout = 30000) {
        return new Promise((resolve, reject) => {
            const start = Date.now();
            const timer = setInterval(() => {
                const el = document.querySelector(selector);
                if (el) {
                    clearInterval(timer);
                    resolve(el);
                } else if (Date.now() - start >= timeout) {
                    clearInterval(timer);
                    reject(new Error(`Timeout waiting for element ${selector}`));
                }
            }, 500);
        });
    }

    async function inputText(selector, inputValue) {
        try {
            const inputElement = await waitForElement(selector);
            console.log(`Inputting text into: ${selector}`);

            // Set value natively
            Object.defineProperty(inputElement, 'value', {
                value: inputValue,
                writable: true,
            });
            inputElement.dispatchEvent(new Event('input', { bubbles: true }));
            inputElement.dispatchEvent(new Event('change', { bubbles: true }));

            await randomDelay(100, 200);

            if (selector.includes('input')) {
                return inputElement.value === inputValue;
            } else {
                return inputElement.textContent.trim() === inputValue;
            }
        } catch (error) {
            console.error(`Error inputting text for ${selector}:`, error);
            return false;
        }
    }

    // Utility function for random delay
    function randomDelay(min, max) {
        const delay = Math.floor(Math.random() * (max - min + 1)) + min;
        return new Promise(resolve => setTimeout(resolve, delay));
    }

    async function fillInForm() {
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'http://apiai.natapp1.cc/',
            onload: function(response) {
                if (response.status === 200) {
                    const { title, description, modelIdeaOverview } = JSON.parse(response.responseText).data;
                    inputText('input[placeholder="Enter the title of your model idea"]', title);
                    inputText('textarea[placeholder="Enter a brief summary of your model idea"]', description);
                    Textt(modelIdeaOverview);
                }
            },
            onerror: function(error) {
                console.error('API request failed:', error);
            }
        });
    }
})();

//Pond Ai Public
(function() {
    
    if (window.location.hostname !== 'cryptopond.xyz') {
        return;
    }
    
    const Topic =setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.includes('New Topic') && 
                !button.hasAttribute('disabled')) {
                button.click();
                clearInterval(Topic)
            }
        });
    }, 5000);
    
    let hasPublished = false;
    let titFilled = false;
    let conFilled = false;

    setInterval(() => {
        if (location.href.includes('cryptopond.xyz')) {
            const signUpButton = document.querySelector('button.chakra-button.css-1v3ij0n');
            if (signUpButton && signUpButton.innerHTML === 'Sign up') {
                signUpButton.click();
            } else {
                fillAndPublish();
            }
        }
    }, 5000);

    function generateRandomString(length) {
        const characters = 'ABCDEFGHIJKLMNO';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

    function setNativeInputValue(element, value) {
        const valueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        const event = new Event('input', { bubbles: true });
        valueSetter.call(element, value);
        element.dispatchEvent(event);
    }

    async function randomy(min, max) {
        const delay = Math.floor(Math.random() * (max - min + 1)) + min;
        console.log(`Waiting for ${delay} ms`);
        return new Promise(resolve => setTimeout(resolve, delay));
    }

    async function waitForElement(selector, timeout = 30000) {
        return new Promise((resolve, reject) => {
            const start = Date.now();
            const timer = setInterval(() => {
                const el = document.querySelector(selector);
                if (el) {
                    clearInterval(timer);
                    resolve(el);
                } else if (Date.now() - start >= timeout) {
                    clearInterval(timer);
                    reject(new Error(`Timeout waiting for ${selector}`));
                }
            }, 500);
        });
    }

    async function inputText(selector, value) {
        const element = await waitForElement(selector);
        if (element.tagName === 'INPUT') {
            setNativeInputValue(element, value);
            element.dispatchEvent(new Event('change', { bubbles: true }));
            await randomy(100, 200);
            return element.value === value;
        } else {
            element.textContent = value;
            element.dispatchEvent(new Event('input', { bubbles: true }));
            await randomy(100, 200);
            return element.textContent.trim() === value;
        }
    }

    async function fillAndPublish() {
        const titleSelector = 'input[placeholder="Enter title"]';
        const contentSelector = 'p.bn-inline-content';
        const titleValue = generateRandomString(10);
        const contentValue = generateRandomString(19);

        console.log(`Title: ${titleValue}, Content: ${contentValue}`);

        if (!titFilled) {
            titFilled = await inputText(titleSelector, titleValue);
        }
        if (!conFilled) {
            conFilled = await inputText(contentSelector, contentValue);
        }

        if (titFilled && conFilled && !hasPublished) {
            const buttons = document.querySelectorAll('button');
            for (const button of buttons) {
                if (button.textContent.includes('Publish Topic')) {
                    hasPublished = true;
                    button.click();
                    setTimeout(() => {
                        sessionStorage.removeItem('refreshCount');
                        window.location.href = 'https://cryptopond.xyz/ideas/create';
                    }, 16000);
                    break;
                }
            }
        } else if (!hasPublished) {
            setTimeout(fillAndPublish, 2000); // Retry every 2 seconds
        }
    }
})();

//MONAD SUPER 钱包连接
(function() {
    'use strict';

    // Check if we're on the right domain
    if (window.location.hostname !== 'monad-test.kinza.finance') {
        console.log('Not on the target domain.');
        return;
    }

    console.log('Script running on Kinza Finance test domain.');

    // Function to click the Connect Wallet button
    function clickConnectWallet() {
        const connectWalletButton = document.querySelector('button.ant-btn-primary span');
        if (connectWalletButton && connectWalletButton.textContent === 'Connect Wallet') {
            console.log('Found Connect Wallet button, clicking...');
            connectWalletButton.parentElement.click();
            return true;
        } else {
            console.log('Connect Wallet button not found yet.');
            return false;
        }
    }

    // Function to click the MetaMask button
    function clickMetaMask() {
        const metaMaskButton = document.querySelector('[data-testid="rk-wallet-option-metaMask"]');
        if (metaMaskButton) {
            console.log('Found MetaMask button, clicking...');
            metaMaskButton.click();
            return true;
        } else {
            console.log('MetaMask button not found yet.');
            return false;
        }
    }

    // Set up MutationObserver to watch for DOM changes
    const observer = new MutationObserver((mutations) => {
        console.log('DOM changed, checking for buttons...');

        // Try clicking Connect Wallet first
        if (clickConnectWallet()) {
            console.log('Connect Wallet clicked, now waiting for MetaMask...');
        }

        // After Connect Wallet is clicked, check for MetaMask
        if (clickMetaMask()) {
            console.log('MetaMask clicked, stopping observer.');
            observer.disconnect(); // Stop observing once both are clicked
        }
    });

    // Start observing the document body for changes
    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    // Initial check in case buttons are already present
    if (clickConnectWallet()) {
        clickMetaMask();
    }
})();

//MONAD SUPER
(function() {
    'use strict';

    // 第一步：检测当前 URL 是否匹配目标 URL
    if (window.location.href !== 'https://monad-test.kinza.finance/#/details/MON') {
        console.log('URL does not match the target. Stopping script.');
        return;
    }

    // 等待页面加载完成
    function waitForElement(selector, callback, maxAttempts = Infinity, interval = 3000) {
        let attempts = 0;
        const checkExist = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(checkExist);
                callback(element);
            } else if (attempts >= maxAttempts) {
                clearInterval(checkExist);
                console.log(`Element ${selector} not found after ${maxAttempts} attempts. Retrying...`);
                waitForElement(selector, callback, Infinity, interval);
            }
            attempts++;
        }, interval);
    }

    // 查找按钮通过文本内容
    function findButtonByText(text, callback) {
        const retryFindButton = () => findButtonByText(text, callback); // 定义重试函数
        waitForElement('button', (buttons) => {
            const buttonList = document.querySelectorAll('button');
            for (let button of buttonList) {
                if (button.textContent.trim() === text) {
                    callback(button);
                    return;
                }
            }
            console.log(`Button with text "${text}" not found. Retrying in 5 seconds...`);
            setTimeout(retryFindButton, 5000);
        }, Infinity, 3000);
    }

    // 检查按钮是否可点击
    function isButtonClickable(button) {
        if (!button) return false;
        const isDisabled = button.hasAttribute('disabled') || button.classList.contains('ant-btn-disabled');
        const isVisible = button.style.display !== 'none' && button.style.visibility !== 'hidden' && window.getComputedStyle(button).display !== 'none';
        return !isDisabled && isVisible;
    }

    // 检查输入框是否为空
    function isInputEmpty(input) {
        if (!input) return true;
        return !input.value || input.value.trim() === '';
    }

    // 设置输入框值并触发事件（使用原生 set 方法）
    function setInputValue(input, value) {
        if (!input) return;

        // 使用 Object.defineProperty 定义 value 的 set 方法
        Object.defineProperty(input, 'value', {
            set: function(newValue) {
                this._value = newValue; // 内部存储值
                // 触发输入事件以模拟用户输入
                this.dispatchEvent(new Event('input', { bubbles: true }));
                // 触发 change 事件，确保状态更新
                this.dispatchEvent(new Event('change', { bubbles: true }));
                // 模拟键盘事件（可选，某些框架可能需要）
                this.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
                this.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', bubbles: true }));
                console.log(`Set input value to: ${newValue} using native set`);
            },
            get: function() {
                return this._value || '';
            },
            configurable: true,
            enumerable: true
        });

        // 设置值
        input.value = value; // 触发 set 方法

        // 确保 value 属性被正确设置（部分浏览器可能需要）
        if (input.value !== value) {
            input._value = value; // 直接设置内部值
            // 再次触发事件以确保同步
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }

    // 第二步：点击 "Supply" 按钮
    function handleSupplyButton() {
        findButtonByText('Supply', (supplyButton) => {
            if (isButtonClickable(supplyButton)) {
                supplyButton.click();
                console.log('Clicked "Supply" button. Waiting 5 seconds...');
            } else {
                console.log('"Supply" button is not clickable or not ready. Retrying in 5 seconds...');
                setTimeout(handleSupplyButton, 5000);
                return;
            }

            // 增加延迟，确保输入框加载
            setTimeout(() => {
                // 第三步：查找并检查输入框
                waitForElement('input[type="text"]', (inputField) => {
                    if (isInputEmpty(inputField)) {
                        const randomValue = (Math.random() * 0.009 + 0.001).toFixed(3);
                        setInputValue(inputField, randomValue);

                        // 增加延迟，确保输入被处理
                        setTimeout(() => {
                            // 第四步：点击 "Supply MON" 按钮
                            function handleSupplyMonButton() {
                                findButtonByText('Supply MON', (supplyMonButton) => {
                                    if (isButtonClickable(supplyMonButton)) {
                                        supplyMonButton.click();
                                        console.log('Clicked "Supply MON" button. Waiting for "All Done!" with infinite retry...');
                                    } else {
                                        console.log('"Supply MON" button is not clickable or not ready. Retrying in 5 seconds...');
                                        setTimeout(handleSupplyMonButton, 5000);
                                        return;
                                    }
                                });
                            }
                            handleSupplyMonButton();
                        }, 10000); // 等待10秒，确保输入被处理和后端响应
                    } else {
                        console.log('Input field is not empty, skipping input. Retrying in 5 seconds...');
                        setTimeout(() => waitForElement('input[type="text"]', (inputField) => handleSupplyButton(), Infinity, 3000), 5000);
                    }
                }, Infinity, 3000); // 每3秒检查一次，无限重试
            }, 5000); // 等待5秒，确保 "Supply" 按钮点击后页面更新
        });
    }
    // 使用定时器检查 "All Done!" 元素
    function checkForAllDone() {
        const successElement = document.querySelector('div._SuccessTitle_1542z_137');

        if (successElement && successElement.textContent.trim() === 'All Done!') {
            console.log('Operation completed successfully: All Done!');
            // 跳转到下一个 URL（修正了 URL 中的拼写错误）
            window.location.href = 'https://stake.apr.io/';
        } else {
            console.log('Did not find "All Done!". Retrying...');
            // 每5秒检查一次
            setTimeout(checkForAllDone, 5000);
        }
    }
    checkForAllDone();
    // 启动脚本
    handleSupplyButton();
})();


//MONAD STAK
(function() {
    'use strict';

    // 配置目标跳转URL
    const TARGET_URL = "https://earn.taker.xyz";

    // 第一步：判断路径

    // 辅助函数：等待元素出现
    function waitForElement(selector, callback, maxAttempts = 20, interval = 500) {
        return new Promise((resolve) => {
            let attempts = 0;
            const checkElement = setInterval(() => {
                const element = document.querySelector(selector);
                if (element) {
                    clearInterval(checkElement);
                    resolve(element);
                } else if (attempts >= maxAttempts) {
                    clearInterval(checkElement);
                    console.log(`未找到元素: ${selector}`);
                    resolve(null);
                } else {
                    attempts++;
                }
            }, interval);
        });
    }

    // 添加监视器来检测存款完成通知
    function watchForDepositNotification() {
        const notification = document.querySelector('.m_a49ed24.mantine-Notification-body');
        if (notification && notification.textContent.includes("Deposit completed")) {
            console.log("检测到存款完成通知，正在跳转...");
            window.location.href = TARGET_URL;
        }
    }

    // 辅助函数：随机延迟
    function randomy(min, max) {
        return new Promise(resolve => setTimeout(resolve, Math.random() * (max - min) + min));
    }

    // 模拟粘贴输入
    function simulatePaste(inputElement, inputValue) {
        inputElement.value = inputValue;
        return Promise.resolve();
    }

    // 输入文本函数
    async function inputText(selector, eventType, inputValue, isPaste = false) {
        try {
            const inputElement = await waitForElement(selector);
            if (!inputElement) {
                console.log(`Input element ${selector} not found.`);
                return false;
            }

            if (inputElement.value !== '') {
                console.log(`Input field ${selector} is not empty. Skipping input.`);
                return false;
            }

            inputElement.focus();
            await randomy(100, 300);

            if (isPaste) {
                await simulatePaste(inputElement, inputValue);
            } else {
                for (let char of inputValue.toString()) {
                    document.execCommand('insertText', false, char);
                    await randomy(50, 150);
                }
            }

            inputElement.dispatchEvent(new Event(eventType, { bubbles: true, cancelable: true }));
            await randomy(100, 300);
            inputElement.blur();

            if (inputElement.value === inputValue.toString()) {
                console.log(`Input completed for ${selector}`);
                return true;
            } else {
                console.log(`Input verification failed for ${selector}`);
                return false;
            }
        } catch (error) {
            console.error(`Error inputting text for ${selector}:`, error);
            return false;
        }
    }

    // 处理输入框和质押按钮
    async function waitForInputAndStake() {
        const inputElement = await waitForElement(
            'input.mantine-Input-input.mantine-NumberInput-input[type="text"][inputmode="numeric"]'
        );
        if (inputElement) {
            const inputValue = inputElement.value.trim();
            console.log(`当前输入框值: ${inputValue}`);

            if (!inputValue) {
                const inputSuccess = await inputText(
                    'input.mantine-Input-input.mantine-NumberInput-input[type="text"][inputmode="numeric"]',
                    'change',
                    '0.01',
                    false
                );
                if (inputSuccess) {
                    console.log("输入框处理完成，等待点击 Stake 按钮");
                    await waitForStakeButton(inputElement);
                }
            } else {
                console.log("输入框不为空，直接点击 Stake 按钮");
                await waitForStakeButton(inputElement);
            }
        } else {
            console.log("未找到输入框元素");
        }
    }

    // 处理 Stake 按钮
    async function waitForStakeButton(inputElement) {
        const stakeButton = await waitForElement(
            'button.mantine-Button-root[data-variant="gradient"][data-size="lg"]'
        );
        if (stakeButton) {
            const buttonText = stakeButton.querySelector(".mantine-Button-label");
            if (buttonText && buttonText.textContent === "Stake" && !stakeButton.disabled) {
                const currentInputValue = inputElement.value.trim();
                if (currentInputValue) {
                    console.log("输入框不为空，点击 Stake 按钮");
                    stakeButton.click();
                    watchForDepositNotification();
                } else {
                    console.log("输入框为空，无法点击 Stake 按钮");
                }
            } else {
                console.log("Stake 按钮不可用或文本不匹配");
            }
        } else {
            console.log("未找到 Stake 按钮");
        }
    }

    function scanForConnectButton() {
        const intervalId = setInterval(() => {
            const buttons = document.querySelectorAll('button');
            let initialConnectButton = null;

            for (const button of buttons) {
                const buttonLabel = button.querySelector('.mantine-Button-label');
                if (buttonLabel && buttonLabel.textContent === "Connect Wallet" && !button.disabled) {
                    initialConnectButton = button;
                    break;
                }
            }

            if (initialConnectButton) {
                console.log("定时器找到初始 'Connect Wallet' 按钮，执行点击并停止扫描");
                initialConnectButton.click();
                clearInterval(intervalId); // 找到按钮后停止定时器
                //waitForMetaMaskAndStake();
            } else {
                console.log("未找到可用 'Connect Wallet' 按钮，继续扫描...");
            }
        }, 1000); // 每 1 秒扫描一次
    }

    if (window.location.href=="https://stake.apr.io/") {
        setInterval(() => {
            waitForStakeButton();
            waitForInputAndStake();
        }, 5000);
        scanForConnectButton();

        setInterval(() => {
            watchForDepositNotification();
        }, 2000);
    }

})();

//cess x 连接
(function() {
    'use strict';

    // Flag to track button state
    let continueButtonClicked = false;

    // Wait for the page to fully load
    window.addEventListener('load', function() {
        // Check if we're on the correct page
        if (window.location.pathname !== '/deshareairdrop/login') {
            return;
        }

        // Function to check if checkbox is checked
        function isCheckboxChecked() {
            const checkboxImg = document.querySelector('img[alt="icon_checked"][src="/deshareairdrop/assets/icons/icon_checked.png"]');
            return checkboxImg !== null;
        }

        // Function to click checkbox
        function clickCheckbox() {
            const checkbox = document.querySelector('img[alt="icon_checked"]');
            if (checkbox) {
                checkbox.click();
                console.log('Checkbox clicked.');
            }
        }

        // Function to click Continue with X button
        function clickContinueButton() {
            if (!continueButtonClicked) {
                // Try to find the button by text content
                const buttons = document.querySelectorAll('button');
                let targetButton = null;
                buttons.forEach(button => {
                    if (button.textContent.trim() === 'Continue with X') {
                        targetButton = button;
                    }
                });

                if (targetButton) {
                    targetButton.click();
                    continueButtonClicked = true;
                    console.log('Continue with X button clicked.');
                } else {
                    // Fall back to XPath if text search fails
                    const xpath = 'html/body/div/div/div[1]/div[2]';
                    const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
                    const button = result.singleNodeValue;

                    if (button) {
                        button.click();
                        continueButtonClicked = true;
                        console.log('Continue with X button clicked via XPath.');
                    } else {
                        console.log('Continue with X button not found.');
                    }
                }
            }
        }

        setInterval(() => {
            // Execute the sequence
            try {
                // Step 1: Ensure checkbox is checked
                if (!isCheckboxChecked()) {
                    clickCheckbox();
                }

                // Step 2: Wait 5 seconds, then click Continue with X button
                setTimeout(() => {
                    clickContinueButton();
                }, 5000);

            } catch (error) {
                console.error('Error in automation script:', error);
            }
        }, 10000);

    });
})();


//https://0xvm.com/honor
(function() {
    'use strict';

    if (location.href.includes('0xvm.com')) {
    var s = true
    setInterval(() => {
        const targetElement = document.querySelectorAll('div');
        targetElement.forEach(span => {
            if (span.textContent.trim().includes('Connect')) {
                window.location.href = 'https://klokapp.ai/app';
            }
        });
    },30000);
    // 每5秒执行一次操作
    setInterval(function() {
        // 1. 点击所有的 "Claim" 按钮
        let claimButtons = document.querySelectorAll('.CommBtn_communityAction__ylckW div');
        claimButtons.forEach(button => {
            if (button.textContent.trim() === "Claim") {
                button.click();
                console.log("Clicked Claim button");
            }
        });

        // 2. 点击 "Task +" 按钮
        let taskButton = document.querySelectorAll('.menuContent_itemContainer__plYUe');
        taskButton.forEach(button => {
            const buttonText = button.textContent.trim();
            if (buttonText.includes("Task + ")) {
                button.click();
                console.log("Clicked TASK button");
            }
        });

        // 3. 检查 "Daily" 选项卡状态，如果未选中则点击
        let dailyTab = document.querySelector("#root > div.Honor_body__sQwxN > div.Honor_bodyContainer__FNNpU > div > div.itemContent_menuContent__82y8F > div.itemContent_menuBottomContainer__Af\\+RR > div > div.itemContent_taskContainerTabs__QdOtS > span:nth-child(2)")
        if (dailyTab && dailyTab.textContent.trim() === 'Daily') {
            dailyTab.click();
            console.log("Clicked Daily tab");
        }
        // 4. 依次点击 "Daily check in", "Play on Scribbl'd", "Share on Twitter" 的按钮
        let tasks = document.querySelectorAll('.itemContent_taskContainerContentItem__7ZLF9');
        tasks.forEach(task => {
            let taskText = task.querySelector('.itemContent_taskContainerContentItemTasksText__xZcIt').textContent.trim();
            let actionButton = task.querySelector('.CommBtn_communityAction__ylckW div');

            if (actionButton) {
                if (taskText === "Daily check in" && actionButton.textContent.trim() === "Claim") {
                    actionButton.click();
                    console.log("Clicked Daily check in Claim button");
                }
                if (taskText === "Play on Scribbl'd" && actionButton.textContent.trim() === "Go") {
                    actionButton.click();
                    console.log("Clicked Play on Scribbl'd Go button");
                }
                if (taskText === "Share on Twitter" && actionButton.textContent.trim() === "Share") {
                    actionButton.click();
                    console.log("Clicked Share on Twitter Share button");
                }
                s=false;
            }
        });

        // 5. 检查是否所有按钮都消失
        let remainingButtons = document.querySelectorAll('.CommBtn_communityAction__ylckW div');
        let hasButtons = Array.from(remainingButtons).some(button =>
            button.textContent.trim() === "Claim" ||
            button.textContent.trim() === "Go" ||
            button.textContent.trim() === "Share"
        );

        if (!hasButtons && !s){
             setTimeout(() => {
                window.location.href = 'https://klokapp.ai/app';
            }, 15000);
            console.log("All buttons have disappeared. Stopping script.");
            clearInterval(this);
        }
    }, 5000); // 每5秒执行一次
    }
})();

(function() {
    'use strict';

    // 目标路径
    const targetUrl = "https://app.crystal.exchange/swap";
    if (window.location.href.includes(targetUrl)) {
    // 状态标志，防止重复点击
    let connectButtonClicked = false;
    let metaMaskButtonClicked = false;

    // 检查当前路径并执行点击操作
    function checkPathAndClick() {

            console.log("路径匹配，开始执行按钮点击操作");

            // 检查第一个按钮（Connect Wallet）
            if (!connectButtonClicked) {
                const connectButton = document.querySelector('button.connect-button');
                if (connectButton) {
                    connectButton.click();
                    connectButtonClicked = true;
                    console.log("已点击 'Connect Wallet' 按钮");
                }
            }

            // 检查第二个按钮（MetaMask）
            if (connectButtonClicked && !metaMaskButtonClicked) {
                const walletButtons = document.querySelectorAll('button.wallet-option');
                let metaMaskButton = null;

                walletButtons.forEach(button => {
                    const walletName = button.querySelector('span.wallet-name');
                    if (walletName && walletName.textContent.trim() === "MetaMask") {
                        metaMaskButton = button;
                    }
                });

                if (metaMaskButton) {
                    metaMaskButton.click();
                    metaMaskButtonClicked = true;
                    console.log("已点击 'MetaMask' 按钮");
                }
            }

    }

    // 使用定时器定期检查
    const checkInterval = setInterval(() => {
        checkPathAndClick();

        // 如果两个按钮都已点击，停止定时器
        if (connectButtonClicked && metaMaskButtonClicked) {
            clearInterval(checkInterval);
            console.log("所有按钮已点击，脚本停止运行");
        }
    }, 1000); // 每秒检查一次
    var falg =true
    setInterval(() => {
        const button = document.querySelector('.swap-button')
        if (button.textContent.trim() === 'Swap') {
            // 检查按钮是否可点击（未被禁用）
            if (!button.disabled) {
                // 模拟点击按钮
                button.click();
                console.log('已点击 "Swap" 按钮');
            } else {
                console.log('按钮处于禁用状态，无法点击');
            }
        }
    }, 100000);
    setInterval(() => {
        var usdc = document.querySelector("#root > div > div.app-container > div.trade-container > div > div.right-column > div > div.swapmodal > div.inputbg > div.inputbutton1container > button > span")
        if(usdc && usdc.innerHTML=='USDC'){
            var usdcbtn = document.querySelector("#root > div > div.app-container > div.trade-container > div > div.right-column > div > div.swapmodal > div.inputbg > div.inputbutton1container > button")
            if(usdcbtn){
                usdcbtn.click();
            }
        }
        const buttons = document.querySelectorAll('.tokenbutton');
        buttons.forEach(button => {
            const tokenName = button.querySelector('.tokenlistname').textContent;
            if (tokenName === 'MON') {
                // 模拟点击事件
                button.click();
                console.log('已点击MON按钮');
            }
        });
        // 获取输入框元素
        const input = document.querySelector('.input');

        // 检查输入框是否为空
        if (!input.value) {
            // 生成 0.0001 到 0.0005 之间的随机数
            const min = 0.0001;
            const max = 0.0005;
            const randomNumber = (Math.random() * (max - min) + min).toFixed(4); // 保留4位小数
            // 确保输入框获得焦点
            input.focus();
            // 使用 document.execCommand 插入随机数
            document.execCommand('insertText', false, randomNumber);
            console.log(`已向输入框插入随机数字: ${randomNumber}`);
        } else {
            console.log('输入框不为空，无需插入');
            const button = document.querySelector('.swap-button')
            if (button.textContent.trim() === 'Swap' && falg) {
                // 检查按钮是否可点击（未被禁用）
                if (!button.disabled) {
                    // 模拟点击按钮
                    button.click();
                    falg=false
                    console.log('已点击 "Swap" 按钮');
                } else {
                    console.log('按钮处于禁用状态，无法点击');
                }
            } else {
                console.log('按钮文本不是 "Swap"');
            }
            const link = document.querySelector('.view-transaction');
            if(link){
                setTimeout(() => {
                    window.location.href ='https://monadscore.xyz/';
                }, 40000);
            }
        }
    }, 1000);


    // 页面加载完成后首次运行
    window.addEventListener('load', () => {
        console.log("页面加载完成，开始检查路径和按钮");
        checkPathAndClick();
    });

    // 监听 DOM 变化，但避免重复点击
    const observer = new MutationObserver(() => {
        if (!connectButtonClicked || !metaMaskButtonClicked) {
            checkPathAndClick();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
         }
})();


(async function() {
    'use strict';

    if (window.location.hostname !== 'hub.beamable.network') {
        return;
    }

    const waitForVisibleElement = (selector, timeout = 60000, retries = 5) => {
        return new Promise((resolve) => {
            let attempt = 0;
            const checkElement = () => {
                const element = document.querySelector(selector);
                if (element && element.isConnected && (element.offsetParent !== null || getComputedStyle(element).display !== 'none')) {
                    observer.disconnect();
                    console.log(`找到可见元素 ${selector}, 文本: ${element.textContent.trim()}`);
                    resolve(element);
                } else if (attempt >= retries) {
                    observer.disconnect();
                    console.warn(`元素 ${selector} 在 ${retries} 次重试后仍不可见`);
                    resolve(null);
                } else {
                    attempt++;
                    console.log(`等待 ${selector}，第 ${attempt} 次重试`);
                    setTimeout(checkElement, 2000);
                }
            };

            const observer = new MutationObserver(checkElement);
            observer.observe(document.body, { childList: true, subtree: true });
            checkElement();

            setTimeout(() => {
                observer.disconnect();
                console.warn(`元素 ${selector} 在 ${timeout}ms 内未找到或不可见`);
                resolve(null);
            }, timeout);
        });
    };

    // 工具函数：延迟
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // 工具函数：安全点击并等待响应
    const safeClick = async (element, description, waitSelector = null, maxAttempts = 3) => {
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            if (!element || !element.isConnected) {
                console.log(`未找到或已断开 ${description} (尝试 ${attempt}/${maxAttempts})`);
                if (attempt === maxAttempts) {
                    console.log(`重试次数超过 ${maxAttempts}，重新定向到 https://hub.beamable.network/modules/questsold`);
                    window.location.href = 'https://hub.beamable.network/modules/questsold';
                }
                return false;
            }

            const isVisible = element.offsetParent !== null && getComputedStyle(element).display !== 'none';
            console.log(`${description} 可见性检查: display=${getComputedStyle(element).display}, offsetParent=${element.offsetParent !== null}, isConnected=${element.isConnected}`);

            if (isVisible || element.isConnected) {
                console.log(`点击 ${description} (尝试 ${attempt}/${maxAttempts})`);
                element.dispatchEvent(new Event('click', { bubbles: true, cancelable: true }));
                await delay(3000);

                if (waitSelector) {
                    const nextElement = await waitForVisibleElement(waitSelector);
                    if (nextElement) {
                        console.log(`${description} 点击成功，${waitSelector} 已加载`);
                        return nextElement;
                    } else {
                        console.warn(`${description} 点击后未加载 ${waitSelector} (尝试 ${attempt}/${maxAttempts})`);
                        if (attempt === maxAttempts) {
                            console.log(`重试次数超过 ${maxAttempts}，重新定向到 https://hub.beamable.network/modules/questsold`);
                            window.location.href = 'https://hub.beamable.network/modules/questsold';
                            return null;
                        }
                        await delay(5000);
                        continue;
                    }
                }
                return true;
            } else {
                console.log(`不可见 ${description}，尝试等待 (尝试 ${attempt}/${maxAttempts})`);
                const visibleElement = await waitForVisibleElement('a.h-full.flex.flex-col.justify-between.p-4');
                if (visibleElement && visibleElement.innerText.includes(element.innerText)) {
                    console.log(`重新找到并点击 ${description}`);
                    visibleElement.dispatchEvent(new Event('click', { bubbles: true, cancelable: true }));
                    await delay(3000);
                    if (waitSelector) {
                        const nextElement = await waitForVisibleElement(waitSelector);
                        if (nextElement) {
                            console.log(`${description} 点击成功，${waitSelector} 已加载`);
                            return nextElement;
                        }
                    }
                    return true;
                }
                if (attempt === maxAttempts) {
                    console.log(`重试次数超过 ${maxAttempts}，重新定向到 https://hub.beamable.network/modules/questsold`);
                    window.location.href = 'https://hub.beamable.network/modules/questsold';
                    return false;
                }
                await delay(5000);
            }
        }
        return false;
    };

    // 工具函数：等待元素列表恢复
    const waitForElementList = async (maxWait = 60000) => {
        const startTime = Date.now();
        while (Date.now() - startTime < maxWait) {
            const elements = document.querySelectorAll('a.h-full.flex.flex-col.justify-between.p-4');
            if (elements.length > 0) {
                console.log(`元素列表已恢复，找到 ${elements.length} 个元素`);
                return elements;
            }
            console.log('元素列表为空，等待恢复...');
            await delay(2000);
        }
        console.warn(`元素列表在 ${maxWait}ms 内未恢复，退出脚本`);
        return [];
    };

    // 前置步骤：点击元素0
    try {
        const element0Selector = '.transition-all.duration-300.w-full.cursor-pointer.flex.items-center.h-10.min-h-10';
        const potentialElements0 = document.querySelectorAll(element0Selector);
        console.log(`找到 ${potentialElements0.length} 个潜在元素0`);
        let element0 = Array.from(potentialElements0).find(el => el.textContent.trim().includes('Earn Points'));

        if (!element0) {
            console.warn('未找到包含 "Earn Points" 的元素0，尝试等待');
            element0 = await waitForVisibleElement(element0Selector);
            if (element0 && !element0.textContent.trim().includes('Earn Points')) {
                console.warn('找到元素0，但文本不包含 "Earn Points"');
                element0 = null;
            }
        }

        if (element0) {
            await safeClick(element0, '元素0');
            await delay(1500); // 点击元素0后延迟1.5秒
        } else {
            console.error('最终未找到包含 "Earn Points" 的元素0，继续执行后续步骤');
            await delay(1500); // 未找到仍延迟1.5秒
        }
    } catch (e) {
        console.error('点击元素0出错:', e.message);
        await delay(1500); // 出错时也延迟1.5秒
    }

    // 第一步：处理元素1和元素1-1
    try {
        const element1Selector = '.transition-all.duration-300.w-full.cursor-pointer.flex.items-center.h-10.min-h-10';
        const potentialElements1 = document.querySelectorAll(element1Selector);
        console.log(`找到 ${potentialElements1.length} 个潜在元素1`);
        let element1 = null;
        for (const el of potentialElements1) {
            const text = el.textContent.trim();
            console.log(`检查元素1候选: ${text}`);
            if (text === 'Quests') {
                element1 = el;
                break;
            }
        }

        if (!element1) {
            console.warn('未找到文本为 "Quests" 的元素1，尝试等待');
            element1 = await waitForVisibleElement(element1Selector);
            if (element1 && element1.textContent.trim() !== 'Quests') {
                console.warn('找到元素1，但文本不是 "Quests"');
                element1 = null;
            }
        }

        if (!element1) throw new Error('元素1 未找到');
        await safeClick(element1, '元素1');
        await delay(5000); // 点击元素1后等待5秒，确保页面加载

        let elementList = await waitForElementList(); // 初始加载元素1-1列表
        console.log(`找到 ${elementList.length} 个元素1-1`);

        for (let i = 0; i < elementList.length; i++) {
            elementList = await waitForElementList(); // 每次循环重新检查列表
            if (i >= elementList.length) {
                console.log('元素列表已耗尽，退出循环');
                break;
            }

            const element = elementList[i];
            const innerText = element.innerText.trim();
            console.log(`元素内容: ${innerText}`);

            const claimedStatus = element.querySelector('span.p3')?.textContent.trim() === 'Claimed';
            const claimableStatus = innerText.includes('Claimable') || element.querySelector('button')?.textContent.includes('Claimable') || element.querySelector('.claimable');
            const taskDescription = element.querySelector('.h3.line-clamp-3')?.textContent.trim() || '未知任务';

            if (claimedStatus) {
                console.log(`跳过已领取元素: ${taskDescription}`);
                continue;
            }

            if (claimableStatus) {
                console.log(`检测到Claimable状态: ${taskDescription}`);
                const clicked = await safeClick(element, `Claimable元素: ${taskDescription}`,
                    '#moduleGriddedContainer > div > div.flex.flex-col.gap-4 > div.lg\\:h-full.flex.flex-col.xl\\:flex-row.gap-2.sm\\:gap-4.lg\\:gap-8 > div.bg-content.flex.flex-col.py-4.px-6.gap-6.sm\\:gap-8.h3.xl\\:w-1\\/2 > div.flex.flex-col.gap-6.sm\\:gap-8.lg\\:gap-6.false > button');
                if (!clicked) continue;

                const element1_2 = await waitForVisibleElement('#moduleGriddedContainer > div > div.flex.flex-col.gap-4 > div.lg\\:h-full.flex.flex-col.xl\\:flex-row.gap-2.sm\\:gap-4.lg\\:gap-8 > div.bg-content.flex.flex-col.py-4.px-6.gap-6.sm\\:gap-8.h3.xl\\:w-1\\/2 > div.flex.flex-col.gap-6.sm\\:gap-8.lg\\:gap-6.false > button');
                if (!element1_2) continue;
                const clicked1_2 = await safeClick(element1_2, '元素1-2',
                    'div.w-full > button');
                if (!clicked1_2) continue;

                const element1_3 = await waitForVisibleElement('div.w-full > button');
                if (!element1_3) continue;
                const clicked1_3 = await safeClick(element1_3, '元素1-3');
                if (!clicked1_3) continue;

                const element1_4 = await waitForVisibleElement('#moduleGriddedContainer > div > div.xl\\:col-span-2.flex.justify-between.items-center > a');
                if (!element1_4) continue;
                await safeClick(element1_4, '元素1-4');
            } else {
                console.log(`检测到无状态: ${taskDescription}`);
                const clicked = await safeClick(element, `无状态元素: ${taskDescription}`,
                    '#moduleGriddedContainer > div > div.flex.flex-col.gap-4 > div.lg\\:h-full.flex.flex-col.xl\\:flex-row.gap-2.sm\\:gap-4.lg\\:gap-8 > div.bg-content.flex.flex-col.py-4.px-6.gap-6.sm\\:gap-8.h3.xl\\:w-1\\/2 > div.flex.flex-col.gap-6.sm\\:gap-8.lg\\:gap-6.false > div > div > div:nth-child(2) > a');
                if (!clicked) continue;

                const element1_5 = await waitForVisibleElement('#moduleGriddedContainer > div > div.flex.flex-col.gap-4 > div.lg\\:h-full.flex.flex-col.xl\\:flex-row.gap-2.sm\\:gap-4.lg\\:gap-8 > div.bg-content.flex.flex-col.py-4.px-6.gap-6.sm\\:gap-8.h3.xl\\:w-1\\/2 > div.flex.flex-col.gap-6.sm\\:gap-8.lg\\:gap-6.false > div > div > div:nth-child(2) > a');
                if (!element1_5) continue;
                const clicked1_5 = await safeClick(element1_5, '元素1-5');
                if (!clicked1_5) continue;

                const element1_4 = await waitForVisibleElement('#moduleGriddedContainer > div > div.xl\\:col-span-2.flex.justify-between.items-center > a');
                if (!element1_4) continue;
                await safeClick(element1_4, '元素1-4');
            }
            await delay(5000);
        }
    } catch (e) {
        console.error('第一步出错:', e.message);
        return;
    }

    // 第二步：处理元素2和元素2-1
    try {
        const element2Selector = '.transition-all.duration-300.w-full.cursor-pointer.flex.items-center.h-10.min-h-10';
        const potentialElements2 = document.querySelectorAll(element2Selector);
        console.log(`找到 ${potentialElements2.length} 个潜在元素2`);
        let element2 = null;
        for (const el of potentialElements2) {
            const text = el.textContent.trim();
            console.log(`检查元素2候选: ${text}`);
            if (text === 'Dailies') {
                element2 = el;
                break;
            }
        }

        if (!element2) {
            console.warn('未找到文本为 "Dailies" 的元素2，尝试等待');
            element2 = await waitForVisibleElement(element2Selector);
            if (element2 && element2.textContent.trim() !== 'Dailies') {
                console.warn('找到元素2，但文本不是 "Dailies"');
                element2 = null;
            }
        }

        if (!element2) throw new Error('元素2 未找到');
        await safeClick(element2, '元素2');
        await delay(3000);

        // 精准定位元素2-1
        const element2_1Selector = '.flex.items-center.whitespace-break-spaces.transition-all.duration-300.justify-center.gap-2';
        const potentialElements2_1 = document.querySelectorAll(element2_1Selector);
        console.log(`找到 ${potentialElements2_1.length} 个潜在元素2-1`);
        let element2_1 = null;
        for (const el of potentialElements2_1) {
            const text = el.textContent.trim();
            console.log(`检查元素2-1候选: ${text}`);
            if (text === 'Claim') {
                element2_1 = el;
                break;
            }
        }

        if (!element2_1) {
            console.warn('未找到文本为 "Claim" 的元素2-1，尝试等待');
            element2_1 = await waitForVisibleElement(element2_1Selector);
            if (element2_1 && element2_1.textContent.trim() !== 'Claim') {
                console.warn('找到元素2-1，但文本不是 "Claim"');
                element2_1 = null;
            }
        }

        if (element2_1) {
            await safeClick(element2_1, '元素2-1');
        } else {
            console.error('最终未找到文本为 "Claim" 的元素2-1');
        }
    } catch (e) {
        console.error('第二步出错:', e.message);
        return;
    }

    console.log('脚本执行完毕');
})();

(function() {
    'use strict';
    if (window.location.hostname !== 'monadscore.xyz') {
        console.log('此脚本仅适用于 klokapp.ai 域名，当前域名：' + window.location.hostname);
        return;
    }
    const Task =setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            // 检查按钮是否包含 "Continue with Google" 文本并且没有 disabled 属性
            if (button.textContent.includes('Do Task') &&
                !button.hasAttribute('disabled')) {
                console.log('找到可点击的按钮，正在点击...');
                button.click();
            } else if (button.hasAttribute('disabled')) {
                console.log('按钮不可点击，跳过');
            }
        });
    }, 5000);

    const clame =setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            // 检查按钮是否包含 "Continue with Google" 文本并且没有 disabled 属性
            if (button.textContent.includes('Claim') &&
                !button.hasAttribute('disabled')) {
                console.log('找到可点击的按钮，正在点击...');
                button.click();

            }
            clearInterval(clame)
            setInterval(() => {
                window.location.href='https://share.coresky.com/6cjyur/tasks-rewards'
            },60000);
        });
    }, 5000);




    const Claimed = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        let claimedCount = 0;

        buttons.forEach(button => {
            if (button.textContent.trim() === 'Claimed') {
                claimedCount++;
            }
        });

        if (claimedCount >= 3) {
            window.location.href='https://app.crystal.exchange/swap'
        }

    }, 5000);

    const login =setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            // 检查按钮是否包含 "Continue with Google" 文本并且没有 disabled 属性
            if (button.textContent.includes('Connect Wallet') &&
                !button.hasAttribute('disabled')) {
                console.log('找到可点击的按钮，正在点击...');
                button.click();
                clearInterval(login)
            } else if (button.hasAttribute('disabled')) {
                console.log('按钮不可点击，跳过');
            }
        });
    }, 3000);

    const MetaMask =setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            // 检查按钮是否包含 "Continue with Google" 文本并且没有 disabled 属性
            if (button.textContent.includes('MetaMask') &&
                !button.hasAttribute('disabled')) {
                console.log('找到可点击的按钮，正在点击...');
                button.click();
                clearInterval(MetaMask)
            } else if (button.hasAttribute('disabled')) {
                console.log('按钮不可点击，跳过');
            }
        });
    }, 2000);

    const RunNode =setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.includes('Run Node ') &&
                !button.hasAttribute('disabled')) {
                button.click();
                clearInterval(RunNode)
            }
        });
    }, 2000);

    setInterval(() => {
        const targetElement = document.querySelectorAll('span');
        targetElement.forEach(span => {
            if (span.textContent.trim().includes('Next Epoch')) {
                window.location.href = 'https://monadscore.xyz/tasks';
            }
        });
    }, 2000);
})();


(function() {
    'use strict';
    if (window.location.hostname !== 'www.parasail.network') {
        console.log('此脚本仅适用于 klokapp.ai 域名，当前域名：' + window.location.hostname);
        return;
    }

    const login =setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.includes('Connect Wallet') &&
                !button.hasAttribute('disabled')) {
                console.log('找到可点击的按钮，正在点击...');
                button.click();
                clearInterval(login)
            }
        });
    }, 3000);

    const MetaMask =setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            // 检查按钮是否包含 "Continue with Google" 文本并且没有 disabled 属性
            if (button.textContent.includes('MetaMask') &&
                !button.hasAttribute('disabled')) {
                console.log('找到可点击的按钮，正在点击...');
                button.click();
                clearInterval(MetaMask)
            }
        });
    }, 2000);

    const ActivateMyParasailNode =setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            // 检查按钮是否包含 "Continue with Google" 文本并且没有 disabled 属性
            if (button.textContent.includes('Activate My Parasail Node') &&
                !button.hasAttribute('disabled')) {
                console.log('找到可点击的按钮，正在点击...');
                button.click();
                clearInterval(ActivateMyParasailNode)
            } else if (button.hasAttribute('disabled')) {
                console.log('按钮不可点击，跳过');
            }
        });
    }, 2000);

    var falg=false;
    var falgurl = true;
    setInterval(() => {
        const Element = document.querySelectorAll('p');
        Element.forEach(span => {
            if (span.textContent.trim().includes('Expires in ') && falgurl) {
                falgurl=false;
                window.location.href = 'http://monadscore.xyz';
            }
        });

        const targetElement = document.querySelectorAll('div');
        targetElement.forEach(span => {
            if (span.textContent.trim().includes('Your Parasail Node is Activated Successfully!')) {
                falg=true;
            }
        });


    }, 2000);

    var run =false

    const RunNode =setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if(!button.textContent.includes('Connect Wallet') && !button.textContent.includes('Activate My Parasail Node') && !button.textContent.includes('MetaMask')){
                if (button.textContent.includes('Run Node') &&
                    !button.hasAttribute('disabled')) {
                    button.click();
                    run=true
                    clearInterval(RunNode)
                }
            }
        });
    }, 10000);

    var i = 0;
    const start = setInterval(() => {
        const buttons = document.querySelectorAll('.MuiBox-root.css-i6tyva'); // 查找目标元素
        buttons.forEach(button => {
            if(!button.textContent.includes('Connect Wallet') && !button.textContent.includes('Activate My Parasail Node') && !button.textContent.includes('MetaMask') && falg && run){
                if (button && !button.hasAttribute('disabled')) {
                    button.click();
                    i++
                    if(i>3){
                        clearInterval(start);
                    }
                }
            }
        });
    }, 20000);
    setInterval(() => {
        const targetElement = document.querySelectorAll('div');
        targetElement.forEach(span => {
            if (span.textContent.trim().includes('You have reached the maximum number of attempts. Please wait')) {
                window.location.href = 'https://monadscore.xyz/tasks';
            }
        });
    }, 2000);
})();

//bit77
(function() {
    'use strict';

    // Delay the script execution by 5 seconds (5000 milliseconds)
    setTimeout(() => {
        // Check if the hostname matches
        if (window.location.hostname !== 'bithub.77-bit.com') {
            return;
        }

        // Interval to click "FREE" button on /shop page
        const FREE = setInterval(() => {
            const buttons = document.querySelectorAll('div');
            buttons.forEach(button => {
                if (button.textContent.trim().includes('FREE') &&
                    !button.hasAttribute('disabled') &&
                    window.location.pathname === '/shop') {
                    button.click();
                    clearInterval(FREE);
                }
            });
        }, 5000);

        // Interval to handle "PURCHASE SUCCESS" or "SOLD OUT" on /shop page
        const PURCHASE = setInterval(() => {
            const buttons = document.querySelectorAll('div');
            buttons.forEach(button => {
                if (button.textContent.includes(' PURCHASE SUCCESS ') &&
                    window.location.pathname === '/shop') {
                    const targetElement = document.querySelector("#__nuxt > div.root.root--bg-unset > div.root__header > div > div.buttons.header__buttons > div.clip-container.common-button.button.buttons__home");
                    if (targetElement) {
                        targetElement.click();
                        clearInterval(PURCHASE);
                    }
                } else {
                    const buttons = document.querySelectorAll('div');
                    buttons.forEach(button => {
                        if (button.textContent.trim().includes('SOLD OUT') &&
                            window.location.pathname === '/shop') {
                            const targetElement = document.querySelector("#__nuxt > div.root.root--bg-unset > div.root__header > div > div.buttons.header__buttons > div.clip-container.common-button.button.buttons__home");
                            if (targetElement) {
                                targetElement.click();
                                clearInterval(PURCHASE);
                            }
                        }
                    });
                }
            });
        }, 5000);

        // Interval to click "START MINING" button (not on /shop or /daily)
        const START = setInterval(() => {
            const buttons = document.querySelectorAll('div');
            buttons.forEach(button => {
                if (button.textContent.trim().includes('START MINING') &&
                    !button.hasAttribute('disabled') &&
                    window.location.pathname !== '/shop' &&
                    window.location.pathname !== '/daily') {
                    button.click();
                    clearInterval(START);
                }
            });
        }, 5000);
        
        const CLAIMH = setInterval(() => {
            const buttons = document.querySelectorAll('div');
            buttons.forEach(button => {
                if (button.textContent.trim().includes('CLAIM') &&
                    !button.hasAttribute('disabled') &&
                    window.location.pathname !== '/shop' &&
                    window.location.pathname !== '/daily') {
                    button.click();
                    clearInterval(CLAIMH );
                }
            });
        }, 5000);

        // Interval to click "DAILY REWARDS" button (not on /shop or /daily)
        const DAILY = setInterval(() => {
            const time = document.querySelector("#__nuxt > div.root > div.achievements > div.achievements__mining > div > div.clip-container.common-button.button.mining__button.mining-default-btn.mining-default-btn--disabled.mining-progress-btn.mining__button-custom > div > div.common-button__content > h1 > div > h1");
            if (time) {
                const buttons = document.querySelectorAll('div');
                buttons.forEach(button => {
                    if (button.textContent.trim().includes('DAILY REWARDS') &&
                        !button.hasAttribute('disabled') &&
                        window.location.pathname !== '/shop' &&
                        window.location.pathname !== '/daily') {
                        button.click();
                        clearInterval(DAILY);
                    }
                });
            }
        }, 5000);

        // Interval to click "CLAIM REWARD" button on /daily page
        const CLAIM = setInterval(() => {
            const buttons = document.querySelectorAll('div');
            buttons.forEach(button => {
                if (button.textContent.trim().includes('CLAIM REWARD') &&
                    window.location.pathname !== '/shop' &&
                    window.location.pathname === '/daily') {
                    
                    // Find the parent button element (likely has class 'common-button')
                    const parentButton = button.closest('div[class*="common-button"]');
                    if (!parentButton) return; // If no parent button found, skip
        
                    // Check if the button has the disabled class
                    const isDisabled = parentButton.classList.contains('common-button--disabled');
        
                    if (!isDisabled && !parentButton.hasAttribute('disabled')) {
                        // If the button is not disabled, click it
                        parentButton.click();
                        clearInterval(CLAIM);
                    } else {
                        // If the button is disabled, redirect
                        window.location.href = 'https://monadscore.xyz/';
                        clearInterval(CLAIM); // Clear the interval after redirect
                    }
                }
            });
        }, 5000);

        // Interval to handle "CLAIMED!" and redirect on /daily page
        const CLAIMED = setInterval(() => {
            const buttons = document.querySelectorAll('div');
            buttons.forEach(button => {
                if (button.textContent.trim().includes('CLAIMED!') &&
                    !button.hasAttribute('disabled') &&
                    window.location.pathname === '/daily') {
                    window.location.href = 'https://monadscore.xyz/';
                    clearInterval(CLAIMED); // Clear the interval after redirect
                }
            });
        }, 5000);

    }, 5000); // Delay of 5 seconds before the script starts
})();

(function() {
    'use strict';

    if (window.location.hostname == 'www.coresky.com' || window.location.hostname == 'share.coresky.com') {
        const Connect = setInterval(() => {
            // Use a more specific selector for the button (e.g., a class or data attribute)
            const buttons = document.querySelectorAll('div.head-connect'); // Adjust selector as needed
            buttons.forEach(button => {
                if (button.textContent.includes('Connect Wallet') &&
                    !button.hasAttribute('disabled')) {
                    button.click(); // Call click() on the individual button
                    clearInterval(Connect); // Stop the interval after clicking
                }
            });
        }, 5000);

        const MetaMask = setInterval(() => {
            // Target the div with class 'item' containing a span with 'MetaMask'
            const buttons = document.querySelectorAll('div.item');
            buttons.forEach(button => {
                if (button.querySelector('span.txt')?.textContent.includes('MetaMask') &&
                    !button.hasAttribute('disabled')) {
                    button.click(); // Click the MetaMask div
                    clearInterval(MetaMask); // Clear the interval after clicking
                }
            });
        }, 5000);

        var falg = false;

        const Check = setInterval(() => {
            // Check for the "Connect Wallet" and "MetaMask" buttons
            const connectWalletButton = document.querySelector('div.head-connect');
            const metaMaskButton = document.querySelector('div.item span.txt');

            // Only proceed if both buttons are NOT present
            if (!connectWalletButton) {
                // Find the "Check-in" button
                const checkInButton = document.querySelector('button.el-button.el-button--primary.css-btn');
                if (checkInButton && checkInButton.textContent.includes('Check-in') && !checkInButton.hasAttribute('disabled')) {
                    checkInButton.click();
                    falg=true;
                    clearInterval(Check);
                }
            }
        }, 1000);

        setInterval(() => {
            if(falg){
                window.location.href = 'https://www.coresky.com/meme';
            }
        }, 5000);
    }

})();


(function() {

    if (window.location.href !== 'https://www.coresky.com/meme') {
        console.log('Not on target page (https://www.coresky.com/meme), script stopped');
        return;
    }

    const Vote = setInterval(() => {
        // 使用 XPath 查找目标 Vote 按钮
        const buttons = document.evaluate(
            '//*[@id="app"]/div[2]/div[1]/div[2]/div[3]/div[1]/div[1]/div[1]/div[3]/div[1]',
            document,
            null,
            XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
            null
        );

        // 使用 forEach 风格遍历，只点击第一个符合条件的
        let clicked = false;
        for (let i = 0; i < buttons.snapshotLength; i++) {
            const button = buttons.snapshotItem(i);
            if (!clicked && button.textContent.includes('Vote') && !button.hasAttribute('disabled')) {
                button.click();
                console.log('Clicked the first Vote button at specified XPath');

                // 等待弹窗出现并处理
                setTimeout(() => {
                    // 查找弹窗中的分数、输入框和确认按钮
                    const scoreElement = document.querySelector('div.dialog-content div.point span');
                    const inputElement = document.querySelector('div.dialog-content input.el-input__inner');
                    const confirmButton = document.querySelector('div.dialog-content button.el-button--primary');

                    if (scoreElement && inputElement && confirmButton) {
                        const score = parseInt(scoreElement.textContent.trim(), 10);
                        console.log(`Found score: ${score}`);

                        // 检查分数是否大于 0
                        if (score > 0) {
                            // 输入分数
                            inputElement.value = score;
                            // 触发 input 和 change 事件，确保 UI 更新
                            inputElement.dispatchEvent(new Event('input', { bubbles: true }));
                            inputElement.dispatchEvent(new Event('change', { bubbles: true }));
                            console.log(`Input score: ${score}`);

                            // 等待按钮启用（最多等待 3 秒）
                            let attempts = 0;
                            const waitForButton = setInterval(() => {
                                attempts++;
                                if (!confirmButton.hasAttribute('disabled') && !confirmButton.classList.contains('is-disabled')) {
                                    confirmButton.click();
                                    setInterval(() => {
                                        window.location.href = 'https://monad-test.kinza.finance/#/details/MON';
                                    }, 5000);
                                    clearInterval(waitForButton);
                                } else if (attempts >= 30) { // 3 秒（100ms * 30）
                                    console.log('Confirm button remains disabled after waiting');
                                    clearInterval(waitForButton);
                                }
                            }, 100); // 每 100ms 检查一次
                        } else {
                            window.location.href = 'https://monad-test.kinza.finance/#/details/MON';
                        }
                    } else {
                        console.log('Dialog elements not found');
                    }

                    // 清除定时器，确保只操作一次
                    clearInterval(Vote);
                    console.log('Timer cleared, script stopped');
                }, 1000); // 等待 1 秒以确保弹窗加载

                clicked = true; // 防止后续点击
            }
        }
    }, 5000); // 每 5 秒检查一次
})();




(function() {
    if (window.location.hostname !== 'points.reddio.com') {
        return;
    }
    
  //  setInterval(() => {
 //       window.location.href = 'https://cess.network/deshareairdrop/';
  //  }, 50000);

})();


(function() {
    'use strict';
    
    if (window.location.hostname !== 'cess.network') {
        console.log('此脚本仅适用于 klokapp.ai 域名，当前域名：' + window.location.hostname);
        return;
    }
    setInterval(() => {
        window.location.reload(); // 刷新当前页面
    }, 80000); // 80秒 = 80000毫秒
    
    const clickIcon = setInterval(() => {
        // 目标是带有特定class和src的img元素
        const icons = document.querySelectorAll('img.cursor-pointer');
        icons.forEach(icon => {
            if (icon.getAttribute('src') === '/deshareairdrop/assets/icons/icon_uncheck.png' && 
                icon.getAttribute('alt') === 'icon_checked' &&
                !icon.hasAttribute('disabled')) {
                icon.click(); // 点击匹配的图标
            }
        });
    }, 1000);
    let isIconChecked = false;
    const clickSequence = setInterval(() => {
        const icons = document.querySelectorAll('img.cursor-pointer');
        

        icons.forEach(icon => {
            if (icon.getAttribute('src') === '/deshareairdrop/assets/icons/icon_checked.png' && 
                icon.getAttribute('alt') === 'icon_checked') {
                isIconChecked = true;
            }
        });

        if (isIconChecked) {
            const buttons = document.querySelectorAll('button.cursor-pointer');
            buttons.forEach(button => {
                const img = button.querySelector('img[src="/deshareairdrop/assets/icons/icon_x.svg"]');
                const text = button.querySelector('p')?.textContent;
                if (img &&
                    text?.includes('Continue with X') && 
                    !button.hasAttribute('disabled')) {
                    isIconChecked=false;
                    button.click();
                }
            });
        }
    }, 5000);

    
    const clickCheckIn = setInterval(() => {
        // 使用正确的CSS选择器语法
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.includes('Check-in') && 
                button.classList.contains('bg-primary') && 
                !button.hasAttribute('disabled')) {
                button.click(); // 点击Check-in按钮
            }
        });
    }, 5000);
    
    const Retweet = setInterval(() => {
        // 使用正确的CSS选择器语法
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.includes('Retweet') && 
                button.classList.contains('bg-primary') && 
                !button.hasAttribute('disabled')) {
                button.click();
                clearInterval(Retweet);
            }
        });
    }, 5000);
    
    const Points = setInterval(() => {
        // 使用正确的CSS选择器语法
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.includes('Forwarded & Get Points') && 
                button.classList.contains('bg-primary') && 
                !button.hasAttribute('disabled')) {
                button.click();
                clearInterval(Points);
            }
        });
    }, 5000);
    
    setInterval(() => {
        // 使用正确的CSS选择器语法
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.includes('Start') && !button.textContent.includes('Check-in') && !button.textContent.includes('Forwarded & Get Points') ||
                window.location.pathname === '/deshareairdrop') {
                setTimeout(() => {
                    window.location.href = 'http://monadscore.xyz';
                }, 10000);
            }
        });
    }, 5000);
    

})();

(function() {
    'use strict';

    if (window.location.hostname !== 'app.mahojin.ai') {
        console.log('此脚本仅适用于 klokapp.ai 域名，当前域名：' + window.location.hostname);
        return;
    }

    // 检查特定按钮是否存在
    function buttonExists(buttonText) {
        const buttons = document.querySelectorAll('button');
        return Array.from(buttons).some(button =>
            button.textContent.includes(buttonText) &&
            !button.hasAttribute('disabled')
        );
    }

    // Connect Wallet 按钮处理
    const login = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.includes('Connect Wallet') &&
                !button.hasAttribute('disabled')) {
                console.log('找到可点击的Connect Wallet按钮，正在点击...');
                button.click();
                clearInterval(login);
            } else if (button.hasAttribute('disabled')) {
                console.log('Connect Wallet按钮不可点击，跳过');
            }
        });
    }, 3000);

        const maxAttempts = 60; // 最多尝试60次（约60秒）
    let attemptCount = 0;

    const checkGoogleButton = setInterval(() => {
        attemptCount++;
        console.log(`尝试 ${attemptCount}: 开始查找 Google 按钮...`);

        // Step 1: 查找模态框
        let modal = document.querySelector('#dynamic-modal') || 
                    document.querySelector('div[class*="modal"]') || 
                    document.querySelector('div[data-testid*="modal"]');
        
        if (!modal) {
            console.log(`尝试 ${attemptCount}: 模态框未找到，尝试触发登录...`);
            // 尝试触发登录按钮（如果存在）
            const loginTrigger = document.querySelector('button[copykey*="login"], button[class*="login"], button[title*="login" i], button[class*="sign-in" i]');
            if (loginTrigger) {
                console.log('找到可能的登录触发按钮，点击以显示模态框...');
                loginTrigger.click();
            } else {
                console.log('未找到登录触发按钮，继续等待模态框...');
            }
        } else {
            console.log(`尝试 ${attemptCount}: 找到模态框，ID 或类名: ${modal.id || modal.className}`);
        }

        // Step 2: 检查 Shadow DOM（如果存在）
        let searchContext = document; // 默认搜索整个文档
        let shadowRoot = null;
        const shadowHost = document.querySelector('#dynamic-modal > div') || modal;
        if (shadowHost && shadowHost.shadowRoot) {
            shadowRoot = shadowHost.shadowRoot;
            searchContext = shadowRoot;
            console.log(`尝试 ${attemptCount}: 找到 Shadow DOM，切换搜索上下文`);
        } else {
            console.log(`尝试 ${attemptCount}: 未找到 Shadow DOM，使用普通 DOM`);
        }

        // Step 3: 查找 Google 图片
        const googleImage = searchContext.querySelector(
            'img[data-testid="iconic-google"], img[alt="Google"], img[src*="google"]'
        );

        if (googleImage) {
            console.log(`尝试 ${attemptCount}: 找到 Google 图片，详细信息:`, googleImage.outerHTML);
            // 查找包含图片的按钮
            const googleButton = googleImage.closest('button');
            
            if (googleButton) {
                console.log(`尝试 ${attemptCount}: 找到包含 Google 图片的按钮`);
                console.log('按钮 HTML:', googleButton.outerHTML);
                console.log('是否禁用:', googleButton.hasAttribute('disabled'));
                console.log('是否可见:', googleButton.offsetParent !== null);

                if (!googleButton.hasAttribute('disabled') && googleButton.offsetParent !== null) {
                    console.log('按钮可点击，正在点击...');
                    googleButton.click();
                    clearInterval(checkGoogleButton); // 点击一次后停止
                    return;
                } else {
                    console.log('按钮存在但不可点击（禁用或不可见），继续等待...');
                }
            } else {
                console.log(`尝试 ${attemptCount}: 找到 Google 图片，但未找到父按钮`);
            }
        } else {
            console.log(`尝试 ${attemptCount}: 未找到 Google 图片`);
        }

        // Step 4: 检查 iframe（如果存在）
        const iframes = document.querySelectorAll('iframe');
        if (iframes.length > 0 && !googleImage) {
            console.log(`尝试 ${attemptCount}: 检测到 ${iframes.length} 个 iframe，尝试搜索...`);
            iframes.forEach((iframe, index) => {
                try {
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                    const iframeImage = iframeDoc.querySelector(
                        'img[data-testid="iconic-google"], img[alt="Google"], img[src*="google"]'
                    );
                    if (iframeImage) {
                        console.log(`尝试 ${attemptCount}: 在 iframe ${index} 中找到 Google 图片`);
                        const iframeButton = iframeImage.closest('button');
                        if (iframeButton) {
                            console.log('iframe 中按钮 HTML:', iframeButton.outerHTML);
                            if (!iframeButton.hasAttribute('disabled')) {
                                console.log('iframe 中按钮可点击，正在点击...');
                                iframeButton.click();
                                clearInterval(checkGoogleButton);
                                return;
                            }
                        }
                    }
                } catch (e) {
                    console.log(`尝试 ${attemptCount}: 无法访问 iframe ${index} 的内容，可能跨域`);
                }
            });
        }

        // Step 5: 达到最大尝试次数
        if (attemptCount >= maxAttempts) {
            console.log('达到最大尝试次数（60次），停止搜索 Google 按钮');
            clearInterval(checkGoogleButton);
        }
    }, 1000); // 每秒检查一次

    const checkButtonsInterval = setInterval(() => {
        const connectWalletExists = buttonExists('Connect Wallet');
        const metaMaskExists = buttonExists('MetaMask');

        if (!connectWalletExists && !metaMaskExists) {
            // 当两个按钮都不存在时，启动 Claim 和 notClaim
            console.log('Connect Wallet 和 MetaMask 按钮都不存在，开始后续操作');

            const Claim = setInterval(() => {
                const buttons = document.querySelectorAll('button');
                buttons.forEach(button => {
                    if (button.textContent.includes('Claim') &&
                        !button.hasAttribute('disabled')) {
                        console.log('找到可点击的Claim按钮，正在点击...');
                        button.click();
                    }
                });
            }, 3000);

            const notClaim = setInterval(() => {
                const buttons = document.querySelectorAll('button');
                buttons.forEach(button => {
                    if (button.textContent.includes('Claim') &&
                        button.hasAttribute('disabled')) {
                        console.log('Claim按钮不可用，跳转页面...');
                        window.location.href = 'https://cess.network/deshareairdrop/';
                        clearInterval(notClaim);
                    }
                });
            }, 10000);

            // 清理检查间隔
            clearInterval(checkButtonsInterval);
        } else {
            console.log('等待Connect Wallet和MetaMask操作完成...');
        }
    }, 2000);

})();


(function() {
    'use strict';
    if (window.location.hostname !== 'testnet.tower.fi') {
        console.log('此脚本仅适用于 klokapp.ai 域名，当前域名：' + window.location.hostname);
        return;
    }

    const Connect =setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.includes('Connect wallet') &&
                !button.hasAttribute('disabled')) {
                button.click();
                clearInterval(Connect)
            }
        });
    }, 5000);

    // 点击元素
    if (typeof clickElement === 'undefined') {
        var clickElement = function(element) { // 使用 var 以兼容 Tampermonkey 环境
            if (element) {
                console.log('尝试点击元素:', element.outerHTML);
                const event = new Event('click', { bubbles: true, cancelable: true });
                element.dispatchEvent(event);
                console.log('已点击:', element.outerHTML);
            } else {
                console.log('点击失败：元素为空');
            }
        };
    }

    // 检查按钮是否可点击
    if (typeof isButtonEnabled === 'undefined') {
        var isButtonEnabled = function(button) {
            const enabled = !button.hasAttribute('disabled') && button.getAttribute('data-disabled') !== 'true';
            console.log('检查按钮状态:', {
                '文本': button.textContent.trim(),
                '是否可点击': enabled
            });
            return enabled;
        };
    }

    // 随机选择下拉菜单中的一个选项
    if (typeof selectRandomOption === 'undefined') {
        var selectRandomOption = function() {
            const dropdownButton = document.querySelector('button[aria-haspopup="menu"]');
            if (!dropdownButton) {
                console.log('未找到下拉菜单按钮。');
                return -1;
            }
            console.log('找到下拉菜单按钮:', dropdownButton.outerHTML);
            clickElement(dropdownButton);

            setTimeout(() => {
                const menuItems = document.querySelectorAll('div[id^="headlessui-menu-items-"] button[role="menuitem"]');
                console.log(`找到的下拉菜单选项数量: ${menuItems.length}`);

                if (menuItems.length === 0) {
                    console.log('未找到下拉菜单选项。');
                    return;
                }

                const randomIndex = Math.floor(Math.random() * menuItems.length);
                console.log(`随机选择的索引: ${randomIndex}, 选项文本: ${menuItems[randomIndex].textContent.trim()}`);
                clickElement(menuItems[randomIndex]);
            }, 500); // 延迟 500ms 等待菜单展开
            return 0; // 返回一个默认值，表示执行成功
        };
    }

    // 主逻辑
    function main() {
        let timeElapsed = 0;

        const interval = setInterval(() => {
            // 查找 "Request Tokens" 按钮
            const buttons = document.querySelectorAll('button');
            let requestButton = null;
            buttons.forEach(button => {
                if (button.textContent.trim().includes('Request Tokens')) {
                    console.log('找到 "Request Tokens" 按钮:', button.outerHTML);
                    requestButton = button;
                }
            });

            if (!requestButton) {
                console.log('未找到 "Request Tokens" 按钮。');
                return;
            }

            if (isButtonEnabled(requestButton)) {
                console.log('按钮现在可点击，正在点击...');
                clickElement(requestButton);
                setInterval(() => {
                    location.reload();
                }, 25000);
                timeElapsed = 0;
            } else {
                timeElapsed += 1;
                console.log(`已等待时间: ${timeElapsed}秒`);

                if (timeElapsed >= 60) {
                    console.log('已等待60秒，正在随机选择选项...');
                    const result = selectRandomOption();
                    if (result !== -1) {
                        timeElapsed = 0; // 只有在成功选择时重置计时
                    }
                }
            }
        }, 1000); // 每秒检查一次
    }

    // 启动脚本
    window.addEventListener('load', () => {
        console.log('脚本已启动。');
        main();
    });
})();

(function() {
    'use strict';
    if (window.location.hostname !== 'bithub.77-bit.com') {
        return;
    }
    // 每隔 1 秒尝试查找并点击按钮
    const clickButtonInterval = setInterval(() => {
        // 使用更精确的选择器定位元素
        const targetButtons = document.querySelectorAll('div.clip-container.common-button.button.abstract-login__button');
        targetButtons.forEach((button) => {
            const buttonText = button.textContent.trim();
            // 检查文本内容是否包含目标文本
            if (buttonText.includes('Sign in with Abstract')) {
                // 检查是否存在禁用相关的 CSS 属性（如 pointer-events: none）
                const style = window.getComputedStyle(button);
                if (style.pointerEvents!== 'none') {
                    // 创建并触发点击事件
                    const clickEvent = new MouseEvent('click', {
                        bubbles: true,
                        cancelable: true,
                    });
                    button.dispatchEvent(clickEvent);
                    console.log('已点击按钮');
                    clearInterval(clickButtonInterval);
                } else {
                    console.log('按钮当前不可点击（pointer-events 为 none）');
                }
            }
        });
    }, 1000);
    // 间隔1秒查找并点击按钮，找到就停止查找
    const clickButtonIntervalCon = setInterval(() => {
        // 使用更精准的选择器，根据class定位元素
        const targetButton = document.querySelector('div.clip-container.common-button.button.confirm__button');
        if (targetButton) {
            // 检查是否存在禁用相关的CSS属性（如pointer-events: none）
            const style = window.getComputedStyle(targetButton);
            if (style.pointerEvents!== 'none') {
                const clickEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true
                });
                targetButton.dispatchEvent(clickEvent);
                console.log('已点击按钮');
                clearInterval(clickButtonIntervalCon);
            } else {
                console.log('按钮当前不可点击（pointer-events为none）');
            }
        }
    }, 1000);
    
    // Your code here...
})();

(function() {
    
    // 要查找的文本
    if (window.location.hostname !== 'privy.abs.xyz') {
        return;
    }
    const clickButtonIntervalGoogle = setInterval(() => {
        const targetText = "Google";
        // 获取页面上所有的按钮元素
        const buttons = document.querySelectorAll('button');

        // 遍历按钮元素
        buttons.forEach((button) => {
            // 获取按钮的文本内容并去除两端的空白字符
            const buttonText = button.textContent.trim();
            // 检查按钮文本是否包含目标文本
            if (buttonText.includes(targetText)) {
                const style = window.getComputedStyle(button);
                if (style.pointerEvents!== 'none') {
                    const clickEvent = new MouseEvent('click', {
                        bubbles: true,
                        cancelable: true
                    });
                    button.dispatchEvent(clickEvent);
                    clearInterval(clickButtonIntervalGoogle);
                    console.log(`已点击包含文本 "${targetText}" 的按钮`);
                } else {
                    console.log(`包含文本 "${targetText}" 的按钮当前不可点击（pointer-events 为 none）`);
                }
            }
        });
    }, 1000);
    
    const clickButtonIntervalSg = setInterval(() => {
        const targetText = "Sign and continue";
        const buttons = document.querySelectorAll('button');
        buttons.forEach((button) => {
            const buttonText = button.textContent.trim();
            // 检查按钮文本是否包含目标文本
            if (buttonText.includes(targetText)) {
                const style = window.getComputedStyle(button);
                if (style.pointerEvents!== 'none') {
                    const clickEvent = new MouseEvent('click', {
                        bubbles: true,
                        cancelable: true
                    });
                    button.dispatchEvent(clickEvent);
                    clearInterval(clickButtonIntervalSg);
                    console.log(`已点击包含文本 "${targetText}" 的按钮`);
                } else {
                    console.log(`包含文本 "${targetText}" 的按钮当前不可点击（pointer-events 为 none）`);
                }
            }
        });
    }, 1000);

    // Your code here...
})();

(function() {
    if (window.location.hostname !== 'testnet.somnia.network') {
        console.log('此脚本仅适用于 testnet.somnia.network 域名，当前域名：' + window.location.hostname);
        return;
    }

    // 随机字符串生成函数
    function generateRandomString(base, length) {
        let result = '';
        const characters = base.split('');
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters[randomIndex];
        }
        return result;
    }

    function generateRandomNumberString(min, max, length) {
        let result = '';
        for (let i = 0; i < length; i++) {
            const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
            result += randomNum;
        }
        return result;
    }

    // 状态变量
    let getSt = true;
    let falgswap = true;
    let createfalg = true;
    let hasClickedAmount = false; // 控制是否已点击 0.001 STT 按钮
    let hasClickedSendSTT = false; // 控制是否已点击 Send STT 按钮

    // 设置输入值的函数
    function setNativeInputValue(element, value) {
        const valueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        const event = new Event('input', { bubbles: true });
        valueSetter.call(element, value);
        element.dispatchEvent(event);
    }

    // 随机延迟
    function randomy(min, max) {
        return new Promise(resolve => setTimeout(resolve, Math.random() * (max - min) + min));
    }

    // 等待元素加载
    function waitForElement(selector) {
        return new Promise((resolve) => {
            const element = document.querySelector(selector);
            if (element) {
                resolve(element);
                return;
            }

            const observer = new MutationObserver(() => {
                const element = document.querySelector(selector);
                if (element) {
                    observer.disconnect();
                    resolve(element);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    // 监控并输入随机文本
    async function monitorAndInputRandomText() {
        const selector = 'input[name="amountIn"]';
        const getRandomValue = () => Math.floor(Math.random() * 5) + 1;
        const checkBalanceAndInput = async () => {
            try {
                const inputElement = await waitForElement(selector);
                const currentValue = parseFloat(inputElement.value || '0');
                const randomValue = getRandomValue().toString();
                if (currentValue <= 0) {
                    if (inputElement.value !== '' && inputElement.value !== '0') {
                        console.log(`Input field ${selector} is not empty. Skipping input.`);
                        return false;
                    }

                    inputElement.focus();
                    await randomy(100, 300);
                    setNativeInputValue(inputElement, randomValue);
                    inputElement.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
                    await randomy(100, 300);
                    inputElement.blur();

                    const success = inputElement.value === randomValue;
                    if (success) {
                        console.log(`Input completed and verified for ${selector} with value ${randomValue}`);
                    } else {
                        console.log(`Input verification failed for ${selector}`);
                    }
                    return success;
                }
                return false;
            } catch (error) {
                console.error(`Error in monitorAndInputText for ${selector}:`, error);
                return false;
            }
        };
        const intervalId = setInterval(async () => {
            const result = await checkBalanceAndInput();
            if (result) {
                clearInterval(intervalId);
            }
        }, 1000);
    }
    monitorAndInputRandomText();

    // 登录相关逻辑
    const login = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.includes('Connect') && !button.hasAttribute('disabled')) {
                button.click();
                clearInterval(login);
            }
        });
    }, 3000);

    const MetaMask = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.includes('MetaMask') && !button.hasAttribute('disabled')) {
                console.log('找到可点击的 MetaMask 按钮，正在点击...');
                button.click();
                clearInterval(MetaMask);
            } else if (button.hasAttribute('disabled')) {
                console.log('MetaMask 按钮不可点击，跳过');
            }
        });
    }, 2000);

    const checkButtons = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        let connectExists = false;
        let metaMaskExists = false;
        buttons.forEach(button => {
            if (button.textContent.includes('Connect') && !button.hasAttribute('disabled')) {
                connectExists = true;
            }
            if (button.textContent.includes('MetaMask') && !button.hasAttribute('disabled')) {
                metaMaskExists = true;
            }
        });
        if (connectExists || metaMaskExists) {
            console.log('检测到 "Connect" 或 "MetaMask" 按钮，等待...');
            return;
        }
        clearInterval(checkButtons);
        startRequestTokensAndGetSTT();
    }, 3000);

    function startRequestTokensAndGetSTT() {
        const RequestTokens = setInterval(() => {
            const buttons = document.querySelectorAll('button');
            buttons.forEach(button => {
                if (button.textContent.includes('Request Tokens') && !button.hasAttribute('disabled')) {
                    console.log('找到可点击的 "Request Tokens" 按钮，正在点击...');
                    button.click();
                    clearInterval(RequestTokens);
                }
            });
        }, 2000);

        const GetSTT = setInterval(() => {
            const button = document.querySelector('button[type="submit"]');
            if (button && button.textContent.trim() === 'Get STT' && !button.hasAttribute('disabled')) {
                console.log('找到可点击的 "Get STT" 按钮，正在点击...');
                button.click();
                setTimeout(() => {
                    getSt = false;
                }, 10000);
                clearInterval(GetSTT);
            } else if (button && button.hasAttribute('disabled')) {
                console.log('"Get STT" 按钮不可点击，跳过');
            }
        }, 2000);

        const send = setInterval(() => {
            const buttons = document.querySelectorAll('button');
            buttons.forEach(button => {
                if (button.textContent.includes('Send Tokens') && !button.hasAttribute('disabled') && !getSt) {
                    button.click();
                    clearInterval(send);
                }
            });
        }, 2000);

        const RandomButton = setInterval(() => {
            const buttons = document.querySelectorAll('button');
            const selectButton = Array.from(buttons).find(button =>
                button.textContent.trim().includes('Random Address') && !button.hasAttribute('disabled')
            );

            if (selectButton) {
                const clickEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                });
                selectButton.dispatchEvent(clickEvent);
                clearInterval(RandomButton);
            }
        }, 1000);

        setInterval(() => {
            if (!hasClickedAmount && !getSt) {
                const sden001 = document.querySelector("div.flex.w-full.gap-2 > button:nth-child(1)");
                if (sden001) {
                    sden001.click();
                    hasClickedAmount = true;
                    console.log('Clicked 0.001 STT button');
                } else {
                    console.log('0.001 STT button not found');
                }
            }
        }, 1000);

        const clickSTT = setInterval(() => {
            const sedden = document.querySelector(".send-tokens-internal-btn button[type='submit']");
            if (sedden && sedden.textContent.trim() === 'Send STT' && !sedden.disabled) {
                sedden.click();
                SdenSTTSuccess();
                clearInterval(clickSTT);
            }
        }, 5000);

        function SdenSTTSuccess() {
            const successSelector = 'div.text-sm.font-semibold';
            const intervalId = setInterval(() => {
                const successElement = checkElementExists(successSelector);
                if (successElement) {
                    const textContent = successElement.textContent.trim();
                    if (textContent === '✅ Transaction Confirmed') {
                        clearInterval(intervalId);
                        setTimeout(() => {
                            window.location.href = 'https://testnet.somnia.network/swap';
                        }, 5000);
                    }
                }
            }, 1000);
        }
    }

        const Approve = setInterval(() => {
            const buttons = document.querySelectorAll('button');
            buttons.forEach(button => {
                if (button.textContent.includes('Approve PING') && !button.hasAttribute('disabled') && window.location.pathname === '/swap') {
                    console.log('找到可点击的 Approve PING 按钮，正在点击...');
                    button.click();
                    clearInterval(Approve);
                }
            });
        }, 3000);

        function checkElementExists(selector) {
            return document.querySelector(selector);
        }

        function monitorBalanceAndClickMint() {
            const balanceSelector = 'p.text-xs.text-gray-500 span.font-mono';
            const buttonSelector = 'button.mint-token0-btn';

            const intervalId = setInterval(() => {
                const balanceElement = checkElementExists(balanceSelector);
                if (!balanceElement) {
                    console.log('Balance element not found');
                    return;
                }

                const balance = parseFloat(balanceElement.textContent || '0');

                if (balance <= 0) {
                    const buttons = document.querySelectorAll('button');
                    buttons.forEach(button => {
                        if (button.textContent.includes('Mint PING') && !button.hasAttribute('disabled') && window.location.pathname === '/swap') {
                            button.click();
                            clearInterval(intervalId);
                        }
                    });
                }
            }, 1000);

            const intervalIdMax = setInterval(() => {
                const balanceElement = checkElementExists(balanceSelector);
                if (!balanceElement) {
                    console.log('Balance element not found');
                    return;
                }

                const balance = parseFloat(balanceElement.textContent || '0');

                if (balance > 0 && falgswap) {
                    const buttons = document.querySelectorAll('button');
                    buttons.forEach(button => {
                        if (button.textContent.includes('Swap') && !button.hasAttribute('disabled') && window.location.pathname === '/swap') {
                            button.click();
                        }
                    });
                }
            }, 1000);
        }

        monitorBalanceAndClickMint();
        monitorSwapSuccess();
        CremonitorSwapSuccess();

        function monitorSwapSuccess() {
            const successSelector = 'div.text-sm.font-semibold';
            const intervalId = setInterval(() => {
                const successElement = checkElementExists(successSelector);
                if (successElement) {
                    const textContent = successElement.textContent.trim();
                    console.log('Found element, text content:', textContent);
                    if (textContent === '✅ Swapped tokens successfully' && window.location.pathname === '/swap') {
                        falgswap = false;
                        const buttons = document.querySelectorAll('button');
                        buttons.forEach(button => {
                            if (button.textContent.includes('Create Token') && !button.hasAttribute('disabled') && window.location.pathname === '/swap' && !falgswap) {
                                const clickEvent = new MouseEvent('click', {
                                    bubbles: true,
                                    cancelable: true,
                                });
                                button.dispatchEvent(clickEvent);
                                const keydownEvent = new KeyboardEvent('keydown', {
                                    key: 'Enter',
                                    code: 'Enter',
                                    keyCode: 13,
                                    bubbles: true,
                                    cancelable: true
                                });
                                button.dispatchEvent(keydownEvent);
                                createfalg = false;
                                clearInterval(intervalId);
                            }
                        });
                    }
                }
            }, 1000);
        }



        function CremonitorSwapSuccess() {
            const successSelector = 'div.text-sm.font-semibold';
            const intervalId = setInterval(() => {
                const successElement = checkElementExists(successSelector);
                if (successElement) {
                    const textContent = successElement.textContent.trim();
                    if (textContent === '✅ Token created successfully' && window.location.pathname === '/swap') {
                        //window.location.href = 'https://app.mahojin.ai/my/point';
                    }
                }
            }, 1000);
        }



    const fillInputs = setInterval(() => {
        const tokenNameInput = document.querySelector('#tokenName');
        const tokenTickerInput = document.querySelector('#tokenTicker');

        if (!tokenNameInput || !tokenTickerInput) {
            return;
        }

        const isTokenNameEmpty = tokenNameInput.value.trim() === '';
        const isTokenTickerEmpty = tokenTickerInput.value.trim() === '';

        if (isTokenNameEmpty && isTokenTickerEmpty) {
            const randomTokenName = generateRandomString('abc', 5);
            tokenNameInput.focus();
            setNativeInputValue(tokenNameInput, randomTokenName);
            tokenNameInput.blur();
            console.log('已填充 tokenName:', randomTokenName);
            const randomLength = Math.floor(Math.random() * 3) + 3;
            const randomTokenTicker = generateRandomNumberString(1, 9, randomLength);
            tokenTickerInput.focus();
            setNativeInputValue(tokenTickerInput, randomTokenTicker);
            tokenTickerInput.blur();
        } else {
            const buttons = document.querySelectorAll('button');
            buttons.forEach(button => {
                if (button.textContent.includes('Create Token') && !button.hasAttribute('disabled')) {
                    button.click();
                    clearInterval(fillInputs);
                }
            });
        }
    }, 5000);

    setInterval(() => {
        const tokenNameInput = document.querySelector('#tokenName');
        const tokenTickerInput = document.querySelector('#tokenTicker');

        if (!tokenNameInput || !tokenTickerInput) {
            return;
        }

        const isTokenNameEmpty = tokenNameInput.value.trim() === '';
        const isTokenTickerEmpty = tokenTickerInput.value.trim() === '';

        if (!isTokenNameEmpty && !isTokenTickerEmpty) {
            const buttons = document.querySelectorAll('button');
            buttons.forEach(button => {
                if (button.textContent.includes('Create Token') && !button.hasAttribute('disabled')) {
                    button.click();
                }
            });
        }
    }, 50000);
})();

(function() {
     if (window.location.hostname !== 'testnet-faucet.reddio.com') {
        return;
    }
    
    const targetTexts = ['Already claimed in 24h window', 'Tokens dispersed—check balances shortly!'];
    const targetUrl = 'https://testnet-bridge.reddio.com/';
    const interval = setInterval(() => {
        const divs = document.querySelectorAll('div');
        for (let i = 0; i < divs.length; i++) {
            const divText = divs[i].textContent;
            if (targetTexts.includes(divText)) {
                window.location.href = targetUrl;
                clearInterval(targetTexts)
            }
        }
    }, 1000);
})();
