// ==UserScript==
// @name         DFavCouponFilter
// @namespace    sgthr7/monkey-script
// @version      0.0.2
// @author       SGThr7
// @description  DLsite内のお気に入り作品一覧で、クーポン対象の作品のみをフィルターする機能を追加します
// @license      MIT
// @match        https://www.dlsite.com/*
// @require      https://cdn.jsdelivr.net/npm/vue@3.5.13/dist/vue.global.prod.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/539770/DFavCouponFilter.user.js
// @updateURL https://update.greasyfork.org/scripts/539770/DFavCouponFilter.meta.js
// ==/UserScript==

(t=>{if(typeof GM_addStyle=="function"){GM_addStyle(t);return}const a=document.createElement("style");a.textContent=t,document.head.append(a)})(" .expand_button[data-v-950d95b9]{width:183px;font-size:12px;display:flex;justify-content:space-between;padding:3px 8px 6px}.expand_icon[data-v-950d95b9]{display:inline-block;width:12px;margin-top:1px;transition:transform .05s}.expand_button[aria-expanded=true] .expand_icon[data-v-950d95b9]{transform:rotate(180deg)}.expand_button[aria-expanded=true]~.content[data-v-950d95b9]{display:block}.expand_button[aria-expanded=false]~.content[data-v-950d95b9]{display:none}.content[data-v-950d95b9]{border:1px solid gray;border-radius:0 10px 10px;padding:5px 10px}.coupons[data-v-3eec1958]{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr))}.no-target-coupons[data-v-3eec1958]{margin-top:20px} ");

(function (vue) {
  'use strict';

  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  async function fetchCoupons() {
    const couponsUrl = "https://www.dlsite.com/books/mypage/coupon/list/ajax";
    const couponsRaw = await fetch(couponsUrl);
    if (!couponsRaw.ok) {
      throw new Error(`HTTP error: status=${couponsRaw.status}`);
    }
    const coupons = await couponsRaw.json();
    return coupons;
  }
  async function fetchProductInfo(productId) {
    const info = await fetchProductInfos([productId]);
    return info[productId];
  }
  async function fetchProductInfos(productIds) {
    const baseUrl = "https://www.dlsite.com/maniax/product/info/ajax";
    const productSearchParam = "product_id";
    const separator = ",";
    const requestIds = productIds.join(separator);
    const searchParams = new URLSearchParams({
      [productSearchParam]: requestIds
    });
    const url = new URL(`${baseUrl}?${searchParams}`);
    const infosRes = await fetch(url);
    if (!infosRes.ok) {
      throw new Error(`Failed to fetch product info: ${url}`);
    }
    const products = await infosRes.json();
    return products;
  }
  function parseProductId(content) {
    var _a, _b;
    const contentInfoDom = content.querySelector("dl.work_1col");
    const contentUrlRaw = (_a = contentInfoDom == null ? void 0 : contentInfoDom.querySelector("a")) == null ? void 0 : _a.getAttribute("href");
    if (contentUrlRaw == null) {
      console.error("Content URL not found", content);
      return null;
    }
    const contentUrl = new URL(contentUrlRaw);
    const productId = (_b = contentUrl.pathname.split("/").at(-1)) == null ? void 0 : _b.split(".").at(0);
    if (productId == null) {
      console.error(`Failed to parse product ID: ${contentUrlRaw}`);
      return null;
    }
    return productId;
  }
  function parseId(productDom) {
    var _a;
    const productLink = productDom.querySelector(".work_name > a");
    const urlRaw = productLink == null ? void 0 : productLink.getAttribute("href");
    if (urlRaw == null) {
      console.warn("Failed to find product link", productDom);
      return null;
    }
    const productUrl = new URL(urlRaw);
    const productId = (_a = productUrl.pathname.split("/").at(-1)) == null ? void 0 : _a.split(".").at(0);
    if (productId == null) {
      console.warn(`Failed to parse product ID: ${urlRaw}`);
      return null;
    }
    return productId;
  }
  function parseTitle(productDom) {
    const productLink = productDom.querySelector(".work_name > a");
    const title = (productLink == null ? void 0 : productLink.getAttribute("title")) ?? (productLink == null ? void 0 : productLink.textContent);
    if (title == null) {
      console.warn("Failed to find product link", productDom);
      return null;
    }
    return title;
  }
  class DProduct {
    // MARK: Constructor
    constructor(productId, dom) {
      __publicField(this, "id");
      // TODO: 自動ページ送り拡張などを使うとDOMが複数になることがあるため、複数DOMを操作できるようにしたい
      __publicField(this, "dom");
      __publicField(this, "info");
      __publicField(this, "promiseFetchInfo");
      this.id = productId;
      this.dom = dom;
      this.info = void 0;
    }
    /**
     * @returns DOMから取得した作品IDを持つDProduct。作品IDが取得できなかった場合はnullを返す。
     */
    static tryFromDom(dom) {
      const productId = parseId(dom);
      if (productId == null) {
        console.error("Failed to find product ID", dom);
        return null;
      }
      return new DProduct(productId, dom);
    }
    // MARK: 初期化
    /**
     * 非同期で作品情報を取得
     */
    async asyncFetchInfo() {
      if (this.promiseFetchInfo == null) {
        this.info = void 0;
        this.promiseFetchInfo = new Promise(async (resolve) => {
          const resInfo = await fetchProductInfo(this.id);
          this.info = resInfo;
          resolve();
        });
      }
      await this.promiseFetchInfo;
      return this.info;
    }
    // MARK: DOM操作
    isVisible() {
      return !this.dom.hidden;
    }
    setIsVisible(isVisible) {
      this.dom.hidden = !isVisible;
    }
    // MARK: Info (async)
    /**
     * @note `async`版は`asyncFetchInfo()`を使用する
     */
    getInfo() {
      return this.info;
    }
    setInfo(val) {
      this.info = val;
    }
    // 外部からPromiseを登録する
    registerFetchInfoPromise(promise) {
      this.promiseFetchInfo = promise;
    }
    // MARK: Accessor
    getId() {
      return this.id;
    }
    getTitle() {
      var _a;
      return ((_a = this.info) == null ? void 0 : _a.title_name) ?? parseTitle(this.dom) ?? "[No Title]";
    }
    async asyncGetMakerId() {
      await this.asyncFetchInfo();
      return this.getMakerIdCache();
    }
    getMakerIdCache() {
      var _a;
      console.assert(this.info != null, "Product info has not been fetched yet");
      return ((_a = this.info) == null ? void 0 : _a.maker_id) ?? "";
    }
    async asyncGetCustomGenres() {
      await this.asyncFetchInfo();
      return this.getCustomGenresCache();
    }
    getCustomGenresCache() {
      var _a;
      console.assert(this.info != null, "Product info has not been fetched yet");
      return ((_a = this.info) == null ? void 0 : _a.custom_genres) ?? [];
    }
    async getSiteId() {
      await this.asyncFetchInfo();
      return this.getSiteIdCache();
    }
    getSiteIdCache() {
      var _a;
      console.assert(this.info != null, "Product info has not been fetched yet");
      return (_a = this.info) == null ? void 0 : _a.site_id;
    }
    getDom() {
      return this.dom;
    }
  }
  function compareDiscountType(a, b) {
    switch (a) {
      case "rate": {
        switch (b) {
          case "rate": {
            return 0;
          }
          case "price": {
            return -1;
          }
        }
      }
      case "price": {
        switch (b) {
          case "rate": {
            return 1;
          }
          case "price": {
            return 0;
          }
        }
      }
    }
    console.trace(`Unexpected discount type (${a}, ${b})`);
    return 0;
  }
  class DCoupon {
    constructor(info) {
      __publicField(this, "info");
      this.info = info;
    }
    getId() {
      return this.info.coupon_id;
    }
    getName() {
      return this.info.coupon_name;
    }
    getDiscountRate() {
      return parseInt(this.info.discount);
    }
    getDiscountType() {
      return this.info.discount_type;
    }
    /**
     * @return クーポンの使用期限
     */
    getUseLimitDate() {
      const limitDateSec = this.info.limit_date;
      const limitDateMsec = limitDateSec * 1e3;
      const limitDate = new Date(limitDateMsec);
      return limitDate;
    }
    /**
     * @returns 有効なクーポンかどうか
     */
    isAvailable() {
      const hasPresented = true;
      const limitDate = this.getUseLimitDate();
      const currentDate = /* @__PURE__ */ new Date();
      const isInLimitDate = limitDate != null ? currentDate <= limitDate : false;
      return hasPresented && isInLimitDate;
    }
    /**
     * @param product 対象の作品
     * @returns クーポン対象の作品かどうか
     */
    async canDiscount(product) {
      var _a, _b, _c;
      switch (this.info.condition_type) {
        case "id_all": {
          return ((_a = this.info.conditions.product_all) == null ? void 0 : _a.some(
            (productId) => productId === product.getId()
          )) ?? false;
        }
        case "custom_genre": {
          const pGenres = await product.asyncGetCustomGenres();
          return ((_b = this.info.conditions.custom_genre) == null ? void 0 : _b.some(
            (cGenre) => pGenres.some((pGenre) => cGenre === pGenre)
          )) ?? false;
        }
        case "site_ids": {
          const pSiteId = await product.getSiteId();
          return ((_c = this.info.conditions.site_ids) == null ? void 0 : _c.includes(pSiteId)) ?? false;
        }
      }
      console.trace(`Unexpected condition type "${this.info.condition_type}"`);
      return false;
    }
    compare(other) {
      const cmpDiscountType = compareDiscountType(this.getDiscountType(), other.getDiscountType());
      if (cmpDiscountType !== 0) return cmpDiscountType;
      const cmpDiscount = other.getDiscountRate() - this.getDiscountRate();
      if (cmpDiscount !== 0) return cmpDiscount;
      const maxDate = /* @__PURE__ */ new Date(864e13);
      const cmpLimitDate = (this.getUseLimitDate() ?? maxDate).getTime() - (other.getUseLimitDate() ?? maxDate).getTime();
      return cmpLimitDate;
    }
  }
  class MultiFactorBooleans {
    constructor() {
      /**
       * ある要因に基づいたBooleanの値
       */
      __publicField(this, "factors");
      /**
       * Booleanをまとめた結果のキャッシュ
       */
      __publicField(this, "result");
      this.factors = /* @__PURE__ */ new Map();
      this.result = this.getInitialValue();
    }
    /**
     * Booleanをまとめる際の演算子
     * @param lhs 左辺
     * @param rhs 右辺
     * @returns まとめた演算結果
     */
    operate(lhs, rhs) {
      console.error("Not implemented `operate` method");
      return false;
    }
    getInitialValue() {
      console.error("Not implemented `initialValue` method");
      return false;
    }
    /**
     * 演算結果のキャッシュを再演算し、その結果を返す
     * 
     * @returns まとめた演算結果
     */
    recalculateResult() {
      this.result = this.factors.values().reduce((acc, val) => this.operate(acc, val), this.getInitialValue());
      return this.result;
    }
    /**
     * 指定した要因の値をセットする
     * @param factor 要因名
     * @param value 値
     * @returns まとめた演算結果
     */
    setValue(factor, value) {
      this.setValueImpl(factor, value);
      return this.recalculateResult();
    }
    setValueImpl(factor, value) {
      this.factors.set(factor, value);
    }
    /**
     * 指定した要因の値を取得する
     * @param factor 要因名
     * @returns 指定した要因の値。要因が設定されていない場合は`false`を返す
     */
    getValue(factor) {
      return this.factors.get(factor) ?? false;
    }
    /**
     * @returns まとめた演算結果
     */
    getResult() {
      return this.result;
    }
    /**
     * @param factor 要因名
     * @returns 要因が設定されているかどうか
     */
    hasFactor(factor) {
      return this.factors.has(factor);
    }
    /**
     * 指定したFactorを削除する
     * @param factor 要因名
     * @returns 削除したあとのまとめた演算結果
     */
    removeFactor(factor) {
      this.removeFactorImpl(factor);
      return this.recalculateResult();
    }
    removeFactorImpl(factor) {
      this.factors.delete(factor);
    }
    /**
     * @returns 任意の要因が設定されているかどうか
     */
    hasAnyFactor() {
      return this.factors.size > 0;
    }
    /**
     * すべての要因を削除する
     */
    clearFactors() {
      this.factors.clear();
      this.result = this.getInitialValue();
    }
  }
  class OrBooleans extends MultiFactorBooleans {
    operate(lhs, rhs) {
      return lhs || rhs;
    }
    getInitialValue() {
      return false;
    }
    recalculateResult() {
      this.result = this.factors.values().some((val) => val);
      return this.result;
    }
    setValue(factor, value) {
      if (this.hasFactor(factor) && !value) {
        return super.setValue(factor, value);
      } else {
        this.setValueImpl(factor, value);
        this.result = this.operate(this.result, value);
        return this.result;
      }
    }
    removeFactor(factor) {
      if (!this.getValue(factor)) {
        this.removeFactorImpl(factor);
        return this.result;
      } else {
        return super.removeFactor(factor);
      }
    }
  }
  function objEntryIter(obj) {
    return Iterator.from(Object.entries(obj));
  }
  function isValidEntryKey(entry) {
    return entry[0] != null;
  }
  const _DPCManager = class _DPCManager {
    constructor() {
      __publicField(this, "products");
      __publicField(this, "couponFilter");
      __publicField(this, "coupons");
      __publicField(this, "discountableCouponMap");
      __publicField(this, "filterCoupons");
      __publicField(this, "observerAddWishlistDom");
      __publicField(this, "promiseFetchCoupons");
      this.products = /* @__PURE__ */ new Map();
      this.couponFilter = /* @__PURE__ */ new Map();
      this.coupons = /* @__PURE__ */ new Set();
      this.discountableCouponMap = /* @__PURE__ */ new Map();
      this.filterCoupons = /* @__PURE__ */ new Set();
    }
    //MARK: 初期化
    init() {
      console.log("init");
      this.bindOnAddedWishlistDom();
      this.asyncFetchCoupons();
      this.collectAndRegisterProducts(document);
      this.asyncInitLink();
    }
    clear() {
      this.unbindOnAddedWishlistDom();
      Iterator.from(this.products.values()).forEach((product) => product.setIsVisible(true));
      this.products.clear();
      this.couponFilter.clear();
      this.coupons.clear();
    }
    // MARK: 作品管理
    /**
     * 作品を管理対象へ追加
     * @param product 追加する作品
     */
    registerProduct(product) {
      const productId = product.getId();
      const productExists = this.products.has(productId);
      console.assert(!productExists, `Exists product: ID=${productId}`);
      if (!productExists) {
        console.log(`Register product: "${product.getTitle()}"`, product, product.getDom());
        this.products.set(productId, product);
        this.couponFilter.set(productId, new OrBooleans());
      }
    }
    /**
     * 作品を管理対象へ追加
     * @param products 追加する作品のリスト
     */
    registerProducts(products) {
      const productIds = Iterator.from(products.values()).map((product) => product.getId()).toArray();
      const mapProducts = ([productIds2, info]) => [this.products.get(productIds2), info];
      const fetchPromise = fetchProductInfos(productIds).then((infos) => {
        objEntryIter(infos).map(mapProducts).filter(isValidEntryKey).forEach(([product, info]) => product.setInfo(info));
      });
      Iterator.from(products.values()).forEach((product) => {
        this.registerProduct(product);
        product.registerFetchInfoPromise(fetchPromise);
      });
    }
    async asyncInitLink() {
      const linkPromises = Iterator.from(this.products.values()).map(async (product) => {
        await this.asyncLinkToCouponsCache(product);
      });
      await Promise.allSettled(linkPromises);
    }
    /**
     * 作品と所持中のクーポンを対応付ける
     */
    async asyncLinkToCouponsCache(product) {
      await this.asyncWaitFetchCoupons();
      const asyncIter = Iterator.from(this.coupons.values()).map((coupon) => this.asyncLink(product, coupon));
      await Promise.allSettled(asyncIter);
    }
    /**
     * 作品とクーポンを対応付ける
     */
    async asyncLink(product, coupon) {
      const filterResult = this.getCouponFilterResult(product.getId());
      const canDiscount = await coupon.canDiscount(product);
      filterResult.setValue(coupon.getId(), canDiscount);
      if (canDiscount) {
        const targets = this.discountableCouponMap.get(coupon.getId());
        targets == null ? void 0 : targets.add(product.getId());
      }
    }
    // MARK: DOM追加の監視
    // 自動ページ送り拡張など用
    /**
     * 自動ページ送りなどで追加された作品を検知する
     */
    bindOnAddedWishlistDom() {
      const container = document.querySelector("div#wishlist");
      if (container == null) {
        console.error("Failed to find wishlist container");
        return;
      }
      this.observerAddWishlistDom = new MutationObserver((records, observer) => this.onAddWishlistDom(records, observer));
      this.observerAddWishlistDom.observe(container, {
        subtree: false,
        childList: true
      });
    }
    onAddWishlistDom(records, _observer) {
      console.groupCollapsed("On add wishlist dom");
      console.log(records);
      records.forEach((record) => {
        record.addedNodes.values().filter(_DPCManager.isWishlistContainer).forEach(async (dom) => {
          const addedProducts = this.collectAndRegisterProducts(dom);
          const asyncLinkIter = addedProducts.values().map((product) => this.asyncLinkToCouponsCache(product));
          const asyncLink = Promise.allSettled(asyncLinkIter);
          await asyncLink;
          this.updateProductsVisibility(addedProducts.values());
        });
      });
      console.groupEnd();
    }
    unbindOnAddedWishlistDom() {
      var _a;
      (_a = this.observerAddWishlistDom) == null ? void 0 : _a.disconnect();
    }
    static isWishlistContainer(node) {
      return node instanceof HTMLElement && node.id === _DPCManager.WISHLIST_CONTAINER_ID;
    }
    // MARK: DOM操作
    /**
     * 作品の一覧を取得して登録する
     * @returns 追加した作品一覧
     */
    collectAndRegisterProducts(container) {
      const addedProduct = [];
      console.groupCollapsed("Collect and register products");
      _DPCManager.collectProductDoms(container).map(([productId, dom]) => new DProduct(productId, dom)).forEach((product) => {
        this.registerProduct(product);
        addedProduct.push(product);
      });
      console.groupEnd();
      return addedProduct;
    }
    /**
     * 作品のDOMを取得
     * @param container 取得時のルートDOM
     * @returns 作品DOMのIterator
     */
    static collectProductDoms(container) {
      const products = container.querySelectorAll("form#edit_wishlist > div#wishlist_work > table.n_worklist > tbody > tr._favorite_item");
      const productDomsIter = products.values().map((content) => {
        const product_id = parseProductId(content);
        if (product_id == null) {
          console.error("Failed to find product ID", content);
          return null;
        }
        return [product_id, content];
      }).filter((val) => val != null);
      return productDomsIter;
    }
    /**
     * 現在管理対象の作品の可視性を更新する
     */
    updateAllProductsVisibility() {
      this.updateProductsVisibility(this.products.values());
    }
    /**
     * 指定した管理対象作品の可視性を更新する
     * @param products 対象の管理中作品
     */
    updateProductsVisibility(products) {
      const isNoFilter = this.filterCoupons.size === 0;
      const targetProductsIter = Iterator.from(this.filterCoupons.values()).map((couponId) => this.discountableCouponMap.get(couponId)).filter((targetProducts2) => targetProducts2 != null).flatMap((targetProducts2) => targetProducts2);
      const targetProducts = new Set(targetProductsIter);
      Iterator.from(products).forEach((product) => {
        const isVisible = isNoFilter || targetProducts.has(product.getId());
        product.setIsVisible(isVisible);
      });
    }
    // MARK: クーポン
    /**
     * クーポンの取得を非同期で開始する
     */
    async asyncFetchCoupons() {
      if (this.promiseFetchCoupons == null) {
        this.promiseFetchCoupons = fetchCoupons();
        const resCoupons = await this.promiseFetchCoupons;
        const couponIter = resCoupons.values().map((coupon) => new DCoupon(coupon)).filter((coupon) => coupon.isAvailable());
        this.coupons = new Set(couponIter);
        const discountableCouponsMapIter = Iterator.from(this.coupons.values()).map((coupon) => [coupon.getId(), /* @__PURE__ */ new Set()]);
        this.discountableCouponMap = new Map(discountableCouponsMapIter);
      } else {
        await this.promiseFetchCoupons;
      }
      return this.coupons;
    }
    /**
     * 既に開始しているクーポンの取得を`await`する用の関数
     */
    async asyncWaitFetchCoupons() {
      if (this.promiseFetchCoupons == null) {
        console.warn("No fetching promise");
        return;
      }
      await this.promiseFetchCoupons;
    }
    //MARK: アクセサー
    getCouponFilterResult(productId) {
      console.assert(this.couponFilter.has(productId), `Not registered product: ID=${productId}`);
      return this.couponFilter.get(productId);
    }
    /**
     * クーポンの一覧を取得する。
     * クーポンがまだ取得できていない可能性があるため、必要に応じて`await asyncWaitFetchCoupons()`で取得を待機する必要がある。
     */
    getCoupons() {
      return this.coupons;
    }
    /**
     * クーポン対象の作品一覧を取得する。
     * 情報がまだ未収集の場合はカラのコンテナーが返る。
     */
    getDiscountableCouponMap(couponId) {
      return this.discountableCouponMap.get(couponId) ?? /* @__PURE__ */ new Set();
    }
    addCouponFilter(couponId) {
      this.filterCoupons.add(couponId);
      this.updateAllProductsVisibility();
    }
    removeCouponFilter(couponId) {
      this.filterCoupons.delete(couponId);
      this.updateAllProductsVisibility();
    }
  };
  __publicField(_DPCManager, "WISHLIST_CONTAINER_ID", "edit_wishlist");
  let DPCManager = _DPCManager;
  const _sfc_main$3 = /* @__PURE__ */ vue.defineComponent({
    __name: "CouponCheckbox",
    props: {
      coupon: {},
      discountTargetCount: {}
    },
    emits: ["onChecked"],
    setup(__props, { emit: __emit }) {
      const name = vue.computed(() => __props.coupon.getName());
      const emit = __emit;
      function onChecked(e) {
        const isChecked = e.target.checked;
        emit("onChecked", isChecked, __props.coupon);
      }
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", null, [
          vue.createElementVNode("label", null, [
            vue.createElementVNode("input", {
              type: "checkbox",
              onChange: onChecked
            }, null, 32),
            vue.createElementVNode("span", null, vue.toDisplayString(name.value) + " (" + vue.toDisplayString(_ctx.discountTargetCount) + ") ", 1)
          ])
        ]);
      };
    }
  });
  const CollapseIconFile = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%20aria-hidden='true'%20role='img'%20class='collapse-icon'%20width='8'%20height='5'%20preserveAspectRatio='xMidYMid%20meet'%20viewBox='0%200%208%205'%3e%3cpath%20stroke='white'%20fill='transparent'%20stroke-linecap='square'%20d='M1%201L4%204L7%201'%3e%3c/path%3e%3c/svg%3e";
  const _hoisted_1$2 = ["aria-expanded", "aria-controls"];
  const _hoisted_2$1 = ["src"];
  const _hoisted_3$1 = ["id"];
  const _sfc_main$2 = /* @__PURE__ */ vue.defineComponent({
    __name: "CollapseMenu",
    setup(__props) {
      const contentId = vue.useId();
      const isExpanded = vue.ref(false);
      function onClickButton(_e) {
        isExpanded.value = !isExpanded.value;
      }
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", null, [
          vue.createElementVNode("button", {
            type: "button",
            class: "expand_button",
            "aria-expanded": isExpanded.value,
            "aria-controls": vue.unref(contentId),
            onClick: onClickButton
          }, [
            vue.renderSlot(_ctx.$slots, "title", {}, () => [
              _cache[0] || (_cache[0] = vue.createTextVNode(" 表示切り替え "))
            ], true),
            vue.createElementVNode("img", {
              src: vue.unref(CollapseIconFile),
              class: "expand_icon"
            }, null, 8, _hoisted_2$1)
          ], 8, _hoisted_1$2),
          vue.createElementVNode("div", {
            id: vue.unref(contentId),
            class: "content"
          }, [
            vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
          ], 8, _hoisted_3$1)
        ]);
      };
    }
  });
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const CollapseMenu = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-950d95b9"]]);
  const _hoisted_1$1 = { class: "wrapper" };
  const _hoisted_2 = { key: 0 };
  const _hoisted_3 = { class: "coupons" };
  const _hoisted_4 = { class: "coupons" };
  const _sfc_main$1 = /* @__PURE__ */ vue.defineComponent({
    __name: "AsyncCouponList",
    async setup(__props) {
      let __temp, __restore;
      const dpcManager = vue.reactive(new DPCManager());
      dpcManager.init();
      vue.onBeforeUnmount(() => {
        dpcManager.clear();
      });
      [__temp, __restore] = vue.withAsyncContext(() => dpcManager.asyncWaitFetchCoupons()), __temp = await __temp, __restore();
      const allCoupons = vue.computed(() => dpcManager.getCoupons());
      const discountCoupons = vue.computed(() => Iterator.from(allCoupons.value.values()).filter((coupon) => getDiscountableCount(coupon) > 0).toArray().sort((a, b) => a.compare(b)));
      const noDiscountCoupons = vue.computed(() => Iterator.from(allCoupons.value.values()).filter((coupon) => getDiscountableCount(coupon) === 0).toArray().sort((a, b) => a.compare(b)));
      function getDiscountableCount(coupon) {
        return dpcManager.getDiscountableCouponMap(coupon.getId()).size;
      }
      function onCouponChecked(isChecked, coupon) {
        if (isChecked) {
          dpcManager.addCouponFilter(coupon.getId());
        } else {
          dpcManager.removeCouponFilter(coupon.getId());
        }
      }
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$1, [
          allCoupons.value.size <= 0 ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_2, "所持クーポン無し")) : vue.createCommentVNode("", true),
          vue.createElementVNode("div", _hoisted_3, [
            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(discountCoupons.value, (coupon) => {
              return vue.openBlock(), vue.createBlock(_sfc_main$3, {
                key: coupon.getId(),
                coupon,
                discountTargetCount: getDiscountableCount(coupon),
                onOnChecked: onCouponChecked
              }, null, 8, ["coupon", "discountTargetCount"]);
            }), 128))
          ]),
          noDiscountCoupons.value.length > 0 ? (vue.openBlock(), vue.createBlock(CollapseMenu, {
            key: 1,
            class: "no-target-coupons"
          }, {
            title: vue.withCtx(() => _cache[0] || (_cache[0] = [
              vue.createTextVNode("割引対象無しクーポン一覧")
            ])),
            default: vue.withCtx(() => [
              vue.createElementVNode("div", _hoisted_4, [
                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(noDiscountCoupons.value, (coupon) => {
                  return vue.openBlock(), vue.createBlock(_sfc_main$3, {
                    key: coupon.getId(),
                    coupon,
                    discountTargetCount: getDiscountableCount(coupon),
                    onOnChecked: onCouponChecked
                  }, null, 8, ["coupon", "discountTargetCount"]);
                }), 128))
              ])
            ]),
            _: 1
          })) : vue.createCommentVNode("", true)
        ]);
      };
    }
  });
  const AsyncCouponList = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-3eec1958"]]);
  const _hoisted_1 = { class: "border_b" };
  const _sfc_main = /* @__PURE__ */ vue.defineComponent({
    __name: "CouponFilter",
    setup(__props) {
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [
          (vue.openBlock(), vue.createBlock(vue.Suspense, null, {
            default: vue.withCtx(() => [
              vue.createVNode(AsyncCouponList)
            ]),
            fallback: vue.withCtx(() => _cache[0] || (_cache[0] = [
              vue.createElementVNode("div", { class: "loading" }, "Loading...", -1)
            ])),
            _: 1
          }))
        ]);
      };
    }
  });
  main();
  function main() {
    const bookmarkUrlPattern = new RegExp("^https?://(www.)?dlsite.com/(\\w+)/mypage/wishlist/?.*", "i");
    const currentUrl = window.location.href;
    if (bookmarkUrlPattern.test(currentUrl)) {
      createFilterBox();
    }
  }
  function createFilterBox() {
    var _a;
    const filterBoxRoot = document.createElement("div");
    const filterBox = vue.createApp(_sfc_main);
    filterBox.mount(filterBoxRoot);
    const insertAnchor = document.querySelector("div#wishlist > form#showList");
    if (insertAnchor == null) return;
    (_a = insertAnchor.parentNode) == null ? void 0 : _a.insertBefore(filterBoxRoot, insertAnchor.nextElementSibling);
  }

})(Vue);