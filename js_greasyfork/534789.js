// ==UserScript==
// @name          夸克网盘目录导出（夸克在线分享链接文件目录导出）
// @namespace    https://greasyfork.org/zh-CN/users/1465036-%E7%9F%A5%E8%AF%86%E5%90%9B%E7%9C%BC%E9%95%9C%E5%93%A5
// @version      1.6
// @description  固定右上角图标导出树状目录，含层级结构和文件大小，附公众号与微信号信息
// @author       知识君眼镜哥
// @match        https://pan.quark.cn/s/*
// @grant        none
// @license      MIT
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery.fancytree/2.38.3/jquery.fancytree-all-deps.min.js
// @downloadURL https://update.greasyfork.org/scripts/534789/%E5%A4%B8%E5%85%8B%E7%BD%91%E7%9B%98%E7%9B%AE%E5%BD%95%E5%AF%BC%E5%87%BA%EF%BC%88%E5%A4%B8%E5%85%8B%E5%9C%A8%E7%BA%BF%E5%88%86%E4%BA%AB%E9%93%BE%E6%8E%A5%E6%96%87%E4%BB%B6%E7%9B%AE%E5%BD%95%E5%AF%BC%E5%87%BA%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/534789/%E5%A4%B8%E5%85%8B%E7%BD%91%E7%9B%98%E7%9B%AE%E5%BD%95%E5%AF%BC%E5%87%BA%EF%BC%88%E5%A4%B8%E5%85%8B%E5%9C%A8%E7%BA%BF%E5%88%86%E4%BA%AB%E9%93%BE%E6%8E%A5%E6%96%87%E4%BB%B6%E7%9B%AE%E5%BD%95%E5%AF%BC%E5%87%BA%EF%BC%89.meta.js
// ==/UserScript==

(function() {
  'use strict';
  const shareId = location.pathname.split('/s/')[1];

  function getStoken() {
    let data = sessionStorage.getItem('_share_args');
    if (!data) return '';
    try {
      let obj = JSON.parse(data);
      return obj.value && obj.value.stoken ? obj.value.stoken : '';
    } catch(e) {
      return '';
    }
  }

  async function getList(parentFileId = 0, page = 1, size = 100) {
    let url = new URL('https://drive-pc.quark.cn/1/clouddrive/share/sharepage/detail');
    let params = {
      pr: 'ucpro', fr: 'pc', uc_param_str: '', pwd_id: shareId,
      stoken: getStoken(), pdir_fid: parentFileId, force: 0,
      _page: page, _size: size, _fetch_banner: 0,
      _fetch_share: 0, _fetch_total: 1,
      _sort: 'file_type:asc,updated_at:desc',
      __dt: 959945, __t: Date.now()
    };
    Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, v));
    const res = await fetch(url, {
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json;charset=UTF-8',
        'x-canary': 'client=web,app=adrive,version=v2.3.1'
      }
    });
    const json = await res.json();
    return json?.data?.list || [];
  }

  async function buildTree(parentFid = 0) {
    const node = { children: [] };
    const list = await getList(parentFid);
    for (const item of list) {
      if (item.dir) {
        const childNode = await buildTree(item.fid);
        childNode.name = item.file_name;
        node.children.push(childNode);
      } else {
        node.children.push({ name: item.file_name, size: item.size });
      }
    }
    return node;
  }

  async function exportText() {
    const treeData = await buildTree();
    const lines = [];
    const traverse = (nodes, level = 0) => {
      const indent = '│   '.repeat(level);
      nodes.forEach((node, i) => {
        const isLast = i === nodes.length - 1;
        const symbol = isLast ? '└── ' : '├── ';
        const name = node.name || node.file_name;
        if (node.children) {
          lines.push(indent + symbol + name + '/');
          traverse(node.children, level + 1);
        } else {
          const size = node.size ? ` (${(node.size / 1048576).toFixed(2)} MB)` : '';
          lines.push(indent + symbol + name + size);
        }
      });
    };
    const roots = treeData.children || [];
    roots.forEach(node => {
      lines.push((node.name || node.file_name) + '/');
      if (node.children) traverse(node.children, 1);
    });

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quark_directory.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '10px';
  container.style.right = '10px';
  container.style.zIndex = '2147483647';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.alignItems = 'center';
  container.style.fontFamily = 'sans-serif';
  container.style.gap = '6px';
  document.body.appendChild(container);

  const imgBtn = document.createElement('img');
  imgBtn.src = 'https://picabstract-preview-ftn.weiyun.com/ftn_pic_abs_v3/c66136822cef5c98c367cd80d806607e9346edbb0a99dbaf5e1afdca11c611fea1e3f864390c373bb16ba4606453867b?pictype=scale&from=30113&version=3.3.3.3&fname=%E7%BE%A4%E8%81%8A%E4%B8%93%E7%94%A8.jpg&size=750';
  imgBtn.alt = 'Export Icon';
  imgBtn.style.width = '60px';
  imgBtn.style.height = '60px';
  imgBtn.style.borderRadius = '10px';
  imgBtn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
  imgBtn.style.cursor = 'pointer';
  imgBtn.title = '点击导出目录';
  container.appendChild(imgBtn);
  imgBtn.addEventListener('click', exportText);

  const info1 = document.createElement('div');
  info1.textContent = '公众号：知识君眼镜哥';
  info1.style.fontSize = '13px';
  info1.style.color = '#222';
  const info2 = document.createElement('div');
  info2.textContent = '微信号：xue63358';
  info2.style.fontSize = '13px';
  info2.style.color = '#222';

  container.appendChild(info1);
  container.appendChild(info2);
})();
