// ==UserScript==
// @name         图寻音效
// @namespace    https://greasyfork.org/users/1179204
// @version      1.1.1
// @description  增加地图点击音效以及倒计时提醒音效，支持表情快捷键
// @author       KaKa
// @icon         https://www.svgrepo.com/show/521999/bell.svg
// @match        *://tuxun.fun/*
// @exclude      *://tuxun.fun/replay-pano?*
// @grant        GM_addStyle
// @license      BSD
// @downloadURL https://update.greasyfork.org/scripts/504979/%E5%9B%BE%E5%AF%BB%E9%9F%B3%E6%95%88.user.js
// @updateURL https://update.greasyfork.org/scripts/504979/%E5%9B%BE%E5%AF%BB%E9%9F%B3%E6%95%88.meta.js
// ==/UserScript==
(function() {
    const custom_eomjis_shortcut_keys=['g','h','j','k','l']          //请在这里替换你想要的设置的快捷键（顺序需要与下面一致，字母必须小写） 注意不要和图寻默认的快捷键冲突（Z键回退 C键检查点 R回起点）

    const csutom_eomjis=["流汗黄豆","你好","gg","吨吨吨","吃瓜"]       //请在这里替换你想要的表情（顺序需要与上面一致，表情名称见下）

    const emojis={
        流汗黄豆:1,
        困:2,
        喷:3,
        生气:4,
        滑稽:5,
        吃手手:6,
        佩服:7,
        疑问:8,
        呕吐:10,
        欢呼:11,
        吨吨吨:12,
        得意:13,
        吃瓜:14,
        挨打:"emotion_89",
        调皮:"emotion_03",
        大汗:"emotion_78",
        黑脸笑:"emotion_72",
        愣住:"emotion_86",
        萌萌哒:"emotion_24",
        鲜花:"emotion_36",
        心碎:"emotion_35",
        偷玩:"your_boy",
        你好:"hello",
        gg:"gg",
        黑屏:"black",
        卡了:"kale",
        好了:"all_right"}

    /*============================================================================================================================================================================================================================*/
    let map,streetViewPanorama,currentIndex=0,isPointCount=false,isPlay=true
    let bellIcon=`<svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M9 17V18C9 18.394 9.0776 18.7841 9.22836 19.1481C9.37913 19.512 9.6001 19.8427 9.87868 20.1213C10.1573 20.3999 10.488 20.6209 10.8519 20.7716C11.2159 20.9224 11.606 21 12 21C12.394 21 12.7841 20.9224 13.1481 20.7716C13.512 20.6209 13.8427 20.3999 14.1213 20.1213C14.3999 19.8427 14.6209 19.512 14.7716 19.1481C14.9224 18.7841 15 18.394 15 18V17M18 9C18 12 20 17 20 17H4C4 17 6 13 6 9C6 5.732 8.732 3 12 3C15.268 3 18 5.732 18 9Z" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>`
    let silenceIcon=`<svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M8.68333 4C9.65927 3.35265 10.8115 3 12 3C13.5913 3 15.1174 3.63214 16.2426 4.75736C17.3679 5.88258 18 7.4087 18 9C18 10.7834 18.7068 13.2736 19.28 15M3 3L21 21M5.96047 10C5.67984 13.6403 4 17 4 17H12.5M14.7716 19.1481C14.6209 19.512 14.3999 19.8427 14.1213 20.1213C13.8427 20.3999 13.512 20.6209 13.1481 20.7716C12.7841 20.9224 12.394 21 12 21C11.606 21 11.2159 20.9224 10.8519 20.7716C10.488 20.6209 10.1573 20.3999 9.87868 20.1213C9.6001 19.8427 9.37913 19.512 9.22836 19.1481C9.0776 18.7841 9 18.394 9 18V17" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>`
    let iconUrl=svgToUrl(bellIcon)
    const button = document.createElement('button');
    button.id = 'sound';
    GM_addStyle(`
        #sound {
            position:absolute;
            left:24px;
            top:24%;
            width: 40px;
            height: 40px;
            border: none;
            border-radius:20px;
            background-image: url('${iconUrl}');
            background-size: auto;
            background-position: center;
            background-color:#000000;
             background-repeat: no-repeat;
            cursor: pointer;
            color: white;
            font-size: 16px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            z-Index:9999
        }
    `);
    button.onclick = () => {
        if(!isPlay){
            isPlay=true
            button.style.backgroundImage=`url('${iconUrl}')`

        }
        else{
            isPlay=false
            button.style.backgroundImage=`url(${svgToUrl(silenceIcon)})`
        }
    }

    const water_effect='https://www.geoguessr.com/_next/static/audio/place-guess-water-81b402df882cdb731e83a5463582d9c6.mp3'
    const land_effects=[
        'https://www.geoguessr.com/_next/static/audio/place-guess-land-1ac6606a711c3f128d917f3287d06b5f.mp3',
        'https://www.geoguessr.com/_next/static/audio/place-guess-land-2-9a5a0a2fa6b2595f8a8e59312b5f41a9.mp3',
        'https://www.geoguessr.com/_next/static/audio/place-guess-land-3-16f00d5f32e748cc49b45c8197b1986a.mp3',
        'https://www.geoguessr.com/_next/static/audio/place-guess-land-4-9e3d39d2743652364f518acfc8ec9163.mp3',
        'https://www.geoguessr.com/_next/static/audio/place-guess-land-5-dac7ac12a1b2ab0c6e97063e8e017095.mp3',
        'https://www.geoguessr.com/_next/static/audio/place-guess-land-6-c4f4f4a8fcf8a6b2fbf1771d6538cadd.mp3']
    const countdown='https://www.geoguessr.com/_next/static/audio/new-effect-timer-countdown-0ebc3024e8d1ef071d03f958f2813c0f.mp3'
    const pointCount='https://www.geoguessr.com/_next/static/audio/effect-point-count-4401d2046fe66715ea454bc6d2dddc2d.mp3'


    let intervalId=setInterval(function(){
        const streetViewContainer= document.getElementById('viewer')
        const wrapper=document.querySelector('.wrapper___NMMQn')
        if(streetViewContainer){
            getSvContainer()
            getMap()
            if(map&&streetViewPanorama){
                wrapper.appendChild(button)
                mapListener()
                map.on('click', async (e) => {
                    const lat=e.lngLat.lat
                    const lng=e.lngLat.lng

                    if(!isPointCount){
                        const isWater=await isTileCenterBlue(lat,lng)
                        if(!isWater)playAudio(land_effects[currentIndex])
                        else playAudio(water_effect)
                        currentIndex+=1
                        if(currentIndex===6)currentIndex=0}
                });
                clearInterval(intervalId)}
        }
    },500);

    function svgToUrl(svgText) {
        const svgBlob = new Blob([svgText], {type: 'image/svg+xml'});
        const svgUrl = URL.createObjectURL(svgBlob);
        return svgUrl;
    }

    function getGameId() {
        try {
            const currentUrl = window.location.href;

            const gameId = currentUrl.substring(currentUrl.lastIndexOf('/') + 1);
            return gameId
        } catch (error) {
            console.error('Error parsing URL:', error);
            return null;
        }
    }

    function getSvContainer(){
        const streetViewContainer= document.getElementById('viewer')
        if(streetViewContainer){
            const keys = Object.keys(streetViewContainer)
            const key = keys.find(key => key.startsWith("__reactFiber"))
            const props = streetViewContainer[key]
            streetViewPanorama=props.return.child.memoizedProps.children[1].props.googleMapInstance}

    }

    function getMap(){
        var mapContainer = document.getElementById('map')
        if(mapContainer){
            const keys = Object.keys(mapContainer)
            const key = keys.find(key => key.startsWith("__reactFiber$"))
            const props = mapContainer[key]
            const x = props.child.memoizedProps.value.map
            map=x.getMap()}
    }

    function getTileUrl(lat,lng){
        function lon2tile(lng,zoom) {
            return (Math.floor((lng+180)/360*Math.pow(2,zoom)));
        }
        function lat2tile(lat,zoom){
            return (Math.floor((1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom)));
        }
        const zoom=18
        const tileX=lon2tile(lng,zoom)
        const tileY=lat2tile(lat,zoom)
        return `https://maprastertile-drcn.dbankcdn.cn/display-service/v1/online-render/getTile/23.12.09.11/${zoom}/${tileX}/${tileY}/?language=zh&p=46&scale=2&mapType=ROADMAP&presetStyleId=standard&pattern=JPG&key=DAEDANitav6P7Q0lWzCzKkLErbrJG4kS1u%2FCpEe5ZyxW5u0nSkb40bJ%2BYAugRN03fhf0BszLS1rCrzAogRHDZkxaMrloaHPQGO6LNg==`
    }

    async function isTileCenterBlue(lat, lng) {
        const tileSize = 256;
        const url = getTileUrl(lat, lng);

        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const imageBitmap = await createImageBitmap(blob);

            const canvas = document.createElement('canvas');
            canvas.width = tileSize;
            canvas.height = tileSize;
            const context = canvas.getContext('2d');
            context.drawImage(imageBitmap, 0, 0, tileSize, tileSize);

            const imageData = context.getImageData(0, 0, tileSize, tileSize);
            const data = imageData.data;

            const centerX = Math.floor(tileSize / 2);
            const centerY = Math.floor(tileSize / 2);
            const centerIndex = (centerY * tileSize + centerX) * 4;


            const r = data[centerIndex];
            const g = data[centerIndex + 1];
            const b = data[centerIndex + 2];

            function isCloseToBlue(r, g, b) {
                return r===171 && g===212 &&b===230;
            }
            return isCloseToBlue(r, g, b);
        } catch (error) {
            console.error('Error fetching or processing the tile:', error);
            return false;
        }
    }

const activeAudios = new Set();

    function playAudio(source) {
        if (!isPlay) return;
        const audio = new Audio();
        audio.loop = false;
        audio.volume = 1;

        if (source === pointCount) audio.volume = 0.5;
        if (source === countdown) audio.volume = 0.6;
        if (source === water_effect) audio.volume = 0.8;

        audio.src = source;
        audio.play().catch(error => {
            console.error('播放音频失败:', error);
        });

        activeAudios.add(audio); // ✅ 追踪当前活跃音频

        // 倒计时音效默认16秒后结束
        if (source === countdown) {
            setTimeout(() => stopAudio(audio), 16000);
        } else {
            audio.addEventListener('ended', () => {
                stopAudio(audio);
                if (source === pointCount) isPointCount = false;
            });
        }
    }

    function stopAudio(audio) {
        if (!audio) return;
        try {
            audio.pause();
            audio.remove();
        } catch (e) {}
        activeAudios.delete(audio);
    }

    function stopAllAudios() {
        for (const audio of activeAudios) stopAudio(audio);
        activeAudios.clear();
    }

    function sendEmoji(id){
        return new Promise((resolve, reject) => {
            const gameId=getGameId()
            const apiUrl = `https://tuxun.fun/api/v0/tuxun/solo/sendEmoji?emojiId=${id}&gameId=${gameId}`;

            fetch(apiUrl)
                .catch(error => {
                console.error('Error sending emoji:', error);
                reject(error);
            });
        });

    }

    function mapListener(){
        var mapContainer = document.querySelector('.maplibregl-canvas')
        const observer = new MutationObserver((mutationsList, observer) => {

            for(let mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    handleSizeChange(mapContainer);
                }
            }
        });
        observer.observe(mapContainer, { attributes: true, attributeFilter: ['style'] });
    }

    function handleSizeChange(target) {
        const currentUrl = window.location.href;
        const { width, height } = target.getBoundingClientRect();
        const currentScreenWidth = window.innerWidth;
        const widthRatio = (width / currentScreenWidth) * 100;
        if (widthRatio>=90){
            if(currentUrl.includes('challenge')){
                isPointCount=true
                setTimeout(function(){playAudio(pointCount)},50)
            }
        }

    }

    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    node.querySelectorAll && node.querySelectorAll('.countdownTimer___pqf8b').forEach(childNode => {
                        let intervalId = setInterval(function() {
                            const timeLeft = childNode.innerHTML.toString();
                            if (timeLeft.includes(':15')) {
                                playAudio(countdown);
                                clearInterval(intervalId);
                            }
                        }, 100);
                    });
                });
            }

            if (mutation.removedNodes.length > 0) {
                mutation.removedNodes.forEach(node => {
                    if (node.querySelectorAll) {
                        const removedCountdowns = node.querySelectorAll('.countdownTimer___pqf8b');
                        if (removedCountdowns.length > 0) {
                            stopAllAudios();
                        }
                    } else if (node.classList && node.classList.contains('countdownTimer___pqf8b')) {
                        stopAllAudios();
                    }
                });
            }
        }
    });

    const config = { childList: true, subtree: true };
    observer.observe(document.body, config);

    let onKeyDown = (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
            return;
        }
        if (e.key === custom_eomjis_shortcut_keys[0]) {
            e.stopImmediatePropagation();
            sendEmoji(emojis[csutom_eomjis[0]])
        }
        if (e.key === custom_eomjis_shortcut_keys[1]) {
            e.stopImmediatePropagation();
            sendEmoji(emojis[csutom_eomjis[1]])
        }
        if (e.key === custom_eomjis_shortcut_keys[2]) {
            e.stopImmediatePropagation();
            sendEmoji(emojis[csutom_eomjis[2]])
        }
        if (e.key === custom_eomjis_shortcut_keys[3]) {
            e.stopImmediatePropagation();
            sendEmoji(emojis[csutom_eomjis[3]])
        }
        if (e.key === custom_eomjis_shortcut_keys[4]) {
            e.stopImmediatePropagation();
            sendEmoji(emojis[csutom_eomjis[4]])
        }

    }
    document.addEventListener("keydown", onKeyDown);
})();