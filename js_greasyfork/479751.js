// ==UserScript==
// @name         PMA IPEdit
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  try to take over the world!
// @author       You
// @match        https://orm.leo.moe/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leo.moe
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479751/PMA%20IPEdit.user.js
// @updateURL https://update.greasyfork.org/scripts/479751/PMA%20IPEdit.meta.js
// ==/UserScript==

window.createQueryWindow=()=>{
// create a div element for the floating window
const floatingWindow = document.createElement('div');

// set the styles for the floating window
floatingWindow.style.position = 'fixed';
floatingWindow.style.top = '50%';
floatingWindow.id="pmaipedit";
floatingWindow.style.left = '50%';
floatingWindow.style.transform = 'translate(-50%, -50%)';
floatingWindow.style.width = '300px';
floatingWindow.style.height = '550px';
floatingWindow.style.zIndex = "9999";
floatingWindow.style.backgroundColor = '#fff';
floatingWindow.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.3)';

// add window content
floatingWindow.innerHTML = `
    <!-- window header -->
    <div id="floatingwindowheader" style="height: 30px; cursor:move; background-color: #eee; padding: 10px;display:flex;flex-direction:row;justify-content:space-between;align-items:center">
        <span style="font-weight: bold;">IP工具</span>
    </div>
    <div style="padding: 10px;">
        <!-- window content -->
        <!-- IP Input -->
        <div style="display:flex;flex-direction:row;justify-content:space-between;align-items:center">
            <span>IP地址</span>
            <input id="ip" type="text" style="width: 80%; height: 30px; border: 1px solid #eee; padding: 5px;" oninput="calciprange(this)">
        </div>
        <!-- a checkbox to select within or contain -->
        <div style="display:flex;flex-direction:row;justify-content:space-between;align-items:center">
            <span>模糊查询(查找更大段)</span>
            <input id="fuzzy" type="checkbox" style="height: 30px; border: 1px solid #eee; padding: 5px;">
        </div>
        <!-- a label showing the start and the end of ip range -->
        <div style="display:flex;flex-direction:row;justify-content:space-between;align-items:center">
            <span>IP范围</span>
            <span id="iprange" style="width: 80%; height: 30px; padding: 5px; margin: 6px;"></span>
        </div>
        <!-- Country -->
        <div style="display:flex;flex-direction:row;justify-content:space-between;align-items:center">
            <span>国家</span>
            <input id="country" type="text" style="width: 80%; height: 30px; border: 1px solid #eee; padding: 5px;">
        </div>
        <!-- Prov -->
        <div style="display:flex;flex-direction:row;justify-content:space-between;align-items:center">
            <span>省区</span>
            <input id="prov" type="text" style="width: 80%; height: 30px; border: 1px solid #eee; padding: 5px;">
        </div>
        <!-- City -->
        <div style="display:flex;flex-direction:row;justify-content:space-between;align-items:center">
            <span>城市</span>
            <input id="city" type="text" style="width: 80%; height: 30px; border: 1px solid #eee; padding: 5px;">
        </div>
        <!-- District -->
        <div style="display:flex;flex-direction:row;justify-content:space-between;align-items:center">
            <span>区县</span>
            <input id="district" type="text" style="width: 80%; height: 30px; border: 1px solid #eee; padding: 5px;">
        </div>
        <!-- ISP -->
        <div style="display:flex;flex-direction:row;justify-content:space-between;align-items:center">
            <span>ISP</span>
            <input id="isp" type="text" style="width: 80%; height: 30px; border: 1px solid #eee; padding: 5px;">
        </div>
        <!-- ASN -->
        <div style="display:flex;flex-direction:row;justify-content:space-between;align-items:center">
            <span>ASN</span>
            <input id="asn" type="text" style="width: 80%; height: 30px; border: 1px solid #eee; padding: 5px;">
        </div>
        <!-- owner -->
        <div style="display:flex;flex-direction:row;justify-content:space-between;align-items:center">
            <span>所有者</span>
            <input id="owner" type="text" style="width: 80%; height: 30px; border: 1px solid #eee; padding: 5px;">
        </div>

        <div style="display:flex;flex-direction:row;justify-content:space-between;align-items:center">
            <span>UID</span>
            <input id="uid" type="text" style="width: 80%; height: 30px; border: 1px solid #eee; padding: 5px;">
        </div>
    </div>
    <!-- blue search button -->
    <div style="margin-top:auto;display:flex;flex-direction:row;justify-content:center;align-items:center">
        <button id="search" style="width: 40%; height: 30px; border:none; padding: 5px; background-color: #2196F3; color: #fff; cursor: pointer;" onclick="generateQuery()">查询</button>
        <button id="search" style="width: 40%; height: 30px; border:none; margin-left:5px; padding: 5px; background-color: #15d36a; color: #fff; cursor: pointer;" onclick="generateInsert()">添加条目</button>
    </div>


`

// make the window draggable
let isDragging = false;
let mouseOffsetX = 0;
let mouseOffsetY = 0;

floatingWindow.querySelector("#floatingwindowheader").addEventListener('mousedown', function(e) {
    isDragging = true;
    mouseOffsetX = e.clientX - floatingWindow.offsetLeft;
    mouseOffsetY = e.clientY - floatingWindow.offsetTop;
});

document.addEventListener('mousemove', function(e) {
    if (isDragging) {
        floatingWindow.style.left = e.clientX - mouseOffsetX + 'px';
        floatingWindow.style.top = e.clientY - mouseOffsetY + 'px';
    }
});

document.addEventListener('mouseup', function() {
    isDragging = false;
});

// save all input elements value to localstorage
floatingWindow.querySelectorAll('input').forEach((el)=>{
    el.addEventListener('input',()=>{
        localStorage.setItem(el.id,el.value);
        if(el.type == 'checkbox'){
            localStorage.setItem(el.id,el.checked);
        }
    })
});


// append the floating window to the body element
document.body.appendChild(floatingWindow);
}

window.calciprange = (el) => {
    let input=el.value;
    // validate the input format, if ip cidr not exist, return
    if(input.indexOf('/')===-1){
        document.querySelector('#iprange').innerHTML = "";
        return;
    }
    let ip = input.split('/')[0];
    let cidr = input.split('/')[1];

    if(cidr<0 || cidr>32 || cidr==""){
        document.querySelector('#iprange').innerHTML = "";
        return;
    }

    // validate the IP format, if not IPv4, return
    let ipArr = ip.split('.');
    if(ipArr.length !== 4 || ipArr.some(octet => isNaN(octet) || octet < 0 || octet > 255)){
        document.querySelector('#iprange').innerHTML = "";
        return;
    }

    let [start,end] = getIpRangeFromAddressAndNetmask(input);

    // output the start, end, and size of the IP range
    document.querySelector('#iprange').innerHTML = `${start} - ${end}`;

}

window.getIpRangeFromAddressAndNetmask=(str) =>{
    var part = str.split("/"); // part[0] = base address, part[1] = netmask
    var ipaddress = part[0].split('.');
    var netmaskblocks = ["0","0","0","0"];
    if(!/\d+\.\d+\.\d+\.\d+/.test(part[1])) {
      // part[1] has to be between 0 and 32
      netmaskblocks = ("1".repeat(parseInt(part[1], 10)) + "0".repeat(32-parseInt(part[1], 10))).match(/.{1,8}/g);
      netmaskblocks = netmaskblocks.map(function(el) { return parseInt(el, 2); });
    } else {
      // xxx.xxx.xxx.xxx
      netmaskblocks = part[1].split('.').map(function(el) { return parseInt(el, 10) });
    }
    // invert for creating broadcast address (highest address)
    var invertedNetmaskblocks = netmaskblocks.map(function(el) { return el ^ 255; });
    var baseAddress = ipaddress.map(function(block, idx) { return block & netmaskblocks[idx]; });
    var broadcastaddress = baseAddress.map(function(block, idx) { return block | invertedNetmaskblocks[idx]; });
    return [baseAddress.join('.'), broadcastaddress.join('.')];
}

window.IPtoDecIP=(ip)=>{
    return parseInt(ip.split('.').map((el)=>{return Number(el).toString(2).padStart(8,'0')}).join(""),2);
}

window.generateQuery=()=>{
    let ip = document.querySelector('#ip').value;
    let country = document.querySelector('#country').value;
    let prov = document.querySelector('#prov').value;
    let city = document.querySelector('#city').value;
    let district = document.querySelector('#district').value;
    let asn = document.querySelector('#asn').value;
    let isp = document.querySelector('#isp').value;
    let owner = document.querySelector('#owner').value;
    let uid = document.querySelector('#uid').value;

    let query = `SELECT * FROM cache_ipv4 WHERE 1=1`;
    // try to get baseaddress and broadcastaddress for ip
    if(ip){
        if(ip.indexOf('/')===-1){
            ip+='/32';
        }
        let [start,end] = getIpRangeFromAddressAndNetmask(ip);
        if(document.querySelector('#fuzzy').checked){
            query += ` AND ${IPtoDecIP(start)} between network_address and broadcast_address AND ${IPtoDecIP(end)} between network_address and broadcast_address`;
        }else{
            query += ` AND network_address >= ${IPtoDecIP(start)} AND broadcast_address <= ${IPtoDecIP(end)}`;
        }
    }
    if(country){
        query += ` AND country LIKE '%${country}%'`;
    }
    if(city){
        query += ` AND city LIKE '%${city}%'`;
    }
    if(prov){
        query += ` AND prov LIKE '%${prov}%'`;
    }
    if(district){
        query += ` AND district LIKE '%${district}%'`;
    }
    if(isp){
        query += ` AND isp LIKE '%${isp}%'`;
    }
    if(asn){
        query += ` AND as_number LIKE '%${asn}%'`;
    }
    if(owner){
        query += ` AND owner LIKE '%${owner}%'`;
    }
    if(uid){
        query += ` AND uid = ${uid}`;
    }
    query += ` ORDER BY id DESC`;
    codeMirrorEditor.setValue(query);
    document.querySelector('#retain_query_box').checked=true
    document.querySelector('#button_submit_query').click();
}

window.generateInsert=()=>{
    let ip = document.querySelector('#ip').value;
    let country = document.querySelector('#country').value;
    let prov = document.querySelector('#prov').value;
    let city = document.querySelector('#city').value;
    let district = document.querySelector('#district').value;
    let asn = document.querySelector('#asn').value;
    let isp = document.querySelector('#isp').value;
    let owner = document.querySelector('#owner').value;
    let uid = document.querySelector('#uid').value;

    if(ip.indexOf('/')!==-1){
        var [networkaddress,broadcastaddress] = getIpRangeFromAddressAndNetmask(ip);
        var prefix = ip.split('/')[1];
    }else{
        var networkaddress = ip;
        var broadcastaddress = ip;
        var prefix = 32;
    }
    ip=ip.split('/')[0];

    let query = `INSERT INTO cache_ipv4 (uid,ip,prefix,asnumber,country,prov,city,district,owner,isp,updatetime,network_address,broadcast_address) VALUES ('${uid}','${ip}','${prefix}','${asn}','${country}','${prov}','${city}','${district}','${owner}','${isp}',NOW(),'${IPtoDecIP(networkaddress)}','${IPtoDecIP(broadcastaddress)}');`;
    let oValue = codeMirrorEditor.getValue();
    codeMirrorEditor.setValue(oValue + "\n" + query);
    document.querySelector('#retain_query_box').checked=true
}

setInterval(()=>{
    // if query window gone, create a new one
    if(!document.querySelector('#floatingwindowheader')){
        createQueryWindow();
        // restore all input elements value from localstorage
        document.querySelector('#pmaipedit').querySelectorAll('input').forEach((el)=>{
            el.value = localStorage.getItem(el.id);
            if(el.type == 'checkbox'){
                el.checked = localStorage.getItem(el.id) === 'true';
            }
        });
    }
},500);