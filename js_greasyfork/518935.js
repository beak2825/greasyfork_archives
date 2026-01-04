// ==UserScript==
// @name         E享学院 - 东软信息安全考试自动答题脚本
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  进入答题页面，点击右上角“执行自动答题”按钮即可完成答题，两把斗地主时间后请手动提交考试，题库不全欢迎补充，通过 GitHub Pr 提交，做好事不留名，你只需要知道我是东软某部门好心人，即将离职，分享出来方便你我他
// @author       东软某部门好心人
// @match        *://learning.neusoft.com/o2o/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/518935/E%E4%BA%AB%E5%AD%A6%E9%99%A2%20-%20%E4%B8%9C%E8%BD%AF%E4%BF%A1%E6%81%AF%E5%AE%89%E5%85%A8%E8%80%83%E8%AF%95%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/518935/E%E4%BA%AB%E5%AD%A6%E9%99%A2%20-%20%E4%B8%9C%E8%BD%AF%E4%BF%A1%E6%81%AF%E5%AE%89%E5%85%A8%E8%80%83%E8%AF%95%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(
    function () {
        'use strict';

        // 题库数据，请根据规则自行添加，不要复制题目对应的分数，否则无法匹配，判断题正确填1，错误填0。
        const questionBank = [
            {
                "title": "公司要求计算机终端必须设置屏幕保护程序，等待时间不得超过（）。",
                "answer": ["5分钟"]
            },
            {
                "title": "不允许接入公司办公网络的设备是（）。",
                "answer": ["个人移动存储设备"]
            },
            {
                "title": "关于公司邮件安全管理，下列哪项描述不正确（）？",
                "answer": ["可以使用公司邮箱帐号在互联网上注册用户"]
            },
            {
                "title": "负责公司信息安全管理的部门是（）。",
                "answer": ["信息安全管理中心"]
            },
            {
                "title": "以下符合公司强密码策略的是（）。",
                "answer": ["DeXq@59!"]
            },
            {
                "title": "公司的信息安全管理方针是（）。",
                "answer": ["管理风险，保障信息安全，提升经营持续性"]
            },
            {
                "title": "为防止出现意外情况导致重要数据丢失，需及时对重要数据进行（）。",
                "answer": ["备份"]
            },
            {
                "title": "ISMS是指（）体系。",
                "answer": ["信息安全管理"]
            },
            {
                "title": "下列关于疑似钓鱼邮件处置说法错误的是（）。",
                "answer": ["点击邮件链接识别真伪"]
            },
            {
                "title": "关于设备管理，下列哪项描述不正确（）？",
                "answer": ["存有涉密信息的设备报废时，可以直接卖给废品收购公司"]
            },
            {
                "title": "关于移动设备管理，下列哪项描述不正确（）？",
                "answer": ["笔记本电脑等移动设备可以随意带出办公区域"]
            },
            {
                "title": "信息安全工作依据的国际标准是（）。",
                "answer": ["ISO27001"]
            },
            {
                "title": "负责公司信息安全管理的部门是（）",
                "answer": ["信息安全管理中心"]
            },
            {
                "title": "下列哪项不属于信息安全的三要素（）？",
                "answer": ["价值性"]
            },
            {
                "title": "公司强密码策略要求密码有效期最多不超过（）。",
                "answer": ["90天"]
            },
            {
                "title": "对于违反公司信息安全管理规定的员工，公司将依据（）进行处罚。",
                "answer": ["东软信息安全管理办法"]
            },
            {
                "title": "信息安全是（）。",
                "answer": ["保持信息的保密性、完整性和可用性等"]
            },
            {
                "title": "关于信息安全事件管理，下列哪几项描述正确（）？",
                "answer": ["负责处理信息安全事件的组织叫做信息安全事件处理小组ISIRT", "信息安全事件发生后，相关人员须第一时间报告给部门的信息安全主管", "事件处理完毕以后一周内，部门信息安全事件处理小组ISIRT须对事件进行认真总结和分析"]
            },
            {
                "title": "关于人员安全管理，下列哪项描述正确（）？",
                "answer": ["离职后仍须对在职期间接触到的涉密信息履行保密义务"]
            },
            {
                "title": "下列哪些资料属于项目开发中的涉密信息（）？",
                "answer": ["测试数据", "项目管理资料", "设计文档", "客户信息", "需求文档"]
            },
            {
                "title": "在客户现场出差，下列哪些做法正确（）？",
                "answer": ["未经客户许可，不得私自下载使用QQ、迅雷等软件", "由于工作需要使用的特殊软件应向客户提出申请，经审批后方可使用"]
            },
            {
                "title": "公司的涉密信息密级划分为（）。",
                "answer": ["东软秘密 Neusoft Confidential", "东软内部公开 Neusoft Internal Public", "东软绝密 Neusoft Top Secret"]
            },
            {
                "title": "关于涉密信息管理，下列哪几项描述正确（）？",
                "answer": ["涉密信息须按照公司的要求进行密级标识", "涉密信息是指对公司具有一定价值或敏感的信息，不能公开发布、展示、泄露", "不能通过信息共享的方式（如个人简历、博客等）公开发布项目信息及客户信息"]
            },
            {
                "title": "关于防病毒管理，下列哪几项描述正确（）？",
                "answer": ["IT服务中心负责卸载防病毒软件，禁止员工私自停用或卸载", "如发现感染病毒或设备出现异常时，应立即拔掉网线，断开网络连接", "安装公司统一要求的防病毒软件", "计算机终端至少每月执行一次病毒扫描"]
            },
            {
                "title": "关于信息安全责任，下列哪几项描述正确（）？",
                "answer": ["根据信息安全事件的影响程度，公司将按照《东软信息安全管理办法》处罚事件责任人", "信息安全人人有责", "公司最高管理者承担公司信息安全管理工作最高责任，部门负责人承担部门信息安全管理工作最高责任"]
            },
            {
                "title": "日常工作中，员工应（）。",
                "answer": ["配合部门信息安全专员实施信息安全检查工作", "按要求参加信息安全培训", "办理内部调转或离职手续时，必须先履行部门内部的相关异动手续", "遵守《员工信息安全日常行为规范》要求"]
            },
            {
                "title": "员工在客户现场出差，应注意下列哪些方面（）？",
                "answer": ["出差前应该接受相关信息安全培训并签订《客户现场信息安全日常行为规范》", "未经客户许可，禁止项目人员多人共用同一帐户访问客户应用系统", "未经授权禁止向客户提供合同/协议以外的产品及服务", "需要对客户现场开发设备的物理位置、配置、网络访问方式等进行变更时，应在得到客户允许后实施"]
            },
            {
                "title": "关于网络使用，下列哪些行为不正确（）？",
                "answer": ["因工作需要开通的全通访问权限，因同事也有工作需求，可在同事的设备上用自己的帐号登录，供其使用", "因工作需要开通的全通访问权限，因同事也有工作需求，可将密码提供给同事使用", "为提高工作效率，项目组申请的真IP服务器可配置无线路由，供项目组其他成员上网使用"]
            },
            {
                "title": "关于员工卡的使用，下列哪几项描述正确（）？",
                "answer": ["如员工卡丢失，须在24小时内上报部门门禁管理员", "员工卡是员工身份的标识，工作期间应正确佩戴员工卡", "如忘带员工卡，应在相关管理人员处借用临时卡"]
            },
            {
                "title": "项目进行过程中应该遵守的信息安全规范/要求有（）。",
                "answer": ["相关法律法规的要求", "公司的信息安全规范", "部门的信息安全规范", "客户的信息安全要求"]
            },
            {
                "title": "关于开发活动的信息安全要求，下列哪几项描述正确（）？",
                "answer": ["开发过程中使用客户提供并且需要注册的软件时，必须使用客户信息进行注册", "不同项目、不同业务之间，应确保数据安全，不可以相互泄露", "项目启动前，项目人员须接受相关信息安全培训", "必须确保测试环境、开发环境与运行环境相互隔离"]
            },
            {
                "title": "计算机终端必须进行的安全配置包括（）",
                "answer": ["系统帐户应取消“密码永不过期”设置并停用Guest帐户", "开启审核策略、帐户锁定策略", "安装公司统一要求的防病毒软件", "设置带密码保护的屏幕保护程序，等待时间不得超过5分钟", "配置公司提供的补丁更新服务，并及时安装"]
            },
            {
                "title": "关于不再使用的或保密期限到期的涉密文档的销毁，下列哪几项描述正确（）？",
                "answer": ["存储涉密信息的光盘需物理破坏或使用专业消磁机进行销毁", "办公设备分配给其他员工前，应及时彻底清除设备中存储的信息"]
            },
            {
                "title": "强密码策略适用于（）。",
                "answer": ["应用系统/程序的帐户密码", "服务器登录密码", "计算机终端开机登录密码", "邮箱帐号密码"]
            },
            {
                "title": "项目测试结束后，需要删除保存在（）的测试数据。",
                "answer": ["智能终端设备", "公/私有云", "计算机终端", "服务器/应用系统"]
            },
            {
                "title": "关于上网行为，下列哪几项描述不正确（）？",
                "answer": ["使用客户提供的业务专属网络访问Internet资源", "开启手机热点，通过热点访问Internet资源", "通过在业务专属网络上架设的代理服务器访问Internet资源"]
            },
            {
                "title": "对长期未开机使用的计算机终端设备处置方法正确的是（）。",
                "answer": ["检查防病毒软件是否正常运行", "检查计算机终端安全配置是否符合公司要求", "对计算机终端进行一次全面扫描"]
            },
            {
                "title": "依据对公司或相关方造成的影响及损失程度，将信息安全事件分为（）。",
                "answer": ["严重信息安全事件", "重大信息安全事件", "一般信息安全事件"]
            },
            {
                "title": "计算机终端必须进行的安全配置包括（）。",
                "answer": ["配置公司提供的补丁更新服务，并及时安装", "设置带密码保护的屏幕保护程序，等待时间不得超过5分钟", "开启审核策略、帐户锁定策略", "安装公司统一要求的防病毒软件", "系统帐户应取消“密码永不过期”设置并停用Guest帐户"]
            },
            {
                "title": "使用客户设备现场开发，项目结束时应按照公司及客户要求处理设备中的项目信息。",
                "answer": [1]
            },
            {
                "title": "如计算机终端因系统、客户等原因无法按照公司要求进行安全配置，则需进行例外审批及备案。",
                "answer": [1]
            },
            {
                "title": "员工出入办公大厅应自觉刷卡，禁止尾随他人进入。",
                "answer": [1]
            },
            {
                "title": "本着“用户至上”的原则，只要客户要求做的事情都应该尽量满足。",
                "answer": [0]
            },
            {
                "title": "开发过程中，应明确测试数据的访问权限和管理要求，测试结束后应及时删除测试数据。",
                "answer": [1]
            },
            {
                "title": "严禁将个人移动设备（如笔记本、U盘、移动硬盘）接入公司办公网络。",
                "answer": [1]
            },
            {
                "title": "发现办公区域有外来人员时，应该及时向部门信息安全主管报告。",
                "answer": [1]
            },
            {
                "title": "办公设备带出维修时应对存储的涉密信息进行安全处理（备份、硬盘格式化等）并保留确认记录。",
                "answer": [1]
            },
            {
                "title": "外来人员参观公司办公大厅、机房等区域，禁止拍照。",
                "answer": [1]
            },
            {
                "title": "经常来访的人员比较熟悉，可以不进行登记，直接进入办公大厅。",
                "answer": [0]
            }
        ];

        const notHaveQuestion = (question) => {
            console.log('题库暂无此题，欢迎提交：%c' + question, 'color: red;')
        }

        const checkboxClick = (answer, contents, checkboxButtons) => {
            const current = answer[0];

            if (contents.includes(current)) {
                checkboxButtons[current].click();
            }

            checkboxClick(answer.slice(1), contents, checkboxButtons);
        }

        const executeButton = document.createElement('button');
        executeButton.textContent = '执行自动答题';
        executeButton.style.position = 'fixed';
        executeButton.style.top = '50px';
        executeButton.style.right = '50px';
        executeButton.style.zIndex = '9999';
        executeButton.style.backgroundColor = 'blue';
        executeButton.style.color = 'white';
        executeButton.style.padding = '10px 20px';
        executeButton.style.border = 'none';
        executeButton.style.borderRadius = '5px';

        document.body.appendChild(executeButton);
        executeButton.addEventListener('click', function () {
            const questionAreas = document.querySelectorAll('.pb24.ph32');

            questionAreas[0].questionType = 'radio';
            questionAreas[1].questionType = 'check';
            questionAreas[2].questionType = 'judge';

            questionAreas.forEach(function (questionArea) {
                const questions = Array.from(questionArea.querySelectorAll('div[class="mv24"]'));

                // 可让我一顿好找啊，最后一道题 class 是 mt24
                const additionalQuestion = questionArea.querySelectorAll('div[class="mt24"]')[0];
                questions.push(additionalQuestion);

                questions.forEach(function (question) {
                    const questionTitle = question.querySelector('[data-rich-text="1"]').textContent;
                    const correspondingQuestion = questionBank.find(qb => qb.title === questionTitle);
                    if (correspondingQuestion === undefined) {
                        notHaveQuestion(questionTitle);
                    }

                    if (correspondingQuestion) {
                        if (questionArea.questionType === 'radio') {
                            // 单选题处理
                            const radioButtons = question.querySelectorAll('input[type="radio"]');
                            const radioContent = question.querySelectorAll('div[class="flex"]');
                            radioContent.forEach(function (content, index) {
                                const answer = content.querySelectorAll('span[data-rich-text="1"]')
                                if (correspondingQuestion.answer.includes(answer[0].innerHTML)) {
                                    radioButtons[index].click();
                                }
                            });
                        } else if (questionArea.questionType === 'check') {
                            // 多选题处理
                            const checkboxButtons = question.querySelectorAll('input[type="checkbox"]');
                            const checkboxContent = question.querySelectorAll('div[class="flex"]');

                            const contents = [];
                            checkboxContent.forEach(function (content) {
                                contents.push(content.querySelectorAll('span[data-rich-text="1"]')[0].innerHTML)
                            });

                            correspondingQuestion.answer.forEach((value, index) => {
                                setTimeout(() => {
                                    for (let i = 0; i < contents.length; i++) {
                                        if (contents[i] === value) {
                                            checkboxButtons[i].click();
                                        }
                                    }
                                }, index * 100); // 每次点击延迟 100ms
                            });


                        } else if (questionArea.questionType === 'judge') {
                            // 判断题处理
                            const radioButtons = question.querySelectorAll('input[type="radio"]');
                            correspondingQuestion.answer.forEach(function (value) {
                                if (value === 1) {
                                    radioButtons[0].click();
                                } else {
                                    radioButtons[1].click();
                                }
                            })
                        } else {
                            console.log('其他错误')
                            console.log(questionArea)
                        }
                    }
                });
            });
        });
    }
)();
