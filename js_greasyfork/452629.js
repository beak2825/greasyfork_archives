// ==UserScript==
// @name         alibaba crawling plugin
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Script for collecting product data from alibaba.
// @author       Felix
// @match        https://www.alibaba.com/*
// @exclude      https://www.alibaba.com/product-detail/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://cdnjs.cloudflare.com/ajax/libs/uuid/8.1.0/uuidv4.min.js
// @resource     https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/452629/alibaba%20crawling%20plugin.user.js
// @updateURL https://update.greasyfork.org/scripts/452629/alibaba%20crawling%20plugin.meta.js
// ==/UserScript==

(function () {
    "use strict";

    console.log("===> 浏览器爬虫脚本运行开始! <====");

    const DS = {
        env: "DS_env",
    };

    GM_setValue("DS_env", "development");

    let addStyle =
        GM_addStyle ||
        function _GM_addStyle(css) {
            const style =
                document.getElementById("GM_addStyleByDS") ||
                (function () {
                    const style = document.createElement("style");
                    style.type = "text/css";
                    style.id = "GM_addStyleByDS";
                    document.head.appendChild(style);
                    return style;
                })();
            const sheet = style.sheet;
            sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
        };
    let workerPool;

    const CLASSES = {
        crawlButton: "DS_crawlButton",
        menu: "DS_menu",
    };

    const CSS = `
        .${CLASSES.crawlButton} {
            outline: none;
            border: none;
            background: rgb(25, 118, 210);
            padding: 10px 8px;
            box-shadow: rgb(0 0 0 / 20%) 0px 3px 1px -2px, rgb(0 0 0 / 14%) 0px 2px 2px 0px, rgb(0 0 0 / 12%) 0px 1px 5px 0px;
            font-size: 14px;
            color: white;
            border-radius: 4px;
            position: absolute;
            bottom: calc(20px);
            left: 50%;
            transform: translateX(-50%);
        }
        .${CLASSES.crawlButton}.success {
            background: rgb(39 217 16);
            pointer-events: none;
        }
        .${CLASSES.crawlButton}.fail {
           background: orange;
           pointer-events: none;
        }
        .${CLASSES.crawlButton}.processing {
            pointer-events: none;
            background: rgb(128 146 157);
        }
        .hide {
            visibility: hidden;
            opacity: 0;
        }
    `;

    const SELECTORS = {
        productATag: "a.organic-gallery-offer__img-section",
        pDescriptionImages: [
            "[module-title=detailSingleImage] img",
            "[module-title=detailManyImage] img",
        ],
        // Left side thumb image
        pGalleryItemImages: ".main-item > img",
    };

    const BASE_INDEX = 9999;
    let iframeZindex = BASE_INDEX;

    const getDescriptionImageUrls = {
        aliexpress: (contentWindow) => {
            const descriptionImageUrls = SELECTORS.pDescriptionImages.reduce(
                (cur, selector) => {
                    const containerDiv = contentWindow.document.querySelector(
                        "#module_product_specification"
                    );
                    const imageUrls = [
                        ...containerDiv.querySelectorAll(selector),
                    ].map((el) => `${location.protocol}${el.dataset.src}`);
                    return [...cur, ...imageUrls];
                },
                []
            );
            // TODO
            if (descriptionImageUrls.length === 0) {
                if (GM_getValue(DS.env) === "production") {
                    throw Error(
                        "Abort crawling: Please check product detail description seciton!"
                    );
                } else {
                    window.alert(
                        "Please check product detail description seciton !"
                    );
                }
            }
            console.info(
                `all descriptionImageUrls: ${descriptionImageUrls.length}`,
                descriptionImageUrls
            );

            return descriptionImageUrls;
        },
    };

    const getDescription = {
        aliexpress: (descriptionImageUrls) => {
            if (!descriptionImageUrls) {
                throw Error("No descriptionImageUrl exists!!!!!!");
            }
            if (descriptionImageUrls.length === 0) {
                throw Error("DescriptionImageUrl not found !!!!!!");
            }
            return descriptionImageUrls
                .map((url) => {
                    return `<div class='description-img-container'><img class='description-img' src="${url}"></div>`;
                })
                .join("");
        },
    };

    const handleCreateCategory = async (pathList) => {
        let lastCatId;
        // filter [name='All Industries']
        const categoryPathList = pathList.slice(1).map((item) => {
            const { name } = item.hrefObject;
            const parentId = !!lastCatId ? lastCatId : null;
            const categoryId = UUID();

            const res = { name, categoryId, parentId };

            lastCatId = categoryId;
            return res;
        });
        console.log("categoryPathList: ", categoryPathList);

        return categoryPathList;
    };

    const genWorkerUrl = (text) => {
        const blob = new Blob([text]);
        const url = window.URL.createObjectURL(blob);
        return url;
    };

    const handleImageUrlsUpload2 = async (productId, mediaImgItems) => {
        let imageUrlMap = {};

        try {
            imageUrlMap = await workerPool.run({
                productId,
                mediaImgItems,
                gqlEndpoint: GM_getValue(
                    "gqlEndpoint",
                    "https://localhost:10086/graphql"
                ),
            });
        } catch (error) {
            console.error(error);
        }

        console.log("data from worker: ", imageUrlMap);

        const fileNameToImageItemMap = {};
        let id = 1;

        mediaImgItems.forEach(({ fileName }) => {
            fileNameToImageItemMap[fileName] = {
                id: id++,
                imageUrl: imageUrlMap[fileName],
            };
        });

        console.log(
            fileNameToImageItemMap,
            mediaImgItems,
            "fileNameToImageItemMap, mediaImgItems"
        );
        if (
            Object.keys(fileNameToImageItemMap).length !== mediaImgItems.length
        ) {
            throw Error("image upload result numbers does not match input !");
        }

        return fileNameToImageItemMap;
    };

    const handleSku = (
        rawSku,
        externalImgFilenameToImageItemMap,
        fixedPrice
    ) => {
        const replaceFileNameWithImageId = (fileName) => {
            if (!externalImgFilenameToImageItemMap[fileName]) return "";
            return externalImgFilenameToImageItemMap[fileName].id;
        };
        const skuAttrs = rawSku.skuAttrs.map((attr) => {
            return {
                id: attr.id,
                name: attr.name,
                values: attr.values.map(({ fileName, id, type, name }) => ({
                    imageId: replaceFileNameWithImageId(fileName),
                    id,
                    type,
                    name,
                })),
            };
        });

        const skuInfoMap = {};
        let variants = [];

        const assembleVariants = (array, key = "", ...objs) => {
            const currentAttr = array[0];
            const nextAttr = array[1];
            for (let val of currentAttr.values) {
                const skuInfoKey = `${key}${currentAttr.id}:${val.id};`;
                if (!nextAttr) {
                    const skuId = UUID();
                    skuInfoMap[skuInfoKey] = skuId;
                    // @ts-ignore
                    variants.push({
                        id: skuId,
                        price: fixedPrice,
                        values: [
                            ...(objs ? objs : []),
                            {
                                propName: currentAttr.name,
                                ...val,
                            },
                        ],
                    });
                } else {
                    assembleVariants(array.slice(1), skuInfoKey, ...objs, {
                        propName: currentAttr.name,
                        ...val,
                    });
                }
            }
        };

        assembleVariants(skuAttrs);

        const sku = {
            variants,
            skuInfoMap,
            skuAttrs,
        };

        console.log(`sku: `, sku);
        return sku;
    };

    const assembleSupplierProduct = async (detailData, contentWindow) => {
        const { globalData } = detailData;
        const { product, global, seo } = globalData;

        /**
         * @description product description section,
         * invoke first, ensure throwing error and abort this crawl.
         */
        const descriptionImageUrls =
            getDescriptionImageUrls["aliexpress"](contentWindow);
        const description = getDescription["aliexpress"](descriptionImageUrls);

        const supplierProductId = UUID();

        // catId catName
        const categoryPathList = seo.breadCrumb.pathList;
        const categoryReq = handleCreateCategory(categoryPathList);

        // currency
        const [countryCode, currencySymbol] =
            global.productPriceCurrencySimpleName.split(" ");

        // All image url with original size
        const mediaImgItemsMap = new Map();
        product.mediaItems.map((item) => {
            if (item.type !== "image") return null;
            let fileName;
            if (item.imageUrl.fileName) {
                fileName = item.imageUrl.fileName;
            }

            const cleanImageUrl = item.imageUrl.big.replace(
                /_\d+x\d+\.(png|jpg)/g,
                ""
            );
            fileName = extractFileNameFromUrl(cleanImageUrl);

            mediaImgItemsMap.set(cleanImageUrl, {
                imageUrl: cleanImageUrl,
                fileName,
            });
        });
        const mediaImgItems = [...mediaImgItemsMap.values()];
        console.log("mediaImgItems: ", mediaImgItems);

        // handle uploading all files, filename -> {imageUrl, id}
        const externalImgFilenameToImageItemMap = await handleImageUrlsUpload2(
            supplierProductId,
            mediaImgItems
        );

        console.log(
            "externalImgFilenameToImageItemMap: ",
            externalImgFilenameToImageItemMap
        );

        // left side gallery thumb images
        const galleryItemImgs = [
            ...contentWindow.document.querySelectorAll(".main-item > img"),
        ];
        const galleryImageUrls = galleryItemImgs
            .map((img) => img.src)
            .map(extractFileNameFromUrl)
            .map((fileName) => {
                // in case image is not in mediaItems, ignore it.
                if (!externalImgFilenameToImageItemMap[fileName]) {
                    console.error(
                        `Missing fileName:[${fileName}] in externalImgFilenameToImageItemMap !`
                    );
                    return null;
                }
                return {
                    imageUrl:
                        externalImgFilenameToImageItemMap[fileName].imageUrl,
                    id: externalImgFilenameToImageItemMap[fileName].id,
                };
            })
            .filter(Boolean);

        const firstLadderPrice = product.price.productLadderPrices[0].price;

        const sku = handleSku(
            product.sku,
            externalImgFilenameToImageItemMap,
            firstLadderPrice
        );

        const images = Object.values(externalImgFilenameToImageItemMap);
        const categoryRes = await categoryReq;

        const result = {
            supplierProductId,
            title: product.subject,
            externalProductId: product.productId,
            externalPlatform: "aliexpress",
            externalProductUrl: contentWindow.location.href.replace(
                /(\?.*)/,
                ""
            ),
            price: {
                unit: product.price.unit,
                unitPlural: product.price.unitEven,
                productLadderPrices: product.price.productLadderPrices.map(
                    ({ max, min, price }) => ({
                        max,
                        min,
                        price,
                    })
                ),
            },
            currency: {
                currencySymbol,
                countryCode,
            },
            images,
            galleryImages: galleryImageUrls,
            description,
            categoryId: categoryRes[categoryRes.length - 1].categoryId,
            sku,
            productBasicProperties: product.productBasicProperties.map(
                ({ attrName, attrValue }) => ({
                    name: attrName,
                    value: attrValue,
                })
            ),
        };

        console.info("supplier product data: ", result);
    };

    // handle inside iframe
    const processCrawling = async (contentWindow) => {
        if (!contentWindow.detailData) {
            console.error("Page source data not found !!!!!!!!!!!");
        }
        await assembleSupplierProduct(contentWindow.detailData, contentWindow);
    };

    let taskQ = [];
    let currentRunningTasks = 0;

    const startCrawling = async (src, productId, clickListenerCb) => {
        const iframe = document.createElement("iframe");

        const randomColor = Math.floor(Math.random() * 16777215).toString(16);

        iframe.style.cssText = `
            position: fixed;
            bottom: calc(20px + ${(iframeZindex - BASE_INDEX) * 10}px);
            z-index: ${iframeZindex++};
            height: 10vh;
            width: 80vw;
            left: 50%;
            transform: translateX(-50%);
            border: 2px solid #${randomColor};
        `;

        const iframeId = `DS_iframe_${productId}`;
        iframe.id = iframeId;

        const url = new URL(src);
        url.search = `crawlingDetailPage&productId=${productId}`;
        iframe.src = url.toString();

        const crawlButton = document.querySelector(
            `.${CLASSES.crawlButton}[data-pid="${productId}"]`
        );

        const onCrawlComplete = async () => {
            if (crawlButton) {
                crawlButton.innerHTML = "Success";
                crawlButton.classList.add("success");
                crawlButton.removeEventListener("click", clickListenerCb);
            }
        };

        const onError = () => {
            if (crawlButton) {
                crawlButton.innerHTML = "Fail to process";
                crawlButton.classList.add("fail");
                crawlButton.removeEventListener("click", clickListenerCb);
            }
        };

        const task = () => {
            iframe.onload = (e) => {
                console.log(`iframe with id:[${iframeId}] loaded.`);

                (async () => {
                    try {
                        await processCrawling(iframe.contentWindow);
                        await onCrawlComplete();
                        console.log("DS crawling complete !");
                    } catch (error) {
                        onError();
                        console.error("DS crawling error !", error);
                    } finally {
                        iframe.remove();
                        crawlButton?.classList.remove("processing");

                        currentRunningTasks--;
                        let nextTask;
                        if ((nextTask = taskQ.shift())) {
                            nextTask();
                        }
                    }
                })();
            };

            document.body.appendChild(iframe);
        };

        if (currentRunningTasks <= 5) {
            currentRunningTasks++;
            task();
        } else {
            taskQ.push(task);
        }
    };

    function initWorkerPool() {
        const url = genWorkerUrl(workerScript);
        return new WorkerPool(url, 6);
    }

    const getBtnMarkup = () => {
        const button = document.createElement("button");
        button.classList.add(CLASSES.crawlButton);
        button.innerHTML = "DS_Crawl";

        return button;
    };

    const addCrawlBtnToProduct = () => {
        // current only for aliexpress
        if (true) {
            const allProductLinkElements = Array.from(
                document.querySelectorAll(SELECTORS.productATag)
            );

            allProductLinkElements.forEach((linkEl) => {
                const container = linkEl.parentElement;
                container.style.overflow = "visible";
                container.style.paddingBottom = "80px";

                const productId = container.dataset.pid;

                const btn = getBtnMarkup();
                btn.dataset.pid = productId;
                const clickListenerCb = () => {
                    btn.innerHTML = "processing...";
                    btn.classList.add("processing");
                    btn.removeEventListener("click", clickListenerCb);
                    console.log(
                        `Start crawling\n product id: ${productId}\n href:\n ${linkEl.href}`
                    );
                    startCrawling(linkEl.href, productId, clickListenerCb);
                };
                btn.addEventListener("click", clickListenerCb);
                container.appendChild(btn);
            });
        }
    };

    /**
     * @description utils
     */
    const extractFileNameFromUrl = (url) => {
        const result = /([\w-]+).(jpg|png)/g.exec(url);
        if (!result) {
            throw Error(
                `Fail to extract filename from image url !\n url: ${url}`
            );
        }
        const fileName = result[0];
        return fileName;
    };

    const UUID = () => {
        if (!uuidv4) {
            throw Error("uuidv4 not loaded!!!!");
        }
        return uuidv4().replace(/-/g, "");
    };

    // ===> Start Worker

    const gql = `
        mutation GetSupplierProductImagesSignedUrl($input: SupplierProductImagesSignedUrlInput!) {
            getSupplierProductImagesSignedUrl(input: $input) {
                imageKeySignedUrlMap
                expireTime
            }
        }
    `;

    const workerScript =
        `
    self.onmessage = async (e) => {
        (async () => {
            console.log("data received from main thread: ", e.data);
            const { productId, mediaImgItems, gqlEndPoint: _gqlEndPoint } = e.data;
            const gqlEndPoint = _gqlEndPoint || "http://localhost:10086/graphql";

            const concurrentFetch = async (tasks, maxConcurrency = 5) => {
                let total = tasks.length;
                let index = 0;
                let abort = false;
                const result = [];

                let _resolve;
                let _reject;
                const promise = new Promise((resolve, reject) => {
                    _resolve = resolve;
                    _reject = reject;
                });

                const request = async () => {
                    if (!tasks) {
                        throw Error("Empty tasks not accpected!");
                    }
                    if (index >= total) {
                        return;
                    }
                    const _index = index;
                    const task = tasks[index++];

                    Promise.resolve(typeof task === "function" ? task() : task)
                        .then((res) => {
                            result[_index] = res;

                            if (!abort) {
                                request();
                            }
                            if (result.length >= total) {
                                _resolve(result);
                            }
                        })
                        .catch((err) => {
                            _reject(err);
                            abort = true;
                        });
                };

                for (let i = 0; i < maxConcurrency; i++) {
                    request();
                }

                return promise;
            };

            const getSupplierProductImagesSignedUrl = async () => {
                const response = await fetch(gqlEndPoint, {
                    method: "POST",
                    body: JSON.stringify({
                        query: ` +
        "`" +
        gql +
        "`" +
        `,
                        variables: {
                            input: {
                                productId,
                                imageKeys: mediaImgItems.map(
                                    (item) => item.fileName
                                ),
                            },
                        },
                    }),
                    mode: "cors",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                const data = await response.json();

                console.log(
                    "Graphql: getSupplierProductImagesSignedUrl",
                    data.data.getSupplierProductImagesSignedUrl
                );

                return data.data.getSupplierProductImagesSignedUrl
                    .imageKeySignedUrlMap;
            };

            const imageKeySignedUrlMap = await getSupplierProductImagesSignedUrl();

            const upload = async () => {
                return concurrentFetch(
                    mediaImgItems.map(async ({ imageUrl, fileName }) => {
                        const response = await fetch(imageUrl, {
                            mode: "cors",
                        });
                        const blob = await response.blob();

                        if (blob.size > 1024 * 1024 * 4) {
                            return false;
                        }

                        return fetch(imageKeySignedUrlMap[fileName], {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/octet-stream",
                            },
                            body: blob,
                            mode: "cors",
                        }).then((res) => {
                            console.log("upload success !!!");
                        });
                    }),
                    3
                );
            };

            await upload();
            self.postMessage(imageKeySignedUrlMap);
        })();
    };

    `;
    class WorkerPool {
        _queue = [];
        _workingPool = [];
        _idlePool = [];
        constructor(url, max = 5) {
            this.url = url;
            this.max = max;
        }

        async run(...args) {
            const worker = await this.getAvailableWorker();
            return new Promise((resolve, reject) => {
                worker._currentResolve = resolve;
                worker._currentReject = reject;
                worker.postMessage(...args);
            });
        }

        assignDoneWorker(worker) {
            if (this._queue.length > 0) {
                const [resolve] = this._queue.shift();
                resolve(worker);
                return;
            }
            this._idlePool.push(worker);
        }

        async getAvailableWorker() {
            if (this._idlePool.length) {
                return this._idlePool.shift();
            }

            // can spawn more ?
            if (this._workingPool.length < this.max) {
                const worker = new Worker(this.url);

                worker.onmessage = (e) => {
                    worker._currentResolve && worker._currentResolve(e.data);
                    worker._currentResolve = null;

                    this.assignDoneWorker(worker);
                };

                worker.onerror = (e) => {
                    worker._currentReject && worker._currentReject(e);
                    worker._currentReject = null;
                    // worker.terminate();
                };

                this._workingPool.push(worker);
                return worker;
            }

            let resolve;
            let reject;
            const promise = new Promise((_resolve, _reject) => {
                resolve = _resolve;
                reject = _reject;
            });

            this._queue.push([resolve, reject]);

            return promise;
        }
    }
    // End Worker <===

    class Menu {
        constructor() {
            this.menu = this.menu();
            this.sideBar = this.sideBar();
            document.body.appendChild(this.menu);
            document.body.appendChild(this.sideBar);
            document.addEventListener("click", (e) => {
                if (
                    document
                        .querySelector(`.${CLASSES.menu}`)
                        .contains(e.target)
                ) {
                    e.stopPropagation();
                } else {
                    this.menu.classList.add("hide");
                }
                console.log("document");
            });
        }

        menu() {
            const container = document.createElement("div");
            container.classList.add(CLASSES.menu, "hide");
            container.style.cssText = `
                min-width: 500px;
                min-height: 200px;
                position: fixed;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                z-index: 1000001;
                background-color: white;
                box-shadow: 0 0 20px 10px #0000004d;
            `;
            // gql endpoint
            const gqlCheckBoxGroup = document.createElement("div");
            gqlCheckBoxGroup.classList.add("gqlEndpoint");
            gqlCheckBoxGroup.style.padding = "15px 10px";
            gqlCheckBoxGroup.innerHTML = `
              <p><strong>Choose endpoint</strong></p>
               <div class="form-check"> <input type="radio" id="gqlEndpointC1"
               name="gqlEndpoint" class="form-check-input" value="http://localhost:10086/graphql" checked>
               <label for="gqlEndpointC1">http//localhost:10086/graphql</label></div>

               <div class="form-check"> <input type="radio" id="gqlEndpointC2"
                name="gqlEndpoint" class="form-check-label" value="ds-dropshipping">
                <label for="gqlEndpointC2">ds-dropshipping</label></div>
            `;

            // env
            const envCheckBoxGroup = document.createElement("div");
            envCheckBoxGroup.classList.add("DS_env");
            envCheckBoxGroup.style.padding = "15px 10px";

            envCheckBoxGroup.innerHTML = `
            <p><strong>Choose env</strong></p>
            <div class="form-check"><input type="radio" id="DS_envC1"
            name="DS_env" class="form-check-input" value="development" checked>
            <label for="DS_envC1">development</label></div>

            <div class="form-check"> <input type="radio" id="DS_envC2"
             name="DS_env" class="form-check-label" value="production">
             <label for="DS_envC2">production</label></div>
         `;

            container.innerHTML = `<div>
            </div>`;

            container.appendChild(gqlCheckBoxGroup);
            container.appendChild(envCheckBoxGroup);

            envCheckBoxGroup.addEventListener("click", (e) => {
                if (e.target.name === "gqlEndpoint") {
                    console.log(e.target.name, "gqlEndpoint");
                    GM_setValue("gqlEndpoint", e.target.value);
                }
            });

            return container;
        }

        sideBar() {
            const container = document.createElement("button");
            container.classList.add("DS_sideBar");
            container.style.cssText = `
                position: fixed;
                border: none;
                outline: none;
                right: 20px;
                top: 50%;
                transform: translateY(-50%);
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background-color: black;
                color: white;
                font-size: 16px;
                z-index: 100000;
                cursor: pointer;
                line-height: 50px;
                text-align: center;
            `;
            container.innerHTML = "DS";
            container.addEventListener("click", (e) => {
                e.stopPropagation();

                this.menu.classList.toggle("hide");
                console.log("sidebar");
            });
            return container;
        }
    }

    function main() {
        addStyle(CSS);
        addCrawlBtnToProduct();
        workerPool = initWorkerPool();
        new Menu();
    }

    main();

    // GM_registerMenuCommand("运行爬虫脚本", main);
})();
