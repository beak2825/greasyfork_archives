// ==UserScript==
// @name         企业查询
// @namespace    hhh2000
// @version      0.1
// @description  学习-
// @author       hhh2000
// @include      *://*.bilibili.com/video/*
// @include      *://*.bilibili.tv/video/*
// @include      *://*.bilibili.com/bangumi/*
// @include      *://*.bilibili.tv/bangumi/*
// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432985/%E4%BC%81%E4%B8%9A%E6%9F%A5%E8%AF%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/432985/%E4%BC%81%E4%B8%9A%E6%9F%A5%E8%AF%A2.meta.js
// ==/UserScript==



function run(){
	
const [ON, OFF] = [true, false];
log = console.log;
dir = console.dir;
 
function loadJquery() {
	//加载jquery
	var importJs=document.createElement('script');
	importJs.setAttribute("type","text/javascript");
	importJs.setAttribute("src", 'https://code.jquery.com/jquery-1.12.4.min.js');
	document.getElementsByTagName("head")[0].appendChild(importJs);
}
 
//****初始化ajax****//
function initajax() {
    //保存所有ajax数据
    var ajax = {
        "企业查询": {
            "查询打印":{},  //取得PRIPID
            "综合查询":{},  //取得PRIPID
            "信息":{},
            "联络人信息":{},
            "查询信息的查询":{},
        },
    };
    //默认数据模板
    var template = {
        "post": {
            "json": {
                "method": "POST",
                "async": false,
                "timeout": 3000,
                "url": "",
                "headers": {"Content-Type": "application/json"},
                "body": "",
                "ok": '{"javaClass":"ParameterSet","map":{}}'
            }
        },
        "get": {
            "json": {
                "method": "GET",
                "async": false,
                "timeout": 3000,
                "url": "",
                "body": "",
                "ok": '{"javaClass":"ParameterSet","map":{}}'
            }
        }
    };
    
    //企业查询打印
    ajax['企业查询']['查询打印'] = JSON.parse(JSON.stringify(template['post']['json']));
    ajax['企业查询']['查询打印']['url'] = "/iaic/command/ajax/com.inspur.iaic.qydj.cmd.QydjZsQueryCmd/queryQyList";
    ajax['企业查询']['查询打印']['body'] = {"params":{"javaClass":"org.loushang.next.data.ParameterSet","map":{"ENTNAME":"","REGNO":"","UNISCID":"","start":0,"limit":15,"defaultSort":{"javaClass":"ArrayList","list":[]},"needTotal":true},"length":9},"context":{"javaClass":"HashMap","map":{},"length":0}}
	
	//分公司 370100300011111  PRIPID：3701002904922
	//企业信息   "jspCode":"FGS_JBXX_EDIT" ,"tblName":"QYDJ_JBXX_ZS" | 
    //负责人信息 "jspCode":"QYDJ_RYXX_LC"  ,"tblName":"QYDJ_RYXX_ZS" | QYDJ=企业登记 RYXX=人员信息
    //联络人信息 "jspCode":"WZHH_JBXX_EDIT","tblName":"QYDJ_JBXX_ZS" | JBXX=基本信息
	//370100200073008  PRIPID：3700002801597
	//企业信息   "jspCode":"GSDJ_JBXX_EDIT","tblName":"QYDJ_JBXX_ZS" | GSDJ=公司登记
	//联络人信息 "jspCode":"WZHH_JBXX_EDIT","tblName":"QYDJ_JBXX_ZS"
	//法定代表人 "jspCode":"QYDJ_FDDBR_EDIT","tblName":"QYDJ_RYXX_ZS"
    
	var entinfo = {
		"UNISCID": "913701027926378501",  //统一社会信用代码
		"REGNO": "370100300011111",  //注册号
		"ENTNAME": "山东共合贸易有限公司济南第二分公司",  //公司名称
		"SUPENTNAME": "山东共合贸易有限公司",  //隶属公司名称
		"SUPREGNO": "370100200073008",  //隶属公司注册号/统一社会信用代码
		"DOM": "山东省济南市历下区花园东路3666号保利华庭2号公建101、102、103室",  //住所
		"POSTALCODE": "250014",  //邮政编码
		"LEREP": "辛英",  //法定代表人(负责人)
		"TEL": "86962468",  //固定电话
		"REGCAP": 0,  //注册资本(资金数额)	
		"ENTTYPE": "有限责任公司分公司(自然人投资或控股)",  //企业类型
		"INDUSTRYPHY": "批发和零售业",  //行业门类
		"INDUSTRYCO": "    其他食品批发",  //行业代码
		"OPFROM": "2006-07-07",  //营业期限自
		"OPTO": null,  //营业期限至
		"OPFYEARS": null,  //营业年限（年）：长期
		"ESTDATE": "2006-07-07",  //成立日期
		"APPRDATE": "2018-09-17" ,  //核准日期
		"BUSSCOPE": "批发兼零售。(依法须经批准的项目，经相关部门批准后方可开展经营活动)",  //经营范围
		"HIGHINDUSTRY": "其他类",  //特定经营行业
		"IFFORHELP": "否",  //是否扶持
		"REGORG": "济南市历下区市场监督管理局",  //登记机关
		"LOCALORG": "济南市历下区市场监督管理局",  //管辖单位
		"ENTSTATUS": "在营（开业）企业",  //企业状态
		"LOCALADM": "姚家市场监督管理所",  //属地工商所
        "REMARK": "",  //备注
 
		"ENTCAT": "私营企业",  //企业大类
		"ORGCODE": "792637850",  //本地代码（统一社会信用代码一部分）
 
		"CODE_ENTCAT": "2",  //企业大类代码
		"CODE_ENTSTATUS": 1,  //企业状态代码
		"CODE_ENTTYPE": "2130",  //企业类型代码
		"CODE_HIGHINDUSTRY": "9900",  //特定经营行业代码
		"CODE_IFFORHELP": 2,  //是否扶持代码
		"CODE_INDUSTRYCO": "5129",  //行业代码代码
		"CODE_INDUSTRYPHY": "F",  //行业门类代码
	}
    
	//基本信息 负责人信息
	ajax['企业查询']['信息'] = JSON.parse(JSON.stringify(template['post']['json']));
    ajax['企业查询']['信息']['url'] = "/iaic/command/ajax/com.inspur.iaic.xxcx.cmd.XxcxComQueryCmd/query";
    ajax['企业查询']['信息']['body'] = {"params":{"javaClass":"org.loushang.next.data.ParameterSet","map":{"args":{"javaClass":"HashMap","map":{"jspCode":"","tblName":"","PRIPID":"","LEREPSIGN":"1"},"length":4},"start":0,"limit":10,"defaultSort":{"javaClass":"ArrayList","list":[]},"dir":"ASC","needTotal":true},"length":7},"context":{"javaClass":"HashMap","map":{},"length":0}}
	
	//联络人信息
	ajax['企业查询']['联络人信息'] = JSON.parse(JSON.stringify(template['post']['json']));
    ajax['企业查询']['联络人信息']['url'] = "/iaic/command/ajax/com.inspur.iaic.xxcx.cmd.XxcxComQueryCmd/xygsLlrQuery";
    ajax['企业查询']['联络人信息']['body'] = {"params":{"javaClass":"org.loushang.next.data.ParameterSet","map":{"pripid":"","start":0,"limit":10,"defaultSort":{"javaClass":"ArrayList","list":[]},"dir":"ASC","needTotal":true},"length":7},"context":{"javaClass":"HashMap","map":{},"length":0}}
	
    //查询信息的查询（企业类型等）
    ajax['企业查询']['查询信息的查询'] = JSON.parse(JSON.stringify(template['post']['json']));
    ajax['企业查询']['查询信息的查询']['url'] = "/iaic/command/ajax/com.inspur.iaic.common.dj.cmd.ComDmQueryCmd/query";
    ajax['企业查询']['查询信息的查询']['body'] = {"params":{"javaClass":"org.loushang.next.data.ParameterSet","map":{"TYPE@=":"","defaultSort":{"javaClass":"ArrayList","list":[]},"dir":"ASC","needTotal":true},"length":5},"context":{"javaClass":"HashMap","map":{},"length":0}};
	
    //PRIPID
    ajax['企业查询']['综合查询'] = JSON.parse(JSON.stringify(template['post']['json']));
    ajax['企业查询']['综合查询']['url'] = "/iaic/command/ajax/com.inspur.iaic.xxcx.cmd.JspQyxxQueryCmd/qyxxquery";
    ajax['企业查询']['综合查询']['body'] = {"params":{"javaClass":"org.loushang.next.data.ParameterSet","map":{"data":'{"opfromto":"","forregcapusdto":"","ENTNAMEBEALT":"","regno":"","lerep":"","opfromtj":"","grpname":"","forregcapusdtj":"","ifparentgroup":"","opto":"","llr":"","uniscid":"","cerno":"","empnumtj":"","forreccapusdtj":"","empnumto":"","jsname":"","ifech":"","forreccapusdto":"","ywlxfw":"","country":"","regcapusdfrom":"","depincha":"","regorg":"","continent":"","regcapto":"","congrousdfrom":"","regcaptj":"","domereccapusdfrom":"","pxgz":"","regcapfrom":"","jscerno":"","apprdatefrom":"","localadm":"","bgdatefrom":"","llrcerno":"","entname":"","entcat":"","domeregcapusdfrom":"","ifelec":"","forreccapusdfrom":"","dxhzdatetj":"","domereccapusdto":"","opetype":"","dxhzdateto":"","domereccapusdtj":"","lbsx":"","ifslcx":"","bgdateto":"","archno":"","gdno":"","bgdatetj":"","forregcapusdfrom":"","fztype":"","ifxzhz":"","regcapusdto":"","candatefrom":"","congrousdtj":"","ifgtsjqy":"","industryphy":"","entstatus":"1,2,3,4,9","congrousdto":"","busscope":"","dom":"","estdatetj":"","empnumfrom":"","industryco":"","estdatefrom":"","containxj":"","estdateto":"","enttype":"","regcapusdtj":"","ifprovincename":"","candateto":"","bgzt":"","gdname":"","domeregcapusdto":"","dxhzdatefrom":"","opfromfrom":"","localorg":"","apprdatetj":"","domeregcapusdtj":"","apprdateto":"","candatetj":"","optoto":"","optofrom":""}',"costomRecords":"","entcat":"0","ent_status":"","mypurview":"{}","start":0,"limit":40,"defaultSort":{"javaClass":"ArrayList","list":[]},"dir":"ASC","needTotal":true},"length":11},"context":{"javaClass":"HashMap","map":{},"length":0}};
	
    return ajax;    
}
 
 var aaa={"params":{"javaClass":"org.loushang.next.data.ParameterSet","map":{"data":"{\"opfromto\":\"\",\"forregcapusdto\":\"\",\"ENTNAMEBEALT\":\"\",\"regno\":\"370000018083957\",\"lerep\":\"\",\"opfromtj\":\"\",\"grpname\":\"\",\"forregcapusdtj\":\"\",\"ifparentgroup\":\"\",\"opto\":\"\",\"llr\":\"\",\"uniscid\":\"\",\"cerno\":\"\",\"empnumtj\":\"\",\"forreccapusdtj\":\"\",\"empnumto\":\"\",\"jsname\":\"\",\"ifech\":\"\",\"forreccapusdto\":\"\",\"ywlxfw\":\"\",\"country\":\"\",\"regcapusdfrom\":\"\",\"depincha\":\"\",\"regorg\":\"\",\"continent\":\"\",\"regcapto\":\"\",\"congrousdfrom\":\"\",\"regcaptj\":\"\",\"domereccapusdfrom\":\"\",\"pxgz\":\"\",\"regcapfrom\":\"\",\"jscerno\":\"\",\"apprdatefrom\":\"\",\"localadm\":\"\",\"bgdatefrom\":\"\",\"llrcerno\":\"\",\"entname\":\"\",\"entcat\":\"\",\"domeregcapusdfrom\":\"\",\"ifelec\":\"\",\"forreccapusdfrom\":\"\",\"dxhzdatetj\":\"\",\"domereccapusdto\":\"\",\"opetype\":\"\",\"dxhzdateto\":\"\",\"domereccapusdtj\":\"\",\"lbsx\":\"\",\"ifslcx\":\"\",\"bgdateto\":\"\",\"archno\":\"\",\"gdno\":\"\",\"bgdatetj\":\"\",\"forregcapusdfrom\":\"\",\"fztype\":\"\",\"ifxzhz\":\"\",\"regcapusdto\":\"\",\"candatefrom\":\"\",\"congrousdtj\":\"\",\"ifgtsjqy\":\"\",\"industryphy\":\"\",\"entstatus\":\"1,2,3,4,9\",\"congrousdto\":\"\",\"busscope\":\"\",\"dom\":\"\",\"estdatetj\":\"\",\"empnumfrom\":\"\",\"industryco\":\"\",\"estdatefrom\":\"\",\"containxj\":\"\",\"estdateto\":\"\",\"enttype\":\"\",\"regcapusdtj\":\"\",\"ifprovincename\":\"\",\"candateto\":\"\",\"bgzt\":\"\",\"gdname\":\"\",\"domeregcapusdto\":\"\",\"dxhzdatefrom\":\"\",\"opfromfrom\":\"\",\"localorg\":\"\",\"apprdatetj\":\"\",\"domeregcapusdtj\":\"\",\"apprdateto\":\"\",\"candatetj\":\"\",\"optoto\":\"\",\"optofrom\":\"\"}","costomRecords":"","entcat":"0","ent_status":"","mypurview":"{}","start":0,"limit":40,"defaultSort":{"javaClass":"ArrayList","list":[]},"dir":"ASC","needTotal":true},"length":11},"context":{"javaClass":"HashMap","map":{},"length":0}};
 
//request
function send(ajax) {
    try {
        var xhr = new XMLHttpRequest() || new ActiveXObject("Microsoft.XMLHTTP");
        xhr.open(ajax.method, ajax.url, ajax.async);
        if(ajax.async == true) { xhr.timeout = ajax.timeout }
        if(!!ajax.overrideMimeType == true) { xhr.overrideMimeType(ajax.overrideMimeType) }
        for(var k in ajax.headers) { xhr.setRequestHeader(k, ajax.headers[k]) }
        var body = (typeof(ajax['body']) == 'object')? JSON.stringify(ajax['body']): ajax['body'];
        xhr.send(body);
        //alert(xhr.getResponseHeader('Content-Type'));
        //console.log(xhr.getAllResponseHeaders());
		//console.log(xhr.responseType)
		//console.log(xhr.responseText)
        //return xhr.responseBody;
        return xhr.responseText;
    }
    catch(e) {
        throw e;
    }
};

function getCompQuery(obj)
{
    //填充查询关键字
    var ajax = initajax();
    
    //企业查询打印
    var queryAjax = JSON.parse(JSON.stringify(ajax['企业查询']['综合查询']));
	if('entname' in obj)
		queryAjax['body']['params']['map']['data'] = queryAjax['body']['params']['map']['data'].replace(/\"entname\":\".*?\"/, '"entname":\"'+obj['entname']+'\"');
	if('regno' in obj)
		queryAjax['body']['params']['map']['data'] = queryAjax['body']['params']['map']['data'].replace(/\"regno\":\".*?\"/, '"regno":\"'+obj['regno']+'\"');
	if('uniscid' in obj)
		queryAjax['body']['params']['map']['data'] = queryAjax['body']['params']['map']['data'].replace(/\"uniscid\":\".*?\"/, '"uniscid":\"'+obj['uniscid']+'\"');
	var json = JSON.parse(send(queryAjax));
	
	//log(json);
	
	if(json['total'] !== 1) return null;
	else return json['rows'][0]['PRIPID'];
}
//(getCompQuery({'regno':'370000018083957'}));

//
function getQueryItemInfo(type)
{
    //填充查询关键字
    var ajax = initajax();
    
    //企业查询打印
    var queryAjax = JSON.parse(JSON.stringify(ajax['企业查询']['查询信息的查询']));
	queryAjax['body']['params']['map']['type'] = type;
	var json = JSON.parse(send(queryAjax));
	
	log(json);
}
//getQueryItemInfo('ENTTYPE');
//getQueryItemInfo('ENTCAT');

//
function getENTinfo(obj)
{
    //填充查询关键字
    var ajax = initajax();
    
    //企业查询打印
    var queryAjax = JSON.parse(JSON.stringify(ajax['企业查询']['信息']));
	queryAjax['body']['params']['map']['args']['map']['jspCode'] = obj['jspCode'];
	queryAjax['body']['params']['map']['args']['map']['tblName'] = obj['tblName'];
	queryAjax['body']['params']['map']['args']['map']['PRIPID']  = obj['PRIPID'];
	var json = JSON.parse(send(queryAjax));
	
	//log(json);
    return json['rows'][0];
}
//getENTinfo({'jspCode':'GSDJ_JBXX_EDIT', 'tblName':'QYDJ_JBXX_ZS', 'PRIPID':'3700002801597'});
 
//
function getLLRinfo(obj)
{
    //填充查询关键字
    var ajax = initajax();
    
    //企业查询打印
    var queryAjax = JSON.parse(JSON.stringify(ajax['企业查询']['联络人信息']));
	queryAjax['body']['params']['map']['pripid']  = obj['PRIPID'];
	var json = JSON.parse(send(queryAjax));
	
	//log(json);
    return json['rows'][0];
}
//getLLRinfo({'PRIPID':'3701002904922'}); 

/*
统一社会信用代码:  913701027926378501
注册号:  370100300011111
企业类别:  私营企业
企业类型:  有限责任公司分公司(自然人投资或控股)
企业名称:  山东共合贸易有限公司济南第二分公司
*/
function getPRIPID_One(obj)
{
    //填充查询关键字
    var ajax = initajax();
    
    //企业查询打印
    var queryAjax = JSON.parse(JSON.stringify(ajax['企业查询']['查询打印']));
	queryAjax['body']['params']['map']['ENTNAME'] = obj['entname'];
	queryAjax['body']['params']['map']['REGNO']   = obj['regno'];
	queryAjax['body']['params']['map']['UNISCID'] = obj['uniscid'];
	var json = JSON.parse(send(queryAjax));
	
	log(json);
	
	if(json['total'] !== 1) return null;
	else return json['rows'][0]['PRIPID'];
} 
//getPRIPID_One({'regno':'370100300011111'});

//
function is_query(info)
{
	for(var k in info){
		if(info[k].read === ON) return true;
	}
	return false;
}

//
function set_entinfo(entinfo, data)
{
	for(var k in data){
		if(k in entinfo)
			entinfo[k].value = data[k];
		else
			entinfo[k] = {'value': data[k], "title":null, 'reda': OFF};
	}
}

function run(data)
{   
	var entinfo = {
		'JBXX'  : {
			"UNISCID"      : {"value":"", "title":"统一社会信用代码", "read": ON},            
			"REGNO"        : {"value":"", "title":"注册号", "read": ON},
			"ENTNAME"      : {"value":"", "title":"公司名称", "read": ON},
			"SUPENTNAME"   : {"value":"", "title":"隶属公司名称", "read": OFF},
			"SUPREGNO"     : {"value":"", "title":"隶属公司注册号/统一社会信用代码", "read": OFF},
			"DOM"          : {"value":"", "title":"住所", "read": ON},
			"POSTALCODE"   : {"value":"", "title":"邮政编码", "read": OFF},
			"LEREP"        : {"value":"", "title":"法定代表人(负责人)", "read": ON},
			"TEL"          : {"value":"", "title":"固定电话", "read": ON},
			"REGCAP"       : {"value":"", "title":"注册资本(资金数额)	", "read": OFF},
			"ENTTYPE"      : {"value":"", "title":"企业类型", "read": OFF},
			"INDUSTRYPHY"  : {"value":"", "title":"行业门类", "read": OFF},
			"INDUSTRYCO"   : {"value":"", "title":"行业代码", "read": OFF},
			"OPFROM"       : {"value":"", "title":"营业期限自", "read": OFF},
			"OPTO"         : {"value":"", "title":"营业期限至", "read": OFF},
			"OPFYEARS"     : {"value":"", "title":"营业年限（年）：长期", "read": OFF},
			"ESTDATE"      : {"value":"", "title":"成立日期", "read": ON},
			"APPRDATE"     : {"value":"", "title":"核准日期", "read": OFF},
			"BUSSCOPE"     : {"value":"", "title":"经营范围", "read": ON},
			"HIGHINDUSTRY" : {"value":"", "title":"特定经营行业", "read": OFF},
			"IFFORHELP"    : {"value":"", "title":"是否扶持", "read": OFF},
			"REGORG"       : {"value":"", "title":"登记机关", "read": OFF},
			"LOCALORG"     : {"value":"", "title":"管辖单位", "read": OFF},
			"ENTSTATUS"    : {"value":"", "title":"企业状态", "read": OFF},
			"LOCALADM"     : {"value":"", "title":"属地工商所", "read": OFF},
			"REMARK"       : {"value":"", "title":"备注", "read": OFF},
	 
			"ENTCAT" : {"value":"", "title":"企业大类", "read": OFF},
			"ORGCODE" : {"value":"", "title":"本地代码（统一社会信用代码一部分）", "read": OFF},
	 
			"CODE_ENTCAT" : {"value":"", "title":"企业大类代码", "read": OFF},
			"CODE_ENTSTATUS" : {"value":"", "title":"企业状态代码", "read": OFF},
			"CODE_ENTTYPE" : {"value":"", "title":"企业类型代码", "read": OFF},
			"CODE_HIGHINDUSTRY" : {"value":"", "title":"特定经营行业代码", "read": OFF},
			"CODE_IFFORHELP" : {"value":"", "title":"是否扶持代码", "read": OFF},
			"CODE_INDUSTRYCO" : {"value":"", "title":"行业代码代码", "read": OFF},
			"CODE_INDUSTRYPHY" : {"value":"", "title":"行业门类代码", "read": OFF},
		},
		'FZRXX' : {
			"TEL"        : {"value":"", "title":"法定代表人（负责人）固定电话", "read": ON},
			"MOBEL"      : {"value":"", "title":"法定代表人（负责人）移动电话", "read": ON},
			"NAME"       : {"value":"", "title":"法定代表人（负责人）姓名", "read": OFF},
			"PERCERTYPE" : {"value":"", "title":"法定代表人（负责人）身份证件类型", "read": OFF},
			"PERCERNO"   : {"value":"", "title":"法定代表人（负责人）身份证件号码", "read": OFF},
		},
		'LLRXX' : {
			"MOBTEL"     : {"value":"", "title":"联络人移动电话", "read": ON},
			"TEL"        : {"value":"", "title":"联络人固定电话", "read": ON},
			"NAME"       : {"value":"", "title":"联络人姓名", "read": OFF},
			"PERCERTYPE" : {"value":"", "title":"联络人身份证件类型", "read": OFF},
			"PERCERNO"   : {"value":"", "title":"联络人身份证件号码", "read": OFF},
		},
	}

	for(let i in data.regno){
		let v = data.regno[i];
		if(parseInt(i) !== data.regno.indexOf(v)) continue;
		
		let PRIPID = getCompQuery({'regno': v});
		log(v+' - '+PRIPID);
		if(PRIPID === null){ log('PRIPID为空'); return false; }
		if(data.PRIPID.indexOf(PRIPID) === -1) data.PRIPID.push(PRIPID);
		
		if(i>=1) break;
    }
	for(let i in data.uniscid){
		let v = data.uniscid[i];
		if(parseInt(i) !== data.uniscid.indexOf(v)) continue;
		
		let PRIPID = getCompQuery({'uniscid': v});
		log(v+' - '+PRIPID);
		if(PRIPID === null){ log('PRIPID为空'); return false; }
		if(data.PRIPID.indexOf(PRIPID) === -1) data.PRIPID.push(PRIPID);
		
		if(i>=1) break;
    }
	log(data.PRIPID);
	
	for(let i=0, len=data.PRIPID.length; i<len; i++){
		log('----------------'+i+'----------------');
		let PRIPID = data.PRIPID[i];
		let info;
		if(is_query(entinfo.JBXX)){
			info = getENTinfo({'jspCode':'FGS_JBXX_EDIT', 'tblName':'QYDJ_JBXX_ZS', 'PRIPID':PRIPID});
			log(info);
			set_entinfo(entinfo.JBXX, info);
		}
		if(is_query(entinfo.FZRXX)){
			info = getENTinfo({'jspCode':'QYDJ_RYXX_LC' , 'tblName':'QYDJ_RYXX_ZS', 'PRIPID':PRIPID});
			log(info);
			set_entinfo(entinfo.FZRXX, info);
		}
		if(is_query(entinfo.LLRXX)){
			info = getLLRinfo({'PRIPID':PRIPID});
			log(info);
			set_entinfo(entinfo.LLRXX, info);
		}
	}
	
	log(entinfo);
}

run(data);

var data = {
	'PRIPID':[],
	'regno':[
		'370102000005657',
		'370102200804435',
		'370102200463758',
		'370102200434823',
		'370100000049006',
		'370102200297934',
		'370102200564939',
		'370102300101121',
		'370102200205356',
		'370102200589235',
		'370102300064764',
		'370102200895698',
		'370104200093953',
		'370103200090455',
		'370102200071641',
		'370102200855451',
		'370102200118496',
		'370102200618836',
		'370102200837828',
		'370102200845633',
		'370100200197308',
		'370102200582170',
		'370102200798705',
		'370112200351040',
		'370105200054416',
		'370102100005710',
		'370102200608105',
		'370102200749911',
		'370102200012164',
		'370102200478491',
		'370102200627146',
		'370102300085856',
		'370127100004415',
		'370100000052823',
		'370102200462790',
		'370102200705001',
		'370102200433023',
		'370102200579844',
		'370102200859830',
		'370102200303874',
		'370102200768819',
		'370102300086589',
		'370102200755238',
		'370102200848473',
		'370100100039450',
		'370100100042040',
		'370100500023125',
		'370100500023133',
		'370100400009636',
		'370100200318668',
		'370100000019552',
		'370100000053738',
		'370100000053826',
		'370100200317778',
		'370100400012015',
		'370102300102374',
		'370100200121758',
		'370102200627736',
	],
	'uniscid':[
		'91370100575461529A',
		'91370102MA3TX8617J',
		'91370102MA3ML2B7XB',
		'91370102MA3QW45M3B',
		'91370102MA3N5GYF3J',
		'91370102MA3MJ0GQ0H',
		'91370102MA3PLAKG5N',
		'91370102MA3Q4A670T',
		'91370102MA3QDK6J5C',
		'91370105MA3RLJAX7H',
		'91370102MA3PMMPT1J',
		'91370102353478851M',
		'91370102787442207T',
		'913701027884798108',
		'91370102738167253B',
		'913700007372116628',
		'91370102306835799T',
		'91370102MA3MP0PWXX',
		'913701005970459649',
		'91370102084018514B',
		'91370102MA3CE4YK0J',
		'91370102MA3CJ7K974',
		'91370102MA3U09XQ76',
		'91370102MA3U291T9Y',
		'91370102MA3QTBFXX0',
		'91370102MA3CK6826U',
		'91370102MA3P4KBA32',
		'91370102MA3TYPT23W',
	],
	'entname':[],
}


}