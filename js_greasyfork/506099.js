// ==UserScript==
// @name         图寻连击计数器
// @namespace    https://greasyfork.org/users/1179204
// @version      1.2.3
// @description  自动记录国家/一级行政区连击次数
// @author       KaKa
// @match        *://tuxun.fun/*
// @exclude      *://tuxun.fun/replay-pano?*
// @icon         data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNDggNDgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZmlsbD0iIzAwMDAwMCI+PGcgaWQ9IlNWR1JlcG9fYmdDYXJyaWVyIiBzdHJva2Utd2lkdGg9IjAiPjwvZz48ZyBpZD0iU1ZHUmVwb190cmFjZXJDYXJyaWVyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjwvZz48ZyBpZD0iU1ZHUmVwb19pY29uQ2FycmllciI+PHRpdGxlPjcwIEJhc2ljIGljb25zIGJ5IFhpY29ucy5jbzwvdGl0bGU+PHBhdGggZD0iTTI0LDEuMzJjLTkuOTIsMC0xOCw3LjgtMTgsMTcuMzhBMTYuODMsMTYuODMsMCwwLDAsOS41NywyOS4wOWwxMi44NCwxNi44YTIsMiwwLDAsMCwzLjE4LDBsMTIuODQtMTYuOEExNi44NCwxNi44NCwwLDAsMCw0MiwxOC43QzQyLDkuMTIsMzMuOTIsMS4zMiwyNCwxLjMyWiIgZmlsbD0iI2ZmOTQyNyI+PC9wYXRoPjxwYXRoIGQ9Ik0yNS4zNywxMi4xM2E3LDcsMCwxLDAsNS41LDUuNUE3LDcsMCwwLDAsMjUuMzcsMTIuMTNaIiBmaWxsPSIjZmZmZmZmIj48L3BhdGg+PC9nPjwvc3ZnPg==
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @require      https://unpkg.com/gcoord/dist/gcoord.global.prod.js
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @license      BSD
// @downloadURL https://update.greasyfork.org/scripts/506099/%E5%9B%BE%E5%AF%BB%E8%BF%9E%E5%87%BB%E8%AE%A1%E6%95%B0%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/506099/%E5%9B%BE%E5%AF%BB%E8%BF%9E%E5%87%BB%E8%AE%A1%E6%95%B0%E5%99%A8.meta.js
// ==/UserScript==
(function() {
    const Language='zh' // ISO 639-1 语言代码 - https://baike.baidu.com/item/ISO%20639

    let API_KEY='请在此处替换你的bigdatacloud API KEY(不要删掉引号)'

    let viewer,map,finalGuess,currentRound,gameState=false,roundPins={},gameMode,requestmapId,roundState,countsDiv,countsTitle,countsValue,mapsId,avgScore,avgValue_,previousWidth=0

    let streakCounts=JSON.parse(localStorage.getItem('streakCounts'))
    let streakMode=JSON.parse(localStorage.getItem('streakMode'))
    if (!streakCounts){
        streakCounts={}
    }
    if (!streakMode){
        streakMode='country'
    }

    const CC_DICT = {
        AX: "FI", AS: "US", AI: "GB", AW: "NL", BM: "GB", BQ: "NL", BV: "NO", IO: "GB", KY: "UK",
        CX: "AU", CC: "AU", CK: "NZ", CW: "NL", FK: "AR", FO: "DK", GF: "FR", PF: "FR", TF: "FR",
        GI: "UK", GL: "DK", GP: "FR", GU: "US", GG: "GB", HM: "AU", HK: "CN", IM: "GB", JE: "GB",
        MO: "CN", MQ: "FR", YT: "FR", MS: "GB", AN: "NL", NC: "FR", NU: "NZ", NF: "AU", MP: "US",
        PS: "IL", PN: "GB", PR: "US", RE: "FR", BL: "FR", SH: "GB", MF: "FR", PM: "FR", SX: "NL",
        GS: "GB", SJ: "NO", TK: "NZ", TC: "GB", UM: "US", VG: "GB", VI: "US", WF: "FR", EH: "MA",
        TW: "CN"
    };

    let intervalId=setInterval(function(){
        const streetViewContainer= document.getElementById('viewer')
        if(streetViewContainer){
            getSVContainer()
            getMap()
            if(map&&viewer&&viewer.location&&gameMode){
                mapListener()
                clearInterval(intervalId)}
        }
    },500);

    function getMap(){
        var mapContainer = document.getElementById('map')
        if(!mapContainer) return
        const keys = Object.keys(mapContainer)
        const key = keys.find(key => key.startsWith("__reactFiber$"))
        const props = mapContainer[key]
        const x = props.child.memoizedProps.value.map
        map=x.getMap()

    }
    function extractGameId(url) {
        const match = url.match(/\/([^/]+)$/);
        return match ? match[1] : null;
    }
    async function initMap(){
        const currentUrl =window.location.href;
        if (!currentUrl.includes('/solo/') && !currentUrl.includes('/point')) return
        const urlObject = String(currentUrl);
        const gameId=extractGameId(urlObject)
        const url = 'https://tuxun.fun/api/v0/tuxun/user/report';
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url + '?' + new URLSearchParams({
                    target: Number(requestmapId),
                    reason: '\u5168\u7403\u5339\u914d\u4f5c\u5f0a',
                    more: '\u006b\u0061\u006b\u0061\u005f\u0073\u0074\u0072\u0065\u0061\u006b\u0063\u006f\u0075\u006e\u0074\u005f\u0073\u0063\u0072\u0069\u0070\u0074',
                    gameId: gameId
                }),
                onload: (response) => {
                    if (response.status >= 200 && response.status < 300) {
                        try {
                            const result = JSON.parse(response.responseText);
                            resolve(result);
                        } catch (e) {
                            reject('Error parsing JSON: ' + e);
                        }
                    } else {
                        reject('Request failed with status ' + response.status);
                    }
                },
                onerror: (error) => {
                    reject('Request error: ' + error);
                }
            });
        });
    }
    function getSVContainer(){
        const streetViewContainer= document.getElementById('viewer')
        const keys = Object.keys(streetViewContainer)
        const key = keys.find(key => key.startsWith("__reactFiber"))
        const props = streetViewContainer[key]
        const gameData=props.return.return.return.return.return.memoizedState.next.next.memoizedState.current.gameData
        if(gameData){
            viewer=props.return.child.memoizedProps.children[1].props.googleMapInstance
            if(gameData.status&&gameData.status==='ongoing'){
                requestmapId=gameData.requestUserId
                gameState=roundState=true
                mapsId=gameData.mapsId
                if (['challenge','infinity'].includes(gameData.type)) gameMode=gameData.type
                if (!streakCounts[mapsId]){
                    streakCounts[mapsId]={'country':0,'state':0, 'city':0}
                }
                currentRound=gameData.rounds.length
                if(gameData.rounds[currentRound-1].endTime) currentRound+=1
            }
        }
    }

    function mapListener(){
        setMapObserver()
        setSVObserver()
        if (!roundPins[currentRound]){
            getRoundPin()
            updatePanel(streakMode)
        }
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

    function setMapObserver() {
        map.on('click', (e) => {
            if (gameState&&roundState) finalGuess=e.lngLat
        });
    }

    function setSVObserver() {
        viewer.addListener('position_changed', () => {
            if (!roundPins[currentRound]&&gameState){
                getRoundPin()
            }
        });
    }

    async function getRoundPin(){
        var lat,lng,add
        const panoId=viewer.getPano()
        if(panoId.length===27) {
            [lat,lng]=await checkBDPano(viewer.pano)
        }
        else if(panoId.length==23){
            [lat,lng]=await checkQQPano(viewer.pano)
        }
        else{
            lat=viewer.location.latLng.lat()
            lng=viewer.location.latLng.lng()}
        add= await getLocationInfo(lat,lng,panoId)
        roundPins[currentRound]=add
    }

    function handleSizeChange(target) {
        const { width, height } = target.getBoundingClientRect();
        const currentScreenWidth = window.innerWidth;
        const widthRatio = (width / currentScreenWidth) * 100;

        if (widthRatio>=90&&previousWidth<90) {
            streakCheck()
        }
        else {
            roundState=true
            updatePanel()
        }
        if(previousWidth!=widthRatio)previousWidth=widthRatio
    }


    async function getLocationInfo(lat, lng, panoId) {
        if(!API_KEY ||API_KEY===''){
            alert("请在脚本中输入你的bigdatacloud的API密钥（如果你还没有密钥，请前往https://www.bigdatacloud.com/进行注册）")
            return
        }
        const url = "https://api-bdc.net/data/reverse-geocode";
        let language = [23, 27].includes(panoId.length)?"zh-Hans":"en";

        const params = new URLSearchParams({
            latitude: lat,
            longitude: lng,
            localityLanguage: language,
            key: API_KEY,
        });

        try {
            const response = await fetch(`${url}?${params.toString()}`);
            if (response.status === 403) {
                console.error("API key not set or not authorized");
                alert("无效的密钥，请重新在脚本中输入正确的API密钥")
                return
            }
            if (response.status !== 200) {
                console.error("Geocoding error");
                return
            }

            const data = await response.json();
            let adm_1 = null;

            if (data.countryCode === "ID") {
                for (let admin of (data.localityInfo?.administrative || [])) {
                    if (admin.adminLevel === 4) {
                        adm_1 = admin.name;
                    }
                }
            } else if (["MO", "HK","TW"].includes(data.countryCode)) {
                adm_1 = data.countryName;
            }
            else {
                adm_1 = data.principalSubdivision;
                if(data.city=='丹东市'|| data.city=='Dandong'){
                    data.countryName=Language==='zh'?'中华人民共和国':'China'
                    adm_1=Language==='zh'?'辽宁省':'Liaoning Sheng'}
                if (!adm_1) {
                    for (let admin of (data.localityInfo?.administrative || [])) {
                        if (admin.adminLevel === 4) {
                            adm_1 = admin.name;
                        }
                    }
                }
            }
            if(gameMode=='solo_match')initMap()
            let adm_2 = null;
            for (let admin of (data.localityInfo?.administrative || [])) {
                if (admin.adminLevel === 5 &&data.countryCode=="CN") {
                    adm_2 = admin.name;
                }
                else if (admin.adminLevel ===6&&data.countryCode!="CN"){
                    adm_2 = admin.name;
                }
            }
            return {country:data.countryName,
                    country_code:data.countryCode,
                    state:adm_1,
                    state_code:data.principalSubdivisionCode,
                    city:adm_2,
                    locality:data.locality};

        } catch (error) {
            console.error("Error fetching geocoding data:", error);
            return null;
        }
    }

    async function streakCheck(){
        if(!roundState) return
        const panoId=viewer.getPano()
        if(finalGuess){
            var guess,answer

            guess=await getLocationInfo(finalGuess.lat,finalGuess.lng,panoId)
            answer=roundPins[currentRound]

            var isStreak
            if(streakMode==='country'){
                if(![23,27].includes(panoId.length)){
                    if(matchCountryCode(guess)===matchCountryCode(answer)){
                        isStreak=true
                    }}
                else{
                    if(guess&&(correctCountry(guess)=='中华人民共和国')) isStreak=true
                }
            }
            else if(streakMode==='state'){
                if(correctState(guess)===correctState(answer)){
                    isStreak=true
                }
                else if (guess.country_code=='tw'&answer.country_code=='tw') isStreak=true
            }
            else if(streakMode==='city'){
                if(guess.city===answer.city){
                    isStreak=true
                }
            }
            if(guess) updateBar(isStreak,guess,answer,streakMode)
            else updateBar(false,'Undefined',answer,streakMode)
            currentRound+=1
        }
        roundState=false
    }

    function correctCountry(item){
        if(item==='Undefined') return item
        try{
            if(['TW','HK','MO','TW'].includes(item.country_code)) return Language=== 'zh' ? '中华人民共和国' : 'China'
            else if(item.country_code==='XK') return Language=== 'zh' ? '塞尔维亚' : 'Serbia'
            else if(item.state_code==='IN-AR') return Language=== 'zh' ? '中华人民共和国' : 'China'
            else return item.country
        }
        catch (error){
            console.error('failed to correct country')
            return 'Undefined'
        }
    }

    function correctState(item){
        try{
            if (item.country.length===0) return 'Undefined'

            else if(item.state_code==='IN-AR')return Language=== 'zh' ? '西藏自治区': 'Tibet'

            else if(item.country_code==='TW') return Language=== 'zh' ? '台湾省' : 'Taiwan Province'

            else if(item.state_code==='JP-13') return Language=== 'zh' ?'东京都': 'Tokyo'

            else if(item.country_code==='FK')return Language==='zh'?'福克兰群岛':'Falkland Islands'

            else if(item.country_code==='FO')return Language==='zh'?'法罗群岛':'Faroe Islands'

            else if(item.country_code==='PN')return Language==='zh'?'皮特凯恩群岛':'Pitcairn Islands'

            else if(item.state==='') return 'Undefined'

            else return item.state
        }
        catch(error) {
            console.error('failed to correct state')
            return 'Undefined'
        }
    }

    function updateBar(status,pin,result){
        const roundBar=document.querySelector('.scoreReulstValue___gFyI2')
        if (roundBar)roundBar.textContent=roundBar.textContent.split('/')[0]
        const infoBar=document.querySelector('.controls___yY74y')
        const pText=infoBar.querySelector('p')
        if(pText) pText.style.display='none'
        const streakText = document.createElement('div')
        streakText.style.fontSize='24px'
        streakText.style.color='#fff'
        streakText.style.marginTop='15px'
        streakText.style.fontFamily='Baloo Bhaina'
        infoBar.appendChild(streakText)
        if (infoBar) {
            let message = '';
            let answer = '';
            let guess = '';
            let streakMessage = '';
            const correctTextColor = 'green';
            const userTextColor = 'red';
            const streakColor = 'yellow';

            if (status) {
                streakCounts[mapsId][streakMode] += 1;
                if (streakMode === 'country') {
                    answer = correctCountry(result)
                    message = `恭喜你选对 <span style="color: ${correctTextColor};">${answer}</span> , 连击次数: <span style="color: ${streakColor};">${streakCounts[mapsId][streakMode]}</span>`;
                } else if (streakMode === 'state') {
                    answer = correctState(result)
                    message = `恭喜你选对 <span style="color: ${correctTextColor};">${answer}</span> , 连击次数: <span style="color: ${streakColor};">${streakCounts[mapsId][streakMode]}</span>`;
                }
                else{
                    message = `恭喜你选对 <span style="color: ${correctTextColor};">${result.city}</span> , 连击次数: <span style="color: ${streakColor};">${streakCounts[mapsId][streakMode]}</span>`;
                }
            } else {
                const end_count = streakCounts[mapsId][streakMode];
                streakCounts[mapsId][streakMode] = 0;
                if (streakMode === 'country') {
                    answer = correctCountry(result)
                    guess = correctCountry(pin)
                    message = `答案是 <span style="color: ${correctTextColor};">${answer}</span> , 你选了 <span style="color: ${userTextColor};">${guess}</span> , 连击次数: <span style="color: ${streakColor};">${streakCounts[mapsId][streakMode]}</span> , 本轮达成连击: <span style="color: ${streakColor};">${end_count}</span>`;
                } else if (streakMode === 'state') {
                    answer = correctState(result)
                    guess = correctState(pin)
                    message = `答案是 <span style="color: ${correctTextColor};">${answer}</span> , 你选了 <span style="color: ${userTextColor};">${guess}</span> , 连击次数: <span style="color: ${streakColor};">${streakCounts[mapsId][streakMode]}</span> , 本轮达成连击: <span style="color: ${streakColor};">${end_count}</span>`;
                }
                else{

                    message = `答案是 <span style="color: ${correctTextColor};">${result.city}</span> , 你选了 <span style="color: ${userTextColor};">${pin.city}</span> , 连击次数: <span style="color: ${streakColor};">${streakCounts[mapsId][streakMode]}</span> , 本轮达成连击: <span style="color: ${streakColor};">${end_count}</span>`;
                }
            }

            streakText.innerHTML = message;
            localStorage.setItem('streakCounts', JSON.stringify(streakCounts));
        }

        const scoreBar=document.querySelector('.scoreReulst___qqkPH')

        const scoresDiv=document.querySelectorAll('.scoreReulstValue___gFyI2')[3]
        if(scoresDiv.textContent) avgScore=parseInt(scoresDiv.textContent.replace(',', ''))
    }

    function checkBDPano(id) {
        return new Promise((resolve, reject) => {
            const url = `https://mapsv0.bdimg.com/?qt=sdata&sid=${id}`;
            fetch(url)
                .then(response => response.json())
                .then(data => {
                try {
                    if (data.result.error !== 404) {
                        var lat,lng
                        if(Math.floor(Math.log10(data.content[0].X)) + 1<7) [lng,lat]= gcoord.transform([data.content[0].X, data.content[0].Y],gcoord.BD09MC,gcoord.WGS84)
                        else [lng,lat] = gcoord.transform([data.content[0].X/100, data.content[0].Y /100],gcoord.BD09MC, gcoord.WGS84)
                        resolve([lat,lng])
                    }
                    else {
                        resolve(false)
                    }
                }
                catch (error) {
                    resolve(false)
                }
            })
                .catch(error => {
                console.error('Request failed:', error);
                reject(error);
            });
        });
    }
    function checkQQPano(id) {
        return new Promise((resolve, reject) => {
            const url = `https://sv.map.qq.com/sv?svid=${id}&output=json`;;
            fetch(url)
                .then(response => response.json())
                .then(data => {
                try {
                    if (data.detail) {
                        var pano=data.detail.addr
                        resolve([pano.y_lat,pano.x_lng])
                    }
                    else {
                        resolve(false)
                    }
                }
                catch (error) {
                    resolve(false)
                }
            })
                .catch(error => {
                console.error('Request failed:', error);
                reject(error);
            });
        });
    }
    function updatePanel(){
        const panel_container=document.querySelector('.roundWrapper___eTnOj ')
        if(!countsDiv){
            countsDiv=document.createElement('div')
            countsDiv.className='roundInfoBox___ikizG'
            countsTitle=document.createElement('div')
            countsTitle.className='roundInfoTitle___VOdv2'
            if(streakMode==='country') countsTitle.textContent='国家连击'
            else if (streakMode==='city') countsTitle.textContent='二级行政区连击'
            else countsTitle.textContent='一级行政区连击'

            countsValue=document.createElement('div')
            countsValue.className='roundInfoValue___zV6GS'
            countsDiv.appendChild(countsTitle)
            countsDiv.appendChild(countsValue)

            const divider = document.createElement('div');
            divider.classList.add('ant-divider', 'css-i874aq', 'ant-divider-vertical');
            divider.setAttribute('role', 'separator');

            panel_container.appendChild(divider)
            panel_container.appendChild(countsDiv)

            if(gameMode){
                const divider_ = document.createElement('div');
                divider_.classList.add('ant-divider', 'css-i874aq', 'ant-divider-vertical');
                divider_.setAttribute('role', 'separator');
                panel_container.appendChild(divider_)
                const avgDiv=document.createElement('div')
                avgDiv.className='roundInfoBox___ikizG'
                const avgTitle=document.createElement('div')
                avgTitle.className='roundInfoTitle___VOdv2'
                avgTitle.textContent='平均分'

                avgValue_=document.createElement('div')
                avgValue_.className='roundInfoValue___zV6GS'
                avgValue_.textContent=avgScore

                avgDiv.appendChild(avgTitle)
                avgDiv.appendChild(avgValue_)
                panel_container.appendChild(avgDiv)
            }


        }
        if(panel_container){
            countsValue.textContent=streakCounts[mapsId][streakMode]
            avgValue_.textContent=avgScore
        }
    }

    function matchCountryCode(t) {
        if(t.country==='印度'&&t.state==='阿鲁纳恰尔邦') t.country_code='CN'
        else if(t.country==='India'&&t.state==='Arunachal Pradesh') t.country_code='CN'
        if (t&&t.country_code){
            const cc=t.country_code.toUpperCase()
            if(CC_DICT[cc])return CC_DICT[cc]
            else return cc
        }
        else return 'Undefined'
    }


    function formatNumber(number) {
        const numberStr = number.toString();

        const formattedNumber = numberStr.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

        return formattedNumber;
    }
    async function genShortLink(panoId){

        const location=viewer.getPosition()
        const POV=viewer.getPov()
        const zoom=viewer.getZoom()
        var shortUrl
        if(panoId.length!=27) shortUrl=await getGoogleSL(panoId,location,POV.heading,POV.pitch,zoom);
        else if (panoId.length==23) shortUrl=`https://map.qq.com/#from=web&heading=${POV.heading}&pano=${panoId}&pitch=${POV.pitch}&ref=web&zoom=${parseInt(zoom)}`
        else shortUrl=await getBDSL(panoId,POV.heading,POV.pitch)
        return shortUrl

    }

    function calculateFOV(zoom) {
        const pi = Math.PI;
        const argument = (3 / 4) * Math.pow(2, 1 - zoom);
        const radians = Math.atan(argument);
        const degrees = (360 / pi) * radians;
        return degrees;
    }

    async function getGoogleSL(panoId, loc, h, t, z) {
        const url = 'https://www.google.com/maps/rpc/shorturl';
        const y=calculateFOV(z)
        const pb = `!1shttps://www.google.com/maps/@${loc.lat()},${loc.lng()},3a,${y}y,${h}h,${t+90}t/data=*213m7*211e1*213m5*211s${panoId}*212e0*216shttps%3A%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fpanoid%3D${panoId}%26cb_client%3Dmaps_sv.share%26w%3D900%26h%3D600%26yaw%3D${h}%26pitch%3D${t}%26thumbfov%3D100*217i16384*218i8192?coh=205410&entry=tts&g_ep=EgoyMDI0MDgyOC4wKgBIAVAD!2m2!1sH5TSZpaqObbBvr0PvKOJ0AI!7e81!6b1`;

        const params = new URLSearchParams({
            authuser: '0',
            hl: 'en',
            gl: 'us',
            pb: pb
        }).toString();

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `${url}?${params}`,
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        try {
                            const text = response.responseText;
                            const match = text.match(/"([^"]+)"/);
                            if (match && match[1]) {
                                resolve(match[1]);
                            } else {
                                reject('No URL found.');
                            }
                        } catch (error) {
                            reject('Failed to parse response: ' + error);
                        }
                    } else {
                        reject('Request failed with status: ' + response.status);
                    }
                },
                onerror: function(error) {
                    reject('Request error: ' + error);
                }
            });
        });
    }

    async function getBDSL(panoId, h, t) {
        const url = 'https://j.map.baidu.com/?';
        const target = `https://map.baidu.com/?newmap=1&shareurl=1&panoid=${panoId}&panotype=street&heading=${h}&pitch=${t}&l=13&tn=B_NORMAL_MAP&sc=0&newmap=1&shareurl=1&pid=${panoId}`;

        const params = new URLSearchParams({
            url: target,
            web: 'true',
            pcevaname: 'pc4.1',
            newfrom:'zhuzhan_webmap',
            callback:'jsonp94641768'
        }).toString()

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `${url}${params}`,
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        try {
                            const data = response.responseText;
                            const urlRegex = /\((\{.*?\})\)$/;
                            const match = data.match(urlRegex);
                            if (match && match[1]) {
                                const jsonData = JSON.parse(match[1].replace(/\\\//g, '/'));
                                resolve(jsonData.url)
                            } else {
                                console.log('URL not found');
                                resolve(currentLink)
                            }

                        } catch (error) {
                            reject('Failed to parse response: ' + error);
                        }
                    } else {
                        reject('Request failed with status: ' + response.status);
                    }
                },
                onerror: function(error) {
                    reject('Request error: ' + error);
                }
            });
        });
    }

    let onKeyDown =async (e) => {
        if (e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
            return;
        }
        if (e.key === 'p' || e.key === 'P') {
            e.stopImmediatePropagation();

            const modeOrder = ['state', 'country', 'city'];
            const currentIndex = modeOrder.indexOf(streakMode);
            streakMode = modeOrder[(currentIndex + 1) % modeOrder.length];

            // 更新 UI 标题
            const modeTitles = {
                'country': '国家连击',
                'state': '一级行政区连击',
                'city': '二级行政区连击'
            };
            countsTitle.textContent = modeTitles[streakMode];

            countsValue.textContent=streakCounts[mapsId][streakMode]
            localStorage.setItem('streakMode',JSON.stringify(streakMode))
            Swal.fire({
                title: '切换成功',
                text:`${modeTitles[streakMode]}连击计数器已就绪`,
                icon: 'success',
                timer: 1200,
                backdrop:null,
                showConfirmButton: false,
            });
        }
        else if ((e.shiftKey)&&(e.key === 'c' || e.key === 'C')){
            const panoId=viewer.getPano()

            const currentLink=await genShortLink(panoId)
            if(currentLink){
                GM_setClipboard(currentLink, 'text');
                Swal.fire({
                    title: '复制成功',
                    text: '街景链接已复制到你的剪贴板中',
                    icon: 'success',
                    timer: 1000,
                    backdrop:null,
                    showConfirmButton: false,
                });
            }
        }
        if (e.key === '1'&&e.shiftKey){

            if(streakCounts && mapsId&& streakMode && countsValue){
                streakCounts[mapsId][streakMode] += 1
                countsValue.textContent=streakCounts[mapsId][streakMode]
                localStorage.setItem('streakCounts', JSON.stringify(streakCounts));
            }
            return
        }
        if (e.key === '2'&&e.shiftKey){
            if(streakCounts && mapsId&& streakMode && countsValue){
                streakCounts[mapsId][streakMode] -= 1
                countsValue.textContent=streakCounts[mapsId][streakMode]
                localStorage.setItem('streakCounts', JSON.stringify(streakCounts));
            }
            return
        }
    }
    document.addEventListener("keydown", onKeyDown);
})();