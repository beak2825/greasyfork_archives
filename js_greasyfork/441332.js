// 列表初始化
initTlist();

// 淘宝天猫列表初始化入口
function initTlist() {
    if (host.indexOf("taobao") > -1) {
        if (host.indexOf("item.taobao") === -1) {
            var targetNode = $("#mainsrp-itemlist")[0] || $("#listsrp-itemlist")[0];
            if (targetNode) {
                var observer = new MutationObserver(function (mutations) {
                    initList();
                });
                observer.observe(targetNode, {
                    attributes: true,
                    childList: true,
                });
                initList();
            }
        }
        // 淘宝列表推荐
        listRecInit();
    } else if (host.indexOf("tmall") > -1) {
        initList();
        // 天猫列表推荐
        tmListRecInit();
    }
}
// 淘宝列表页获取数据
function initList() {
    let list = $(".J_MouserOnverReq");
    let num_iid = '';
    list.each(function () {
        let that = $(this);
        if (host.indexOf("taobao") > -1) {
            that.css({ position: "relative" });
            num_iid = $(this).find("a").attr("data-nid");
        } else if (host.indexOf("tmall") > -1) {
            num_iid = $(this).attr("data-id");
        }
        let dtd = $.Deferred();
        let wait = function (dtd) {
            $.ajax({
                url: "https://api.zhetaoke.com:10001/api/open_gaoyongzhuanlian.ashx",
                method: "get",
                data: {
                    appkey: config.zhetaoke.appkey,
                    sid: config.zhetaoke.sid,
                    pid: config.zhetaoke.pid,
                    num_iid: num_iid,
                    signurl: 4,
                },
            }).done(function (res) {
                dtd.resolve(res);
            });
            return dtd.promise();
        };
        $.when(wait(dtd)).done(function (res) {
            listChange(that, res);
        });
    });
}
// 淘宝天猫列表页插入 更换链接 插入优惠券
function listChange(that, data) {
    let obj = JSON.parse(data);
    if (obj.tbk_privilege_get_response) {
        let result = obj.tbk_privilege_get_response.result;
        if (result.data.coupon_info) {
            let html =
                "<div class='jar-list-coupon'><p><a target='_blank' href=https://www.ergirl.com/jump.html?url=" +
                result.data.shorturl +
                ">" +
                result.data.coupon_info +
                "</a></p></div>";
            that.append(html);
        }
    } else {
        // console.log("无");
    }
}
// 淘宝列表推荐初始化
function listRecInit() {
    let q = getQueryVariable("q");
    if (q) {
        let params = {
            appkey: config.zhetaoke.appkey,
            page: "1",
            page_size: "20",
            sort: "sale_num_desc",
            q: decodeURIComponent(q),
            youquan: "1",
        };
        let url = "https://api.zhetaoke.com:10003/api/api_quanwang.ashx";
        dtd(url, params, addListRec);
    }
}
// 插入列表推荐dom
function addListRec(data) {
    let list = JSON.parse(data).content;
    let html = "";
    let html1 =
        '<div class="m-itemlist jar-list-rec">' +
        '<div class="grid g-clearfix">' +
        '<div class="swiper-container">' +
        '<div class="swiper-wrapper">';
    let html3 =
        '</div><div class="swiper-button-prev" style="width:45px;height:100px;color: #f40;margin-top:-50px;background:rgba(0,0,0,0.4)"></div>' +
        '<div class="swiper-button-next" style="width:45px;height:100px;color: #f40;margin-top:-50px;margin-right: 20px;background:rgba(0,0,0,0.4);"></div>' +
        "</div></div></div>";
    list.forEach((item) => {
        let params = {
            appkey: config.zhetaoke.appkey,
            sid: config.zhetaoke.sid,
            pid: config.zhetaoke.pid,
            num_iid: item.tao_id,
            signurl: 4,
        };
        let url = "https://api.zhetaoke.com:10001/api/open_gaoyongzhuanlian.ashx";
        dtd(url, params, listRecChangeUrl);
        let html2 =
            '<div class="swiper-slide">' +
            '<div class="items" data-id="' +
            item.tao_id +
            '">' +
            '<div class="item J_MouserOnverReq" style="height: 365px;">' +
            '<div class="pic-box J_MouseEneterLeave J_PicBox">' +
            '<div class="pic-box-inner">' +
            '<div class="pic">' +
            '<a class="pic-link J_ClickStat J_ItemPicA" data-nid="' +
            item.tao_id +
            '" href="' +
            item.item_url +
            '" target="_blank">' +
            '<img class="J_ItemPic img" src="' +
            item.pict_url +
            '" alt="' +
            item.tao_title +
            '">' +
            "</a></div></div></div>" +
            '<div class="ctx-box J_MouseEneterLeave J_IconMoreNew">' +
            '<div class="row row-1 g-clearfix">' +
            '<div class="price g_price g_price-highlight">' +
            "<span>¥</span><strong>" +
            item.quanhou_jiage +
            "</strong>" +
            "</div>" +
            '<div class="deal-cnt">' +
            item.volume +
            "人付款</div>" +
            "</div>" +
            '<div class="row row-2 title">' +
            '<a class="J_ClickStat" href="' +
            item.item_url +
            '" target="_blank">' +
            item.tao_title +
            "</a></div></div></div></div></div>";
        html += html2;
    });
    $("#mainsrp-related").append(html1 + html + html3);
    var mySwiper = new Swiper(".swiper-container", {
        slidesPerView: 4,
        slidesPerGroup: 4,
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
    });
}
// 推荐转链
function listRecChangeUrl(data) {
    let obj = JSON.parse(data).tbk_privilege_get_response.result.data;
    let node = $('.jar-list-rec .items[data-id="' + obj.item_id + '"]');
    if (obj.coupon_info) {
        let html =
            "<div class='jar-list-coupon' style='right:22px;bottom:0;'><p><a target='_blank' href=https://www.ergirl.com/jump.html?url=" +
            obj.shorturl +
            ">" +
            obj.coupon_info +
            "</a></p></div>";
        node.append(html);
    }
}
// 天猫推荐初始化
function tmListRecInit() {
    let q = getQueryVariable("q");
    if (q) {
        try {
            let params = {
                appkey: config.zhetaoke.appkey,
                page: "1",
                page_size: "20",
                sort: "sale_num_desc",
                q: decodeURI(q),
                youquan: "1",
            };
            let url = "https://api.zhetaoke.com:10003/api/api_quanwang.ashx";
            dtd(url, params, addTmListRec);
            //utf-8
        } catch (err) {
            //gbk or 其他编码
            urldecode(q, "gbk", function (str) {
                let params = {
                    appkey: config.zhetaoke.appkey,
                    page: "1",
                    page_size: "20",
                    sort: "sale_num_desc",
                    q: str,
                    youquan: "1",
                };
                let url = "https://api.zhetaoke.com:10003/api/api_quanwang.ashx";
                dtd(url, params, addTmListRec);
            });
        }
    }
}
// 插入天猫列表推荐dom
function addTmListRec(data) {
    let list = JSON.parse(data).content;
    let html = "";
    let html1 =
        '<div class="m-itemlist jar-list-rec">' +
        '<div class="grid g-clearfix">' +
        '<div class="swiper-container">' +
        '<div class="swiper-wrapper">';
    let html3 =
        '</div><div class="swiper-button-prev" style="width:45px;height:100px;color: #f40;margin-top:-50px;background:rgba(0,0,0,0.4)"></div>' +
        '<div class="swiper-button-next" style="width:45px;height:100px;color: #f40;margin-top:-50px;margin-right: 20px;background:rgba(0,0,0,0.4);"></div>' +
        "</div></div></div>";
    list.forEach((item) => {
        let params = {
            appkey: config.zhetaoke.appkey,
            sid: config.zhetaoke.sid,
            pid: config.zhetaoke.pid,
            num_iid: item.tao_id,
            signurl: 4,
        };
        let url = "https://api.zhetaoke.com:10001/api/open_gaoyongzhuanlian.ashx";
        dtd(url, params, tmListRecChangeUrl);
        let html2 =
            '<div class="swiper-slide">' +
            '<div class="product" data-id="' +
            item.tao_id +
            '" style="width:100%;height:315px;">' +
            '<div class="product-iWrap">' +
            '<div class="productImg-wrap">' +
            '<a href="' +
            item.item_url +
            '" class="productImg" target="_blank">' +
            '<img src="' +
            item.pict_url +
            '">' +
            "</a>" +
            "</div>" +
            '<p class="productPrice">' +
            '<em title="' +
            item.quanhou_jiage +
            '"><b>¥</b>' +
            item.quanhou_jiage +
            "</em>" +
            "</p>" +
            '<p class="productTitle">' +
            '<a href="' +
            item.item_url +
            '">' +
            item.tao_title +
            "</a>" +
            "</p>" +
            "</div>" +
            "</div>" +
            "</div>";
        html += html2;
    });
    $("#J_NavAttrsForm").append(html1 + html + html3);
    var mySwiper = new Swiper(".swiper-container", {
        slidesPerView: 5,
        slidesPerGroup: 5,
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
    });
}
// 天猫推荐转链
function tmListRecChangeUrl(data) {
    let obj = JSON.parse(data).tbk_privilege_get_response.result.data;
    let node = $('.jar-list-rec .product[data-id="' + obj.item_id + '"]');
    if (obj.coupon_info) {
        let html =
            "<div class='jar-list-coupon' style='right:22px;bottom:0;'><p><a target='_blank' href=https://www.ergirl.com/jump.html?url=" +
            obj.shorturl +
            ">" +
            obj.coupon_info +
            "</a></p></div>";
        node.append(html);
    }
}