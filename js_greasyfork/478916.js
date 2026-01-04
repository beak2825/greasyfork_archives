// ==UserScript==
// @name         idlepoe预设天赋
// @namespace    http://yournamespace.com
// @version      0.2.3
// @description  对网页版idlepoe进行天赋预设
// @author       Your Name
// @match        *://*.idlepoe.com/*
// @match        *://idlepoe.com/*
// @match        *://poe.faith.wang/*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/478916/idlepoe%E9%A2%84%E8%AE%BE%E5%A4%A9%E8%B5%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/478916/idlepoe%E9%A2%84%E8%AE%BE%E5%A4%A9%E8%B5%8B.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // 创建一个变量来跟踪脚本是否启用
    let scriptEnabled = true;

    // 创建一个函数来启用或禁用脚本
    function toggleScript() {
        scriptEnabled = !scriptEnabled;
        if (scriptEnabled) {
            // 启用脚本
            container.style.display = 'block'; // 显示脚本容器
        } else {
            // 禁用脚本
            container.style.display = 'none'; // 隐藏脚本容器
        }
    }

  

    // 创建一个按钮来启用/禁用脚本

    scriptEnabled = localStorage.getItem("scriptEnabled")==='false'?false:true;
    const toggleButton = document.createElement('button');
    toggleButton.textContent = scriptEnabled?'隐藏脚本':'显示脚本';
    
    toggleButton.style.position = 'fixed';
    toggleButton.style.top = '10px';
    toggleButton.style.left = '20px';

    // 设置按钮的点击事件
    toggleButton.addEventListener('click', toggleScript);

    // 添加按钮到页面
    document.body.appendChild(toggleButton);

    // 创建一个容器用于样式设置
    const container = document.createElement('div');
    container.style.position = 'absolute'; // 使用相对定位
    container.style.top = '35px';
    container.style.left = '10px';
    container.style.zIndex = '99999';

    container.style.width = '400px'; // 设置容器的宽度
    container.style.height = '300px'; // 设置容器的高度

    container.style.textAlign = 'left'; // 设置按钮和输入框居左
    container.style.padding = '10px'; // 添加内边距
    container.style.display = scriptEnabled ? 'block' : 'none'; // 根据脚本启用状态设置显示/隐藏

     // 创建一个下拉选择框用于选择请求方法
    const methodSelect = document.createElement('select');
    methodSelect.id = 'methodSelect';
    methodSelect.style.marginBottom = '10px'; // 设置下拉选择框下边距

    const presetSelect = document.createElement('select');
    presetSelect.id = 'presetSelect';
    presetSelect.innerHTML = `
    <option value="20BD">20级BD</option>
    <option value="40BD">40级BD</option>
    <option value="50BD">50级BD</option>
    <option value="60BD">60级BD</option>
    <option value="80BD">80级BD</option>
    <option value="86BD">86贵族电弧</option>
    <option value="100thurder">100女巫电弧</option>
    <option value="100BD">100游侠电打</option>
    <option value="100fire">100女巫火球</option>
    <option value="100hengsao">100暗影横扫</option>
    <option value="100决斗电打">100决斗电打</option>
    <option value="100游侠爪电打">100游侠爪电打</option>
    <option value="100决斗爪电打">100决斗爪电打</option>
    `;

    // 创建一个按钮元素(填入预设天赋）
    const fillContentButton = document.createElement('button');
    fillContentButton.textContent = '获取';
    fillContentButton.style.width = '72px';
    fillContentButton.style.height = '27px';


    // 添加选项：POST
    const postOption = document.createElement('option');
    postOption.value = 'POST';
    postOption.textContent = 'POST';
    methodSelect.appendChild(postOption);

     // 添加选项：GET
    const getOption = document.createElement('option');
    getOption.value = 'GET';
    getOption.textContent = 'GET';
    methodSelect.appendChild(getOption);



    // 添加选项：PUT
    const putOption = document.createElement('option');
    putOption.value = 'PUT';
    putOption.textContent = 'PUT';
    methodSelect.appendChild(putOption);

    // 创建一个输入框用于输入请求地址 (不可见)
    const urlInput = document.createElement('input');
    urlInput.type = 'text';
    urlInput.value = 'https://poe.faith.wang/api/skilltree'; // 设置默认请求地址
    urlInput.style.display = 'none'; // 设置输入框不可见

    // 创建一个文本框用于输入请求头（不可见）
    const headersInput = document.createElement('textarea');
    headersInput.style.display = 'none'; // 隐藏整个文本区域
    headersInput.id = 'hiddenHeaders'; // 用于存储请求头内容

    // 创建一个输入框用于输入 Authorization 头部
    const authorizationInput = document.createElement('input');
    authorizationInput.type = 'text';
    authorizationInput.placeholder = '天赋页面自动获取或输入';
    authorizationInput.style.display = 'block'; // 设置为块级元素，使其垂直排列
    authorizationInput.style.marginBottom = '10px'; // 设置输入框下边距
    authorizationInput.style.width = '185px';

    // 创建一个文本区域用于输入请求内容
    const requestBodyInput = document.createElement('textarea');
    requestBodyInput.placeholder = '请输入天赋树代码或点击预设获取';
    requestBodyInput.rows = 5; // 设置文本区域的高度
    requestBodyInput.style.display = 'block'; // 设置为块级元素，使其垂直排列
    requestBodyInput.style.marginBottom = '10px'; // 设置文本区域下边距

     // 添加按钮的点击事件处理程序
    fillContentButton.addEventListener('click', function() {
    // 获取选择的预设值
    let selectedPreset = presetSelect.value;



    // 根据选择的预设值设置请求内容
     if (selectedPreset === '20BD') {
        requestBodyInput.value = '\{"passives":["58833","15144","35179","9009","60532","918","28221","24643","33545","28574","51786","24496","39861","49978","9355","4011","5823","8938","59606","1427","51235","18707","1461","49900","5802"]\}';
    } else if (selectedPreset === '40BD') {
        requestBodyInput.value = '\{"passives":["58833","15144","35179","9009","60532","918","28221","24643","33545","28574","51786","24496","39861","49978","8938","59606","1427","51235","18707","9355","4011","5823","6538","38662","50338","5616","27283","31508","48099","65210","32117","54142","3187","2715","903","1461","49900","5802","3424","36287","20807"]\}';
    } else if (selectedPreset === '50BD') {
        requestBodyInput.value = '\{"passives":["33558","38662","3424","9009","65210","8938","51235","35851","18707","46408","5823","49900","57248","35179","58833","46277","48477","24496","23507","20807","5802","32555","33903","39861","9355","2715","54142","54338","28221","1461","31508","59606","30205","51786","60592","36287","20812","33545","49978","6538","12412","4011","27283","60532","32117","15144","8348","24643","47484","3309","5616","48099","1427","50338","3187","6534","9786","22266","918","19506"]\}';
    } else if (selectedPreset === '60BD') {
        requestBodyInput.value = '\{"passives":["9009","35851","18707","58833","23507","9355","19506","32555","39861","1461","6534","20807","36287","5823","49900","32117","3424","46408","33903","33545","47484","38662","48477","31508","12412","24643","48099","6538","60532","50338","22266","49978","1427","33558","28221","51786","4011","5802","60592","15144","8348","8938","57248","46277","54338","3309","918","51235","24496","59606","30205","20812","27283","3187","54142","35179","9786","65210","2715","5616","9877","25058","21835","35894","35283","28754","10763","24050","40644","42686","21575","20546"]\}';
    }
      else if (selectedPreset === '80BD') {
        requestBodyInput.value = '\{"passives":["9355","48099","51786","4011","35179","21835","1461","49900","65210","21575","22266","28221","3309","42686","48477","28754","32117","33545","15144","30205","27283","9877","9009","46408","47484","12412","57248","51235","31508","24496","54142","5616","60592","35851","58833","23507","5823","33903","6538","32555","8938","918","9786","38662","24643","60532","5802","24050","19506","1427","59606","20812","25058","35894","39861","49978","54338","3187","2715","36287","50338","8348","35283","10763","40644","46277","20546","18707","6534","20807","3424","33558","21301","37671","12189","5875","9788","27659","8948","27929","2292","27203","48362","11420","1346","44723","16790","53493","18866","739","1957","33296","4184","30225","58604","12852"]\}';
    } else if (selectedPreset === '86BD') {
        requestBodyInput.value = '\{"passives":["35283","44723","38176","60405","49978","2715","5802","36287","7938","33558","37671","9469","903","53493","58833","50472","9786","32710","46408","20807","21301","45456","44183","39861","32555","35894","42686","9788","4011","54657","41635","30225","24050","47062","9432","59220","16790","1427","12189","36221","11420","28754","24496","15144","18707","35179","14021","63067","37504","1346","34157","60532","28012","58604","12852","59606","21835","9009","33545","11551","51235","7555","3309","9206","49651","22266","1031","21575","25058","65502","3187","11688","12412","4036","49605","5823","9877","49900","12379","47507","8938","5875","60440","61981","22972","19635","51786","9355","27283","3424","1461","47306","27415","56153","15228","20546","28574","63843","31508","36858","49929","10763","41866"]\}';
    }
      else if (selectedPreset === '100thurder') {
        requestBodyInput.value = '\{"passives":["7594","42686","57264","44183","32431","23507","18033","5296","15599","20546","49588","739","32455","33296","39841","18866","36858","30205","63398","46469","44529","44184","25757","11645","4367","28754","33545","27415","46842","30471","11420","34157","54694","48477","10575","54657","6237","61981","24050","49254","33310","7444","44723","6764","17735","7938","36121","65097","64210","40100","57736","57248","54338","1957","40366","32710","51923","33435","4184","21835","60440","25058","35894","21974","35283","9788","7555","46408","47306","36678","63447","49605","9877","15228","54447","25831","1346","44955","58763","28859","37671","52655","60405","55647","21262","48778","49929","36452","32932","53493","4397","56716","12143","28574","58402","42760","4036","19501","34579","46092","12379","16790","9432","61264","5875","41635","5935","47507","21575","9392","7153","33903","10763","5823","57362","55571","55332","21301","12189","14021"]\}';
    }
      else if (selectedPreset === '100BD') {
        requestBodyInput.value = '\{"passives":["34579","28221","56001","45035","35283","50150","59220","38344","24865","9469","60942","23439","3187","5622","17201","5823","29856","49621","30471","51786","56460","25209","22266","65033","25058","1568","60532","28012","35053","18670","21575","6","10017","54142","28754","5616","21835","42686","15144","15842","50459","33558","4565","24641","2715","34031","1201","903","64878","54338","64024","9009","56509","50338","14056","48477","4011","49978","46408","33903","20807","12720","24643","31508","60002","9355","7085","10763","59151","38664","9877","9786","65502","28574","465","52213","30626","54354","27283","63139","61306","38662","37504","33545","5408","35179","30679","1698","6538","6108","36281","57839","40100","11651","45436","25456","6580","61636","34400","45491","39861","35894","19506","39524","48807","57080","24914","918","9015","30155","22423","42104","24496","43514","32555","6741","12412","3309","37647","61050"]\}';
    }else if (selectedPreset === '100fire') {
        requestBodyInput.value = '\{"passives":["11420","46842","53493","20546","16743","21262","37671","55332","16790","36774","39743","17735","19506","50382","21575","47062","885","33903","49254","1346","5935","46408","54694","44529","30471","25058","27415","57264","40100","7938","33545","36678","49651","12379","24324","32710","56153","49929","65097","1031","32932","21934","17579","63398","7594","28754","34560","58833","48778","54657","60440","37163","42760","35179","54338","5875","44723","34661","11551","28574","34579","9392","33296","40366","47306","9788","33435","19635","30205","35894","55571","38176","62103","36858","9009","36452","60405","42686","34157","7555","35283","44824","64210","6764","51923","41635","50472","24050","10575","28859","57457","11688","4036","60532","18033","61981","21301","47507","46092","7444","14021","49605","44183","15228","4184","13573","21835","58402","45456","12143","5823","9432","10763","54144","6237","57736","22972","63067","12189","9877"]\}';
    }else if (selectedPreset === '100hengsao') {
        requestBodyInput.value = '\{"passives":["23852","61636","37647","20953","41689","30679","59606","12407","2715","25682","9976","56355","29543","32519","47484","26188","1201","58803","37504","59928","34400","21835","49621","5802","22266","47065","9786","43316","48477","63723","58545","35851","17383","25058","20807","33718","26096","42637","30030","42104","54142","65107","24083","49571","3424","14930","46408","3309","4940","61262","903","23038","57953","16860","51235","1427","19210","59252","32059","9469","45491","29937","7085","9877","60153","49900","5823","44683","60942","38664","58831","57080","35283","57248","20018","16544","15678","5233","3644","28754","23507","45202","18707","12412","45272","6113","37501","36287","34513","24914","59220","31508","63282","17201","35894","28012","19730","46277","39023","32555","54338","5237","8544","32053","30205","14813","60592","12769","6363","9995","52090","41866","65502","65427","3187","29185","33558","38772","1461","33903"]\}';
    }else if (selectedPreset === '100决斗电打') {
        requestBodyInput.value = '\{"passives":["15842","7085","23439","2715","5622","21835","30894","12412","903","42104","31508","36849","51786","34579","6538","6","3309","49900","9015","465","11651","29359","50986","1461","28754","30471","60532","9009","33903","20807","59606","54354","5408","4011","10763","32555","1427","21575","30679","35283","39524","10017","39725","65502","60737","30626","65033","42623","918","30205","45227","17934","28574","56509","19506","9469","56803","25456","60942","24643","54142","38662","24377","23507","45491","29856","1698","38344","64769","57080","24641","6108","45035","54338","1568","36287","1201","46408","15144","30155","35179","5823","62694","25058","28221","59151","50338","35894","18707","63139","52213","39861","49621","57248","40100","9786","33545","8938","9355","48477","7263","61306","3187","9877","37504","33558","24496","59220","60002","42686","25209","3424","5802","6580","22266","51235","23886","12720","49978","48807"]\}';
    }else if (selectedPreset === '100游侠爪电打') {
        requestBodyInput.value = '\{"passives":["28012","5629","32555","45491","30155","465","9015","33903","49568","63139","39524","54338","60737","5622","35894","57080","41536","51786","25209","5408","37504","40100","28754","35384","30894","6580","25456","47030","46277","54791","59220","17934","30205","5802","54142","30471","48807","58069","42686","29359","6538","1201","33558","59252","3656","9469","10763","25775","20807","37887","59606","7085","62712","45788","36287","65502","2121","30745","17908","15842","38662","49978","33545","34579","62069","3309","50459","50338","21835","1600","35283","49900","28503","265","56648","42104","28574","8938","21575","15614","9877","61306","30679","30626","46408","2715","24641","41250","38129","60942","9786","3187","22266","36222","45035","47321","12412","23439","6","65033","39861","40644","49621","31508","63727","10843","5823","24050","31583","3424","36225","11651","42623","25058","63639","1461","24496","903","60002","11678"]\}';
    }else if (selectedPreset === '100决斗爪电打') {
        requestBodyInput.value = '\{"passives":["61306","58069","38662","30679","30894","28754","9786","40100","30205","38344","54338","1461","1201","24641","35384","49978","60737","60002","36225","39861","25209","24377","918","5802","62694","35283","5622","2121","51786","35894","9009","3187","28503","24050","45788","12412","34579","25775","39718","24496","5823","38520","56648","2715","59220","15614","3656","30455","46408","33903","54142","63139","14804","52157","32555","465","15144","37504","3309","30471","3424","59252","4481","30626","65033","28221","45491","54791","23507","28658","12794","1891","48477","28574","30155","5408","30745","6580","49621","265","57080","25456","10017","49568","25511","17908","50338","42104","28012","36287","48807","22266","5629","33558","41119","35179","33545","49900","6538","65502","10763","8938","50986","24643","59606","20807","56646","15842","9469","60942","39725","11651","6","59009","46277","45227","903","7085","31508","56803"]\}';
    }



    });

    // 创建一个按钮用于发送接口测试请求
    const sendRequestButton = document.createElement('button');
    sendRequestButton.textContent = '发送接口请求';
    sendRequestButton.style.display = 'block'; // 设置为块级元素，使其垂直排列
    sendRequestButton.style.width = '185px';

    const { fetch: originalFetch } = window;
    unsafeWindow.fetch = async (...args) => {
    let [resource, config ] = args;
        if(resource === '/api/skilltree'){
        let headers = config.headers['Authorization'];
        // 使用Clipboard API将字符串复制到粘贴板
        authorizationInput.value = headers;
        let body = config.body;
        navigator.clipboard.writeText(body).then(function(){
        console.log("复制请求头信息并打印控制台");});
      }

      let response = await originalFetch(resource, config);

      return response;
    };






    // 设置按钮的样式
    sendRequestButton.style.backgroundColor = 'white';
    sendRequestButton.style.color = 'black';
    sendRequestButton.style.padding = '10px 20px';
    sendRequestButton.style.border = '1px solid black';
    sendRequestButton.style.borderRadius = '5px';
    sendRequestButton.style.cursor = 'pointer';

    // 监听按钮点击事件
    sendRequestButton.addEventListener('click', function() {
        const selectedMethod = methodSelect.value;
        const url = urlInput.value; // 获取默认请求地址
        const authorization = authorizationInput.value; // 获取用户输入的 Authorization 头部内容
        const requestBody = requestBodyInput.value;

        // 构建请求头
        const headers = `content-type: application/json
authority: idlepoe.com
accept: */*
accept-language: zh-CN,zh;q=0.9
Authorization: ${authorization}`; // 使用用户输入的 Authorization 头部内容

        // 将请求头内容放入隐藏的文本区域，以备后续使用
        document.getElementById('hiddenHeaders').value = headers;

        GM_xmlhttpRequest({
            method: selectedMethod,
            url: url, // 使用默认请求地址
            headers: parseHeaders(headers), // 解析自定义请求头
            data: requestBody,
            onload: function(response) {
                const jsonObj = JSON.parse(response.responseText);
                console.log(jsonObj);
                if(jsonObj.message === '非法数据'){
                    alert('接口响应数据: ' + '角色不对请重新选择');
                }else if(jsonObj.message === 'unexpected end of JSON input'){
                    alert('接口响应数据: ' + '请点击获取天赋树json或粘贴天赋树json');
                }else if(jsonObj.success == true){
                    alert('接口响应数据: ' + '已完成');
                }
                 else{

                    alert('接口响应数据: ' + response.responseText);
                }
            },
            onerror: function(error) {
                alert('请求失败: ' + error.statusText);
            }
        });
    });

    // 将元素按照垂直顺序添加到容器
    container.appendChild(methodSelect);
    container.appendChild(urlInput);
    container.appendChild(headersInput);
    container.appendChild(authorizationInput);
    container.appendChild(requestBodyInput);
    container.appendChild(sendRequestButton);
    container.appendChild(presetSelect);
    container.appendChild(fillContentButton);

    // 将容器添加到页面
    document.body.appendChild(container);

    // 解析自定义请求头
    function parseHeaders(headers) {
        const parsedHeaders = {};
        if (headers) {
            const headerLines = headers.split('\n');
            for (const line of headerLines) {
                const [name, value] = line.split(':');
                if (name && value) {
                    parsedHeaders[name.trim()] = value.trim();
                }
            }
        }
        return parsedHeaders;
    }
})();
