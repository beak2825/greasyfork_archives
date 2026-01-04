// ==UserScript==
// @name         BatchItemRelation
// @name:zh-CN   批量关联新条目关系
// @namespace    https://github.com/Adachi-Git
// @version      0.2
// @description  在条目页面上执行批量关联新条目关系操作
// @author       Adachi
// @match        *://bgm.tv/subject/*
// @match        *://chii.in/subject/*
// @match        *://bangumi.tv/subject*
// @match        *://bgm.tv.tv/character/*
// @match        *://chii.in/character/*
// @match        *://bangumi.tv/character/*
// @match        *://bgm.tv/person/*
// @match        *://chii.in/person/*
// @match        *://bangumi.tv/person/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/490647/BatchItemRelation.user.js
// @updateURL https://update.greasyfork.org/scripts/490647/BatchItemRelation.meta.js
// ==/UserScript==

(function() {
    // 主入口
    function main() {
        if ($("#indexCatBox").length > 0) {
            addCustomIDInputs();
            addCustomIDExecutionButton();
        }
    }

    // 添加ID输入框、职位列表、执行按钮
    function addCustomIDInputs() {
        $("#sbjSearchMod").after(`<div align="center">
            <input id="custom_ids" type="text" placeholder="输入带逗号分隔的ID" style="width: 200px;">
            <div id="relationListContainer"></div>
            <button id="idbtn_custom" class="btnCustom">执行</button>
        </div>`);
    }

    // 添加自定义ID执行按钮的点击事件处理
    function addCustomIDExecutionButton() {
        if ($("#crtRelateSubjects .clearit select").length > 0) {
            infoprsn();
        }
        // 为执行按钮绑定点击事件
        $("#idbtn_custom").click(function() {
            // 获取用户输入的自定义ID，并执行相应操作

            var customIds = $("#custom_ids").val().trim();
            if (customIds !== '') {
                var ids = customIds.split(',').map(function(item) {
                    return parseInt(item.trim());
                });
                generateAndSelect(ids);
            }
        });
    }

    // 生成并选择指定ID的条目
    function generateAndSelect(ids) {
        var chunk = ids.slice(0, 10);
        var arra = chunk.join(',');
        $("#subjectName").val('bgm_id=' + arra);
        $("#findSubject").click();
        $("#subjectList").one("DOMSubtreeModified", function() {
            if ($("#subjectList").length > 0) {
                setTimeout(function() {
                    $("#subjectList .clearit p .avatar").click();
                    var personType = $('#relationListContainer select').val();

                    $('#crtRelateSubjects li:not(.old.clearit)').slice(0, chunk.length).find('select').val(personType);
                    setTimeout(function() {
                        ids = ids.slice(10); // 剔除已经处理的前10个ID
                        if (ids.length > 0) {
                            generateAndSelect(ids);
                        } else {
                            $('#subjectList').hide(); // 生成完成后隐藏查询结果区域
                        }
                    }, 1000); // 等待一秒钟后执行下一组查询
                }, 1000); // 等待一秒钟后执行全选操作
            }
        });
    }


    // 获取关系列表
    function infoprsn() {
        var prsninfo = genPrsnStaffList(-1);
        if (prsninfo && prsninfo.trim() !== '') {
            $("#relationListContainer").html(prsninfo);
            console.log("通过 genPrsnStaffList 获取关系列表。");
        } else {
            var fallbackPrsninfo = $("#crtRelateSubjects").find(".clearit select").eq(0).clone(); // 选择第一个下拉列表并复制
            if (fallbackPrsninfo && fallbackPrsninfo.length > 0) {
                $("#relationListContainer").html(fallbackPrsninfo); // 将复制的下拉列表添加到 relationListContainer 中
                console.log("通过备选方法获取关系列表。");
            } else {
                // 如果没有找到备选方法获取关系列表，可以提供一个提示或者采取其他操作
                console.log("无法获取关系列表！");
            }
        }
    }



    // 执行主函数
    main();
})();