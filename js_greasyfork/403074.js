// ==UserScript==
// @name         哗啦啦 gitlab 增强工具
// @namespace    https://greasyfork.org/
// @version      0.14
// @description  优化哗啦啦 gitlab 的使用体验，包括 md 文档阅读器等
// @author       AmBeta
// @match        *://git.hualala.com/*
// @require      https://cdn.jsdelivr.net/npm/markdown-it@11.0.0/dist/markdown-it.min.js
// @require      https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/tocbot@4.11.2/dist/tocbot.min.js
// @require      https://cdn.jsdelivr.net/npm/jstree@3.3.9/dist/jstree.min.js
// @resource     tocbotCSS https://cdn.jsdelivr.net/npm/tocbot@4.11.2/dist/tocbot.css
// @resource     jstreeCSS https://cdn.jsdelivr.net/npm/jstree@3.3.9/dist/themes/default/style.min.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/403074/%E5%93%97%E5%95%A6%E5%95%A6%20gitlab%20%E5%A2%9E%E5%BC%BA%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/403074/%E5%93%97%E5%95%A6%E5%95%A6%20gitlab%20%E5%A2%9E%E5%BC%BA%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(async function() {
  'use strict';
  //================ Global variables =======================
  const NAME = 'HLL-ENG'; // for 'HuaLaLa-EnhanceGitlab'
  let TOKEN = '';
  let inited = false;

  //================ General methods ========================
  const $get = (url, params = {}) => new Promise((resolve, reject) => {
    const urlParams = Object.keys(params)
      .map(key => `${key}=${params[key]}`)
      .join('&');
    GM_xmlhttpRequest({
      method: 'GET',
      url: `${url}?${urlParams}`,
      onload: (res) => {
        // check status
        if (res.status === 401) {
          checkToken(true);
          return reject(res.statusText);
        }
        // parse headers
        const headers = res.responseHeaders.split('\n')
          .map(h => ({ [String.prototype.trim.call(h.split(': ')[0])]: String.prototype.trim.call(h.split(': ')[1]) }))
          .reduce((ret, h) => Object.assign(ret, h), {});
        if (headers['content-type'] === 'application/json') {
          res.body = JSON.parse(res.response);
        } else {
          res.body = res.response;
        }
        res.responseHeaders = headers;

        resolve(res.body);
      },
      onerror: err => reject(err)
    });
  });

  const debounce = function debounce(fn, timeout) {
    const self = this;
    let timer = 0;
    return (...args) => {
      if (timer > 0) clearTimeout(timer);
      timer = setTimeout(() => {
        fn.call(self, ...args);
      }, timeout);
    };
  };

  //================== Utility methods =======================
  /** 生成唯一ID */
  const genUID = (() => {
    let uid = 0;
    return () => uid++;
  })();

  /** 检查 Token 是否存在 */
  const checkToken = (force = false) => {
    const key = `${NAME}:token`;
    TOKEN = localStorage.getItem(key);
    if (!TOKEN || force) {
      TOKEN = window.prompt('请输入 Personal Access Token 以调用 gitlab 相关接口：');
      if (!TOKEN) return false;
      localStorage.setItem(key, TOKEN);
    }
    return true;
  };

  /** 检查是否为 MD 文件预览页面 */
  const checkMarkdownFile = () => {
    const [match, group, repo, branch, path] = location.pathname.match(/^\/([^/]+)\/([^/]+)\/blob\/([^/]+)\/(.+\.md)$/) || [];
    if (!match) return false;
    return { group, repo, branch, path: decodeURIComponent(path) };
  };

  /** 检查是否为文件浏览页面 */
  const checkFileBrowser = () => {
    const [match, group, repo, branch, , path] = location.pathname.match(/^\/([^/]+)\/([^/]+)\/(?:tree|blob)\/([^/]+)(\/(.+))?$/) || [];
    if (!match) return false;
    return { group, repo, branch, path: path && decodeURIComponent(path) };
  };

  /** 检查是否为 commit 详情浏览 */
  const checkCommitViewer = () => {
    const [match, group, repo, sha] = location.pathname.match(/^\/([^/]+)\/([^/]+)\/commit\/([0-9a-z]+)$/) || [];
    if (!match) return false;
    return { group, repo, sha };
  };

  //================== Functional methods =====================
  /** 修复文档图片预览 */
  function fixImagePreview(container) {
    $(container).find('img').each((_, img) => {
      img.src = img.src.replace('blob', 'raw');
    });
  }

  /** 渲染 Markdown */
  async function renderMarkdown(container, filePath) {
    const fileContent = await $get(filePath);
    const md = markdownit({
      html: true,
      breaks: true,
      linkify: true
    });
    const result = md.render(fileContent);
    container.innerHTML = result;
  }

  /** 在页面右侧添加文档目录 */
  function addTOC(contentSelector) {
    const headingSelector = 'h1, h2, h3, h4, h5, h6';
    // 计算标题的相对 level 使之连续
    let level = 1;
    let stack = [];
    $(headingSelector).each((_, heading) => {
      let lastLevel = stack.pop();
      const headingLevel = +heading.tagName.split('H').join('');

      if (!lastLevel || headingLevel === lastLevel) {
        stack.push(headingLevel);
      } else if (headingLevel > lastLevel) {
        stack.push(lastLevel, headingLevel);
        level++;
      } else {
        while (headingLevel < lastLevel) {
          lastLevel = stack.pop();
          level--;
        }
        stack.push(headingLevel);
      }

      heading.setAttribute('data-level', level);
    });
    // 添加目录容器
    $('<div class="toc toc-container" />')
      .appendTo(document.body);
    // 生成文档目录
    tocbot.init({
      tocSelector: '.toc-container',
      contentSelector,
      headingSelector,
      headingsOffset: 105,
      scrollSmoothOffset: -105,
      collapseDepth: 3,
      headingObjectCallback: (obj, heading) => {
        const id = `toc-${genUID()}`;
        heading.setAttribute('id', id);
        obj.id = id;
        obj.headingLevel = heading.dataset.level;
        return obj;
      }
    });
  }

  /** 通过项目名称获取项目 ID */
  async function getProjectID(name) {
    const projects = await $get(`/api/v3/projects`, {
      private_token: TOKEN,
      search: name,
    });
    const project = projects.find(p => (p.name === name));
    if (!project) throw new Error(`cannot find project named ${name}.`);
    return project.id;
  }

  /** 在页面左侧添加文档树 */
  async function addFileTree(repoInfo) {
    const { group, repo, branch, path: currentPath } = repoInfo;
    let projectID = 0;
    let currentID = '';

    const getLatestCommitID = async () => {
      const commits = await $get(`/api/v3/projects/${projectID}/repository/commits`, {
        private_token: TOKEN,
        ref_name: branch,
      });
      if (commits.length === 0) {
        throw new Error(`failed to get commits`);
      }
      return commits[0].short_id;
    };
    const getFileTree = async (path = '') => {
      const list = await $get(`/api/v3/projects/${projectID}/repository/tree`, {
        private_token: TOKEN,
        ref_name: branch,
        recursive: true,
        path,
      });
      return Promise.all(list.map(async (item) => {
        const { id, name, type } = item;
        const p = path ? `${path}/${name}` : name;
        let children = [];
        if (type === 'tree') {
          children = await getFileTree(p);
        }
        if (p === currentPath) {
          currentID = id;
        }
        return {
          id,
          text: name,
          type: type === 'tree' ? 'dir' : p.slice(p.lastIndexOf('.') + 1).toLowerCase(),
          children,
          data: {
            path: p,
            pathname: `/${group}/${repo}/${type === 'tree' ? 'tree' : 'blob'}/${branch}/${p}`,
          },
        };
      }));
    };

    projectID = await getProjectID(repo);
    
    let files = [];
    const commitID = await getLatestCommitID();
    const cacheKey = `${NAME}:${projectID}`;
    const cachedString = localStorage.getItem(cacheKey);
    const cachedData = cachedString ? JSON.parse(cachedString) : null;
    
    if (cachedData && cachedData.id === commitID) {
      files = cachedData.files;
      // find currentID
      const stack = [...files];
      let file = stack.pop();
      while (file && !currentID) {
        if (file.data.path === currentPath) {
          currentID = file.id;
        } else {
          stack.push(...file.children);
          file = stack.pop();
        }
      }
    } else {
      files = await getFileTree();
      localStorage.setItem(cacheKey, JSON.stringify({ id: commitID, files }));
    }

    // 初始化容器
    const container = $('<div class="file-tree-container"></div>');
    // 初始化 jstree 插件
    const jstree = $('<div />')
      // init jstree
      .jstree({
        core: {
          data: files,
        },
        plugins: ['wholerow', 'types', 'state', 'search'],
        state: {
          filter: (state) => {
            delete state.core.selected;
            return state;
          },
        },
        search: {
          show_only_matches: true,
          search_leaves_only: true,
          close_opened_onclear: true,
        },
        types: {
          default:   { icon: 'default-icon' },
          dir:       { icon: 'dir-icon' },
          md:        { icon: 'md-icon' },
          png:       { icon: 'img-icon' },
          jpg:       { icon: 'img-icon' },
          js:        { icon: 'js-icon' },
          ts:        { icon: 'ts-icon' },
          jsx:       { icon: 'jsx-icon' },
          tsx:       { icon: 'tsx-icon' },
          vue:       { icon: 'vue-icon' },
          java:      { icon: 'java-icon' },
          html:      { icon: 'html-icon' },
          xml:       { icon: 'xml-icon' },
          json:      { icon: 'json-icon' },
          gitignore: { icon: 'git-icon' },
          babelrc:   { icon: 'babel-icon' },
          py:        { icon: 'py-icon' },
          pyc:       { icon: 'pyc-icon' },
          xlsx:      { icon: 'excel-icon' },
          docx:      { icon: 'word-icon' },
          pptx:      { icon: 'ppt-icon' },
          exe:       { icon: 'exe-icon' },
          zip:       { icon: 'zip-icon' },
          csv:       { icon: 'csv-icon' },
          css:       { icon: 'css-icon' },
          scss:      { icon: 'scss-icon' },
          ejs:       { icon: 'ejs-icon' },
        },
      })
      // bind events
      .on('ready.jstree', (_, { instance }) => {
        if (currentID) {
          instance.select_node(currentID);
          instance.open_node(currentID);
        }
      })
      .on('select_node.jstree', (_, { node, instance }) => {
        const { id, type, data } = node;
        const { pathname } = data;
        if (type === 'dir') {
          instance[instance.is_open(id) ? 'close_node' : 'open_node'](id);
        } else if (location.pathname !== encodeURI(pathname)) {
          instance.clear_search();
          location = pathname;
        }
      });
    // 添加搜索操作
    const doSearch = debounce((keyword) => {
      jstree.data('jstree').search(keyword);
    }, 200);
    const searchInput = $('<input placeholder="搜索文件..." />')
      .on('input', (evt) => {
        if (evt.originalEvent.isComposing) return;
        doSearch(evt.target.value);
      })
      .on('compositionend', (evt) => {
        doSearch(evt.target.value);
      });
    // 添加列宽拖动功能
    const dragger = $('<div class="dragger"></div>');
    let startX = 0;
    let startWidth = 0;
    let mousemoveHandler = (evt) => {
      const movement = evt.pageX - startX;
      const width = Math.max(5, startWidth + movement);
      container.css('width', `${width}px`);
    };
    dragger.on('mousedown', (evt) => {
      startX = evt.pageX;
      startWidth = parseInt(container.css('width'));
      document.addEventListener('mousemove', mousemoveHandler);
    }).on('mouseup', () => {
      document.removeEventListener('mousemove', mousemoveHandler);
    });
    // 添加到文档树
    container
      .append(searchInput)
      .append(jstree)
      .append(dragger)
      .appendTo(document.body);
  }

  // async function beautifyDiff(commitInfo) {
  //   const { group, repo, sha } = commitInfo;
  //   const projectID = await getProjectID(repo);
  //   const diffs = await $get(`/api/v3/projects/${projectID}/repository/commits/${sha}/diff`, {
  //     private_token: TOKEN,
  //   });
  //   diffs.forEach(async (diff, idx) => {
  //     console.log('diff', diff);
  //     const { new_path } = diff;
  //     if (!new_path.endsWith('.md')) return;
      
  //     const container = document.querySelector(`#diff-${idx} .diff-content`);
  //     const filePath = `/${group}/${repo}/raw/${sha}/${new_path}`;
  //     await renderMarkdown(container, filePath);
  //     // fix image path error
  //     const folderPath = filePath.slice(0, filePath.lastIndexOf('/'));
  //     $(container).find('img').each((_, img) => {
  //       const relativePath = $(img).attr('src');
  //       if (relativePath.match(/^\/|http(?:s)?|ftp/)) return;
  //       img.src = `${folderPath}/${relativePath}`;
  //     });
  //   });
  // }

  /** 加载文档目录样式 */
  function loadTocStyles() {
    GM_addStyle(GM_getResourceText('tocbotCSS'));
    GM_addStyle('.toc-container{position:fixed;top:115px;right:5px;left:85%;height:100%;padding-bottom:115px;}.container-limited{width:70%;}');
  }

  /** 加载项目文档结构样式 */
  function loadFileTreeStyles() {
    GM_addStyle(GM_getResourceText('jstreeCSS'));
    GM_addStyle(`
      .file-tree-container {
        position: fixed;
        top: 102px;
        left: 5px;
        right: 85%;
        height: 100%;
        padding-bottom: 102px;
        overflow: auto;
        background: #fafafa;
      }
      .file-tree-container>input {
        width: 100%;
        border: none;
        padding: 2px 6px;
        background: #fafafa;
        transition: all .3s;
      }
      .file-tree-container>input:focus {
        outline: none;
        background: #ffffff;
      }
      .container-limited {
        width: 70%;
      }
      .file-tree-container .dragger {
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        width: 1px;
        background: #e5e5e5;
        transition: all .3s;
        cursor: ew-resize;
      }
      .file-tree-container .dragger:hover {
        width: 2px;
        background: #ddd;
      }
      .jstree-default .jstree-icon:empty {
        width: 20px;
      }
      .jstree-default .jstree-node, .jstree-default .jstree-icon {
        background-size: 18px;
        background-position: 0 3px;
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABiklEQVRYR+2XvUvDUBTFz30h9aMW3NRBEBycXBxcHEyjoIvg4qChoH+Aq6vtKri4OrTQD4UOnV2S/A9Obk46KthWHPqepDVQNM17oSkVTdacd8/vndwk9xHGfNGY/REKYJZel7mmLapCurmMq6r1dYEAW7XmnBB0DWAvUkHOC3Yuk4+yJhDArLSuQDiNUOgewGpXHxEiECBbazskhNGrx7ODQBhjjq9hjF0CWIsKIQWwrXSgxii/Gf0Amq4/iU6nDGD9CzhvW+mCLMXYALwGNG7elxgXFUBsqCYRK4BnahSb8yyFW4A2VSBiB+hBvMxSKlUnYFsGMRKAHoSYJL3dIMJuWE+MDMBvPrPaagDYF0SuczT9442KBUDW6d79vwlAmnYu273/QYs9AZlxXw+IkTyCBCBJIEkgSeD/JBA2lKqk4M+Nkf4FZrV5DFBRxUBdI05sa6b0XR888XaHS34B4EDdIFRZ54yduYdTj0oAvmin3Fr4AF8ZBmIC7OEul34eVON3H06H2bnq2k9KxnAwHeTMEAAAAABJRU5ErkJggg==);
      }
      .jstree-default>.jstree-no-dots .jstree-closed>.jstree-ocl,
      .jstree-default>.jstree-no-dots .jstree-open>.jstree-ocl {
        transition: transform .3s;
        background-position: 4px 9px;
        background-size: 12px;
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAAgCAYAAABdP1tmAAAC3ElEQVRYR92YS8hNURTHf99AkgwoyYDylSR5FCUZkL4MKOSVR3nlHfpI8o5CDLxTnoUQEQoxEEohE8rAwEBGjBihJPSvdep2nL3Ouedxv9vddbvde/Za6/87++y11j5ttNhoazEe4kATgTnAL+Ae8KRJgVcC+vwGrgInI521QIJ5GgO4AcxrMqhrwPyYppnAHf1XCyQYQcXHZWBxk0CdA5YnaHkBjI8DvQFGBYSfB1Z0MdRRoDOg4R0wIg60HdjviD4FrOsiqH3ADif2NuBgHGgYcBMY6hjqLm1qMJTEHnBiau/MBv7EgfR7pEENdhzoTihII8Z64IQT6KHB/EjKctF/ow1qkONoL7CnYqJlwAUnhpLYLOBb7ZxQYR1rUAMch3qmvUehCO9cQCUjNF4azOf4BK9TUBrUnurvON4MHC6iPMF2KnDf8alsrJX5mDQnrfWZYFB9nQAbait1QTjVQcH0DPh5bzD6ThxpQDKaBNwCejtiVwFnC8KMMZh+AT9aEXUEb704WYBkP9mgejnOlgCXckKpVGhl2gP22iuCeZXmPyuQ/EwxqB6OU/VY19OCxq4PNJjhATtlMcE8y+K3HiD5m2ZQ3Rzn2rC3swQH+hjMuMD8nwbzKKO//44PWex0t7SnQjdDLf0M4EGKs+4G0xGY99dg7mYRFc2pd4Uiu7Q68d2gHjtiJHS6c13HFq8W5c5yoZgL7HAVuv7VoJ4nTLgCLKwiweRdoUjLopTM9sVW4XWN+DN22gzxrAY0J9coCqSgaT3XJ1sp1Y8jwEZHqc47x3ORmFEZQHKl8713Vz9YOt/liN0KHCoCI9uygORrLaBDYJ6hzl0dfOFRJpDEqK+r95Ep9XxVNpCgdKLN2oEfS9lTda9YFUASsSXDfjgNrKlbcYpBVUAK6710uQgsLRum7KSQpG93wmZX8xp/UVgaW5UrFIlUSlexHALsBPTmqLLRCKDKxCc5bjmgfxXAdCEfZQutAAAAAElFTkSuQmCC);
      }
      .jstree-default .jstree-closed>.jstree-ocl {
        transform: rotate(-90deg);
      }
      .jstree-icon.dir-icon {
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA/klEQVRYR2NkGGDAOMD2M4w6YHCFQGR+lfjv/wzVDP//6+JNG4yMB9dMamugRvpBCYHQvKpN/xkYfIk0uJEajoA7ICC3RpmF8d8dIi2HKWtYM6mtkUQ9KMrhDgjJqXBgYGLaT4lhBPUyMk74//ffwbVT2jfA1NLXASBb//8/sGZyu+PAOYCBgYHx31+91VM6L4McQf8QANn675/jmikdB0YdMBoCoyEwGgKjITAaAighQGaDhGATAJsC5r//1VdObb+F4gAQh8QmGVmWMzIwbF49qc0Poz0AEiC6UUqW1eDK/8w/Jsa+dRPanmN1ALnmUqJvcPULKPEJuXpHQwAAMcCgIYq6hG0AAAAASUVORK5CYII=);
      }
      .jstree-open>.jstree-anchor>.dir-icon {
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAB60lEQVRYR+2Wv0sbYRjHv8+lkD/AyaWLRdBJRDLHLUO7hIs/QMSpQ4yxFArmuiRD7jK4+CYqFDpIBrV359CldKpC28WpWwodhEIXoYPg0B++j1z8gT/i2xTf12Twxvee9/v9PN977u4ldPiiDvvjHqC7Ekg/c3otyc/BGFHOBtFOINyijvm5lEAm77xl4EmbwiUdEOcA47OF/qMYfW3T/KysGAi39J97LpWfA9i5hSQs68NtxBR79wFsB8Idu1pzVwCnvrwYCO/FRYjWAMzbhpLAIXpT76r5X2f6rQGkHA1qFWMQ/06gmwDsuYKpwcRB/M/jlo+AmJN+1dtJzzrDVgyfAcR1zwSD6qEoTysB7PmXWTAv6zaP9BjIhcJdVgPknTqAKRMAkmRia6myeyPAfk/8U8/P3w0C+nQDMPhLKLyhSPdGAEYsDpLvdZs34yeshktuVgkgCSkCLRgBAM+EwltTJ2BZRTAnjQBIHghrXkMNQBTFr/31I2DXF25C/SkGJgGsm+gezCKoevNKAAZeEfDUBABJOeHXKpvXAE6OY/jRvEH4BsYjEwAP/tLDjZXy92sA0YKdd94AyJgwbvbFnPWr3mrLv2G0mJkrDErAJmBUJwRbtGcxvfZF+eNV3e46luvsul2t+wQ6nsAxc+rRWrRX5p4AAAAASUVORK5CYII=);
      }
      .jstree-icon.img-icon {
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACeUlEQVRYR82XwUsUURzHP7/ZTboEeQnKQxHuatCxUxEY1CE8aWg7M0l12F31n8jo0iE6Kq5Fkq4bGVQXLwYaURBB0KHQcYO82EEiig4ZzvxiVou11nZ2m1HnNDPvvd/3M9/33u/3RtjmS7ZZn50LkMiPZET0InA8oEvvMDzLSfW+Cdi/1K2iA8nx3FkMpoIGUnAFYihFFMu5kHkVdGxlgPzwACJXAgdR7VaRu8BuYNEQrDkz8yLI+FAAPNc9ZcSMvVCC2AN89MAsWpmn1SBCAyj29M0mCsPtKGOCNKL6SZHUgp158i+IUAF8ocTEyBlBx4F9wFfUMx27d9P1FDqAD5EcGzlJXAsoTSjfBUnN2+nHlZyIBMAXaincPqbqPgAO4u8SkdS8mfafN1yRAfgqR+7dOuqq9xClGdWrjp0dqAfgC+j1eHx19MeK0WrEYl1Af7XV/Vd7/QAy5Vjp9l8BWwtDhzyN+Xt8f00Q9QKocnnBzoyWiyULuTsol7YEoNLcJSZyMwJtWwMAb1W54btQst8zOhC5GURc1lL0/VLfeqegTOgD0ATsCiruet6yEYvNhAVQSXcOtAHkcHmj/+XzdnayeWyoLUqA94anHYjR4IpOCzSW6vu6uH8fJcCi52pnsSf7upT/87nTIkyXi0cJsKSinQtm9mW57S354S7f9vJ3UTiwjMg5x0w/C7IQQwUQ+Owp3dXqe1QOfEPlvGOnA58Tw1wDK6Apx8o+CmJ7uA4oHui1WoU3Fvz1w20tmXCt4sWfgx74L/Hfg2XJkNUTc2afn0038m0mkJzI9St01Vx0/gioMCsw6ViZwUpaO/fXLBzrq0fZdgd+AgglfzDjWCWvAAAAAElFTkSuQmCC);
      }
      .jstree-icon.md-icon {
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABqUlEQVRYR+2VT0rDQBTGvzctCI2u9AjuPIIITbpz48oI/QOC7tx4AKHVC3gBK2ibLuzOvU1A8AZ6BRd1ZY0LpXky1amTkMYgDd0ku8x7M99vvvdmhrDgjxasjxwgdyB3IHcg5IDZe3fVxSSCwtFdfekp7qKyHL/JRGUZ4/H41GuseHpeuTMqU6HQ1MfcasmMWysEYDk+a0mPxEU7CiHFAbRUXhAEZhyAEGK6GSby/gMgNUIQVmfUghChnWUCIImJeWKxgmD+sKPiMpglwBDAroIAsPFbHrIBvskUQNbMcnwpoiB+9MkOgvFQ1Vg6AMYLCGt6k0V7QDarHld9E9uEetOEIcge1Ep92eU6gFys0nndYlG8BHg96YkPmPe9+vKVyvkTQCZ+Q1Bfisv/OAA5bjr+NgHXAFbjIJjRdOvGmR5LBRBdbBbABK472hMkegCEPo+BtlszDqNrzR1AClQc/4CBi6kY4XZQNXZSX0RJF0dSCXQBq/t2DKJzED0MqqXNWX2R6WNkOf7JZ4D2fcN4XghA0mmIPQVpJsw7J9MSpIHNAXIHcgcW7sAXy+r/IZWiKgMAAAAASUVORK5CYII=);
      }
      .jstree-icon.js-icon {
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABqklEQVRYR+2Xv0sbYRjHP18NRegmtGBFkNbWqxZExQsdu7VgRwsdKrjUf0BwNJkEHVxEVBAy6yQdumasPxGh9RUCdepQB13VS56SM0piA6VJziz3Tndw3Pfzfp/v89x7oslLTdYnBvjLAdv2LMqyyHcVmjFA7EDsQOxA7EA9DmTluzfFsV02vk+AtHyXsZ/dbZw9fEqQnwCmbsZ7I0dxNYBJ+W41hNrv79PQ9x8lwK/A2+J1tACJ4LGGcqe283IdszFMy8g6gff340Citb+4a9vyUoiZal/VaB0QKY24dGj7zot3FPQR6VM5SLQAoTJp2oNZPc9dhLdbvWNI6/dTglsV9jGtyT9aCiG+ecO0sNuYEIpfGE+Aal1QWXZpQyNHH0qd4IDe2ktg7CFWER0YKczmlDyett2eZxQSOaQ5lJ/nquUVrSwCXZhtKnk8XgL4DTyqHQAy8l1xqFQs2/Y+AysYh0q6gWrJL++KegCuA0bhgAeXWQ2enNueN0rAAqInFJY2CGxJr132BiR8Js+XKEJY0+G5PgdqkryTy38dyxug8V+viH/Nmu7AHyBw/CHMrSBlAAAAAElFTkSuQmCC);
      }
      .jstree-icon.ts-icon {
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABr0lEQVRYR+1Xu0oDURA9c7ewsBOE4Cco5tFYWSSlYGEldhaiVrFRyK5NjIV5KAjaKYq1jfgFSatNskr8AcsUCtaZkb3JxjUQyWbNo9hbzd2dxzlnZ+5lCWNeNOb6mCwAqmDLKBRhM9Yh/kuBEECoQKhAqECowMQqIKBKP3cEQZItP2kIVN2xCLwA0Kw33vdd4AAQM5r6CwQVXsoagNAuW9Err68q1C4ASrvPBgMgzVwnqZVoKZKvthkDREZWgaebZnxJvzurz6P58Y7M8pfjp0iVBwbQzdxl0GHtOgjn2EocOVvdT4RPQO4htBPoE/QNAKixGUs4/kbB3hDgHECkV3yrRzyr3ynoqYDOpfbYXLzUZuk5onjqGMD2qBTQdUhkq2nFb92iRtHeFMHd8HvAQ1OAR2HkcRh7avfEAYBTx/Y9BT56wHG9AbACYE4XE07BSlSMk+qaKPUwVAAuM6P0usos+0TS4ExsXStQtLMQ6AkZngKeMexWzdvgwQEIpwxFMywq/XP8dkrWQLhm5jfNHEiCVPZfp6Cbnd99YAX8Fuz7IAqaeJD4yfo3HIRB0JhvviwMMOuHUQ8AAAAASUVORK5CYII=);
      }
      .jstree-icon.json-icon {
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACGUlEQVRYR+1Xv2sUQRT+3t7uqYVaRFNZGEiXnTRa+mPWhBSaFEJiGbRRRButBIsk4H8gCBFBbQ1XCEnjr5tEAmkEZddg59WKot3pzs2TOXfjrheFS9Zs4W01xZvvffO9n0so+aOS/aNHoEOBuO5LJkwRaArAwXaImAMviFQ34bI4IKrbOwQ0mOkeYFZ/x9mEwPBNEN/KOdsmgRSLwXeqMrqSxe4goJV4z8BhAL9ezDy3RQVmMs4kgI+eDPv/SiBWghMD5ckw6Eb2P9nGSthQWALwZJh7dGcIegT+awWytWur4F8koeuYITrxdj1N2FwS6mVxmxlXk+ZT84Josogq0ErcZ+C8xTLMc7uCaHaDQLwiTpKmA3B4nIEJAH0/mx8uVIPwQREEmi/E6YqDpQTrKxFWjcECgRuUqfvU1zMmLHhxXKPRd5+KIPD56ZH9e93vl0F8BqBjuUZUPoG6L4mdvtJCkJWjlCTMEii9DC2ZzYZR87k/5lZovsX8MC0hXhvcp5t7Hts7LlfOUvD6iz1/q/uzDtEkVfiGezxaTDC3N4xiJR4BdklBw5XhQLtMV/xhbehN+2xwtHoqfJU4iwAMEXDXleGlQghYEK3EvG5xbfdI9CQNW7zszxgDyjYW/dIf5xZNezI8t2HXG8ddKvAhWUbLWclsrBm4mGvBO7mUWsctJa4Z4DqAQ8lk3Lm1vIjh0w1G79esdAV+AACeckq0Y7nUAAAAAElFTkSuQmCC);
      }
      .jstree-icon.vue-icon {
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADoElEQVRYR+1Wa0gUURQ+d1x1XF9IWVZIDyOjF6Yp+SNxtoez9jAitaSyIrIfURD9KHJs27EfEUEWRBFF2AOLoih0R9OdjYJEzSIUQuxlQVn0wNZtN9e5MZk19667q2tgRPPzu+d833fPOfcwCEb4QyOsD/8N/D0VyKwuzUcYb6Nnwl7W5jEmCKGihqpyj4NU43qZDmaXjo/RTY34pMUZhE/VZZVUqBhRAU4SmwAgRRvc8/jzWZf8frMWwwBXmyzluVpsHr/BhBDs12JBE9jmsNXxyVoMATy08sIvjDJgngmAWuhbdJ9ol3EP5ggiRcloqL5wV8VSjIUJDOB2Ig/B1/Atk8OQXkfBTIqV39fcD3rMAGcRzwGCQm2W8sF1w3GhYyVpDNsaLed/mEo1blDLma89D06OeRS6YHQSdZnLMi+soSpChqTcMumjgoO6PapwqeMKfu/Ko1qRi4BxASg3CVKWaQsvSphGc+Cu3khbnsnu04B6mFll3o0YdJgieGAva0sGQNqqtQIgFwAm+swuG/dMlxAxhcxHZpkvJmbEYwi1CZwkvgWAsVrMWdd5yd3SVUDfjJjwOLZJnx8/j4r5KPPCqIHyvO4BrkbMBgUqqSSH/Vj7C8B4xoAmEDjCN01mUKSOJVqF0DpbVvHFIRlQgzmptBYAL9Qmulu7bjprO1cMRBY8J7ohlBuTRs1Jo40XCMzvDPQHcJKXZ3nmuRXb3QbCBMs8iShKmE4bUzBOu2MsafTWNr+r2CCJRzHATi2B0umqd1R0zNdioXxcS3Bi5CzidhgqrEZhra+Z8Wsg84opAkUFfaFJHNde1SivnUtUnIll7+sL4tPpGFbpjbZkm7qGZUBNNkjm7RjQcaK335Q33SefhgGGEP3Gid1MdEgs1duDVl4o9iXu8xnSiZwkPgGARC3usr2zghvrQheNzaDiX8q8MMmf+JAMGKoOLMcMQ2w87wK4UOZLyv+ogb5nKV4DgFU+iRFY5SyBeLrDnoF+gkW3zbN7e9FjX4RYQem27OL6wdx+SC34vRtKjwDgXV4ETsu8sHWw4gEZMFaZopxM0BsA0FNCzh63bvy9ZXuJvx9/ZvzugYEIOEvpDkC4jHiWAHtsvHDInyB9HpCBvt0gNmOAuT8JW2VeILbgYI0EbICTDuQAMDdUIYwg15YlXB2sKLWwAknryzFI4nUMwMi8kBMoS8AVUAUzK01JuhAG1S4ueTgiBgIV/WMt+CcMfAc2BSAwj1bHaQAAAABJRU5ErkJggg==);
      }
      .jstree-icon.jsx-icon {
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAEp0lEQVRYR8VXsVIbVxQ99612mVQoXyBRJpICVC5SWHTpLDLjxkE2fAGiS+fND8Ri8gEIVk7hBqVMBZUnqYAgJaWlLzBuktGudm/mPu0TD7ErG8YzaEbN6um9c+8597yzhAf+0AOfj4UAng3CNYdxDKCsgTL3GGq/W3NPs4BvXUZ1In4BYFsvB84Tws6vFe88r9CFAJr98JwZZQVu6w2JZOOSAHEm3k5nna7k+fYZF2M3egmgxYwPSqHDjGEKZDmoeit3BpBWc8IJb3a/WeqZDZr9UA7xicAxYUOeK8YBAWvE/NNRbck3a/P2sMHkduD55dhnopdB1bu1Zvuf/8px7Aio0pQZUKJQz2p1sx8OibljA/tkAAmo1a15xQV8n2gAc12y1zcvw1NSOD+qeK2sfe7XgTMuTtzohDATcUnoyOzAZagFG9S8+mcDIFUxsFYoxGth4hRVglMQ3hUid8MI09LM/SjY+mvcIEXHMWFdKtMjGdMyFMskyPeUiXV1xCTVyfcUCfmOOxl1vvpCpgDNfsgA9oKqpydp/pNLgQEgs0xTH8jUwgIjkxGV+a8v0sgtAM1BuM2MXRmrdPMREXrpXMusj5zIrc+3OvUC6UgJhD1KuDzzjdSUFNA+qnqHmVOQzuyBuB4Dh0i4R4p8gIdBdanxfBC2BZihJKvy1DnPiLAvqhcj0+sIbSTYBuExgCEnvGe8RXdAqgbjAODfHCdpWfzJ6Lxipg0iPrGN5ocBf6148jPARcTYDVa9P2Uv4x/mPzb/ukiwnwLRuiDDdZZQUsN5B+BKzKYwccvS+uZF+AgO/rC7kJBbeV2hv1MqpHJtUk7kfjlP11Y/7BDwQrRBzf64B6Zi3pzq30FPQNgJKl4nVbYc/ugmDfR7UHW/szsqVHarnr6Y5j8yypqd6QGA8Jy10KD9OAC8Daret7KHNUG5APS+jPI1BVaFBohFgTwamlutORg/BdObG2pm9f1RrXCcUnCWXuFXTuSu3DInoznCjhbhrEq5ZgvJ3i0RCleKJBfMDKU5iH4E+BkY/xLh9VHF+yVThFZhuqCJegWihqFn5gPSNhB1iLAMoBMT9h2GcF4Mql45Bfkkq6K5jskYHl6PIQ9jIt9h7IqDSl4ggm+c8YYRpe0T0cj4aRXruWW0leIhM/UkjAS1pc1cYREeM6NFpN1TdDVNU8AIQNuJ3I5NSa4VX3uD/qMBMzs3tWidiBgoWs5pY7sAsGoLeB54PoB+qE1IAolwN5kUygpJnYmkqlUAF2BoAJhWWxIjY1b60jG5US6j+aR0Q7xZrdRimlpvQ/i310zBOOdEeO9E7rr8FruRqP5D1h2xdRleSUa8cyAxRpFlUPZNqcExVnIj2X0DySIAcqaEU6FIn8+0kRfVP7bPAg2MewwqdauebrP9kVtPkrBUriVAeB8TNnNDKaF3dwpSt3KceMUYk1X5NBc4cUMiWeoXJYnr3Zq3b8BaTnr3RCSeMClEQ8l6lFCLFJcToKXzP2Ffha5vv5gkXuRLXtC+QdxR8lbE5EuXzC2aJfhPeTW7zv/AYcGJfbsjGdS0wGikjjqKCY17v5rljejnfP7gb8f/A+BZ1BY2mFR2AAAAAElFTkSuQmCC);
      }
      .jstree-icon.tsx-icon {
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADM0lEQVRYR+2WW4hNURiAv7WH5oVIhDLOZXKJhFwiJSQxGkwuefMkDxhnU8gLHsSD7DNn8sCTJ8pxH7ckDpGiKNEkzNmHB6SEca0569feM3POPnP2uThHzYtV+2Wv//Ktf/3/v35FPy/Vz/75D1BeBKzkAsxQ4q+uq0yd0gBWchXwuSIAkcFsD7cVAy8OYL1ejqppQ2RRRQDKuImwFDNwsxBEYYBYxxK0cQmoRWRhZQDqNtCJqGWYgft+EP4Alr0IxUVgkKtUHYBj4QNCA2bwcV+IfIBox3wwzgPDMsLVAzimkgjLMYPtXohcAMuei8JxPjIjpNQ+tgX2/1UF9ApH7QPAnqyueoboRsyQ3fsvCxB9MwvkLEjdP3GehTgM7PDYfMhvvZKdoffOv26AmD0dzRkg7OvcqWlwPr+VcBPUSk5zZRTtGF0PaB73NSMctVuBLR7lBL/Sq9hd/0Vx5PUUjJo4MKHgyR0Apfb6uhfZz4Cab6T1I1DPQSZ3y9VMJVL31ANxHNjosXGVz9+bFFHbKZXs6UrduSMvcgcztM9j/CQwnkhwJpY9GmRTzn6voJU6gZINnpyI5wKUcu5o+gG0pLYiEgM2Y9TGaR79sWDSRpOnQK3v2U/0jUCcSHBd0Yz3A3AUWuzNaDmIMjpRHGJbwLn3/JUHYNlxFGs8ksUhCgG4yfymHq0PgmpAGyPYXvczhyDvCkgoYi9r0QPPAQ1lQfgBuP1DjSESiPdU1D3Qc4mEiyXhC3R6bXcZHvs0hJ9fL/QpNf9I+CfhaWAtwisUw0FeEgnNLlKGHRisoTn4JNuIjiZH0WVcRCSrCPkQ3T2BvMfJjYIxB8U7fv24wq6Jna5c1M5tRKi3oFYTGfvI2c5txa12iC7aUPTUsmuidGIWytq8Vuw+Sk2YwQe9KvmPUSw1CS2XgVDG7r95jD6BbiISvuvl9X+OW17NQAZcyTxK1QN8Q1iJGbzVN1iFB5LW1DzScg0YXOU88BtDr6A5fMPvpkqMZKnFKK4jenGFE9EtJN2IWe9E03eVHkqPpBpRurMiABiKGXLKu+AqDeColjli53a98kb58gCKHaHKvf8A/R6BP/BVassV92+pAAAAAElFTkSuQmCC);
      }
      .jstree-icon.java-icon {
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABcUlEQVRYR+2WMU7DMBSG3x9VYohTiSNwABgotGJrQ4WQmOAMTKh3gCMgMXOESBlYKsW0LEgYMnEBNtZKrdgaVw0EUghxq8RJh2SM7Pc+/+89+weV/KHk/FQBJCowOdwfEKGde3kgrwOJhzoXbhS7WIAwqxwy/twpEEAOf5T8UhXTHeb5r/P/2hVgXIQ5xt29NqQxCDVA0LG8lxCsAtCuwFzu74YrowQJo/zGuNgqcAoWEHwp6c66F1eFAcRLEHV+HEl7D0Rj+N+tWgEkKjC2Ww4gz3J4jEaMi820OIkAH3azF4BusgKAyDW5OF0ZYGQ3dmswHomwkQUCROcmF7crA4SPh93sIZsKfcbFseoAqZZsYreOAHIkSaYK9Gu2XapNL8y+/67ap/SEk25jOwiMExh0AEn19IAQEhCW9+SoEqfehMtuzmOdUoE8kizVhJ+OBZc6E8a94J8SxC2THohFM7p+AHpOrY66Pk2oZtWzonQFZjUhoiEoSGa7AAAAAElFTkSuQmCC);
      }
      .jstree-icon.html-icon {
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADhElEQVRYR+2XT2wUVRzHv7+3rSABokED3ZltaNKZLSgeqMYDFXqgMXR3toZ4Uw/+wYREL0Zj9CLERBNRD3ohBOEAHg12ZyjBeigKGgPloLFxZ9YUujtbDcYYJAq2+35mdnd2S7PLzmua9MKc3uR9v+995jtvf79ZwgpftML74y5A0wRmLON1ATq0nK9Hgt/otr0PF6/ZFKCQST5LzCeWE4CJnktkcycjAfgjxm6WNL6cACR4SBv1vo4EUBju20Yx+eNyAnBZPJIY++WnSADXMsn4LWY/FDPj4FJgiPBO6FtFpD2YzZUiAUwPbl7due6ef0OxYOyNO+4pFQg/k8ww82jomfv7v3t7Jq7cjAQQiIqWMQ9QrGJg2q87ucNKAJbxKoM+qXq4rNteRzN/y0JUtMwiAK1iZxxMOO6BYFywzNMEDKvAAPB129WVAAqWcYlA/dUH4MO64+0Phn7G/JQZr6gAMHgyYXuPKgEULdMBkKolcCrhuHuDcSmTfFeyHIgGQIM13WnddtNKAL5lHmXgxWoC+E533B3RNq2qimlzCoQtwZiAzzTbfUkJoJg23wPhrRrAr7rj9ioBWOYfADbU/O/rjvu2EsDCfkDADcn4qB0AQZ7Vnfz3lQQsk0N9qz5QS6f5sn7aeJ6JjjVmeaIxrr/b28xE1Kdlc7mSZT4ggWvhJDG/oDneccUEkiMC/GVoEiyfjDv5r0qpvn4p5KVmi3XS3KaN2enfZ1JbHhaiXC+7EvRUt52rF6WF3pZ1oJQ2ByTh21DM4KcTtvfF1dS2+2Pi1p/NAMJq56eM3SwazUwwnog77nmlBGZHereWpfi5ESP2aY57NLwvDBuPI0bPVO7L/HlizPuhPreonceEfKhrND+lBDA9vHVTZ2x+tg5A9KaWzX3Q7iAG84s/aObKHV09Y1O/KQHwy/2d/uz1vwBaUzOWAJpk5suAnEg4+QWHEiikewcBMUhE2wEOKmi86uN/tK7199GRyTklgEDsW+Y0A5tbPHWJgXO1n9Kuxoa3qwm4otluT6vk7vhVXLSSkwBvjxJ7aw1d1u1ctac0udoAmB8zMEDAY0uBYOAiAed1231tSQChaSZj7ATELoLcQUxBT1jbYsEbTHyBIS4A8lx31vumHbjyHxNvT+/61R00xBBDBB6qHDPQOEGO35znceNM/nq7TRfOKwOoLB5FexdgxRP4Hy/ySTBuG68BAAAAAElFTkSuQmCC);
      }
      .jstree-icon.xml-icon {
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACQklEQVRYR+2XsWsTURzHv7/LFUQXR1sQnBQUFwcRyl0bsLQ5UYuQzDp3EpKU0iWdhDShIF3aRcEO5TpUkCZxuprTf0BR6FaXOjqUQmnS+5VnjTmTy+Xd5ZU6ePPv9/t+7vve773fI5zzR+esj1CAsmtd9+CNyELmjNq2bGwrLhBgqT453KTECoCHUQp6HhZmxyqFKDmBAIv11CKIsrKFmPGFCLd/xxdyRmVBNjcYwE05AI3LFgG8JJAoA3wnKoQyAA3a3jHwhoC7USCUAYgN+MKZuqbr2hqAUVkIpQBCtOhYV0jHOoAxGQjlAEJ0yZm+3NSPNgDc7wdxJgBCtOCMX7ikX9wEMBUGcWYArQ4qudYmA9MAb+eMarKzsxQByDTsfwCFDhDoK4NvyRjfjlEEIC6cBLEN0uwWBIMyQojAdm8oBQD+265UT90UEABeZo2t1V+HkPsg3RtiQAC/ePnD46usNWwG7gHYZyCTNyq1cIjBAP5cseKUa+hHNgETvvXdY0Ymb1Y/9YaICeD/c9tOJ74PHwjbnwSs9Q7Yy+TM2udgiJgAYseLwlmz+i3M4s5pqORaYonSSrqgH0R/cYER04H28BjshJy4AoDTPm9DlFxrmYEZgD42gUdzxtbPbtv9O2VAB/xOMLy3AM37yr8j4PDvNe/cpooAoh2/MR0o1q2nRHgVX6w7kxnP8mbltdQ8IIbLIV0rhlsqj0fARqPp5eeStV0pgFbQ6QuJbshLdUfqzDvPzfc/etX4tx+ng/y5bO4J/55vMD+FlIAAAAAASUVORK5CYII=);
      }
      .jstree-icon.git-icon {
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACqElEQVRYR82XvWsTYRzHv7+7CPWFghrl7qoi6qIBQXTRpekg9RIdSk1BXFRw1MXJSd0cnBQEEdHFtLY6mujULHZyrf9Azd1JKKJIUezlJxd84nO59yQQb3zu5fv5vX2f5wgjvmjE+ugbYLW4Z8f4mHrKC+D7T/djodH60U8wfQHYpnaMiZ4COPNXdIWYr+t151NWiMwAnjgUWmRGQRYjwiraPJcVIjOAJzpMiNQAXETO2a7N6G+dJQHBCj0h8CFmMkQ2smYiFcBaZd9WdcN9CcYMEc8JCCH62dRuKUQP+oFIBFg3d43/orEqwOV/AkEIu6TdYdDdrBCxANYFIw+XqwDOyg3H4HsTNacr1ilJD4C3lqYckQCt6bz+W90yD2AyZLSqRs2+LK/325ihANZ54wC77QUiOh0z1/eNmn17UIgAwBdz72GX1FcATsaaCqNh1O2pTvrLWkWejiw+4QOwyvpRZl4g0PFER5MALFNfJoUf+0YUdIKIj4CoIkwrrCe6AJ6379yWey/ZazxDDwAIxbARbZrGNSJ+Jn1s5evG5rTYO7oAa+e0oqrQcmLk4oEQAO+WUbMDZbVKegtAXrzqtnlq/zun0ZkUsTgsAGIu9O4Hdllrym4ZCjCMEnjB9HqE16DMtJhYgrhNJrQsESUg0DcQf3CZl1QokwwuAjgYZUyBekUZSi+E3HAhUQaYo1wx1IiSIJj50UTduSmrNE3tIRHdCMtWnCVHWnECxEWjZr+RxaySPgvgdTBT8QeV2M0o0t9BL/SaddVnwyXjOYOvyGsDbUbiQ6EQjHVSeH7TRScLORWz3KZLIOwW76UR9/lAnAEl9UTWtPuylNb50kKkjbybqbQAaXwiq3jqEvia7X85lo/sx0RkY6S/Zln6JunZxGN50gcGvf8H2Qi8MANXG08AAAAASUVORK5CYII=);
      }
      .jstree-icon.babel-icon {
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAD7klEQVRYR8VWW2hcVRRd69yZSaBgaxBNRSomqXOno1E7cxMUH/HDx4dS/Kjij0gVsVQjotJCS1tR9KN+FFpREe2PaGn9kkCggiliKZk709jUOHfaxko1H0GJ1FrsdOaeLXce5Sbz7iTmfu6zz15r7dc9xDJ/XGZ8LCoBOW315F10u3k9+7f6d/bG6M//NBLYFoGcYz2uIBsA3g8gDCA4D1DkLIBRxY7tNI9drEamZQLyy+BNOis7QDwJyK2NFHrnBI4R8gLNZGahf0sEcunYo4rqIwA985ViTohhEZnx7AGF7ryGaZAPCTDk2URwMBCxn71mAnJmcJ1ofUgE0QrVCu8Yt9s7F9plKrbGVcYhUga9M8O0KwQ3lYG8E99E8LNCOslxLbKPwBclwAsKvIdm4ly1criOJcV7mFJh+46WM6Cdge8E8oOXdtfV+0LR1LjrDLwMiFcKaGBv0LRfr1DvDPZr6JNX7eR+I5x4tSUCufTAY4rysGHa2/wX3bSVArEegJuHu77DPDG5MHBZecmeUQE8wj77t5YIVEtpLh0fUuRY4Yw4aITnN1ahUcEPQfaV7v+pqB9gOOUsyhi6jvUpgBeLwbjZMBMfF7r8ZP8KHerYDGKPH0ghdF2tHVAa0Wq8qtvk7L19Op8/UzyVrOqU25BVt2jgGQi8Ebu5fJPAYWXaTzeK3tQUlIO4mfguCHcXmXMMRLeIRGqAzCjiKYZtux6JpgnIr7HVclklxaeyCXVHmc0+wbsmL9XybZpALh3frchd/kAERkVxVCljlH3Hvb2PeU0KQInuZyR1qi0CMnnn9RLq/KmsXijPGUHjCHvGZxcGriAQ1KvYm7rQFgF/7bXgg2DEfqtWQDdjHYDg+eKQ8D0jnNjeVg/IuaFOyV6aLqu/eOVy16r+U38tDCrTsZU6p1IAeovYmGB+xYOMHq37JmjYA/7ai+BAIGJvqgB34hs0+DmArsKAinxl6OArjB6fa6JR67tox5opq89BzE7fP72wF3K5YZBXd7wWeTsYSRZGtZmvbgbctLUNxPuluf9amYmNBYWZ2A0a3ALNYbCoGoAjkK0BM/lNM8Bln7oE/OqV8D4E5k5o3bWFIm8KsLocRIAvDUNt5drx31sBLwqr8bmO9RqAvaWaHiHxPUCv+1f62J8XkT1GJLm/VeCGGfCr9/aL/8FZWEDEiFL5w1w78ce1gtfMgJuOvwTyE39ggYxR1IgCRhhJnG4H1H+3agm0Y42VH5MAdrqujISiyYnFAm1IwHNw09YbWmQyuC757VIAN+wB14m/a5jJHUsJXrMHZDq2hr2p80sNXpPAlSnr7lDU/nHZCPwfwGWM/wAKN4Qwa+TtvAAAAABJRU5ErkJggg==);
      }
      .jstree-icon.py-icon {
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAC4UlEQVRYR8WWy08TURTGv3NnQEwUXwsTMC4IklESY2ILImNS3GmMu9YFxpUL8EHiQhxWsnNkKVH4AzToNG7UxB00WsKjZWGioRJ0oYa40viKRjpzzLSWtNPSmaETne2ce77f/e6551zCf/7oP+vDN0BEM1qzMPdUApchfUjosWU/m/IMkBfGLQAnXASeysCAVxBPAJ3DdxvrftWvAPgC0GeA210gfqw2/G6aGz771c0NTwDd2oM+Ao0BdDGpR++omvERwO5qyRncP62fGQ8EQNXiUwBHiOja8xvREVUz2C0xQImkHu1xi/PkQAHALVnp/+ABHPo2O4cAbKkMFiDAejtXhyY6wdJsNQArE56y/zPwwrTE/foDcyXxZUdwTIufZ/BlAAf9WV4WnUjqsR4zEy6qF/ouYPWSkn5UiC4BUDXDABCtUfjv8vwRlALA7nzTQkmpZQCqdm8HUPcpGHHb8vw1dALY+YUs76PWmVzHXHNA1YzDANIBAeQa0WzvaKNlWu+dOS3mnrr96YQDYCICSLmCqfFba8Wri6FhQXQ9EAAmvgpLvCLK/lwPsHgYrS6GIoKo4oY24ADFkno0nrtOS+GWrMl714MgFtuZrEOVdl5Y4xMgL86Z0GkGDTLQXeMRwRcACanp2bmbzRZ4EsDWWsXt9aZpHalvX5hzFOHDFsB84xRI6jHKZkJjBOoLQjx3DU15F7XP5K68oxHFXzpnvQ1gt1MGIoEACBqQ2uZHK3bCo0NGl7DwBISdhYDgAHgBEJOSMj9YvJGyWdB1xdgsNuESgU7agXY7reZA8XluxCFP7wGXI/hGwEIlcaGkgnmQbKQGCEj8cwBJSZH5OnwBjNuBAni5hgSsCCXVzEsdpyyLHzN4XFbS/W514akGONMR8tSImJdBtA1AgwAdJ2Xedbp6AsjNAI+t2H5wEHik+NVTzQXPAIUk1YaRLNE7aku9dbO9ah/wsziIWN8OBCFanOMPpr9DMKhoTigAAAAASUVORK5CYII=);
      }
      .jstree-icon.pyc-icon {
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAC0UlEQVRYR+2WT0gUURzHv2923665JEp/1CIQU1qTwBQNK8iJDhEEeeggBumlTsFeHizTwfGQiDt6MILCQ4cKLIOCjh12ozBytxBC0LokQgoShrmkszv7Ymxn03XbmckxCXrH935/Pu/3vu/3HsE2D7LN+ZEXgDF2kHN+wCqkoigRq7aGXU4ASZJKE4nEEIDzdgJyzrsVRZHt+OQEYIwNArhmI9B7AEd0e7sQvwMIA2ixCsA5Fwkh/QDq7UI4BkAp/ZxMJu8BaEpDyIqidJttwjEAXYDBYLBC07T7AE5YrYSjAHpSxlgZgGEAp6xAOA6gJw0EAsWU0hEAZ8wgtgRATyrLckE8Hn8C4Gw+TWwZgCE+xpgOcQFAJBQKidmidATATOnp9f8A/2gFQqHQpp5sxhjflAb+BOA4e1QnCOgCIcVFfLHFjST28bnY7b6uRtu3QH9oLKo8YxZz198sgBpbQmGHMUmRWA73tu+wDWA3+SLZiSmhCl6+gjjxZblr4qvetnWfFsf7gA5gDBUefBQq10BoYvhyP2hNLANhCmD1CN65j/aooM35K6aJLzoG9L/GJ01Dq6c2Om4KYEWEJ4MPZYB05UtuaECbbFy9FQT8qeCPtToEMBIGeOYH5cUKvFzN8Bi34FbnsyEQcucnACKCPyqaAlgR4YTgh3H2FakZNO3+gNN10/BSLeNeWrKk+gqSHmPCUYBJoRoLpHg1drMWhdQ2iqLCXxXItYkU5920JiY7UoEl4sOUUA0VFO17n+PKuXGzwj1w+aOX0kex0ZYxpjeQu2ZRstf1Y6grm1kHMBw5jPgyRdX+hUGxYXaAVI5Or/XLWYH057IPwEW7EJXlXzdUYPaLb35Pyfc5D+FXSc3Ya1MAw0CSpHJVVQ/ZhejpfPnY5UrtyvgRLhMudAr+sQpLrdhuwmx7daLhmNslXAdgtMVvSS11w1P79s1fAbCzgR9rSGcwHrz1LgAAAABJRU5ErkJggg==);
      }
      .jstree-icon.excel-icon {
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAC/ElEQVRYR+2XaUgUYRjH/zPu5R626i7NuhJrYhmEUUFKaHlQ0kFsXzrUyqK1KAgT6UBDkjCIspOKJDTNSokOIYREqAzpwgo6pBAlqiXFVtJS1J2JmWoZdfSdkTUJmk/zznP9eI6XZyhM8kOR4jvKXZkUhU0kPbHcHM5E0mp1C8mGo6ljRICIclc7KMpKciaWm2wWqHVaOSZtZICKLE6Op3EC4D+AkAFzfqKT42i1VKqNdqaaVAI6IAAqfaBPTUEPgDIfSC4Fx2WSgpDkBhsDTZBJUFMGkJ+kuMkkYboHoQ+1QBthnRwAtrMXbGsX9ElRMDBTh5RkrOxR5mEZiI+Y49P/2NWONo/bd54eYkfYFIvv/LD1pe/d2/EdA287oFvkgCHMBo3JSKqaIB8BwH+8kn4Iy6IX4tare9hcVehzdC2jCKkz41Db3Ii0yvwhAfwKMM8ejfrtZ4UAzrJc3G9pwsb5y3HSmSt8Szm/A02fmicOgPecnbAeBUtdqHn9ANk1xajLOoPI0HAcvFuCEw1XR6TXrxn44/15TiUcwTbk1BxH8ardQj/MLU6XrO2EACyZEYvqDYfR0eOB1RiMNRX7Uffu8d8DWDErHpfTCvGjvw96jW5MAO5zD7zP3DDG2NHP6Dysjg6WMwaSU8Ab6lQavNt3Az39vTjXeB2FqdvGLIEYYMCqhdcQICe+9BjylkdW7oIr1omi+lJcfHIbDTtLEBZkHbUJ/QrgnL0YpWsL4O7uRMzRdRhkvchNzEBeypZRx9BvAIwpFLVbT8ERYsPeO6dx4dFNXyrf7KmGzWSRvIj8BiC+isVXLU8hlvFnsdxvALI6R0JpOIAcP5yKej/qFMhxINYRAyix5QHKAGVrt1QA9sUXsB++CfeAkufXSpaXvJqjOcmVjH3qriI67B0E5+mDyhwI3bQQorpYgbgVmxOiZG1MtFYFDROkKDivTARgMmJlASiO/NvgXwBY0A4o+zWTnQ0OX8kZSIvLBM0p+jmVDcBSl4gAsp2NU/En8KpFTzjWlHAAAAAASUVORK5CYII=);
      }
      .jstree-icon.word-icon {
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADZUlEQVRYR+2WfUxNYRzHv091pTe3oveRiKWk0rwUvWj9wbAyW1asMn8oUlN6mcn80YxhZKGiUuSlRjb8kV00rTfDiulW0gulLm666XYrdY6dc3evrqVzb53NbH7/nLPz/J7v7/P8nuf3Ow/BXzbCFT+w+Gs0IXpRXH7TGadpqpATYENx32cAVtMJoMWcPm0AaC2Epu3yH4DNgH24KJQiRDBZHh1WOpVw5dfA0ADGlqZcbpOOE9uIxwUAoqc1e8Ike09HCB0sdZZhAHg5ZPr0F9i5WcPMyVMnCN4AMNINPXkDbINipwQgwDhF0VJ6fFxGU+jXAPBdZsFOrhZ/m1JE5TfRl1Z0gZbWwcp/aoDfhTUAmnL98Vk2Av/kOrXftUMeCPaai7SCZhSKutnvu4LscWqPC0oqe5CQLWa/8QKQG78cW9dYI/jwc7ztHGSFe4qD2GdpZS/isxvZ96MRzojdvACJl8W4WdHDH4BqZSrhUB8bXIpzQ7d0GMOjFDalv8B3xRhupXkiwN0Svok1aJco+APwXiLEg2PeuFL+EelF75Ad54YQHxtcf/KJTXv4yXpUvO5Da14ADAV6mB/5VL1VvGyBhakAjTl+qBb3Y3vGKzRcWI+WbjnyH3Uh/6A7Tt9pR1m1BFVn1qK+bYDNiMp4AWDEas/6QGhigH1ZjbiR6oEjRS3IK+9iz8LTBinKaiQ4H+PKZiU5r0kNMCbrwPCHZzB1j5xZH8iMcUWYny2y7ncibqsjfJNq0N6rQHGKB7ydhbhXI0FUsINGVTAReQNICFmItLBFeNk6ADtLQ3gfqNIoPaY63BxNEZhah+YuOf8ZYMqQKUfGMu914ERpmzqIqiSZcxGQ8qtX8JoBZnWi46vZoOuSatHWO6QGKM9YhRVOZrhb1Yv9F5U9QWW8bYHRLD14LZ7D6jLVMNGULVj57/p9jDcAnY7wxAz0t0HRLoKxyw4tJWgZQIS8/Q1/SJshb76P2Y4btQRQuhHbcNFVEDLja/fQ+3KMSt7oDsBQ2O18vI2mqEmvZPKWh7e5lkSNDGB8sAf6JnYQzPPgctcY57wVm7ju1urGRATGMDBfqlNwdgu4ZpgHZGoFwKXzp/F/AkAGQNkY+LcBzgxYBJ7bQtNkLwFR3jx4Mhq0ESF0DicAT/H+KPMTQ6qNncc3KQUAAAAASUVORK5CYII=);
      }
      .jstree-icon.ppt-icon {
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADXUlEQVRYR8WXW0iTYRjH/883t9LNrSgPc25FF8sOc0rRSdK7DheFFdZFUHZRXVi0rYgKLDOjwsiLdEQXadBNUCbZCQKJpgUdpxVUVNgROswy8QDN741vtTHXt+97twS/i118z/P+n9/zfw/fO8IYP5RM/W/bluSBYT4IecQo22SzzdTodI/B8A4CujD0y0d7TvfyaHMDBLYvNzKRVRCx9QBmRYubLJZuzfjUqTEFWwE6Q+76FiUQLoBAxVIXCFUATHJi6WZzvzZNr49T6BaAfeRuuCsXVwSQuiYmnmVAqVIXhqxs6AwGZccZ85DHWxebFBfgq2upmYK4SkCh2lxyAUgiREfJVb83Wi8EcGextXRYELXhAJEgmHPM1YJGY1crLsXTMzIxyZrLkwoQDpCroTpSq6PE0sgYlfONjp9lnzsHGbwQYGXk9l4ImdJenMv+t7g0/iONg3H6DCybMUVdjvABos5OnrrBUQW4JxhxfOUidQApg6GGPA2VsgCmgoVxRXr9srsp5EBCAKAeuE5OlgWwlrth2+SRhfh87TxeHdv1TyxxgJAL6xQBpG7fN/7ZusbCBbCUbYZGn453TSci78MkSQEAp+UBNrlhK/dAAni6Y22k21m15zBhXgkCt6/jeeWWES4kCfBA1YFoAGscsPAuSGwNhDZhDzeAtDCnuWuQNtU+mlMgfw4oLcKA7wa6vTUY+vR2xBS8GRLR9j2InY4cvm34N0vVgbDaQPdL/Oy8h29tl2ULJAnAPwVqbSUJcF/VgehFqASRFABjp8YaYI3qURzv6I11I1EHGPAlv9mfNWofo8QBaH9+8+NDYwXwena+305VEKm92NoEsI1qq1wt7usN4sWAyHcOMLbCcanzSugslH58JbmriLHIlax/WNR2DeDIYJBZ1QpL8b5hhq+/GOymVKywTVQeQtjtuOivDSfFvZQWTU7LKcgwtpl0KdN5IDJTtSjKMmK8RvGiXeVo9h+M1lP9X/BkdcFZABt4IJRyRKDC2ez3xuaoAkgDnq12bhVBhwFMSgLkJhOFvfktjx7KjeUCCEGUzTQEg7odGsIGBvBc11tEEs84L3a1KkFzA0SLPFvjLBQhLCDG7CKQSQwpjPCDAOkT2akN6m/nXe7o43ErKQAeYd6c38btefV3nA6/AAAAAElFTkSuQmCC);
      }
      .jstree-icon.exe-icon {
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAx0lEQVRYR2NkGGDAOMD2M4w6YPCFwJNAaWGGn399mRgYfRj+MwhTI40wMjI++PPv3+pff34eVd7z/iOymRgh8NRTKoeR8f9kaliMbsZ/hv+N0tteNOB1wDNPyf0MjAwOtHAAIyPDVcmtz3XwO8BL8j8tLIeZKbXtOUqoY0TBs0HjgP8MB6gaEtBoJT4E/jMckNr+3JEajkBOV6MOGA2B0RAYDYHREBgNAcIhMNANkgFvkg14o5Qa9T8pZgy+fgEprqeG2tEQAAA3R8ohhHaA1AAAAABJRU5ErkJggg==);
      }
      .jstree-icon.zip-icon {
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABGElEQVRYR+1XOw6CQBScJzcwsddWOYT2WGDiBbyGFhRaeRNJwMTt9RBYa61nwGeIn6xg2CWuWROhZZk3O2/YN0uw/JDl+qgJvFUgEt0lQBMCmiZaxOAzgUIwhf4w2cmYBQJr4a4YPDZROI/BoNnISxalBCLRPRGopSAg76JfgezR9/adUgKx6LESkGnwkFJrvQToe/sX1Qst0AK0TgB4tsBpNII05dtGiLcq9cwo8EbSeOP2/4iAdQ/8AoHMBo5DnF4ugWQJ5ZlQm9CMAkwDuy34BRPanQX1SShPnLshrQ0j1fTLvzfzG1atWjGQHAC0P6hR9qk6kkXCnRJ4/g0CWqH0HizGWTLWCKdaPCvFci1Eg4vqq5l1Ba6IptAhKJ2LDgAAAABJRU5ErkJggg==);
      }
      .jstree-icon.csv-icon {
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAy0lEQVRYR+1WSQ7CMAx08rL2GHFNv9DyC9pf0H6huaIcKR+LUSKlAgFZTq6QfR7Zo/F4ZAHEJYjnAxM4hgKdHTDlhVXNO9EcFkG0Rl03368EGxrngEzg/xXQt34ECQjuey6Y0zJGkwZsqqTcoglLsMc4Q8o4Dgpo219SJIxapp8r8Kt7K/l4yYF7qi+CmDgHWIGoQNIsq5rbaKbODlljVZuQ/AzJCZTmgLbnBpxrdsIfGQBQmxlVV+AJCMCcX6qeFybACvA/wAqQK/AESEbytzs/8f4AAAAASUVORK5CYII=);
      }
      .jstree-icon.css-icon {
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACqUlEQVRYR+2WS2gTURSG/3NroHbyWEhBKApuRFoQURGFCsm0hS61hUIzqdJqUYpu3Yi7broVRNSCYpOJBARdScBMQsSFborga+fC4sJHQdNMA8nMkViaTNLMTEoTs2l2mXvuOd/9z5n/DqHDP+pwfewC2Cogx9amAHrcjhaZZPRmwv6f5dz2AGp+Hoyb7QDQFKlS1xYgpOppYg62HIDxSYtI/Zt5HVqQ55YX39D8oRaWZhwBhp4UDrNhTMI0q4BCbABtPiv/t67b0XaJK2DsrywTZrWwtOiqQCtOH4rpYwR+as1FbA6kIr6P/wVgSNUXmPmGFcA6gLZvQXkAW6HAvwLWQWZ+p0W8x2oUqS80nFgNmMXurwD7WgVhybOoKdKsI4Ac008B/KYNxUGEq6mwdM8FoH0OyEbpdPpCoOZwW3ygbf0H4PGU9iUnAquOCrRK+gZO+k1TpL76/G27juVofgWESkECnqcU6ZwjQHAp19D7M1O+zHaUOZvI9XqK4nvdnluaIs07Ashq/jIYD6pBpHs8xQP1fXODaeSADB5NK96kI0AourZARFbnWtYU6bhbQet6MMHertL6HDMvVJ4zdDKMg6mL/l/OAGr+BTFGtwbRbYNKdzNh/2c7mGF1fdCAOUKMEQBnauPotab0DDbaWzOEciy/DqDb9sSEZZjmfbPofZSZpkJQ/XOE4DlPbIwDdMJuHwN30op0zRFATuh9KPJK83LzB4AGmoqvu4JtfaD8FgghrgMYayqxc9BbgLIgzoo9PdmXE/TbtQXVoWGS4/olMMowR5uGYX4PomdgfmUWf2Qz04cKbntdjWgomutn0TUD5jkAe+sTMuMLCHGCmdQUX9at4I6cMLSUGychyt9zJwGOsxDx9GTPjm5OVwW2e6Ltxu8CdFyBv4Ex9iFI51nCAAAAAElFTkSuQmCC);
      }
      .jstree-icon.scss-icon {
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADtElEQVRYR+2WX2hbdRTHP+emK9Uh65qbTjZFXzZ0wl6ksg5cbhgOh52KL760ODdWEAQRpyQ3hXaQ3GTsZWMvOhX/DnxS2cbqn7H8qkUKThFB3EQpTKq2yZWpT9LlHrnpwkptlpt0MAQPBBJyzvl+fufc3zlXuMkmN1mf/zbAd5vHOm9fN79bVfsIPyJ9QKCKL1ABnVKx3kmY/PlGlW6rAv727J0aC4ZQaxD03uZt1BO2KQwu59cSwOyD7paYpfsQGQLWXksoZ5Hg0xixC1fgYqKUuzibzPR3IFtVGAXWKDKYMPkTSyEiA1RSmSdAjqGsD5MojIOcFItT9rn8TKMqlFPp+0Wt86DGNoVUWwBlxx0TaicJ7bKiBxOmcKR56Rc8Ko6rbQNUUu5M/dTAhwEc7DXeN1HFfeelO5SOn9sCqDju98A9oVgAI73Gy0cVrvuVncxhQQ5YYj3SU8qdidyCiuO+Aeyp9Vt1ODFReLVV8Tkn/bCFNQ58aRvvgci3YM5x91gQAgCSsU2+2Kp4xcm+CfoUhDNBBuImPxUZoJLKvo3qEMLX8a6/tsn4sb8XB4c3wi4V3l8uoe9kt6J6SIXtqjoXk9i+HpM73dIgqjjuNHB3owfHdzKHVVhnqfVFVZlR0bgFScBZiKvZ0Y7AOtr9WS7M1dCWnQMVx/0AeBzlT3vCW7NcdDmVHbZUBxE2qLIB9AdEJhUmY7HqZM/ZQ5eitG1ZgGvDA1T0sUSpcDJKsnZ8Gk5C33FHFcZEuBQveXe1kzxKzHVHcR0CmLKN1x8lYas+TXeBnxzZrwRFhJ6AYGOvKf7YqkjLD+HSgEoy3QeSQ2SnqO6NTxRqM6K8I7Nplcaq3edyP7UL1bQC9cS/7TywetV856gqL6ryrQhbFoleEHivq8rx1Z97v7YCEwlg2hnruo35LGha4ePafpDgyVuvWL+EgnNJd5dl8bQoGy06U2vN2OWoEE0B/B2ZzVq13gXdFMCzKLOWcMY23r9ir67tLtt46RsCUHbSjmCVFKYh2JswRVPfE0qQCn8vFfId93TceAMrBqiLh4mEYFfcFD8Kv/tJ9xUVhm+psn5pv/2k+3z4CmYbr3vFAL7jHlF4TuG1hPH2XxV/SIVPgFO28R5dLBK2iir9cVN4Par4wuEaWMXJlEAcRZ5JmPzLftINxY+Hy8bC2n29DXdDAcKNWEuosg2hEzRjm0LL7weNoBpW4HdnZCCg+oIi9wF/iDCuBG8lSsWvWjlhM9+m17BZgpX+/z/AP+36dDBeqo7FAAAAAElFTkSuQmCC);
      }
      .jstree-icon.ejs-icon {
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACUklEQVRYR+2WO2gUURSG/39XtLYTS0VnoqZxM5MHRhAMKSRaOal8dLHUQrCytVTEQq18VCYgKMEiKojZwp0xFkvi3lEUBR+daLEoJLtHZvaBMTtz744LKcxt7znn/+5/z30Q6zy4zvrYAPi/HJDAOo/l6jWOfPrZ6j1jB6RkHedgOJO1aaXcvxW/lr8B+AHIRbrh1aiWEUAkDnIa5AydipcFQnz7EoALsair2rpagLZ427PuIaRobcdmfo5L1DHFIXXTaAvWiGeEEN+6DPAsgEW6qv9PBxMdSBRvZN9HddskDz1b0W2HBLt2QPLv4jjyJJ3KXS1AqrjII3zf4nG8XNWJR/NSsq+DmAIQ0FXu3zlrHEhfuTzFyiaPI0tRN2uH+Hv2AvXFOFDE63SKVgGkr5xF5OFxoPJVq9wMEN++BeAUIPN0w4Od8toAmj0PUIPHYfXBWHzBLqCGl3F8HhMsqNlEgPSVo4yceHTC0FQ8dty37gH0QMzRUeNJubEDvQaQF7sPIJebb3b+GJ3Kk1QALQTQ1RaIbz8AcBTAQ7rqWJpzPW9CCfoOQ+RxLFqvj3LoTdEYQO+E/hiKb88BGANkmm44qeubjjdh1otIfHsisr3Z+QMsqIVMAHonOl/F4lvPAY4CuE1XndaJR/Opr2E3j9Hq2Nw+uq+X/hmgoxMJfwLxbWlcubjBQXXGRFzrQKuI7kMiQd8JiNxpnPvaTjpv3/cUoOVE0pdMSvYsiCMgr9CpnDMVN3bApKC8socB+cj94ReT+FaM9kvWTbEssRsAGw78BqlrBjBEv22nAAAAAElFTkSuQmCC);
      }
    `);
  }

  //================== Main ========================
  async function main() {
    const repoInfo = checkFileBrowser();
    const mdInfo = checkMarkdownFile();
    const commitInfo = checkCommitViewer();

    if (mdInfo) {
      const contentSelector = '#blob-content-holder .file-content';
      const container = $(contentSelector);
      await renderMarkdown(container, location.pathname.replace('blob', 'raw'));
      fixImagePreview(container);
      !inited && loadTocStyles();
      addTOC(contentSelector);
    }
    
    if (repoInfo && checkToken()) {
      !inited && loadFileTreeStyles();
      addFileTree(repoInfo);
    }

    // if (commitInfo && checkToken()) {
    //   beautifyDiff(commitInfo);
    // }

    inited = true;
  }

  main();

  // SPA 在页面切换时需要手动运行脚本
  let oldHref = location.href;
  new MutationObserver((mutations) => mutations.forEach(() => {
    if (oldHref !== location.href) {
      oldHref = location.href;
      main();
    }
  })).observe(document.documentElement, { childList: true, subtree: true });
})();