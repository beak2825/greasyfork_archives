// ==UserScript==
// @name         Discourse Comment Extractor | Discourse 评论提取器
// @name:zh-CN   Discourse 评论提取器
// @name:en      Discourse Comment Extractor
// @name:ja      Discourse コメント抽出器
// @name:ko      Discourse 댓글 추출기
// @name:fr      Extracteur de Commentaires Discourse
// @name:de      Discourse Kommentar-Extraktor
// @name:es      Extractor de Comentarios de Discourse
// @name:ru      Извлекатель Комментариев Discourse
// @namespace    https://github.com/discourse-tools/comment-extractor
// @version      1.9.0
// @description  Advanced comment extraction tool for Discourse forums with modern TailwindCSS interface, smart filtering, email extraction, and data export capabilities. Author-only access with API verification.
// @description:zh-CN  提取 Discourse 帖子下的所有评论，支持楼层范围、随机提取、邮箱提取和数据导出功能。现代化TailwindCSS界面设计，仅限帖子作者使用，API权限验证。
// @description:en     Advanced comment extraction tool for Discourse forums with modern TailwindCSS interface, smart filtering, email extraction, and data export capabilities. Author-only access with API verification.
// @description:ja     Discourse フォーラム用の高度なコメント抽出ツール。モダンな TailwindCSS インターフェース、スマートフィルタリング、メール抽出、データエクスポート機能付き。作成者のみアクセス可能、API認証。
// @description:ko     Discourse 포럼용 고급 댓글 추출 도구. 현대적인 TailwindCSS 인터페이스, 스마트 필터링, 이메일 추출, 데이터 내보내기 기능. 작성자 전용 액세스, API 인증.
// @description:fr     Outil d'extraction de commentaires avancé pour les forums Discourse avec interface TailwindCSS moderne, filtrage intelligent, extraction d'emails et capacités d'export de données. Accès réservé aux auteurs, vérification API.
// @description:de     Erweiterte Kommentar-Extraktions-Tool für Discourse-Foren mit modernem TailwindCSS-Interface, intelligentem Filtern, E-Mail-Extraktion und Datenexport-Funktionen. Nur für Autoren zugänglich, API-Verifizierung.
// @description:es     Herramienta avanzada de extracción de comentarios para foros Discourse con interfaz TailwindCSS moderna, filtrado inteligente, extracción de emails y capacidades de exportación de datos. Solo acceso para autores, verificación API.
// @description:ru     Продвинутый инструмент извлечения комментариев для форумов Discourse с современным интерфейсом TailwindCSS, умной фильтрацией, извлечением email и возможностями экспорта данных. Доступ только для авторов, API-верификация.
// @author       dext7r
// @license      MIT
// @homepageURL  https://linux.do/t/topic/705152
// @supportURL   https://linux.do/t/topic/705152
// @icon         data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgo8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojNjY3ZWVhO3N0b3Atb3BhY2l0eToxIiAvPgo8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM3NjRiYTI7c3RvcC1vcGFjaXR5OjEiIC8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPGV4dGdvbiB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHg9IjIiIHk9IjIiIHJ4PSIxMiIgZmlsbD0idXJsKCNncmFkaWVudCkiLz4KPHN2ZyB4PSIxNiIgeT0iMTYiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0id2hpdGUiPgo8cGF0aCBkPSJNOCAxMGg4TTE4IDE0aDZNNiA0aDEyYTIgMiAwIDAxMiAydjEyYTIgMiAwIDAxLTIgMkg2YTIgMiAwIDAxLTItMlY2YTIgMiAwIDAxMi0yeiIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+Cjwvc3ZnPgo8L3N2Zz4=
// @icon64       data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgo8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojNjY3ZWVhO3N0b3Atb3BhY2l0eToxIiAvPgo8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM3NjRiYTI7c3RvcC1vcGFjaXR5OjEiIC8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPGV4dGdvbiB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHg9IjIiIHk9IjIiIHJ4PSIxMiIgZmlsbD0idXJsKCNncmFkaWVudCkiLz4KPHN2ZyB4PSIxNiIgeT0iMTYiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0id2hpdGUiPgo8cGF0aCBkPSJNOCAxMGg4TTE4IDE0aDZNNiA0aDEyYTIgMiAwIDAxMiAydjEyYTIgMiAwIDAxLTIgMkg2YTIgMiAwIDAxLTItMlY2YTIgMiAwIDAxMi0yeiIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+Cjwvc3ZnPgo8L3N2Zz4=
// @compatible   chrome >=90
// @compatible   firefox >=88
// @compatible   edge >=90
// @compatible   safari >=14
// @compatible   opera >=76
// 
// @match        https://*/t/*
// @match        https://*/topic/*
// @match        https://*/topics/*
// @match        https://*/discussion/*
// @match        https://*/discussions/*
// @match        http://*/t/*
// @match        http://*/topic/*
// @match        http://*/topics/*
// 
// International Discourse Sites
// @match        https://community.*/t/*
// @match        https://discuss.*/t/*
// @match        https://forum.*/t/*
// @match        https://forums.*/t/*
// @match        https://support.*/t/*
// @match        https://help.*/t/*
// @match        https://talk.*/t/*
// @match        https://chat.*/t/*
// @match        https://discourse.*/t/*
// 
// Popular Discourse Instances
// @match        https://meta.discourse.org/t/*
// @match        https://try.discourse.org/t/*
// @match        https://blog.discourse.org/t/*
// @match        https://developers.discourse.org/t/*
// @match        https://blog.codinghorror.com/t/*
// @match        https://what.thedailywtf.com/t/*
// @match        https://discuss.pytorch.org/t/*
// @match        https://discuss.tensorflow.org/t/*
// @match        https://discuss.atom.io/t/*
// @match        https://discuss.brew.sh/t/*
// @match        https://discuss.elastic.co/t/*
// @match        https://discuss.circleci.com/t/*
// @match        https://discuss.gradle.org/t/*
// @match        https://discuss.kotlinlang.org/t/*
// @match        https://discuss.ocaml.org/t/*
// @match        https://discuss.python.org/t/*
// @match        https://discuss.swift.org/t/*
// @match        https://discuss.vuejs.org/t/*
// @match        https://discuss.wxpython.org/t/*
// @match        https://discuss.yarnpkg.com/t/*
// @match        https://community.frame.work/t/*
// @match        https://community.fly.io/t/*
// @match        https://community.cloudflare.com/t/*
// @match        https://community.postman.com/t/*
// @match        https://community.render.com/t/*
// @match        https://community.spotify.com/t/*
// @match        https://community.openai.com/t/*
// @match        https://developers.google.com/t/*
// @match        https://forum.arduino.cc/t/*
// @match        https://forum.gitlab.com/t/*
// @match        https://forum.freecodecamp.org/t/*
// @match        https://forum.manjaro.org/t/*
// @match        https://forum.endeavouros.com/t/*
// @match        https://forum.kde.org/t/*
// @match        https://forum.snapcraft.io/t/*
// @match        https://forum.unity.com/t/*
// 
// Chinese Discourse Communities
// @match        https://forum.ubuntu.org.cn/t/*
// @match        https://forum.deepin.org/t/*
// @match        https://bbs.archlinuxcn.org/t/*
// @match        https://discuss.flarum.org.cn/t/*
// @match        https://forum.gamer.com.tw/t/*
// @match        https://community.jiumodiary.com/t/*
// @match        https://forum.china-scratch.com/t/*
// @match        https://forum.freebuf.com/t/*
// @match        https://bbs.huaweicloud.com/t/*
// @match        https://developer.aliyun.com/t/*
// @match        https://juejin.cn/t/*
// @match        https://segmentfault.com/t/*
// 
// European Discourse Sites
// @match        https://forum.ubuntu-fr.org/t/*
// @match        https://forum.ubuntu-it.org/t/*
// @match        https://forum.ubuntu-es.org/t/*
// @match        https://forum.ubuntu.de/t/*
// @match        https://forum.manjaro.de/t/*
// @match        https://forum.opensuse.org/t/*
// @match        https://discuss.kde.org/t/*
// @match        https://forum.fedoraproject.org/t/*
// 
// Japanese Discourse Sites
// @match        https://forum.ubuntulinux.jp/t/*
// @match        https://discuss.elastic.co/t/*
// @match        https://jp.discourse.group/t/*
// 
// Generic Wildcard Patterns (for discovery)
// @match        https://*.discourse.group/t/*
// @match        https://*.discoursehosting.com/t/*
// @match        https://*.discoursecdn.com/t/*
// @match        https://discourse-*.herokuapp.com/t/*
// @match        https://*-discourse.com/t/*
// @match        https://discourse.*.com/t/*
// @match        https://discourse.*.org/t/*
// @match        https://discourse.*.net/t/*
// @match        https://discourse.*.io/t/*
// @match        https://discourse.*.dev/t/*
// 
// @grant        none
// @run-at       document-end
// @noframes
// @require      https://cdn.tailwindcss.com/3.3.0
// 
// @tag          discourse
// @tag          comment
// @tag          extractor
// @tag          forum
// @tag          data-export
// @tag          email-extraction
// @tag          csv
// @tag          json
// @tag          tailwindcss
// @tag          modern-ui
// @tag          author-only
// @tag          api-verification
// @downloadURL https://update.greasyfork.org/scripts/538494/Discourse%20Comment%20Extractor%20%7C%20Discourse%20%E8%AF%84%E8%AE%BA%E6%8F%90%E5%8F%96%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/538494/Discourse%20Comment%20Extractor%20%7C%20Discourse%20%E8%AF%84%E8%AE%BA%E6%8F%90%E5%8F%96%E5%99%A8.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /**
   * Discourse 评论提取器主类
   * 使用现代 JavaScript 类语法和高级编程模式
   */
  class DiscourseCommentExtractor {
    constructor() {
      // 常量配置
      this.config = {
        emailRegex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
        storageKey: 'discourse_extractor_history',
        maxHistoryRecords: 100,
        initDelay: 2000,
        permissionCheckDelay: 1000,
        loadingTimeout: 30000,
        maxLoadAttempts: 30
      };

      // 状态管理
      this.state = {
        isInitialized: false,
        currentUser: null,
        topicAuthor: null,
        hasPermission: false,
        isLoading: false
      };

      // 缓存DOM查询结果
      this.cache = new Map();

      // API管理器
      this.api = new DiscourseAPIManager();

      // 权限管理器
      this.permissionManager = new PermissionManager(this.api);

      // UI管理器
      this.uiManager = new UIManager();

      // 存储管理器
      this.storageManager = new StorageManager(this.config.storageKey, this.config.maxHistoryRecords);

      // 绑定方法
      this.init = this.init.bind(this);
      this.handleExtractClick = this.handleExtractClick.bind(this);
    }

    /**
     * 初始化提取器
     */
    async init() {
      if (this.state.isInitialized) return;

      try {
        console.log('🚀 初始化 Discourse 评论提取器...');

        // 检查是否为 Discourse 论坛
        if (!this.isDiscourse()) {
          console.log('❌ 非 Discourse 论坛，跳过初始化');
          return;
        }

        // 等待页面加载完成
        await this.waitForPageReady();

        // 加载样式
        this.uiManager.loadStyles();

        // 检查权限并创建按钮
        await this.checkPermissionAndCreateButton();

        this.state.isInitialized = true;
        console.log('✅ 评论提取器初始化完成');

      } catch (error) {
        console.error('❌ 初始化失败:', error);
      }
    }

    /**
     * 检查是否为 Discourse 论坛
     */
    isDiscourse() {
      return !!(
        document.querySelector('meta[name="generator"][content*="Discourse"]') ||
        document.querySelector('.topic-post, [data-post-id]') ||
        window.location.pathname.includes('/t/') ||
        document.body.classList.contains('discourse')
      );
    }

    /**
     * 等待页面准备就绪
     */
    async waitForPageReady() {
      return new Promise((resolve) => {
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', () => {
            setTimeout(resolve, this.config.initDelay);
          });
        } else {
          setTimeout(resolve, this.config.initDelay);
        }
      });
    }

    /**
     * 检查权限并创建按钮
     */
    async checkPermissionAndCreateButton() {
      try {
        // 获取用户和帖子信息
        const [currentUser, topicAuthor] = await Promise.all([
          this.permissionManager.getCurrentUser(),
          this.permissionManager.getTopicAuthor()
        ]);

        this.state.currentUser = currentUser;
        this.state.topicAuthor = topicAuthor;

        console.log('👤 当前用户:', currentUser);
        console.log('📝 帖子作者:', topicAuthor);

        // 检查权限
        this.state.hasPermission = this.permissionManager.checkPermission(currentUser, topicAuthor);

        console.log('🔒 权限检查结果:', this.state.hasPermission);

        // 创建按钮
        this.uiManager.createButton(this.state.hasPermission, this.handleExtractClick, this.handlePermissionError.bind(this));

      } catch (error) {
        console.error('❌ 权限检查失败:', error);
        this.uiManager.createButton(false, null, this.handlePermissionError.bind(this));
      }
    }

    /**
     * 处理提取按钮点击
     */
    async handleExtractClick() {
      try {
        // 双重权限检查
        if (!await this.revalidatePermission()) {
          await this.handlePermissionError();
          return;
        }

        // 显示配置模态框
        this.uiManager.showConfigModal((config) => {
          this.startExtraction(config);
        });

      } catch (error) {
        console.error('❌ 提取过程失败:', error);
        this.uiManager.showToast('提取失败，请重试', 'error');
      }
    }

    /**
     * 重新验证权限
     */
    async revalidatePermission() {
      const [currentUser, topicAuthor] = await Promise.all([
        this.permissionManager.getCurrentUser(),
        this.permissionManager.getTopicAuthor()
      ]);

      return this.permissionManager.checkPermission(currentUser, topicAuthor);
    }

    /**
     * 处理权限错误
     */
    async handlePermissionError() {
      const [currentUser, topicAuthor] = await Promise.all([
        this.permissionManager.getCurrentUser(),
        this.permissionManager.getTopicAuthor()
      ]);

      this.uiManager.showPermissionError(currentUser, topicAuthor);
    }

    /**
     * 开始提取评论
     */
    async startExtraction(config) {
      if (this.state.isLoading) return;

      this.state.isLoading = true;
      const progressModal = this.uiManager.showLoadingProgress();

      try {
        // 创建评论加载器
        const loader = new CommentLoader(this.api);

        // 加载所有评论
        const comments = await loader.loadAllComments((current, total, attempts) => {
          this.uiManager.updateProgress(current, total, attempts);
        });

        // 创建评论提取器
        const extractor = new CommentExtractor(this.config.emailRegex);

        // 提取评论
        const extractedData = extractor.extractComments({
          comments,
          mode: config.mode,
          startFloor: config.startFloor,
          endFloor: config.endFloor,
          randomCount: config.randomCount,
          extractEmails: config.extractEmails
        });

        // 关闭进度模态框
        this.uiManager.closeModal(progressModal);

        // 显示结果
        this.uiManager.showResults(extractedData);

        // 保存到历史记录
        this.storageManager.saveRecord({
          timestamp: Date.now(),
          url: window.location.href,
          title: document.title,
          mode: config.mode,
          totalComments: extractedData.comments.length,
          emailCount: extractedData.emails.length,
          config: config
        });

        this.uiManager.showToast(`成功提取 ${extractedData.comments.length} 条评论`, 'success');

      } catch (error) {
        console.error('提取失败:', error);
        this.uiManager.closeModal(progressModal);
        this.uiManager.showToast('提取失败，请重试', 'error');
      } finally {
        this.state.isLoading = false;
      }
    }
  }

  /**
   * Discourse API 管理器
   */
  class DiscourseAPIManager {
    constructor() {
      this.cache = new Map();
      this.sessionData = null;
    }

    /**
     * 获取当前用户信息
     */
    async getCurrentUser() {
      if (this.cache.has('currentUser')) {
        return this.cache.get('currentUser');
      }

      try {
        const response = await fetch('/session/current.json', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        const user = data.current_user;

        this.cache.set('currentUser', user);
        this.sessionData = data;

        console.log('🔍 API获取当前用户:', user);
        return user;

      } catch (error) {
        console.warn('⚠️ API获取用户信息失败，回退到DOM解析:', error);
        return null;
      }
    }

    /**
     * 获取完整的主题信息
     */
    async getFullTopicInfo() {
      const topicId = this.extractTopicId();
      if (!topicId) {
        throw new Error('无法提取主题ID');
      }

      const cacheKey = `fullTopicInfo_${topicId}`;
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey);
      }

      try {
        const response = await fetch(`/t/${topicId}.json`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const topicData = await response.json();

        console.log('🔍 API获取完整主题信息:', {
          id: topicData.id,
          title: topicData.title,
          posts_count: topicData.posts_count,
          created_by: topicData.details?.created_by
        });

        this.cache.set(cacheKey, topicData);
        return topicData;

      } catch (error) {
        console.warn('⚠️ API获取主题信息失败:', error);
        throw error;
      }
    }

    /**
     * 获取总帖子数量 - 新增方法
     */
    async getTotalPostsCount() {
      try {
        const topicInfo = await this.getFullTopicInfo();
        return topicInfo.posts_count || 0;
      } catch (error) {
        console.warn('⚠️ 无法从API获取帖子数量:', error);
        return 0;
      }
    }

    /**
     * 获取主题信息（简化版本）
     */
    async getTopicInfo() {
      return this.getFullTopicInfo();
    }

    /**
     * 获取主题帖子数量（兼容方法）
     */
    async getTopicPostsCount() {
      return this.getTotalPostsCount();
    }

    /**
     * 清除缓存
     */
    clearCache() {
      this.cache.clear();
      this.sessionData = null;
    }

    /**
     * 从URL提取主题ID
     */
    extractTopicId() {
      const pathMatch = window.location.pathname.match(/\/t\/[^\/]+\/(\d+)/);
      if (pathMatch) {
        const topicId = parseInt(pathMatch[1], 10);
        console.log('🔍 从路径提取主题ID:', topicId);
        return topicId;
      }

      const hashMatch = window.location.hash.match(/#\/t\/[^\/]+\/(\d+)/);
      if (hashMatch) {
        const topicId = parseInt(hashMatch[1], 10);
        console.log('🔍 从Hash提取主题ID:', topicId);
        return topicId;
      }

      const urlParams = new URLSearchParams(window.location.search);
      const topicIdParam = urlParams.get('topic_id') || urlParams.get('id');
      if (topicIdParam) {
        const topicId = parseInt(topicIdParam, 10);
        console.log('🔍 从查询参数提取主题ID:', topicId);
        return topicId;
      }

      const metaTopicId = document.querySelector('meta[property="discourse:topic_id"]');
      if (metaTopicId) {
        const topicId = parseInt(metaTopicId.getAttribute('content'), 10);
        console.log('🔍 从Meta标签提取主题ID:', topicId);
        return topicId;
      }

      const bodyDataset = document.body.dataset;
      if (bodyDataset.topicId) {
        const topicId = parseInt(bodyDataset.topicId, 10);
        console.log('🔍 从Body数据提取主题ID:', topicId);
        return topicId;
      }

      console.warn('⚠️ 无法提取主题ID');
      return null;
    }
  }

  /**
   * 权限管理器
   */
  class PermissionManager {
    constructor(apiManager) {
      this.api = apiManager;
    }

    /**
     * 获取当前用户信息
     */
    async getCurrentUser() {
      // 先尝试从API获取
      const apiUser = await this.api.getCurrentUser();
      if (apiUser) {
        return apiUser;
      }

      // 回退到DOM解析
      return this.getCurrentUserFromDOM();
    }

    /**
     * 从DOM获取当前用户信息
     */
    getCurrentUserFromDOM() {
      const userSelectors = [
        '.current-user .username',
        '[data-username]',
        '.header-dropdown-toggle.current-user',
        '.user-menu .username',
        '.current-user-info .username',
        'meta[name="discourse_current_user_id"]'
      ];

      for (const selector of userSelectors) {
        const element = document.querySelector(selector);
        if (element) {
          if (selector.includes('meta')) {
            const userId = element.getAttribute('content');
            if (userId) {
              console.log('🔍 DOM获取用户ID:', userId);
              return { id: parseInt(userId, 10) };
            }
          } else {
            const username = element.textContent?.trim() || element.getAttribute('data-username');
            if (username) {
              console.log('🔍 DOM获取用户名:', username);
              return { username };
            }
          }
        }
      }

      console.warn('⚠️ 无法从DOM获取用户信息');
      return null;
    }

    /**
     * 获取帖子作者信息
     */
    async getTopicAuthor() {
      // 先尝试从API获取
      try {
        const topicInfo = await this.api.getFullTopicInfo();
        if (topicInfo && topicInfo.details && topicInfo.details.created_by) {
          const author = topicInfo.details.created_by;
          console.log('🔍 API获取帖子作者:', author);
          return author;
        }
      } catch (error) {
        console.warn('⚠️ API获取帖子作者失败，回退到DOM解析:', error);
      }

      // 回退到DOM解析
      return this.getTopicAuthorFromDOM();
    }

    /**
     * 从DOM获取帖子作者信息
     */
    getTopicAuthorFromDOM() {
      const authorSelectors = [
        '.topic-post:first-child .username',
        '[data-post-number="1"] .username',
        '.topic-avatar .username',
        '.original-poster .username',
        '.first-post .username',
        '.topic-meta-data .username',
        '.creator .username'
      ];

      for (const selector of authorSelectors) {
        const element = document.querySelector(selector);
        if (element) {
          const username = element.textContent?.trim() || element.getAttribute('data-username');
          if (username) {
            console.log('🔍 DOM获取帖子作者:', username);
            return { username };
          }
        }
      }

      const postElement = document.querySelector('.topic-post[data-post-number="1"], .topic-post:first-child');
      if (postElement) {
        const userElement = postElement.querySelector('[data-username], .username');
        if (userElement) {
          const username = userElement.textContent?.trim() || userElement.getAttribute('data-username');
          if (username) {
            console.log('🔍 DOM获取首个帖子作者:', username);
            return { username };
          }
        }
      }

      console.warn('⚠️ 无法从DOM获取帖子作者');
      return null;
    }

    /**
     * 检查权限
     */
    checkPermission(currentUser, topicAuthor) {
      if (!currentUser || !topicAuthor) {
        console.log('🔒 权限检查：用户或作者信息缺失');
        return false;
      }

      const normalizeUsername = (username) => {
        return username ? username.toString().toLowerCase().trim() : '';
      };

      const currentUsername = normalizeUsername(currentUser.username);
      const authorUsername = normalizeUsername(topicAuthor.username);

      const hasPermission = currentUsername === authorUsername;

      console.log('🔒 权限检查详情:', {
        currentUser: currentUsername,
        topicAuthor: authorUsername,
        hasPermission
      });

      return hasPermission;
    }
  }

  /**
   * UI管理器 - 现代化TailwindCSS设计
   */
  class UIManager {
    constructor() {
      this.stylesLoaded = false;
    }

    /**
     * 加载样式
     */
    loadStyles() {
      if (this.stylesLoaded) return;

      this.loadTailwindCSS();
      this.addCustomStyles();
      this.stylesLoaded = true;
    }

    /**
     * 加载 Tailwind CSS
     */
    loadTailwindCSS() {
      if (document.querySelector('#tailwind-css-discourse-extractor')) return;

      const link = document.createElement('link');
      link.id = 'tailwind-css-discourse-extractor';
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css';
      document.head.appendChild(link);
    }

    /**
     * 添加现代化自定义样式 - 增强移动端支持
     */
    addCustomStyles() {
      if (document.querySelector('#discourse-extractor-styles')) return;

      const style = document.createElement('style');
      style.id = 'discourse-extractor-styles';
      style.textContent = `
        /* 主容器样式 - 响应式优化 */
        .discourse-extractor-modal {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.8) 100%) !important;
          backdrop-filter: blur(8px) !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          z-index: 999999 !important;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
          animation: fadeInModal 0.3s ease-out !important;
          padding: 0.5rem !important;
        }

        .discourse-extractor-content {
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%) !important;
          border-radius: 20px !important;
          max-width: 100% !important;
          max-height: 100% !important;
          width: 100% !important;
          overflow-y: auto !important;
          padding: 0 !important;
          box-shadow:
            0 25px 50px -12px rgba(0, 0, 0, 0.25),
            0 0 0 1px rgba(255, 255, 255, 0.05) !important;
          position: relative !important;
          animation: slideUpContent 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
        }

        /* 桌面端样式 */
        @media (min-width: 768px) {
          .discourse-extractor-modal {
            padding: 2rem !important;
          }

          .discourse-extractor-content {
            max-width: 95vw !important;
            max-height: 95vh !important;
            width: 1000px !important;
            border-radius: 24px !important;
          }
        }

        /* 移动端全屏优化 */
        @media (max-width: 767px) {
          .discourse-extractor-modal {
            padding: 0 !important;
          }

          .discourse-extractor-content {
            border-radius: 0 !important;
            height: 100vh !important;
            max-height: 100vh !important;
          }
        }
        
        /* 现代化按钮 - 响应式优化 */
        .discourse-extractor-btn {
          position: fixed !important;
          top: 1rem !important;
          right: 1rem !important;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
          color: white !important;
          border: none !important;
          border-radius: 16px !important;
          padding: 12px 20px !important;
          font-size: 14px !important;
          font-weight: 600 !important;
          cursor: pointer !important;
          z-index: 999998 !important;
          display: flex !important;
          align-items: center !important;
          gap: 8px !important;
          box-shadow:
            0 8px 25px rgba(102, 126, 234, 0.4),
            0 0 0 1px rgba(255, 255, 255, 0.1) inset !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
          backdrop-filter: blur(10px) !important;
          min-height: 44px !important; /* 移动端触摸目标最小尺寸 */
          min-width: 44px !important;
        }

        /* 桌面端按钮样式 */
        @media (min-width: 768px) {
          .discourse-extractor-btn {
            top: 20px !important;
            right: 20px !important;
            padding: 14px 24px !important;
            gap: 10px !important;
            border-radius: 18px !important;
          }
        }

        /* 移动端按钮优化 */
        @media (max-width: 767px) {
          .discourse-extractor-btn {
            top: 0.75rem !important;
            right: 0.75rem !important;
            padding: 10px 16px !important;
            font-size: 13px !important;
            border-radius: 14px !important;
            box-shadow:
              0 6px 20px rgba(102, 126, 234, 0.4),
              0 0 0 1px rgba(255, 255, 255, 0.1) inset !important;
          }
        }

        .discourse-extractor-btn:hover {
          transform: translateY(-3px) scale(1.02) !important;
          box-shadow:
            0 15px 35px rgba(102, 126, 234, 0.5),
            0 0 0 1px rgba(255, 255, 255, 0.2) inset !important;
          background: linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%) !important;
        }

        /* 移动端触摸优化 */
        @media (max-width: 767px) {
          .discourse-extractor-btn:hover {
            transform: scale(1.05) !important;
          }
        }

        .discourse-extractor-btn:active {
          transform: translateY(-1px) scale(1.01) !important;
        }

        /* 移动端触摸反馈 */
        @media (max-width: 767px) {
          .discourse-extractor-btn:active {
            transform: scale(0.98) !important;
          }
        }
        
        /* 关闭按钮 - 移动端优化 */
        .discourse-extractor-close {
          position: absolute !important;
          top: 12px !important;
          right: 12px !important;
          background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%) !important;
          border: none !important;
          border-radius: 12px !important;
          width: 44px !important; /* 移动端触摸目标最小尺寸 */
          height: 44px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          cursor: pointer !important;
          font-size: 20px !important;
          color: #64748b !important;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
          z-index: 10 !important;
        }

        /* 桌面端关闭按钮 */
        @media (min-width: 768px) {
          .discourse-extractor-close {
            top: 16px !important;
            right: 16px !important;
            width: 40px !important;
            height: 40px !important;
            font-size: 18px !important;
          }
        }

        /* 移动端关闭按钮优化 */
        @media (max-width: 767px) {
          .discourse-extractor-close {
            top: 8px !important;
            right: 8px !important;
            width: 48px !important;
            height: 48px !important;
            font-size: 22px !important;
            border-radius: 14px !important;
          }
        }

        .discourse-extractor-close:hover {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%) !important;
          color: white !important;
          transform: rotate(90deg) scale(1.1) !important;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3) !important;
        }

        /* 移动端触摸优化 */
        @media (max-width: 767px) {
          .discourse-extractor-close:hover {
            transform: scale(1.1) !important;
          }

          .discourse-extractor-close:active {
            transform: scale(0.95) !important;
          }
        }
        
        /* Toast通知 - 移动端优化 */
        .toast-notification {
          position: fixed !important;
          top: 80px !important;
          right: 1rem !important;
          left: 1rem !important;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
          color: white !important;
          padding: 16px 20px !important;
          border-radius: 12px !important;
          font-size: 14px !important;
          font-weight: 600 !important;
          z-index: 999999 !important;
          box-shadow:
            0 10px 25px rgba(16, 185, 129, 0.3),
            0 0 0 1px rgba(255, 255, 255, 0.1) inset !important;
          animation: slideInDown 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), slideOutUp 0.3s ease 2.7s !important;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
          backdrop-filter: blur(10px) !important;
          display: flex !important;
          align-items: center !important;
          gap: 8px !important;
          max-width: none !important;
        }

        /* 桌面端Toast */
        @media (min-width: 768px) {
          .toast-notification {
            top: 90px !important;
            right: 20px !important;
            left: auto !important;
            max-width: 400px !important;
            padding: 16px 24px !important;
            animation: slideInRight 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), slideOutRight 0.3s ease 2.7s !important;
          }
        }

        /* 移动端Toast优化 */
        @media (max-width: 767px) {
          .toast-notification {
            top: 70px !important;
            margin: 0 0.75rem !important;
            padding: 14px 18px !important;
            font-size: 13px !important;
            border-radius: 10px !important;
          }
        }

        .toast-notification.error {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%) !important;
          box-shadow:
            0 10px 25px rgba(239, 68, 68, 0.3),
            0 0 0 1px rgba(255, 255, 255, 0.1) inset !important;
        }
        
        /* 动画效果 */
        @keyframes fadeInModal {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUpContent {
          from { 
            opacity: 0; 
            transform: translateY(30px) scale(0.95); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
        }
        
        @keyframes slideInRight {
          from { transform: translateX(100%) scale(0.8); opacity: 0; }
          to { transform: translateX(0) scale(1); opacity: 1; }
        }

        @keyframes slideOutRight {
          from { transform: translateX(0) scale(1); opacity: 1; }
          to { transform: translateX(100%) scale(0.8); opacity: 0; }
        }

        /* 移动端Toast动画 */
        @keyframes slideInDown {
          from { transform: translateY(-100%) scale(0.9); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }

        @keyframes slideOutUp {
          from { transform: translateY(0) scale(1); opacity: 1; }
          to { transform: translateY(-100%) scale(0.9); opacity: 0; }
        }

        /* 自定义滚动条 */
        .discourse-extractor-content::-webkit-scrollbar {
          width: 6px;
        }

        .discourse-extractor-content::-webkit-scrollbar-track {
          background: transparent;
        }

        .discourse-extractor-content::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #cbd5e1, #94a3b8);
          border-radius: 3px;
        }

        .discourse-extractor-content::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #94a3b8, #64748b);
        }

        /* 自定义滚动条增强版 */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: linear-gradient(to bottom, #f1f5f9, #e2e8f0);
          border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #64748b, #475569);
          border-radius: 4px;
          border: 1px solid #e2e8f0;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #475569, #334155);
        }

        .custom-scrollbar::-webkit-scrollbar-corner {
          background: #f1f5f9;
        }

        /* 行高增强 */
        .line-height-7 {
          line-height: 1.75;
        }

        /* 文本截断 */
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* 特殊效果 */
        .glass-effect {
          background: rgba(255, 255, 255, 0.85) !important;
          backdrop-filter: blur(20px) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
        }

        .gradient-border {
          position: relative;
        }

        .gradient-border::before {
          content: '';
          position: absolute;
          inset: 0;
          padding: 2px;
          background: linear-gradient(135deg, #667eea, #764ba2, #f093fb);
          border-radius: inherit;
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: exclude;
        }

        /* 按钮加载状态 */
        .btn-loading {
          position: relative;
          overflow: hidden;
        }

        .btn-loading::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          animation: shimmer 1.5s infinite;
        }

        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }

        /* 卡片悬停效果 */
        .card-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        /* 粒子动画效果 */
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
          50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.6); }
        }

        /* 背景粒子效果 */
        .particle {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0) 70%);
          animation: float 3s ease-in-out infinite;
        }

        .particle:nth-child(1) { animation-delay: 0s; }
        .particle:nth-child(2) { animation-delay: 0.5s; }
        .particle:nth-child(3) { animation-delay: 1s; }
        .particle:nth-child(4) { animation-delay: 1.5s; }
        .particle:nth-child(5) { animation-delay: 2s; }

        /* 增强的渐变文字效果 */
        .gradient-text {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradientShift 3s ease infinite;
        }

        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* 增强的弹出动画 */
        @keyframes bounceInUp {
          0% {
            opacity: 0;
            transform: translateY(100px) scale(0.3);
          }
          50% {
            opacity: 1;
            transform: translateY(-30px) scale(1.05);
          }
          70% {
            transform: translateY(10px) scale(0.9);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* 脉冲效果 */
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }

        .pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }

        /* 移动端专用样式 */
        @media (max-width: 767px) {
          /* 防止缩放 */
          .discourse-extractor-modal {
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            -webkit-touch-callout: none;
            -webkit-tap-highlight-color: transparent;
          }

          /* 优化触摸滚动 */
          .discourse-extractor-content {
            -webkit-overflow-scrolling: touch;
            overscroll-behavior: contain;
          }

          /* 移动端输入框优化 */
          input[type="number"], input[type="text"] {
            font-size: 16px !important; /* 防止iOS缩放 */
            -webkit-appearance: none;
            border-radius: 8px !important;
          }

          /* 移动端按钮优化 */
          button {
            -webkit-tap-highlight-color: transparent;
            touch-action: manipulation;
          }

          /* 移动端模态框手势支持 */
          .discourse-extractor-content {
            touch-action: pan-y;
          }

          /* 移动端文字选择优化 */
          .selectable-text {
            -webkit-user-select: text;
            -moz-user-select: text;
            -ms-user-select: text;
            user-select: text;
          }
        }

        /* 平板端样式 */
        @media (min-width: 768px) and (max-width: 1023px) {
          .discourse-extractor-content {
            max-width: 90vw !important;
            width: 90vw !important;
          }
        }

        /* 大屏幕优化 */
        @media (min-width: 1440px) {
          .discourse-extractor-content {
            max-width: 1200px !important;
          }
        }

        /* 横屏移动端优化 */
        @media (max-width: 767px) and (orientation: landscape) {
          .discourse-extractor-content {
            max-height: 90vh !important;
          }
        }

        /* 高分辨率屏幕优化 */
        @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
          .discourse-extractor-btn {
            border: 0.5px solid rgba(255, 255, 255, 0.2) !important;
          }
        }
      `;
      document.head.appendChild(style);
    }

    /**
     * 创建现代化按钮
     */
    createButton(hasPermission, onExtractClick, onPermissionError) {
      if (document.querySelector('#discourse-extract-btn')) return;

      const button = document.createElement('button');
      button.id = 'discourse-extract-btn';
      button.className = 'discourse-extractor-btn';

      if (hasPermission) {
        button.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
            <path d="M14 2v6h6"/>
            <path d="M16 13H8"/>
            <path d="M16 17H8"/>
            <path d="M10 9H8"/>
          </svg>
          <span>智能提取</span>
        `;
        button.addEventListener('click', onExtractClick);
      } else {
        button.style.opacity = '0.6';
        button.style.cursor = 'not-allowed';
        button.style.background = 'linear-gradient(135deg, #64748b 0%, #475569 100%)';
        button.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6z"/>
          </svg>
          <span>仅限作者</span>
        `;
        button.addEventListener('click', onPermissionError);
      }

      document.body.appendChild(button);
    }

    /**
     * 显示现代化Toast通知
     */
    showToast(message, type = 'success') {
      const existingToast = document.querySelector('.toast-notification');
      if (existingToast) existingToast.remove();

      const toast = document.createElement('div');
      toast.className = `toast-notification ${type}`;

      const icon = type === 'success' ?
        '<svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>' :
        '<svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>';

      toast.innerHTML = `${icon}<span>${message}</span>`;
      document.body.appendChild(toast);

      setTimeout(() => {
        if (toast.parentNode) toast.remove();
      }, 3000);
    }

    /**
     * 显示权限错误 - 现代化设计
     */
    showPermissionError(currentUser, topicAuthor) {
      const existingError = document.querySelector('#permission-error-modal');
      if (existingError) return;

      const modal = document.createElement('div');
      modal.id = 'permission-error-modal';
      modal.className = 'discourse-extractor-modal';
      modal.innerHTML = `
        <div class="discourse-extractor-content max-w-md">
          <button class="discourse-extractor-close">×</button>
          
          <div class="p-8 text-center">
            <!-- 错误图标 -->
            <div class="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
              <svg class="w-10 h-10 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6z"/>
              </svg>
            </div>
            
            <!-- 标题 -->
            <h2 class="text-2xl font-bold text-gray-800 mb-4">权限不足</h2>
            
            <!-- 描述 -->
            <div class="text-gray-600 mb-6 space-y-3">
              <p class="leading-relaxed">抱歉，此功能仅限帖子作者使用</p>
              <div class="bg-gray-50 rounded-lg p-4 text-sm">
                <div class="space-y-2">
                  <div class="flex justify-between items-center">
                    <span class="font-medium text-gray-700">当前用户:</span>
                    <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      ${currentUser?.username || '未登录'}
                    </span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="font-medium text-gray-700">帖子作者:</span>
                    <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      ${topicAuthor?.username || '未知'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 按钮 -->
            <button class="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
              我知道了
            </button>
          </div>
        </div>
      `;

      const closeModal = () => {
        modal.remove();
      };

      modal.querySelector('.discourse-extractor-close').addEventListener('click', closeModal);
      modal.querySelector('button:last-child').addEventListener('click', closeModal);
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });

      document.body.appendChild(modal);
    }

    /**
     * 显示加载进度
     */
    showLoadingProgress() {
      const modal = document.createElement('div');
      modal.id = 'loading-progress-modal';
      modal.className = 'discourse-extractor-modal';
      modal.innerHTML = `
        <div class="discourse-extractor-content max-w-md glass-effect">
          <div class="p-8 text-center">
            <div class="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center">
              <div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h3 class="text-xl font-bold text-gray-800 mb-4">正在加载评论</h3>
            <div class="text-gray-600 mb-6">
              <p id="progress-text">正在扫描页面...</p>
              <div class="w-full bg-gray-200 rounded-full h-2 mt-4">
                <div id="progress-bar" class="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300" style="width: 0%"></div>
              </div>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
      return modal;
    }

    /**
     * 更新进度
     */
    updateProgress(current, total, attempts) {
      const progressText = document.getElementById('progress-text');
      const progressBar = document.getElementById('progress-bar');

      if (progressText && progressBar) {
        progressText.textContent = `已加载 ${current}/${total} 条评论 (第 ${attempts} 次尝试)`;
        const percentage = total > 0 ? (current / total) * 100 : 0;
        progressBar.style.width = `${Math.min(percentage, 100)}%`;
      }
    }

    /**
     * 关闭模态框
     */
    closeModal(modal) {
      if (modal && modal.parentNode) {
        modal.remove();
      }
    }

    /**
     * 显示配置模态框 - 现代化TailwindCSS设计
     */
    showConfigModal(onConfirm) {
      const existingModal = document.querySelector('#discourse-config-modal');
      if (existingModal) existingModal.remove();

      const modal = document.createElement('div');
      modal.id = 'discourse-config-modal';
      modal.className = 'discourse-extractor-modal';
      modal.innerHTML = `
        <div class="discourse-extractor-content max-w-lg md:max-w-2xl lg:max-w-4xl">
          <button class="discourse-extractor-close">×</button>

          <!-- Header with beautiful gradient - 响应式优化 -->
          <div class="bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 p-4 md:p-8 rounded-t-xl md:rounded-t-2xl text-white relative overflow-hidden">
            <div class="absolute inset-0 bg-white bg-opacity-10 backdrop-blur-sm"></div>
            <div class="relative z-10 text-center">
              <div class="w-16 h-16 md:w-20 md:h-20 mx-auto mb-3 md:mb-4 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <svg class="w-8 h-8 md:w-10 md:h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <h2 class="text-2xl md:text-3xl font-bold mb-2">智能提取配置</h2>
              <p class="text-white text-opacity-90 text-sm md:text-base">选择您的提取偏好和参数</p>
            </div>
          </div>

          <!-- Content - 响应式间距 -->
          <div class="p-4 md:p-8">
            <form id="extract-config-form" class="space-y-6 md:space-y-8">
              <!-- 提取模式选择 -->
              <div class="space-y-3 md:space-y-4">
                <h3 class="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4 flex items-center">
                  <svg class="w-4 h-4 md:w-5 md:h-5 mr-2 text-indigo-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  提取模式
                </h3>

                <div class="space-y-2 md:space-y-3">
                  <!-- 全部评论模式 - 移动端优化 -->
                  <label class="group relative flex items-center p-3 md:p-4 border-2 border-indigo-500 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg md:rounded-xl cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:scale-102 min-h-[60px] md:min-h-auto">
                    <input type="radio" name="mode" value="all" checked class="sr-only">
                    <div class="w-5 h-5 border-2 border-indigo-500 rounded-full mr-3 md:mr-4 flex items-center justify-center relative flex-shrink-0">
                      <div class="w-3 h-3 bg-indigo-500 rounded-full opacity-100 transform scale-100 transition-all duration-200"></div>
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="font-semibold text-gray-800 group-hover:text-indigo-700 transition-colors text-sm md:text-base">全部评论</div>
                      <div class="text-xs md:text-sm text-gray-600 mt-1">提取页面上所有可见的评论内容</div>
                    </div>
                    <svg class="w-5 h-5 md:w-6 md:h-6 text-indigo-500 opacity-100 transition-all duration-200 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </label>
                  
                  <!-- 楼层范围模式 - 移动端优化 -->
                  <label class="group relative flex items-center p-3 md:p-4 border-2 border-gray-200 bg-white rounded-lg md:rounded-xl cursor-pointer hover:border-orange-400 hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 hover:shadow-lg transition-all duration-300 transform hover:scale-102 min-h-[60px] md:min-h-auto">
                    <input type="radio" name="mode" value="range" class="sr-only">
                    <div class="w-5 h-5 border-2 border-orange-500 rounded-full mr-3 md:mr-4 flex items-center justify-center flex-shrink-0">
                      <div class="w-3 h-3 bg-orange-500 rounded-full opacity-0 transform scale-0 transition-all duration-200"></div>
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="font-semibold text-gray-800 group-hover:text-orange-700 transition-colors text-sm md:text-base">楼层范围</div>
                      <div class="text-xs md:text-sm text-gray-600 mt-1">指定起始楼层和结束楼层进行精确提取</div>
                    </div>
                    <svg class="w-5 h-5 md:w-6 md:h-6 text-orange-500 opacity-0 transition-all duration-200 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </label>

                  <!-- 随机提取模式 - 移动端优化 -->
                  <label class="group relative flex items-center p-3 md:p-4 border-2 border-gray-200 bg-white rounded-lg md:rounded-xl cursor-pointer hover:border-green-400 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:shadow-lg transition-all duration-300 transform hover:scale-102 min-h-[60px] md:min-h-auto">
                    <input type="radio" name="mode" value="random" class="sr-only">
                    <div class="w-5 h-5 border-2 border-green-500 rounded-full mr-3 md:mr-4 flex items-center justify-center flex-shrink-0">
                      <div class="w-3 h-3 bg-green-500 rounded-full opacity-0 transform scale-0 transition-all duration-200"></div>
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="font-semibold text-gray-800 group-hover:text-green-700 transition-colors text-sm md:text-base">随机提取</div>
                      <div class="text-xs md:text-sm text-gray-600 mt-1">从所有评论中随机选择指定数量</div>
                    </div>
                    <svg class="w-5 h-5 md:w-6 md:h-6 text-green-500 opacity-0 transition-all duration-200 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </label>
                </div>
              </div>

              <!-- 楼层范围配置 - 移动端优化 -->
              <div id="range-config" class="hidden opacity-0 transform translate-y-4 transition-all duration-500">
                <div class="bg-gradient-to-br from-orange-50 to-amber-100 rounded-lg md:rounded-xl p-4 md:p-6 border-2 border-orange-200 card-hover">
                  <h4 class="font-semibold text-orange-800 mb-3 md:mb-4 flex items-center text-sm md:text-base">
                    <svg class="w-4 h-4 md:w-5 md:h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"/>
                    </svg>
                    楼层范围设置
                  </h4>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    <div>
                      <label class="block text-xs md:text-sm font-medium text-orange-700 mb-2">起始楼层</label>
                      <input type="number" id="start-floor" min="1" value="1"
                        class="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white text-sm md:text-base min-h-[44px]">
                    </div>
                    <div>
                      <label class="block text-xs md:text-sm font-medium text-orange-700 mb-2">结束楼层</label>
                      <input type="number" id="end-floor" min="1" placeholder="默认到最后"
                        class="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white text-sm md:text-base min-h-[44px]">
                    </div>
                  </div>
                </div>
              </div>

              <!-- 随机提取配置 - 移动端优化 -->
              <div id="random-config" class="hidden opacity-0 transform translate-y-4 transition-all duration-500">
                <div class="bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg md:rounded-xl p-4 md:p-6 border-2 border-green-200 card-hover">
                  <h4 class="font-semibold text-green-800 mb-3 md:mb-4 flex items-center text-sm md:text-base">
                    <svg class="w-4 h-4 md:w-5 md:h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547L3.71 16.292a1 1 0 001.4 1.43l.93-.93c.22-.22.546-.31.858-.243l2.387.477a8 8 0 005.147-.689l.318-.158a4 4 0 012.573-.345l2.387.477c.312.067.638-.023.858-.243l.93-.93a1 1 0 001.4-1.43l-.534-.535z"/>
                    </svg>
                    随机提取设置
                  </h4>
                  <div>
                    <label class="block text-xs md:text-sm font-medium text-green-700 mb-2">提取数量</label>
                    <input type="number" id="random-count" min="1" value="10"
                      class="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white text-sm md:text-base min-h-[44px]">
                    <p class="text-xs md:text-sm text-green-600 mt-2">从所有评论中随机选择指定数量</p>
                  </div>
                </div>
              </div>

              <!-- 邮箱提取选项 - 移动端优化 -->
              <div class="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg md:rounded-xl p-4 md:p-6 border-2 border-blue-200 card-hover">
                <label class="flex items-center cursor-pointer group min-h-[60px] md:min-h-auto">
                  <input type="checkbox" id="extract-emails" checked class="sr-only">
                  <div class="relative mr-3 md:mr-4 flex-shrink-0">
                    <div class="w-12 h-6 bg-blue-500 rounded-full shadow-inner transition-all duration-300"></div>
                    <div class="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300 transform translate-x-6"></div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="font-semibold text-blue-800 group-hover:text-blue-900 transition-colors text-sm md:text-base">同时提取邮箱地址</div>
                    <div class="text-xs md:text-sm text-blue-600 mt-1">自动识别并提取评论中的邮箱地址</div>
                  </div>
                </label>
              </div>

              <!-- 按钮组 - 移动端优化 -->
              <div class="flex flex-col md:flex-row gap-3 md:gap-4 pt-4 md:pt-6">
                <button type="button" id="cancel-btn"
                  class="flex-1 px-4 md:px-6 py-3 md:py-4 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 font-semibold rounded-lg md:rounded-xl transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg text-sm md:text-base min-h-[48px] md:min-h-auto">
                  取消
                </button>
                <button type="submit"
                  class="flex-1 px-4 md:px-6 py-3 md:py-4 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 hover:from-indigo-600 hover:via-purple-700 hover:to-pink-600 text-white font-semibold rounded-lg md:rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl btn-loading text-sm md:text-base min-h-[48px] md:min-h-auto">
                  开始提取
                </button>
              </div>
            </form>
          </div>
        </div>
      `;

      this.attachConfigEventListeners(modal, onConfirm);
      document.body.appendChild(modal);
      return modal;
    }

    /**
     * 添加配置弹窗的事件监听器
     */
    attachConfigEventListeners(modal, onConfirm) {
      const form = modal.querySelector('#extract-config-form');
      const modeRadios = modal.querySelectorAll('input[name="mode"]');
      const rangeConfig = modal.querySelector('#range-config');
      const randomConfig = modal.querySelector('#random-config');
      const emailToggle = modal.querySelector('#extract-emails');

      // 单选按钮样式切换
      modeRadios.forEach(radio => {
        const label = radio.closest('label');
        const radioCircle = label.querySelector('div:first-child div');
        const checkIcon = label.querySelector('svg:last-child');

        radio.addEventListener('change', () => {
          // 重置所有选项
          modeRadios.forEach(r => {
            const rLabel = r.closest('label');
            const rCircle = rLabel.querySelector('div:first-child div');
            const rIcon = rLabel.querySelector('svg:last-child');

            rCircle.style.opacity = '0';
            rCircle.style.transform = 'scale(0)';
            rIcon.style.opacity = '0';
            rLabel.classList.remove('border-indigo-500', 'border-orange-400', 'border-green-400');
            rLabel.classList.add('border-gray-200');
          });

          // 激活当前选项
          radioCircle.style.opacity = '1';
          radioCircle.style.transform = 'scale(1)';
          checkIcon.style.opacity = '1';

          // 根据模式设置不同的边框颜色和背景
          if (radio.value === 'all') {
            label.classList.remove('border-gray-200');
            label.classList.add('border-indigo-500', 'bg-gradient-to-r', 'from-indigo-50', 'to-blue-50');
          } else if (radio.value === 'range') {
            label.classList.remove('border-gray-200');
            label.classList.add('border-orange-400', 'bg-gradient-to-r', 'from-orange-50', 'to-amber-50');
          } else if (radio.value === 'random') {
            label.classList.remove('border-gray-200');
            label.classList.add('border-green-400', 'bg-gradient-to-r', 'from-green-50', 'to-emerald-50');
          }

          // 显示/隐藏配置面板
          if (radio.value === 'range') {
            randomConfig.classList.add('hidden', 'opacity-0', 'translate-y-4');
            rangeConfig.classList.remove('hidden');
            setTimeout(() => {
              rangeConfig.classList.remove('opacity-0', 'translate-y-4');
            }, 10);
          } else if (radio.value === 'random') {
            rangeConfig.classList.add('hidden', 'opacity-0', 'translate-y-4');
            randomConfig.classList.remove('hidden');
            setTimeout(() => {
              randomConfig.classList.remove('opacity-0', 'translate-y-4');
            }, 10);
          } else {
            rangeConfig.classList.add('hidden', 'opacity-0', 'translate-y-4');
            randomConfig.classList.add('hidden', 'opacity-0', 'translate-y-4');
          }
        });
      });

      // 邮箱开关切换动画
      emailToggle.addEventListener('change', () => {
        const toggleContainer = emailToggle.closest('label').querySelector('div');
        const toggleSwitch = toggleContainer.querySelector('div:last-child');
        const toggleBg = toggleContainer.querySelector('div:first-child');

        if (emailToggle.checked) {
          toggleSwitch.classList.remove('translate-x-0');
          toggleSwitch.classList.add('translate-x-6');
          toggleBg.classList.remove('bg-gray-300');
          toggleBg.classList.add('bg-blue-500');
        } else {
          toggleSwitch.classList.remove('translate-x-6');
          toggleSwitch.classList.add('translate-x-0');
          toggleBg.classList.remove('bg-blue-500');
          toggleBg.classList.add('bg-gray-300');
        }
      });

      // 取消按钮
      modal.querySelector('#cancel-btn').addEventListener('click', () => {
        modal.remove();
      });

      // 关闭按钮
      modal.querySelector('.discourse-extractor-close').addEventListener('click', () => {
        modal.remove();
      });

      // 点击背景关闭
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.remove();
        }
      });

      // 移动端手势支持
      this.addMobileGestureSupport(modal);

      // 表单提交
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.classList.add('btn-loading');
        submitBtn.innerHTML = `
          <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
          正在配置...
        `;

        setTimeout(() => {
          const formData = new FormData(form);
          const config = {
            mode: formData.get('mode'),
            extractEmails: emailToggle.checked,
            startFloor: parseInt(modal.querySelector('#start-floor').value) || 1,
            endFloor: parseInt(modal.querySelector('#end-floor').value) || null,
            randomCount: parseInt(modal.querySelector('#random-count').value) || 10
          };

          modal.remove();
          onConfirm(config);
        }, 800);
      });
    }

    /**
     * 获取模式文本
     */
    getModeText(mode) {
      const modeMap = {
        'all': '全部评论',
        'range': '楼层范围',
        'random': '随机提取'
      };
      return modeMap[mode] || '未知模式';
    }

    /**
     * 下载JSON文件
     */
    downloadJSON(data) {
      try {
        const jsonData = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonData], { type: 'application/json;charset=utf-8' });
        const url = URL.createObjectURL(blob);

        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        const filename = `discourse-comments-${data.extractConfig?.mode || 'all'}-${timestamp}.json`;

        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        this.showToast('JSON文件下载成功');
      } catch (error) {
        console.error('下载JSON失败:', error);
        this.showToast('下载失败，请重试', 'error');
      }
    }

    /**
     * 下载CSV文件
     */
    downloadCSV(data) {
      try {
        const headers = ['楼层', '作者', '时间', '内容', '邮箱'];
        const csvContent = [
          '\ufeff', // BOM for Excel Chinese support
          headers.join(','),
          ...data.comments.map(comment => {
            const content = `"${comment.content.replace(/"/g, '""').replace(/\n/g, ' ')}"`;
            const emails = comment.emails ? comment.emails.join(';') : '';
            return [
              comment.floor,
              `"${comment.author}"`,
              `"${comment.time}"`,
              content,
              `"${emails}"`
            ].join(',');
          })
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);

        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        const filename = `discourse-comments-${data.extractConfig?.mode || 'all'}-${timestamp}.csv`;

        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        this.showToast('CSV文件下载成功');
      } catch (error) {
        console.error('下载CSV失败:', error);
        this.showToast('下载失败，请重试', 'error');
      }
    }

    /**
     * 复制完整数据
     */
    async copyData(data) {
      try {
        const textData = [
          `=== Discourse 评论提取结果 ===`,
          `提取时间: ${data.extractTime}`,
          `页面标题: ${data.pageTitle}`,
          `页面链接: ${data.pageUrl}`,
          `提取模式: ${this.getModeText(data.extractConfig?.mode)}`,
          `评论总数: ${data.comments.length}`,
          `邮箱总数: ${data.emails.length}`,
          '',
          '=== 评论详情 ===',
          ...data.comments.map(comment => [
            `楼层 #${comment.floor} - ${comment.author} - ${comment.time}`,
            comment.content,
            comment.emails && comment.emails.length > 0 ? `邮箱: ${comment.emails.join(', ')}` : '',
            '---'
          ].filter(line => line).join('\n'))
        ].join('\n');

        await navigator.clipboard.writeText(textData);
        this.showToast('数据已复制到剪贴板');
      } catch (error) {
        console.error('复制数据失败:', error);
        this.showToast('复制失败，请重试', 'error');
      }
    }

    /**
     * 复制单个邮箱地址
     */
    async copySingleEmail(email) {
      try {
        await navigator.clipboard.writeText(email);
        this.showToast(`✨ 已复制: ${email}`);
      } catch (error) {
        console.error('复制邮箱失败:', error);
        this.showToast('复制失败，请重试', 'error');
      }
    }

    /**
     * 显示邮箱复制选项模态框
     */
    showEmailCopyOptions(data) {
      if (data.emails.length === 0) {
        this.showToast('没有邮箱地址可复制', 'error');
        return;
      }

      const existingModal = document.querySelector('#email-copy-options-modal');
      if (existingModal) existingModal.remove();

      const modal = document.createElement('div');
      modal.id = 'email-copy-options-modal';
      modal.className = 'discourse-extractor-modal';
      modal.innerHTML = `
        <div class="discourse-extractor-content max-w-md">
          <button class="discourse-extractor-close">×</button>

          <div class="p-6 md:p-8">
            <!-- Header -->
            <div class="text-center mb-6">
              <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center">
                <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 8l7.89 7.89a1 1 0 001.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </div>
              <h2 class="text-2xl font-bold text-gray-800 mb-2">选择复制格式</h2>
              <p class="text-gray-600">共 ${data.emails.length} 个邮箱地址</p>
            </div>

            <!-- Separator Options -->
            <div class="space-y-3 mb-6">
              <button class="copy-option-btn w-full p-4 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border-2 border-blue-200 hover:border-blue-300 rounded-xl transition-all duration-300 text-left group" data-separator=",">
                <div class="flex items-center justify-between">
                  <div>
                    <div class="font-semibold text-blue-800 mb-1">逗号分隔</div>
                    <div class="text-sm text-blue-600">email1@example.com, email2@example.com</div>
                  </div>
                  <svg class="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 1H4a2 2 0 0 0-2 2v14h2V3h12V1zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H8V7h11v14z"/>
                  </svg>
                </div>
              </button>

              <button class="copy-option-btn w-full p-4 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border-2 border-green-200 hover:border-green-300 rounded-xl transition-all duration-300 text-left group" data-separator=" ">
                <div class="flex items-center justify-between">
                  <div>
                    <div class="font-semibold text-green-800 mb-1">空格分隔</div>
                    <div class="text-sm text-green-600">email1@example.com email2@example.com</div>
                  </div>
                  <svg class="w-5 h-5 text-green-500 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 1H4a2 2 0 0 0-2 2v14h2V3h12V1zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H8V7h11v14z"/>
                  </svg>
                </div>
              </button>

              <button class="copy-option-btn w-full p-4 bg-gradient-to-r from-purple-50 to-violet-50 hover:from-purple-100 hover:to-violet-100 border-2 border-purple-200 hover:border-purple-300 rounded-xl transition-all duration-300 text-left group" data-separator=";">
                <div class="flex items-center justify-between">
                  <div>
                    <div class="font-semibold text-purple-800 mb-1">分号分隔</div>
                    <div class="text-sm text-purple-600">email1@example.com; email2@example.com</div>
                  </div>
                  <svg class="w-5 h-5 text-purple-500 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 1H4a2 2 0 0 0-2 2v14h2V3h12V1zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H8V7h11v14z"/>
                  </svg>
                </div>
              </button>

              <button class="copy-option-btn w-full p-4 bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 border-2 border-amber-200 hover:border-amber-300 rounded-xl transition-all duration-300 text-left group" data-separator="\\n">
                <div class="flex items-center justify-between">
                  <div>
                    <div class="font-semibold text-amber-800 mb-1">换行分隔</div>
                    <div class="text-sm text-amber-600">每行一个邮箱地址</div>
                  </div>
                  <svg class="w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 1H4a2 2 0 0 0-2 2v14h2V3h12V1zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H8V7h11v14z"/>
                  </svg>
                </div>
              </button>
            </div>

            <!-- Cancel Button -->
            <button class="cancel-btn w-full p-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-all duration-300">
              取消
            </button>
          </div>
        </div>
      `;

      const closeModal = () => {
        modal.remove();
      };

      // Event listeners
      modal.querySelector('.discourse-extractor-close').addEventListener('click', closeModal);
      modal.querySelector('.cancel-btn').addEventListener('click', closeModal);
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });

      // Copy option buttons
      modal.querySelectorAll('.copy-option-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          const separator = btn.getAttribute('data-separator');
          const actualSeparator = separator === '\\n' ? '\n' : separator;
          await this.copyEmailsWithSeparator(data.emails, actualSeparator);
          closeModal();
        });
      });

      document.body.appendChild(modal);
    }

    /**
     * 复制邮箱地址（带分隔符选择）
     */
    async copyEmailsWithSeparator(emails, separator) {
      try {
        const emailText = emails.join(separator);
        await navigator.clipboard.writeText(emailText);

        const separatorName = {
          ',': '逗号',
          ' ': '空格',
          ';': '分号',
          '\n': '换行'
        }[separator] || '自定义';

        this.showToast(`已复制 ${emails.length} 个邮箱地址 (${separatorName}分隔)`);
      } catch (error) {
        console.error('复制邮箱失败:', error);
        this.showToast('复制失败，请重试', 'error');
      }
    }

    /**
     * 复制邮箱地址（兼容旧方法）
     */
    async copyEmails(data) {
      this.showEmailCopyOptions(data);
    }

    /**
     * 显示历史记录 - 现代化设计
     */
    showHistory() {
      const existingModal = document.querySelector('#discourse-history-modal');
      if (existingModal) existingModal.remove();

      const storageManager = new StorageManager('discourse_extractor_history', 100);
      const history = storageManager.getHistory();

      const modal = document.createElement('div');
      modal.id = 'discourse-history-modal';
      modal.className = 'discourse-extractor-modal';
      modal.innerHTML = `
        <div class="discourse-extractor-content max-w-5xl">
          <button class="discourse-extractor-close">×</button>
          
          <!-- Header -->
          <div class="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 p-8 rounded-t-xl text-white relative overflow-hidden">
            <div class="absolute inset-0 bg-white bg-opacity-10 backdrop-blur-sm"></div>
            <div class="relative z-10 text-center">
              <div class="w-20 h-20 mx-auto mb-4 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <svg class="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h2 class="text-3xl font-bold mb-2">📚 提取历史</h2>
              <p class="text-white text-opacity-90">共 ${history.length} 条记录</p>
            </div>
          </div>

          <!-- Content -->
          <div class="p-8 max-h-[60vh] overflow-y-auto">
            ${history.length === 0 ? `
              <div class="text-center py-16">
                <div class="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                  <svg class="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                </div>
                <h3 class="text-2xl font-semibold text-gray-700 mb-3">暂无历史记录</h3>
                <p class="text-gray-500 text-lg">开始提取评论后，记录将显示在这里</p>
              </div>
            ` : `
              <div class="grid gap-6">
                ${history.map((record, index) => `
                  <div class="bg-gradient-to-r from-white to-gray-50 border-2 border-gray-200 rounded-xl p-6 card-hover shadow-md">
                    <div class="flex justify-between items-start mb-4">
                      <div class="flex-1">
                        <h4 class="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">${record.pageTitle || '未知页面'}</h4>
                        <p class="text-sm text-gray-500 mb-3">${new Date(record.timestamp).toLocaleString()}</p>
                        <div class="flex flex-wrap gap-2">
                          <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            ${record.totalComments || 0} 评论
                          </span>
                          <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            ${record.emailCount || 0} 邮箱
                          </span>
                          <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                            ${this.getModeText(record.mode)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div class="flex gap-3">
                      <button onclick="window.historyActions.reloadRecord(${record.id})" class="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md">
                        重新查看
                      </button>
                      <button onclick="window.historyActions.copyRecord(${record.id})" class="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md">
                        复制数据
                      </button>
                      <a href="${record.url || '#'}" target="_blank" class="flex-1 px-4 py-3 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md text-center">
                        查看原帖
                      </a>
                    </div>
                  </div>
                `).join('')}
              </div>
              
              <div class="mt-8 pt-6 border-t-2 border-gray-200 text-center">
                <button onclick="window.historyActions.clearHistory()" class="px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
                  清空历史记录
                </button>
              </div>
            `}
          </div>
        </div>
      `;

      // 添加全局操作函数
      window.historyActions = {
        reloadRecord: (recordId) => {
          const record = history.find(r => r.id === recordId);
          if (record) {
            modal.remove();
            this.showResults(record);
          }
        },
        copyRecord: async (recordId) => {
          const record = history.find(r => r.id === recordId);
          if (record) {
            await this.copyData(record);
          }
        },
        clearHistory: () => {
          if (confirm('确定要清空所有历史记录吗？此操作不可恢复。')) {
            storageManager.clearHistory();
            modal.remove();
            this.showToast('历史记录已清空');
          }
        }
      };

      // 关闭功能
      const closeModal = () => {
        delete window.historyActions;
        modal.remove();
      };

      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });

      modal.querySelector('.discourse-extractor-close').addEventListener('click', closeModal);

      // 添加移动端手势支持
      this.addMobileGestureSupport(modal);

      document.body.appendChild(modal);
    }

    /**
     * 显示结果 - 现代化TailwindCSS设计
     */
    showResults(data) {
      const existingModal = document.querySelector('#discourse-results-modal');
      if (existingModal) existingModal.remove();

      const modal = document.createElement('div');
      modal.id = 'discourse-results-modal';
      modal.className = 'discourse-extractor-modal';
      modal.innerHTML = `
        <div class="discourse-extractor-content max-w-full md:max-w-6xl">
          <button class="discourse-extractor-close">×</button>

          <!-- Header with enhanced gradient and particles effect - 移动端优化 -->
          <div class="bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 p-4 md:p-8 rounded-t-xl text-white relative overflow-hidden">
            <!-- Background decorative elements -->
            <div class="absolute inset-0 opacity-10">
              <div class="absolute top-4 left-8 w-32 h-32 bg-white rounded-full blur-2xl animate-pulse"></div>
              <div class="absolute top-16 right-12 w-24 h-24 bg-white rounded-full blur-xl animate-pulse delay-1000"></div>
              <div class="absolute bottom-8 left-1/3 w-20 h-20 bg-white rounded-full blur-lg animate-pulse delay-500"></div>
            </div>
            
            <!-- Glassmorphism overlay -->
            <div class="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent backdrop-blur-sm"></div>
            
            <div class="relative z-10">
              <div class="flex flex-col md:flex-row items-center justify-between mb-6 md:mb-8 space-y-4 md:space-y-0">
                <div class="flex items-center space-x-3 md:space-x-4 text-center md:text-left">
                  <!-- Enhanced success icon with animation - 移动端优化 -->
                  <div class="w-12 h-12 md:w-16 md:h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30 animate-bounce">
                    <svg class="w-6 h-6 md:w-8 md:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <div>
                    <h2 class="text-2xl md:text-4xl font-bold mb-1 md:mb-2 bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">
                      🎉 提取完成
                    </h2>
                    <p class="text-emerald-100 text-sm md:text-lg font-medium">数据提取成功，一切准备就绪！</p>
                  </div>
                </div>

                <!-- Floating stats badge - 移动端优化 -->
                <div class="text-center md:text-right">
                  <div class="bg-white/20 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-4 border border-white/30">
                    <div class="text-2xl md:text-3xl font-bold mb-1">${data.comments.length}</div>
                    <div class="text-emerald-100 text-xs md:text-sm font-medium">条精彩评论</div>
                  </div>
                </div>
              </div>
              
              <!-- Enhanced statistics cards with hover effects - 移动端优化 -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
                <div class="group bg-white/15 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 text-center border border-white/20 hover:bg-white/25 transition-all duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer">
                  <div class="w-10 h-10 md:w-12 md:h-12 mx-auto mb-2 md:mb-3 bg-white/20 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                    <svg class="w-5 h-5 md:w-6 md:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 10h8M8 14h6M6 4h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2z"/>
                    </svg>
                  </div>
                  <div class="text-2xl md:text-3xl font-bold mb-1 md:mb-2 group-hover:text-yellow-200 transition-colors">${data.comments.length}</div>
                  <div class="text-emerald-100 text-xs md:text-sm font-medium">评论总数</div>
                  <div class="text-xs text-emerald-200 mt-1 opacity-75">已成功解析</div>
                </div>

                <div class="group bg-white/15 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 text-center border border-white/20 hover:bg-white/25 transition-all duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer">
                  <div class="w-10 h-10 md:w-12 md:h-12 mx-auto mb-2 md:mb-3 bg-white/20 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                    <svg class="w-5 h-5 md:w-6 md:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 8l7.89 7.89a1 1 0 001.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  <div class="text-2xl md:text-3xl font-bold mb-1 md:mb-2 group-hover:text-yellow-200 transition-colors">${data.emails.length}</div>
                  <div class="text-emerald-100 text-xs md:text-sm font-medium">邮箱地址</div>
                  <div class="text-xs text-emerald-200 mt-1 opacity-75">自动识别</div>
                </div>

                <div class="group bg-white/15 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 text-center border border-white/20 hover:bg-white/25 transition-all duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer">
                  <div class="w-10 h-10 md:w-12 md:h-12 mx-auto mb-2 md:mb-3 bg-white/20 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                    <svg class="w-5 h-5 md:w-6 md:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                  <div class="text-lg md:text-2xl font-bold mb-1 md:mb-2 group-hover:text-yellow-200 transition-colors">${this.getModeText(data.extractConfig?.mode)}</div>
                  <div class="text-emerald-100 text-xs md:text-sm font-medium">提取模式</div>
                  <div class="text-xs text-emerald-200 mt-1 opacity-75">智能算法</div>
                </div>
              </div>
            </div>
            
            <!-- Floating particles animation -->
            <div class="absolute inset-0 overflow-hidden pointer-events-none">
              <div class="absolute -top-2 -left-2 w-4 h-4 bg-white/30 rounded-full animate-ping"></div>
              <div class="absolute top-1/2 -right-2 w-3 h-3 bg-white/20 rounded-full animate-ping delay-700"></div>
              <div class="absolute -bottom-2 left-1/4 w-2 h-2 bg-white/25 rounded-full animate-ping delay-1000"></div>
            </div>
          </div>

          <!-- Content with enhanced design - 移动端优化 -->
          <div class="p-4 md:p-8 bg-gradient-to-b from-gray-50 to-white">
            <!-- Email tags section with improved design - 移动端优化 -->
            ${data.emails.length > 0 ? `
              <div class="mb-6 md:mb-10">
                <div class="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6 space-y-2 md:space-y-0">
                  <h3 class="text-lg md:text-2xl font-bold text-gray-800 flex items-center">
                    <div class="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg md:rounded-xl flex items-center justify-center mr-2 md:mr-3">
                      <svg class="w-4 h-4 md:w-5 md:h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 8l7.89 7.89a1 1 0 001.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                      </svg>
                    </div>
                    邮箱地址收集
                  </h3>
                  <div class="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 md:px-4 py-1 md:py-2 rounded-full text-xs md:text-sm font-semibold shadow-lg">
                    ${data.emails.length} 个地址
                  </div>
                </div>
                
                <div class="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-xl md:rounded-2xl p-4 md:p-6 border-2 border-green-100 shadow-inner">
                  <div class="flex flex-wrap gap-2 md:gap-3 max-h-32 md:max-h-40 overflow-y-auto custom-scrollbar">
                    ${data.emails.map((email, index) => `
                      <span class="email-tag group inline-flex items-center px-3 md:px-4 py-1 md:py-2 bg-gradient-to-r from-green-100 to-emerald-100 hover:from-green-200 hover:to-emerald-200 text-green-800 text-xs md:text-sm rounded-full border border-green-200 hover:border-green-300 transition-all duration-300 cursor-pointer hover:shadow-lg hover:scale-105 min-h-[32px] md:min-h-auto"
                            data-email="${email}" data-index="${index}">
                        <svg class="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 group-hover:animate-spin" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M3 8l7.89 7.89a1 1 0 001.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                        </svg>
                        ${email}
                      </span>
                    `).join('')}
                  </div>
                  <div class="mt-3 md:mt-4 text-center">
                    <p class="text-green-700 text-xs md:text-sm font-medium">💡 点击任意邮箱地址即可复制</p>
                  </div>
                </div>
              </div>
            ` : ''}

            <!-- Enhanced action buttons with better visual hierarchy - 移动端优化 -->
            <div class="mb-6 md:mb-10">
              <h3 class="text-lg md:text-2xl font-bold text-gray-800 mb-4 md:mb-6 flex items-center">
                <div class="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg md:rounded-xl flex items-center justify-center mr-2 md:mr-3">
                  <svg class="w-4 h-4 md:w-5 md:h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"/>
                  </svg>
                </div>
                数据操作中心
              </h3>

              <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
                <button id="download-json" class="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 hover:from-blue-100 hover:to-indigo-200 border-2 border-blue-200 hover:border-blue-300 rounded-xl md:rounded-2xl p-3 md:p-6 transition-all duration-500 transform hover:scale-105 hover:shadow-xl min-h-[80px] md:min-h-auto">
                  <div class="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/10 to-blue-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <div class="relative z-10 flex flex-col items-center">
                    <div class="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl md:rounded-2xl flex items-center justify-center mb-2 md:mb-4 group-hover:rotate-12 transition-transform duration-300 shadow-lg">
                      <svg class="w-5 h-5 md:w-7 md:h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                        <path d="M14 2v6h6"/>
                        <path d="M16 13H8"/>
                        <path d="M16 17H8"/>
                        <path d="M10 9H8"/>
                      </svg>
                    </div>
                    <span class="font-bold text-blue-800 text-sm md:text-lg group-hover:text-blue-900">下载 JSON</span>
                    <span class="text-blue-600 text-xs mt-1 hidden md:block">结构化数据</span>
                  </div>
                </button>
                
                <button id="download-csv" class="group relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-100 hover:from-green-100 hover:to-emerald-200 border-2 border-green-200 hover:border-green-300 rounded-xl md:rounded-2xl p-3 md:p-6 transition-all duration-500 transform hover:scale-105 hover:shadow-xl min-h-[80px] md:min-h-auto">
                  <div class="absolute inset-0 bg-gradient-to-r from-green-600/0 via-green-600/10 to-green-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <div class="relative z-10 flex flex-col items-center">
                    <div class="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl md:rounded-2xl flex items-center justify-center mb-2 md:mb-4 group-hover:rotate-12 transition-transform duration-300 shadow-lg">
                      <svg class="w-5 h-5 md:w-7 md:h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm-7 14a1 1 0 0 1-1-1V8a1 1 0 0 1 2 0v8a1 1 0 0 1-1 1z"/>
                      </svg>
                    </div>
                    <span class="font-bold text-green-800 text-sm md:text-lg group-hover:text-green-900">下载 CSV</span>
                    <span class="text-green-600 text-xs mt-1 hidden md:block">电子表格</span>
                  </div>
                </button>

                <button id="copy-data" class="group relative overflow-hidden bg-gradient-to-br from-purple-50 to-violet-100 hover:from-purple-100 hover:to-violet-200 border-2 border-purple-200 hover:border-purple-300 rounded-xl md:rounded-2xl p-3 md:p-6 transition-all duration-500 transform hover:scale-105 hover:shadow-xl min-h-[80px] md:min-h-auto">
                  <div class="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/10 to-purple-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <div class="relative z-10 flex flex-col items-center">
                    <div class="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl md:rounded-2xl flex items-center justify-center mb-2 md:mb-4 group-hover:rotate-12 transition-transform duration-300 shadow-lg">
                      <svg class="w-5 h-5 md:w-7 md:h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M16 1H4a2 2 0 0 0-2 2v14h2V3h12V1zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H8V7h11v14z"/>
                      </svg>
                    </div>
                    <span class="font-bold text-purple-800 text-sm md:text-lg group-hover:text-purple-900">复制数据</span>
                    <span class="text-purple-600 text-xs mt-1 hidden md:block">到剪贴板</span>
                  </div>
                </button>

                <button id="copy-emails" class="group relative overflow-hidden bg-gradient-to-br from-orange-50 to-amber-100 hover:from-orange-100 hover:to-amber-200 border-2 border-orange-200 hover:border-orange-300 rounded-xl md:rounded-2xl p-3 md:p-6 transition-all duration-500 transform hover:scale-105 hover:shadow-xl min-h-[80px] md:min-h-auto">
                  <div class="absolute inset-0 bg-gradient-to-r from-orange-600/0 via-orange-600/10 to-orange-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <div class="relative z-10 flex flex-col items-center">
                    <div class="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl md:rounded-2xl flex items-center justify-center mb-2 md:mb-4 group-hover:rotate-12 transition-transform duration-300 shadow-lg">
                      <svg class="w-5 h-5 md:w-7 md:h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 8l7.89 7.89a1 1 0 001.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                      </svg>
                    </div>
                    <span class="font-bold text-orange-800 text-sm md:text-lg group-hover:text-orange-900">复制邮箱</span>
                    <span class="text-orange-600 text-xs mt-1 hidden md:block">邮件地址</span>
                  </div>
                </button>

                <button id="view-history" class="group relative overflow-hidden bg-gradient-to-br from-gray-50 to-slate-100 hover:from-gray-100 hover:to-slate-200 border-2 border-gray-200 hover:border-gray-300 rounded-xl md:rounded-2xl p-3 md:p-6 transition-all duration-500 transform hover:scale-105 hover:shadow-xl min-h-[80px] md:min-h-auto">
                  <div class="absolute inset-0 bg-gradient-to-r from-gray-600/0 via-gray-600/10 to-gray-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <div class="relative z-10 flex flex-col items-center">
                    <div class="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl md:rounded-2xl flex items-center justify-center mb-2 md:mb-4 group-hover:rotate-12 transition-transform duration-300 shadow-lg">
                      <svg class="w-5 h-5 md:w-7 md:h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                    <span class="font-bold text-gray-800 text-sm md:text-lg group-hover:text-gray-900">查看历史</span>
                    <span class="text-gray-600 text-xs mt-1 hidden md:block">操作记录</span>
                  </div>
                </button>
              </div>
            </div>

            <!-- Enhanced comments list with better styling -->
            <div>
              <div class="flex items-center justify-between mb-6">
                <h3 class="text-2xl font-bold text-gray-800 flex items-center">
                  <div class="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center mr-3">
                    <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 10h8M8 14h6M6 4h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2z"/>
                    </svg>
                  </div>
                  评论内容详览
                </h3>
                <div class="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                  ${data.comments.length} 条评论
                </div>
              </div>
              
              <div class="bg-white rounded-2xl border-2 border-gray-100 shadow-xl overflow-hidden">
                <div class="max-h-96 overflow-y-auto custom-scrollbar bg-gradient-to-b from-gray-50 to-white">
                  <div class="divide-y divide-gray-100">
                    ${data.comments.map((comment, index) => `
                      <div class="p-6 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 group">
                        <div class="flex items-start space-x-4">
                          <!-- Enhanced floor badge -->
                          <div class="flex-shrink-0">
                            <div class="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:rotate-6 transition-transform duration-300">
                              ${comment.floor}
                            </div>
                          </div>
                          
                          <!-- Comment content with improved typography -->
                          <div class="flex-1 min-w-0">
                            <div class="flex items-center justify-between mb-3">
                              <h4 class="font-bold text-gray-900 text-lg group-hover:text-blue-700 transition-colors">
                                ${comment.author}
                              </h4>
                              <span class="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                ${comment.time}
                              </span>
                            </div>
                            
                            <div class="bg-white bg-opacity-60 rounded-xl p-4 border border-gray-100 group-hover:border-blue-200 transition-colors">
                              <p class="text-gray-800 leading-relaxed line-height-7">${comment.content}</p>
                            </div>
                            
                            ${comment.emails && comment.emails.length > 0 ? `
                              <div class="mt-4 flex flex-wrap gap-2">
                                ${comment.emails.map((email, emailIndex) => `
                                  <span class="comment-email-tag inline-flex items-center px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 text-xs rounded-full border border-green-200 hover:from-green-200 hover:to-emerald-200 transition-colors cursor-pointer hover:shadow-md hover:scale-105"
                                        data-email="${email}" data-comment-index="${index}" data-email-index="${emailIndex}">
                                    <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M3 8l7.89 7.89a1 1 0 001.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                    </svg>
                                    ${email}
                                  </span>
                                `).join('')}
                              </div>
                            ` : ''}
                          </div>
                        </div>
                      </div>
                    `).join('')}
                  </div>
                </div>
                
                <!-- Comments list footer -->
                <div class="bg-gradient-to-r from-gray-100 to-gray-200 px-6 py-4 text-center">
                  <p class="text-gray-700 font-medium">
                    📊 共显示 <span class="font-bold text-indigo-600">${data.comments.length}</span> 条评论内容
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

      this.attachResultsEventListeners(modal, data);
      document.body.appendChild(modal);
    }

    /**
     * 添加移动端手势支持
     */
    addMobileGestureSupport(modal) {
      if (!('ontouchstart' in window)) return; // 非触摸设备跳过

      const content = modal.querySelector('.discourse-extractor-content');
      let startY = 0;
      let currentY = 0;
      let isDragging = false;
      let startTime = 0;

      const handleTouchStart = (e) => {
        startY = e.touches[0].clientY;
        currentY = startY;
        startTime = Date.now();
        isDragging = true;
        content.style.transition = 'none';
      };

      const handleTouchMove = (e) => {
        if (!isDragging) return;

        currentY = e.touches[0].clientY;
        const deltaY = currentY - startY;

        // 只允许向下滑动
        if (deltaY > 0) {
          const opacity = Math.max(0.3, 1 - deltaY / 300);
          const scale = Math.max(0.9, 1 - deltaY / 1000);

          content.style.transform = `translateY(${deltaY}px) scale(${scale})`;
          modal.style.backgroundColor = `rgba(0, 0, 0, ${0.8 * opacity})`;
        }
      };

      const handleTouchEnd = (e) => {
        if (!isDragging) return;

        isDragging = false;
        const deltaY = currentY - startY;
        const deltaTime = Date.now() - startTime;
        const velocity = deltaY / deltaTime;

        content.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';

        // 判断是否应该关闭模态框
        if (deltaY > 100 || velocity > 0.5) {
          // 关闭模态框
          content.style.transform = 'translateY(100vh) scale(0.8)';
          modal.style.backgroundColor = 'rgba(0, 0, 0, 0)';
          setTimeout(() => modal.remove(), 300);
        } else {
          // 恢复原位
          content.style.transform = 'translateY(0) scale(1)';
          modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        }
      };

      // 添加触摸事件监听器
      content.addEventListener('touchstart', handleTouchStart, { passive: true });
      content.addEventListener('touchmove', handleTouchMove, { passive: true });
      content.addEventListener('touchend', handleTouchEnd, { passive: true });
    }

    /**
     * 添加结果模态框事件监听器
     */
    attachResultsEventListeners(modal, data) {
      const closeModal = () => {
        modal.remove();
      };

      // 关闭按钮
      modal.querySelector('.discourse-extractor-close').addEventListener('click', closeModal);
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });

      // 功能按钮事件
      modal.querySelector('#download-json').addEventListener('click', () => {
        this.downloadJSON(data);
      });

      modal.querySelector('#download-csv').addEventListener('click', () => {
        this.downloadCSV(data);
      });

      modal.querySelector('#copy-data').addEventListener('click', () => {
        this.copyData(data);
      });

      modal.querySelector('#copy-emails').addEventListener('click', () => {
        this.copyEmails(data);
      });

      // Email tag click handlers (main email section)
      modal.querySelectorAll('.email-tag').forEach(tag => {
        tag.addEventListener('click', () => {
          const email = tag.getAttribute('data-email');
          this.copySingleEmail(email);
        });
      });

      // Comment email tag click handlers
      modal.querySelectorAll('.comment-email-tag').forEach(tag => {
        tag.addEventListener('click', () => {
          const email = tag.getAttribute('data-email');
          this.copySingleEmail(email);
        });
      });

      modal.querySelector('#view-history').addEventListener('click', () => {
        closeModal();
        this.showHistory();
      });

      // 按钮点击效果
      modal.querySelectorAll('button[id]').forEach(btn => {
        btn.addEventListener('mousedown', () => {
          btn.style.transform = 'scale(0.95)';
        });
        btn.addEventListener('mouseup', () => {
          btn.style.transform = 'scale(1.05)';
        });
      });

      // 添加移动端手势支持
      this.addMobileGestureSupport(modal);
    }
  }

  /**
   * 存储管理器
   */
  class StorageManager {
    constructor(storageKey, maxRecords) {
      this.storageKey = storageKey;
      this.maxRecords = maxRecords;
    }

    /**
     * 获取历史记录
     */
    getHistory() {
      try {
        const history = localStorage.getItem(this.storageKey);
        return history ? JSON.parse(history) : [];
      } catch (error) {
        console.error('读取历史记录失败:', error);
        return [];
      }
    }

    /**
     * 保存记录
     */
    saveRecord(record) {
      try {
        const history = this.getHistory();
        const newRecord = {
          id: Date.now(),
          timestamp: new Date().toLocaleString('zh-CN'),
          url: window.location.href,
          pageTitle: document.title,
          ...record
        };

        history.unshift(newRecord);

        if (history.length > this.maxRecords) {
          history.splice(this.maxRecords);
        }

        localStorage.setItem(this.storageKey, JSON.stringify(history));
        return newRecord;
      } catch (error) {
        console.error('保存历史记录失败:', error);
        return null;
      }
    }

    /**
     * 清除历史记录
     */
    clearHistory() {
      try {
        localStorage.removeItem(this.storageKey);
        return true;
      } catch (error) {
        console.error('清除历史记录失败:', error);
        return false;
      }
    }
  }

  /**
   * 评论加载器
   */
  class CommentLoader {
    constructor(apiManager) {
      this.api = apiManager;
      this.maxAttempts = 30;
      this.loadDelay = 2500;
      this.cachedTotalPosts = null; // 缓存总帖子数
    }

    /**
     * 获取帖子总数
     */
    async getTotalPostsCount() {
      if (this.cachedTotalPosts !== null) {
        return this.cachedTotalPosts;
      }

      try {
        // 优先从 API 获取
        const apiCount = await this.api.getTopicPostsCount();
        if (apiCount > 0) {
          console.log('✅ 从 API 获取帖子总数:', apiCount);
          this.cachedTotalPosts = apiCount;
          return apiCount;
        }

        // 备选方案1: 从页面进度指示器获取
        const progressElement = document.querySelector('.topic-timeline .timeline-last-read, .timeline-last-read');
        if (progressElement) {
          const progressText = progressElement.textContent.trim();
          const match = progressText.match(/\d+\s*\/\s*(\d+)/);
          if (match) {
            const domCount = parseInt(match[1]);
            console.log('✅ 从页面进度获取帖子总数:', domCount);
            this.cachedTotalPosts = domCount;
            return domCount;
          }
        }

        // 备选方案2: 从全局对象获取
        if (window.Discourse?.currentTopic?.posts_count) {
          const globalCount = window.Discourse.currentTopic.posts_count;
          console.log('✅ 从全局对象获取帖子总数:', globalCount);
          this.cachedTotalPosts = globalCount;
          return globalCount;
        }

        // 备选方案3: 估算当前可见帖子数量
        const posts = document.querySelectorAll('.topic-post[data-post-id], article[data-post-id]');
        const estimatedCount = Math.max(posts.length, 50); // 至少假设50个帖子
        console.log('⚠️ 使用估算帖子总数:', estimatedCount);
        this.cachedTotalPosts = estimatedCount;
        return estimatedCount;

      } catch (error) {
        console.error('❌ 获取帖子总数失败:', error);
        // 最后的默认值
        this.cachedTotalPosts = 100;
        return 100;
      }
    }

    /**
     * 加载所有评论
     */
    async loadAllComments(progressCallback) {
      let attempts = 0;
      let consecutiveNoProgress = 0;

      console.log('🔄 开始自动加载所有评论...');

      // 获取真实的帖子总数
      const totalPosts = await this.getTotalPostsCount();
      console.log('📊 帖子总数:', totalPosts);

      while (attempts < this.maxAttempts) {
        attempts++;

        const progress = await this.getLoadingProgress();
        console.log(`第 ${attempts} 次尝试，当前进度: ${progress.current}/${progress.total}`);

        if (progressCallback) {
          progressCallback(progress.current, progress.total, attempts);
        }

        if (progress.current >= progress.total) {
          console.log('✅ 已达到目标数量，停止加载');
          break;
        }

        if (!this.hasMoreContent(progress)) {
          console.log('❌ 没有更多内容可加载');
          break;
        }

        const beforeProgress = progress.current;
        const loaded = await this.loadMoreContent();

        if (!loaded) {
          consecutiveNoProgress++;
        } else {
          consecutiveNoProgress = 0;
        }

        await this.sleep(this.loadDelay);

        const afterProgress = await this.getLoadingProgress();
        if (afterProgress.current === beforeProgress) {
          consecutiveNoProgress++;
          if (consecutiveNoProgress >= 5) {
            console.log('❌ 连续多次无进度，停止加载');
            break;
          }
        }
      }

      const finalProgress = await this.getLoadingProgress();
      console.log(`✅ 加载完成，最终进度: ${finalProgress.current}/${finalProgress.total}`);
      return finalProgress;
    }

    /**
     * 获取加载进度
     */
    async getLoadingProgress() {
      // 获取真实的总帖子数
      const totalPosts = await this.getTotalPostsCount();

      // 从页面右侧的进度指示器获取当前进度
      const progressNavigation = document.querySelector('.topic-timeline .timeline-last-read, .timeline-last-read');
      if (progressNavigation) {
        const progressText = progressNavigation.textContent.trim();
        const match = progressText.match(/(\d+)\s*\/\s*(\d+)/);
        if (match) {
          return {
            current: parseInt(match[1]),
            total: parseInt(match[2]) // 使用页面显示的真实总数
          };
        }
      }

      // 备选方案：计算当前可见的帖子数量
      const posts = document.querySelectorAll('.topic-post[data-post-id], article[data-post-id]');
      const uniquePostIds = new Set();
      posts.forEach(post => {
        const postId = post.getAttribute('data-post-id');
        if (postId) uniquePostIds.add(postId);
      });

      return {
        current: uniquePostIds.size,
        total: totalPosts // 使用从 API 获取的真实总数
      };
    }

    /**
     * 检查是否有更多内容
     */
    hasMoreContent(progress) {
      if (!progress) return true;
      return progress.current < progress.total;
    }

    /**
     * 加载更多内容
     */
    async loadMoreContent() {
      const beforeHeight = document.body.scrollHeight;
      this.scrollToBottom();
      await this.sleep(1500);
      const afterHeight = document.body.scrollHeight;
      return afterHeight > beforeHeight;
    }

    /**
     * 滚动到底部
     */
    scrollToBottom() {
      window.scrollTo(0, document.body.scrollHeight);
    }

    /**
     * 等待函数
     */
    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  }

  /**
   * 评论提取器
   */
  class CommentExtractor {
    constructor(emailRegex) {
      this.emailRegex = emailRegex;
    }

    /**
     * 提取评论
     */
    extractComments(options = {}) {
      const {
        mode = 'all',
        startFloor = 1,
        endFloor = null,
        randomCount = 10,
        extractEmails = true
      } = options;

      const allComments = [];
      const allEmails = new Set();
      const processedPostIds = new Set();

      const posts = document.querySelectorAll('.topic-post[data-post-id], article[data-post-id]');
      console.log(`找到 ${posts.length} 个帖子元素`);

      // 首先提取所有评论
      posts.forEach((post, index) => {
        const postId = post.getAttribute('data-post-id');
        if (!postId || processedPostIds.has(postId)) return;
        processedPostIds.add(postId);

        const authorElement = post.querySelector('.username, .trigger-user-card');
        const author = authorElement ? authorElement.textContent.trim() : '未知用户';

        const timeElement = post.querySelector('.post-date, .relative-date, time');
        const time = timeElement ? timeElement.textContent.trim() : '未知时间';

        const contentElement = post.querySelector('.cooked, .post-content');
        const content = contentElement ? contentElement.textContent.trim() : '';

        if (content && content.length > 0) {
          // 只在需要时提取邮箱
          const postEmails = extractEmails ? (content.match(this.emailRegex) || []) : [];

          const comment = {
            id: postId,
            floor: index + 1,
            author: author,
            time: time,
            content: content,
            emails: postEmails
          };

          allComments.push(comment);

          // 收集所有邮箱
          if (extractEmails) {
            postEmails.forEach(email => allEmails.add(email));
          }
        }
      });

      // 根据模式过滤评论
      let filteredComments = [];
      switch (mode) {
        case 'range':
          const actualEndFloor = endFloor || allComments.length;
          filteredComments = allComments.filter(comment =>
            comment.floor >= startFloor && comment.floor <= actualEndFloor
          );
          console.log(`楼层范围过滤: ${startFloor}-${actualEndFloor}, 结果: ${filteredComments.length} 条评论`);
          break;

        case 'random':
          const shuffled = [...allComments].sort(() => 0.5 - Math.random());
          filteredComments = shuffled.slice(0, Math.min(randomCount, allComments.length));
          filteredComments.sort((a, b) => a.floor - b.floor);
          console.log(`随机提取: ${randomCount} 条, 实际获得: ${filteredComments.length} 条评论`);
          break;

        default: // 'all'
          filteredComments = allComments;
          console.log(`全部提取: ${filteredComments.length} 条评论`);
          break;
      }

      // 如果是范围或随机模式，重新计算邮箱
      const finalEmails = new Set();
      if (extractEmails && (mode === 'range' || mode === 'random')) {
        filteredComments.forEach(comment => {
          if (comment.emails) {
            comment.emails.forEach(email => finalEmails.add(email));
          }
        });
      } else if (extractEmails) {
        // 全部模式使用之前收集的所有邮箱
        allEmails.forEach(email => finalEmails.add(email));
      }

      const result = {
        comments: filteredComments,
        emails: extractEmails ? Array.from(finalEmails) : [],
        pageTitle: document.title,
        pageUrl: window.location.href,
        extractTime: new Date().toLocaleString('zh-CN'),
        extractConfig: options,
        totalComments: allComments.length
      };

      console.log('📊 提取结果:', {
        模式: mode,
        总评论数: result.totalComments,
        提取评论数: result.comments.length,
        邮箱数: result.emails.length,
        是否提取邮箱: extractEmails
      });

      return result;
    }
  }

  // 初始化
  function init() {
    const extractor = new DiscourseCommentExtractor();
    extractor.init();
  }

  // 启动
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

