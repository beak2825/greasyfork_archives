// ==UserScript==
// @name         BGM 角色关系图生成器
// @namespace    http://tampermonkey.net/
// @version      4.9
// @description  在 Bangumi 角色页面生成多层关系图（支持1~5层，自动合并双向关系，支持隐藏节点功能，支持关系扩展，支持强关系模式，支持剧透显示开关）
// @author       age_anime
// @match        https://bgm.tv/character/*
// @match        https://bangumi.tv/character/*
// @match        https://chii.in/character/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/vis/4.21.0/vis.min.js
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/544513/BGM%20%E8%A7%92%E8%89%B2%E5%85%B3%E7%B3%BB%E5%9B%BE%E7%94%9F%E6%88%90%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/544513/BGM%20%E8%A7%92%E8%89%B2%E5%85%B3%E7%B3%BB%E5%9B%BE%E7%94%9F%E6%88%90%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const base_url = window.location.origin;

    let attempts = 0;
    const maxAttempts = 50;
    const checkExist = setInterval(() => {
        attempts++;

        const contentInner = document.querySelector('#columnCrtB .content_inner.clearit');
        const charNameElement = document.querySelector('#headerSubject h1.nameSingle a');

        if (contentInner && charNameElement) {
            clearInterval(checkExist);
            insertButton(contentInner, charNameElement);
        } else if (attempts >= maxAttempts) {
            clearInterval(checkExist);
        }
    }, 300);

    function insertButton(contentInner, charNameElement) {
        try {
            const container = document.createElement('div');
            container.style.cssText = `
                display: flex !important;
                align-items: center !important;
                gap: 10px !important;
                margin-bottom: 15px !important;
            `;

            const input = document.createElement('input');
            input.type = 'number';
            input.min = '1';
            input.max = '5';
            input.value = '3';
            input.style.cssText = `
                width: 50px !important;
                padding: 5px !important;
                text-align: center !important;
                border: 1px solid #ccc !important;
                border-radius: 4px !important;
                color: black !important;
                background-color: white !important;
            `;

            // 剧透开关按钮
            const spoilerToggle = document.createElement('button');
            spoilerToggle.textContent = '👁️ 剧透: 关';
            spoilerToggle.style.cssText = `
                padding: 6px 10px !important;
                background-color: #9C27B0 !important;
                color: white !important;
                border: none !important;
                border-radius: 4px !important;
                cursor: pointer !important;
                font-size: 12px !important;
            `;
            spoilerToggle.dataset.spoilerActive = 'false';

            spoilerToggle.addEventListener('click', () => {
                const isActive = spoilerToggle.dataset.spoilerActive === 'true';
                if (isActive) {
                    spoilerToggle.textContent = '👁️ 剧透: 关';
                    spoilerToggle.style.backgroundColor = '#9C27B0';
                    spoilerToggle.dataset.spoilerActive = 'false';
                } else {
                    spoilerToggle.textContent = '👁️ 剧透: 开';
                    spoilerToggle.style.backgroundColor = '#4CAF50';
                    spoilerToggle.dataset.spoilerActive = 'true';
                }
            });

            const button = document.createElement('button');
            button.textContent = '🖼️ 生成关系图';
            button.style.cssText = `
                padding: 6px 10px !important;
                background-color: #4CAF50 !important;
                color: white !important;
                border: none !important;
                border-radius: 4px !important;
                cursor: pointer !important;
                font-size: 12px !important;
                font-weight: bold !important;
                display: block !important;
                box-shadow: 0 1px 2px rgba(0,0,0,0.2) !important;
            `;

            button.onmouseover = () => {
                button.style.backgroundColor = '#45a049 !important';
            };
            button.onmouseout = () => {
                button.style.backgroundColor = '#4CAF50 !important';
            };

            container.appendChild(input);
            container.appendChild(spoilerToggle);
            container.appendChild(button);
            contentInner.parentNode.insertBefore(container, contentInner);

            const charName = charNameElement.textContent.trim();
            const charId = location.pathname.split('/').pop();

            button.addEventListener('click', async () => {
                const layers = parseInt(input.value) || 3;
                if (layers < 1 || layers > 5) {
                    alert('❌ 层数必须在 1 到 5 之间');
                    return;
                }

                const includeSpoiler = spoilerToggle.dataset.spoilerActive === 'true';

                try {
                    button.disabled = true;
                    button.textContent = '🔄 正在生成...';

                    const nodes = new Map();
                    const edges = [];

                    let initialCharImage = getInitialCharacterImage();

                    nodes.set(charId, {
                        id: charId,
                        label: charName,
                        shape: 'image',
                        image: initialCharImage,
                        brokenImage: base_url + '/img/no_icon.jpg',
                        title: charName,
                        font: { color: '#000' }
                    });

                    await buildRelationGraph(charId, layers, nodes, edges, new Map(), 1, includeSpoiler);

                    const mergedEdges = mergeBidirectionalEdges(edges);

                    renderGraph([...nodes.values()], mergedEdges, charId, layers, includeSpoiler);

                } catch (error) {
                    alert('❌ 生成关系网失败: ' + error.message);
                    console.error('生成关系网失败:', error);
                } finally {
                    button.disabled = false;
                    button.textContent = '🖼️ 生成关系图';
                }
            });

        } catch (e) {
            alert('❌ 插入按钮时出错: ' + e.message);
        }
    }

    function getInitialCharacterImage() {
        const img = document.querySelector('#columnCrtA .infobox img');
        return img ? img.src : base_url + '/img/no_icon.jpg';
    }

    const fetchedCache = new Map();

    async function buildRelationGraph(charId, layers, nodes, edges, visited = new Map(), currentLayer = 1, includeSpoiler = false) {
        if (currentLayer > layers) return;

        if (visited.has(charId) && visited.get(charId) <= currentLayer) {
            return;
        }

        visited.set(charId, currentLayer);

        const relations = await fetchRelations(charId, includeSpoiler);
        for (const rel of relations) {
            const { id, name, relation, image, isSpoiler } = rel;

            if (!nodes.has(id)) {
                nodes.set(id, {
                    id: id,
                    label: name,
                    shape: 'image',
                    image: image || base_url + '/img/no_icon.jpg',
                    brokenImage: base_url + '/img/no_icon.jpg',
                    title: name,
                    font: { color: '#000' },
                    isSpoiler: isSpoiler
                });
            } else if (includeSpoiler && isSpoiler) {
                // 剧透开启时，更新节点的剧透状态
                const node = nodes.get(id);
                node.isSpoiler = true;
                nodes.set(id, node);
            }

            edges.push({
                from: charId,
                to: id,
                label: relation,
                arrows: 'to',
                isSpoiler: isSpoiler
            });

            await buildRelationGraph(id, layers, nodes, edges, visited, currentLayer + 1, includeSpoiler);
        }
    }

    async function fetchRelations(charId, includeSpoiler = false) {
        const cacheKey = `${charId}-${includeSpoiler}`;
        if (fetchedCache.has(cacheKey)) {
            return fetchedCache.get(cacheKey);
        }

        const url = `${base_url}/character/${charId}`;
        try {
            const response = await fetch(url, { credentials: 'include' });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            const container = doc.querySelector('#columnCrtB .crt_relations.content_inner.clearit');
            if (!container) return [];

            const relations = [];
            const items = container.querySelectorAll('ul.browserCoverMedium > li');

            // 用于合并同一对角色的多个关系
            const relationMap = new Map();

            items.forEach((li, index) => {
                try {
                    const isSpoiler = li.classList.contains('spoiler');

                    // 剧透关闭时跳过 spoiler 项
                    if (!includeSpoiler && isSpoiler) return;

                    const subElement = li.querySelector('p.sub.spoilerable');
                    let relationType = '';

                    if (subElement) {
                        const badge = subElement.querySelector('.badge_job_tip');
                        const badgeText = badge ? badge.textContent.trim() : '';

                        const mainTextNodes = Array.from(subElement.childNodes)
                            .filter(node => node.nodeType === Node.TEXT_NODE)
                            .map(node => node.textContent.trim())
                            .join('')
                            .trim();

                        relationType = mainTextNodes + (badgeText ? `(${badgeText})` : '');
                    }

                    const link = li.querySelector('.info a');
                    if (!link) return;

                    const name = link.textContent.trim();
                    const href = link.getAttribute('href');
                    const idMatch = href?.match(/\/character\/(\d+)/);
                    if (!idMatch) return;

                    const id = idMatch[1];

                    let image = base_url + '/img/no_icon.jpg';
                    const imgElement = li.querySelector('.avatar span');
                    if (imgElement && imgElement.style.backgroundImage) {
                        const bg = imgElement.style.backgroundImage;
                        const urlMatch = bg.match(/url\(['"]?(.*?)['"]?\)/);
                        if (urlMatch) image = urlMatch[1];
                    }

                    // 合并同一对角色的多个关系，但保留第一次获取的名称和图片
                    const key = `${charId}-${id}`; // A -> B
                    if (!relationMap.has(key)) {
                        relationMap.set(key, {
                            relations: new Set(),
                            name: name,
                            image: image,
                            isSpoiler: isSpoiler
                        });
                    }
                    relationMap.get(key).relations.add(relationType);

                } catch (e) {
                    console.warn(`❌ 解析第${index}项关系失败`, e);
                }
            });

            // 将合并后的关系转换为数组
            for (const [key, data] of relationMap.entries()) {
                const [from, to] = key.split('-');
                const sortedRelations = [...data.relations].filter(Boolean).sort().join(', ');

                relations.push({
                    id: to,
                    name: data.name,
                    relation: sortedRelations,
                    image: data.image,
                    isSpoiler: data.isSpoiler
                });
            }

            fetchedCache.set(cacheKey, relations);
            return relations;
        } catch (e) {
            console.warn('❌ 获取关系失败:', e);
            return [];
        }
    }

    function mergeBidirectionalEdges(edges) {
        const edgeMap = new Map();

        edges.forEach(edge => {
            const key = [edge.from, edge.to].sort().join('-');
            if (!edgeMap.has(key)) {
                edgeMap.set(key, { forward: [], backward: [] });
            }

            const group = edgeMap.get(key);
            if (edge.from < edge.to) {
                group.forward.push(edge);
            } else if (edge.from > edge.to) {
                group.backward.push(edge);
            } else {
                group.forward.push(edge);
            }
        });

        const result = [];

        for (const [nodePair, { forward, backward }] of edgeMap.entries()) {

            const forwardLabels = [...new Set(forward.map(e => e.label || ''))].filter(Boolean).sort();
            const backwardLabels = [...new Set(backward.map(e => e.label || ''))].filter(Boolean).sort();

            const forwardLabelStr = forwardLabels.join(', ');
            const backwardLabelStr = backwardLabels.join(', ');

            if (forwardLabelStr === backwardLabelStr && forwardLabelStr !== '') {
                const [nodeA, nodeB] = nodePair.split('-');
                result.push({
                    from: nodeA,
                    to: nodeB,
                    label: forwardLabelStr,
                    arrows: 'from, to',
                    color: { color: '#FF5722' },
                    isSpoiler: forward[0]?.isSpoiler || backward[0]?.isSpoiler
                });
            } else {
                if (forward.length > 0) {
                    result.push({
                        from: forward[0].from,
                        to: forward[0].to,
                        label: forwardLabelStr || ' ',
                        arrows: 'to',
                        color: { color: '#666666' },
                        isSpoiler: forward[0].isSpoiler
                    });
                }

                if (backward.length > 0) {
                    result.push({
                        from: backward[0].from,
                        to: backward[0].to,
                        label: backwardLabelStr || ' ',
                        arrows: 'to',
                        color: { color: '#666666' },
                        isSpoiler: backward[0].isSpoiler
                    });
                }
            }
        }

        return result;
    }

    // 查找连通图
    function findConnectedComponents(nodes, edges) {
        const nodeMap = new Map(nodes.map(node => [node.id, node]));
        const edgeMap = new Map();

        // 构建邻接表
        edges.forEach(edge => {
            if (!edgeMap.has(edge.from)) edgeMap.set(edge.from, []);
            if (!edgeMap.has(edge.to)) edgeMap.set(edge.to, []);
            edgeMap.get(edge.from).push(edge.to);
            edgeMap.get(edge.to).push(edge.from);
        });

        const visited = new Set();
        const components = [];

        nodes.forEach(node => {
            if (!visited.has(node.id)) {
                const component = [];
                const queue = [node.id];
                visited.add(node.id);

                while (queue.length > 0) {
                    const currentId = queue.shift();
                    component.push(currentId);

                    const neighbors = edgeMap.get(currentId) || [];
                    neighbors.forEach(neighborId => {
                        if (!visited.has(neighborId)) {
                            visited.add(neighborId);
                            queue.push(neighborId);
                        }
                    });
                }

                components.push(component);
            }
        });

        return components;
    }

    function renderGraph(nodes, edges, initialCharId, layers, includeSpoiler) {
        const existingModal = document.getElementById('relation-graph-modal');
        if (existingModal) document.body.removeChild(existingModal);

        const modal = document.createElement('div');
        modal.id = 'relation-graph-modal';
        modal.style.cssText = `
            position: fixed !important;
            top: 40px !important;
            left: 40px !important;
            right: 40px !important;
            bottom: 40px !important;
            background-color: #fff !important;
            z-index: 10000 !important;
            border: 2px solid #ccc !important;
            box-shadow: 0 0 20px rgba(0,0,0,0.5) !important;
            padding: 15px !important;
        `;

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style.cssText = `
            position: absolute !important;
            top: 10px !important;
            right: 10px !important;
            width: 30px !important;
            height: 30px !important;
            background-color: #f44336 !important;
            color: white !important;
            border: none !important;
            border-radius: 50% !important;
            cursor: pointer !important;
            font-size: 18px !important;
            font-weight: bold !important;
        `;
        closeBtn.onclick = () => document.body.removeChild(modal);
        modal.appendChild(closeBtn);

        const title = document.createElement('h3');
        title.textContent = '角色关系图 (' + nodes.length + '个节点, ' + edges.length + '条关系)';
        title.style.marginTop = '0';
        title.style.marginBottom = '10px';
        modal.appendChild(title);

        const graphContainer = document.createElement('div');
        graphContainer.id = 'relation-graph';
        graphContainer.style.cssText = `
            width: 100% !important;
            height: calc(100% - 50px) !important;
            border: 1px solid #ddd !important;
        `;
        modal.appendChild(graphContainer);
        document.body.appendChild(modal);

        const hideBtn = document.createElement('button');
        hideBtn.textContent = '👁️ 隐藏模式';
        hideBtn.style.cssText = `
            position: absolute !important;
            bottom: 15px !important;
            right: 15px !important;
            padding: 8px 15px !important;
            background-color: #2196F3 !important;
            color: white !important;
            border: none !important;
            border-radius: 4px !important;
            cursor: pointer !important;
            font-size: 12px !important;
            z-index: 10001 !important;
        `;
        hideBtn.dataset.active = 'false';
        modal.appendChild(hideBtn);

        // 添加强关系复选框
        const strongRelationCheckbox = document.createElement('input');
        strongRelationCheckbox.type = 'checkbox';
        strongRelationCheckbox.id = 'strong-relation-mode';
        strongRelationCheckbox.style.cssText = `
            position: absolute !important;
            bottom: 20px !important;
            right: 230px !important;
            z-index: 10001 !important;
        `;

        const strongRelationLabel = document.createElement('label');
        strongRelationLabel.setAttribute('for', 'strong-relation-mode');
        strongRelationLabel.textContent = '强关系';
        strongRelationLabel.style.cssText = `
            position: absolute !important;
            bottom: 20px !important;
            right: 250px !important;
            color: #333 !important;
            font-size: 12px !important;
            z-index: 10001 !important;
        `;

        modal.appendChild(strongRelationCheckbox);
        modal.appendChild(strongRelationLabel);

        // 添加关系扩展按钮
        const expandBtn = document.createElement('button');
        expandBtn.textContent = '🔍 关系扩展';
        expandBtn.style.cssText = `
            position: absolute !important;
            bottom: 15px !important;
            right: 130px !important;
            padding: 8px 15px !important;
            background-color: #FF9800 !important;
            color: white !important;
            border: none !important;
            border-radius: 4px !important;
            cursor: pointer !important;
            font-size: 12px !important;
            z-index: 10001 !important;
        `;
        expandBtn.dataset.active = 'false';
        expandBtn.dataset.includeSpoiler = includeSpoiler; // 保存初始剧透设置
        modal.appendChild(expandBtn);

        try {
            const data = {
                nodes: new vis.DataSet(nodes),
                edges: new vis.DataSet(edges)
            };

            const options = {
                nodes: {
                    shape: 'image',
                    size: 50,
                    font: {
                        color: '#000',
                        size: 12,
                        face: 'Arial, sans-serif',
                        strokeColor: '#fff',
                        strokeWidth: 2
                    }
                },
                edges: {
                    arrows: { to: { enabled: true, scaleFactor: 0.7 } },
                    font: {
                        align: 'horizontal',
                        size: 10,
                        background: 'rgba(255,255,255,0.8)'
                    },
                    color: { color: '#666666' },
                    smooth: { type: 'continuous' },
                    scaling: {
                        label: {
                            enabled: true
                        }
                    }
                },
                physics: {
                    enabled: true,
                    stabilization: { iterations: 100, fit: true },
                    barnesHut: {
                        gravitationalConstant: -3000,
                        springLength: 225,
                        springConstant: 0.01,
                        damping: 0.5,
                        avoidOverlap: 1
                    }
                },
                interaction: {
                    dragNodes: true,
                    dragView: true,
                    zoomView: true
                }
            };

            const network = new vis.Network(graphContainer, data, options);

            // 保存初始状态的数据
            const initialNodes = new Map(nodes.map(node => [node.id, node]));

            // 将初始的合并边转换为原始边格式，用于后续扩展时的统一处理
            let allRawEdges = [];

            // 从初始合并边中提取原始边数据
            edges.forEach(edge => {
                if (edge.arrows === 'from, to') {
                    // 双向合并边拆分成两个原始单向边
                    allRawEdges.push({
                        from: edge.from,
                        to: edge.to,
                        label: edge.label,
                        arrows: 'to',
                        isSpoiler: edge.isSpoiler
                    });
                    allRawEdges.push({
                        from: edge.to,
                        to: edge.from,
                        label: edge.label,
                        arrows: 'to',
                        isSpoiler: edge.isSpoiler
                    });
                } else if (edge.arrows === 'to') {
                    // 单向边直接保存
                    allRawEdges.push({
                        from: edge.from,
                        to: edge.to,
                        label: edge.label,
                        arrows: 'to',
                        isSpoiler: edge.isSpoiler
                    });
                }
            });

            let hiddenNodes = new Set();
            let hiddenEdges = new Set();

            let expandModeActive = false;
            let currentLayers = layers;

            // 切换扩展模式
            expandBtn.addEventListener('click', function () {
                expandModeActive = !expandModeActive;
                if (expandModeActive) {
                    this.style.backgroundColor = '#FF5722';
                    this.textContent = '🔍 点击角色扩展';
                } else {
                    this.style.backgroundColor = '#FF9800';
                    this.textContent = '🔍 关系扩展';
                }
            });

            network.on("click", async function (params) {
                const hideModeActive = hideBtn.dataset.active === 'true';

                if (hideModeActive && params.nodes.length > 0) {
                    const nodeId = params.nodes[0];

                    hiddenNodes.add(nodeId);

                    // 关键修复：删除与该节点相关的所有边（包括原始边）
                    const connectedEdgesToRemove = [];
                    const remainingRawEdges = [];

                    // 从当前显示的边中找出要删除的边
                    data.edges.forEach(edge => {
                        if (edge.from === nodeId || edge.to === nodeId) {
                            connectedEdgesToRemove.push(edge.id);
                            hiddenEdges.add(edge.id);
                        }
                    });

                    // 从原始边数组中移除与该节点相关的边
                    allRawEdges = allRawEdges.filter(edge => {
                        if (edge.from === nodeId || edge.to === nodeId) {
                            // 这些边需要被隐藏，不保留在原始边中
                            return false;
                        }
                        return true;
                    });

                    // 从图中移除节点和边
                    data.nodes.remove(nodeId);
                    data.edges.remove(connectedEdgesToRemove);

                    // 重新合并剩余的原始边
                    const remainingMergedEdges = mergeBidirectionalEdges(allRawEdges);

                    // 更新图的边
                    data.edges.clear();
                    data.edges.add(remainingMergedEdges);

                    const nodeCount = data.nodes.length;
                    const edgeCount = data.edges.length;
                    title.textContent = `角色关系图 (${nodeCount}个节点, ${edgeCount}条关系)`;

                } else if (expandModeActive && params.nodes.length > 0) {
                    const nodeId = params.nodes[0];

                    try {
                        expandBtn.disabled = true;
                        expandBtn.textContent = '🔄 加载中...';

                        // 使用初始的剧透设置
                        const newRelations = await fetchRelations(nodeId, includeSpoiler);

                        const newNodes = [];
                        const newRawEdges = [];

                        for (const rel of newRelations) {
                            const { id, name, relation, image, isSpoiler } = rel;

                            // 检查节点是否可以在 DataSet 中添加
                            // data.nodes.get(id) 返回 null 表示节点不存在或已被删除
                            const canAddNode = data.nodes.get(id) === null;

                            // 如果是强关系模式且节点被隐藏，尝试恢复
                            if (strongRelationCheckbox.checked && hiddenNodes.has(id)) {
                                hiddenNodes.delete(id);
                                if (canAddNode) {
                                    newNodes.push({
                                        id: id,
                                        label: name,
                                        shape: 'image',
                                        image: image || base_url + '/img/no_icon.jpg',
                                        brokenImage: base_url + '/img/no_icon.jpg',
                                        title: name,
                                        font: { color: '#000' },
                                        isSpoiler: isSpoiler
                                    });
                                }
                            }
                            // 节点真的不存在时才添加
                            else if (canAddNode && !initialNodes.has(id) && !hiddenNodes.has(id)) {
                                newNodes.push({
                                    id: id,
                                    label: name,
                                    shape: 'image',
                                    image: image || base_url + '/img/no_icon.jpg',
                                    brokenImage: base_url + '/img/no_icon.jpg',
                                    title: name,
                                    font: { color: '#000' },
                                    isSpoiler: isSpoiler
                                });
                            }

                            // 添加新边到原始边列表
                            newRawEdges.push({
                                from: nodeId,
                                to: id,
                                label: relation,
                                arrows: 'to',
                                isSpoiler: isSpoiler
                            });
                        }

                        // 添加新节点到图中（使用 update，避免重复 ID 错误）
                        if (newNodes.length > 0) {
                            data.nodes.update(newNodes);
                        }

                        // 将新边添加到所有原始边中
                        allRawEdges = allRawEdges.concat(newRawEdges);

                        // 重新合并所有原始边
                        const allMergedEdges = mergeBidirectionalEdges(allRawEdges);

                        // 更新图的边
                        data.edges.clear();
                        data.edges.add(allMergedEdges);

                        const nodeCount = data.nodes.length;
                        const edgeCount = data.edges.length;
                        title.textContent = `角色关系图 (${nodeCount}个节点, ${edgeCount}条关系)`;

                    } catch (err) {
                        console.error("扩展失败:", err);
                        alert("❌ 扩展失败：" + err.message);
                    } finally {
                        expandBtn.disabled = false;
                        expandBtn.textContent = '🔍 点击角色扩展';
                    }

                } else if (!hideModeActive && params.nodes.length > 0) {
                    const nodeId = params.nodes[0];
                    window.open(`${base_url}/character/${nodeId}`, '_blank');
                }
            });

            // 隐藏模式切换
            hideBtn.addEventListener('click', function () {
                const isActive = this.dataset.active === 'true';

                if (isActive) {
                    this.textContent = '👁️ 隐藏模式';
                    this.style.backgroundColor = '#2196F3';
                    this.dataset.active = 'false';
                } else {
                    this.textContent = '👁️ 点击角色隐藏';
                    this.style.backgroundColor = '#FF9800';
                    this.dataset.active = 'true';
                }
            });

        } catch (e) {
            graphContainer.innerHTML = '<p style="text-align:center;color:red;">渲染图表失败: ' + e.message + '</p>';
        }
    }
})();
