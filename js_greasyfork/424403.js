// ==UserScript==
// @name         TildaMustDie
// @namespace    TildaMustDie
// @version      1.3
// @description  Tilda must die. For real.
// @author       @sanyabeast
// @match        https://tilda.cc/*
// @match        https://tilda.cc/**/*
// @match        https://tilda.ws/*
// @match        https://tilda.ws/**/*
// @match        https://*.tilda.ws/*
// @match        https://*.*.tilda.ws/**/*
// @match        http://tilda.cc/*
// @match        http://tilda.cc/**/*
// @match        http://tilda.ws/*
// @match        http://tilda.ws/**/*
// @match        http://*.tilda.ws/*
// @match        http://*.*.tilda.ws/**/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424403/TildaMustDie.user.js
// @updateURL https://update.greasyfork.org/scripts/424403/TildaMustDie.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    await append_script("https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js");
    // some vars
    let help_text = `
Hi! This I am TildaMustDie and I am going to help u to work with this so-called tool with less pain.
[editor] | CTRL+SHIFT+H: Show this help alert
[editor] | CTRL+S: Save project
[editor] | CTRL+P: Publish project
[editor] | CTRL+SHIFT+P: Save and publish project
[editor] | CTRL+MouseWheel: Normal zooming as at good editors
[editor] | CTRL+PLUS: Normal zooming (without page-zooming)
[editor] | CTRL+Minus: Normal zooming (without page-zooming)
[any] | Middle Mouse Key: Normal panning as at good editors
[any] | Alt+Mousemove: Quick info about hovered element
[page_editor]: DoubleClick on Code block to edit.
[page_editor]: CTRL+S when code editor is open to save
`;
    let state = {
        is_publishing: false,
        is_saving: false,
        is_help_box_shown: false,
        message_hiding_timeout_id: null,
        scroll_el: null,
        is_editor: window.location.href.indexOf('tilda.cc/zero') > -1,
        is_page_editor: window.location.href.indexOf('tilda.cc/page') > -1,
        is_result: window.location.href.indexOf('tilda.ws') > -1,
        prev_mousedown_time: -1,
        dblclick_time: 300
    }

    console.log(`is_editor: ${state.is_editor} | is_page_editor: ${state.is_page_editor} | is_result: ${state.is_result}`)
    let mouse_events_target = state.is_page_editor?document.body:window
    let html_el = x_find("html");
    let non_passive = { passive: false };
    let middle_mouse_mouse_key_data = { pointer_x: 0,  pointer_y: 0, pressed: false, last_el: null };
    // messaging setup
    let message_box = x_parse_html(`<div id='sb_message_box' class='sb_message_box' style='position:fixed;z-index:99999;bottom:0;right:0;background: black;color:white;height:32px;display:flex;align-items:center;justify-content:center;padding:0 24px;opacity:0.7;'><p style='margin:0;font-family:monospace;'></p></div>`);
    let help_box = x_parse_html(`<div id='sb_help_box' class='sb_help_box' style='z-index:9999;position:fixed;z-index:99999;top:0;left:0;background: black;color:white;height:auto;white-space:pre-wrap;display:flex;align-items:center;justify-content:center;padding:24px 24px;opacity:0.7;'><p style='margin:0;font-family:monospace;'></p></div>`);
    let frame_box = x_parse_html(`<div id="sb_frame_box" style="pointer-events:none;position:fixed;top:0;left:0;border:2px dotted red;display:flex;z-index:9999;"></div>`)
    message_box.style.zIndex = "none";
    help_box.style.display = "none";
    frame_box.style.display = "none"
    document.body.appendChild(message_box);
    document.body.appendChild(help_box);
    document.body.appendChild(frame_box);
    // disabling mousewheel based zooming
    console.log("%cHi! I am going to make Tilda (piece of shit) a little bit less shitfull", "color: red");
    window.addEventListener("mousewheel", (evt)=>{
        if (evt.ctrlKey && state.is_editor){
            console.log("Preventing default page-zooming (yeah Tilda`s shitmakers we don`t need it)");
            evt.preventDefault();
            evt.deltaY>0?window.tn_zoomOut():window.tn_zoomIn();
        }
    }, non_passive)
    // disabling ctrl-key based zooming
    window.addEventListener("keydown", (evt)=>{
        if (evt.ctrlKey){
            console.log(`Keydown: ${evt.keyCode}`);
            switch(evt.keyCode){
                case 83: //s save
                    if (state.is_editor){
                        evt.preventDefault();
                        x_t_save();
                    } else if (state.is_page_editor){
                        let code_save_btn = x_find("button.tbtn-primary");
                        if (code_save_btn){
                            evt.preventDefault();
                            x_fire_event(code_save_btn, "click");
                        }
                    }
                    break;
                case 82: //r reload
                    evt.preventDefault();
                    if (state.is_editor) {
                        console.log("reloading with clearing cache");
                        window.location.reload();
                    } else if (state.is_result) {
                        window.location.reload(true);
                    } else {
                        window.location.reload();
                    }
                    break;
                case 80: //p publish
                    if (state.is_editor){
                        evt.preventDefault();
                        if (evt.shiftKey){
                            console.log(1111);
                            x_t_save();
                            setTimeout(a=>x_t_publish(), 1000);
                        } else {
                            x_t_publish();
                        }
                    } else if (state.is_page_editor){
                        evt.preventDefault();
                        x_t_publish();
                    }
                    break;
                case 72: //h - help
                    if (evt.shiftKey){
                        evt.preventDefault();
                        alert(help_text);
                    }
                    break;
                 case 85: //u - find element
                    if (evt.shiftKey){
                        evt.preventDefault();
                        let selector = prompt('Please enter valid CSS-Selector e.g #blabla or .class_a.class_b etc');
                        let element = x_find(selector);
                        if (element){
                            x_s_show_help_box(element)
                        } else {
                            alert(`Element matching this selector "${selector}" was not found on the page`);
                        }
                    }
                    break;
            }
        } else if (evt.altKey){
            evt.preventDefault();
            x_s_show_help_box(middle_mouse_mouse_key_data.last_el);
        }
    }, non_passive)
    window.addEventListener("keyup", (evt)=>{
        if (state.is_help_box_shown){
            x_s_hide_help_box();
        }
    }, non_passive)
    // disable default middle-key scrolling and enabling god-blessed scrolling by @sanyabeast
    mouse_events_target.addEventListener("mousedown", (evt)=>{
        middle_mouse_mouse_key_data.pointer_x = evt.screenX;
        middle_mouse_mouse_key_data.pointer_y = evt.screenY;
        if (evt.which === 2){
            evt.preventDefault();
            //middle_mouse_mouse_key_data.scroll_el = _.throttle(scroll_el, 1000/10)
            middle_mouse_mouse_key_data.scroll_el = x_s_scroll_el
            middle_mouse_mouse_key_data.pressed = true;
        }
        if (evt.which===1){
            let now = +new Date();
            if (now - state.prev_mousedown_time < state.dblclick_time){
                x_s_ondblclick(evt);
            }
            state.prev_mousedown_time = now;

        }
    }, non_passive);
    window.addEventListener("mousemove", (evt)=>{
        let x = evt.screenX;
        let y = evt.screenY;
        let dx = middle_mouse_mouse_key_data.pointer_x - x;
        let dy = middle_mouse_mouse_key_data.pointer_y - y;
        middle_mouse_mouse_key_data.pointer_x = x;
        middle_mouse_mouse_key_data.pointer_y = y;
        middle_mouse_mouse_key_data.last_el = evt.target
        if (evt.which === 2){
            evt.preventDefault();
            if (middle_mouse_mouse_key_data.pressed) {
                middle_mouse_mouse_key_data.scroll_el(html_el, dx, dy);
            }

        }
    }, non_passive )
    window.addEventListener("mouseup", (evt)=>{ if (evt.which === 2){ evt.preventDefault(); middle_mouse_mouse_key_data.pressed = false; } }, non_passive);

    // fucking tilda tools
    function x_t_get_page_id(){ return (new URLSearchParams(window.location.search)).get('pageid') }
    function x_t_save(){
        if (state.is_saving){
            return
        }
        state.is_saving = true
        x_s_show_message('saving...', 2);
        let btn = x_find(".tn-save-btn");
        x_fire_event(btn, "click");
        state.is_saving = false
    }
    function x_t_publish(){
        if ( state.is_publishing){
           return true;
        }
        state.is_publishing = true
        let pageid = x_t_get_page_id();
        let iframe_url = `https://tilda.cc/page/?pageid=${pageid}`
        x_s_show_message(`publishing: ${iframe_url}`, 10);
        let iframe = x_parse_html(`
           <iframe sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
           src="${iframe_url}"
           style="z-index: 9999;border: 2px solid black; width:600px; height:600px; position: absolute; top: 16px; left: 16px; display: none;"></iframe>
       `);
        document.body.appendChild(iframe);
        console.dir(iframe);
        x_s_wait_async(a=>typeof iframe.contentWindow.pagePublish==="function", 10, ()=>{
            iframe.contentWindow.pagePublish();
            x_s_show_message('PUBLISHED', 4);
            setTimeout((a)=>{
                iframe.remove();
                state.is_publishing = false
            }, 2000);
        }, ()=>{
            x_s_show_message('NOT PUBLISHED:(', 4);
            iframe.remove();
            state.is_publishing = false
        })
    }
    //service tools
    function x_s_ondblclick(evt){
        if (state.is_page_editor && evt.target.tagName === "PRE") {
            let record_el = evt.target.closest(".record")
            let edit_btn = record_el.querySelector(".tp-record-edit-icons-left__three .tp-record-edit-icons-left__item");
            x_fire_event(edit_btn, "click");
        }
    }
    function x_s_get_element_brief(el, rect){
        let result = ""
        let styles = window.getComputedStyle(el);
        let id = el.getAttribute('id');
        let classes = el.getAttribute('class');
        rect = rect || el.getBoundingClientRect();
        return [
          `ID: ${id}`,
          `DATA-ELEM-ID: ${el.getAttribute('data-elem-id')}`,
          `CLASSES: ${classes}`,
          `Z-INDEX: ${el.style.zIndex||styles.zIndex}`,
          `LEFT/TOP: ${Math.ceil(rect.x)}px/${Math.ceil(rect.y)}px`,
          `RIGHT/BOTTOM: ${Math.ceil(rect.right)}px/${Math.ceil(rect.bottom)}px`,
          `WIDTH/HEIGHT: ${Math.ceil(rect.width)}px/${Math.ceil(rect.height)}px`,
        ].join('\n')
    }
    function x_s_show_help_box(last_el){
        if (!last_el){
            return;
        }
        state.is_help_box_shown = true;
        let mx = middle_mouse_mouse_key_data.pointer_x;
        let my = middle_mouse_mouse_key_data.pointer_y;
        let rect = last_el.getBoundingClientRect();
        frame_box.style.transform = `translate(${rect.x}px, ${rect.y}px)`;
        frame_box.style.width = `${rect.width}px`;
        frame_box.style.height = `${rect.height}px`;
        help_box.style.display = "flex"
        frame_box.style.display = "flex"
        help_box.children[0].innerHTML = x_s_get_element_brief(last_el, rect);
        help_box.style.transform = `translate(${mx}px, ${my}px)`;
    }
    function x_s_hide_help_box(){
        console.log('hide');
        help_box.style.display = "none";
        frame_box.style.display = "none";
        state.is_help_box_shown = false;
    }
    function x_s_scroll_el(el, dx, dy){
        //console.log(dx, dy)
        el.scrollLeft = el.scrollLeft + dx;
        el.scrollTop = el.scrollTop + dy;
    }
    function x_s_show_greetings(){
        x_s_show_message(`Wuzzup! I am TildaMustDie! Need help? Press CTRL+SHIFT+H`, 4);
    }
    function x_s_wait_async(check, max_timeout, on_complete, on_error){
        max_timeout = max_timeout || 1;
        let start_date = +new Date();
        let end_date = start_date + (max_timeout*1000);
        let is_successfull = false;
        let interval_id = setInterval(()=>{
            if (+new Date() < end_date){
               if(check()){
                   on_complete();
                   is_successfull = true;
                   clearInterval(interval_id);
               }
            } else {
               clearInterval(interval_id);
               if (!is_successfull){ on_error && on_error(); }
            }
        }, 1000/5);
    }
    function x_s_show_message(message, timeout){
        timeout = timeout || 3;
        clearTimeout(state.message_hiding_timeout_id);
        message_box.children[0].innerHTML = message;
        message_box.style.display = "flex";
        state.message_hiding_timeout_id = setTimeout(()=>{
           message_box.style.display = "none";
        }, timeout*1000)
    }
    //page tools
    async function append_script(url) {
        let head = document.getElementsByTagName('head')[0];
        let theScript = document.createElement('script');
        theScript.type = 'text/javascript';
        theScript.src = url;
        head.appendChild(theScript);
    }
    function x_parse_html(html){ let div = document.createElement('div'); div.innerHTML = html; return div.children[0]; }
    function x_create_iframe(){};
    function x_fire_event(el, etype){ let evt_o = document.createEvent('Events');evt_o.initEvent(etype, true, false);el.dispatchEvent(evt_o); }
    function x_find(selector){ return document.querySelector(selector) }
    function x_find_all(selector){ return document.querySelector(selector) }
    function x_check_all_elements(checker, root_el, result){
       result = result || [];
       root_el = root_el || document.body;
       if (checker(root_el)){ result.push(root_el); }
       _.forEach(root_el.children, (child_el, index)=>{
           x_check_all_elements(checker, child_el, result);
       })
       return result;
    }
    function x_find_scrollable_elements(root_el, result) { return x_check_all_elements((el)=>{ return el.scrollTop>0||el.scrollLeft>0}, root_el, result) }

    window.html_el = html_el
    //
    window.x_s_wait_async = x_s_wait_async;
    window.x_s_show_message = x_s_show_message;
    // adding everythin to global
    window.x_t_get_page_id = x_t_get_page_id;
    //
    window.x_check_all_elements = x_check_all_elements;
    window.x_find_scrollable_elements = x_find_scrollable_elements;
    window.x_fire_event = x_fire_event;
    window.x_find = x_find;
    window.x_find_all = x_find_all;
    window.x_find_all = x_find_all;

    x_s_show_greetings()
})();