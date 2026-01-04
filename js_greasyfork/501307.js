// ==UserScript==
// @name         图寻复盘工具(所有模式)
// @version      1.0
// @description  转换图寻复盘链接成谷歌或百度街景链接，显示地点位置信息和拍摄时间以及百度街景的panoId
// @match        *://tuxun.fun/*
// @icon         https://s2.loli.net/2024/01/17/4nqsveVoH8A1mTB.png    data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNDggNDgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZmlsbD0iIzAwMDAwMCI+PGcgaWQ9IlNWR1JlcG9fYmdDYXJyaWVyIiBzdHJva2Utd2lkdGg9IjAiPjwvZz48ZyBpZD0iU1ZHUmVwb190cmFjZXJDYXJyaWVyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjwvZz48ZyBpZD0iU1ZHUmVwb19pY29uQ2FycmllciI+PHRpdGxlPjcwIEJhc2ljIGljb25zIGJ5IFhpY29ucy5jbzwvdGl0bGU+PHBhdGggZD0iTTI0LDEuMzJjLTkuOTIsMC0xOCw3LjgtMTgsMTcuMzhBMTYuODMsMTYuODMsMCwwLDAsOS41NywyOS4wOWwxMi44NCwxNi44YTIsMiwwLDAsMCwzLjE4LDBsMTIuODQtMTYuOEExNi44NCwxNi44NCwwLDAsMCw0MiwxOC43QzQyLDkuMTIsMzMuOTIsMS4zMiwyNCwxLjMyWiIgZmlsbD0iI2ZmOTQyNyI+PC9wYXRoPjxwYXRoIGQ9Ik0yNS4zNywxMi4xM2E3LDcsMCwxLDAsNS41LDUuNUE3LDcsMCwwLDAsMjUuMzcsMTIuMTNaIiBmaWxsPSIjZmZmZmZmIj48L3BhdGg+PC9nPjwvc3ZnPg==
// @author       特神
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @license      MIT
// @namespace https://greasyfork.org/users/1241829
// @downloadURL https://update.greasyfork.org/scripts/501307/%E5%9B%BE%E5%AF%BB%E5%A4%8D%E7%9B%98%E5%B7%A5%E5%85%B7%28%E6%89%80%E6%9C%89%E6%A8%A1%E5%BC%8F%29.user.js
// @updateURL https://update.greasyfork.org/scripts/501307/%E5%9B%BE%E5%AF%BB%E5%A4%8D%E7%9B%98%E5%B7%A5%E5%85%B7%28%E6%89%80%E6%9C%89%E6%A8%A1%E5%BC%8F%29.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    GM_addStyle(`
    #panels {
        position: fixed;
        top: 100px;
        left: 10px;
        padding: 10px;
        border-radius: 20px !important;
        z-index: 1000;
        display: flex;
        flex-direction: column;
        width: 180px;
    }
 
    #panels button {
        cursor: pointer;
        width: 100% !important;
        font-weight: bold !important;
        border: 8px solid #000000 !important;
        text-align: left !important;
        padding-left: 8px !important;
        padding-right: 8px !important;
        backdrop-filter: blur(10px);
        margin-bottom: 5px;
        border-radius: 4px;
        background-color: #000000 !important;
        color: #A0A0A0 !important;
    };
 
    .link-button {
        background: none!important;
        border: none;
        padding: 0!important;
        color: #FFCC00 !important;
        text-decoration: underline;
        cursor: pointer;
    }
 
    .link-button:hover {
        color: #FFCC00 !important;
    }
`);
    let api_key=JSON.parse(localStorage.getItem('api_key'));
    let address_source=JSON.parse(localStorage.getItem('address_source'));
    if (!address_source) {
        Swal.fire({
            title: '请选择获取地址信息的来源',
            icon: 'question',
            text: 'OSM具有更详细的地址信息，高德地图的获取速度更快且带有电话区号信息（需要自行注册API密钥）',
            showCancelButton: true,
            allowOutsideClick: false,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OSM',
            cancelButtonText: '高德地图',
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.setItem('address_source', JSON.stringify('OSM'));
                address_source='OSM'
            }
            else if (result.dismiss === Swal.DismissReason.cancel) {
                localStorage.setItem('address_source', JSON.stringify('GD'));
                Swal.fire({
                    title: '请输入您的高德地图 API 密钥',
                    input: 'text',
                    inputPlaceholder: '',
                    showCancelButton: true,
                    confirmButtonText: '保存',
                    cancelButtonText: '取消',
                    preConfirm: (inputValue) => {
                        if (inputValue.length===32){
                            return inputValue;
                        }
                        else{
                            Swal.showValidationMessage('请输入有效的高德地图API密钥！')
                        }
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        if(result.value){
                            localStorage.setItem('api_key', JSON.stringify(result.value));
                            Swal.fire('保存成功!', '您的API密钥已保存,请刷新页面。', 'success');}
                        else{
                            localStorage.removeItem('address_source')
                        }
                    }
                });
 
            }
        });
    }
 
    if(!api_key&&address_source==='GD'){
        Swal.fire({
            title: '请输入您的高德地图 API 密钥',
            input: 'text',
            inputPlaceholder: '',
            showCancelButton: true,
            confirmButtonText: '保存',
            cancelButtonText: '取消',
            preConfirm: (inputValue) => {
                if (inputValue.length===32){
                    return inputValue;
                }
                else{
                    Swal.showValidationMessage('请输入有效的高德地图API密钥！')
                }
            }
        }).then((result) => {
            if (result.isConfirmed) {
                if(result.value){
                    api_key=JSON.parse(localStorage.getItem('api_key'));
                    Swal.fire('保存成功!', '您的API密钥已保存,请刷新页面。', 'success');}
            }
            else{
                localStorage.removeItem('address_source')
            }
        });
    }
 
    const container = document.createElement('div');
    container.id = 'panels';
    document.body.appendChild(container);
 
 
    const openButton = document.createElement('button');
    openButton.textContent = '在地图中打开';
    container.appendChild(openButton);
 
    const copyButton = document.createElement('button');
    copyButton.textContent = '复制街景链接';
    container.appendChild(copyButton);
 
    let currentLink = '';
    let globalPanoId=null
    openButton.onclick = () => window.open(currentLink, '_blank');
    copyButton.onclick = () => {
        GM_setClipboard(currentLink, 'text');
        setTimeout(function() {
            copyButton.textContent='复制成功！'
        }, 100)
        setTimeout(function() {
            copyButton.textContent='复制街景链接'
        }, 1600)
    };
 
 
    const areaButton = document.createElement('button');
    areaButton.textContent = 'Area';
    container.appendChild(areaButton);
 
    const streetButton = document.createElement('button');
    streetButton.textContent = 'Street';
    container.appendChild(streetButton);
 
    const timeButton = document.createElement('button');
    timeButton.textContent = 'Time';
    container.appendChild(timeButton);
 
    const panoIdButton = document.createElement('button');
    timeButton.textContent = 'PanoId';
    container.appendChild(panoIdButton);
 
    let globalTimeInfo = null;
    let globalAreaInfo = null;
    let globalStreetInfo = null;
 
    function updateButtonContent() {
        areaButton.textContent = globalAreaInfo ? `${globalAreaInfo}` : '地址';
        streetButton.textContent = globalStreetInfo ? `${globalStreetInfo}` : '路名';
        timeButton.textContent = globalTimeInfo ? `${globalTimeInfo}` : '时间';
        panoIdButton.textContent=globalPanoId ? `${globalPanoId.substring(6,10)}, ${globalPanoId.substring(25,27)}` : '未知'
        panoIdButton.style.fontSize='15px'
    }
 
    setInterval(updateButtonContent, 1000);
    var realSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function(value) {
        this.addEventListener('load', function() {
            if (this._url && this._url.includes('https://tuxun.fun/api/v0/tuxun/mapProxy/getGooglePanoInfoPost')) {
                const responseText = this.responseText;
                const coordinatePattern = /\[\[null,null,(-?\d+\.\d+),(-?\d+\.\d+)\],\[\d+\.\d+\],\[\d+\.\d+,\d+\.\d+,\d+\.\d+\]\]|\[\s*null,\s*null,\s*(-?\d+\.\d+),\s*(-?\d+\.\d+)\s*\]/;
                const coordinateMatches = coordinatePattern.exec(responseText);
                if (coordinateMatches) {
                    const latitude = coordinateMatches[1] || coordinateMatches[3];
                    const longitude = coordinateMatches[2] || coordinateMatches[4];
                    if (latitude && longitude) {
                        currentLink = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${latitude},${longitude}`;
                    }
                }
 
                const countryPattern = /,\s*"([A-Z]{2})"\s*\],null,\[/;
                const countryMatches = countryPattern.exec(responseText);
                let countryCode = countryMatches ? countryMatches[1] : '未知国家';
 
                const areaPattern = /\[\[\s*"([^"]+)",\s*"[a-z]{2}"\s*\],\s*\["([^"]+)",\s*"zh"\s*\]\]/;
                const areaMatches = areaPattern.exec(responseText);
                if (areaMatches && areaMatches.length >= 3) {
                    globalAreaInfo = `${countryCode}, ${areaMatches[2]}`;
                }
 
 
                const fullAddressPattern = /\[\s*null,\s*null,\s*\[\s*\["([^"]+)",\s*"[a-z]{2}"\s*\]\]/;
                const addressMatches = fullAddressPattern.exec(responseText);
 
                if (addressMatches && addressMatches.length > 1) {
                    globalStreetInfo = addressMatches[1];
                } else {
                    globalStreetInfo = '未知地址';
                }
 
                const timePattern = /\[\d+,\d+,\d+,null,null,\[null,null,"launch",\[\d+\]\],null,\[(\d{4}),(\d{1,2})\]\]/;
                const timeMatches = timePattern.exec(responseText);
                if (timeMatches) {
                    globalTimeInfo = `${timeMatches[1]}年${timeMatches[2]}月`;
                } else {
                    globalTimeInfo = '未知时间';
                }
            }
            if (this._url && this._url.includes('mapProxy/getPanoInfo')) {
                var responseData
                const responseText = this.responseText;
                if (responseText) responseData=JSON.parse(responseText)
                if(responseData){
 
                    const latitude = responseData.data.lat
                    const longitude =responseData.data.lng
                    globalPanoId=responseData.data.pano
                    if (globalPanoId){
                        const year=parseInt(globalPanoId.substring(10,12))
                        const month=parseInt(globalPanoId.substring(12,14))
                        const day=parseInt(globalPanoId.substring(14,16))
                        globalTimeInfo = `20${year}年${month}月${day}日`;
                    }
                    else{
                        globalTimeInfo = '未知时间';
                    }
                    const heading=(responseData.data.centerHeading)-90
                    if (latitude && longitude) {
                        currentLink = `https://map.baidu.com/@12707848.16,2573405.14,21z,87t,-139.74h#panoid=${globalPanoId}&panotype=street&heading=${heading}&pitch=0&l=21&tn=B_NORMAL_MAP&sc=0&newmap=1&shareurl=1&pid=${globalPanoId}`;
                    }
                    if (api_key){
                        getAddressFromGD(latitude,longitude) .then(address => {
                            if (address) {
                                globalAreaInfo=address
                            }
                        })
                            .catch(error => {
                            console.error('获取地址时发生错误:', error);
                        });
                    }
                    else{
                        getAddressFromOSM(latitude,longitude) .then(address => {
                            var province,city,region,suburb,street
                            if (address) {
                                globalAreaInfo=processAddress(address)
                            }
                        })
                            .catch(error => {
                            console.error('获取地址时发生错误:', error);
                        });
                    }
                    if (globalPanoId){
                        getRoadName(globalPanoId) .then(roadName => {
                            if (roadName) {
                                globalStreetInfo=roadName
                            }
                        })
                            .catch(error => {
                            console.error('获取路名时发生错误:', error);
                        });
                    }
                }
            }
        }, false);
 
        realSend.call(this, value);
 
        function getAddressFromGD(latitude, longitude) {
            return new Promise((resolve, reject) => {
                const apiUrl = `https://restapi.amap.com/v3/geocode/regeo?output=json&location=${longitude},${latitude}&key=${api_key}&radius=20`;
                GM_xmlhttpRequest({
                    method: "GET",
                    url: apiUrl,
                    onload: function(response) {
                        if (response.status === 200) {
                            const data = JSON.parse(response.responseText);
                            if (data.status === '1' && data.regeocode) {
 
                                const province=data.regeocode.addressComponent.province
                                const city=data.regeocode.addressComponent.city
                                const district=data.regeocode.addressComponent.district
                                const township=data.regeocode.addressComponent.township
                                const cityCode=data.regeocode.addressComponent.citycode
                                const addressInfo={province,city,district,township,cityCode}
                                var formatted_address= '中国'
                                for (const key in addressInfo) {
                                    if (addressInfo[key]) {
                                        if (addressInfo[key]!='') {
                                            formatted_address+=`, ${addressInfo[key]} `}
                                    }
                                }
                                resolve(formatted_address);
                            } else {
                                localStorage.removeItem('api_key')
                                Swal.fire('无效的API密钥','请刷新页面并重新输入正确的高德地图API密钥','error');
                                reject(new Error('Request failed: ' + data.info));
                            }
                        } else {
                            reject(new Error('Request failed with status: ' + response.status));
 
                        }
                    },
                    onerror: function(error) {
                        console.error('Error fetching address:', error);
                        reject(error);
                    }
                });
            });}
 
        function getAddressFromOSM(latitude, longitude) {
            return new Promise((resolve, reject) => {
                const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&accept-language=cn`;
 
                fetch(apiUrl)
                    .then(response => response.json())
                    .then(data => {
                    if (data.display_name) resolve(data.display_name);
                    else resolve('未知')
                })
                    .catch(error => {
                    console.error('Error fetching address:', error);
                    reject(error);
                });
            });
        }
 
        function getRoadName(id){
            return new Promise((resolve, reject) => {
                const url = `https://mapsv0.bdimg.com/?qt=sdata&sid=${id}`;
 
                fetch(url)
                    .then(response => response.json())
                    .then(data => {
                    try{
                        if(data.content[0].Rname&&data.content[0].Rname!=""){
                            resolve(data.content[0].Rname);}
                        else{
                            resolve('未知道路')
                        }
 
                    }
                    catch (error){
                        resolve('未知道路')}
                })
                    .catch(error => {
                    console.error('Error fetching road name:', error);
                    reject(error);
                });
            });
 
        }
 
        function processAddress(text) {
 
            const items = text.split(',').map(item => item.trim());
 
            const filteredItems = items.filter(item => isNaN(item));
 
            const reversedItems = filteredItems.reverse();
 
            const result = reversedItems.join(', ');
 
            return result;
        }
    }
 
 
    XMLHttpRequest.prototype.realOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {
        this._url = url;
        this.realOpen(method, url, async, user, pass);
    };
 
    window.addEventListener('popstate', function(event) {
        const container = document.getElementById('coordinates-container');
        if (container) {
            container.remove();
        }
    });
    let onKeyDown = (e) => {
        if (e.key === 'r' || e.key === 'R') {
            e.stopImmediatePropagation();
            localStorage.removeItem('address_source')
            localStorage.removeItem('api_key')
             Swal.fire('清除成功','获取地址信息的来源已重置，您的API密钥已从缓存中清除，请刷新页面后重新选择。','success');
        }
 
    }
 
 
    document.addEventListener("keydown", onKeyDown);
})();