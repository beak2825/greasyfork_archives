if (host.indexOf("coll.jd") > -1) {
    jdCollInit();
}
if (
    host.indexOf("list.jd") > -1 ||
    host.indexOf("search.jd") > -1
) {
    // jdListRec();
    jdListInit();
    jdDropDown();
    jdPageChange();
}
function jdCollInit() {
    let listArr = $("#plist ul").children("li").find(".j-sku-item");
    listArr.each(function () {
        let that = $(this);
        let id = that.attr("data-sku");
        if (id) {
            getJdListCoupon(id);
        }
    });
}
// 下拉改变时触发
function jdDropDown() {
    let node = $("#J_goodsList .gl-warp")[0];
    if (node) {
        domAddEventListener(node, jdDropDownChange);
    }
}
// 下拉回调
function jdDropDownChange(data) {
    let arr = data[0].addedNodes;
    arr.forEach((item) => {
        if (item.nodeName === "LI") {
            let id = $(item).attr("data-sku");
            if (id) {
                getJdListCoupon(id);
            }
        }
    });
}
// 分页改变时触发
function jdPageChange() {
    let node = $(".ml-wrap")[0];
    if (node) {
        domAddEventListener(node, pageChangeCall);
    }
}
// 分页回调
function pageChangeCall(data) {
    data.forEach((item) => {
        if (item.type === "childList") {
            if ($(item.target).attr("class") === "ml-wrap") {
                if (item.addedNodes.length > 8) {
                    jdListInit();
                    jdDropDown();
                }
            }
        }
    });
}
// 列表初始化
function jdListInit() {
    let listArr = $("#J_goodsList ul").children("li");
    listArr.each(function () {
        let that = $(this);
        let id = that.attr("data-sku");
        if (id) {
            getJdListCoupon(id);
        }
    });
}
// 获取列表详情
function getJdListCoupon(id) {
    // let params = {
    //     data: {
    //         key: id,
    //     },
    // };
    // let dtd = $.Deferred();
    // let wait = function (dtd) {
    //     $.ajax({
    //         url: "https://api.ergirl.com/jdSearch",
    //         type: "post",
    //         data: JSON.stringify(params),
    //         headers: {
    //             "Content-Type":
    //                 "application/json; charset=UTF-8",
    //         },
    //     })
    //         .done(function (res) {
    //             dtd.resolve(res);
    //         })
    //         .fail(function () {
    //             dtd.resolve({ error: true });
    //         });
    //     return dtd.promise();
    // };
    // $.when(wait(dtd)).done(function (res) {
    //     addjdListCoupon(res);
    // });
    $.ajax({
        url: 'https://api.zhetaoke.com:10001/api/open_jing_union_open_goods_query.ashx',
        data: {
            'appkey': '52b273a5972949388ce7b57b84453aa4',
            'keyword': id
        },
        type: 'get',
        success: function (res) {
            let result = JSON.parse(JSON.parse(res).jd_union_open_goods_query_response.result)
            if (result.data) {
                addjdListCoupon(result.data[0])
            }
        }
    })
}
// 添加京东列表优惠券
function addjdListCoupon(data) {
    let couponInfo = data.couponInfo
    let couponList = couponInfo.couponList
    if (couponList.length > 0) { // 是否有优惠券
        let bestArr = couponList.filter(item => {
            return item.isBest === 1
        })
        let coupon = bestArr[0] // 优惠券对象
        if (window.location.host.indexOf("coll.jd") > -1) {
            let that = $('#plist ul li .j-sku-item[data-sku="' + data.skuId + '"]');
            let html =
                "<div class='jar-list-coupon'><p><a target='_blank'>满" +
                coupon.quota +
                "元减" +
                coupon.discount +
                "元</a></p></div>";
            that.append(html);
        } else {
            let that = $('#J_goodsList ul li[data-sku="' + data.skuId + '"]');
            let html =
                "<div class='jar-list-coupon'><p><a target='_blank'>满" +
                coupon.quota +
                "元减" +
                coupon.discount +
                "元</a></p></div>";
            that.append(html);
        }
    }
}
// 京东列表推荐
function jdListRec() {
    let params = {
        pageNo: 1,
        pageSize: 50,
        data: {
            hasCoupon: 1,
            cat3Id: LogParm.rel_cat3.split(",")[0],
        },
    };
    let dtd = $.Deferred();
    let wait = function (dtd) {
        $.ajax({
            url: "https://api.ergirl.com/jdSearch",
            type: "post",
            data: JSON.stringify(params),
            headers: {
                "Content-Type":
                    "application/json; charset=UTF-8",
            },
        })
            .done(function (res) {
                dtd.resolve(res);
            })
            .fail(function () {
                dtd.resolve({ error: true });
            });
        return dtd.promise();
    };
    $.when(wait(dtd)).done(function (res) {
        addJdListRec(res);
    });
}
// 增加京东列表推荐
function addJdListRec(data) {
    let html = "";
    let mainHtml = "";
    let startHtml =
        '<div class="goods-list-v2">' +
        '<ul class="gl-warp clearfix">' +
        '<div class="swiper-container">' +
        '<div class="swiper-wrapper">';
    let endHtml =
        '</div><div class="swiper-button-prev" style="width:45px;height:100px;color: #f40;margin-top:-50px;background:rgba(0,0,0,0.4)"></div><div class="swiper-button-next" style="width:45px;height:100px;color: #f40;margin-top:-50px;margin-right: 20px;background:rgba(0,0,0,0.4);"></div></div></ul>' +
        "</div>";
    let arr = data.data.unionGoods;
    arr.forEach((item) => {
        let html1 =
            '<div class="swiper-slide">' +
            '<li data-sku="' +
            item[0].skuId +
            '" class="gl-item" style="height: 380px;float:left;">' +
            '<div class="gl-i-wrap">' +
            '<div class="p-img">' +
            '<a rel=noreferrer target="_blank" href="//item.jd.com/' +
            item[0].skuId +
            '.html">' +
            '<img width="220" height="220" src=//img11.360buyimg.com/n7/' +
            item[0].materialUrl +
            ">" +
            "</a>" +
            "</div>" +
            '<div class="p-price">' +
            '<strong class="J_1026563726">' +
            "<em>￥</em><i>" +
            item[0].lowerPrice +
            "</i>" +
            "</strong>" +
            "</div>" +
            '<div class="p-name p-name-type-3" style="height: 22px;">' +
            '<a rel=noreferrer target="_blank" href="//item.jd.com/' +
            item[0].skuId +
            '.html">' +
            "<em>" +
            item[0].skuName +
            "</em>" +
            "</a>" +
            "</div>" +
            '<div class="p-shop">' +
            '<span class="J_im_icon"><a target="_blank" class="curr-shop hd-shopname" title="' +
            item[0].shopName +
            '">' +
            item[0].shopName +
            "</a></span>" +
            "</div>" +
            "</div>" +
            "<div class='jar-list-coupon' style='right:15px;bottom:0;'><p><a target='_blank'>满" +
            item[0].couponQuota +
            "元减" +
            item[0].couponDiscount +
            "元</a></p>" +
            "</li>" +
            "</div>";
        mainHtml += html1;
        jdListChangeUrl(item[0].skuId);
    });
    html = startHtml + mainHtml + endHtml;
    let that = $("#J_main .m-list #J_filter");
    that.before(html);
    var mySwiper = new Swiper(".swiper-container", {
        slidesPerView: 5,
        slidesPerGroup: 5,
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
    });
}
// 京东转链
function jdListChangeUrl(id, cUrl) {
    let mid = "https://item.jd.com/" + id + ".html";
    let promotionCodeReq = {
        materialId: mid,
        siteId: "4000380964",
    };
    if (cUrl) {
        promotionCodeReq.couponUrl = cUrl;
    }
    let params = {
        v: "1.0",
        method: "jd.union.open.promotion.common.get",
        app_key: "749ec5acf07b3bc2c623a465bc77c0e4",
        sign_method: "md5",
        format: "json",
        timestamp: dateFormat(),
        param_json: JSON.stringify({
            promotionCodeReq: promotionCodeReq,
        }),
    };
    let obj = objKeySort(params);
    let secretkey = "de15ce50b876430b941d3d9d5f307c2b";
    let str = "";
    for (i in obj) {
        if (
            params[i] !== "" &&
            params[i] !== null &&
            params[i] !== undefined
        ) {
            str += i + params[i];
        }
    }
    params.sign = md5(secretkey + str + secretkey).toUpperCase();
    let url = "https://api.ergirl.com/jdApi/api";
    dtd(url, params, jdRecUrl, id);
}
// 插入链接
function jdRecUrl(res, id) {
    let result = JSON.parse(res).jd_union_open_promotion_common_get_response
        .result;
    let obj = JSON.parse(result).data;
    $(".swiper-slide li[data-sku=" + id + "]")
        .find("a")
        .attr(
            "href",
            "http://quan.ergirl.com/jump.html?url=" +
            encodeURIComponent(obj.clickURL)
        );
}
