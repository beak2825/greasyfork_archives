// ==UserScript==
// @name         MDA library
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  my JS library
// @author       mr-d-r
// ==/UserScript==


// @require  file://D:\...\_MDAlib_tampermonkey.js ВСЕГДА добавляет в самое начало скрипта, где он использован
// т.о. переменные объявленные здесь всегда глобальные !!!

// try to make global functions as in https://stackoverflow.com/questions/27680230/how-do-i-make-functions-added-by-tampermonkey-be-available-in-console-after-the
// пробовать делать библиотеку, которая запускается на каждой странице

var MDAlib="included",  dbg;  // real global vars !!!  // dbg - отладка    // verb - немного расширенные сообщения
// localStorage.setItem("MDAlib", "loaded @"  +Date.now());

	// !!! в скриптах можно проверять так:
    //  MDAlib=${(typeof MDAlib == "undefined") ? "absent" : MDAlib}
	// 	if(typeof MDAlib  == 'undefined') 	console.log("MDAlib 1212 is NOT defined in _MDAlib_tampermonkey");  	else console.log("MDAlib 1212 DEFINED in _MDAlib_tampermonkey = " +MDAlib);
	// 	if(typeof dbg  == 'undefined') 		console.log("dbg 1212 is NOT defined in _MDAlib_tampermonkey");  		else console.log("dbg 1212 DEFINED in _MDAlib_tampermonkey = " +dbg);
// !!! пользовать tampermonkey storage для persistent vars и обмена между скриптами !!!

// TRY !!! from https://greasyfork.org/en/scripts/14782-facebook-event-exporter/code
/* 
var	err = console.error.bind(console),
	log = console.log.bind(console),
*/

	function anyActiveInput () {
		if( Array.from(document.querySelectorAll("input,textarea")).includes(document.activeElement) ) 	return true;
		if( document.activeElement.contentEditable == 'true' )							return true; 	// for stupid youtube reply mini-window  // !!! warning:  MUST BE: document.activeElement.contentEditable == true
		if( document.activeElement.querySelector('span[data-lexical-text="true"]') ) 	return true; 	// for stupid facebook input fields
		//if ((aaBB = document.activeElement) && (editable(a) || (a.tagName === "INPUT") || (a.tagName === "TEXTAREA"))) return;
	} // anyActiveInput()


    function ttout (delay, func) {  // wrap for setTimeout()  // WORKS
        setTimeout(() => { 		func();		}, delay);
    } // ttout()
    var  tTO=ttout;


    function ttoutSMART (delay=1000, label, cmd='new', func) {  // wrap for setTimeout()  // static массив всех вызванных таймеров с метками
        let a, b, hnd, min=10000, max=99999,   fn=fnName();
        if ( typeof ttout.arr == 'undefined' ) {    ttout.arr = [];  if(dbg && dbg>5) log(`${fn}: static arr init`); }
        if( ! isNumber(delay) ) {  console.error(`${fn}: delay is not a number: ${delay}`);   return;  }  // isNumeric:function(a){return!isNaN(parseFloat(a))&&isFinite(a)
        switch (cmd) {
            case 'chk':     case 'exists':      case 'exist':
                            if(  a=ttout.arr.find( (el) => el.label == label )  )   return a;  // a.hnd
                            else                                                    return false;
                            break;
            case 'list':    showArrQvTyIk();
                            break;
            case 'del':     // delete by label from array
            case 'delete':  delQvTyIk(label);
                            break;
            default:        // create new or update existing
            case 'new':
            case 'set':     if( !label ) label=`lbl_${Math.floor(Math.random() * (max - min + 1)) + min}`;  // если label пуста, то сгенерировать случайную !!!
                            delQvTyIk(label);  // ищет в массиве существующий таймер, делает ему clear и удаляет его из массива
                            //log(`creating new: ${label}`);
                            hnd=setTimeout(() => { 		func();		}, delay);
                            b=setTimeout(()=>{  //log(`deleting on TIMEOUT ${label}`);
                                                delQvTyIk(label);              		}, delay+3);  // по истечении таймера удалить его из массива !!!
                            ttout.arr.push( { label: label,  hnd: hnd,  hnd2: b,  delay: delay } );
                            break;
        } // switch
    
        function showArrQvTyIk() {   for( let i in ttout.arr )  log(ttout.arr[i]);   console.log('---');    }
        function delQvTyIk(ll)   {   let a=ttout.arr.findIndex( (el) => el.label == ll );
                                     // log(`${fn}: deleting ${ll} at ${a}`);
                                     if(a>=0) {   clearTimeout(ttout.arr[a].hnd);
                                                  clearTimeout(ttout.arr[a].hnd2);
                                                  ttout.arr.splice(a, 1);           } // splice here deletes the element!!!
        }
    } // ttoutSMART()
    var  tTS=ttoutSMART;



    function showMSGsimple (msg, duration, hook, styl)  { 	// one line showmsg ()	// - hook in querySelector form, i.e. "#smth" or "div[id='smth']"
    //  looks GOOD and debugged
        let aa, mydiv, pareFou, fn=fnName();									// - if msg="" - then mydiv will be removed
        let mydivBase="showMSGsimple",   mydivTitle="sshowMSGsimple_title";		// - is styl starts with + then add style,  if no + then replace mydiv.style
        if( !duration )             duration=2000_000;              // НЕ переносить в декларацию (... , duration, ...)
        if( !hook )                 hook=document.body;             // НЕ переносить в декларацию (... , hook, ...)
        if( hook!=document.body ) 	pareFou=document.querySelector(hook);
		else					    pareFou=document.body;	                    // log(fn +": hook= ", hook, "\n", "pareFou= ", pareFou);
		if(  !pareFou  ) {	    log(fn +": hook is not found");  	return; 	}
		aa=pareFou.querySelector('#' +mydivBase);
        if(aa)	{	mydiv = aa;		if(!msg)  { aa?.remove(); 	return;	}
		} else	{ 	if(!msg)  		return;  									// if (msg="" или undefined)
					mydiv = document.createElement("div");                      if(dbg && dbg>5) log(fn +": append child  hook= ", hook, "\n", "pareFou= ", pareFou);
					pareFou.insertBefore(mydiv, pareFou.firstChild); //pareFou.appendChild(mydiv);     // pareFou.insertBefore(mydiv, pareFou.firstChild);
		}
        mydiv.innerHTML = msg;      // mydiv.style.zIndex=100; 					// border: solid 5px Red;
        mydiv.id=mydivBase;		    mydiv.title=mydivTitle; 	// mydiv.style.position="absolute";
		if(styl)    if( styl.startsWith("+") )	mydiv.style.cssText	= `${mydiv.style.cssText} ${styl.replace(/^\+/,'')}`;	// trim '+' & add ещ styles
				    else 						mydiv.style.cssText	=  styl; 		// replace style
        setTimeout(() => {  if(dbg && dbg>5)  log(fn +" removing", mydiv);      mydiv?.parentNode?.removeChild(mydiv);  }, duration);
    }  // end of showMSGsimple()


	async function mySaveAs (fname, url, opt1 )  {  // WORKS FINE  // usage: (async() => {	ww=await mySaveAs("filename", "http://abc", '');	})();
		if(!opt1) opt1={ suggestedName: fname,  types: [      {	description: 'Images',		accept: {    'image/*': ['.png', '.gif', '.jpeg', '.jpg']      }	},    ],  };
		if(dbg) log("mySaveAs(): " +fname, url, opt1, "---");
		// если с opt1 что-то не то, window.showSaveFilePicker молча обламывается
		var fhnd = await window.showSaveFilePicker(opt1);	if (!fhnd) 	{ 	log("mySaveAs(): showSaveFilePicker() failed"); return null; 	}
  		var wr = await fhnd.createWritable();  				if (!wr) 	{ 	log("mySaveAs(): createWritable() failed"); 	return null; 	} 	// Create a FileSystemWritableFileStream to write to.
  		var re = await fetch(url); 							if (!re) 	{ 	log("mySaveAs(): fetch()"); 					return null; 	} 	// Make an HTTP request for the contents.
  		await re.body.pipeTo(wr);																												// Stream the response into the file.   // pipeTo() closes the destination pipe by default, no need to close it.
	}


//console.log(DOMRegex(/^service\//)); // your regex here
function DOMRegex(regex) {  // try as function and as prototype
    let output = [];
    for (let i of document.querySelectorAll('*')) {
        if (regex.test(i.type)) { // or whatever attribute you want to search
            output.push(i);
        }
    }
    return output;
}

//getAllTagMatches(/^di/i); // Returns an array of all elements that begin with "di", eg "div"
function getAllTagMatches(regEx) {
  return Array.prototype.slice.call(document.querySelectorAll('*')).filter(function (el) { 
    return el.tagName.match(regEx);
  });
}

	function showmsg578 (msg, duration)  {
	    var dbg=9, fn="showmsg578";           let mydivBase="showmsg",   mydivTitle="showmsgCOMMONtitle";   //,   myDivN=mydivBase;
            let parents=[ mydivBase,  "styles_photo__",  "body" ];  // 'body' must be ALWAYS present !!!
            let pareFou=0,     mydiv,    aa="n/a",  bb="n/a",   ddd1,   ddd2;
 	    for (let x=0;x<2;x++) {
			for (let i of parents) {    pareFou=document.querySelector(i);   					if(pareFou != null)  { aa=i; break; }
						// потом допилить еще блее красивый поиск
										pareFou=document.querySelector(`[class*="${i}"]`); 		if(pareFou != null)  { aa=i; break; }
										pareFou=document.getElementById(i); 					if(pareFou != null)  { aa=i; break; }   }; 	if(dbg>5) log(`${fn}():  ${msg}`, `   found parent ${aa} pareFou=`, pareFou);
			if (!pareFou) { console.log("showmsg(): can NOT add child to HTML");  return 11; }
			if (pareFou.id != mydivBase) { 													if(dbg>5) log(`${fn}(): creating the anchor DIV !!!: `, aa);
				mydiv = document.createElement("div");   mydiv.id=mydivBase;  	mydiv.style.position="absolute";   mydiv.title=mydivTitle + "_anchor";
				bb=pareFou.insertAdjacentElement("afterbegin", mydiv);  // new way to appendChild !!! https://www.w3schools.com/jsref/met_node_insertadjacentelement.asp        https://stackoverflow.com/questions/2007357/how-to-set-dom-element-as-first-child
			}
		} // for x

        mydiv = document.createElement("div"); 		mydiv.id=mydivBase + Math.floor(Math.random() * 10000); 	mydiv.style.position="relative";
	mydiv.setAttribute("style",`width:auto; height:auto; top:10%; left:5%;  padding: 10px;  color:Silver; font-size:15px; background-color:#00008B; z-index:99;`); //	opacity:0.9;   text-shadow: 5px 5px 20px #00FF00;`);
        mydiv.innerHTML = `<h2> ${msg} </h2>`;     		            // border: solid 5px Red;
	bb=pareFou.appendChild(mydiv); 								if(dbg>5) log(`${fn}():  ---- new DIV=|${mydiv.id}|`, mydiv.id);
        setTimeout(function() { 	if(pareFou!=null) mydiv.parentNode.removeChild(mydiv); 		}, duration);

        if(dbg>5) {		log(`${fn}():  ${mydiv.id} appended to ${aa}  rc=${bb} <===`);
        				ddd1 = document.querySelector(mydiv.id);   ddd2 = document.getElementById(mydiv.id); 	log(`${fn}():  check ${mydiv.id} getElementById=${ddd1}  querySelector=${ddd2}`);  } //  !!!!!!  и querySelector и getElementById глючат и часто показывают null
        return
	}  // end of showmsg()



    function WLH () {    let aa=window.location.href;   if (aa.match(/accounts.youtube/))   return "accounts.yotube";
                                                        return aa.replace(/http.*\/\/(www.)*(.*)\?.*/g,'$2');
    }

    var       fnName  = getFunctionsNameThatCalledThisFunction;  // get name of currently executing function       //function           gFNTCTF() { return gFNTCTF.caller.name;  }
    function            getFunctionsNameThatCalledThisFunction() { return getFunctionsNameThatCalledThisFunction.caller.name;  }

    var log = console.log;
    //var originalLogger  = console.log;
//    var log = function() { for (var i of arguments)   originalLogger(i);  }   // писать одним аргументом, чтобы вывод был в пределах одного сообщения в логе !!! \n отрабатыват отлично!  log("1\n2", "3");

    function sleepSYNC (millis)  {  // BLOCK execution of others threads!!!  ex.pausecomp
       // выполнять блоками по 100-200 мс, чтобы не ставила все раком
       let date = new Date(), curDate = null;   do { curDate = new Date(); }
                                                while(curDate-date < millis);
    }

    function sleepASYNC (ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    const repeatedGreetings = async () => {   // one more sleep ASYNC - WORKS !!!
      console.log("First");        await sleepASYNC(1000)
      console.log("Second");       await sleepASYNC(1000)
      console.log("Third");        await sleepASYNC(1000)
    } // repeatedGreetings()


//    function sleepQW (durat) {    setTimeout(function(){  log("sleepQW()");  },durat);    }


    let mySleepInterim = (g) => (...args) => {      let f, res = () => f.next(),        sleep = (ms) => setTimeout(res, ms);    f = g.apply({sleep}, args); f.next();  };
    let mySleepExample = mySleepInterim(function*() {   // https://developer.mozilla.org/ru/docs/Learn/JavaScript/Asynchronous/Promises
        let sl=1200,  cnt;   let {sleep} = this;        // !!! РІ РїРµСЃРѕС‡РЅРёС†Рµ СЂР°Р±РѕС‚Р°Р»Рѕ С…РѕСЂРѕС€Рѕ
        console.log("Sleeping");     yield sleep(sl);
        console.log("stage2");       yield sleep(sl);
        console.log("stage3");       yield sleep(sl);
        console.log("Done");
    });
    //mySleepExample();  // run step by step with delays // ВРОДЕ РАБОТАЕТ и НЕ жрет проц


    function vsc_font(fntsz="") {  // change of Video Speed Controller (VSC) font size
            //document.querySelector(".vsc-controller").shadowRoot.styleSheets[0].rules[0].styleSheet.cssRules[0].style.fontSize = '25px';
            let font1=document.querySelector(".vsc-controller");
            if (fntsz == "")     return font1?.shadowRoot?.styleSheets[0]?.rules[0]?.styleSheet?.cssRules[0]?.style?.fontSize;
            if (font1?.shadowRoot?.styleSheets[0]?.rules[0]?.styleSheet?.cssRules[0]?.style?.fontSize) {
                document.querySelector(".vsc-controller").shadowRoot.styleSheets[0].rules[0].styleSheet.cssRules[0].style.fontSize = fntsz;
                if (dbg) console.log("vsc_font(): change " + font1?.shadowRoot?.styleSheets[0]?.rules[0]?.styleSheet?.cssRules[0]?.style?.fontSize + " -> " +fntsz);
                return fntsz;
            }
            else console.error("vsc_font(): .vsc-controller....cssRules[0].style.fontSize is not found")
            return 0;
    }


//   fu nc tion waitElement(ele) {  // rc=1 - FOUND


    function qS  (query, elem=document) {     return elem.querySelector(query);		}  // WORKS
    //function qSA (que, elem=document) {     return elem.querySelectorALL(que); 	}  // FAILs если в que перечислены несколько критериев

    function   queryElement(ele, doc=document) { // еще доделать, чтобы сначала искать указанный doc, а потом в нем искать ele
                    let aaa=doс?.querySelector(ele);      if(dbg>5) log("getEl(): " + aaa);      return aaa;
    }
    //const      qS            = queryElement;
    //const      qSA           = document.querySelectorAll; // FAILs
    //var	    qs = document.querySelector.bind(document),
	var         qSA = document.querySelectorAll.bind(document);  // WORKS
    const       getEl         = queryElement;
    const       queryEl       = queryElement; // !!! see also https://stackoverflow.com/questions/13383886/making-a-short-alias-for-document-queryselectorall

    function deleteElement (ele) {
           let aaa=document.querySelector(ele);    if(aaa) aaa.remove();    if(dbg && dbg>=5) console.log("deleteElement(" +ele+ "): ", aaa);
    }



    function showmsg (msg, duration=2000, styl="", paren='n/a')  {   // ``` ёёё
        let mydivBase="showmsg",   mydivTitle="showmsgCOMMONtitle";   //,   myDivN=mydivBase;
        let sL1="n/a";      // static label
//      let parents=[   mydivBase,   "#player",    "body > div.container-fluid.inner-pages-banner > div",    "body > div.ribbon-container > div",  "body > header > div.container.less-margin",    "body > div.container-fluid.inner-pages-banner > div"];
//        let parents=[   mydivBase,   "body > div.mfp-wrap.mfp-gallery.mfp-close-btn-in.mfp-auto-cursor.mfp-fade.mfp-ready > div",                     "#player",              "body > div.container-fluid.inner-pages-banner > div",    "body > div.ribbon-container > div",  "body > header > div.container.less-margin",    "body > div.container-fluid.inner-pages-banner > div"];
// терпимо, но когда картинка на весь экран, то showmsg не видно  "body > div.mfp-wrap.mfp-gallery.mfp-close-btn-in.mfp-auto-cursor.mfp-fade.mfp-ready > div"

        let parents=[   mydivBase,   "body > div.mfp-wrap.mfp-gallery.mfp-close-btn-in.mfp-auto-cursor.mfp-fade.mfp-ready > div > div.mfp-content > div > button",                     "#player",              "body > div.container-fluid.inner-pages-banner > div",    "body > div.ribbon-container > div",  "body > header > div.container.less-margin",    "body > div.container-fluid.inner-pages-banner > div"];
        let pareFou=0,     mydiv,    aa="n/a",  bb="n/a",   ddd1,   ddd2;

        for (let i of parents) {    pareFou=document.querySelector(i);   if(pareFou != null)  { aa=i; break; }   // try add  id[i]
                                    pareFou=document.getElementById(i);  if(pareFou != null)  { aa=i; break; }
        };     if(dbg>5) log(`   showmsg():  ${msg}`, `   found parent ${aa} pareFou=`, pareFou);

        mydiv = document.createElement("div");
        //mydiv.setAttribute("style",`width:auto;  top:5%;  left:9%;         height:auto;  color:Silver; font-size: 20px; background-color:black; `);   // position & z-index можно и тут прописать
        //mydiv.setAttribute("style",`width:800px;  top:5%;  left:9%;         height:auto;  color:Silver; font-size: 20px; background-color:black; `);   // position & z-index можно и тут прописать
        if(styl)  mydiv.setAttribute("style",styl);
        mydiv.style.zIndex=100;
        //mydiv.innerHTML = `<h1> ${msg} </h1>`;                          // border: solid 5px Red;  // padding later // padding: 15px;
        mydiv.innerHTML = msg;

        var qaz=pareFou.id;      //     qaz=pareFou.title;      //log(`   qaz=|${qaz}|  new DIV=|${mydiv.id}|`);
        if(qaz==mydivBase) {
            mydiv.id=mydivBase + Math.floor(Math.random() * 10000);    mydiv.style.position="relative";
            //aa=document.querySelector(`[title='showmsgCOMMONtitle']`);
            if(dbg) log("found by title: ", aa);
        }
        else {   mydiv.id=mydivBase;   mydiv.style.position="absolute";   mydiv.title=mydivTitle; }
        if(dbg>5) log(`   ---- new DIV=|${mydiv.id}|`);

        //log(`   -------  cmp qaz==mydivBase ${qaz==mydivBase}  ${qaz===mydivBase}`); //  ${qaz.localeCompare(mydivBase)}`);
        //var zx=new String(qaz);  log(zx.length);  var zy=new String(mydivBase);   log(zy.length);   log(zx==zy);  log(zx===zy);


        //if ( aa=staticL('chk') )  // cmp ?
        //    log(`mydivBase= ${aa}  already exists=${staticL('get')}`);


        if(pareFou==null) { aa="document.body";  bb=document.body.appendChild(mydiv); }
        else                                     bb=pareFou.appendChild(mydiv);

        setTimeout(function() {  //if (mydiv.id=mydivBase) return;  // never delete base
                                 if(pareFou!=null) mydiv.parentNode.removeChild(mydiv);
                                 //     также восстановить staticLabel
        }, duration);

        if(dbg>5) log(`   showmsg(): ${mydiv.id} appended to ${aa}  rc=${bb} <===`);
        ddd1 = document.querySelector(mydiv.id);   ddd2 = document.getElementById(mydiv.id);   if(dbg) log(`      showmsg(): check ${mydiv.id} getElementById=${ddd1}  querySelector=${ddd2}`);  //  !!!!!!  и querySelector и getElementById глючат и часто показывают null
        return
    }  // end of showmsg()

    function deletemsg()  {
        let what="showmsg";    let ddd1 = document.querySelector(what);    let ddd2 = document.getElementById(what);
        if(dbg) log(`hidemsg(): ${what} getElementById=${ddd1}  querySelector=${ddd2}`);  // querySelector ВСЕГДА показывает null    // getElementById - WORKS FINE !!!
        if(ddd1!=null) ddd1.parentNode.removeChild(ddd1);   if(ddd2!=null) ddd2.parentNode.removeChild(ddd2);
    }



    function staticL_example () {  // !!! for use as static variables // persistent
            let aa;
            aa=staticL('create',  "myLabel13",  "cr567");    log(`create:      rc=${aa}  exists: ${staticL('chk', "myLabel13")} value=${staticL('get', "myLabel13")}`);
            aa=staticL('zero',    "myLabel13");              log(`zero:        rc=${aa}  exists: ${staticL('chk', "myLabel13")} value=${staticL('get', "myLabel13")}`);
            aa=staticL('update',  "myLabel13",  "upd755");   log(`update:      rc=${aa}  exists: ${staticL('chk', "myLabel13")} value=${staticL('get', "myLabel13")}`);
            aa=staticL('compare', "myLabel13",  "upd444");   log(`compare bad  rc=${aa}  exists: ${staticL('chk', "myLabel13")} value=${staticL('get', "myLabel13")}`);
            aa=staticL('compare', "myLabel13",  "upd755");   log(`compare ok   rc=${aa}  exists: ${staticL('chk', "myLabel13")} value=${staticL('get', "myLabel13")}`);
            aa=staticL('wrong',   "smr332");                 log(`wrong_cmd    rc=${aa}  exists: ${staticL('chk', "myLabel13")} value=${staticL('get', "myLabel13")}`);
    }   // end of staticL_example()

    //function staticL (cmd, staticLabel="sampleStatLabel111", txt="n/a") {  // !!! for use as static variables // persistent
    //    let sLL="n/a", aa, staticLabel="showmsg_static1"
    function staticL (cmd, staticLabel="sampleStatLabel111", txt="n/a") {  // !!! for use as static variables // persistent
        let sLL="n/a", aa;  // staticLabel="showmsg_static1"
        switch (cmd) {
            case 'cr':  case 'create':    sLL=queryL();  // usage:   aa=staticL('cr|create', "myLabel13",  "init123");   log(`create:    rc=${aa}  exists: ${staticL('chk')} value=${staticL('get')}`);
                                          if(sLL == null) {  sLL=document.createElement("LABEL");   sLL.htmlFor=staticLabel;
                                                             document.body.appendChild(sLL);        sLL.setAttribute("display","none");  }
                                          sLL.innerText=txt;
                                          return true;   break;
            case 'get':                    // usage:   aa=staticL('get', "myLabel13");                      log(`get:       rc=${aa}  exists: ${staticL('chk')} value=${staticL('get')}`);
                                           sLL=queryL();           if(sLL == null) return null;
                                           return sLL.innerText;   break;
            case 'zero':   case 'reset':   case 'upd':   case 'update':   // usage:   aa=staticL('zero|reset',  "myLabel13");               log(`zero:      rc=${aa}  exists: ${staticL('chk')} value=${staticL('get')}`);
                                                                          // usage:   aa=staticL('upd|update',  "myLabel13",  "upd555") ;   log(`update:    rc=${aa}  exists: ${staticL('chk')} value=${staticL('get')}`);
                                                            sLL=queryL();                    if(sLL == null) return null;
                                                            (cmd=="zero" || cmd=="reset")  ? sLL.innerText=""  : sLL.innerText=txt;
                                                            return true;   break;
            case 'cmp':   case 'compare':   // usage:   aa=staticL('cmp|compare',  "myLabel13", "upd555");   log(`compare    rc=${aa}  exists: ${staticL('chk')} value=${staticL('get')}`);
                                            sLL=queryL();       if(sLL.innerText != txt) return null;
                                            return true;   break;
            case 'chk':   case 'exist':   case 'check':       // usage:   aa=staticL('chk|exist|check', "myLabel13");          log(`check      rc=${aa}  exists: ${staticL('chk')} value=${staticL('get')}`);
                                                              if (queryL()) return true;  else return null;
                                                              break;
            default:      log("staticL(): bad cmd=" + cmd);   // usage:   aa=staticL('wrong',  "smr332");         log(`wrong_cmd  rc=${aa}  exists: ${staticL('chk')} value=${staticL('get')}`);
                          return null; break;
        }
        function queryL() {  return document.querySelector( `label[for=${staticLabel}]` ); }
    }   // end of staticL()


    function isNumber(n){
        return Number(n)=== n;
        // see also function isNumber(val) {   return !isNaN(val);  }
        //   // https://stackoverflow.com/questions/18082/validate-decimal-numbers-in-javascript-isnumeric
        //   // https://stackoverflow.com/questions/20169217/how-to-write-isnumber-in-javascript
        //test
        // [0, 1, 2, -1, 1.345e+17, Infinity, false, true, NaN, '1', '0'].map(function(itm){ 	return itm+'= '+isNumber(itm);	});
    } // isNumber()
    

	function TrustedHTMLworkaround () {
		if (window.trustedTypes && window.trustedTypes.createPolicy)	{
			window.trustedTypes.createPolicy('default', { 	createHTML: (string, sink) => string	});
		}
	} // TrustedHTMLworkaround()

	function TrustedHTMLworkaround2 () {
             // WORKAROUND: TypeError: Failed to set the 'innerHTML' property on 'Element': This document requires 'TrustedHTML' assignment.
             if (window.trustedTypes) {
                 if (!window.trustedTypes.defaultPolicy) {
                     const passThroughFn = (x) => x;
                     window.trustedTypes.createPolicy('default', {
                         createHTML: passThroughFn,
                         createScriptURL: passThroughFn,
                         createScript: passThroughFn,
                     });
                 }
             }
	} // TrustedHTMLworkaround2()
