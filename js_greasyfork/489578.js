// ==UserScript==

// @name         SeaTable ContentEncrypt
// @name:zh-CN   SeaTable内容加密

// @description  Message encryption or decryption (or replace to hide)
// @description:zh-cn 内容的加密和解密（或者替换隐藏）

// @namespace    http://tampermonkey.net/
// @version      2024-05-29
// @author       oraant
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT

// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @match        *://*:4480*
// @match        *://*.192.168.1.2:4480/*
// @match        *://*.seatable.cn/*
// @match        *://*.table.everything.pub/*
// @match        *://*.biz.oraant.cc/*
// @match        *://*.generate.wiki/*

// @downloadURL https://update.greasyfork.org/scripts/489578/SeaTable%20ContentEncrypt.user.js
// @updateURL https://update.greasyfork.org/scripts/489578/SeaTable%20ContentEncrypt.meta.js
// ==/UserScript==





// === 基础工具方法 ==================================================================================================================================================================================================


// 解密复制并编辑
// 增加MO防抖，优化性能（单次后disconnect，过几秒重新link）


/*--- 等到某些元素出现后，触发函数:  A utility function, for Greasemonkey scripts, that detects and handles AJAXed content. */

function waitForKeyElements ( /* IMPORTANT: This function requires your script to have loaded jQuery. */
    selectorTxt,    /* Required: The jQuery selector string that specifies the desired element(s). */
    actionFunction, /* Required: The code to run when elements are found. It is passed a jNode to the matched element. */
    bWaitOnce,      /* Optional: If false, will continue to scan for new elements even after the first match is found. */
    iframeSelector  /* Optional: If set, identifies the iframe to search. */
) {
    var targetNodes, btargetsFound;

    if (typeof iframeSelector == "undefined")
        targetNodes     = $(selectorTxt);
    else
        targetNodes     = $(iframeSelector).contents().find(selectorTxt);

    if (targetNodes  &&  targetNodes.length > 0) {
        btargetsFound   = true;
        /*--- Found target node(s).  Go through each and act if they are new. */
        targetNodes.each ( function () {
            var jThis        = $(this);
            var alreadyFound = jThis.data ('alreadyFound')  ||  false;

            if (!alreadyFound) {
                //--- Call the payload function.
                var cancelFound     = actionFunction (jThis);
                if (cancelFound)
                    btargetsFound   = false;
                else
                    jThis.data ('alreadyFound', true);
            }
        } );
    }
    else {
        btargetsFound   = false;
    }

    //--- Get the timer-control variable for this selector.
    var controlObj      = waitForKeyElements.controlObj  ||  {};
    var controlKey      = selectorTxt.replace (/[^\w]/g, "_");
    var timeControl     = controlObj [controlKey];

    //--- Now set or clear the timer as appropriate.
    if (btargetsFound  &&  bWaitOnce  &&  timeControl) {
        //--- The only condition where we need to clear the timer.
        clearInterval (timeControl);
        delete controlObj [controlKey]
    }
    else {
        //--- Set a timer, if needed.
        if ( ! timeControl) {
            timeControl = setInterval ( function () {
                    waitForKeyElements ( selectorTxt, actionFunction, bWaitOnce, iframeSelector );
                },
                300
            );
            controlObj [controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj   = controlObj;
}



/* 复制函数，使用新旧API，尝试兼容所有浏览器 */

const copyText = async (val) => {
  if (navigator.clipboard && navigator.permissions) {
    await navigator.clipboard.writeText(val)
  } else {
    console.log('old style copy')
    const textArea = document.createElement('textArea')
    textArea.value = val
    textArea.style.width = 0
    textArea.style.position = 'fixed'
    textArea.style.left = '-999px'
    textArea.style.top = '10px'
    textArea.setAttribute('readonly', 'readonly')
    document.body.appendChild(textArea)

    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
  }
}



/* 偷偷在右下角展示信息 */

function hide_show(msg){ // 不要用console.log，容易留下日志和记录
    if ( $('#hidden_message').length > 0 ){
        $('#hidden_message').text(msg)
    } else {
        $('body').append(`<span id='hidden_message' style='position:absolute; right:10px; bottom:5px; z-index:9999; background:#FFF0; color:black; opacity:0.1;'>` + msg + `</span>`)
    }
}
function hide_hide(){
    if ( $('#hidden_message').length > 0 ){ $('#hidden_message').remove() }
}
function hide_toggle(msg){
    if ( $('#hidden_message').length > 0 ){ hide_hide() }
    else { hide_show(msg) }
}



/* 富文本转纯文本 */

function convertToPlain(html){
    var tempDivElement = document.createElement("div");
    tempDivElement.innerHTML = html;
    return tempDivElement.textContent || tempDivElement.innerText || ""
}



// === 页面调整 ==================================================================================================================================================================================================



// 增加密码相关按钮


waitForKeyElements('div.tables-tabs-operations', function(){ // 增加触发加密窗口的按钮（依赖设置密码按钮！！！）
    $('head').append(`
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
        <style type="text/css" id="custom_btn_css">
            /* 自定义图标 */
            .fa {color:white; cursor:pointer;}

            /* 插件按钮排版 */
            .tables-tabs-operations span{margin:0 2px;}

            /* 批量加密解密窗口 */
            #batch_encode_decode_container:hover {opacity:1!important}

            /* 加密解密渲染单元格 */
            .render-color { color:#614cff; }
            .render-weight { font-weight:bold; }
        </style>
        `)
    $('body').append(`
        <div id="batch_encode_decode_container" style='position:absolute; right:10px; bottom:40px; padding:5px; width:40%; height:20%; z-index:1000; background-color:#0003; border-radius:3px; display:none; opacity:0.3'>
            <textarea id='batch_in'  title='要加密或解密的内容，尽量不要带空格，每行为一串' placeholder='无[]包裹时，正行字符串都将被加密。例：\n张三\n我是[张三]啊\n\n也可以输入含有<>的来解密。例：\n<******>\n我是<******>啊' style='flex:1 1 auto; padding:5px; background: #fcfcfc;          border-radius:3px; margin-right:5px;'></textarea>
            <textarea id='batch_out' title='加密或解密后的结果，可以随便的复制，每行为一串' placeholder='解密后的内容为：\n<******>\n我是<******>啊\n\n加密后的内容为：\n张三\n我是{张三}啊'                                     style='flex:1 1 auto; padding:5px; background: #ddd; color:gray; border-radius:3px;'></textarea>
        </div>
        `)
    $('#batch_in').on('input', batch_editing_hdlr)
    $('div.tables-tabs-operations').prepend(`
        <div class='tables-input'>  <span id="encode_and_copy_btn"     class="fa fa-edit"         title='加密某段内容并自动复制到粘贴板（Ctrl+Y）'>     </span></div>
        <div class='tables-batch'>  <span id="batch_encode_decode_btn" class="fa fa-list"         title='批量加密解密'>                                 </span></div>
        <div class='tables-wrong'>  <span id="toggle_true_passwd_btn"  class="fa fa-circle-check" title='正在使用正确密码'>                             </span></div>
        <div class='tables-pause'>  <span id="toggle_auto_decode_btn"  class="fa fa-toggle-on"    title='正在自动解密'>                                 </span></div>
        <div class='tables-subkey'> <span id="set_password_last_part"  class="fa fa-key"          title='设置密码的后半段（可用Ctrl+M查看修改效果）'>   </span></div>
    `)
    $('#encode_and_copy_btn')    .on('click', encode_and_copy)
    $('#batch_encode_decode_btn').on('click', toggle_batch_edit)
    $('#toggle_true_passwd_btn') .on('click', toggle_true_passwd)
    $('#toggle_auto_decode_btn') .on('click', toggle_auto_decode)
    $('#set_password_last_part') .on('click', set_key)
})



// === 获取或设定密码 ==================================================================================================================================================================================================



// 假装密码错误

let use_true_password = true // 是否使用正确密码（关闭后，可用用来假装密码错误的情况）
function toggle_true_passwd(){
    use_true_password = !use_true_password
    $('#toggle_true_passwd_btn').attr('class', use_true_password ? 'fa fa-circle-check' : 'fa fa-circle-xmark' )
    $('#toggle_true_passwd_btn').attr('title', use_true_password ? '正在使用正确密码' : '正在假装密码错误' )
}


// 读取密码

let key // 只要使用文本做密码， crypto-js 会自动使用最安全的AES256算法来加密
function get_key(){ // 将在线的云标签密码，和本地存储的字符串，拼接起来作为密码
    let password_first_part = $('span.tab-title:last').text();
    let password_fake_part = use_true_password ? '' : 'asdf';
    let password_last_part = GM_getValue('password_last_part', '');
    key = password_first_part + password_fake_part + password_last_part;
}
waitForKeyElements('span.tab-title', get_key) // 一开始得先获取一次，给后面用


// 设置密码（右上角添加按钮）


function set_key(){ // 设置本地存储的字符串（在线的云标签密码需要去云上设置）
    let input = prompt('请输入要设置的密码后半部分，并回车\n\n注意！注意！注意！\n\n1，请不要添加任何空格或换行！这可能会导致无法正常加密解密！！进而导致数据丢失！！!'); // 展示的真实密码隐藏在了天地中间
    if (!!input){
        let plain = convertToPlain(input.trim().replace(/\s/g,'').replace(/\n/g,''))
        GM_setValue('password_last_part', plain);
        get_key()
        // console.log(plain, key)
    }
}


// 展示密码（右下角隐晦展示，Ctrl + M 切换）


document.addEventListener("keydown", (event) => { // 按下 Ctrl + M 切换展示密码
     if(event.ctrlKey && event.keyCode === 77){
         get_key()
         hide_toggle(key)
     }
}, false)



// === 加密或解密的工具方法 ==================================================================================================================================================================================================



// 弹出批量加密解密窗口


function toggle_batch_edit(){
    let displaying = $('#batch_encode_decode_container').css('display')
    $('#batch_encode_decode_container').css('display', displaying == 'none' ? 'flex' : 'none')
}


function batch_editing_hdlr(e){ // 监听到批量编辑窗口有输入
    let lines = $('#batch_in').val().trim().split('\n')
    let results = ''

    console.log(lines)

    lines.forEach(function(line) {
        if (!!line){
            if ( /(.*)(\<.+?\>)(.*)/.test(line) ){
                results += match_and_decode(line).replace(/^\{/,'').replace(/\}$/,'') + '\n'
            }
            else{
                let inside_wrap = ( /(.*)(\[.+?\])(.*)/.test(line) ) // 若带有[]则只加密被[]包裹的内容，否则加密全部内容
                if ( !inside_wrap ) { line = '[' + line + ']' }
                results += match_and_encode(line) + '\n'
            }
        } else if (line == ''){
            results += '\n'
        }
    });

    $('#batch_out').val(results)
}



// 弹出单次加密窗口。输入文本后，自动加密并写入剪贴板。


function encode_and_copy(){
    if (!key) {
        alert('密码读取失败，请稍后片刻');
        return;
    }

    let input = prompt('请输入要加密的内容后回车，程序会自动将加密后的文本复制到粘贴板\n\n注意！注意！注意！\n\n1，请不要添加任何空格或换行！这可能会导致无法正常加密解密！！进而导致数据丢失！！!\n\n2，请确保该网页有复制粘贴的权限，没有权限时无法正确写入粘贴板，可以用Win+V确认！！\n');

    if (!!input){
        let plain = convertToPlain(input.trim().replace(/\s/g,'').replace(/\n/g,''))
        let wrap = '[' + plain + ']'
        let code  = match_and_encode( '[' + plain + ']' )
        copyText(code)
    }
}


// 自动解密所有相关文本


function render_cell(cell, flat=false, title=false, color=false, bold=false){
    if (/(.*)(\<.+?\>)(.*)/.test(cell.text())){
        let text = match_and_decode(cell.text())
        if (flat) {text = text.replace(/{/g, '').replace(/}/g, '')}
        cell.text( text );
        if (title) { cell.attr('title', text) }
        if (color) { cell.addClass('render-color') }
        if (bold) { cell.addClass('render-weight') }
    }
}
function render_all(cell){
    $('div.tab-content span.tab-title').each(function(){ render_cell( $(this), true, false, true, false ); }); /* 表格标签标题 */
    $('div.group-item div.group-cell-value').each(function(){ render_cell( $(this), true, false, true, false ); }); /* 分组时的标题 */
    $('div.option-editor-container div.option-name').each(function(){ render_cell( $(this), true, true, false, true ); }); /* 分组时的标题 */

    $('div.grid-cell-type-default').each(function(){ render_cell( $(this), true, true, true, false ); }); /* 单元格 - 普通 */
    $('div.grid_cell_type_single-select').each(function(){ render_cell( $(this), true, true, false, true ); }); /* 单元格 - 单选 */
    $('div.link span.link-name').each(function(){ render_cell( $(this), true, true, true, false ); }); /* 单元格 - 引用 */
    $('div.react-grid-Cell-link-formula div.grid-cell-type-formula-text').each(function(){ render_cell( $(this), true, true, true, false ); }); /* 单元格 - 链接公式 - 文本 */
    $('div.react-grid-Cell-link-formula div.grid_cell_type_').each(function(){ render_cell( $(this), true, false, false, true ); }); /* 单元格 - 链接公式 - 单选 */

    $('div.row-card-content div.row-card-item-name').each(function(){ render_cell( $(this), true, false, true, false ); }); /* 链接选择卡片 - 标题行 */
    $('div.row-card-content span.cell-value-ellipsis').each(function(){ render_cell( $(this), true, false, true, false ); }); /* 链接选择卡片 - 普通行 */
    $('div.row-card-content div.grid_cell_type_').each(function(){ render_cell( $(this), true, false, true, false ); }); /* 链接选择卡片 - 链接公式 */
}


// === 主动加密或自动解密 ==================================================================================================================================================================================================



// 加密窗口的触发方式（按钮或快捷键）


document.addEventListener("keydown", (event) => { // Ctrl + Y 触发
     if(event.ctrlKey && event.keyCode === 89){ encode_and_copy() }
}, false)


// 开关定时自动解密功能


let auto_decode = true; // 手动切换解密或暂停
function toggle_auto_decode(){
    auto_decode = !auto_decode;
    $('#toggle_auto_decode_btn').attr('class', auto_decode ? 'fa fa-toggle-on' : 'fa fa-toggle-off' )
    $('#toggle_auto_decode_btn').attr('title', auto_decode ? '正在自动解密' : '自动解密已停' )
}


// 定时自动解密（Todo: 待优化，根据页面变动、间隔时间、触发）


function render_trigger(){
    if (!auto_decode) return;
    get_key()
    render_all()
}

setInterval(render_trigger, 500); // 性能大幅优化，可以避免短时间内大批量的MO，也能避免长时间无MO时白白触发




// === 加密或解密时的工具方法 ==================================================================================================================================================================================================



// 从字符串中寻找标签，自动替换为加密/解密后的内容

function match_and_encode(text) { // 递归查询所有匹配的串（可嵌套）并加密：要加密的内容请用[]包裹
  let reg = /(.*)(\[.+?\])(.*)/

  while (reg.test(text)) {
    let temp = text.replace(reg, function ($, $1, $2, $3) { // 从前往后分别为，匹配到的字符串，第一个参数、第二个参数、等等
      // console.log('inside: '+ $ + ' = ' + $1, $2, $3)
      return $1 + encode_and_wrap($2) + $3; // 用返回值替换掉 $ 。且若g模式多次匹配，则自动多次调用。可以参考最下方的正则替换案例
    });
    text = temp
  }

  // console.log('encode to: '+text)
  return text
}

function match_and_decode(code) { // 递归查询所有匹配的串（可嵌套）并解密：要解密的内容请用<>包裹
  let reg = /(.*)(\<.+?\>)(.*)/

  while (reg.test(code)) {
    let temp = code.replace(reg, function ($, $1, $2, $3) { // 从前往后分别为，匹配到的字符串，第一个参数、第二个参数、等等
      // console.log('inside: '+ $ + ' = ' + $1, $2, $3)
      return $1 + decode_and_wrap($2) + $3; // 用返回值替换掉 $ 。且若g模式多次匹配，则自动多次调用。可以参考最下方的正则替换案例
    });
    code = temp
  }

  // console.log('decode as: '+code)
  return code
}


// 使用AES/DES加密：https://blog.51cto.com/u_14522578/6010478 // 采用AES256算法，以本世代的人类文明，没有任何可能暴力破解（可以参考三蓝一黄对256位密码暴力破解难度的介绍）


function encode_and_wrap(text) { // 加密被[]包裹的字符串，并将[]转为<>，表示已加密（注意，是带着方括号一起加密的，方便解锁后的验证）
  let encJson = CryptoJS.AES.encrypt(JSON.stringify(text), key).toString()
  let encData = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(encJson))
  let encWrap = '<' + encData + '>'
  // console.log(encJson, '\n', encData, '\n', encWrap, '\n')
  return encWrap
}

function decode_and_wrap(code) { // 解密被<>包括的字符串，并将<>转为{}，表示已解密
  let decWrap = code.replace(/^</,'').replace(/>$/,'');
  let decData; let decBytes; let decText;

  try { decData = CryptoJS.enc.Base64.parse(decWrap).toString(CryptoJS.enc.Utf8) }
  catch(err) { return '{文本错误}' } // base64解压失败，可能是字符串出现了问题

  try { decBytes = CryptoJS.AES.decrypt(decData, key).toString(CryptoJS.enc.Utf8) }
  catch(err) { return '{解密失败}' } // AES解密失败，可能是密码错误

  try { decText = JSON.parse(decBytes) }
  catch(err) { return '{解密无效}' } // AES解密后的JSON文件无效，可能是AES密码错误

  // console.log(decWrap, '\n', decData, '\n', decBytes, '\n', decText)

  if (/^\[.+\]$/.test(decText)){ // 验证是否解密成功
    return decText.replace(/^\[/,'{').replace(/\]$/,'}')
  }
}


















// === 测试和说明、废旧方法等等 ==================================================================================================================================================================================================



// 通过find_editor_element函数，循环搜索正在输入的字符，查找相关的输入框
//
// async function find_editor_element() {
//     console.log('开始查找含有fff的元素')
//     function delay(num) {
//         return new Promise((resolve, reject) => {
//             setTimeout(() => {
//                 // console.log($('div:contains("fff")'))
//                 $('input').each(function(index) {
//                   console.log($(this), '=', $(this).val())
//                 })
//                 resolve()
//             }, num)
//         })
//     };
//     for (let index = 0; index < 20; index++) {
//         console.log(index)
//         await delay(1000)
//         if (index == 10){
//           console.log('pause') // 用于暂停程序，捕捉一瞬即逝的输入框（在Chrome调试页面，给本行打断点既可）（可继续精简代码，但没有必要）
//         }
//     }
// }
// find_editor_element()



// // 用于了解正则匹配替换的案例
//
// var str1 = 'js-plus-plus';
// var str2 = str1.replace(/-(\w)/g, function ($, $1) {
//   console.log('$: '+$, $1);
//   return $1.toUpperCase();
// });
// console.log('str2: '+str2); // jsPlusPlu



// // 加密解密函数的测试
//
// match_and_encode("aaa[bbb[ccc]ddd]eee[fff]ggg[hhh]iii")
// console.log('===  ================================================================================')
// match_and_encode("aaa[bbb[ccc]ddd]]eee[fff]ggg[hhh]iii")
// console.log('===  ================================================================================')
// match_and_encode("aaasd[fasfi]i")
// console.log('===  ================================================================================')
// match_and_encode("aaasd[fasfii")
// console.log('===  ================================================================================')
// match_and_encode("aaasdfasfi]i")



//  字符串压缩（虽然确实短了，但没有视觉效果，所以没啥卵用）
//
//  <script src="https://cdn.jsdelivr.net/npm/lz-string@1.5.0/libs/lz-string.min.js"></script>
//  var string = ciphertext // "你好我好大家好，南天门的张先生";
//  console.log(string + ", " + string.length);
//  var compressed = LZString.compress(string);
//  console.log(compressed + ", " + compressed.length);
//  string = LZString.decompress(compressed);
//  console.log(string + ", " + string.length);



// 监听按键并输入内容 Ctrl + Y
//
// window.onkeydown = function (event) {
//   if(event.ctrlKey && event.keyCode === 89){
//     var result = prompt('请输入要加密的内容');
//     if (!!result){ console.log('<<'+result+'>>'); }
//   }
// }
// window.onkeydown = function (event) {
//   if(event.ctrlKey && event.keyCode === 89){ render_cells }
// }



// 利用MO接口实时解析，虽然响应很快，但是也很麻烦
// let observer1 = new MutationObserver(mutations => {
//   for(let mutation of mutations) {
//       // console.log('===', mutation, mutation.target)
//       if ( mutation.type=='characterData' && mutation.target.parentElement.getAttribute('class') == 'grid-cell-type-default'){ // 普通单元格的文本更改后
//           render_cell($(mutation.target.parentElement))
//       } else if ( mutation.type=='childList' && !!$(mutation.target).attr('class') && $(mutation.target).attr('class').includes('react-grid-Row') && mutation.addedNodes.length>0 ){ // 行中渲染新列时
//           if ( $(mutation.addedNodes[0].childNodes[0].childNodes[0]).attr('class') == 'grid-cell-type-default' ) { render_cell( $(mutation.addedNodes[0].childNodes[0].childNodes[0]) ) }
//           console.log('---', mutation, mutation.target, mutation.addedNodes[0].childNodes[0].childNodes[0])
//       }
//   }
// });
// observer1.observe(document.body, {subtree: true, characterData: true, childList: true});



// 尝试自动加密并转换文本
//
// waitForKeyElements ("input.form-control.editor-main", text_editing); // 通过find_editor_element函数，循环搜索正在输入的字符，才找到的这个输入框
//
// function text_editing(){ // 正在编辑普通文本单元格时
//     $('input.form-control.editor-main').css({'border':'solid 2px RoyalBlue'})
//     // $('input.form-control.editor-main').on('focusout', text_replace);
//     // $('input.form-control.editor-main').on('blur', text_replace); // 注意防抖
//
//     // $('input.form-control.editor-main').on('focusout', function(event){
//     //     console.log('focusout--', event, $('input.form-control.editor-main').val())
//     //     text_replace('a')
//     //     console.log('focusout00', event, $('input.form-control.editor-main').val())
//     // });
//     // $('input.form-control.editor-main').on('blur', function(event){
//     //     console.log('blur--', event, $('input.form-control.editor-main').val())
//     //     text_replace('a')
//     //     console.log('blur00', event, $('input.form-control.editor-main').val())
//     // });
//
//     // $('input.form-control.editor-main').on('blur', text_replace); // 注意防抖
//     //   .onkeypress(function(e) {
//     //     if (e.which == 13) // Enter key
//     //         text_replace()
//     // });
//     // $('input.form-control.editor-main').on('input', debounce(text_replace, 1000)); // 注意防抖
//     // text_replace()
// }
// function text_replace(e){
//   var text = $('input.form-control.editor-main').val()
//   var render = match_and_encode(text)
//   $('input.form-control.editor-main').val(render)
//   // $('input.form-control.editor-main').attr('value', render)
// }



// /* 防抖函数，防止在输入框中频繁更新 via: https://blog.csdn.net/weixin_45385944/article/details/128406238 */
//
// function debounce(func, wait = 1000, immediate = false) {
//     // 定义一个变量来记录上一次的定时器函数的状态
//     let timer = null
//     let isImmediate = false//通过改变量控制函数是否立即执行
//     //返回一个函数
//     return function () {
//         console.log('In Debouncing')
//         let _this = this //获取input的this
//         let args = arguments //接收函数参数
//         // 返回的变量,让函数只执行最后一次
//         if (timer) {
//             clearInterval(timer) //删除上一次定时器
//         }
//         if (immediate && !isImmediate) {//第一次是否需要立即执行 当immediate和isImmediate 都为一个值时回立即执行
//             func.apply(_this, args)
//             isImmediate = true//使函数下次不会立即执行使其延迟
//         } else {
//             timer = setTimeout(function () {//将定时器声明为变量timer
//                 func.apply(_this, args)//如果处理函数需要用到input的this就通过这个apply从新绑定this，不绑定的话treeSearch函数this指向的是window(直接使用下面的func()就行),
//                 // func()//外部传入的函数
//                 isImmediate = true//使函数下次不会立即执行使其延迟
//             }, wait)//延迟执行时间
//         }
//     }
// }



// // 随机生成内容
//
// function sample(items) { // 数组内取样
// 	return items[Math.floor(Math.random()*items.length)];
// }
//
// var name_prefix = ['李', '王', '张', '刘', '陈', '杨', '黄', '赵', '周', '吴', '徐', '孙', '朱', '马', '胡', '郭', '林', '何', '高', '梁', '郑', '罗', '宋', '谢', '唐', '韩', '曹', '许', '邓', '萧', '冯', '曾', '程', '蔡', '彭', '潘', '袁', '於', '董', '余', '苏', '叶', '吕', '魏', '蒋', '田', '杜', '丁', '沈', '姜', '范', '江', '傅', '钟', '卢', '汪', '戴', '崔', '任', '陆', '廖', '姚', '方', '金', '邱', '夏', '谭', '韦', '贾', '邹', '石', '熊', '孟', '秦', '阎', '薛', '侯', '雷', '白', '龙', '段', '郝', '孔', '邵', '史', '毛', '常', '万', '顾', '赖', '武', '康', '贺', '严', '尹', '钱', '施', '牛', '洪', '龚']
// var name_suffix = ['豪', '言', '玉', '意', '泽', '彦', '轩', '景', '正', '程', '诚', '宇', '澄', '安', '青', '泽', '轩', '旭', '恒', '思', '宇', '嘉', '宏', '皓', '成', '宇', '轩', '玮', '桦', '宇', '达', '韵', '磊', '泽', '博', '昌', '信', '彤', '逸', '柏', '新', '劲', '鸿', '文', '恩', '远', '翰', '圣', '哲', '家', '林', '景', '行', '律', '本', '乐', '康', '昊', '宇', '麦', '冬', '景', '武', '茂', '才', '军', '林', '茂', '飞', '昊', '明', '明', '天', '伦', '峰', '志', '辰', '亦', '佳', '彤', '自', '怡', '颖', '宸', '雅', '微', '羽', '馨', '思', '纾', '欣', '元', '凡', '晴', '玥', '宁', '佳', '蕾', '桑', '妍', '萱', '宛', '欣', '灵', '烟', '文', '柏', '艺', '以', '如', '雪', '璐', '言', '婷', '青']
//
// var unit_prefix = ['河北省', '石家庄', '保定市', '秦皇岛', '唐山市', '邯郸市', '邢台市', '沧州市', '承德市', '廊坊市', '衡水市', '张家口', '山西省', '太原市', '大同市', '阳泉市', '长治市', '临汾市', '晋中市', '运城市', '晋城市', '忻州市', '朔州市', '吕梁市', '内蒙古', '呼和浩特', '呼伦贝尔', '包头市', '赤峰市', '乌海市', '通辽市', '鄂尔多斯', '乌兰察布', '巴彦淖尔', '辽宁省', '盘锦市', '鞍山市', '抚顺市', '本溪市', '铁岭市', '锦州市', '丹东市', '辽阳市', '葫芦岛', '阜新市', '朝阳市', '营口市', '吉林省', '吉林市', '通化市', '白城市', '四平市', '辽源市', '松原市', '白山市', '黑龙江省', '伊春市', '牡丹江', '大庆市', '鸡西市', '鹤岗市', '绥化市', '双鸭山', '七台河', '佳木斯', '黑河市', '齐齐哈尔市', '江苏省', '无锡市', '常州市', '扬州市', '徐州市', '苏州市', '连云港', '盐城市', '淮安市', '宿迁市', '镇江市', '南通市', '泰州市', '浙江省', '绍兴市', '温州市', '湖州市', '嘉兴市', '台州市', '金华市', '舟山市', '衢州市', '丽水市', '安徽省', '合肥市', '芜湖市', '亳州市', '马鞍山', '池州市', '淮南市', '淮北市', '蚌埠市', '巢湖市', '安庆市', '宿州市', '宣城市', '滁州市', '黄山市', '六安市', '阜阳市', '铜陵市', '福建省', '福州市', '泉州市', '漳州市', '南平市', '三明市', '龙岩市', '莆田市', '宁德市', '江西省', '南昌市', '赣州市', '景德镇', '九江市', '萍乡市', '新余市', '抚州市', '宜春市', '上饶市', '鹰潭市', '吉安市', '山东省', '潍坊市', '淄博市', '威海市', '枣庄市', '泰安市', '临沂市', '东营市', '济宁市', '烟台市', '菏泽市', '日照市', '德州市', '聊城市', '滨州市', '莱芜市', '河南省', '郑州市', '洛阳市', '焦作市', '商丘市', '信阳市', '新乡市', '安阳市', '开封市', '漯河市', '南阳市', '鹤壁市', '平顶山', '濮阳市', '许昌市', '周口市', '三门峡', '驻马店', '湖北省', '荆门市', '咸宁市', '襄樊市', '荆州市', '黄石市', '宜昌市', '随州市', '鄂州市', '孝感市', '黄冈市', '十堰市', '湖南省', '长沙市', '郴州市', '娄底市', '衡阳市', '株洲市', '湘潭市', '岳阳市', '常德市', '邵阳市', '益阳市', '永州市', '张家界', '怀化市', '广东省', '江门市', '佛山市', '汕头市', '湛江市', '韶关市', '中山市', '珠海市', '茂名市', '肇庆市', '阳江市', '惠州市', '潮州市', '揭阳市', '清远市', '河源市', '东莞市', '汕尾市', '云浮市', '广西省', '南宁市', '贺州市', '柳州市', '桂林市', '梧州市', '北海市', '玉林市', '钦州市', '百色市', '防城港', '贵港市', '河池市', '崇左市', '来宾市', '海南省', '海口市', '三亚市', '四川省', '乐山市', '雅安市', '广安市', '南充市', '自贡市', '泸州市', '内江市', '宜宾市', '广元市', '达州市', '资阳市', '绵阳市', '眉山市', '巴中市', '攀枝花', '遂宁市', '德阳市', '贵州省', '贵阳市', '安顺市', '遵义市', '六盘水', '云南省', '昆明市', '玉溪市', '大理市', '曲靖市', '昭通市', '保山市', '丽江市', '临沧市', '西藏', '拉萨市', '阿里', '陕西省', '咸阳市', '榆林市', '宝鸡市', '铜川市', '渭南市', '汉中市', '安康市', '商洛市', '延安市', '甘肃省', '兰州市', '白银市', '武威市', '金昌市', '平凉市', '张掖市', '嘉峪关', '酒泉市', '庆阳市', '定西市', '陇南市', '天水市', '青海省', '西宁市', '宁夏', '银川市', '固原市', '青铜峡市', '石嘴山市', '中卫市', '新疆', '乌鲁木齐', '克拉玛依市']
// var unit_middle = ['消防', '银行', '运输', '生产', '制造', '炼钢', '纺织', '软件', '运营商', '公安', '工商', '农业', '军事']
// var unit_suffix = ['总局', '分局', '分行', '支行', '总公司', '分公司', '办事网点', '企业', '单位']
//
// var part_prefix = ['会计', '人力', '管理', '资源', '行政', '办公', '监督', '测试', '研发', '调研', '市场', '采购', '运营', '宣传', '安全', '财务', '生产', '技术', '维修', '公关', '决策', '风险', '仓储', '运输', '舆情', '法务']
// var part_suffix = ['部', '所', '处', '室', '局', '处长', '所长', '部门', '局长', '经理', '总裁']
//
// function random_unit(){
//   return sample(unit_prefix) + sample(unit_middle) + sample(unit_suffix)
// }
//
// function random_part(){
//   return sample(part_prefix) + sample(part_suffix)
// }
//
// function random_name(){ // 70%的概率是三个字的名字
//   return Math.random() > 0.8 ? sample(name_prefix) + sample(name_suffix) + sample(name_suffix) : sample(name_prefix) + sample(name_suffix)
// }
//
// // console.log(random_unit(), random_part(), random_name())




// 检测到页面动态后再解密
//
// let has_mutations = false /* 检测页面变化（初始值为假，等页面变化后再使真） */
//
// waitForKeyElements('div.grid-cell-type-default', function(){ // 等表格出现后再监听
//     let observer = new MutationObserver(mutations => { has_mutations = true; });
//     observer.observe(document.body, {subtree: true, childList: true});
//     has_mutations = true; // 第一次出现后，触发一次
// })
// function render_trigger(){
//    if (!has_mutations) return;
//     get_key()
//     render_all()
//    has_mutations = false;
// }