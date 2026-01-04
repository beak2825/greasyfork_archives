// ==UserScript==
// @name         获取TAPD提交信息
// @namespace    http://jsh.vimo.cloud/
// @version      1.2
// @description  自定义，用于git提交记录
// @author       Wizard <lsw1991abc@gmail.com>
// @include      *://www.tapd.cn/*/prong/stories/view/*
// @include      *://www.tapd.cn/*/prong/tasks/view/*
// @include      *://www.tapd.cn/*/bugtrace/bugs/view?bug_id=*
// @grant        none
// @license      GPL License
// @downloadURL https://update.greasyfork.org/scripts/401592/%E8%8E%B7%E5%8F%96TAPD%E6%8F%90%E4%BA%A4%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/401592/%E8%8E%B7%E5%8F%96TAPD%E6%8F%90%E4%BA%A4%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==

;(function() {
    'use strict';

    // Your code here...
    var view_position;
    var id;
    var title;
    var storyId;
    if($("#story_name_view").length > 0) {
        // 故事
        id = "s"+$("#story_name_view > .story-title-id").html().trim().substr(3, 7);
        title = $("#story_name_view > .editable-value").attr("title");
        view_position = "#locateForStoryInfo";
    } else if($("#task_name_view").length > 0) {
        // 任务
        storyId = parentStory.id.substr(12, 18);
        id = "s"+storyId+"-t"+$("#task_name_view > .task-title-id").html().trim().substr(3, 7);
        title = $("#task_name_view > .editable-value").attr("title");
        view_position = "#locateForTaskInfo";
    } else if($("#bug_title_view").length > 0) {
        // 缺陷
        storyId = default_value.BugStoryRelation_relative_id.id.substr(12, 18);
        id = "s"+storyId+"-b"+$("#bug_title_view > .bug-title-id").html().trim().substr(3, 7);
        title = $("#bug_title_view > .editable-value").attr("title");
        view_position = "#locateForBugInfo";
    }

    $(view_position).after("<h4>"+id+":"+title+"</h4>")
})();