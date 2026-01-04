// ==UserScript==
// @name         GFOJ Better
// @namespace    http://tampermonkey.net/
// @version      2024.2.28.1
// @description  Make GFOJ Better
// @author       sinsop900
// @match        http://www.gdfzoj.com:23380/contest/*/standings
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488397/GFOJ%20Better.user.js
// @updateURL https://update.greasyfork.org/scripts/488397/GFOJ%20Better.meta.js
// ==/UserScript==
function getColOfRating(rating) {
	if (rating < 1500) {
		var H = 300 - (1500 - 850) * 300 / 1650, S = 30 + (1500 - 850) * 70 / 1650, V = 50 + (1500 - 850) * 50 / 1650;
		if (rating < 300) rating = 300;
		var k = (rating - 300) / 1200;
		return ColorConverter.toStr(ColorConverter.toRGB(new HSV(H + (300 - H) * (1 - k), 30 + (S - 30) * k, 50 + (V - 50) * k)));
	}
	if (rating > 2500) {
		rating = 2500;
	}
	return ColorConverter.toStr(ColorConverter.toRGB(new HSV(300 - (rating - 850) * 300 / 1650, 30 + (rating - 850) * 70 / 1650, 50 + (rating - 850) * 50 / 1650)));
}
function calcPredictedRatingChanges(rating, stand, K = 200){
    var delta = 500;
    var n = rating.length;
    var i, j;
    var rank = [];
    var foot = [];
    for(i = 0; i < n; ){
        j = i;
        while (j + 1 < n && stand[j + 1] == stand[i]) {
        	++j;
        }
        var our_rk = 0.5 * (i + j + 2);
        while(i <= j){
            rank.push(our_rk);
            foot.push(n - rank[i]);
            i ++;
        }
    }
    var weight = [];
    for(i = 0; i < n; i ++)
        weight.push(Math.pow(7, rating[i] / delta));
    var exp = [];
    for(i = 0; i < n; i ++)
        exp.push(0);
    for(i = 0; i < n; i ++)
        for(j = 0; j < n; j ++)
            if(j != i)
                exp[i] += weight[i] / (weight[i] + weight[j]);
    var new_rating = [];
    for(i = 0; i < n; i ++)
        new_rating.push(rating[i] + Math.ceil(K * (foot[i] - exp[i]) / (n - 1)));
    if (K == 1000) {
    	for (i = 0; i < n; ++i) {
    		j = i;
    		while (j + 1 < n && stand[j + 1] == stand[i]) {
    			++j;
    		}
    		var avg = 0;
    		for (let k = i; k <= j; ++k) {
    			avg += new_rating[k];
    		}
    		avg /= (j - i + 1);
    		for (let k = i; k <= j; ++k) {
    			new_rating[k] = Math.ceil(avg);
    		}
    		i = j;
    	}
    }
    return new_rating;
}
function calcperf(rating, stand) {
	var perf = [], n = rating.length;
	for (let i = 0; i < n; ++i) {
		let xx = JSON.parse(JSON.stringify(rating));
		for (let _ = 0; _ < 1000; ++_) {
			let zz = JSON.parse(JSON.stringify(xx));
			let yy = calcPredictedRatingChanges(xx, stand, 1500);
			let t = yy[i] + 1 - 1;
			xx = JSON.parse(JSON.stringify(zz));
			xx[i] = t;
		}
		// for (let j = 0; j < n; ++j) {
			// console.log(xx[j]);
		// }
		// console.log("==");
		perf[i] = xx[i];
	}
	if (n == 1) {
		perf[0] = rating[0];
	} else {
		if (stand[0] != stand[1]) {
			perf[0] = 10000000;
		}
		if (stand[n - 1] != stand[n - 2]) {
			perf[n - 1] = -10000000;
		}
		for (let i = 0, j = 0; i < n; i = (++j)) {
			while (j + 1 < n && stand[j + 1] == stand[i]) {
				++j;
			}
			var avg = 0;
			for (let k = i; k <= j; ++k) {
				avg += perf[k];
			}
			avg /= (j - i + 1);
			for (let k = i; k <= j; ++k) {
				perf[k] = Math.ceil(avg);
			}
		}
	}
	return perf;
}
(function() {
    let JS_TO_ARRAY=(scriptContent)=>{
        let startIndex=scriptContent.indexOf("[[");
        let endIndex=scriptContent.lastIndexOf("]]");
        let arrayContent=scriptContent.substring(startIndex+2,endIndex);
        let rows=arrayContent.split("],[").map(row => row.replace("[", "").replace("]", "").split(",").map(item => item.trim()));
        return rows.map(row => row.map(item => {
            if (item.startsWith("'") && item.endsWith("'")){
                return item.slice(1, -1);
            }else{
                return parseInt(item);
            }
        }));
    };
    let CrawPages=(url)=>{
        return new Promise((resolve,reject)=>{
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: function(response){
                    resolve(response.responseText);
                },
                onerror: function(error){
                    reject(error);
                }
            });
        });
    };
    async function check_update(){
        let Page=await CrawPages(url);
        let parser=new DOMParser(),doc=parser.parseFromString(Page,'text/html');
    }
    async function solve(){
        GM_setValue(0,0);
        if(!GM_getValue(0))
        {
            let list=GM_listValues();
            for(let i=0;i<list.length;i++) GM_deleteValue(list[i]);
            GM_setValue(0,1);
        }
        let ContestURL=window.location.href;
        let ContestName=0;
        for(let i=ContestURL.length-11,tmp=1;!isNaN(parseInt(ContestURL[i]));i--,tmp*=10)
        {
            ContestName+=tmp*parseInt(ContestURL[i]);
        }
        let row=document.querySelector("#standings-table > tbody").children;
        var rat = [], ratt = [], pag = [], stand = [];
        for(let i=0;i<row.length;i++){
        	console.log(stand[i]);
            let people=row[i].querySelector('.uoj-username'),url=people.getAttribute('href');
            let Page=await CrawPages(url);
            pag.push(Page);
            let parser=new DOMParser(),doc=parser.parseFromString(Page,'text/html');
            const scriptTags = doc.querySelectorAll('script[type="text/javascript"]');
            scriptTags.forEach(script => {
                let scriptContent = script.textContent;
                let regex = /var rating_data =*/;
                let match = scriptContent.match(regex);
                // console.log(match);
                if (match){
                    let rating=JS_TO_ARRAY(scriptContent),flag=0;
                    let nw=row[i].children[1].cloneNode(true),x=nw.children[0];
                    for(let j=rating.length-1;j>=0;j--){
                        if(rating[j][2] == ContestName){
                        	let x = rating[j][1] - rating[j][5];
                            rat.push(x);
                            ratt.push(x);
                            stand.push(row[i].children[0].textContent);
                            break;
                        }
                    }
                }
            });
        }
        let head=document.createElement('th');head.textContent='预测 rating 变幅';head.style.width='8em';
        document.querySelector("#standings-table > thead > tr").appendChild(head);
        var cnt = 0;
        rat = calcPredictedRatingChanges(rat, stand);
        ratt = calcperf(ratt, stand);
        for(let i=0;i<row.length;i++){
            if(GM_getValue(ContestName+':user'+i))
            {
                let nw=row[i].children[1].cloneNode(true),x=nw.children[0];
                x.textContent=GM_getValue(ContestName+':user'+i);
                row[i].appendChild(nw);continue;
            }
            let people=row[i].querySelector('.uoj-username'),url=people.getAttribute('href');
            let Page = pag[i];
            let parser=new DOMParser(),doc=parser.parseFromString(Page,'text/html');
            const scriptTags = doc.querySelectorAll('script[type="text/javascript"]');
            scriptTags.forEach(script => {
                let scriptContent = script.textContent;
                let regex = /var rating_data =*/;
                let match = scriptContent.match(regex);
                console.log(match);
                if (match){
                    let rating=JS_TO_ARRAY(scriptContent),flag=0;
                    let nw=row[i].children[1].cloneNode(true),x=nw.children[0];
                    let t1 = x.cloneNode(true), t2 = x.cloneNode(true);
                    t1.style.color = '#000000';
                    t1.style.fontWeight = '';
                    t1.className = '';
                    for(let j=rating.length-1;j>=0;j--){
                        if(rating[j][2] == ContestName){
                        	let xx = rating[j][1] - rating[j][5], yy = rat[cnt++];
                            let tmp='';
                            if(yy>xx) tmp='+'
                            t2.style.color = getColOfRating(yy);
                            let str=xx+' -> '+yy+'\n('+tmp+(yy - xx)+')';
                            x.textContent=xx;
                            t1.textContent = ' -> ';
                            t2.textContent = yy+'\n('+tmp+(yy - xx)+')';
                            GM_setValue(ContestName+':user'+i,str);
                            flag=1;break;
                        }
                    }
                    if(!flag){x.textContent='未参加比赛'; t1.textContent = t2.textContent = '';}
                    nw.appendChild(t1);
                    nw.appendChild(t2);
                    row[i].appendChild(nw);
                }
            });
        }


        GM_setValue(0,0);
        if(!GM_getValue(0))
        {
            let list=GM_listValues();
            for(let i=0;i<list.length;i++) GM_deleteValue(list[i]);
            GM_setValue(0,1);
        }
         ContestURL=window.location.href;
         ContestName=0;
        for(let i=ContestURL.length-11,tmp=1;!isNaN(parseInt(ContestURL[i]));i--,tmp*=10)
        {
            ContestName+=tmp*parseInt(ContestURL[i]);
        }
         row=document.querySelector("#standings-table > tbody").children;
         head=document.createElement('th');head.textContent='perf';head.style.width='8em';
        document.querySelector("#standings-table > thead > tr").appendChild(head);
         cnt = 0;
        for(let i=0;i<row.length;i++){
            if(GM_getValue(ContestName+':user'+i))
            {
                let nw=row[i].children[1].cloneNode(true),x=nw.children[0];
                x.textContent=GM_getValue(ContestName+':user'+i);
                row[i].appendChild(nw);continue;
            }
            let people=row[i].querySelector('.uoj-username'),url=people.getAttribute('href');
            let Page=pag[i];
            let parser=new DOMParser(),doc=parser.parseFromString(Page,'text/html');
            const scriptTags = doc.querySelectorAll('script[type="text/javascript"]');
            scriptTags.forEach(script => {
                let scriptContent = script.textContent;
                let regex = /var rating_data =*/;
                let match = scriptContent.match(regex);
                console.log(match);
                if (match){
                    let rating=JS_TO_ARRAY(scriptContent),flag=0;
                    let nw=row[i].children[1].cloneNode(true),x=nw.children[0];
                    for(let j=rating.length-1;j>=0;j--){
                        if(rating[j][2] == ContestName){
                            let tmp='';
                            if(rating[j][5]>0) tmp='+'
                            console.log(rating[j][1] - rating[j][5]);
                            let str=ratt[cnt];
                            if (ratt[cnt] > 10000) {
                            	str = "+∞";
                            } else if (ratt[cnt] < 0) {
                            	str = "-∞";
                            }
                            x.textContent=str;
                            GM_setValue(ContestName+':user'+i,str);
                            flag=1;break;
                        }
                    }
                    if(!flag){x.textContent='未参加比赛';}
                    else {
                    	nw.children[0].style.color = getColOfRating(ratt[cnt++]);
                    }
                    row[i].appendChild(nw);
                }
            });
        }
    }
    window.addEventListener('load',function(){
        console.log('加载完成');
        solve();
    });
})();

