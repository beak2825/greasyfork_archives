// ==UserScript==
// @name           jc_qidian_prefetch_page
// @namespace      http://localhost/jc/
// @require	   https://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.11.1.min.js
// @include        http://*.qidian.com/*
// @description    Prefetch chinese novell site (起點)
// @description    Can use Hotkey to Next Page : right arrow == n == 0 in right area == Insert == Delete
// @description    沒試過-->有儲點的用戶讀到需付款的頁面是否會自動扣款，有疑慮者建議不使用...
// @grant          GM_log
// @modified_time  2014.09.18.22.00
// @version        1.5
// @downloadURL https://update.greasyfork.org/scripts/3683/jc_qidian_prefetch_page.user.js
// @updateURL https://update.greasyfork.org/scripts/3683/jc_qidian_prefetch_page.meta.js
// ==/UserScript==


// 預抓下一頁
// 關鍵 a[contains(.,'下一頁')]

(function() {

var G_prefetch_url = ''; // 預抓的網址

function search(target,sel) {
   return target.evaluate(
				sel,
				target,
				null,
				XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
				null
		);
}

function position(elmt){
  var x = 0;
  var y = 0;
              
  while(elmt != null){
    x += elmt.offsetLeft;
    y += elmt.offsetTop;
    elmt = elmt.offsetParent;
  } // while
                        		      
    return {'x':x,'y':y};
}

function scrollTo(elmt){
    var pos = position(elmt)
    //GM_log('x:'+pos.x+', y:'+pos.y)
    window.scrollTo(pos.x, pos.y);
}

var myif; 
var next; 
var nhref;

function clickNext(event) {
    //var n_main = myif.contentDocument.getElementById('Main')
    //var mainDivId_1 = 'form1'; // for before 2015-11
	var mainDivId_1 = 'wrapbig'; // for after 2015-11
    
    var mainDivId = mainDivId_1;
    var n_main = myif.contentDocument.getElementById( mainDivId );
    if (!n_main) {
				GM_log('1. iframe n_main not found');
				return;
		}
    
    // GM_log('n_main found')
    var main = document.getElementById( mainDivId ); // TODO: check if 'main' fully loaded?
    
    if (!main) {
				GM_log('2. n_main not found');
				return;
		}
    
    
    // GM_log('main found')
    main.innerHTML = n_main.innerHTML;
    //main.parentNode.replaceChild(n_main,main)
    
    //GM_log(history.current)
    //history.current = nhref;
    scrollTo(main);
    
    // prefetch again   
    prefetch();
    
    // change location URL
    GM_log('G_prefetch_url = ' + G_prefetch_url + '  ,  location.href = ' + location.href);
    if ((''!=G_prefetch_url) && (G_prefetch_url != location.href)) {
      history.pushState({url: G_prefetch_url, url2: location.href}, null, G_prefetch_url);   // 改變網址但不會重新載入內容
    } 
      
    if (event.stopPropagation) {
      event.stopPropagation();
    }
    if (event.cancelable && event.preventDefault) {
				event.preventDefault();
		}
}

function checkKey(event) { 
	
	//alert(event.keyCode)
	if (event.keyCode == 39) { clickNext(next); }		// right arrow
	if (event.keyCode == 78) { clickNext(next); }		// n
	if (event.keyCode == 96) { clickNext(next); }		// 0 in right area
	if (event.keyCode == 45) { clickNext(next); }		// Insert
	if (event.keyCode == 46) { clickNext(next); }		// Delete
	
}

function prefetch() {
    // var links = search(document,"//a[@class='Next']")
    //var links = search(document,"//a[contains(.,'下一章')]")
		
	
    var links = search(document,"//a[@id='NextLink']");
	
	if (links.snapshotLength ==0) {
		links = search(document,"//a[@id='pageNextBottomBtn']");	// for 2015 新版
	}
    
   	if (links.snapshotLength ==0) {
				GM_log('links.snapshotLength == 0 , exit');
				return;
		}
   
    next = links.snapshotItem(0);

    nhref = next.getAttribute('href');
		GM_log('1. myif typeof == ' + typeof myif);
    if (myif) {
			myif.parentNode.removeChild(myif); 
			myif=undefined;
		}
		
		GM_log('2. myif typeof == ' + typeof myif);
    if (!myif) {
        myif = document.createElement('iframe')
        //myif.style.display='none'
        myif.style.visibility = 'hidden'
        myif.style.width='1px';
        myif.style.height='1px';
        
        
        document.body.appendChild(myif);
        myif.contentWindow.addEventListener('DOMContentLoaded',function(){
            //GM_log('iframe content loaded')
            if (next) {
                next.style.color='#ff0084';
                next.addEventListener('click', clickNext ,true);
                document.addEventListener('keydown', checkKey ,true);
            }
            
            var links_test = search(document,"//a[@id='NextLink']");
			
			if (links_test.snapshotLength ==0) {
				links_test = search(document,"//a[@id='pageNextBottomBtn']");	// for 2015 新版
			}
			
            if (links_test.snapshotLength == 0) {
            	//alert('Cannot fetch Next page , retry....');
              GM_log('Cannot fetch Next page , retry....');
            	myif.removeNode(true);
            	prefetch();
            }
            
        },false);
    }    
    
    myif.setAttribute('src', nhref);
    
    G_prefetch_url = nhref;
}

function onLoad() {   
	
    if (window != top) return;  // avoid creating infinitely deep nested frames        
		
    prefetch();
}

window.addEventListener('load', function() { 
									onLoad(); 
							}, true);
              
window.addEventListener('popstate' , function(event) {
                alert("location: " + document.location + ", state: " + JSON.stringify(event.state));
                //History.back();
            }, true);

})();





