// ==UserScript==
// @name         强力 OI/ACM 跳题器 Super Problem Jumper
// @namespace    http://tampermonkey.net/
// @version      0.29
// @description  支持在所有网页跳转到题目，支持洛谷、CodeForces、AtCoder、LOJ、UOJ、UVA 等多种题库的题目
// @author       adfhkjafsdk
// @match        *://*/*
// @license      MIT
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @connect      leetcode.cn
// @connect      www.acwing.com
// @downloadURL https://update.greasyfork.org/scripts/459516/%E5%BC%BA%E5%8A%9B%20OIACM%20%E8%B7%B3%E9%A2%98%E5%99%A8%20Super%20Problem%20Jumper.user.js
// @updateURL https://update.greasyfork.org/scripts/459516/%E5%BC%BA%E5%8A%9B%20OIACM%20%E8%B7%B3%E9%A2%98%E5%99%A8%20Super%20Problem%20Jumper.meta.js
// ==/UserScript==

// 反馈、更新等见 https://greasyfork.org/scripts/459516

const vjudge="https://vjudge.csgrandeur.cn/";
const luogu="https://www.luogu.com.cn/problem/",
	  cf="https://codeforces.com/problemset/problem/",
	  cfg="https://codeforces.com/gym/",
	  at="https://atcoder.jp/contests/",
	  poj="http://poj.org/problem?id=",
	  loj="https://loj.ac/p/",
	  uoj="https://uoj.ac/problem/",
	  spoj="https://www.spoj.com/problems/",
	  uva="https://onlinejudge.org/",
	  spojl="https://www.luogu.com.cn/remoteJudgeRedirect/spoj/",
	  uval="https://www.luogu.com.cn/remoteJudgeRedirect/uva/",
	  topc=vjudge+"problem/TopCoder-",
	  hydro="https://hydro.ac/p/",
	  vijos="https://vijos.org/p/",
	  lydsy="http://www.lydsy.com/JudgeOnline/problem.php?id=",
	  lydsys="https://www.lydsy.com/JudgeOnline/problem.php?id=",
	  //dbzoj="https://darkbzoj.cc/problem/",
	  dbzoj="https://hydro.ac/d/bzoj/p/",
	  ybt="http://ybt.ssoier.cn:8088/problem_show.php?pid=",
	  hdu="https://acm.hdu.edu.cn/showproblem.php?pid=",
	  ural="https://acm.timus.ru/problem.aspx?space=1&num=",
	  zoj="https://zoj.pintia.cn/problem-sets/91827364500/problems/",
	  acw="https://www.acwing.com/problem/content/",
	  aizu="https://judge.u-aizu.ac.jp/onlinejudge/description.jsp?id=",
	  sgu="https://codeforces.com/problemsets/acmsguru/problem/99999/",
	  pjudge="https://pjudge.ac/problem/",
	  infoj="http://119.27.163.117/problem/",
	  cdoj="https://vjudge.csgrandeur.cn/problem/UESTC-",
	  leet="https://leetcode.cn/problems/",
	  ustc="http://acm.ustc.edu.cn/ustcoj/problem.php?id=",
	  sjtu="https://acm.sjtu.edu.cn/OnlineJudge/problem/",
	  qoj="https://qoj.ac/problem/",
	  jsk="https://www.jisuanke.com/problem/",
	  xtl="https://oj.youdao.com/problem/",
	  codechef="https://www.codechef.com/problems/",
	  nod51="https://www.51nod.com/Challenge/Problem.html#problemId=";
var inLuogu,inLuoguUva;
var prefixPattern=[
	['P',luogu+'P',4],['B',luogu+'B',4],['U',luogu+'U',4],['T',luogu+'T',4],['LG',luogu+'P',4],
	['LGP',luogu+'P',4],['LGB',luogu+'B',4],['LGU',luogu+'U',4],['LGT',luogu+'T',4],['LGOJ',luogu+'P',4],
	['LGOJP',luogu+'P',4],['LGOJB',luogu+'B',4],['LGOJU',luogu+'U',4],['LGOJT',luogu+'T',4],['LUOGU',luogu+'P',4],
	['LUOGUP',luogu+'P',4],['LUOGUB',luogu+'B',4],['LUOGUU',luogu+'U',4],['LUPGUT',luogu+'T',4],['洛谷',luogu+'P',4],
	['洛谷P',luogu+'P',4],['洛谷B',luogu+'B',4],['洛谷U',luogu+'U',4],['洛谷T',luogu+'T',4],['谷',luogu+'P',4],
	['谷P',luogu+'P',4],['谷B',luogu+'B',4],['谷U',luogu+'U',4],['谷T',luogu+'T',4],['AT',luogu+'AT',3],
	['ATC',luogu+'AT',3],['ATCODER',luogu+'AT',3],['LOJ',loj,1],['LIBRE',loj,1],['LIBREOJ',loj,1],
	['UOJ',uoj,1],['UNIVERSAL',uoj,1],['UNIVERSALOJ',uoj,1],['SP',spojl,1],['SPOJ',spojl,1],
	// ['UVA',uval,3],
	['UVA',luogu+'UVA',3], //由于 UVA 比较卡，UVA 题号会跳转到洛谷爬取的 UVA 题目，如果需要跳到 UVA 原站只需要取消上一行的注释
	// ['UVAOJ',uval,3],
	['UVAOJ',luogu+'UVA',3], //同上
	['POJ',poj,4],['BZ',dbzoj,4],['BZOJ',dbzoj,4],['LYDSY',dbzoj,4],['HYSBZ',dbzoj,4],
	['DBZOJ',dbzoj,4],['DARKBZOJ',dbzoj,4],['TOPCODER',topc,3],['TOPC',topc,3],['TOP',topc,3],
	['HYDRO',hydro+'H',4],['HYDROOJ',hydro+'H',4],['VIJOS',vijos,4],['YBT',ybt,4],['YIBENTONG',ybt,4],
	['一本通',ybt,4],['信息学奥赛一本通',ybt,4],['HDU',hdu,4],['HDUOJ',hdu,4],['杭电',hdu,4],
	['杭电OJ',hdu,4],['URAL',ural,4],['URALOJ',ural,4],['TIMUS',ural,4],['TIMUSOJ',ural,4],
	['AIZU',aizu,4],['AIZUOJ',aizu,4],['AOJ',aizu,4],['USTC',ustc,4],['USTCOJ',ustc,4],
	['CDOJ',cdoj,1],['INFOJ',infoj,1],['INF',infoj,1],['IOJ',infoj,1],['PUBLICJUDGE',pjudge,5],
	['PJUDGE',pjudge,5],['PUBLICJ',pjudge,5],['PUBLIC',pjudge,5],['PJ',pjudge,5],['CDOJ',cdoj,1],
	['UESTC',cdoj,1],['UESTCOJ',cdoj,1],['SGU',sgu,3],['SGURU',sgu,3],['SGUOJ',sgu,3],
	['ACMSGURU',sgu,3],['SJTU',sjtu,4],['SJTUOJ',sjtu,4],['上海交通大学',sjtu,4],['上交大',sjtu,4],
	['上海交大',sjtu,4],['上海交通大学OJ',sjtu,4],['上交大OJ',sjtu,4],['上海交大OJ',sjtu,4],['QOJ',qoj,1],
	['JISUANKE',jsk+'T',4],['JISUANKET',jsk+'T',4],['JISUANKEA',jsk+'A',4],['JSK',jsk+'T',4],['JSKT',jsk+'T',4],
	['JSKA',jsk+'A',4],['JSKOJ',jsk+'T',4],['JSKOJT',jsk+'T',4],['JSKOJA',jsk+'A',4],['计蒜客',jsk+'T',4],
	['计蒜客T',jsk+'T',4],['计蒜客A',jsk+'A',4],['计蒜客OJ',jsk+'T',4],['计蒜客OJT',jsk+'T',4],['计蒜客OJA',jsk+'A',4],
	['XTL',xtl,1],['XTLP',xtl,1],['XTLOJ',xtl,1],['XTLOJP',xtl,1],['小图灵',xtl,1],
	['小图灵P',xtl,1],['小图灵OJ',xtl,1],['小图灵OJP',xtl,1],['有道小图灵',xtl,1],['有道小图灵P',xtl,1],
	['有道小图灵OJ',xtl,1],['有道小图灵OJP',xtl,1],['51NOD',nod51,4],['51NODE',nod51,4]
];
function replaceAll(s,pat,rep){
	while(1){
		var prevText=s;
		s=s.replace(pat,rep);
		if(prevText==s) break;
	}
	return s;
}
function _trimAll(s){
	while(1){
		var prevText=s;
		s=s.replace(/[ #【】\[\]（）\t\.。\r\n]/,'');
		s=s.replace(/\-/,'_');
		if(prevText==s) break;
	}
	return s;
}
function trimAll(s){
	while(1){
		var prevText=s;
		s=s.replace(/[ 【】\[\]（）_\-#\t\.。\r\n]/,'');
		if(prevText==s) break;
	}
	return s;
}
function checkLeetCode(){
	const period=432000*1000;
	var now=Date.now();
	var prevTime=GM_getValue('LeetCodeTime');
	if(prevTime!=null&&now-prevTime<=period) return;
	console.log("Recrawing Leetcode.");
	GM_setValue('LeetCodeTime',now);
	GM_xmlhttpRequest({
		method:"GET",
		url:'https://leetcode.cn/api/problems/all/',
		data:'',
		headers:{ "Content-Type": "application/x-www-form-urlencoded" },
		onload:function(res){
			var resList=JSON.parse(res.response).stat_status_pairs;
			var idUrl=new Array();
			var probId;
			resList.forEach(function(e){
				probId=trimAll(e.stat.frontend_question_id);
				idUrl.push({id:probId,url:String(e.stat.question__title_slug)});
			});
			GM_setValue('LeetCodeUrl',idUrl);
		}
	});
}
function jumpAcwing(id){
	GM_xmlhttpRequest({
		method:"GET",
		url:'https://www.acwing.com/problem/search/1/?search_content='+id,
		data:'',
		headers:{ "Content-Type": "application/x-www-form-urlencoded" },
		onload:function(res){
			// let tmp=res.responseXML;
			// console.log(res);
			// console.log(tmp);
			let doc=res.responseXML;
			if(doc.querySelector('#acwing_page>div>div>div>div>div.table-responsive>table>tbody').innerText.trim()=='' ||
			   doc.querySelector('#acwing_page>div>div>div>div>div.table-responsive>table>tbody>tr:nth-child(1)>td:nth-child(2)').innerText.trim()!=id){
				return;
			}
			let list=doc.querySelector('#acwing_page>div>div>div>div>div.table-responsive>table>tbody>tr:nth-child(1)>td:nth-child(3)>a').href.split('/');
			while(list[list.length-1].length==0) list.pop();
			//console.log('ret=',list[list.length-1]);
			let url=acw+list[list.length-1]+'/';
			window.open(url);
		}
	});
}
function getZojProbId(id){
	// 使用 https://sandtripper.cn/2022/04/12/ZOJ%E9%A2%98%E5%8F%B7%E6%90%9C%E7%B4%A2/ 中的代码（作者 SandTripper），已得到原作者同意使用，非常感谢！
	// 原 ZOJ 跳题系统网址：https://sandtripper.cn/data/ZOJ_jump/ZOJ.html
	// 代码经过修改
	var num=91827363499
	num=num+id
	if(id>=3313) num=num+19; if(id>=3600) num=num+19; if(id>=1001 && id <= 2862);
	else if(id==2863) num=num+2; else if(id==2864||id==2865) num=num-1; else if(id==2867) num=91827370155; else if(id>=2868&&id<=2999) num=num-1;
	else if(id==3000) num=91827370156; else if(id>=3001&&id<=3046) num=num-2; else if(id>=3047&&id<=3055) num=num+578; else if(id>=3056&&id<=3064) num=num+654;
	else if(id>=3065&&id<=3081) num=num+792; else if(id>=3082&&id<=3089) num=num+816; else if(id>=3090&&id<=3105) num=num+869; else if(id>=3106&&id<=3112) num=num+876;
	else if(id>=3113&&id<=3121) num=num+904; else if(id>=3122&&id<=3131) num=num+916; else if(id>=3132&&id<=3148) num=num+934; else if(id>=3149&&id<=3157) num=num+971;
	else if(id>=3158&&id<=3166) num=num+1017; else if(id>=3167&&id<=3173) num=num+1032; else if(id>=3174&&id<=3182) num=num+1041; else if(id>=3182&&id<=3192) num=num+1090;
	else if(id>=3193&&id<=3201) num=num+1125; else if(id>=3202&&id<=3212) num=num+1163; else if(id>=3213&&id<=3221) num=num+1183; else if(id>=3222&&id<=3230) num=num+1213;
	else if(id>=3231&&id<=3249) num=num+1257; else if(id>=3250&&id<=3258) num=num+1284; else if(id>=3259&&id<=3267) num=num+1302; else if(id>=3268&&id<=3286) num=num+1339;
	else if(id>=3287&&id<=3295) num=num+1357; else if(id>=3295&&id<=3304) num=num+1375; else if(id>=3305&&id<=3321) num=num+1391; else if(id>=3322&&id<=3333) num=num+1406;
	else if(id>=3334&&id<=3342) num=num+1425; else if(id>=3343&&id<=3351) num=num+1452; else if(id>=3352&&id<=3361) num=num+1486; else if(id>=3362&&id<=3372) num=num+1523;
	else if(id>=3373&&id<=3388) num=num+1558; else if(id>=3389&&id<=3389) num=91827368472; else if(id>=3390&&id<=3395) num=num+1557; else if(id>=3396&&id<=3405) num=num+1589;
	else if(id>=3406&&id<=3415) num=num+1619; else if(id>=3416&&id<=3436) num=num+1665; else if(id>=3437&&id<=3445) num=num+1712; else if(id>=3446&&id<=3456) num=num+1724;
	else if(id>=3457&&id<=3466) num=num+1746; else if(id>=3467&&id<=3476) num=num+1767; else if(id>=3477&&id<=3486) num=num+1778; else if(id>=3487&&id<=3499) num=num+1804;
	else if(id>=3500&&id<=3509) num=num+1824; else if(id>=3510&&id<=3519) num=num+1846; else if(id>=3520&&id<=3528) num=num+1896; else if(id>=3529&&id<=3538) num=num+1916;
	else if(id>=3539&&id<=3548) num=num+1936; else if(id>=3549&&id<=3560) num=num+1960; else if(id>=3561&&id<=3570) num=num+1980; else if(id>=3571&&id<=3580) num=num+2003;
	else if(id>=3581&&id<=3590) num=num+2023; else if(id>=3591&&id<=3610) num=num+2065; else if(id>=3611&&id<=3621) num=num+2086; else if(id>=3622&&id<=3632) num=num+2108;
	else if(id>=3633&&id<=3643) num=num+2130; else if(id>=3644&&id<=3654) num=num+2152; else if(id>=3655&&id<=3665) num=num+2185; else if(id>=3666&&id<=3675) num=num+2205;
	else if(id>=3676&&id<=3685) num=num+2225; else if(id>=3686&&id<=3695) num=num+2245; else if(id>=3696&&id<=3704) num=num+2254; else if(id>=3705&&id<=3715) num=num+2265;
	else if(id>=3716&&id<=3725) num=num+2285; else if(id>=3726&&id<=3736) num=num+2308; else if(id>=3737&&id<=3746) num=num+2343; else if(id>=3747&&id<=3756) num=num+2384;
	else if(id>=3757&&id<=3767) num=num+2406; else if(id>=3768&&id<=3776) num=num+2424; else if(id>=3777&&id<=3786) num=num+2448; else if(id>=3788&&id<=3797) num=num+2469;
	else if(id>=3798&&id<=3818) num=num+2493; else if(id>=3819&&id<=3829) num=num+2515; else if(id>=3830&&id<=3839) num=num+2535; else if(id>=3840&&id<=3861) num=num+2555;
	else if(id>=3862&&id<=3862) num=num+2571; else if(id>=3863&&id<=3868) num=num+2563; else if(id>=3869&&id<=3947) num=num+2567; else if(id>=3948&&id<=3957) num=num+2577;
	else if(id>=3958&&id<=3977) num=num+2590; else if(id>=3978&&id<=3993) num=num+2603; else if(id>=3994&&id<=4003) num=num+2614; else if(id>=4004&&id<=4013) num=num+2674;
	else if(id>=4014&&id<=4023) num=num+2684; else if(id>=4024&&id<=4036) num=num+2697; else if(id>=4037&&id<=4046) num=num+2708; else if(id>=4047&&id<=4047) num=num+2713;
	else if(id>=4048&&id<=4048) num=num+2715; else if(id>=4049&&id<=4050) num=num+2712; else if(id>=4051&&id<=4051) num=num+2718; else if(id>=4052&&id<=4052) num=num+2716;
	else if(id>=4053&&id<=4056) num=num+2711; else if(id>=4057&&id<=4070) num=num+2713; else if(id>=4071&&id<=4080) num=num+2726; else if(id>=4081&&id<=4089) num=num+2735;
	else if(id>=4090&&id<=4099) num=num+2845; else if(id>=4100&&id<=4137) num=num+2858;
	else if(id<=4155){
		num = [
			'1204396400962764800','1204396614847094784','1204397453355581440',
			'1204397900954927104','1204398068576092160','1204398372579246080',
			'1204399129474949120','1204399353501114368','1204400054855860224',
			'1204400324847403008','1204400324964843520','1204401005234806784',
			'1204401005415161856','1204401331107069952','1204401556479606784',
			'1204401556576075776','1204401845685256192','1384062681451126784',
		][id-4138];
	}
	else if(id <= 4167) num='13840629802449797'+String((id-4156)+12); else if(id <= 4179) num='14021794256544276'+String((id-4168)+48);
	else num=0;
	return num;
}
function getLeetProbId(id){
	var result=null;
	GM_getValue('LeetCodeUrl').forEach(
		function(e){
			if(id==e.id) result=e.url;
		}
	);
	return result;
}
function isNumber(str){
	for(var i in str){
		var ascii=str.codePointAt(i);
		if(ascii<48||ascii>57) return false;
	}
	return true;
}
function isAlpha(str){
	for(var i in str){
		var ascii=str.codePointAt(i);
		if(ascii<65||ascii>90) return false;
	}
	return true;
}
function JumpById(id){
	let found=false,prefLen;
	let probId,contestId,contestNum,strUrl;
	id=id.toUpperCase();
	console.log(id);
	//console.log(id.match(/AT.*[A-Z1-9]/));
	id=_trimAll(id);
	if(id.startsWith('CODECHEF_')) id="CC_"+id.substr(9);
	else if(id.startsWith('CODECHEF')) id="CC_"+id.substr(8); 
	else if(id.startsWith('ATCODER')) id='AT_'+id.substr(7);
	else if(id.startsWith('ATCODER_')) id='AT_'+id.substr(8);
	else if(id.startsWith('ATC')&&id!="ATCODER") id='AT_'+id.substr(3);
	// if(id.startsWith('AT_')) id='AT_'+id.substr(3);
	if(id.startsWith('AT')&&isNumber(id.substr(2))) return window.open(luogu+'AT'+parseInt(id.substr(2)));
	if(isAlpha(id[id.length-1])&&id[id.length-2]=='_') id=id.substr(0,id.length-2)+id[id.length-1];
	if(id.match(/AT_.*[A-Z1-9]/)==id){
		probId=id[id.length-1].toLowerCase();
		contestId=id.substr(3,id.length-4).toLowerCase();
		if(contestId.substr(0,3)=='arc'&&parseInt(contestId.substr(3,3))<=34&&probId.match(/[a-z]/)==probId) probId=String(probId.codePointAt(0)-96);
		strUrl=replaceAll(contestId,'_','-')+'/tasks/'+contestId+'_'+probId+'/';
		//return window.open(at+contestId+'/tasks/'+contestId+'_'+probId+'/');
		return window.open(at+strUrl);
	}
	if(id.match(/CC_[A-Z1-9_]*/)==id){
		probId=id.substr(3,id.length);
		return window.open(codechef+probId);
	}
	id=trimAll(id);
	console.log('luogu=%s,id=%s',inLuogu,id);
	if(inLuogu&&id.match(/[1-9][0-9]{3,4}/)==id){
		return window.open(luogu+'P'+id);
	}
	prefixPattern.forEach(
		function(info){
			let flg=false;
			if(info.length>=4) flg=(id.length>=info[0].length+info[2]&&id.length<=info[0].length+info[3]&&id.startsWith(info[0]));
			else flg=(id.length>=info[0].length+info[2]&&id.startsWith(info[0]))
			if(flg){
				var problemUrl=id.substr(info[0].length);
				if(isNumber(problemUrl)){
					found=true;
					window.open(info[1]+problemUrl);
					return;
				}
			}
		}
	);
	if(found) return;
	if(id.match(/CF[0-9]{1,}[A-Z][0-9]?/)==id){
		probId=id[id.length-1];
		contestId='';
		if(isNumber(probId)) probId=id.substr(id.length-2);
		contestId=id.substr(2,id.length-2-probId.length);
		if(isNumber(contestId)){
			if(inLuogu) return window.open(luogu+"CF"+contestId+probId);
			else return window.open(cf+contestId+'/'+probId+'/');
			// return window.open(cf+contestId+'/'+probId+'/');
		}
	}
	if(id.match(/GYM[0-9]{1,}[A-Z][0-9]?/)==id||id.match(/CFG[0-9]{1,}[A-Z][0-9]?/)==id||id.match(/CFGYM[0-9]{1,}[A-Z][0-9]?/)==id){
		if(id.startsWith('GYM')||id.startsWith('CFG')) id=id.substr(3);
		if(id.startsWith('CFGYM')) id=id.substr(5);
		probId=id[id.length-1];
		contestId='';
		if(isNumber(probId)) probId=id.substr(id.length-2);
		contestId=id.substr(0,id.length-probId.length);
		if(isNumber(contestId)){
			return window.open(cfg+contestId+'/problem/'+probId);
		}
	}
	if(id.match(/A[BRG]C[0-9]{3,}[A-Z1-9]/)==id){
		probId=id[id.length-1].toLowerCase();
		contestId=id.substr(0,id.length-1).toLowerCase();
		contestNum=contestId.substr(3,3);
		if(contestId.substr(0,3)=='arc'&&parseInt(contestNum)<=34&&probId.match(/[a-z]/)==probId) probId=String(probId.codePointAt(0)-96);
		return window.open(at+contestId+'/tasks/'+contestId+'_'+probId+'/');
	}
	if(id.match(/ACW[1-9][0-9]*/)){jumpAcwing(id.substr(3));}
	if(id.match(/ACWING[1-9][0-9]*/)){jumpAcwing(id.substr(6));}
	if(id.match(/ZOJ[0-9]{4,}/)==id||id.match(/ZJU[0-9]{4,}/)==id) return window.open(zoj+getZojProbId(parseInt(id.substr(3))));
	if(id.match(/HYDROOJ.*/)==id) return window.open(hydro+id.substr(7));
	if(id.match(/HYDRO.*/)==id) return window.open(hydro+id.substr(5));
	if(id.startsWith('LEETCODE')||id.startsWith('LEET')||id.startsWith('LC')||id.startsWith('力扣')){
		if(id.startsWith('LEETCODE')) prefLen=8;
		else if(id.startsWith('LEET')) prefLen=4;
		else if(id.startsWith('LC')) prefLen=2;
		else if(id.startsWith('力扣')) prefLen=2;
		probId=id.substr(prefLen);
		probId=getLeetProbId(probId);
		if(probId!=null) return window.open(leet+probId);
	}
	return false;
}
function getSelText(){
	let act=document.activeElement,ret='';
	if(act===undefined || act===null) return '';
	if(act.tagName=="INPUT" || act.tagName=="TEXTAREA"){
		// console.log("is input");
		ret=act.value.substring(act.selectionStart,act.selectionEnd);
	}
	else{
		ret=window.getSelection().toString();
	}
	return ret;
}
function JumpBySelection(){
	var selText=getSelText();
	if(selText==''||selText==null) return;
	JumpById(selText);
}

var inputbox;
function InitInputBox(){
	inputbox=document.createElement('INPUT');
	inputbox.style.setProperty("position","fixed","important");
	inputbox.style.setProperty("top","0","important");
	inputbox.style.setProperty("left","0","important");
	inputbox.style.setProperty("width","100%","important");
	inputbox.style.setProperty("height","40px","important");
	inputbox.style.setProperty("background","rgba(0,60,60,0.8)","important");
	inputbox.style.setProperty("color","#ffffff","important");
	inputbox.style.fontSize="20px";
	inputbox.style.fontWeight="550";
	inputbox.style.display="none";
	inputbox.style.setProperty("z-index","999999","important");
	inputbox.style.borderWidth="medium";
	inputbox.style.borderColor="cyan";
	// inputbox.style.transform="translateY(-50px)";
	// inputbox.style.transition="0.1s";
	inputbox.title="强力 OI/ACM 跳题器 Super Problem Jumper";
	inputbox.onkeypress=function(event){
		if(event.which===13){
			JumpById(this.value);
		}
	}
	// console.log(inputbox);
	document.body.appendChild(inputbox);
}
function ToggleInputBox(){
	if(inputbox.style.display=="none"){
	//if(inputbox.style.transform!="translateY(0px)"){
		inputbox.style.display="block";
		inputbox.style.transform="translateY(0px)";
		inputbox.focus();
	}
	else{
		inputbox.style.display="none";
		inputbox.style.transform="translateY(-50px)";
	}
}

(function(){
	console.log("OI/ACM Problem Jumper is running.");
	'use strict';
	checkLeetCode();
	InitInputBox();
	if(location.href.startsWith('https://www.luogu.com.cn/')||location.href.startsWith('https://www.luogu.com/')) inLuogu=true;
	else inLuogu=false;
	if(location.href.startsWith('https://www.luogu.com.cn/problem/UVA')) inLuoguUva=true;
	else inLuoguUva=false;
	document.ondblclick=function(){
		JumpBySelection();
	};
	document.onreadystatechange=function(){
		function replaceBzoj(){
			if(document.readyState!='complete') return;
			var linksBzoj=document.getElementsByTagName('A');
			for(var i=0;i<linksBzoj.length;i++){
				var e=linksBzoj[i];
				if(e.href.startsWith(lydsy)) e.href=dbzoj+e.href.substr(lydsy.length);
				if(e.href.startsWith(lydsys)) e.href=dbzoj+e.href.substr(lydsys.length);
			}
		}
		replaceBzoj();
		setTimeout(
			replaceBzoj,1000
		);
		setTimeout(
			function(){
				if(inLuoguUva){
					var domInfoRows=document.getElementsByClassName('info-rows');
					domInfoRows=domInfoRows[0];
					domInfoRows.innerHTML+='<div data-v-8b7f80ba=""><span data-v-8b7f80ba=""><span data-v-52a98731="" data-v-8b7f80ba="">调试</span></span><span data-v-8b7f80ba=""><a data-v-0640126c="" data-v-52a98731="" href="https://www.udebug.com/UVa/'+window.location.href.substr('https://www.luogu.com.cn/problem/UVA'.length)+'" class="color-default" style="text-decoration: none;"><span data-v-52a98731="">uDebug</span></a></span></div>';
				}
			},1000
		);
	}

	document.addEventListener("keydown",keye=>{
		// console.log(keye);
		if(keye.code=='KeyJ'&&keye.ctrlKey&&keye.shiftKey) JumpBySelection();
		else if(keye.code=='KeyJ'&&keye.ctrlKey&&keye.shiftKey&&keye.altKey) JumpBySelection();
		else if(keye.code=='KeyG'&&keye.ctrlKey&&keye.shiftKey) JumpBySelection();
		else if(keye.code=='KeyM'&&keye.ctrlKey&&keye.shiftKey) JumpBySelection();
		else if(keye.code=='KeyV'&&keye.ctrlKey&&keye.shiftKey) JumpBySelection();
		else if(keye.code=='KeyL'&&keye.ctrlKey&&keye.shiftKey) JumpBySelection();
		else if(keye.code=='KeyJ'&&keye.ctrlKey&&keye.altKey&&!keye.shiftKey){
			let sel=getSelText();
			console.log('sel=',sel);
			if(sel!=''&&inputbox.style.display=='none'){
				inputbox.value=sel;
			}
			ToggleInputBox();
		}
		/*else{
			console.log(keye.code=='KeyJ',keye.ctrlKey,keye.altKey);
		}*/
	});
})();
