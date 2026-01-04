// ==UserScript==
// @name         房企工具测试工具chenxiao
// @namespace    https://yun.kujiale.com/
// @version      0.2
// @author       chenxiao
// @match        *.qunhequnhe.com/schemes/design*
// @match        *.kujiale.com/schemes/design*
// @run-at       document-start
// @grant        none
// @description 房企工具线测试工具
// @downloadURL https://update.greasyfork.org/scripts/427095/%E6%88%BF%E4%BC%81%E5%B7%A5%E5%85%B7%E6%B5%8B%E8%AF%95%E5%B7%A5%E5%85%B7chenxiao.user.js
// @updateURL https://update.greasyfork.org/scripts/427095/%E6%88%BF%E4%BC%81%E5%B7%A5%E5%85%B7%E6%B5%8B%E8%AF%95%E5%B7%A5%E5%85%B7chenxiao.meta.js
// ==/UserScript==
// 0.1 第一个版本
// https://greasyfork.org/zh-CN/scripts/427095-%E6%88%BF%E4%BC%81%E5%B7%A5%E5%85%B7%E6%B5%8B%E8%AF%95%E5%B7%A5%E5%85%B720421-chenxiao



(function() {
    'use strict';
      // 开启 MDMode，这样在 window 上 postMessage 才有用
      window.__enableKuaidaMDMode = true;
    console.log('11111111');

    const query = new URLSearchParams(window.location.search);
    const configId = query.get('configId');
    if (!configId) {
        return;
    }


    // 请求相关

    const buildParams = (params) => {
        const ary = [];
        Object.keys(params).forEach(key => {
              //push() 方法可向数组的末尾添加一个或多个元素，并返回新的长度。
            ary.push(encodeURIComponent(key) + '=' + encodeURIComponent(params[key]));
        });

// join() 方法用于把数组中的所有元素放入一个字符串。
        return ary.join('&');
    };


    const instance = (options) => {
        return new Promise((resolve, reject) => {
            const {
                url,
                method = 'get',
                params,
                data
            } = options;

            let request = new XMLHttpRequest();
            const queries = params && buildParams(params);
            request.open(method.toUpperCase(), url + (queries ? `?${queries}` : ''), true);
            request.onreadystatechange = () => {
                if (!request || request.readyState !== 4) {
                    return;
                }

                const status = request.status;
                if (status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
                    return;
                }
                if (status >= 200 && status < 300) {
                    const responseData = JSON.parse(request.responseText);
                    resolve(responseData);
                    return;
                }
                reject(new Error('Network Error'));
                request = null;
            };

            request.onerror = () => {
                reject(new Error('Network Error'));
                request = null;
            };


            if (data) {
                request.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
            }
            request.send(data ? JSON.stringify(data) : null);
        });

    };

    instance.get = (url, params) => {
        return instance({ url, params });
    };

    instance.post = (url, data, params) => {
        return instance({ method: 'post', url, params, data });
    };

    const interceptor = (res) => {
        if (res.c !== '0') {
            throw new Error(res.m || '请求失败');
        }
        return res.d;
    };

// 获取项目配置？？

    const getProjectConfig = async (id) => {
        const res = await instance.get(`/dmp/api/project/config/detail?projectConfigId=${id}`);
        return interceptor(res);
    };

// 获取装标配置模板？？

    const getDecorationStandardTemplate = async () => {
        const res = await instance.get('/dmp/api/standard/item');
        return interceptor(res);
    };

    const getEnum = async (type) => {
        const res = await instance.get('/dmp/api/enum/query', { type });;
        return interceptor(res);
    };

// 部品详情？
    const getComponentsDetail = async (ids) => {
        if (!ids.length) {
            return [];
        }

        const res = await instance.post('/dmp/api/component/query/ids', ids);
        return interceptor(res);
    };



    const space={
      4:"主卧",
      7:"厨房",
      8:"卫生间",
      10:"次卧",
      13:"阳台",
      22:"客餐厅",
    }



      const types = {
      0:"墙面",
      1:"地面",
      2:"顶棚",
      3:"踢脚线",
      4:"户内门槛",
      5:"柜体非见光区",
      6:"淋浴房站立区",
      7:"淋浴房排水区"
  }

       //获取商品传给快搭的结构
    const getComponentForKD=(id)=>{
        if (!id.length){
            return [];
        }

        const KD=window.g_projectConfig;
        const map = new Map();

        // 暂时注释调，这个是用来循环ids的    ids.forEach(id=>{
        // find软装list
        // 为了测试新增，待会需要删除
        //var id ="3FO4MK78U29I";
        var resultKd="传给快搭数据：";
        for (var kj in space){
            for (var KD_leng=0;KD_leng<KD[kj].length;KD_leng++){
            //获取某个空间下软装的数据长度
            //JSON.stringify(window.g_projectConfig)[kj];
            var furnLength=(KD[kj][KD_leng].furnitureIds).length; //.furnitureIds
            var pipeLength=(KD[kj][KD_leng].pipeFurnitureIds).length;
            var parCeiLength=(KD[kj][KD_leng].paramCeilingIds).length;
            var CustDataLength=(KD[kj][KD_leng].completeCustomData.models).length;
            // 遍历软装list  代码测试通过
            for(var i=0;i<furnLength;i++){
            if (KD[kj][KD_leng].furnitureIds[i].obsBrandGoodId==id){
                // 这个描述后续需要优化
                resultKd=resultKd+space[kj]+"-软装；";
                //map.set(id,"快搭数据："+space.get(kj)+"软装");
               // map.set(id,"KD["+kj+"]["+KD_leng+"]+.furnitureIds");
            }
                   }
            //遍历水电list  代码测试通过
            for (var a=0;a<pipeLength;a++){
                 if (KD[kj][KD_leng].pipeFurnitureIds[a]==id){
                     resultKd=resultKd+space[kj]+"-水电；";
                    //map.set(id,"KD[kj][KD_leng].pipeFurnitureIds");
        }
                }

            // 遍历参数化吊顶  代码测试通过
            for (var b=0;b<parCeiLength;b++){
                    if (KD[kj][KD_leng].paramCeilingIds[b]==id){
                    resultKd=resultKd+space[kj]+"-参数化吊顶；";
                }
                }

            //遍历定制List  代码测试通过
            for (var j=0;j<CustDataLength;j++){
                    if (id==KD[kj][KD_leng].completeCustomData.models[j].obsBrandGoodId){
                          resultKd=resultKd+space[kj]+"-定制；";
                    }

                }


            // 遍历硬装相关数据  测试通过
           for (var deco in types){
               // 需要将硬装的数据取出来？？？？
                var decoTypeKd=KD[kj][KD_leng].completeDecorationDataId.faceTypeToDataId;
                var keys = Object.keys(decoTypeKd);
                if(keys.indexOf(deco)!=-1){
                     var decoLength=(KD[kj][KD_leng].completeDecorationDataId.faceTypeToDataId[deco].obsPavingData).length;
                for (var c=0;c<decoLength;c++){
                if (id==KD[kj][KD_leng].completeDecorationDataId.faceTypeToDataId[deco].obsPavingData[c].obsBrandGoodId){
                    resultKd=resultKd+space[kj]+types[deco]+"-硬装数据；";
                }
                }
           }
            }

        }

    }

    // 勿动 for 循环ids的 到时候需要去掉注释})
        return resultKd;
                    }

    // 替换传给快搭的模型数据，全量替换

    function replaceComponentForKD2(id,newId) {
        console.log(id)
        console.log(newId)
      const spaceTh = [4,7,8,10,13,22]
      const typesTh = [0,1,2,3,4,5,6,7]
      const array = [];
      const KDTh=window.g_projectConfig;
      console.log( JSON.stringify(window.g_projectConfig))
        for (var kjth of spaceTh){
         for (var KD_lengTh=0; KD_lengTh<KDTh[kjth].length;KD_lengTh++){
             var furnLength=(KDTh[kjth][KD_lengTh].furnitureIds).length;
             var pipeLength=(KDTh[kjth][KD_lengTh].pipeFurnitureIds).length;
             var parCeiLength=(KDTh[kjth][KD_lengTh].paramCeilingIds).length;
             var CustDataLength=(KDTh[kjth][KD_lengTh].completeCustomData.models).length;
              // 遍历软装list
            for(var i=0;i<furnLength;i++){
            if (KDTh[kjth][KD_lengTh].furnitureIds[i].obsBrandGoodId==id){
                console.log(KDTh[kjth][KD_lengTh].furnitureIds[i].obsBrandGoodId);
                KDTh[kjth][KD_lengTh].furnitureIds[i].obsBrandGoodId=newId
                console.log(KDTh[kjth][KD_lengTh].furnitureIds[i].obsBrandGoodId)
                console.log (JSON.stringify(KDTh));
            }
               }
             //遍历水电list
            for (var a=0;a<pipeLength;a++){
                 if (KDTh[kjth][KD_lengTh].pipeFurnitureIds[a]==id){
                console.log(KDTh[kjth][KD_lengTh].pipeFurnitureIds[a]);
                     KDTh[kjth][KD_lengTh].pipeFurnitureIds[a]=newId
                      console.log( KDTh[kjth][KD_lengTh].pipeFurnitureIds[a])
        }
         }

                 // 遍历参数化吊顶
            for (var b=0;b<parCeiLength;b++){
                    if (KDTh[kjth][KD_lengTh].paramCeilingIds[b]==id){
                         console.log(KDTh[kjth][KD_lengTh].paramCeilingIds[b]);
                        KDTh[kjth][KD_lengTh].paramCeilingIds[b]=newId
                        console.log( KDTh[kjth][KD_lengTh].paramCeilingIds[b])

                }
                }
              //遍历定制List
            for (var j=0;j<CustDataLength;j++){
                    if (id==KDTh[kjth][KD_lengTh].completeCustomData.models[j].obsBrandGoodId){
                      console.log(KDTh[kjth][KD_lengTh].completeCustomData.models[j].obsBrandGoodId);
                       KDTh[kjth][KD_lengTh].completeCustomData.models[j].obsBrandGoodId=newId
                          console.log(KDTh[kjth][KD_lengTh].completeCustomData.models[j].obsBrandGoodId)
                    }
                }
             // 遍历硬装相关数据
           for (var deco in typesTh){
                var decoTypeKd=KDTh[kjth][KD_lengTh].completeDecorationDataId.faceTypeToDataId;
                var keys = Object.keys(decoTypeKd);
                if(keys.indexOf(deco)!=-1){
                     var decoLength=(KDTh[kjth][KD_lengTh].completeDecorationDataId.faceTypeToDataId[deco].obsPavingData).length;
                for (var c=0;c<decoLength;c++){
                if (id==KDTh[kjth][KD_lengTh].completeDecorationDataId.faceTypeToDataId[deco].obsPavingData[c].obsBrandGoodId){
                    console.log(KDTh[kjth][KD_lengTh].completeDecorationDataId.faceTypeToDataId[deco].obsPavingData[c].obsBrandGoodId);
                    KDTh[kjth][KD_lengTh].completeDecorationDataId.faceTypeToDataId[deco].obsPavingData[c].obsBrandGoodId=newId
                    console.log(KDTh[kjth][KD_lengTh].completeDecorationDataId.faceTypeToDataId[deco].obsPavingData[c].obsBrandGoodId)
                }
                }
           }
            }

        }
    }
        console.log( JSON.stringify(window.g_projectConfig))
        // 传给快搭的数据
    document.getElementsByTagName('iframe')[0].contentWindow.postMessage(
        JSON.stringify({
            action: 'startLayoutFurniture',
            payload: {
                'designMaterialComplex': {
                    'materialMultiMap': KDTh,
                    'socketsOfLivingRoom': []
                }
            },
        }),
         '*'
    );

    }


    const getAppUid = async () => {
        const res = await instance.get('/dmp/api/user/appuid/get');
        return interceptor(res);

    };

// 获取模型详细信息

    const _getModelsDetail = async (ids) => {
        if (!ids.length) {
            return [];
        }
        const appuid = await getAppUid();
        const res = await instance.post('/fe/api/open/v2/bgs/brandgood/details/available', ids, { appuid });
        return interceptor(res);
    };

    const getModelsDetail = async (ids) => {
        const limit = 200;
        const modelIds = [];
         // slice()返回一个子片段，对原先的string没有影响
        const copied = ids.slice();
        while (copied.length > limit) {
            modelIds.push(copied.splice(0, limit));
        }

        if (copied.length) {
            modelIds.push(copied);
        }
        const ary = await Promise.all(modelIds.map((ids) => _getModelsDetail(ids)));
        const result = [];
        ary.forEach(item => {

            result.push(...item);

        });
        return result;
    };



    // utils
    const genEnumMap = (enums) => {
        const map = new Map();
    enums.forEach(item => {
            map.set(item.k, item.v);
        });
        return map;
    };

    const traverse = (itemList, cb) => {
        itemList.forEach(item => {
            cb(item);
            if (item.children && item.children.length) {
                traverse(item.children, cb);
            }

        });

    };

// 获取对应模板的各个级结构， 标准，空间，配置项，部品
    const findTemplateByItemId = (template, itemId) => {
        let t = template;
        while (t.id !== itemId) {
            t = t.child;
        }
        return t;
    };



//配置单详情，包含了空间以及对应的标准和 配置项   template ：相当于是一个配置单的模板，空间标准配的结构

    // 整个方法主要是用来获取配置单中部品级别的部品id
    const getAllComponentIds = (itemList, template) => {
        const ids = [];
        traverse(itemList, item => {
             // 获取空间配置id=1
            const t = findTemplateByItemId(template, item.itemId);
             // valueType === 3 才是具体的部品
            const isComponent = t.valueType === 3;
            if (!isComponent) {
                return;
            }
            const isCombination = !!item.combinationList && !!item.combinationList.length;
            if (isCombination) {
                item.combinationList.forEach(component => {
                    ids.push(`${component.componentId}`);
                });
            } else {
                ids.push(item.itemValue);
            }
        });
        return [...new Set(ids)];
    };

// 获取模型id

    const getAllModelIds = (components) => {
        const ids = [];
        components.forEach(component => {
            if (component.modelId) {
                ids.push(component.modelId);
            }

        });
        return [...new Set(ids)];
    };

    // component.id -> component
    const genComponentMap = (components) => {
        console.log('fda');
        const map = new Map();
        components.forEach(component => {
            if (component.modelId) {
                map.set(`${component.id}`, component);
            }
        });
        return map;
    };


    // model.basicInfo.obsBrandGoodId -> model   // model.basicInfo.obsBrandGoodId -> model  获取商品的id，以及详细的材质等信息
    const genModelMap = (models) => {
        const map = new Map();
        models.forEach(model => {
            map.set(model.basicInfo.obsBrandGoodId, model);
        });
        return map;
    };



    const getComponentDisplayInfo =(options) => {
        const {
            modelMap,
            componentId,
            componentMap
        } = options;
        const component = componentMap.get(componentId);
         // 根据模型id获取模型信息
        const model = modelMap.get(component.modelId);
        //获取模型code 0512
        const componentcode=model.basicInfo.obsBrandGoodId;
        //调新增接口获取对应code传给快搭的结构 0512

      //  try {
             const kddata= getComponentForKD(componentcode);
        // 获取部品及对应模型的相关字段信息值
        var result=`${component.name}`
        var fenlei='真分类id:' + model.basicInfo.prodCatId+'&emsp; itemtype：'+model.basicInfo.itemType+'&emsp; 商品id:'+model.basicInfo.obsBrandGoodId
        var excep=new Array()
        excep[0]=result;
        excep[1]=fenlei;
        excep[2]=kddata;
        excep[3]=model.basicInfo.obsBrandGoodId;
        return excep;

       // } catch(err) {

       //     console.log(err)

     //   }

    //  return null

    };
// 获取组合部品相关信息
    const getCombinationDisplayInfo = (options) => {
        const {
            modelMap,
            componentMap,
            combinationList
        } = options;
        const hasCombination = !!(combinationList && combinationList.length);
        if (hasCombination) {
            const infos = [];
            combinationList.forEach(component => {
                const detail = componentMap.get(`${component.componentId}`);
                const model = modelMap.get(detail.modelId);
                infos.push(`${detail.name}${model ? '(' + model.basicInfo.prodCatId + ')' : ''}`)
            });
            return infos.join(' ');
        }
        return '';
    };



    // 这个是返回数据组合方法

// 获取部品等相关数据详情

    const genConfigHTML = (options) => {
        const {
            data,
            modelMap,
            componentMap
        } = options;

        const components = data.children;
        const hasComponent = !!(components && components.length);
        if (!hasComponent) {
           return `
            <br>
                <div class="tree-node">
                    <div class="tree-node-name">${data.itemValue}</div>
                </div>
            </br>
            `
        }



        const infos = [];
        components.forEach(component => {
           const isCombination = component.itemType === 2;
            if (isCombination) {
                const info = getCombinationDisplayInfo({
                    modelMap,
                    componentMap,
                    combinationList: component.combinationList
                });
                info && infos.push(info);
            } else {
                infos.push( getComponentDisplayInfo({
                    modelMap,
                    componentMap,
                    componentId: component.itemValue
                }));

            }

        });

        return `
            <div class="tree-node">
                <div class="tree-node-name">
                <span class="components" style="white-space: pre-line">${infos[0][0]}</span>
                </div>
                 <div class="tree-node-name">
                <span class="components" style="white-space: pre-line; font-weight:bold">${infos[0][1]}</span>
                </div>
                 <div class="tree-node-name">
                <span class="components" style="white-space:pre-line; font-weight:bold">${infos[0][2]}</span>
                </div>
                 <div class="tree-node-name">
                <input placeholder=${infos[0][3]} class="bg_input" type="text" id="old" />
                <input type="button" value="替换模型" href="javascript:void(0)" id="tihuan" onclick="(function(){ var b = ${replaceComponentForKD2}; b(document.getElementById('old').value, document.getElementById('new').value)})()" />
                <input placeholder=${"请输入新模型id"} class="bg_input" type="text" id="new">
                </div>
            </div>
             </br>
        `;
    };

// 除部品外的其他数据获取

    const genOtherHTML = (options) => {
        const {
            data,
            template,
            spaceMap,
            depth = 0
        } = options;
        const nextOptions = { ...options, depth: depth + 1, template: template.child, data: data.children };
        return `
            <div class="tree-node">
                <div class="tree-node-name">${!depth ? (spaceMap.get(data.itemValue) || data.itemValue) : data.itemValue}</div>
                ${genHTML(nextOptions)}
            </div>
        `;
    };



    const genHTML = (options) => {
        const {
           data,
            template,
            modelMap,
            componentMap
        } = options;

        const html = [];
        const child = template.child;
        const childIsComponent = child.valueType === 3;
        (data || []).forEach(item => {
            if (childIsComponent) {
                html.push(genConfigHTML({ data: item, modelMap, componentMap }));
            } else {
                html.push(genOtherHTML({ ...options, data: item }));
            }
        });
        return html.join('');
    };

// 头部相关内容配置
    const renderStyle = () => {
        const style = document.createElement('style');
        style.innerText = `
            .test-plugin-wrapper {
                position: fixed;
                z-index: 9999;
                width: 500px;
                height: 100%;
                right: 0;
                top: 0;
                background: #fff;
                overflow: auto;
            }

            .test-plugin-wrapper__hidden {
                display: none;
            }

            .test-plugin-wrapper .close {
                position: absolute;
                right: 5px;
                top: 5px;
                font-size: 14px;
                cursor: pointer;
                color: #1a7afb;
            }

            .test-plugin-wrapper .header {
                text-align: center;
                height: 36px;
                line-height: 36px;
                font-size: 18px;
                top: 0px;
                background: rgb(255, 255, 255);
                flex-shrink: 0;
                height: 50px;
                line-height: 50px;
                font-size: 14px;
                font-weight: 500;
                text-align: center;
                z-index: 1;

            }

            .test-plugin-wrapper .tree-node {
                font-size: 14px;
                padding-left: 24px;
            }



            .test-plugin-wrapper .tree-node-name {
                line-height: 32px;
                display: flex;
            }

            .test-plugin-wrapper .content > .tree-node > .tree-node-name {
                font-weight: 500;
                background:rgb(245,246,248);
                display:flex;
                align-items: center;
                font-weight: 700;
            }



            .test-plugin-wrapper .tree-node-name .components {
                margin-left: 10px;
                flex: 1;
                min-width: 1px;
            }

        `;
        document.head.appendChild(style);
    };



    let wrapper = null;
// 默认加载内容的配置
    const renderWrapper = () => {
        wrapper = document.createElement('div');
        wrapper.classList.add('test-plugin-wrapper');
        wrapper.innerHTML = `
            <div class="header">装标选配</div>
            <div id="J_test_plugin_content" class="content">
                <div class="tree-node">
                    <div class="tree-node-name">加载中...</div>
                </div>
            </div>
            <a href="javascript:void(0)" class="close">关闭</a>
        `;

        wrapper.addEventListener('click', (e) => {
            const dom = e.target;
            if (dom.classList.contains('close')) {
                wrapper.classList.add('test-plugin-wrapper__hidden');
            }
        });
        document.body.appendChild(wrapper);
    };

    const render = async () => {
        if (!configId) {
            return;
        }
        if (wrapper) {
            wrapper.classList.remove('test-plugin-wrapper__hidden');
            return;
        }

        renderStyle();
        renderWrapper();
        const [
            project,
            template,
            spaceEnums
        ] = await Promise.all([getProjectConfig(configId), getDecorationStandardTemplate(), getEnum('FLOORPLAN_SPACE')]);

        const ids = getAllComponentIds(project.itemList, template);
        const components = await getComponentsDetail(ids);
        const modelIds = getAllModelIds(components);
        const models = await getModelsDetail(modelIds);
        const componentMap = genComponentMap(components);
        const modelMap = genModelMap(models);
        const spaceMap = genEnumMap(spaceEnums);
        //const DataForKD=getComponentForKD(modelIds);
        const html = genHTML({ data: project.itemList, componentMap, modelMap, spaceMap, template });
        wrapper.querySelector('#J_test_plugin_content').innerHTML = html;
    };

    const renderButton = () => {
        const dom = document.createElement('button');
        console.log('======');
        console.log(dom);
        dom.innerText = '查看配置单详情';
        dom.style.cssText = `
            position: fixed;
            background: #1a7afb;
            border-radius: 10px;
            border: none;
            opacity: 0.8;
            width: 80px;
            height: 60px;
            color: white;
            top: 200px;
            right: 240px;
            z-index: 1000;
            cursor: pointer;
            fontSize: 16px;

        `;
         dom.addEventListener('click', () => {
            render().catch(e => console.error(e));
        });
        document.body.appendChild(dom);
    };
    setTimeout(renderButton, 50);

})();