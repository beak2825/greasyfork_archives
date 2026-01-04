// ==UserScript==
// @name         Idle Infinity - 勇者不再受到切技能的痛处
// @version      0.2
// @description  勇者只点一次技能就够啦！！！！
// @author       浮世
// @match        https://www.idleinfinity.cn/Skill/Config2?*
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/users/1199419
// @downloadURL https://update.greasyfork.org/scripts/480863/Idle%20Infinity%20-%20%E5%8B%87%E8%80%85%E4%B8%8D%E5%86%8D%E5%8F%97%E5%88%B0%E5%88%87%E6%8A%80%E8%83%BD%E7%9A%84%E7%97%9B%E5%A4%84.user.js
// @updateURL https://update.greasyfork.org/scripts/480863/Idle%20Infinity%20-%20%E5%8B%87%E8%80%85%E4%B8%8D%E5%86%8D%E5%8F%97%E5%88%B0%E5%88%87%E6%8A%80%E8%83%BD%E7%9A%84%E7%97%9B%E5%A4%84.meta.js
// ==/UserScript==

(function() {
    // 创建一个新的按钮并添加到按钮容器中
    var saveSkillBtn = $('<a/>', {
        'class': 'btn btn-xs btn-success',
        'text': '存储技能',
        'id': 'saveSkillBtn'
    });
    var loadSkillBtn = $('<a/>', {
        'class': 'btn btn-xs btn-info',
        'text': '加载技能',
        'id': 'loadSkillBtn',
        'style':'margin-left:3px'
    });

    $('.pull-right').prepend(loadSkillBtn);
    $('.pull-right').prepend(saveSkillBtn);

    //爱液的装备弹窗，直接一个的复制
    var modalHtml = `
    <div class="modal fade in" id="modalCreateConfig" tabindex="-1" role="dialog" style="display: none;">
        <div class="modal-dialog modal-sm" role="document">
            <div class="modal-content model-inverse">
                <div class="modal-header">
                    <span class="modal-title">保存当前技能</span>
                </div>
                <div class="modal-body">
                    <div class="form-group config-name">
                        <label for="configName" class="control-label">技能名称</label>
                        <input class="form-control" name="configName" id="configName" placeholder="请输入名称">
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary btn-xs equip-config-apply" id="saveSkillTolocll">提交</button>
                    <button type="button" class="btn btn-default btn-xs" data-dismiss="modal" id="closeSaveModal">关闭</button>
                </div>
            </div>
        </div>
    </div>
    `;
    // 将 HTML 代码注入到目标元素中
    $('body').append(modalHtml);
    // 点击按钮显示弹窗
    $('#saveSkillBtn').on('click', function() {
        $('#modalCreateConfig').css('display', 'block');
    });
    $('#closeSaveModal').on('click', function() {
        $('#modalCreateConfig').css('display', 'none');
    });

    $('#saveSkillTolocll').on('click', function() {
        var skillName =  $('#configName').val();
        var skills = [];
        $(".skill-editor .selected").each(function (i, p) {
            var id = $(p).data("id");
            skills.push(id);
        });

        var skillMap = JSON.parse(localStorage.getItem('skillMap'));
        if(skillMap){
            if (skillName && skills.length > 0) { // 检查是否存在技能名称和技能
                skillMap[skillName] = skills; // 以技能名称为键，技能数组为值存储在对象中
                localStorage.setItem('skillMap', JSON.stringify(skillMap));
                $('#modalCreateConfig').css('display', 'none');
                alert('技能已存储到本地！');

            } else {
                alert('请输入技能名称和内容！');

            }
        }else{
            skillMap = {}; // 初始化一个空对象
            if (skillName && skills.length > 0) { // 检查是否存在技能名称和技能
                skillMap[skillName] = skills; // 以技能名称为键，技能数组为值存储在对象中
                localStorage.setItem('skillMap', JSON.stringify(skillMap));
                $('#modalCreateConfig').css('display', 'none');
                alert('技能已存储到本地！');
            } else {
                alert('请输入技能名称和内容！');
            }
        }
        if (skillName && skills.length > 0) { // 检查是否存在技能名称和技能
            skillMap[skillName] = skills; // 以技能名称为键，技能数组为值存储在对象中
            localStorage.setItem('skillMap', JSON.stringify(skillMap));
            $('#modalCreateConfig').css('display', 'none');
            alert('技能已存储到本地！');
        } else {
            alert('请输入技能名称和内容！');
        }
    });
    //爱液的装备加载弹窗，直接一个的复制
    var modalQueryConfig = `
    <div class="modal fade in" id="modalQueryConfig" tabindex="-1" role="dialog" style="display: none;">
        <div class="modal-dialog modal-sm" role="document">
            <div class="modal-content model-inverse">
                <div class="modal-header">
                    <span class="modal-title">管理当前技能</span>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label class="control-label">已有技能</label>
                        <select class="form-control" name="configId2" id="configId2">

                        </select>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary btn-xs equip-config-load" id="loadSkillSave">加载</button>
                    <button type="button" class="btn btn-warning btn-xs equip-config-delete">删除</button>
                    <button type="button" class="btn btn-default btn-xs" data-dismiss="modal" id="closeConfigModal">关闭</button>
                </div>
            </div>
        </div>
    </div>
    `;

    // 将 HTML 结构填充到页面的 body 中
    $('body').append(modalQueryConfig);


    $('#loadSkillBtn').on('click', function() {
        // 读取 localStorage 中的数据并展示在下拉框中
        var storedSkillMap = JSON.parse(localStorage.getItem('skillMap'));
        console.log(storedSkillMap)
        if (storedSkillMap) {
            var configId2 = $('#configId2');

            // 遍历存储的数据
            for (var key in storedSkillMap) {
                if (storedSkillMap.hasOwnProperty(key)) {
                    var value = storedSkillMap[key];
                    configId2.append(`<option value="${key}">${key}</option>`);
                }
            }

        }else{
            $('#loadSkillBtn').css('display', 'none');
        }
        $('#modalQueryConfig').css('display', 'block');
    });

    $('#closeConfigModal').on('click', function() {
        $('#modalQueryConfig').css('display', 'none');
    });

    $('.equip-config-delete').on('click', function() {
        var selectedConfigId = $('#configId2').val(); // 获取选中的技能 ID
        var selectedOption = $(`#configId2 option[value="${selectedConfigId}"]`);

        // 删除选中的 option
        selectedOption.remove();
        // 在 localStorage 中删除对应的数据
        var storedSkillMap = JSON.parse(localStorage.getItem('skillMap'));
        if (storedSkillMap && storedSkillMap.hasOwnProperty(selectedConfigId)) {
            delete storedSkillMap[selectedConfigId];
            localStorage.setItem('skillMap', JSON.stringify(storedSkillMap));
        }
    });
    $('#loadSkillSave').on('click', function() {
        var selectedConfigId = $('#configId2').val(); // 获取选中的配装 ID
        var storedSkillMap = JSON.parse(localStorage.getItem('skillMap'));

        if (storedSkillMap) {
            var skills = storedSkillMap[selectedConfigId]; // 通过配装 ID 获取技能数组
            console.log(skills)
            $("#sid").val(skills.join(","));
            $("form").attr("action", "SkillGroupBmSave");
            $("form").trigger("submit");
        }

    });
})();