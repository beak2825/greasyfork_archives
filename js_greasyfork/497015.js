// ==UserScript==
// @name         Pixiv作品熱門程度排序與篩選器
// @name:ja      Pixiv作品人気度ソート＆フィルター
// @name:en      Pixiv Illustration Popularity Sorter and Filter
// @namespace    https://github.com/Max46656
// @description  在追蹤繪師作品、繪師作品、標籤作品頁面中以按讚數進行排序，並僅顯示高於閾值的作品。
// @description:ja  フォローアーティスト作品、アーティスト作品、タグ作品ページで、いいね數でソートし、閾値以上の作品のみを表示します。
// @description:en  Sort Illustration by likes and display only those above the threshold on followed artist illustrations, artist illustrations, and tag illustrations pages.
// @namespace    https://github.com/Max46656
// @version      1.10.0
// @author       Max
// @match        https://www.pixiv.net/bookmark_new_illust.php*
// @match        https://www.pixiv.net/users/*
// @match        https://www.pixiv.net/tags/*
// @match        https://www.pixiv.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pixiv.net
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM.info
// @license MPL2.0
// @downloadURL https://update.greasyfork.org/scripts/497015/Pixiv%E4%BD%9C%E5%93%81%E7%86%B1%E9%96%80%E7%A8%8B%E5%BA%A6%E6%8E%92%E5%BA%8F%E8%88%87%E7%AF%A9%E9%81%B8%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/497015/Pixiv%E4%BD%9C%E5%93%81%E7%86%B1%E9%96%80%E7%A8%8B%E5%BA%A6%E6%8E%92%E5%BA%8F%E8%88%87%E7%AF%A9%E9%81%B8%E5%99%A8.meta.js
// ==/UserScript==
/* TODO
*提示文字多語言翻譯

*/
class pageStrategy {
    getThumbnailClass() {}
    getArtsClass() {}
    getRenderArtWallClass() {}
    getButtonAtClass() {}
    getAllButtonClass() {}
    getArtsCountClass(){}
}

class userStrategy extends pageStrategy{
    getThumbnailClass() {
        return 'li[offset] img'
    }
    getArtsClass() {
        return 'li[offset]';
    }
    getRenderArtWallClass() {
        return 'div:not([class]) div div div:not([class]) div:not([class]) div:has(li[offset])';
    }
    getArtWallAlignLeftClass(){
        return 'gqvfWY';
    }
    getButtonAtClass() {
        return 'nav:not(:has(button))';
    }
    getAllButtonClass() {
        return ['charcoal-button','kpPxqZ'];
    }
    getArtsCountClass(){
        return 'h2+div span:not([class])';
    }
}

class tagsStrategy extends pageStrategy{
    getThumbnailClass() {
        return 'a[data-gtm-user-id] img'
    }
    getArtsClass() {
        return 'section:not(:has(aside)) li:has(a[data-gtm-user-id])';
    }
    getRenderArtWallClass() {
        return 'div~div:has(a[data-gtm-user-id]):not(:has(aside))';
    }
    getArtWallAlignLeftClass(){
        return 'gqvfWY';
    }
    getButtonAtClass() {
        return 'div:nth-child(3) div:first-child div:first-child:has(div span+a+button)';
    }
    getAllButtonClass() {
        return ['crbrJR','kjYafo'];
    }
    getArtsCountClass(){
        return 'h3+div span:not([class])';
    }
}

class subStrategy extends pageStrategy{
    getThumbnailClass() {
        return 'div[radius] img'
    }
    getArtsClass() {
        return 'li[offset]';
    }
    getRenderArtWallClass() {
        return 'section div:not([class]) div:not([class]) div:has(li[offset])';
    }
    getArtWallAlignLeftClass(){
        return 'gqvfWY';
    }
    getButtonAtClass() {
        return 'section div:not([class]) div div:has(a[href="/novel/bookmark_new.php"])';
    }
    getAllButtonClass() {
        return ['kdFEos'];
    }
    getArtsCountClass(){
        return null;
    }
}

class artScraper {
    constructor(targetPages,likesMinLimit) {
        this.domain = 'https://www.pixiv.net';
        this.allArts = [];
        this.allArtsWithoutLike = [];
        this.targetPages = GM_getValue("targetPages", 10) || targetPages;
        this.likesMinLimit = GM_getValue("likesMinLimit", 50) || likesMinLimit;
        this.discardLikesMinLimit = GM_getValue("discardLikesMinLimit",false);
        this.strategy = this.setStrategy();
        this.currentArtCount=0;
        // console.log(strategy.getThumbnailClass(),strategy.getArtsClass(),strategy.getRenderArtWallClass(),strategy.getButtonAtClass(),strategy.getAllButtonClass())
    }
    setStrategy(){
        const url = self.location.href;
        if (url.includes('https://www.pixiv.net/bookmark_new_illust')) {
            return new subStrategy();
        } else if (url.match(/^https:\/\/www\.pixiv\.net\/(en\/users|users)\/.*\/.*$/)) {
            return new userStrategy();
        } else if (url.match(/^https:\/\/www\.pixiv\.net\/(en\/tags|tags)\/.*\/.*$/)) {
            return new tagsStrategy();
        } else {
            throw `${GM_info.script.name} Unsupported page type`;
        }
    }

    async eatAllArts() {
        const startTime = performance.now();
        await this.executeAndcountUpSec('readingPages', () => this.readingPages(this.strategy.getThumbnailClass(),this.strategy.getArtsClass()));
        await this.executeAndcountUpSec('sortArts', this.sortArts.bind(this));
        let renderArtWallAtClass = this.strategy.getRenderArtWallClass();
        await this.executeAndcountUpSec('renderArtWall', () => this.renderArtWall(renderArtWallAtClass));
        let buttonAtClass = this.strategy.getButtonAtClass();
        //this.addRestoreButton(buttonAtClass, this.strategy.getAllButtonClass());
        this.addRerenderButton(renderArtWallAtClass, buttonAtClass, this.strategy.getAllButtonClass());

        const endTime = performance.now();
        console.log(`${GM_info.script.name} 總耗時: ${(endTime - startTime) / 1000} 秒`);
    }

    async getElementBySelector(selector) {
        let elements = document.querySelectorAll(selector);
        while (elements.length === 0) {
            await this.delay(50);
            elements = document.querySelectorAll(selector);
            //console.log("selector",selector,"找不到，將重試")
        }
        return elements[0];
    }

    async getElementListBySelector(selector) {
        let elements = document.querySelectorAll(selector);
        while (elements.length === 0) {
            await this.delay(50);
            elements = document.querySelectorAll(selector);
            //console.log("selector",selector,"找不到，將重試")
        }
        return elements;
    }

    async readingPages(thumbnailClass, artsClass) {
        const startTime = performance.now();
        if(document.getElementById("RerenderButton")){
            this.toNextPage();
        }
        const initPage = Number(document.querySelector("nav button span").textContent) - 1;
        for (let i = initPage; i <= this.targetPages + initPage; i++) {
            const iterationStartTime = performance.now();
            let page = Number(document.querySelector("nav button span").textContent);
            if(page && i > page){
                i--;
            }else if(!page){
                console.log(this.getAPIMessageLocalization("pageZeroError"));
                break;
            }
            await this.getArtsInPage(thumbnailClass, artsClass);

            let nextPageLink = document.querySelectorAll('a:has(polyline[points="1,2 5,6 9,2"]');
            let retryCount = 0;
            while(nextPageLink[nextPageLink.length-1].hasAttribute("hidden") && retryCount < 100) {
                await this.delay(1);
                retryCount++;
            }
            if(retryCount >= 100){
                console.log(this.getAPIMessageLocalization("lastPageReached"));
                break;
            }

            let checkInterval = Math.floor(Math.random() * 10) + 30;
            let cooldown = Math.floor(Math.random() * 3000) + 2000;

            /*if(i - initPage > 150 && (i - initPage) % (checkInterval * 10) == 0){
                const cooldownMessage = this.getAPIMessageLocalization("apiCooldown", { waitTime: cooldown });
                console.log(cooldownMessage);
                const sorterContainer = document.getElementById("SorterBtnContainer");
                const messageElement = document.createElement("span");
                messageElement.textContent = cooldownMessage;
                sorterContainer.appendChild(messageElement);
                await this.delay(cooldown * 10);
                sorterContainer.removeChild(messageElement);
            }else if(i - initPage > 40 && (i - initPage) % checkInterval == 0){
                const cooldownMessage = this.getAPIMessageLocalization("apiCooldown", { waitTime: cooldown });
                console.log(cooldownMessage);
                const sorterContainer = document.getElementById("SorterBtnContainer");
                const messageElement = document.createElement("span");
                messageElement.textContent = cooldownMessage;
                sorterContainer.appendChild(messageElement);
                await this.delay(cooldown);
                sorterContainer.removeChild(messageElement);
            }*/

            if(this.allArtsWithoutLike.length >= 800){
                while(this.allArtsWithoutLike.length != 0){
                    try{
                        await this.executeAndcountUpSec('appendLikeElementToAllArts',()=>this.appendLikeElementToAllArts());
                    }catch (e){
                        const cooldownMessage = this.getAPIMessageLocalization("apiCooldown", { waitTime: cooldown });
                        console.log(`${GM_info.script.name} `+cooldownMessage);
                        const sorterContainer = document.getElementById("SorterBtnContainer");
                        const messageElement = document.createElement("span");
                        messageElement.textContent = cooldownMessage;
                        sorterContainer.appendChild(messageElement);
                        await this.delay(cooldown);
                        sorterContainer.removeChild(messageElement);
                    }
                }
            }

            if (i < this.targetPages + initPage - 1) {
                this.toNextPage();
            }

            const iterationEndTime = performance.now();
        }

        while(this.allArtsWithoutLike.length != 0){
            try{
                await this.executeAndcountUpSec('appendLikeElementToAllArts',()=>this.appendLikeElementToAllArts());
            }catch (e){
                const cooldownMessage = this.getAPIMessageLocalization("apiCooldown", { waitTime: cooldown });
                console.log(`${GM_info.script.name} `+cooldownMessage);
                const sorterContainer = document.getElementById("SorterBtnContainer");
                const messageElement = document.createElement("span");
                messageElement.textContent = cooldownMessage;
                sorterContainer.appendChild(messageElement);
                await this.delay(cooldown);
                sorterContainer.removeChild(messageElement);
            }
        }
    }

    getAPIMessageLocalization(word, params = {}) {
        let display = {
            "zh-TW": {
                "pageZeroError": `${GM_info.script.name} 觸發page0錯誤，停止排序`,
                "lastPageReached": `${GM_info.script.name} 已經來到最後一頁，停止排序`,
                "apiCooldown": `請等待API冷卻時間 ${params.waitTime/1000 || ''}秒`
        },
            "en": {
                "pageZeroError": `${GM_info.script.name} Triggered page 0 error, stopping sorting`,
                "lastPageReached": `${GM_info.script.name} Reached the last page, stopping sorting`,
                "apiCooldown": `${GM_info.script.name} Please wait for API cooldown time ${params.waitTime/1000 || ''}sec`
        },
            "ja": {
                "pageZeroError": `${GM_info.script.name} ページ0エラーが発生しました、ソートを停止します`,
                "lastPageReached": `${GM_info.script.name} 最後のページに到達しました、ソートを停止します`,
                "apiCooldown": `${GM_info.script.name} APIクールダウン時間をお待ちください ${params.waitTime/1000 || ''}秒`
        }
        };
        return display[navigator.language]?.[word] ?? display["en"][word];
    }

    async getArtsInPage(thumbnailClass, artsClass) {
        let retryCount = 0;
        const maxRetries = 2;
        //出於某種黑魔法不斷上下拖動有助於圖片元素的確實載入
        while (retryCount < maxRetries) {
            let pageStandard = this.getElementListBySelector(artsClass);
            pageStandard = pageStandard.length - 1;
            let thumbnailCount = 0;

            while (thumbnailCount < pageStandard) {
                const thumbnails = await this.getElementListBySelector(thumbnailClass);
                thumbnailCount = thumbnails.length;
                if (thumbnailCount < pageStandard) {
                    console.log(`${GM_info.script.name}: 缺少${pageStandard - thumbnailCount}張圖片，請保持本分頁為本瀏覽器視窗的唯一分頁以確保所有圖片都載入`);
                    window.scrollBy(0, window.innerHeight);
                    await this.delay(100);
                    // 滑到頁面底部
                    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight) {
                        window.scrollTo(0, 0);
                        pageStandard = await this.getElementListBySelector(artsClass);
                        pageStandard = pageStandard.length - 1;
                    }
                }
            }

            const arts = await this.getElementListBySelector(artsClass);
            //console.log(`找到${arts.length}張圖片，開始抓取圖片`);

            const artsArray = Array.from(arts);
            const allArtsSet = new Set(this.allArtsWithoutLike);
            const areFirstThreePresent = artsArray.slice(0, 3).every(art => allArtsSet.has(art));

            if (areFirstThreePresent && retryCount < maxRetries) {
                //console.log(`前3張圖片已存在，重試第${retryCount + 1}次`);
                retryCount++;
                await this.delay(50);
                window.scrollTo(0, 0);
                await this.delay(30);
                continue;
            }
            for (let art of arts) {
                this.allArtsWithoutLike.push(art);
            }
            break;
        }
    }

    async appendLikeElementToAllArts() {
        this.allArtsWithoutLike = this.allArtsWithoutLike.filter(art => art !== undefined);
        const ids = this.allArtsWithoutLike.filter(art => art.getElementsByTagName('a')[0] !== undefined)
        .map(art => {
            const href = art.getElementsByTagName('a')[0].getAttribute('href');
            return href.match(/\/(\d+)/)[1];
        });

        const likeCounts = await Promise.all(ids.map(id => this.fetchLikeCount(id)));

        likeCounts.forEach((likeCount, index) => {
            const art = this.allArtsWithoutLike[index];
            if (!art.getElementsByClassName('likes').length) {// 檢查是否已經有處理過
                if (this.discardLikesMinLimit && likeCount < this.likesMinLimit) return;
                const referenceElement = art.getElementsByTagName('div')[0];
                if (referenceElement) {
                    const likeCountElement = document.createElement('span');
                    likeCountElement.textContent = `${likeCount}`;
                    likeCountElement.className = 'likes';
                    likeCountElement.style.cssText =
                        'text-align: center !important; padding-bottom: 20px !important; color: #0069b1 !important; font-size: 12px !important; font-weight: bold !important; text-decoration: none !important; background-color: #cef !important; background-image: url("data:image/svg+xml;charset=utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2210%22 height=%2210%22 viewBox=%220 0 12 12%22><path fill=%22%230069B1%22 d=%22M9,1 C10.6568542,1 12,2.34314575 12,4 C12,6.70659075 10.1749287,9.18504759 6.52478604,11.4353705 L6.52478518,11.4353691 C6.20304221,11.6337245 5.79695454,11.6337245 5.4752116,11.4353691 C1.82507053,9.18504652 0,6.70659017 0,4 C1.1324993e-16,2.34314575 1.34314575,1 3,1 C4.12649824,1 5.33911281,1.85202454 6,2.91822994 C6.66088719,1.85202454 7.87350176,1 9,1 Z%22/></svg>") !important; background-position: center left 6px !important; background-repeat: no-repeat !important; padding: 3px 6px 3px 18px !important; border-radius: 3px !important;';
                    referenceElement.appendChild(likeCountElement);
                }
                this.allArts.push({ art, likeCount });
            }
        });

        this.allArtsWithoutLike = [];
    }

    toNextPage() {
        let pageButtonsShape='a:has(polyline[points="1,2 5,6 9,2"])';
        const pageButtons = document.querySelectorAll(pageButtonsShape);
        let nextPageButton = pageButtons[pageButtons.length - 1];
        //console.log(nextPageButton);
        nextPageButton.click();
    }

    async toPervPage() {
        let pageButtonsClass='a:has(polyline[points="1,2 5,6 9,2"])';
        const pageButtons = document.querySelectorAll(pageButtonsClass);
        let nextPageButton = pageButtons[0];
        nextPageButton.click();
    }

    async fetchLikeCount(id) {
        const response = await fetch(`https://www.pixiv.net/ajax/illust/${id}`, { credentials: 'omit' });
        const json = await response.json();
        return json.body.likeCount;
    }

    async sortArts() {
        // 使用 Map 來儲存每個 img src 對應的 art 元素
        const artMap = new Map();

        // 依據 likeCount 進行排序，並且過濾掉重複的 art
        this.allArts
            .sort((a, b) => b.likeCount - a.likeCount) // 依據 likeCount 排序
            .forEach(({ art }) => {
            if (art) {
                const imgSrc = art.getElementsByTagName("img")[0];
                if (imgSrc && !artMap.has(imgSrc)) {
                    // 如果 img src 不在 artMap 中，則將 art 存入 artMap
                    artMap.set(imgSrc, art);
                }
            }
        });

        // 更新 allArts 為排除重複的 art 元素列表
        this.allArts = Array.from(artMap.values());
    }


    async renderArtWall(renderArtWallAtClass) {
        const parentElement = await this.getElementBySelector(renderArtWallAtClass);
        this.clearElement(parentElement);

        const table = document.createElement('table');
        table.classList.add('TableArtWall');
        table.style.cssText = 'width: 1223px; overflow-y: auto; margin: 0 auto;';

        const  alignLeftClass =this.strategy.getArtWallAlignLeftClass();

        /*pixiv將置中對齊的方式從擠一個元素變成使用調整相簿位置的css class(其作用為將該元素推右固定的長度)
         * 其三個頁面中各有不同的數量的元素使用該CSS class來排版，若要在僅影響相簿置左排版的前提下，則需要對於其順序修改元素名稱。
         */
        if(GM_getValue("leftAlign", true)){
            if(self.location.href.includes('bookmark')){
                console.log(document.getElementsByClassName(alignLeftClass))
                this.changeElementClassName(document.getElementsByClassName(alignLeftClass)[0],"leftAlign");
            }else if(self.location.href.includes('users')){
                this.changeElementClassName(document.getElementsByClassName(alignLeftClass)[3],"leftAlign");
            }else if(self.location.href.includes('tags')){
                this.changeElementClassName(document.getElementsByClassName(alignLeftClass)[4],"leftAlign");
            }
        }

        const fragment = document.createDocumentFragment();
        fragment.appendChild(table);

        let tr = document.createElement('tr');
        table.appendChild(tr);
        let row = GM_getValue("rowsOfArtsWall", 7);

        let artCount = 0; // 計算繪畫數量

        for (let art of this.allArts) {
            if (art.getElementsByClassName('likes')[0].textContent >= this.likesMinLimit) {
                const td = document.createElement('td');

                Array.from(art.attributes).forEach(attr => {
                    td.setAttribute(attr.name, attr.value);
                });

                td.innerHTML = art.innerHTML;
                tr.appendChild(td);
                artCount++; // 增加繪畫數量

                if (tr.children.length % row === 0) {
                    tr = document.createElement('tr');
                    table.appendChild(tr);
                }
            }
        }
        parentElement.appendChild(fragment);
        this.currentArtCount = artCount;
    }

    // 縮圖換原圖，以其他腳本獨立解決
    /*async changeThumbToOriginal() {
        for (const element of this.allArts) {
            const img = element.getElementsByTagName('img')[0];
            if (img) {
                const originalSrc = img.src.replace(/\/c\/\d+x\d+_\d+/, '')
                .replace('/img-master/', '/img-original/')
                .replace('/custom-thumb/', '/img-original/')
                .replace(/_square1200/, '')
                .replace(/_custom1200/, '');

                //console.log(originalSrc);
                const newSrc = await this.testImageSrc(originalSrc);
                img.src = newSrc;
                //console.log(img.src);
            }
        }
    }
    async testImageSrc(src) {
        return new Promise(resolve => {
            const img = new Image();
            img.onload = function() {
                resolve(src);
            };
            img.onerror = function() {
                resolve(src.replace('.jpg', '.png'));
            };
            img.src = src;
        });
    }*/

    //     搜尋樣式
    /*     async addStartButton() {
        let startButtonParentClass = '.sc-s8zj3z-5.eyagzq';
        let startButtonClass = 'lkjHVk';
        const parentElement = document.querySelector(startButtonParentClass);
        if (!parentElement) {
            await this.delay(50);
            await this.addStartButton();
            return;
        }

        const buttonsorterContainer = document.createElement('div');
        buttonsorterContainer.style.display = 'flex';
        buttonsorterContainer.style.alignItems = 'center';
        buttonsorterContainer.className = 'startButton';
        buttonsorterContainer.innerHTML= '<div class="hxckiU"><form class="ahao-search"><div class="hjxNtZ"><div class="bbSVxZ"></div><div class="dlaIss"><div class="lclerM"><svg viewBox="0 0 16 16" size="16" class="fiLugu"><path d="M8.25739 9.1716C7.46696 9.69512 6.51908 10 5.5 10C2.73858 10 0.5 7.76142 0.5 5C0.5 2.23858 2.73858 0 5.5 0C8.26142 0 10.5 2.23858 10.5 5C10.5 6.01908 10.1951 6.96696 9.67161 7.75739L11.7071 9.79288C12.0976 10.1834 12.0976 10.8166 11.7071 11.2071C11.3166 11.5976 10.6834 11.5976 10.2929 11.2071L8.25739 9.1716ZM8.5 5C8.5 6.65685 7.15685 8 5.5 8C3.84315 8 2.5 6.65685 2.5 5C2.5 3.34315 3.84315 2 5.5 2C7.15685 2 8.5 3.34315 8.5 5Z" transform="translate(3 3)" fill-rule="evenodd" clip-rule="evenodd"></path></svg></div></div></div></form><div class="kFcBON"></div></div>';

        const inputField = document.createElement('input');
        inputField.type = 'text';
        inputField.value = this.targetPages;
        inputField.className = 'gSIBXG';
        inputField.addEventListener('input', (event) => {
            this.targetPages = event.target.value;
        });

        const start = document.createElement('button');
        start.textContent = 'Sort';
        start.style.marginRight = '-10px';
        start.className = startButtonClass;
        start.addEventListener('click', async () => {
            await this.eatAllArts();
        });
        const startButton = document.createElement('button');
        startButton.textContent = 'Page Go';
        startButton.className = startButtonClass;
        startButton.addEventListener('click', async () => {
            await this.eatAllArts();
        });

        buttonsorterContainer.appendChild(start);
        buttonsorterContainer.appendChild(inputField);
        buttonsorterContainer.appendChild(startButton);

        parentElement.appendChild(buttonsorterContainer);
    } */

    // 拉桿樣式
    async addStartButton(ParentClass,buttonClass) {
        if(document.getElementById("StartButton")){
            return;
        }

        const buttonsorterContainer = document.createElement('nav');
        buttonsorterContainer.style.display = 'flex';
        buttonsorterContainer.style.alignItems = 'center';
        buttonsorterContainer.id = 'SorterBtnContainer';

        const startButton = document.createElement('button');
        this.addLikeRangeInput(buttonsorterContainer,startButton);
        await this.addPageRangeInput(buttonsorterContainer,startButton);

        startButton.textContent = `likes: ${this.likesMinLimit} for ${this.targetPages}Page Go!`;
        buttonClass.forEach(cls => startButton.classList.add(cls));
        startButton.id = "StartButton";
        startButton.addEventListener('click', async () => {
            GM_setValue("targetPages", this.targetPages);
            GM_setValue("likesMinLimit", this.likesMinLimit);
            await this.eatAllArts();
            startButton.textContent = `likes: ${this.likesMinLimit} for ${this.targetPages}Page Go!`;
        });

        const parentElement = await this.getElementBySelector(ParentClass);
        buttonsorterContainer.appendChild(startButton);
        parentElement.appendChild(buttonsorterContainer);
    }

    async addRerenderButton(renderArtWallAtClass, ParentClass, buttonClass) {
        if(document.getElementById("RerenderButton")){
            document.getElementById("RerenderButton").textContent = `likes: ${this.likesMinLimit} Rerender Go! now:${this.currentArtCount}(${Math.round(this.currentArtCount/this.allArts.length *100)}％)`;
            return;
        }
        document.querySelector("nav#SorterBtnContainer input[id=LikeRangeInput]").style.display="none";
        document.getElementById("LikeIcon").style.display="none";
        await this.delay(0);//黑魔法
        document.getElementById("StartButton").textContent = 'bug? you can try again.';

        const buttonsorterContainer = document.createElement('div');
        buttonsorterContainer.style.display = 'flex';
        buttonsorterContainer.style.alignItems = 'center';

        const rerenderButton = document.createElement('button');
        rerenderButton.textContent = `likes: ${this.likesMinLimit} Rerender Go! now:${this.currentArtCount}(${Math.round(this.currentArtCount/this.allArts.length *100)}％)`; // 顯示目前繪畫數量
        buttonClass.forEach(cls => rerenderButton.classList.add(cls));
        rerenderButton.id = "RerenderButton";
        rerenderButton.addEventListener('click', async () => {
            GM_setValue("likesMinLimit", this.likesMinLimit);
            await this.renderArtWall(renderArtWallAtClass);
            rerenderButton.textContent = `likes: ${this.likesMinLimit} Rerender Go! now:${this.currentArtCount}(${Math.round(this.currentArtCount/this.allArts.length *100)}％)`; // 更新繪畫數量
        });

        this.addLikeRangeInput(buttonsorterContainer, rerenderButton);

        const parentElement = await this.getElementBySelector(ParentClass);
        buttonsorterContainer.appendChild(rerenderButton);
        parentElement.appendChild(buttonsorterContainer);
    }

    addLikeRangeInput(sorterContainer,Button) {
        const likesMinLimitsRange = [0, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 7500, 10000];

        const likeIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        likeIcon.id = "LikeIcon";
        likeIcon.setAttributeNS(null, "viewBox", "0 0 32 32");
        likeIcon.setAttributeNS(null, "height", "16");
        likeIcon.setAttributeNS(null, "width", "16");
        likeIcon.classList.add("dxYRhf", "fiLugu");
        const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path1.setAttributeNS(null, "d", "M21,5.5 C24.8659932,5.5 28,8.63400675 28,12.5 C28,18.2694439 24.2975093,23.1517313 17.2206059,27.1100183 C16.4622493,27.5342993 15.5379984,27.5343235 14.779626,27.110148 C7.70250208,23.1517462 4,18.2694529 4,12.5 C4,8.63400691 7.13400681,5.5 11,5.5 C12.829814,5.5 14.6210123,6.4144028 16,7.8282366 C17.3789877,6.4144028 19.170186,5.5 21,5.5 Z");

        const path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path2.setAttributeNS(null, "d", "M16,11.3317089 C15.0857201,9.28334665 13.0491506,7.5 11,7.5 C8.23857625,7.5 6,9.73857647 6,12.5 C6,17.4386065 9.2519779,21.7268174 15.7559337,25.3646328 C15.9076021,25.4494645 16.092439,25.4494644 16.2441073,25.3646326 C22.7480325,21.7268037 26,17.4385986 26,12.5 C26,9.73857625 23.7614237,7.5 21,7.5 C18.9508494,7.5 16.9142799,9.28334665 16,11.3317089 Z");
        path2.setAttributeNS(null, "class", "sc-j89e3c-0 iGgiqT");

        likeIcon.appendChild(path1);
        likeIcon.appendChild(path2);

        const likeRangeInput = document.createElement('input');
        likeRangeInput.type = 'range';
        likeRangeInput.min = '0';
        likeRangeInput.max = (likesMinLimitsRange.length - 1).toString();
        likeRangeInput.value = likesMinLimitsRange.indexOf(this.likesMinLimit);
        likeRangeInput.style.marginRight = '10px';
        likeRangeInput.style.backgroundColor = 'red';
        likeRangeInput.id="LikeRangeInput";
        // reRender
        if(document.querySelector('.TableArtWall')){
            likeRangeInput.addEventListener('input', (event) => {
                this.likesMinLimit = likesMinLimitsRange[event.target.value];
                Button.textContent = `likes: ${this.likesMinLimit} Rerender Go! now:${this.currentArtCount}(${Math.round(this.currentArtCount/this.allArts.length *100)}％)`;
            });
        }else{
            likeRangeInput.addEventListener('input', (event) => {
                this.likesMinLimit = likesMinLimitsRange[event.target.value];
                Button.textContent = `likes: ${this.likesMinLimit} for ${this.targetPages}Page Go!`;
            });
        }
        sorterContainer.appendChild(likeIcon);
        sorterContainer.appendChild(likeRangeInput);
    }

    async addPageRangeInput(sorterContainer, startButton) {
        const pageIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        pageIcon.setAttributeNS(null, "viewBox", "0 0 16 16");
        pageIcon.setAttributeNS(null, "height", "16");
        pageIcon.setAttributeNS(null, "width", "16");
        pageIcon.classList.add("pageInput", "iGgiqT");

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttributeNS(null, "d", "M8.25739 9.1716C7.46696 9.69512 6.51908 10 5.5 10C2.73858 10 0.5 7.76142 0.5 5C0.5 2.23858 2.73858 0 5.5 0C8.26142 0 10.5 2.23858 10.5 5C10.5 6.01908 10.1951 6.96696 9.67161 7.75739L11.7071 9.79288C12.0976 10.1834 12.0976 10.8166 11.7071 11.2071C11.3166 11.5976 10.6834 11.5976 10.2929 11.2071L8.25739 9.1716ZM8.5 5C8.5 6.65685 7.15685 8 5.5 8C3.84315 8 2.5 6.65685 2.5 5C2.5 3.34315 3.84315 2 5.5 2C7.15685 2 8.5 3.34315 8.5 5Z");
        path.setAttributeNS(null, "transform", "translate(3 3)");
        path.setAttributeNS(null, "fill-rule", "evenodd");
        path.setAttributeNS(null, "clip-rule", "evenodd");

        pageIcon.appendChild(path);

        const pageRangeInput = document.createElement('input');
        pageRangeInput.type = 'range';
        pageRangeInput.min = '1';

        let max = await this.getMaxPage();
        const stepSize = Math.floor(max / 24);

        //console.log(this.getMaxPage());
        pageRangeInput.max = max || 34;

        if (this.targetPages > max) {
            pageRangeInput.value = max;
            this.targetPages=max;
        } else {
            pageRangeInput.value = this.targetPages;
        }

        pageRangeInput.step = stepSize;
        pageRangeInput.style.marginRight = '10px';
        pageRangeInput.classList.add('pageInput');
        pageRangeInput.addEventListener('input', (event) => {
            this.targetPages = parseInt(event.target.value);
            startButton.textContent = `likes: ${this.likesMinLimit} for ${this.targetPages}Page Go!`;
        });

        sorterContainer.appendChild(pageIcon);
        sorterContainer.appendChild(pageRangeInput);
        if(max>50){
            const pageInputBox = document.createElement('input');
            pageInputBox.type = 'number';
            pageInputBox.min = '1';
            pageInputBox.max = max || 34;
            pageInputBox.classList.add("gSIBXG");
            pageInputBox.value = this.targetPages;
            pageInputBox.style.width = '50px';
            pageInputBox.style.marginRight = '10px';
            pageInputBox.addEventListener('input', (event) => {
                const value = parseInt(event.target.value);
                if (value >= 1 && value <= max) {
                    this.targetPages = value;
                    startButton.textContent = `likes: ${this.likesMinLimit} for ${this.targetPages}Page Go!`;
                }
            });
            sorterContainer.appendChild(pageInputBox);
        }
    }

    async getMaxPage() {
        if (this.strategy.getArtsCountClass() === null) {
            return 34;
        }
        const artsCountElement = await this.getElementBySelector(this.strategy.getArtsCountClass());

        //console.log(artsCountElement);
        if (artsCountElement) {
            // 刪除數字中的逗號
            const artsCountText = artsCountElement.textContent.replace(/,/g, '');
            const artsCount = parseInt(artsCountText);
            const arts = await this.getElementListBySelector(this.strategy.getArtsClass());
            const artsPerPage = arts.length;
            const maxPage = Math.ceil(artsCount / artsPerPage);
            return maxPage;
        } else {
            return 34;
        }
    }

    async addRestoreButton(ParentClass,buttonClass) {
        //const startButton = document.querySelector('nav.startButton');
        //this.clearElement(startButton);

        const restoreButton = document.createElement('button');
        restoreButton.textContent = 'Back to Start';
        restoreButton.style.marginRight = '10px';
        restoreButton.className = buttonClass;

        restoreButton.addEventListener('click', async () => {
            const url = new URL(window.location.href);
            const params = url.searchParams;
            const currentPage = parseInt(params.get('p')) || 1;
            const newPage = currentPage - (this.targetPages - 1);
            params.set('p', newPage > 0 ? newPage : 1);
            url.search = params.toString();
            window.location.href = url.toString();
        });

        const parentElement = await this.getElementBySelector(ParentClass);
        parentElement.appendChild(restoreButton);
    }

    clearElement(element) {
        element.innerHTML='';
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    changeElementClassName(element, newClassName) {
        if (element && typeof newClassName === 'string') {
            element.className = newClassName;
        }
    }

    async executeAndcountUpSec(label, fn) {
        const startTime = performance.now();
        await fn();
        const endTime = performance.now();
        console.log(`${GM_info.script.name} ${label} 花費時間: ${(endTime - startTime) / 1000} 秒`);
    }

}

class customMenu {
    constructor() {
        this.registerMenuCommand(this);
    }

    rowsOfArtsWallMenu() {
        const rows = parseInt(prompt(`${this.getFeatureMessageLocalization("rowsOfArtsWallPrompt")} ${GM_getValue("rowsOfArtsWall", 7)}`));
        if (rows && Number.isInteger(rows) && rows > 0) {
            GM_setValue("rowsOfArtsWall", rows);
        } else {
            alert(this.getFeatureMessageLocalization("rowsOfArtsWallMenuError"));
        }
    }

    toggleLeftAlignMenu() {
        const currentState = GM_getValue("leftAlign", false);
        const newState = !currentState;
        GM_setValue("leftAlign", newState);
        alert(this.getFeatureMessageLocalization("leftAlignToggleMessage") + (newState ? this.getFeatureMessageLocalization("enabled") : this.getFeatureMessageLocalization("disabled")));
    }

    discardLikesMinLimitMenu(){
        const currentState = GM_getValue("discardLikesMinLimit", false);
        const newState = !currentState;
        GM_setValue("discardLikesMinLimit", newState);
        alert(this.getFeatureMessageLocalization("likesMinLimitDiscardMessage") + (newState ? this.getFeatureMessageLocalization("enabled") : this.getFeatureMessageLocalization("disabled")));
    }

    getFeatureMessageLocalization(word) {
        let display = {
            "zh-TW": {
                "rowsOfArtsWall": "行數設定",
                "rowsOfArtsWallPrompt": "一行顯示幾個繪畫?(請根據瀏覽器放大程度決定) 目前為：",
                "rowsOfArtsWallMenuError": "請輸入一個數字，且不能小於1",
                "leftAlign": "置左排版",
                "leftAlignToggleMessage": "置左排版已",
                "discardLikesMinLimit": "低讚數作品過濾",
                "likesMinLimitDiscardMessage": "過濾低讚數作品（節省記憶體與加快載入）已",
                "enabled": "啟用",
                "disabled": "停用"
            },
            "en": {
                "rowsOfArtsWall": "row setting",
                "rowsOfArtsWallPrompt": "How many paintings should be displayed in one row?(Please decide based on browser magnification level) Currently:",
                "rowsOfArtsWallMenuError": "Please enter a number, and it cannot be less than 1",
                "leftAlign": "Left-aligned Layout",
                "leftAlignToggleMessage": "Left-aligned layout is now ",
                "discardLikesMinLimit": "Filter Low-Like Artworks",
                "likesMinLimitDiscardMessage": "Filtering out low-like artworks (saves memory and speeds up loading) is now ",
                "enabled": "enabled",
                "disabled": "disabled"
            },
            "ja": {
                "rowsOfArtsWall": "行設定",
                "rowsOfArtsWallPrompt": "1 行に何枚の絵畫を表示する必要がありますか?(ブラウザの倍率レベルに基づいて決定してください) 現在：",
                "rowsOfArtsWallMenuError": "數値を入力してください。1 未満にすることはできません",
                "leftAlign": "左揃えレイアウト",
                "leftAlignToggleMessage": "左揃えレイアウトが",
                "discardLikesMinLimit": "低いいね數作品フィルタリング",
                "likesMinLimitDiscardMessage": "低いいね數作品をフィルタリング（メモリ節約・読み込み高速化）が",
                "enabled": "有効",
                "disabled": "無効"
            }
        };
        return display[navigator.language]?.[word] ?? display["en"][word];
    }

    registerMenuCommand(instance) {
        GM_registerMenuCommand(instance.getFeatureMessageLocalization("rowsOfArtsWall"), () => instance.rowsOfArtsWallMenu());
        GM_registerMenuCommand(instance.getFeatureMessageLocalization("leftAlign"), () => instance.toggleLeftAlignMenu());
        GM_registerMenuCommand(instance.getFeatureMessageLocalization("discardLikesMinLimit"), () => instance.discardLikesMinLimitMenu());
    }
}

class readingStand {
    static expandAllArtworks() {
        const artistHomePattern = /^https:\/\/www\.pixiv\.net\/(en\/users|users)\/[0-9]*$/;
        const tagHomePattern = /^.*:\/\/www\.pixiv\.net\/(en\/tags|tags)\/.*$/;
        const tagPagePattern = /^.*:\/\/www\.pixiv\.net\/(en\/tags|tags)\/.*\/artworks*/;
        if (artistHomePattern.test(self.location.href) || !tagPagePattern.test(self.location.href) && tagHomePattern.test(self.location.href)) {
            self.location.href = self.location.href + "/artworks?p=1";
        }
    }
}

//網頁名稱不論載入或AJAX更換頁面都會在過程會觸發1次，hashchange與popstate在此無法正確處理
const title = document.querySelector('title');
//新增對網頁網址的檢查，以確保即便標題被其他程式修改，腳本仍能意識到是否在相同頁面
let pageUrl = window.location.href;

const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        //console.log('頁面名稱更改為 "%s"', document.title);
        readingStand.expandAllArtworks();
        if (window.location.href === pageUrl) {
            return;
        }
        pageUrl = window.location.href;
        let johnTheHornyOne = new artScraper(10, 50);
        johnTheHornyOne.addStartButton(johnTheHornyOne.strategy.getButtonAtClass(), johnTheHornyOne.strategy.getAllButtonClass());
    });
});

let config = {childList: true,};
observer.observe(title, config);
//初始化
let johnTheHornyOne = new artScraper(10, 50);
johnTheHornyOne.addStartButton(johnTheHornyOne.strategy.getButtonAtClass(), johnTheHornyOne.strategy.getAllButtonClass());

const johnTheRestaurantWaiter = new customMenu();
