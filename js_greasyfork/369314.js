// ==UserScript==
// @name        Export rainpat.com user collection
// @description 润桐收藏夹导出为 CSV 的工具
// @version     0.0.1
// @author      biggates
// @include     http://www.rainpat.com/User/Collect
// @namespace https://greasyfork.org/users/189957
// @downloadURL https://update.greasyfork.org/scripts/369314/Export%20rainpatcom%20user%20collection.user.js
// @updateURL https://update.greasyfork.org/scripts/369314/Export%20rainpatcom%20user%20collection.meta.js
// ==/UserScript==

jQuery(function () {
    $('body').append($('<div id="export_csv_dlg" style="width:80%;height:80%"><textarea style="width:99%;height:99%;">'));
    $.fn.zTree.destroy("FaveriteTree");
    // TODO 重绘左侧的菜单，为每个加上导出按钮
    $.get('../User/GetfaveriteTree', function (data) {
        if (data == "-1") {
            alert('登陆超时');
            location.reload();
            return;
        }
        var setting = {
            view: {
                addDiyDom: function (treeId, treeNode) {
                    if (treeNode.isParent) {
                        return;
                    }
                    var aObj = $('#' + treeNode.tId + '_a');
                    var editStr = '<button id="diyBtn_' + treeNode.id + '">导出</button>';
                    aObj.append($(editStr));
                    var $btn = $('#diyBtn_' + treeNode.id);
                    if ($btn) {
                        $btn.click(function () {
                            getList();
                            return false;
                        });
                    }
                }
            },
            data: {
                simpleData: {
                    enable: true
                }
            },
            callback: {
                onClick: UFOnClick,
                beforeRemove: UFbeforeRemove,
                beforeRename: UFbeforeRename
            }
        };
        try {
            $.fn.zTree.init($("#FaveriteTree"), setting, data);
            var ftree = $.fn.zTree.getZTreeObj("FaveriteTree");
            ftree.selectNode(ftree.getNodes()[0]);
            OwnSpagechange(1, 10);
        } catch (e) {
            alert(e);
        }
    });

    /**
     * 
     * @param {int} p page index(start from 1)
     * @param {int} n page size (default = 10)
     */
    function getList() {
        MaskShow(null, "请稍候...");
        $.post('../User/Collectpatentlist', {
            'id': Collectid,
            'cnfl': CollectlistC,
            'onepage': 100,
            'page': 1,
            't': Collecttype
        }, function (data) {
            // 将 data 转成 csv
            var csv = '序号,申请号,申请日,名称,申请类型,申请人,发明人,IPC,法律状态,有效性,摘要\r\n';
            for (var i = 0; i < data.Items.length; i++) {
                var item = data.Items[i];
                csv += (i + 1);
                csv += ',"';
                csv += item.AppNo; // 申请号
                csv += '","';
                csv += item.AppDate; // 申请日
                csv += '","';
                csv += item.Title; // 名称
                csv += '","';
                csv += item.AppType; // 申请类型
                csv += '","';
                csv += item.Applicant; // 申请人
                csv += '","';
                csv += ''; // 发明人
                csv += '","';
                csv += item.MainIPC; // IPC
                csv += '","';
                csv += item.LegalStatus; // 法律状态
                csv += '","';
                csv += item.Validity; // 有效性
                csv += '","';
                csv += item.Abstract; // 摘要
                csv += '"\r\n';
            };

            $('#export_csv_dlg textarea').text(csv);
            MaskClose(null);

            $('#export_csv_dlg').dialog({
                title: '导出为 CSV',
                modal: true,
                resizable: true
            });
        });
    }
});
