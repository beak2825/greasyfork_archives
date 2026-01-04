/*
*使用httpSend()函数调用，需把@require放在// @grant       GM_xmlhttpRequest之后
*参数详解:
*url:请求的url,必须!
*type:请求方式(get/post),必须!
*mode:请求调用函数(jq/gm),必须!
*headers:自定义请求头,仅gm模式可用
*data:要发送的数据,仅post方式可用
*timeout:请求超时时间,单位毫秒
*dataType:返回数据类型(arraybuffer,blob,json)
*callback:请求完成回调函数
*username:用户名
*password:密码
*/
function httpSend(i,e={}){
    if(!i.url){throw "缺少请求的url!"};
    if(!i.type){throw "缺少请求方式(get/post)!"};
    if(!i.mode){i.mode="jq"};
    e.url=i.url;
    i.username&&(e.username=i.username);
    i.password&&(e.password=i.password);
    i.data&&(e.data=i.data);
    e.timeout=i.timeout?i.timeout*1000:30000;
    i.headers&&(e.headers=i.headers);
    if(/^jq$/i.test(i.mode)){
        e.xhrFields={withCredentials: true};
        e.crossDomain=true;
        e.cache=false;
        e.type=i.type;
        i.callback&&(e.complete=function(e){i.callback(jqTransform(e))});
        try{$.ajax(e)}catch(err){i.callback(err)};
    }else if(/^gm$/i.test(i.mode)){
        i.type&&(e.method=i.type.toUpperCase());
        if(i.callback){
            e.onload=function(e){i.callback(gmTransform(e))}
            e.ontimeout=function(e){i.callback({status:0,statusText:"timeout"})}
        }
        try{GM_xmlhttpRequest(e)}catch(err){i.callback(err)};
    }else{throw "此请求模式("+i.mode+")不存在!"}
}
function jqTransform(response){
    let data={};
    data.status=response.status;
    data.statusText=response.statusText;
    data.readyState=response.readyState;
    data.text=response.responseText;
    data.json=response.response||toJSON(response.responseText);
    data.responseHeaders=response.getAllResponseHeaders();
    data.getResponseHeader=response.getResponseHeader;
    data.data=response;
    return data;
}
function gmTransform(response){
    let data={};
    data.status=response.status;
    data.statusText=response.statusText;
    data.readyState=response.readyState;
    data.text=response.responseText;
    data.json=typeof response.response=="object"?response.response:toJSON(response.responseText);
    data.responseHeaders=response.responseHeaders;
    data.finalUrl=response.finalUrl;
    data.data=response;
    return data;
}
function toJSON(str) {
    if (typeof str == 'string'&&(/^\{[\w\W]*?\}$/gim.test(str))) {
        try {
            let json=eval('('+str+')');
            return json;
        } catch(e) {
            return {};
        }
    }else{
        return {};
    }
}