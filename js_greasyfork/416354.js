// ==UserScript==
// @name         AA生成视洞绑定摄像头XML（支持最新的平台）
// @namespace    http://tampermonkey.net/
// @version      3.3-2024年2月19日13:47:20
// @description  通过https://web.hsop.komect.com:11444/pf#/平台生成绑定XML,生成后一定要再仔细检查一次XML。注意：生成后的XML<DeviceFactory>需要手动填写。 更新手动扫码页面。仅支持最新平台，增加声波配网。
// @description  3.3-:修复无法2.4GHZ导致的分段bug
// @author       luhaoyu
// @match        https://open.home.10086.cn/openhomeAdmin/pages/partner/distriNetwork/
// @require      http://cdn.staticfile.org/jquery/3.1.1/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/clipboard.js/2.0.6/clipboard.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416354/AA%E7%94%9F%E6%88%90%E8%A7%86%E6%B4%9E%E7%BB%91%E5%AE%9A%E6%91%84%E5%83%8F%E5%A4%B4XML%EF%BC%88%E6%94%AF%E6%8C%81%E6%9C%80%E6%96%B0%E7%9A%84%E5%B9%B3%E5%8F%B0%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/416354/AA%E7%94%9F%E6%88%90%E8%A7%86%E6%B4%9E%E7%BB%91%E5%AE%9A%E6%91%84%E5%83%8F%E5%A4%B4XML%EF%BC%88%E6%94%AF%E6%8C%81%E6%9C%80%E6%96%B0%E7%9A%84%E5%B9%B3%E5%8F%B0%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';
    console.log("hello gxml");

    var gxmlBtn = '<div><button id="btn_gxml" type="button" class="ant-btn"><span>生成XML</span></button><div>'

    // $(window.frames["j-third-party-ifr"].document).find("ant-modal-header")


    // 双定时器监听弹窗的关闭与打开
    var monitorOpenDialogInterval = setInterval(monitorOpenDialog, 1000);
    var monitorCloseDialogInterval = "";

    /**
     * 监听对话框的显示与隐藏
     */
    function monitorOpenDialog() {
        try {
            if ($(".ant-modal-content").length != 1) {
                console.log("the page is not xml page!");
                return;
            }
        } catch (e) {
            console.log("error:the page is not xml page!");
            return;
        }

        var $iframe = $("body").contents();
        if ($iframe.find(".ant-modal-header").length > 0) {
            console.log("open dialog...");
            // 显示对话框
            $iframe.find(".ant-modal-header").append(gxmlBtn)

            // 设置监听
            $iframe.find("#btn_gxml").bind("click", function () {
                console.log("click gxml button!")
                var panels = $iframe.find("div[role=tabpanel]");

                // 这里最好判断下是否是视洞类设备
                if (panels.length < 1) {
                    alert("无法生成XML!")
                } else if (panels.length == 1) {
                    // 直接生成XML
                    generateXML($iframe);
                } else if (panels.length > 1) {
                    var isContinue = true;
                    // 多配网模式
                    panels.each(function (index, item) {
                        console.log("多配网模式...")
                        if (item.innerText == "") {
                            alert("请先依次点击每一项配网模式的Tab标签以便完成数据加载")
                            isContinue = false;
                            return false;
                        }
                    });

                    // 数据加载完成继续生成XML
                    if (isContinue) {
                        generateXML($iframe);
                    }

                }

            })

            clearInterval(monitorOpenDialogInterval);
            monitorCloseDialogInterval = setInterval(monitorCloseDialog, 1000);
        }
    }

    var deviceName = "";
    /**
     * 生成XML
     * @param {s} $iframe iframe的jquery对象
     */
    function generateXML($iframe) {
        var tabs = $iframe.find("div[role=tab]");

        var deviceTypeId = $iframe.find(".ant-table-row.ant-table-row-level-0.ant-table-row-selected")[0].dataset.rowKey;

        if (tabs.length <= 0) {
            alert("无任何配网模式");
            return;
        }

        var xml = "<deviceGuide>\n" +
            "    <deviceTypeId>" + deviceTypeId + "</deviceTypeId>\n";
        // 1. 设备名称
        deviceName = $iframe.find(".ant-modal-title")[0].innerText;
        deviceName = deviceName.substring(0, deviceName.indexOf("/"));
        xml += "    <deviceName>" + deviceName + "</deviceName>\n"
        xml += "    <deviceFactory>FACTORY_</deviceFactory>\n" +
            "    <deviceType>TYPE_SD_DEVICE</deviceType>\n" +
            "    <windowPeriod>120</windowPeriod>\n";

        // 3. 绑定模式
        var guideType = "";
        var multiGuideType = [];
        // 前置选择页面
        var firstPage = "";
        /*
         * true : 单配网模式
         * false : 多配网模式
         */
        var isSimpleMode = false;
        if (tabs.length == 1) {
            isSimpleMode = true;
            // 单配网模式
            if (tabs[0].innerText.indexOf("有线") != -1 || tabs[0].innerText.indexOf("4G") != -1) {
                // 有线模式
                guideType = 21;
                xml += "    <guideType>" + guideType + "</guideType>\n";
                // 添加绑定规则
                xml += "      <ruleInfos>\n" +
                    "          <ruleInfo>\n" +
                    "              <value>\n" +
                    "                  <content>barCode</content>\n" +
                    "                  <desc>^[0-9]{16}$</desc>\n" +
                    "              </value>\n" +
                    "          </ruleInfo>\n" +
                    "      </ruleInfos>\n"
            } else if (tabs[0].innerText.indexOf("二维码") != -1) {
                // 二维码模式
                guideType = 20;
                xml += "        <guideType>" + guideType + "</guideType>\n";
            } else if (tabs[0].innerText.indexOf("AP") != -1) {
                // AP模式
                guideType = 5;
                xml += "        <guideType>" + guideType + "</guideType>\n";
            } else if (tabs[0].innerText.indexOf("声波") != -1) {
                // 声波模式
                guideType = 19;
                xml += "        <guideType>" + guideType + "</guideType>\n";
            }
            xml += "    <guidePageList>\n";
        } else {
            var tempTab = "";
            tabs.each(function (index, item) {
                tempTab += item.innerText;
            });
            if (tempTab.indexOf("有线") != -1) {
                xml += "        <ruleInfos>\n" +
                    "            <ruleInfo>\n" +
                    "                <value>\n" +
                    "                    <content>barCode</content>\n" +
                    "                    <desc>^[0-9]{16}$</desc>\n" +
                    "                </value>\n" +
                    "            </ruleInfo>\n" +
                    "        </ruleInfos>\n"
            }

            xml += "<guidePageList>\n";
            // 多配网模式
            isSimpleMode = false;
            firstPage = "            <guidePage>\n" +
                "                <title>选择连接模式</title>\n" +
                "                <pageType>selectPage</pageType>\n" +
                "                <guideTipList>\n";
            tabs.each(function (index, item) {
                if (item.innerText.indexOf("有线") != -1) {
                    multiGuideType[index] = 21;
                    firstPage += "                    <guideTip>\n" +
                        "                        <subguideType>21</subguideType>\n" +
                        "                        <imageHttpUrl>hardware_bg_bule</imageHttpUrl>\n" +
                        "                        <mainTips>使用有线模式连接</mainTips>\n" +
                        "                    </guideTip>\n";
                } else if (item.innerText.indexOf("二维码") != -1) {
                    multiGuideType[index] = 20;
                    firstPage += "                    <guideTip>\n" +
                        "                        <subguideType>20</subguideType>\n" +
                        "                        <imageHttpUrl>hardware_pic_yellow_guide</imageHttpUrl>\n" +
                        "                        <mainTips>使用WiFi-二维码模式连接</mainTips>\n" +
                        "                    </guideTip>\n";
                } else if (item.innerText.indexOf("AP") != -1) {
                    multiGuideType[index] = 5;
                    firstPage += "                    <guideTip>\n" +
                        "                        <subguideType>5</subguideType>\n" +
                        "                        <imageHttpUrl>monitor_add_device_bg_hotspot</imageHttpUrl>\n" +
                        "                        <mainTips>使用WiFi-热点模式连接</mainTips>\n" +
                        "                    </guideTip>\n";
                } else if (item.innerText.indexOf("4G") != -1) {
                    multiGuideType[index] = 21;
                    firstPage += "                    <guideTip>\n" +
                        "                        <subguideType>22</subguideType>\n" +
                        "                        <imageHttpUrl>monitor_add_device_bg_4G</imageHttpUrl>\n" +
                        "                        <mainTips>使用4G模式连接</mainTips>\n" +
                        "                    </guideTip>\n";
                } else if (item.innerText.indexOf("声波") != -1) {
                    multiGuideType[index] = 19;
                    firstPage += "                    <guideTip>\n" +
                        "                        <subguideType>19</subguideType>\n" +
                        "                        <imageHttpUrl>monitor_add_device_bg_4G</imageHttpUrl>\n" +
                        "                        <mainTips>使用声波模式连接</mainTips>\n" +
                        "                    </guideTip>\n";
                }
            });
            firstPage += "                </guideTipList>\n" +
                "            </guidePage>";
        }

        // 4. 添加前置页面
        xml += firstPage;

        // 5. 生成各种模式的XML
        var panels = $iframe.find("div[role=tabpanel]");

        var bindXml = "";
        if (isSimpleMode) {
            if (guideType == 21) {
                bindXml += generateWiredModeXML(panels[0], true);
            } else if (guideType == 20) {
                bindXml += generateQrCodeModeXML(panels[0], true);
            } else if (guideType == 5) {
                bindXml += generateAPModeXML(panels[0], true);
            } else if (guideType == 19) {
                bindXml += generateSoundWaveModeXML(panels[0], true);
            }
        } else {
            multiGuideType.forEach(function (item, index) {
                if (item == 21) {
                    bindXml += generateWiredModeXML(panels[index], false);
                } else if (item == 20) {
                    bindXml += generateQrCodeModeXML(panels[index], false);
                } else if (item == 5) {
                    bindXml += generateAPModeXML(panels[index], false);
                } else if (item == 19) {
                    bindXml += generateSoundWaveModeXML(panels[index], false);
                }
            });
        }
        xml += bindXml + "</guidePageList>\n" +
            "        <successBtn>去查看,去分享</successBtn>\n" +
            "        <deviceAddFailedRetryShow>true</deviceAddFailedRetryShow>\n" +
            "        <helpLink>https://video.komect.com/problemDiagnosis/Diagnosis.html</helpLink>\n" +
            "    </deviceGuide>";


        xml = formatXml(xml)
        console.log(xml)
        copyToClipWithStyle(xml)
    }

    /**
     * 简单弹出Toast提示
     * @param {*} msg 信息
     * @param {*} duration 时长
     */
    function toast(msg, duration) {
        duration = isNaN(duration) ? 3000 : duration;
        var m = document.createElement('div');
        m.innerHTML = msg;
        m.style.cssText = "max-width:60%;min-width: 150px;padding:0 14px;height: 40px;color: rgb(255, 255, 255);line-height: 40px;text-align: center;border-radius: 4px;position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);z-index: 999999;background: rgba(0, 0, 0,.7);font-size: 16px;";
        document.body.appendChild(m);
        setTimeout(function () {
            var d = 0.5;
            m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
            m.style.opacity = '0';
            setTimeout(function () { document.body.removeChild(m) }, d * 1000);
        }, duration);
    }

    /**
     * 复制内容到粘贴板
     * @param {*} content  需要复制的内容
     * @param {*} message 复制完后的提示，不传则默认提示"复制成功"
     */
    function copyToClip(content, message) {
        var aux = document.createElement("textarea");
        aux.setAttribute("value", content);
        document.body.appendChild(aux);
        aux.select();
        document.execCommand("copy");
        document.body.removeChild(aux);
        if (message == null) {
            alert("复制成功");
        } else {
            alert(message);
        }
    }

    /**
     * 复制内容到粘贴板(带格式)
     * @param {*} content 内容
     */
    function copyToClipWithStyle(content) {
        const input = document.createElement('textarea');
        document.body.appendChild(input);
        input.value = content;
        input.select();
        if (document.execCommand('copy')) {
            document.execCommand('copy');
            console.log('复制成功');
        }
        document.body.removeChild(input);
        // alert("复制成功");
        toast("复制成功", 2000)
    }


    /**
     * 移除多余字符串
     * @param {String} result
     */
    function removeExtraCharacters(result) {
        // console.log("#removeExtraCharacters --> " + result)
        var endLineStr = "\\n"
        if (result.indexOf(endLineStr) == 0) {
            result = result.substring(endLineStr.length, result.length)
        }
        result = result.trim().replace(/ /g, "\\n").replace("2DOT4G", "2.4G")
        return result
    }

    /**
     * 生成有线绑定页面GuidePage
     * @param {*} panel
     * @param {*} isSimpleMode
     */
    function generateWiredModeXML(panel, isSimpleMode) {
        console.log("....generateWiredModeXML start....")
        // 1.添加设备
        // var $addDevice = $(panel).find("#addDevice > div > div > div");

        // 1.1 配网文案
        // 正常文案
        var prepareText = $(panel).find("#addDevice > div > div > div > div > span")[0].innerText;
        var prepares = prepareText.replace(/2.4G/g, "2DOT4G").replace(/[0-9][、.]/, "").split(/[0-9][、.]/g);
        var prepareTextResult = "";
        if (prepares.length == 1) {
            prepareTextResult = prepareText.replace(/2.4G/g, "2DOT4G").replace(/[0-9][、.]/, "");
        } else {
            prepares.forEach(function (item, index) {
                if (index != prepares.length - 1) {
                    prepareTextResult += (index + 1) + '.' + item.trim() + "\\n";
                } else {
                    prepareTextResult += (index + 1) + '.' + item.trim();
                }
            });
        }
        // 异常文案
        var anormalText = $(panel).find("#addDevice > div > div > div > div > span")[1].innerText;
        var anormals = anormalText.replace(/2.4G/g, "2DOT4G").replace(/[0-9][、.]/, "").split(/[0-9][、.]/g);
        var anormalTextResult = "";
        if (anormals.length == 1) {
            anormalTextResult = anormalText.replace(/2.4G/g, "2DOT4G").replace(/[0-9][、.]/, "");
        } else {
            anormals.forEach(function (item, index) {
                if (index != anormals.length - 1) {
                    anormalTextResult += (index + 1) + '.' + item.trim() + "\\n";
                } else {
                    anormalTextResult += (index + 1) + '.' + item.trim();
                }
            });
        }

        prepareTextResult = removeExtraCharacters(prepareTextResult)
        anormalTextResult = removeExtraCharacters(anormalTextResult)

        // 1.2 配网图片
        // 正常图片
        var normalImg = $(panel).find("#addDevice > div > div > div > div > div > img")[0].currentSrc;
        // 异常图片
        var anormalImg = $(panel).find("#addDevice > div > div > div > div > div > img")[1].currentSrc;

        // 1.3 操作状态
        // 正常状态
        var normalState = $(panel).find("#addDevice > div > div > div > span")[0].innerText;
        // 异常状态
        var anormalState = $(panel).find("#addDevice > div > div > div > span")[1].innerText;

        var preparePageXML = "<guidePage>\n" +
            "                <title>添加" + deviceName + "</title>\n" +
            "                <pageType>" + (isSimpleMode ? "prepareDevice" : "prepareDevice_21") + "</pageType>\n" +
            "                <checkStateDesc>" + normalState + "</checkStateDesc>\n" +
            "                <nextButton>下一步</nextButton>\n" +
            "                <guideTipList>\n" +
            "                    <guideTip>\n" +
            "                        <imageHttpUrl>" + normalImg + "</imageHttpUrl>\n" +
            "                        <mainTips>" + prepareTextResult + "</mainTips>\n" +
            "                    </guideTip>\n" +
            "                </guideTipList>\n" +
            "                <notReadyDesc>" + anormalState + "</notReadyDesc>\n" +
            "                <notReadyList>\n" +
            "                    <notReady>\n" +
            "                        <imageHttpUrl>" + anormalImg + "</imageHttpUrl>\n" +
            "                        <mainTips>" + anormalTextResult + "</mainTips>\n" +
            "                    </notReady>\n" +
            "                </notReadyList>\n" +
            "            </guidePage>\n";

        // 2. 扫码页面
        var scanImg = $(panel).find("#qrcode > div > div > div > div > div > img")[0].currentSrc;

        var scanPageXML = "<guidePage>\n" +
            "                <title>请使用手机扫描设备上的二维码</title>\n" +
            "                <pageType>scanDevice</pageType>\n" +
            "                <subTitle>请将二维码放入扫码框内，即可自动扫描</subTitle>\n" +
            "                <nextButton>手动添加</nextButton>\n" +
            "                <notReadyDesc>找不到设备二维码？</notReadyDesc>\n" +
            "                <notReadyList>\n" +
            "                    <notReady>\n" +
            "                        <imageHttpUrl>" + scanImg + "</imageHttpUrl>\n" +
            "                        <mainTips>请使用手机扫描包装盒或设备上的二维码</mainTips>\n" +
            "                    </notReady>\n" +
            "                </notReadyList>\n" +
            "            </guidePage>\n";

        // 3.输入页面
        var inputImg = $(panel).find("#qrcode > div > div > div > div > div > img")[1].currentSrc;
        var inputPageXMl = "<guidePage>\n" +
            "                <title>输入设备序列号</title>\n" +
            "                <pageType>inputmac</pageType>\n" +
            "                <inputDesc>设备S/N</inputDesc>\n" +
            "                <inputLength>16</inputLength>\n" +
            "                <inputHint>S/N位于二维码下方，16位数字</inputHint>\n" +
            "                <guideTipList>\n" +
            "                    <guideTip>\n" +
            "                        <imageHttpUrl>" + inputImg + "</imageHttpUrl>\n" +
            "                        <mainTips></mainTips>\n" +
            "                    </guideTip>\n" +
            "                </guideTipList>\n" +
            "            </guidePage>\n";

        // 4.连接中页面
        // 4.1 连接文案
        var connectText = $(panel).find("#fail > div > div > div > span")[0].innerText;
        var connects = connectText.replace(/2.4G/g, "2DOT4G").replace(/[0-9][、.]/, "").split(/[0-9][、.]/g);
        var connectTextResult = "";
        if (connects.length == 1) {
            connectTextResult = connectText.replace(/2.4G/g, "2DOT4G").replace(/[0-9][、.]/, "");
        } else {
            connects.forEach(function (item, index) {
                if (index != connects.length - 1) {
                    connectTextResult += (index + 1) + '.' + item.trim() + "\\n";
                } else {
                    connectTextResult += (index + 1) + '.' + item.trim();
                }
            });
        }

        // 4.2 失败标题
        var failTitle = $(panel).find("#fail > div > div > div > span")[1].innerText;

        // 4.3 失败文案
        var failText = $(panel).find("#fail > div > div > div > span")[2].innerText;
        var fails = failText.replace(/2.4G/g, "2DOT4G").replace(/[0-9][、.]/, "").split(/[0-9][、.]/g);
        var failTextResult = "";
        if (fails.length == 1) {
            failTextResult = failText.replace(/2.4G/g, "2DOT4G").replace(/[0-9][、.]/, "");
        } else {
            fails.forEach(function (item, index) {
                if (index != fails.length - 1) {
                    failTextResult += (index + 1) + '.' + item.trim() + "\\n";
                } else {
                    failTextResult += (index + 1) + '.' + item.trim();
                }
            });
        }

        connectTextResult = removeExtraCharacters(connectTextResult)
        failTextResult = removeExtraCharacters(failTextResult).replace("2DOT4G", "2.4G")

        // 4.4 连接图片
        var connectImg = $(panel).find("#fail > div > div > div > div > img")[1].currentSrc;

        // 4.5 失败图片
        var failImg = $(panel).find("#fail > div > div > div > div > img")[2].currentSrc;

        var connectPageXML = "<guidePage>\n" +
            "                <pageType>" + (isSimpleMode ? "connecting" : "connecting_21") + "</pageType>\n" +
            "                <nextButton>退出等待完成</nextButton>\n" +
            "                <guideTipList>\n" +
            "                    <guideTip>\n" +
            "                        <imageHttpUrl>" + connectImg + "</imageHttpUrl>\n" +
            "                        <mainTips>" + connectTextResult + "</mainTips>\n" +
            "                    </guideTip>\n" +
            "                </guideTipList>\n" +
            "                <notReadyDesc>" + failTitle + "</notReadyDesc>\n" +
            "                <notReadyList>\n" +
            "                    <notReady>\n" +
            "                        <imageHttpUrl>" + failImg + "</imageHttpUrl>\n" +
            "                        <mainTips>" + failTextResult + "</mainTips>\n" +
            "                    </notReady>\n" +
            "                </notReadyList>\n" +
            "            </guidePage>\n";
        console.log("....generateWiredModeXML e n d....")
        return preparePageXML + scanPageXML + inputPageXMl + connectPageXML;
    }

    /**
     * 生成设备扫描二维码的配网方式
     * @param {*} panel
     * @param {*} isSimpleMode
     */
    function generateQrCodeModeXML(panel, isSimpleMode) {
        console.log("....generateQrCodeModeXML start....")
        // 1.添加设备
        // var $addDevice = $(panel).find("#addDevice > div > div > div");

        // 1.1 配网文案
        // 正常文案
        var prepareText = $(panel).find("#addDevice > div > div > div > div > span")[0].innerText;
        var prepares = prepareText.replace(/2.4G/g, "2DOT4G").replace(/[0-9][、.]/, "").split(/[0-9][、.]/g);
        var prepareTextResult = "";
        if (prepares.length == 1) {
            prepareTextResult = prepareText.replace(/2.4G/g, "2DOT4G").replace(/[0-9][、.]/, "");
        } else {
            prepares.forEach(function (item, index) {
                if (index != prepares.length - 1) {
                    prepareTextResult += (index + 1) + '.' + item.trim() + "\\n";
                } else {
                    prepareTextResult += (index + 1) + '.' + item.trim();
                }
            });
        }
        // 异常文案
        var anormalText = $(panel).find("#addDevice > div > div > div > div > span")[1].innerText;
        var anormals = anormalText.replace(/2.4G/g, "2DOT4G").replace(/[0-9][、.]/, "").split(/[0-9][、.]/g);
        var anormalTextResult = "";
        if (anormals.length == 1) {
            anormalTextResult = anormalText.replace(/2.4G/g, "2DOT4G").replace(/[0-9][、.]/, "");
        } else {
            anormals.forEach(function (item, index) {
                if (index != anormals.length - 1) {
                    anormalTextResult += (index + 1) + '.' + item.trim() + "\\n";
                } else {
                    anormalTextResult += (index + 1) + '.' + item.trim();
                }
            });
        }
        prepareTextResult = removeExtraCharacters(prepareTextResult)
        anormalTextResult = removeExtraCharacters(anormalTextResult)

        // 1.2 配网图片
        // 正常图片
        var normalImg = $(panel).find("#addDevice > div > div > div > div > div > img")[0].currentSrc;
        // 异常图片
        var anormalImg = $(panel).find("#addDevice > div > div > div > div > div > img")[1].currentSrc;

        // 1.3 操作状态
        // 正常状态
        var normalState = $(panel).find("#addDevice > div > div > div > span")[0].innerText;
        // 异常状态
        var anormalState = $(panel).find("#addDevice > div > div > div > span")[1].innerText;

        var preparePageXML = "<guidePage>\n" +
            "                <title>添加" + deviceName + "</title>\n" +
            "                <pageType>" + (isSimpleMode ? "prepareDevice" : "prepareDevice_20") + "</pageType>\n" +
            "                <checkStateDesc>" + normalState + "</checkStateDesc>\n" +
            "                <nextButton>下一步</nextButton>\n" +
            "                <guideTipList>\n" +
            "                    <guideTip>\n" +
            "                        <imageHttpUrl>" + normalImg + "</imageHttpUrl>\n" +
            "                        <mainTips>" + prepareTextResult + "</mainTips>\n" +
            "                    </guideTip>\n" +
            "                </guideTipList>\n" +
            "                <notReadyDesc>" + anormalState + "</notReadyDesc>\n" +
            "                <notReadyList>\n" +
            "                    <notReady>\n" +
            "                        <imageHttpUrl>" + anormalImg + "</imageHttpUrl>\n" +
            "                        <mainTips>" + anormalTextResult + "</mainTips>\n" +
            "                    </notReady>\n" +
            "                </notReadyList>\n" +
            "            </guidePage>\n";

        // 2. wifi输入页面
        var wifiPageXML = "<guidePage>\n" +
            "                <title>为设备连接Wi-Fi</title>\n" +
            "                <pageType>inputWifi</pageType>\n" +
            "                <subTitle>1.请确保接入网络可正常使用。\\n2.请勿连接公共Wi-Fi、办公Wi-Fi等需要短信验证码或页面登陆的Wi-Fi。\\n3.请勿连接名称前有“5G”的Wi-Fi。</subTitle>\n" +
            "                <nextButton>下一步</nextButton>\n" +
            "            </guidePage>\n";

        // 3. Qrcode页面
        // 3.1 状态
        var codeCheckState = $(panel).find("#qrcode2 > div > div > div > span")[0].innerText;

        // 3.2 异常提示
        var codeTip = $(panel).find("#qrcode2 > div > div > div > span")[1].innerText;

        // 3.3 异常文案
        var codeAnormalText = $(panel).find("#qrcode2 > div > div > div > div > span")[0].innerText;
        var codeAnormals = codeAnormalText.replace(/2.4G/g, "2DOT4G").replace(/[0-9][、.]/, "").split(/[0-9][、.]/g);
        var codeAnormalTextResult = "";
        if (codeAnormals.length == 1) {
            codeAnormalTextResult = codeAnormalText.replace(/2.4G/g, "2DOT4G").replace(/[0-9][、.]/, "");
        } else {
            codeAnormals.forEach(function (item, index) {
                if (index != codeAnormals.length - 1) {
                    codeAnormalTextResult += (index + 1) + '.' + item.trim() + "\\n";
                } else {
                    codeAnormalTextResult += (index + 1) + '.' + item.trim();
                }
            });
        }

        codeAnormalTextResult = removeExtraCharacters(codeAnormalTextResult)

        // 3.4 异常图片
        var qrCodeAnormalImg = $(panel).find("#qrcode2 > div > div > div > div > div > img")[0].currentSrc;

        var qrcodePageXML = "<guidePage>\n" +
            "                <pageType>qrcode</pageType>\n" +
            "                <nextButton>下一步</nextButton>\n" +
            "                <guideTipList>\n" +
            "                    <guideTip>\n" +
            "                        <mainTips>点击放大二维码，将其放置于设备前方10-20厘米处</mainTips>\n" +
            "                    </guideTip>\n" +
            "                </guideTipList>\n" +
            "                <checkStateDesc>" + codeCheckState + "</checkStateDesc>\n" +
            "                <notReadyDesc>" + codeTip + "</notReadyDesc>\n" +
            "                <notReadyList>\n" +
            "                    <notReady>\n" +
            "                        <imageHttpUrl>" + qrCodeAnormalImg + "</imageHttpUrl>\n" +
            "                        <mainTips>" + codeAnormalTextResult + "</mainTips>\n" +
            "                    </notReady>\n" +
            "                </notReadyList>\n" +
            "            </guidePage>\n";

        // 4.连接中页面
        // 4.1 连接文案
        var connectText = $(panel).find("#fail > div > div > div > span")[0].innerText;
        var connects = connectText.replace(/2.4G/g, "2DOT4G").replace(/[0-9][、.]/, "").split(/[0-9][、.]/g);
        var connectTextResult = "";
        if (connects.length == 1) {
            connectTextResult = connectText.replace(/2.4G/g, "2DOT4G").replace(/[0-9][、.]/, "");
        } else {
            connects.forEach(function (item, index) {
                if (index != connects.length - 1) {
                    connectTextResult += (index + 1) + '.' + item.trim() + "\\n";
                } else {
                    connectTextResult += (index + 1) + '.' + item.trim();
                }
            });
        }

        // 4.2 失败标题
        var failTitle = $(panel).find("#fail > div > div > div > span")[1].innerText;

        // 4.3 失败文案
        var failText = $(panel).find("#fail > div > div > div > span")[2].innerText;
        var fails = failText.replace(/2.4G/g, "2DOT4G").replace(/[0-9][、.]/, "").split(/[0-9][、.]/g);
        var failTextResult = "";
        if (fails.length == 1) {
            failTextResult = failText.replace(/2.4G/g, "2DOT4G").replace(/[0-9][、.]/, "");
        } else {
            fails.forEach(function (item, index) {
                if (index != fails.length - 1) {
                    failTextResult += (index + 1) + '.' + item.trim() + "\\n";
                } else {
                    failTextResult += (index + 1) + '.' + item.trim();
                }
            });
        }

        connectTextResult = removeExtraCharacters(connectTextResult)
        failTextResult = removeExtraCharacters(failTextResult)

        // 4.4 连接图片
        var connectImg = $(panel).find("#fail > div > div > div > div > img")[1].currentSrc;

        // 4.5 失败图片
        var failImg = $(panel).find("#fail > div > div > div > div > img")[2].currentSrc;

        var connectPageXML = "<guidePage>\n" +
            "                <pageType>" + (isSimpleMode ? "connecting" : "connecting_20") + "</pageType>\n" +
            "                <nextButton>退出等待完成</nextButton>\n" +
            "                <guideTipList>\n" +
            "                    <guideTip>\n" +
            "                        <imageHttpUrl>" + connectImg + "</imageHttpUrl>\n" +
            "                        <mainTips>" + connectTextResult + "</mainTips>\n" +
            "                    </guideTip>\n" +
            "                </guideTipList>\n" +
            "                <notReadyDesc>" + failTitle + "</notReadyDesc>\n" +
            "                <notReadyList>\n" +
            "                    <notReady>\n" +
            "                        <imageHttpUrl>" + failImg + "</imageHttpUrl>\n" +
            "                        <mainTips>" + failTextResult + "</mainTips>\n" +
            "                    </notReady>\n" +
            "                </notReadyList>\n" +
            "            </guidePage>\n";

        console.log("....generateQrCodeModeXML e n d....")
        return preparePageXML + wifiPageXML + qrcodePageXML + connectPageXML;
    }


    /**
     * 生成AP配网模式的XML
     * @param {*} panel
     * @param {*} isSimpleMode
     */
    function generateAPModeXML(panel, isSimpleMode) {
        console.log("....generateAPModeXML start....")
        // 1.添加设备
        // var $addDevice = $(panel).find("#addDevice > div > div > div");

        // 1.1 配网文案
        // 正常文案
        var prepareText = $(panel).find("#addDevice > div > div > div > div > span")[0].innerText;
        var prepares = prepareText.replace(/2.4G/g, "2DOT4G").replace(/[0-9][、.]/, "").split(/[0-9][、.]/g);
        var prepareTextResult = "";
        if (prepares.length == 1) {
            prepareTextResult = prepareText.replace(/2.4G/g, "2DOT4G").replace(/[0-9][、.]/, "");
        } else {
            prepares.forEach(function (item, index) {
                if (index != prepares.length - 1) {
                    prepareTextResult += (index + 1) + '.' + item.trim() + "\\n";
                } else {
                    prepareTextResult += (index + 1) + '.' + item.trim();
                }
            });
        }

        // 异常文案
        var anormalText = $(panel).find("#addDevice > div > div > div > div > span")[1].innerText;
        var anormals = anormalText.replace(/2.4G/g, "2DOT4G").replace(/[0-9][、.]/, "").split(/[0-9][、.]/g);
        var anormalTextResult = "";
        if (anormals.length == 1) {
            anormalTextResult = anormalText.replace(/2.4G/g, "2DOT4G").replace(/[0-9][、.]/, "");
        } else {
            anormals.forEach(function (item, index) {
                if (index != anormals.length - 1) {
                    anormalTextResult += (index + 1) + '.' + item.trim() + "\\n";
                } else {
                    anormalTextResult += (index + 1) + '.' + item.trim();
                }
            });
        }

        prepareTextResult = removeExtraCharacters(prepareTextResult)
        anormalTextResult = removeExtraCharacters(anormalTextResult)

        // 1.2 配网图片
        // 正常图片
        var normalImg = $(panel).find("#addDevice > div > div > div > div > div > img")[0].currentSrc;
        // 异常图片
        var anormalImg = $(panel).find("#addDevice > div > div > div > div > div > img")[1].currentSrc;

        // 1.3 操作状态
        // 正常状态
        var normalState = $(panel).find("#addDevice > div > div > div > span")[0].innerText;
        // 异常状态
        var anormalState = $(panel).find("#addDevice > div > div > div > span")[1].innerText;

        var preparePageXML = "<guidePage>\n" +
            "                <title>添加" + deviceName + "</title>\n" +
            "                <pageType>" + (isSimpleMode ? "prepareDevice" : "prepareDevice_5") + "</pageType>\n" +
            "                <checkStateDesc>" + normalState + "</checkStateDesc>\n" +
            "                <nextButton>下一步</nextButton>\n" +
            "                <guideTipList>\n" +
            "                    <guideTip>\n" +
            "                        <imageHttpUrl>" + normalImg + "</imageHttpUrl>\n" +
            "                        <mainTips>" + prepareTextResult + "</mainTips>\n" +
            "                    </guideTip>\n" +
            "                </guideTipList>\n" +
            "                <notReadyDesc>" + anormalState + "</notReadyDesc>\n" +
            "                <notReadyList>\n" +
            "                    <notReady>\n" +
            "                        <imageHttpUrl>" + anormalImg + "</imageHttpUrl>\n" +
            "                        <mainTips>" + anormalTextResult + "</mainTips>\n" +
            "                    </notReady>\n" +
            "                </notReadyList>\n" +
            "            </guidePage>\n";



        //var wifiName = $(panel).find("#hotPoint > div > div > div > span")[0].innerText;
        var otherPageXml = "<guidePage>\n" +
            "                <title>为设备连接Wi-Fi</title>\n" +
            "                <pageType>inputWifi</pageType>\n" +
            "                <subTitle>1.请确保接入网络可正常使用。\\n2.请勿连接公共Wi-Fi、办公Wi-Fi等需要短信验证码或页面登陆的Wi-Fi。\\n3.请勿连接名称前有“5G”的Wi-Fi。</subTitle>\n" +
            "                <nextButton>下一步</nextButton>\n" +
            "            </guidePage>\n" +
            "            <guidePage>\n" +
            "                <title>将手机连接设备热点</title>\n" +
            "                <subTitle>当前Wi-Fi：%1$s</subTitle>\n" +
            "                <pageType>switchWifi</pageType>\n" +
            "                <isWindowPeriodShow>false</isWindowPeriodShow>\n" +
            "                <sendRequest>true</sendRequest>\n" +
            "                <checkStateDesc></checkStateDesc>\n" +
            "                <wifiPrefix>CMCC_HJQ_</wifiPrefix>\n" +
            "                <nextButton>设置Wi-Fi</nextButton>\n" +
            "                <notReadyDesc></notReadyDesc>\n" +
            "                <isNotReadyRetryShow>false</isNotReadyRetryShow>\n" +
            "                <guideTipList>\n" +
            "                    <guideTip>\n" +
            "                        <imageHttpUrl></imageHttpUrl>\n" +
            "                        <mainTips>请将手机WIFI连接到\"CMCC_HJQ_xxx\",返回和家亲APP后，自动开始连接</mainTips>\n" +
            "                    </guideTip>\n" +
            "                </guideTipList>\n" +
            "            </guidePage>\n" +
            "            <guidePage>\n" +
            "                <title>连接中，等待不超过%1$d秒</title>\n" +
            "                <subTitle>当前Wi-Fi：%1$s</subTitle>\n" +
            "                <pageType>" + (isSimpleMode ? "connecting" : "connecting_5") + "</pageType>\n" +
            "                <isWindowPeriodShow>true</isWindowPeriodShow>\n" +
            "                <sendRequest>false</sendRequest>\n" +
            "                <checkStateDesc></checkStateDesc>\n" +
            "                <nextButton></nextButton>\n" +
            "                <notReadyDesc>Wi-Fi不是%1$s, 点击去设置</notReadyDesc>\n" +
            "                <isNotReadyRetryShow>true</isNotReadyRetryShow>\n" +
            "                <guideTipList>\n" +
            "                    <guideTip>\n" +
            "                        <imageHttpUrl></imageHttpUrl>\n" +
            "                        <mainTips>若手机Wi-Fi切换为%1$s , 等待连接成功</mainTips>\n" +
            "                    </guideTip>\n" +
            "                </guideTipList>\n" +
            "            </guidePage>\n";

        console.log("....generateAPModeXML e n d....")
        return preparePageXML + otherPageXml;
    }

    /**
     * 生成声波配网模式的XML
     * @param {String} panel
     * @param {boolean} isSimpleMode
     */
    function generateSoundWaveModeXML(panel, isSimpleMode) {
        console.log("....generateSoundWaveModeXML start....")
        // 1.添加设备

        // 1.1 配网文案
        // 正常文案
        var prepareText = $(panel).find("#addDevice > div > div > div > div > span")[0].innerText;
        var prepares = prepareText.replace(/2.4G/g, "2DOT4G").replace(/[0-9][、.]/, "").split(/[0-9][、.]/g);
        var prepareTextResult = "";
        if (prepares.length == 1) {
            prepareTextResult = prepareText.replace(/2.4G/g, "2DOT4G").replace(/[0-9][、.]/, "");
        } else {
            prepares.forEach(function (item, index) {
                if (index != prepares.length - 1) {
                    prepareTextResult += (index + 1) + '.' + item.trim() + "\\n";
                } else {
                    prepareTextResult += (index + 1) + '.' + item.trim();
                }
            });
        }
        // 异常文案
        var anormalText = $(panel).find("#addDevice > div > div > div > div > span")[1].innerText;
        var anormals = anormalText.replace(/2.4G/g, "2DOT4G").replace(/[0-9][、.]/, "").split(/[0-9][、.]/g);
        var anormalTextResult = "";
        if (anormals.length == 1) {
            anormalTextResult = anormalText.replace(/2.4G/g, "2DOT4G").replace(/[0-9][、.]/, "");
        } else {
            anormals.forEach(function (item, index) {
                if (index != anormals.length - 1) {
                    anormalTextResult += (index + 1) + '.' + item.trim() + "\\n";
                } else {
                    anormalTextResult += (index + 1) + '.' + item.trim();
                }
            });
        }
        prepareTextResult = removeExtraCharacters(prepareTextResult)
        anormalTextResult = removeExtraCharacters(anormalTextResult)

        // 1.2 配网图片
        // 正常图片
        var normalImg = $(panel).find("#addDevice > div > div > div > div > div > img")[0].currentSrc;
        // 异常图片
        var anormalImg = $(panel).find("#addDevice > div > div > div > div > div > img")[1].currentSrc;

        // 1.3 操作状态
        // 正常状态
        var normalState = $(panel).find("#addDevice > div > div > div > span")[0].innerText;
        // 异常状态
        var anormalState = $(panel).find("#addDevice > div > div > div > span")[1].innerText;

        var preparePageXML = "<guidePage>\n" +
            "                <title>添加" + deviceName + "</title>\n" +
            "                <pageType>" + (isSimpleMode ? "prepareDevice" : "prepareDevice_19") + "</pageType>\n" +
            "                <checkStateDesc>" + normalState + "</checkStateDesc>\n" +
            "                <nextButton>下一步</nextButton>\n" +
            "                <guideTipList>\n" +
            "                    <guideTip>\n" +
            "                        <imageHttpUrl>" + normalImg + "</imageHttpUrl>\n" +
            "                        <mainTips>" + prepareTextResult + "</mainTips>\n" +
            "                    </guideTip>\n" +
            "                </guideTipList>\n" +
            "                <notReadyDesc>" + anormalState + "</notReadyDesc>\n" +
            "                <notReadyList>\n" +
            "                    <notReady>\n" +
            "                        <imageHttpUrl>" + anormalImg + "</imageHttpUrl>\n" +
            "                        <mainTips>" + anormalTextResult + "</mainTips>\n" +
            "                    </notReady>\n" +
            "                </notReadyList>\n" +
            "            </guidePage>\n";

        // 2. wifi输入页面
        var wifiPageXML = "<guidePage>\n" +
            "                <title>为设备连接Wi-Fi</title>\n" +
            "                <pageType>" + (isSimpleMode ? "inputWifi" : "inputWifi_19") + "</pageType>\n" +
            "                <subTitle>1.请确保接入网络可正常使用。\\n2.请勿连接公共Wi-Fi、办公Wi-Fi等需要短信验证码或页面登陆的Wi-Fi。\\n3.请勿连接名称前有“5G”的Wi-Fi。</subTitle>\n" +
            "                <nextButton>下一步</nextButton>\n" +
            "            </guidePage>\n";

        // 3. 声波配网
        // 3.1 声波配网第一步
        var soundWaveImg = $(panel).find("#sonicSend > div > div > div > div > div > img")[0].currentSrc;

        // 3.1 声波配网第二步
        // 正常状态
        var soundWaveNormalImg = $(panel).find("#sonicReceive > div > div > div > div > div > img")[0].currentSrc;
        //var soundWaveNormalTip = $(panel).find("#sonicReceive > div > div > div > span")[0].innerText;
        var soundWaveDesc = $(panel).find("#sonicReceive > div > div > div > span")[0].innerText;

        // 异常状态
        var soundWaveAbnormalImg = $(panel).find("#sonicReceive > div > div > div > div > div > img")[1].currentSrc;
        var soundWaveAbnormalDescTip = $(panel).find("#sonicReceive > div > div > div > span")[1].innerText;
        var soundWaveAbnormalTip = $(panel).find("#sonicReceive > div > div > div > div > div > div > div > div > pre")[0].innerText

        var soundWaveAbnormalTips = soundWaveAbnormalTip.replace(/2.4G/g, "2DOT4G").replace(/[0-9][、.]/, "").split(/[0-9][、.]/g);
        var soundWaveAbnormalTipResult = "";
        if (soundWaveAbnormalTips.length == 1) {
            soundWaveAbnormalTipResult = soundWaveAbnormalTip.replace(/2.4G/g, "2DOT4G").replace(/[0-9][、.]/, "");
        } else {
            soundWaveAbnormalTips.forEach(function (item, index) {
                if (index != soundWaveAbnormalTips.length - 1) {
                    soundWaveAbnormalTipResult += (index + 1) + '.' + item.trim() + "\\n";
                } else {
                    soundWaveAbnormalTipResult += (index + 1) + '.' + item.trim();
                }
            });
        }


        var soundWavePageXML = "<guidePage>\n" +
            "                <pageType>" + (isSimpleMode ? "soundWave" : "soundWave_19") + "</pageType>\n" +
            "                <pageStepList>\n" +
            "                    <pageStep>\n" +
            "                        <title>声波配网</title>\n" +
            "                        <nextButton>发送声波</nextButton>\n" +
            "                        <guideTipList>\n" +
            "                            <guideTip>\n" +
            "                                <imageHttpUrl>" + soundWaveImg + "</imageHttpUrl>\n" +
            "                                <mainTips>请调大手机音量并将手机靠近摄像机，点击“发送声波”按钮</mainTips>\n" +
            "                            </guideTip>\n" +
            "                        </guideTipList>\n" +
            "                    </pageStep>\n" +
            "                    <pageStep>\n" +
            "                        <title>声波配网</title>\n" +
            "                        <checkStateDesc>" + soundWaveDesc + "</checkStateDesc>\n" +
            "                        <nextButton>下一步</nextButton>\n" +
            "                        <notReadyDesc>" + soundWaveAbnormalDescTip + "</notReadyDesc>\n" +
            "                        <notReadyList>\n" +
            "                            <notReady>\n" +
            "                                <imageHttpUrl>" + soundWaveAbnormalImg + "</imageHttpUrl>\n" +
            "                                <mainTips>" + soundWaveAbnormalTipResult + "</mainTips>\n" +
            "                            </notReady>\n" +
            "                        </notReadyList>\n" +
            "                        <guideTipList>\n" +
            "                            <guideTip>\n" +
            "                                <imageHttpUrl>" + soundWaveNormalImg + "</imageHttpUrl>\n" +
            "                                <mainTips>等待设备发出“滴滴”提示音，若未收到，请10S后重新发送</mainTips>\n" +
            "                                <highLightPosition>24-28</highLightPosition>\n" +
            "                            </guideTip>\n" +
            "                        </guideTipList>\n" +
            "                    </pageStep>\n" +
            "                </pageStepList>\n" +
            "            </guidePage>";

        // 4.连接中页面
        // 4.1 连接文案
        var connectText = $(panel).find("#fail > div > div > div > span")[0].innerText;
        var connects = connectText.replace(/2.4G/g, "2DOT4G").replace(/[0-9][、.]/, "").split(/[0-9][、.]/g);
        var connectTextResult = "";
        if (connects.length == 1) {
            connectTextResult = connectText.replace(/2.4G/g, "2DOT4G").replace(/[0-9][、.]/, "");
        } else {
            connects.forEach(function (item, index) {
                if (index != connects.length - 1) {
                    connectTextResult += (index + 1) + '.' + item.trim() + "\\n";
                } else {
                    connectTextResult += (index + 1) + '.' + item.trim();
                }
            });
        }

        // 4.2 失败标题
        var failTitle = $(panel).find("#fail > div > div > div > span")[1].innerText;

        // 4.3 失败文案
        var failText = $(panel).find("#fail > div > div > div > span")[2].innerText;
        var fails = failText.replace(/2.4G/g, "2DOT4G").replace(/[0-9][、.]/, "").split(/[0-9][、.]/g);
        var failTextResult = "";
        if (fails.length == 1) {
            failTextResult = failText.replace(/2.4G/g, "2DOT4G").replace(/[0-9][、.]/, "");
        } else {
            fails.forEach(function (item, index) {
                if (index != fails.length - 1) {
                    failTextResult += (index + 1) + '.' + item.trim() + "\\n";
                } else {
                    failTextResult += (index + 1) + '.' + item.trim();
                }
            });
        }

        connectTextResult = removeExtraCharacters(connectTextResult)
        failTextResult = removeExtraCharacters(failTextResult)

        // 4.4 连接图片
        var connectImg = $(panel).find("#fail > div > div > div > div > img")[1].currentSrc;

        // 4.5 失败图片
        var failImg = $(panel).find("#fail > div > div > div > div > img")[2].currentSrc;

        var connectPageXML = "<guidePage>\n" +
            "                <pageType>" + (isSimpleMode ? "connecting" : "connecting_19") + "</pageType>\n" +
            "                <nextButton>退出等待完成</nextButton>\n" +
            "                <guideTipList>\n" +
            "                    <guideTip>\n" +
            "                        <imageHttpUrl>" + connectImg + "</imageHttpUrl>\n" +
            "                        <mainTips>" + connectTextResult + "</mainTips>\n" +
            "                    </guideTip>\n" +
            "                </guideTipList>\n" +
            "                <notReadyDesc>" + failTitle + "</notReadyDesc>\n" +
            "                <notReadyList>\n" +
            "                    <notReady>\n" +
            "                        <imageHttpUrl>" + failImg + "</imageHttpUrl>\n" +
            "                        <mainTips>" + failTextResult + "</mainTips>\n" +
            "                    </notReady>\n" +
            "                </notReadyList>\n" +
            "            </guidePage>\n";

        console.log("....generateSoundWaveModeXML e n d....")
        return preparePageXML + wifiPageXML + soundWavePageXML + connectPageXML;
    }

    /**
     * 监听对话框的显示与隐藏
     */
    function monitorCloseDialog() {
        var $iframe = $("body").contents();
        if ($iframe.find(".ant-modal-header").length == 0) {
            console.log("close dialog...");
            // 隐藏对话框
            clearInterval(monitorCloseDialogInterval);
            monitorOpenDialogInterval = setInterval(monitorOpenDialog, 1000);
        }
    }

    /*******************************************格式化XML START********************************************** */
    String.prototype.removeLineEnd = function () {
        return this.replace(/(<.+?\s+?)(?:\n\s*?(.+?=".*?"))/g, '$1 $2')
    }

    function formatXml(text) {
        //去掉多余的空格
        text = '\n' + text.replace(/(<\w+)(\s.*?>)/g, function ($0, name, props) {
            return name + ' ' + props.replace(/\s+(\w+=)/g, " $1");
        }).replace(/>\s*?</g, ">\n<");

        //把注释编码
        text = text.replace(/\n/g, '\r').replace(/<!--(.+?)-->/g, function ($0, text) {
            var ret = '<!--' + escape(text) + '-->';
            //alert(ret);
            return ret;
        }).replace(/\r/g, '\n');

        //调整格式
        var rgx = /\n(<(([^\?]).+?)(?:\s|\s*?>|\s*?(\/)>)(?:.*?(?:(?:(\/)>)|(?:<(\/)\2>)))?)/mg;
        var nodeStack = [];
        var output = text.replace(rgx, function ($0, all, name, isBegin, isCloseFull1, isCloseFull2, isFull1, isFull2) {
            var isClosed = (isCloseFull1 == '/') || (isCloseFull2 == '/') || (isFull1 == '/') || (isFull2 == '/');
            //alert([all,isClosed].join('='));
            var prefix = '';
            if (isBegin == '!') {
                prefix = getPrefix(nodeStack.length);
            } else {
                if (isBegin != '/') {
                    prefix = getPrefix(nodeStack.length);
                    if (!isClosed) {
                        nodeStack.push(name);
                    }
                } else {
                    nodeStack.pop();
                    prefix = getPrefix(nodeStack.length);
                }

            }
            var ret = '\n' + prefix + all;
            return ret;
        });

        var prefixSpace = -1;
        var outputText = output.substring(1);
        //alert(outputText);

        //把注释还原并解码，调格式
        outputText = outputText.replace(/\n/g, '\r').replace(/(\s*)<!--(.+?)-->/g, function ($0, prefix, text) {
            //alert(['[',prefix,']=',prefix.length].join(''));
            if (prefix.charAt(0) == '\r')
                prefix = prefix.substring(1);
            text = unescape(text).replace(/\r/g, '\n');
            var ret = '\n' + prefix + '<!--' + text.replace(/^\s*/mg, prefix) + '-->';
            //alert(ret);
            return ret;
        });

        return outputText.replace(/\s+$/g, '').replace(/\r/g, '\r\n');
    }

    function getPrefix(prefixIndex) {
        var span = '    ';
        var output = [];
        for (var i = 0; i < prefixIndex; ++i) {
            output.push(span);
        }

        return output.join('');
    }
    /*******************************************格式化XML E N D********************************************** */

})();