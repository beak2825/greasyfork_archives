/*
 * ============================================================================== *
 ******************************* 新编辑器汉化 v1.3.0 ******************************
 ************************ Copyright (C) 2023 xiaohong2022 *************************
 * ============================================================================== *
*/

// ==UserScript==
// @name         新模型编辑器汉化
// @namespace    https://bcmcreator.cn
// @version      1.3.0
// @description  新模型编辑器汉化！再也不担心看不懂英文了！
// @author       创作喵，版权方：小宏XeLa，特别鸣谢：冷鱼与热猫，吉吉喵
// @license      GPL
// @match        *://dao3.fun/edit-model
// @match        *://dao3.fun/edit-model/*
// @match        *://dao3.fun/edit-model?frombox=1
// @match        *://dao3.fun/edit-model/*?frombox=1
// @match        *://voxa.dao3.fun/
// @match        *://voxa.dao3.fun/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAgBJREFUOE/Nk09oE1EQxr9pVmsS+sewrRr7NiBeVERooZ6KVNCL2pPoyaIHBSmKWlREcvEgNNBWJFT0IKKeFE9CQTBiLYIItR4T0Ur31RVpGiVh0yibHdmXRjY1Fo+d48y83/Bmvo/wj4hGoyFN044BYMdxHlqWVazXSnWSJIQ4CmCIiIyl+iwzX5ZSPvKA/jc1AMMwugCMAuhZ18jo7yswM/DgaROVfqrWSQDnTdOcqkJUNhKJNIfD4REiOk6EwIE9Nl859YM6NpThAcyvGobutPD4ZJgYKDPzPdu2L+RyubwCCCHGiOj0ti2/+NrZ7+jeWRnnxYs3QbQ6Ojp3S7xNN3L85nqkZ9YSM49JKQdUo2EYKSLsffdkjiMtrsp9mtXwIbMG1nwbvrQncNKewaa+OBbyzF2HO8h1+bmUct8fgBbg3o/PJIhQmb4IIAjgM1DKNOCqfgvDwftwt7/mrfsFnDJSKwP8q54AEhsHcXHxPXhXarUCli+xRmDVL5SmkYu9/HuJQogkEQ3UO6MCTQHpHQL5zALHk83VMyallGfUxnVdbwqFQiMAThAQONhru56QNreXVX3uWwDXb7fy+ERFSADuFovFwWw2W6iRciwW62TmG0tS5v5DBSV8n5RfOY5zzrKs6RopLzOUZ6YjABJ+MwG4ZJrm4xXN5Af9r51/A5EdHSBSBzB5AAAAAElFTkSuQmCC
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469360/%E6%96%B0%E6%A8%A1%E5%9E%8B%E7%BC%96%E8%BE%91%E5%99%A8%E6%B1%89%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/469360/%E6%96%B0%E6%A8%A1%E5%9E%8B%E7%BC%96%E8%BE%91%E5%99%A8%E6%B1%89%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var temp = document.documentElement.innerHTML;
    setInterval(() => {
        if (temp !== document.documentElement.innerHTML) {
            if(document.querySelector("#treeNode-ROOT_BONE > div > div > div")){document.querySelector("#treeNode-ROOT_BONE > div > div > div").innerText="全部骨骼"}
            var a = [].slice.call(document.all)
            .filter(v => v.children.length === 0 && v.innerHTML !== "")
            .filter(v => !["style", "link", "noscript", "script", "meta", "canvas", "use"].includes(v.localName));
            [].slice.call(document.all).forEach(e => {
                if (e.parentElement) {
                    if (e.parentElement.classList.contains("style_name__GhlvZ")) return;
                };
                var t = [].slice.call(e.childNodes).filter(v => v instanceof Text);
                t.forEach(ee => {
                    var d = null;
                    switch (ee.nodeValue) {
                        case "Cannot trim bounding area without model":
                            d = "空的模型无法修剪边界区域";
                            break;
                        case "Color":
                            d = "颜色";
                            break;
                        case "List":
                            d = "导览";
                            break;
                        case "Parameter":
                            d = "属性";
                            break;
                        case "Launching...":
                            d = "正在加载中...";
                            break;
                        case "Successfully saved":
                            d = "保存成功！";
                            break;
                        case "Successfully published":
                            d = "发布成功！";
                            break;
                        case "Failed saved":
                            d = "保存出错！";
                            break;
                        case "Failed published":
                            d = "发布出错！";
                            break;
                        case "Failed to export":
                            d = "导出失败！";
                            break;
                        case "Today":
                            d = "今天";
                            break;
                        case "today":
                            d = "今天";
                            break;
                        case "Yesterday":
                            d = "昨天";
                            break;
                        case "yesterday":
                            d = "昨天";
                            break;
                        case "The day before yestarday":
                            d = "前天";
                            break;
                        case "the day before yestarday":
                            d = "前天";
                            break;
                        case "ago":
                            d = "前";
                            break;
                        case "A week":
                            d = "一周";
                            break;
                        case "a week":
                            d = "一周";
                            break;
                        case "month":
                            d = "月";
                            break;
                        case "year":
                            d = "年";
                            break;
                        case "day":
                            d = "天";
                            break;
                        case "months":
                            d = "月";
                            break;
                        case "years":
                            d = "年";
                            break;
                        case "days":
                            d = "天";
                            break;
                        case "Restored":
                            d = "回潮成功";
                            break;
                        case "Scale factor":
                            d = "规模因子";
                            break;
                        case "It has exceeded the Maximum size.":
                            d = "已到达最大大小";
                            break;
                        case "Euler Angle":
                            d = "欧拉角";
                            break;
                        case "Touch Device？":
                            d = "触摸设备？";
                            break;
                        case "The space required by the current model:":
                            d = "当前模型所需空间：";
                            break;
                        case "Apply Rotation":
                            d = "应用旋转";
                            break;
                        case "Retry":
                            d = "重新尝试";
                            break;
                        case "drag and drop for this item is only available in setup mode":
                            d = "温馨提示：此项目的拖放仅在设置模式下可用";
                            break;
                        case "Extrude":
                            d = "挤压";
                            break;
                        case "Right click to remove the hint.":
                            d = "右键单击即可去掉提示";
                            break;
                        case "Please adjust the model to fit into VoxelEditor's workspace.":
                            d = "请调整模型以适应工作区";
                            break;
                        case "Voxelize":
                            d = "体素化";
                            break;
                    };
                    if (d) {
                        ee.nodeValue = d;
                    };
                });
            });
            a.forEach(e => {
                if (e.parentElement) {
                    if (e.parentElement.classList.contains("style_name__GhlvZ")) return
                }
                var d = null;
                switch (e.localName) {
                    case "title":
                        d = "Box3 VOXA新模型编辑器";
                        break;
                    case "p":
                        switch (e.innerText) {
                            case "Save":
                                d = "保存";
                                break;
                            case "Publish":
                                d = "编辑/发布";
                                break;
                            case "Setup":
                                d = "编辑";
                                break;
                            case "Motion":
                                d = "动画";
                                break;
                            case "Local Mode":
                                d = "部件或骨骼轴";
                                break;
                            case "Adjust coordinate in local mode":
                                d = "切换到部件或骨骼坐标系。轴线随着部件或骨骼的旋转而改变。";
                                break;
                            case "Global Mode":
                                d = "世界轴";
                                break;
                            case "Adjust coordinate in global mode":
                                d = "切换到世界坐标系。世界轴总是与部件的方向相同。";
                                break;
                            case "Pivot Tool":
                                d = "调整轴点";
                                break;
                            case "Set origin of the object/group":
                                d = "轴心是部件/骨骼或部件/骨骼组移动和旋转的参考点。设置轴心可以调整目标部件/骨骼和其轴心的相对位置。";
                                break;
                            case "Home":
                                d = "开始面板";
                                break;
                            case "History":
                                d = "历史版本";
                                break;
                            case "Import":
                                d = "导入";
                                break;
                            case "Export":
                                d = "导出";
                                break;
                            case "Flip X":
                                d = "翻转 X";
                                break;
                            case "Flip Y":
                                d = "翻转 Y";
                                break;
                            case "Flip Z":
                                d = "翻转 Z";
                                break;
                            case "Flip along the X-axis":
                                d = "沿 X 轴翻转";
                                break;
                            case "Flip along the Y-axis":
                                d = "沿 Y 轴翻转";
                                break;
                            case "Flip along the Z-axis":
                                d = "沿 Z 轴翻转";
                                break;
                            case "Import model to object":
                                d = "导入模型";
                                break;
                            case "Import VOX":
                                d = "导入 VOX 作品 (.vox)";
                                break;
                            case "Export GLTF":
                                d = "导出为 GLTF";
                                break;
                            case "Move":
                                d = "移动";
                                break;
                            case "Move object(s) in X/Y/Z-axis":
                                d = "根据世界轴或部件轴移动部件/部件组。";
                                break;
                            case "Rotate":
                                d = "旋转";
                                break;
                            case "Rotate object(s) around X/Y/Z-axis":
                                d = "根据世界轴或部件轴旋转部件/部件组。";
                                break;
                            case "Create":
                                d = "建造";
                                break;
                            case "Create a new object":
                                d = "建造一个新部件，用于模型编辑";
                                break;
                            case "Make a Copy":
                                d = "复制";
                                break;
                            case "Make a copy of the selection":
                                d = "复制所选的部件";
                                break;
                            case "Create Bone":
                                d = "创建骨骼";
                                break;
                            case "Create a new bone":
                                d = "创建一个新骨骼，用于动画编辑";
                                break;
                            case "New Color Group":
                                d = "建造新色卡";
                                break;
                            case "Clear unused colors":
                                d = "清掉没用过的颜色";
                                break;
                            case "Keep":
                                d = "取消";
                                break;
                            case "Clear":
                                d = "清除";
                                break;
                            case "Add object":
                                d = "建造部件";
                                break;
                            case "Edit object":
                                d = "编辑部件";
                                break;
                            case "Create object":
                                d = "建造部件";
                                break;
                            case "Create bone":
                                d = "创建骨骼";
                                break;
                            case "Edit object":
                                d = "编辑部件";
                                break;
                            case "Make a copy":
                                d = "复制";
                                break;
                            case "Rename":
                                d = "重命名";
                                break;
                            case "Group selection":
                                d = "建造分组";
                                break;
                            case "Ungroup":
                                d = "取消分组";
                                break;
                            case "Delete":
                                d = "删除";
                                break;
                            case "Undo":
                                d = "撤销（Ctrl+Z）";
                                break;
                            case "Redo":
                                d = "重做（Ctrl+Y）";
                                break;
                            case "Emissive":
                                d = "启用模型发光";
                                break;
                            case "Skeleton":
                                d = "显示骨骼";
                                break;
                            case "Bounding box":
                                d = "显示部件框";
                                break;
                            case "Ground":
                                d = "显示网格";
                                break;
                            case "Recenter camera":
                                d = "复原视角";
                                break;
                            case "Add node":
                                d = "添加子骨骼";
                                break;
                            case "Perspective":
                                d = "透视";
                                break;
                            case "Orthogonal":
                                d = "正交";
                                break;
                            case "Create motion":
                                d = "建造新动画";
                                break;
                            case "Create keyframe":
                                d = "建造新帧";
                                break;
                            case "Motions":
                                d = "列表";
                                break;
                            case "Hierarchies":
                                d = "骨骼";
                                break;
                            case "Last keyframe":
                                d = "滑到最后";
                                break;
                            case "First keyframe":
                                d = "滑到最前";
                                break;
                            case "Previous keyframe":
                                d = "后退一帧";
                                break;
                            case "Next keyframe":
                                d = "前进一帧";
                                break;
                            case "Play":
                                d = "运行";
                                break;
                            case "Pause":
                                d = "暂停";
                                break;
                            case "Trim":
                                d = "修减";
                                break;
                            case "Shrink bounding box to fit voxels":
                                d = "删除空的区域以适合模型";
                                break;
                            case "Rotate Y":
                                d = "旋转 Y";
                                break;
                            case "Rotate X":
                                d = "旋转 X";
                                break;
                            case "Rotate Z":
                                d = "旋转 Z";
                                break;
                            case "Rotate 90° around Z-axis":
                                d = "围绕 Z 轴旋转90°";
                                break;
                            case "Rotate 90° around X-axis":
                                d = "围绕 X 轴旋转90°";
                                break;
                            case "Rotate 90° around Y-axis":
                                d = "围绕 Y 轴旋转90°";
                                break;
                            case "Mirror X":
                                d = "镜像对称 X";
                                break;
                            case "Mirror Y":
                                d = "镜像对称 Y";
                                break;
                            case "Mirror Z":
                                d = "镜像对称 Z";
                                break;
                            case "Toggle mirror on X-axis":
                                d = "开启 X 坐标 镜像对称模式";
                                break;
                            case "Toggle mirror on Y-axis":
                                d = "开启 Y 坐标 镜像对称模式";
                                break;
                            case "Toggle mirror on Z-axis":
                                d = "开启 Z 坐标 镜像对称模式";
                                break;
                            case "Show Edges":
                                d = "显示轮廓";
                                break;
                            case "Hide Edges":
                                d = "隐藏轮廓";
                                break;
                            case "Grids":
                                d = "显示网格";
                                break;
                            case "Copy":
                                d = "复制";
                                break;
                            case "Move voxels in X/Y/Z-axis":
                                d = "沿轴线移动所选体素块。如果没有选择体素块，它将移动整个模型。";
                                break;
                            case "Marquee Select":
                                d = "区域选择";
                                break;
                            case "Select target area":
                                d = "点击鼠标左键通过选区或方框选择体素块，在所选区域外点击可取消选择。";
                                break;
                            case "Voxel Select":
                                d = "方块选择";
                                break;
                            case "Select target voxels":
                                d = "选择指定方块";
                                break;
                            case "Magic Wand":
                                d = "魔术棒";
                                break;
                            case "Select voxels in same color based on volume":
                                d = "快速选择相同颜色的体素块。单击鼠标左键选择相邻的，双击则选择全部相同颜色的体素块。";
                                break;
                            case "Build Voxel":
                                d = "放置方块";
                                break;
                            case "Erase Voxel":
                                d = "消除方块";
                                break;
                            case "Build Box":
                                d = "放置矩形";
                                break;
                            case "Erase Box":
                                d = "消除矩形";
                                break;
                            case "Build voxels by clicking or click-and-drag":
                                d = "鼠标左键单击可以修建一个体素块。按住左键并拖动以修建一条线。";
                                break;
                            case "Erase voxels by clicking or click-and-drag":
                                d = "鼠标左键单击可以擦除一个体素块。按住左键并拖动以擦除一条线。";
                                break;
                            case "Build voxels by box":
                                d = "通过画一个面来快速修建体素块。双击添加一个高度为一个体素块的层。";
                                break;
                            case "Erase voxels by box":
                                d = "通过画一个面来快速擦除体素块。双击可以擦除一个高度为体素块的层。";
                                break;
                            case "Extrude":
                                d = "调节高度";
                                break;
                            case "Modify the height of voxel volume":
                                d = "修改体素块的高度。";
                                break;
                            case "Paint Brush":
                                d = "上色";
                                break;
                            case "Paint color by clicking or click-and-drag":
                                d = "鼠标左键点击并拖动，可以用调色板中选择的颜色刷涂，修改体素块原本的颜色。双击可以将所有相邻的体素涂成与表面上所选体素块相同的颜色。";
                                break;
                            case "Paint Bucket":
                                d = "填充";
                                break;
                            case "Paint contiguous voxels with same color":
                                d = "单次点击可以一键替换选中的体素块的颜色。双击可将所有体素涂成相同的颜色。";
                                break;
                            case "Color Picker":
                                d = "取色";
                                break;
                            case "Pick the color from a voxel":
                                d = "可以选取想要使用的颜色。";
                                break;
                            case "More Color":
                                d = "更多颜色";
                                break;
                            case "Paste":
                                d = "粘贴";
                                break;
                            case "Restore":
                                d = "确认";
                                break;
                            case "Cancel":
                                d = "取消";
                                break;
                            case "Delete group":
                                d = "删除色卡";
                                break;
                            case "Unbound":
                                d = "解开绑定";
                                break;
                        }
                        break;
                    case "div":
                        switch (e.innerText) {
                            case "Emissive":
                                d = "自发光";
                                break;
                            case "Flip":
                                d = "翻转";
                                break;
                            case "Rotate":
                                d = "旋转";
                                break;
                            case "Mirror":
                                d = "镜像对称";
                                break;
                            case "Size":
                                d = "规格";
                                break;
                            case "Clear unused colors":
                                d = "清掉没用过的颜色";
                                break;
                            case "Confirm to clear all unused colors in the swatch?":
                                d = "确认清除样本中所有未使用的颜色？";
                                break;
                            case "Animation":
                                d = "动画";
                                break;
                            case "Color":
                                d = "颜色";
                                break;
                            case "Restore":
                                d = "版本回潮";
                                break;
                            case "Overwrite current project with history version":
                                d = "确认回潮到以前的版本？";
                                break;
                            case "Delete the motion":
                                d = "删除动画";
                                break;
                            case "Confirm to delete the motion":
                                d = "确认要删除该动画吗？";
                                break;
                            case "Delete color group":
                                d = "删除颜色组";
                                break;
                            case "Used colors will be moved to the default color card":
                                d = "删除后，使用过的颜色将会被移动到默认色卡";
                                break;
                        }
                        break;
                    case "span":
                        switch (e.innerText) {
                            case "Opacity":
                                d = "透明度";
                                break;
                            case "No Project":
                                d = "暂无历史记录";
                                break;
                            case "Back to Object":
                                d = "返回编辑区";
                                break;
                        }
                        break;
                };
                if (d) {
                    e.innerText = d;
                };
            });
            document.querySelectorAll("div.style_time__cUcxV > span:nth-child(1)").forEach(e=>{
                var x = e.innerText;
                if(x.includes(", ")){
                    var y = x.split(", ")[1];
                    var m = x.split(" ")[0];
                    var d = x.split(" ")[1].split(",")[0];
                    var w = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."];
                    e.innerText=`${y}年${w.indexOf(m)+1}月${d}日`;
                };
            });
            temp = document.documentElement.innerHTML;
        };
    });
})();
