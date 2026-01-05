// ==UserScript==
// @name        nicoScroll_Button
// @namespace   http://dummy.ne.jp/
// @description Niconico douga GINZA Ver : The function which scrolls to a nico video player 
// @include     http://www.nicovideo.jp/watch/*
// @version     2014.07.25.m
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/3068/nicoScroll_Button.user.js
// @updateURL https://update.greasyfork.org/scripts/3068/nicoScroll_Button.meta.js
// ==/UserScript==
(function () {
    //======================================================
    var ElemInp = document.createElement('input');
    var ElemPrg = document.createElement('p');
    var ElemDiv = document.createElement('div');
    var ElemLbl = document.createElement('label');
    var ElemUl = document.createElement('ul');
    var ElemLi = document.createElement('li');
    var Docbody = document.body;
    //======================================================
    /* create div#scroll_parts */
    //------------------------------------------------------
    var Parts = ElemDiv.cloneNode(true);
    Parts.id = 'scroll_parts';
    //======================================================
    /* create 'top' button */
    //------------------------------------------------------
    var btnTOP = ElemInp.cloneNode(true);
    btnTOP.id = 'btnScroll_top';
    btnTOP.type = 'button';
    btnTOP.value = 'top';
    //======================================================
    /* create 'player' button */
    //------------------------------------------------------
    var btnMP = ElemInp.cloneNode(true);
    btnMP.id = 'btnScroll_mp';
    btnMP.type = 'button';
    btnMP.value = 'player';
    //======================================================
    /* create clip checkbox */
    //------------------------------------------------------
    var chkClip = ElemInp.cloneNode(true);
    chkClip.id = 'chk_clip';
    chkClip.type = 'checkbox';
    chkClip.setAttribute('alt', 'pin down');
    var chkpara = getData('chkClip.checked', 'true');
    if (chkpara == 'true') chkClip.setAttribute('checked', 'checked');
    //======================================================
    /* create 'Any' button */
    //------------------------------------------------------
    var btnAny = ElemInp.cloneNode(true);
    btnAny.id = 'btnScroll_any';
    btnAny.type = 'button';
    btnAny.value = 'any';
    //======================================================
    /* create option pragrafh */
    //------------------------------------------------------
    var pOpt = ElemPrg.cloneNode(true);
    var txtNode = document.createTextNode('Option');
    pOpt.id = 'view_option';
    pOpt.className = 'viewlink';
    pOpt.setAttribute('title', 'View options screen');
    pOpt.appendChild(txtNode);
    //======================================================
    /* body add div#scroll_parts  */
    //------------------------------------------------------
    //document.body.appendChild(Parts);   //addlast
    Docbody.insertBefore(Parts, Docbody.firstChild);
    Parts.appendChild(chkClip);
    Parts.appendChild(btnTOP);
    Parts.appendChild(btnMP);
    Parts.appendChild(btnAny);
    Parts.appendChild(pOpt);
    //======================================================
    /* add Styles */
    //======================================================
    var tag = document.createElement('style');
    tag.type = 'text/css';
    var cssTxt = [
        ' #scroll_parts{ top: 450px; position: fixed; z-index: 999; width: 70px; padding:0px; background: #e8e9ff; font-size:12px; }',
        ' #scroll_parts:hover{ left:0px !important; }',
        ' #chk_clip{ float:right; }',
        ' .clipon{ left:0px !important; }',
        ' .clipoff{ left:-62px !important; }',
        ' #btnScroll_mp,#btnScroll_top,#btnScroll_any{ width:50px; margin-bottom:5px; margin-left:10px; }',
        ' #scroll_opt{ top: 400px; position: fixed; z-index: 1000; padding: 0px; background: #e8e9ff; font-size:12px; }',
        ' .viewlink{ font-weight:bold; font-size:11px; padding:1px; background: #dedeff; border: 1px solid #acacff; text-decoration: underline; cursor:pointer;}'
    ].join('\n');
    var rule = document.createTextNode(cssTxt);
    tag.appendChild(rule);
    document.getElementsByTagName('head') [0].appendChild(tag);
    //======================================================
    // add events */
    //======================================================
    btnMP.addEventListener('click', onClick_mp, false);
    btnTOP.addEventListener('click', onClick_top, false);
    btnAny.addEventListener('click', onClick_any, false);
    chkClip.addEventListener('click', change_clip, false);
    pOpt.addEventListener('click', viewOption, false);
    //======================================================
    /* init functions */
    //======================================================
    var initFunc = (function () {
        onClick_mp();
        change_clip();
    }) ();
    //======================================================
    /* event functions */
    //======================================================
    // 'player' button
    //------------------------------------------------------
    function onClick_mp() {
        console.log('onClick_mp start');
        try {
            var offset = $('#playerContainerWrapper') .offset();
            console.log('get offset');
            window.scrollTo(offset.left, offset.top - 35);
        } catch (ex) {
            console.log('any offset');
            onClick_any();
        }
        console.log('onClick_mp end');
    }
    //======================================================
    // 'top' button
    //------------------------------------------------------

    function onClick_top() {
        window.scrollTo(0, 0);
    }
    //======================================================
    // 'any' button
    //------------------------------------------------------

    function onClick_any() {
        var top = getData('scroll.selectedTopPosition', '230');
        window.scrollTo(0, top);
    }
    //======================================================
    // chkclip checkbox
    //------------------------------------------------------

    function change_clip() {
        var chkbox = document.getElementById('chk_clip');
        var parts = document.getElementById('scroll_parts');
        if (chkbox.checked) {
            parts.className = 'clipon';
        } else {
            parts.className = 'clipoff';
        }
        setData('chkClip.checked', chkbox.checked);
    }
    //======================================================
    /* IO */
    //======================================================
    //set
    //------------------------------------------------------

    function setData(key, data) {
        if (window.JSON == false) {
            alert('Your Web Browser is not supported JSON.');
            return ;
        }
        if (key != null && data != null) localStorage.setItem(key, data);
    }
    //======================================================
    //get
    //------------------------------------------------------

    function getData(key, defValue) {
        var data = '';
        if (window.JSON == false) {
            alert('Your Web Browser is not supported JSON.');
            return data;
        }
        data = localStorage.getItem(key);
        if (data == null) (typeof defValue == 'defined') ? data = '' : data = defValue;
        //alert(data);
        return data;
    }
    //======================================================
    /* view result */
    //======================================================

    function resultTip(str, x, y) {
        //-------------------------------------------------------------
        //console.log('resultTip start');
        //-------------------------------------------------------------
        var sc_x;
        var sc_y;
        var tip = document.getElementById('resultTip');
        //-------------------------------------------------------------
        //console.log(' getElement ok');
        //-------------------------------------------------------------
        (typeof x == 'undefined') ? sc_x = 50 : sc_x = x;
        (typeof y == 'undefined') ? sc_y = 380 : sc_y = y;
        //-------------------------------------------------------------
        //console.log(' position x:' + sc_x + ', y:' + sc_y + ' set ok');
        //-------------------------------------------------------------
        if (!tip) {
            tip = ElemDiv.cloneNode(true);
            console.log('  create ok');
            tip.id = 'resultTip';
            tip.className = 'tooltip-content';
            //search
            Docbody.appendChild(tip);
        }
        //---7.18-------------------------------------------
        //var t_node = document.createTextNode(str);
        //tip.removeChild(tip.childNodes);
        //tip.appendChild(t_node);

        tip.innerHTML = str;
        //---7.18-------------------------------------------
        //-------------------------------------------------------------
        //console.log(' append node ok');
        //-------------------------------------------------------------
        tip.style.left = sc_x + 'px';
        tip.style.top = sc_y + 'px';
        tip.style.position = 'fixed';
        tip.style.zIndex = 999;
        tip.style.backgroundColor = '#ffffe1';
        tip.style.border = '1px black solid';
        tip.style.padding = '2px';
        tip.style.width = '200px';
        //-------------------------------------------------------------
        //console.log(' set style ok');
        //-------------------------------------------------------------
        setTimeout(function tip_remove() {
            tip.remove();
            console.log('tip_remove ok');
        }, 3000);
        //-------------------------------------------------------------
        //console.log('resultTip end');
    }
    //======================================================
    /* option(preference) control */
    //======================================================

    function viewOption() {
        // console.log('viewOption start');
        var so = document.getElementById('scroll_opt')
        // close
        if (so != null) {
            so.remove();
            return ;
        }
        //---7.18-------------------------------------------

        var opt = ElemDiv.cloneNode(true);
        var pClose = ElemPrg.cloneNode(true);
        var tbTop = ElemInp.cloneNode(true);
        var btnSave = ElemInp.cloneNode(true);
        var lblTop = ElemLbl.cloneNode(true);
        var txt;
        var btnEx;
        var ulopt;
        var liopt;
        //---7.18-------------------------------------------
        /*
        //-------------------------------------------------------------
        // option defined
        //-------------------------------------------------------------
        var optlist = [
            {
                lbtxt: 'scroll to any position : ',
                id: 'SelectTop',
                bfunc: onclick_anysave,
                exid: 'currentTop',
                exfunc: function () {
                    var doc_obj = document;
                    tbTop.value = doc_obj.documentElement.scrollTop || doc_obj.body.scrollTop;
                }
            }
        ];
        //-------------------------------------------------------------
        // load option  
        //-------------------------------------------------------------
        var setEvent = (function (ary) {
            for (var i = 0; i < ary.length; i++) {
                var t_log = i + '):';
                t_log += 'lbtxt:' + ary[i]['lbtxt'] + '\n';
                t_log += 'id:' + ary[i]['id'] + '\n';
                t_log += 'bfunc:' + ary[i]['bfunc'] + '\n';
                t_log += 'exid:' + ary[i]['exid'] + '\n';
                t_log += 'exfunc:' + ary[i]['exfunc'] + '\n';
                console.log(t_log); 
            }
        }) (optlist);
        */
        opt.id = 'scroll_opt';
        //----------------------------------------------
        pClose.id = 'close_option';
        pClose.className = 'viewlink';
        pClose.setAttribute('title', 'Close options screen');
        pClose.onclick = viewOption;
        txt = document.createTextNode('Close');
        pClose.appendChild(txt);
        opt.appendChild(pClose);
        //---7.18-------------------------------------------
        ulopt = ElemUl.cloneNode(true);
        liopt = ElemLi.cloneNode(true);
        ulopt.appendChild(liopt);
        //---7.18-------------------------------------------
        lblTop.id = 'lblSelectTop'
        lblTop.innerHTML = "(scroll to) <br>any position : ";
        //----------------------------------------------
        tbTop.id = 'tbSelectTop';
        tbTop.type = 'text';
        tbTop.style.width = '50px';
        tbTop.value = getData('scroll.selectedTopPosition', '230');
        //----------------------------------------------
        btnSave.id = 'btnSave';
        btnSave.type = 'button';
        btnSave.value = 'save';
        btnSave.onclick = onclick_anysave;
        //-----------------------------------------
        btnEx = ElemInp.cloneNode(true);
        btnEx.id = 'btnCurrentPosition';
        btnEx.type = 'button';
        btnEx.value = 'current';
        btnEx.onclick = function () {
            var doc_obj = document;
            tbTop.value = doc_obj.documentElement.scrollTop || doc_obj.body.scrollTop;
        };
        //-----------------------------------------
        Docbody.insertBefore(opt, Docbody.firstChild);
        //----------------------------------------------
        //---7.18---------------------------------------
        liopt.appendChild(lblTop);
        liopt.appendChild(tbTop);
        liopt.appendChild(btnSave);
        liopt.appendChild(btnEx);
        
        opt.appendChild(ulopt);
        //---7.18---------------------------------------
        //----------------------------------------------
        // onclick function
        //----------------------------------------------
        function onclick_anysave() {
            if (tbTop.value != '' && isFinite(tbTop.value)) {
                setData('scroll.selectedTopPosition', tbTop.value);
                resultTip('save OK');
            } else {
                resultTip('Please enter the number', 30, 380);
            }
        }
        //console.log('viewOption end');

    }
    //======================================================

}) ();
