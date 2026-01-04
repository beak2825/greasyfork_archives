// ==UserScript==
// @name         blockunsafe
// @namespace    http://blockunsafe.com/
// @version      1.0
// @description  Block unsafe(uncomfortable) content on web pages by keywords
// @author       gonetoorion
// @match        http*://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @run-at       document-start
// @noframes
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/412186/blockunsafe.user.js
// @updateURL https://update.greasyfork.org/scripts/412186/blockunsafe.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    let test_value = 40;
    let is_first = true;
    let setting_btn;
    let config_domain = "blockunsafe.com";
    let pattern_url = window.location.pathname;
    let pattern_key = location.hostname + 'urlpattern';
    let max_class_key = location.hostname + 'classkeyx';
    let dom_nouse = ['SCRIPT','STYLE','TEXTAREA','svg','LINK','IFRAME','EM','I','IMG','FIELDSET','LEGEND','BR','OPTION','SELECT','INPUT','BUTTON','FORM','STRONG','TEXTAREA','FOOTER','META'];
    let no_check_tag = ['LI','TR'];
    let dom_dict = {};
    let no_target_class = [];
    let max_key = '';
    let class_set = GM_getValue(max_class_key);
    let pattern_set = GM_getValue(pattern_key);
    let top_widths = [];
    let class_setx = class_set?class_set:[];
    let warn_words = [];
    let filter_words_area = 'show_filter_keyword';
    let config_url = "https://www.blockunsafe.com/config.html";
    let config_url_marks = ["z", "e", "t"];
    for(let i=0,len=config_url_marks.length; i<len; i++){
        let www_config_url = "https://www.blockunsafe.com/"+config_url_marks[i]+"config.html";
        let no_www_config_url = "https://blockunsafe.com/"+config_url_marks[i]+"config.html";
        if(window.location.href.indexOf(www_config_url)==0||window.location.href.indexOf(no_www_config_url)==0){
            window.addEventListener("load", init_config_page);
            return;
        }
    }
    let all_ok = class_set&&check_url_pattern(pattern_url);
    let f_key = get_f_key();
    if(!f_key){
        return;
    }
    if(f_key==config_domain){
        return;
    }
    let orignal_f_key = f_key;
    f_key += '_fbkssousousous';
    let filter_keywords = GM_getValue(f_key);
    if(document.body){
        if(all_ok){
            document.body.style.display = 'none';
        }
        setTimeout(show_page, 2000);
    }
    function reset_rule(lhn){
        let pattern_key = lhn + 'urlpattern';
        let max_class_key = lhn + 'classkeyx';
        GM_deleteValue(max_class_key);
        GM_deleteValue(pattern_key);
    }
    function init_config_page(){
        let f_key = "";
        let arg = window.location.search;
        arg = arg.replace("?", "");
        if(arg.indexOf("f_key=")!=0){
            config_error();
            return;
        }
        if(arg.indexOf("&")==-1){
            f_key = arg.slice(arg.indexOf("f_key=")+6);
        }else{
            f_key = arg.slice(arg.indexOf("f_key=")+6, arg.indexOf("&"));
        }
        if(!f_key){
            config_error();
            return;
        }
        let lhn = arg.slice(arg.indexOf("lhn=")+4, arg.indexOf("&cltp"));
        if(!lhn){
            config_error();
            return;
        }
        document.getElementById("reset_filter_rule_btn").addEventListener('click', function(e){
            if(confirm("Are you sure you want to reset the filter rules ? ")){
                reset_rule(lhn);
                document.getElementById("add_sign").innerHTML = "Reset successfully";
                document.getElementById("add_sign").style.display = "block";
                setTimeout(function(){
                    document.getElementById("add_sign").style.display = "none";
                }, 1500);
            }
        });
        document.getElementById("domain_eff_page").innerHTML = f_key;
        f_key += "_fbkssousousous";
        let filter_keywords = GM_getValue(f_key);
        if(filter_keywords!=undefined&&filter_keywords.length!=0){
            for(let i=0,len=filter_keywords.length;i<len;i++){
                add_keyword_span(filter_keywords[i], f_key);
            }
        }
        document.getElementById('add_kw_btn').addEventListener('click', function(e){
            let keyword = document.getElementById('add_kw_v').value;
            let values = GM_getValue(f_key);
            keyword = keyword.trim();
            if(keyword==''||keyword.replace(/\s*/g,"")==''){
                alert('Please add blocked keywords');
                return;
            }
            if(values==undefined||values.length==0){
                values = [keyword];
            }else{
                if(values.indexOf(keyword)==-1){
                    values.push(keyword);
                }else{
                    alert("The keywords already exists，don't  add it again~");
                    return;
                }
            }
            GM_setValue(f_key, values);
            add_keyword_span(keyword, f_key);
        });
    }
    function config_error(){
        document.body.innerHTML = "CONFIG ERROR!";
    }
    function get_f_key(){
        let host_info = location.hostname.split('.');
        let temp_f_key = "";
        for(let i=host_info.length-1,stop_i=host_info.length-3;i>stop_i;i--){
            if(temp_f_key){
                temp_f_key = host_info[i] + '.' + temp_f_key;
            }else{
                temp_f_key = host_info[i];
            }
        }
        return temp_f_key;
    }
    function check_dom(dom_node){
        dom_node.style.display = 'none';
    }
    function check_url_pattern(url){
        if(!pattern_set){
            return false;
        }
        if(url=='/'&&pattern_set.indexOf(url)!=-1){
            return true;
        }
        let is_in = false;
        let url_param = url.split('/');
        url_param.shift();
        for(let i=0,len=pattern_set.length; i<len; i++){
            let test_url_param = pattern_set[i].split('/');
            test_url_param.shift();
            if(test_url_param.length!=url_param.length){
                continue;
            }
            let diff_count = 0;
            for(let ix=0,lenx=test_url_param.length; ix<lenx; ix++){
                if(isNaN(test_url_param[ix])!=isNaN(url_param[ix])){
                    break;
                }
                if(test_url_param[ix]!=url_param[ix]&&isNaN(url_param[ix])){
                    diff_count += 1;
                }
                if(diff_count>1){
                    break;
                }
                if(ix==lenx-1){
                    is_in = true;
                }
            }
            if(is_in){
                break;
            }
        }
        return is_in;
    }
    function save_pattern(pattern_url){
        if(pattern_set){
            if(pattern_set.indexOf(pattern_url)!=-1){
                return;
            }else{
                pattern_set.push(pattern_url);
            }
        }else{
            pattern_set = [pattern_url];
        }
        GM_setValue(pattern_key, pattern_set);
    }
    function parse_dom_nodes(dom_nodes){
        let filter_dom_childs = [];
        for(let i=0,len=dom_nodes.length; i<len; i++){
            if(dom_nodes[i].nodeType!=1||dom_nouse.indexOf(dom_nodes[i].nodeName)!=-1){
                continue;
            }
            if(no_check_tag.indexOf(dom_nodes[i].nodeName)!=-1&&all_ok){
                check_update(dom_nodes[i]);
                continue;
            }
            let class_tag = dom_nodes[i].getAttribute('class');
            if(class_tag&&!all_ok){
                class_tag = class_tag.replace(/(^\s*)|(\s*$)/g, "");
                if(dom_dict[class_tag]==undefined){
                    dom_dict[class_tag] = 0;
                }else{
                    dom_dict[class_tag] = dom_dict[class_tag] + 1;
                }
            }
            if(dom_nodes[i].childNodes.length){
                filter_dom_childs.push(...dom_nodes[i].childNodes);
            }
        }
        if(filter_dom_childs.length){
            parse_dom_nodes(filter_dom_childs);
        }
    }
    function get_max_node(){
        let max_key = '';
        for(let key in dom_dict){
            if(max_key==''||dom_dict[max_key]<dom_dict[key]){
                max_key = key;
            }
        }
        return max_key;
    }
    function check_update(mut_node){
        if(no_target_class.indexOf(mut_node.className)!=-1){
            return;
        }
        for(let i=0,len=warn_words.length;i<len;i++){
            if(mut_node.innerText.toLowerCase().indexOf(warn_words[i])!=-1){
                check_dom(mut_node);
                break;
            }
        }
    }
    function analy_page(mut_nodes){
        if(!filter_keywords||!filter_keywords.length){
            return;
        }
        if(all_ok){
            if(!mut_nodes.innerText||!mut_nodes.innerText.replace(/\s+/g, '')){
                return;
            }
            for(let i=0,len=filter_keywords.length;i<len;i++){
                if(mut_nodes.parentNode&&mut_nodes.parentNode.getAttribute('id')==filter_words_area){
                    return;
                }
                if(mut_nodes.innerText.toLowerCase().indexOf(filter_keywords[i].toLowerCase())!=-1){
                    warn_words.push(filter_keywords[i].toLowerCase());
                }
            }
            if(!warn_words.length){
                return;
            }
            if(no_check_tag.indexOf(mut_nodes.nodeName)!=-1){
                check_dom(mut_nodes);
                return;
            }
            parse_dom_nodes(mut_nodes.childNodes);
            if(class_set.indexOf(mut_nodes.className)!=-1){
                check_dom(mut_nodes);
            }else{
                for(let i=0,len=class_set.length; i<len; i++){
                    let childs = mut_nodes.getElementsByClassName(class_set[i]);
                    if(!childs){
                        continue;
                    }
                    for(let j=0,lenx=childs.length; j<lenx; j++){
                        check_update(childs[j]);
                    }
                }
            }
        }else{
            let class_tag = mut_nodes.getAttribute('class');
            if(class_tag){
                class_tag = class_tag.replace(/(^\s*)|(\s*$)/g, "");
                if(dom_dict[class_tag]==undefined){
                    dom_dict[class_tag] = 0;
                }else{
                    dom_dict[class_tag] = dom_dict[class_tag] + 1;
                }
            }
            parse_dom_nodes(mut_nodes.childNodes);
        }
    }
    var dom_observer = new MutationObserver(function(mutations){
        if(is_first&&document.body&&document.readyState=='complete'){
            document.body.style.display = 'block';
            add_filter_btn(setting_btn);
            is_first = false;
        }
        for(let mut of mutations){
            let mut_add_nodes = mut.addedNodes;
            for(let mut_node of mut_add_nodes){
                if(!(dom_nouse.indexOf(mut_node.nodeName)==-1&&mut_node.nodeType==1)){
                    continue;
                }
                warn_words = [];
                analy_page(mut_node);
            }
        }
        if(all_ok){
            return;
        }
        for(let key in dom_dict){
            if(document.body.style.display=='none'||document.body.style.display==''){
                return;
            }
            let class_nodes = document.getElementsByClassName(key);
            if(class_nodes.length>1){
                let test_node = class_nodes[0];
                let count = 0;
                if(!test_node.offsetWidth){
                    no_target_class.push(key);
                    continue
                }
                for(let i=1,len=class_nodes.length;i<len;i++){
                    if((class_nodes[i].innerText==test_node.innerText&&class_nodes[i].parentNode==test_node.parentNode)||(!class_nodes[i].offsetWidth&&!class_nodes[i].innerText)||class_nodes[i].offsetWidth!=test_node.offsetWidth){
                        no_target_class.push(key);
                        break;
                    }
                    if(class_nodes[i].parentNode==test_node.parentNode){
                        count++;
                    }
                    if(count>2){
                        break;
                    }
                }
                if(count==0){
                    no_target_class.push(key);
                }
            }else{
                no_target_class.push(key);
            }
        }
        for(let i=0,len=no_target_class.length;i<len;i++){
            if(no_target_class[i] in dom_dict){
                delete dom_dict[no_target_class[i]];
            }
        }
        max_key = get_max_node();
        if(max_key){
            let max_nodes = document.getElementsByClassName(max_key);
            if(!max_nodes){
                delete dom_dict[max_key];
                return;
            }
            let max_node_width = max_nodes[0].offsetWidth;
            if(max_node_width/document.body.clientWidth>0.9){
                delete dom_dict[max_key];
                return;
            }
            if(top_widths.indexOf(max_node_width)==-1){
                top_widths.push(max_node_width);
            }
            if(Math.max.apply(null, top_widths)>max_node_width){
                if(dom_dict[max_key]>5){
                    dom_dict[max_key] -= 5;
                }
            }
            if(class_set&&max_key==class_set[class_set.length-1]){
                save_pattern(pattern_url);
                all_ok = true;
                return;
            }
            if(dom_dict[max_key]>test_value){
                let s_top = document.documentElement.scrollTop || document.body.scrollTop;
                if(s_top<4000){
                    return;
                }
                for(let class_key in dom_dict){
                    if(class_key==max_key){
                        continue;
                    }
                    if(class_setx.indexOf(class_key)==-1){
                        class_setx.push(class_key);
                    }
                }
                if(class_setx.indexOf(max_key)==-1){
                    class_setx.push(max_key);
                }
                GM_setValue(max_class_key, class_setx);
                save_pattern(pattern_url);
                location.reload();
                class_set = class_setx;
                all_ok = true;
            }
        }
    });
    dom_observer.observe(document, {childList: true, subtree: true, attributes: true});
    function add_filter_btn(setting_btn){
        setting_btn = document.createElement('a');
        let color = 'rgb(198, 94, 36)';
        let text_dec = '';
        if(!all_ok){
            color = '#F8C471';
            text_dec = 'text-decoration:line-through;'
        }
        let lan = navigator.language || navigator.userLanguage;
        lan = lan.toLowerCase();
        let lan_prefix = "";
        if(lan=="zh-cn"){
            lan_prefix = "z";
        }else if(lan=="zh-hk"||lan=="zh-tw"){
            lan_prefix = "t";
        }else{
            lan_prefix = "e";
        }
        let last_hostname = location.hostname;
        let url = config_url.replace("config", lan_prefix+"config")+"?f_key="+orignal_f_key+"&lhn="+last_hostname+"&cltp=1";
        setting_btn.setAttribute("href", url);
        setting_btn.setAttribute("target", "_blank");
        setting_btn.innerHTML = '<div style="position:fixed;top:400px;right:0px;background-color:rgb(244, 234, 194);color:'+color+';'+text_dec+'padding-left:15px;padding-right:15px;padding-top:10px;padding-bottom:10px;font-size:15px;border-radius:5px 0 0 5px;cursor:pointer;z-index:10000;">Add</div>';
        document.body.appendChild(setting_btn);
    }
    function add_keyword_span(keyword, f_key){
        let span_dom = document.createElement('span');
        let span_id = 'span_dom_xt_' + keyword;
        span_dom.style = "background-color:rgb(244, 234, 194);color:rgb(198, 94, 36);font-size:12px;padding:3px 12px 3px 15px;border-radius:3px 3px 3px 3px;margin-right:5px;margin-top:5px;";
        span_dom.innerHTML = keyword+'&nbsp;&nbsp;<span style="color:#666;text-decoration:none;cursor:pointer;" id="'+span_id+'">x</span>';
        document.getElementById('show_filter_keyword').appendChild(span_dom);
        document.getElementById(span_id).addEventListener('click', function(){
            this.parentNode.remove();
            let values = GM_getValue(f_key);
            values.splice(values.indexOf(keyword), 1);
            GM_setValue(f_key, values);
        });
    }
    function show_page(){
        if(is_first){document.body.style.display = 'block';}
    }
})();