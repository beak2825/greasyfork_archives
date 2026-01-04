// ==UserScript==
// @name        about_and_feedback_components
// @namespace   http://tampermonkey.net/
// @license     Apache-2.0
// @version     0.2
// @author      byhgz
// @description 个人项目自用关于和问题反馈组件
// @noframes    
// ==/UserScript==
"use strict";
/**
 *往页面插入关于和反馈组件
 * 传参works用于排除作品集和更新反馈地址，如当前是aaa，作品集里有aaa，则aaa不会显示在作品集里
 * @param cssSelector {string} css选择器
 * @param works {{}} 当前作品
 * @param works.title {string} 标题
 * @param works.gfurl {string} 链接
 * @param works.gfFeedbackUrl {string} 当前脚本gf反馈链接，如未给则使用作者的地址
 * @param works.desc {string} 描述
 *
 */
const installAboutAndFeedbackComponentsVue = (cssSelector, works) => {
    return new Vue({
        el: cssSelector,
        template: `
          <div>
            <div v-for="item in feedbacks" :key="item.title">
              {{ item.title }}
              <button gz_type><a :href="item.href" target="_blank">{{ item.href }}</a></button>
            </div>
            <hr>
            <div>
              <h1>作者其他脚本</h1>
              <div v-for="item in otherScriptSets" :key="item.title" :title="item.desc">
                {{ item.title }}
                <button gz_type><a :href="item.url" target="_blank">{{ item.url }}</a></button>
                <span>{{ item.desc }}</span>
              </div>
            </div>
          </div>
        `,
        data() {
            return {
                feedbacks: [
                    {
                        title: "gf反馈",
                        href: "https://greasyfork.org/zh-CN/users/1037952-hgztask",
                    },
                    {
                        title: "q群反馈",
                        href: "http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=tFU0xLt1uO5u5CXI2ktQRLh_XGAHBl7C&authKey=KAf4rICQYjfYUi66WelJAGhYtbJLILVWumOm%2BO9nM5fNaaVuF9Iiw3dJoPsVRUak&noverify=0&group_code=876295632",
                    },
                    {
                        title: "作者B站",
                        href: "https://space.bilibili.com/473239155",
                    },
                    {
                        title: "作者github",
                        href: "https://github.com/hgztask",
                    },
                    {
                        title: '作者gitee',
                        href: "https://gitee.com/hangexi",
                    }
                ],
                otherScriptSets: [
                    {
                        title: "B站屏蔽增强器",
                        url: "https://greasyfork.org/zh-CN/scripts/461382",
                        desc: "支持动态屏蔽、评论区过滤屏蔽，视频屏蔽（标题、用户、uid等）、蔽根据用户名、uid、视频关键词、言论关键词和视频时长进行屏蔽和精简处理，支持获取b站相关数据并导出为json(用户收藏夹导出，历史记录导出、关注列表导出、粉丝列表导出)(详情看脚本主页描述)"
                    },
                    {
                        title: "去除b站首页右下角推广广告",
                        url: "https://greasyfork.org/zh-CN/scripts/516566",
                        desc: "移除b站首页右下角按钮广告和对应的横幅广告"
                    },
                    {
                        title: "b站首页视频列数调整",
                        url: "https://greasyfork.org/zh-CN/scripts/512973",
                        desc: "修改b站首页视频列表的列数，并移除大图"
                    },
                    {
                        title: "github链接新标签打开",
                        url: "https://greasyfork.org/zh-CN/scripts/489538",
                        desc: "github站内所有的链接都从新的标签页打开，而不从当前页面打开"
                    }
                ]
            }
        },
        created() {
            const findOtherScriptIndex = this.otherScriptSets.findIndex(item => item.title === works.title);
            if (findOtherScriptIndex !== -1) {
                //找到当前作品时移除作品集
                this.otherScriptSets.splice(findOtherScriptIndex, 1);
            }
            const findFeedback = this.feedbacks.find(item => item.title === works.title);
            if (findFeedback) {
                //找到当前作品时修改反馈链接，未找到时则默认使用作者的反馈链接
                findFeedback.href = works.gfFeedbackUrl;
            }

        }
    });
};
