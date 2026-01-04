// ==UserScript==
// @name        ChatGPT Question Navigation Sidebar v2
// @namespace   npm/chatgpt-question-navigator
// @version     2.1
// @author      Pitroytech
// @description Lấy cảm hứng từ "ChatGPT Question Navigation sidebar" của okokdi, nhưng viết lại hoàn toàn bằng mã mới — siêu nhanh, mượt nhẹ, hiệu ứng đẹp vượt trội (Inspired by "ChatGPT Question Navigation sidebar" by okokdi, entirely rewritten with new code — ultra-fast, lightweight, with significantly improved, elegant effects.
// @match       https://chatgpt.com/**
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/545010/ChatGPT%20Question%20Navigation%20Sidebar%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/545010/ChatGPT%20Question%20Navigation%20Sidebar%20v2.meta.js
// ==/UserScript==


(function () {
  'use strict';

  // ====== CẤU HÌNH (CONFIG) ======
  // Tìm icon sidebar để thay <span class="toggle-btn">✮⋆˙</span>
  // Find sidebar icon to replace <span class="toggle-btn">✮⋆˙</span>

  // Độ trong suốt khi sidebar ĐANG THU GỌN và KHÔNG hover
  // Opacity when sidebar is COLLAPSED and NOT hovering
  // 0 = hoàn toàn trong suốt (fully transparent), 1 = đục hoàn toàn (fully opaque)
  const COLLAPSED_OPACITY = 0.35;

  // Thời gian ép sidebar "dính cuối" sau khi khởi tạo (ms)
  // Time to force sidebar "stick to bottom" after initialization (ms)
  // Gợi ý: 300–600ms (càng thấp thì càng ít can thiệp)
  // Suggestion: 300–600ms (lower = less intrusive)
  const FORCE_STICK_BOTTOM_MS = 500;
  // =====================

  // Các hằng số hệ thống (System constants)
  const DOM_MARK = 'data-chatgpt-question-directory';
  const CHAT_LIST_EL_CLASS = 'flex flex-col text-sm';
  const isSharePage = location.pathname.startsWith('/share/');
  const scrollMarginTop = 56;
  const RIGHT_OFFSET_PX = 12; // Sidebar luôn neo cách mép phải 12px (Sidebar always anchored 12px from right edge)
  const TOP_MIN_MARGIN = 20;  // Chặn kéo vượt viền trên (Prevent dragging beyond top boundary)
  const BOTTOM_MIN_MARGIN = 20; // Chặn kéo vượt viền dưới (Prevent dragging beyond bottom boundary)
  const DRAG_THRESHOLD_PX = 3; // Ngưỡng di chuyển để coi là kéo (Movement threshold to consider as dragging)

  // ====== CÁC HÀM TRỢ GIÚP (HELPER FUNCTIONS) ======

  // Tìm container chứa các tin nhắn chat (Find chat messages container)
  function queryChatContainer() {
    const main = document.querySelector('main');
    return main?.querySelector('.' + CHAT_LIST_EL_CLASS.split(' ').join('.'));
  }

  // Lấy danh sách các phần tử câu hỏi (chỉ lấy index chẵn)
  // Get list of question elements (only even indexes)
  function queryQuestionEls() {
    const container = queryChatContainer();
    if (!container) return [];

    return Array.from(container.children)
      .filter(child => child.hasAttribute('data-testid'))
      .filter((_, index) => index % 2 === 0); // Chỉ lấy câu hỏi (index chẵn) / Only questions (even index)
  }

  // Trích xuất nội dung text của các câu hỏi
  // Extract text content of questions
  function getQuestions() {
    const questionEls = queryQuestionEls();
    return questionEls.map(el => {
      const textEl = el.querySelector('[data-message-author-role]');
      return textEl?.innerText || '';
    }).filter(Boolean); // Loại bỏ các giá trị rỗng (Remove empty values)
  }

  // Lấy ID cuộc hội thoại từ URL (Get conversation ID from URL)
  function getConversationIdByUrl() {
    const match = location.pathname.match(/\/c\/(.*)/);
    return match?.[1] || null;
  }

  // ====== TẠO GIAO DIỆN SIDEBAR (CREATE SIDEBAR UI) ======
  function createSidebar() {
    const sidebar = document.createElement('div');
    sidebar.setAttribute(DOM_MARK, '');
    sidebar.innerHTML = `
      <style>
        /* Styles cho sidebar chính (Main sidebar styles) */
        [${DOM_MARK}] {
          position: fixed;
          top: 10vh;
          right: ${RIGHT_OFFSET_PX}px;
          padding: 12px;
          border-radius: 8px;
          background: rgba(17, 24, 39, 0.95);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          transition: all 0.65s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 1000;
          max-width: 300px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          opacity: 1; /* Mặc định hiển thị rõ (Default fully visible) */
        }

        /* Trạng thái đang kéo (Dragging state) */
        [${DOM_MARK}].dragging {
          transition: none !important;
          cursor: grabbing !important;
          user-select: none !important;
          opacity: 0.9 !important;
        }

        [${DOM_MARK}].dragging * {
          pointer-events: none !important;
          cursor: grabbing !important;
        }

        /* Trạng thái thu gọn (Collapsed state) */
        [${DOM_MARK}].collapsed {
          width: 55px;
          overflow: hidden;
        }

        /* Thu gọn + KHÔNG hover => trong suốt toàn bộ */
        /* Collapsed + NOT hovering => fully transparent */
        [${DOM_MARK}].collapsed:not(.hovering) {
          opacity: ${COLLAPSED_OPACITY};
        }

        [${DOM_MARK}].collapsed .questions-list {
          opacity: 0.8;
          visibility: visible;
          transition: opacity 0.45s ease, visibility 0.45s ease;
        }

        /* Hiển thị đầy đủ khi mở rộng hoặc hover */
        /* Full display when expanded or hovering */
        [${DOM_MARK}]:not(.collapsed) .questions-list,
        [${DOM_MARK}].hovering:not(.dragging) .questions-list {
          opacity: 1;
          visibility: visible;
          transition: opacity 0.45s ease, visibility 0.45s ease;
        }

        /* Trạng thái hover (Hover state) */
        [${DOM_MARK}].hovering:not(.dragging) {
          width: auto;
          max-width: 300px;
          overflow: visible;
          transition: all 0.65s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 1; /* Hover vào để xem nội dung rõ ràng (Hover for clear content view) */
        }

        /* Header của sidebar (Sidebar header) */
        [${DOM_MARK}] .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
          color: #e5e7eb;
          font-weight: 600;
          font-size: 14px;
          white-space: nowrap;
          gap: 8px;
          cursor: default; /* Không còn kéo bằng header (No longer drag by header) */
          user-select: none;
        }

        [${DOM_MARK}] .header:hover {
          background: rgba(255, 255, 255, 0.05);
          margin: -4px -4px 4px -4px;
          padding: 4px;
          border-radius: 4px;
        }

        /* Tiêu đề sidebar (Sidebar title) */
        [${DOM_MARK}] .title {
          opacity: 1;
          transition: opacity 0.45s ease;
          pointer-events: none;
        }

        [${DOM_MARK}].collapsed:not(.hovering) .title {
          opacity: 0;
          width: 0;
          overflow: hidden;
        }

        /* Nút toggle/kéo (Toggle/drag button) */
        [${DOM_MARK}] .toggle-btn {
          cursor: grab; /* Chỉ kéo bằng nút ✮⋆˙ (Only drag using ✮⋆˙ button) */
          opacity: 0.8;
          transition: all 0.45s ease;
          font-size: 20px;
          padding: 2px;
          filter: grayscale(0);
          flex-shrink: 0;
          margin-left: auto;
        }

        [${DOM_MARK}] .toggle-btn:hover {
          opacity: 1;
          transform: scale(1.1);
        }

        [${DOM_MARK}].collapsed .toggle-btn {
          opacity: 1;
          filter: grayscale(0);
        }

        /* Danh sách câu hỏi (Questions list) */
        [${DOM_MARK}] .questions-list {
          max-height: 60vh;
          overflow-y: auto;
          margin: 0;
          padding: 0;
          list-style: none;
        }

        /* Thanh cuộn tùy chỉnh (Custom scrollbar) */
        [${DOM_MARK}] .questions-list::-webkit-scrollbar {
          width: 4px;
        }

        [${DOM_MARK}] .questions-list::-webkit-scrollbar-track {
          background: transparent;
        }

        [${DOM_MARK}] .questions-list::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 2px;
        }

        [${DOM_MARK}] .questions-list::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        /* Mục câu hỏi (Question item) */
        [${DOM_MARK}] .question-item {
          padding: 6px 8px;
          margin: 2px 0;
          color: #9ca3af;
          font-size: 13px;
          cursor: pointer;
          border-radius: 4px;
          transition: all 0.32s ease;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }

        [${DOM_MARK}].collapsed:not(.hovering) .question-item {
          padding: 6px 4px;
        }

        [${DOM_MARK}] .question-item:hover {
          background: rgba(255, 255, 255, 0.05);
          color: #e5e7eb;
        }

        /* Câu hỏi đang active (Active question) */
        [${DOM_MARK}] .question-item.active {
          background: rgba(16, 185, 129, 0.2);
          color: #10b981;
          font-weight: 500;
        }

        /* Số thứ tự câu hỏi (Question number) */
        [${DOM_MARK}] .question-number {
          flex-shrink: 0;
          font-weight: 600;
          color: #6b7280;
          min-width: 20px;
          text-align: left;
        }

        [${DOM_MARK}] .question-item.active .question-number {
          color: #10b981;
        }

        /* Text câu hỏi (Question text) */
        [${DOM_MARK}] .question-text {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          transition: opacity 0.45s ease;
        }

        [${DOM_MARK}].collapsed:not(.hovering) .question-text {
          opacity: 0;
          width: 0;
        }
      </style>

      <div class="header">
        <span class="title">📋 Questions</span>
        <span class="toggle-btn">✮⋆˙</span>
      </div>
      <ol class="questions-list"></ol>
    `;

    return sidebar;
  }

  // ====== CHỨC NĂNG KÉO THẢ (DRAG FUNCTIONALITY) ======
  // Chỉ kéo khi giữ nút ✮⋆˙ và chỉ thay đổi tọa độ Y (neo bên phải)
  // Only drag when holding ✮⋆˙ button and only change Y coordinate (anchored to right)
  function setupDragBehavior(sidebar) {
    const toggleBtn = sidebar.querySelector('.toggle-btn');
    let isPointerDown = false;
    let isDragging = false;
    let startY = 0;
    let startTop = 0;
    let ignoreNextClick = false;

    // Luôn neo bên phải (Always anchor to the right)
    sidebar.style.right = RIGHT_OFFSET_PX + 'px';
    sidebar.style.left = '';

    // Load vị trí top đã lưu (nếu có) / Load saved top position (if exists)
    const savedTop = localStorage.getItem('chatgpt-sidebar-top');
    if (savedTop) {
      sidebar.style.top = savedTop;
    }

    // Xóa giá trị right cũ không dùng nữa (Remove unused old right value)
    try { localStorage.removeItem('chatgpt-sidebar-right'); } catch {}

    // Bắt đầu kéo (Start dragging)
    function onPointerDown(e) {
      // Chỉ cho phép kéo khi bấm lên nút ✮⋆˙
      // Only allow dragging when clicking on ✮⋆˙ button
      if (e.target !== toggleBtn) return;

      isPointerDown = true;
      isDragging = false;
      startY = (e.touches ? e.touches[0].clientY : e.clientY);
      startTop = sidebar.getBoundingClientRect().top;

      // Lắng nghe di chuyển/thả trên document
      // Listen for move/release on document
      document.addEventListener('mousemove', onPointerMove);
      document.addEventListener('mouseup', onPointerUp);
      document.addEventListener('touchmove', onPointerMove, { passive: false });
      document.addEventListener('touchend', onPointerUp);
    }

    // Xử lý di chuyển chuột/touch (Handle mouse/touch move)
    function onPointerMove(e) {
      if (!isPointerDown) return;

      const clientY = (e.touches ? e.touches[0].clientY : e.clientY);
      const deltaY = clientY - startY;

      // Kiểm tra ngưỡng để bắt đầu kéo (Check threshold to start dragging)
      if (!isDragging && Math.abs(deltaY) > DRAG_THRESHOLD_PX) {
        isDragging = true;
        sidebar.classList.add('dragging');
        sidebar.classList.remove('hovering');
      }

      if (!isDragging) return;

      // Tính top mới, chỉ theo trục Y (Calculate new top, only Y axis)
      const rect = sidebar.getBoundingClientRect();
      const minTop = TOP_MIN_MARGIN;
      const maxTop = window.innerHeight - rect.height - BOTTOM_MIN_MARGIN;

      let newTop = startTop + deltaY;
      newTop = Math.max(minTop, Math.min(newTop, maxTop)); // Giới hạn trong vùng cho phép (Limit within allowed area)

      // Áp dụng vị trí (Apply position)
      sidebar.style.top = newTop + 'px';
      sidebar.style.right = RIGHT_OFFSET_PX + 'px';
      sidebar.style.left = '';

      e.preventDefault();
      e.stopPropagation();
    }

    // Kết thúc kéo (End dragging)
    function onPointerUp() {
      if (!isPointerDown) return;

      if (isDragging) {
        // Lưu tọa độ Y (top) và vẫn neo phải
        // Save Y coordinate (top) and keep anchored to right
        const rect = sidebar.getBoundingClientRect();
        localStorage.setItem('chatgpt-sidebar-top', rect.top + 'px');
        sidebar.style.right = RIGHT_OFFSET_PX + 'px';

        // Tránh click toggle ngay sau khi kéo
        // Avoid toggle click right after dragging
        ignoreNextClick = true;
        setTimeout(() => { ignoreNextClick = false; }, 0);
      }

      isPointerDown = false;
      isDragging = false;
      sidebar.classList.remove('dragging');

      // Gỡ bỏ các event listeners (Remove event listeners)
      document.removeEventListener('mousemove', onPointerMove);
      document.removeEventListener('mouseup', onPointerUp);
      document.removeEventListener('touchmove', onPointerMove);
      document.removeEventListener('touchend', onPointerUp);
    }

    // Click nút ✮⋆˙: toggle thu gọn/mở rộng (trừ khi vừa kéo)
    // Click ✮⋆˙ button: toggle collapse/expand (except after dragging)
    function onToggleClick(e) {
      if (ignoreNextClick) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      e.stopPropagation();
      toggleSidebar(sidebar);
    }

    // Gắn events (Attach events)
    toggleBtn.addEventListener('mousedown', onPointerDown);
    toggleBtn.addEventListener('touchstart', onPointerDown, { passive: true });
    toggleBtn.addEventListener('click', onToggleClick);

    // Hàm dọn dẹp (Cleanup function)
    sidebar._cleanupDrag = () => {
      toggleBtn.removeEventListener('mousedown', onPointerDown);
      toggleBtn.removeEventListener('touchstart', onPointerDown);
      toggleBtn.removeEventListener('click', onToggleClick);
      document.removeEventListener('mousemove', onPointerMove);
      document.removeEventListener('mouseup', onPointerUp);
      document.removeEventListener('touchmove', onPointerMove);
      document.removeEventListener('touchend', onPointerUp);
    };
  }

  // Cuộn danh sách sidebar xuống cuối (Scroll sidebar list to bottom)
  function scrollSidebarToBottom(sidebar) {
    const list = sidebar.querySelector('.questions-list');
    if (list) {
      list.scrollTop = list.scrollHeight;
      // Đảm bảo cuộn sau khi render (Ensure scroll after render)
      setTimeout(() => {
        list.scrollTop = list.scrollHeight;
      }, 100);
    }
  }

  // ====== QUẢN LÝ CÂU HỎI ACTIVE (ACTIVE QUESTION MANAGEMENT) ======
  // Set câu hỏi cụ thể làm active
  // Set specific question as active
  // scrollChat: true => cuộn KHUNG CHAT tới câu hỏi đó (scroll CHAT FRAME to that question)
  // scrollChat: false => KHÔNG đụng tới khung chat, chỉ highlight (DON'T touch chat frame, only highlight)
  function setActiveQuestion(sidebar, index, questionEls, opts = {}) {
    const { scrollChat = true } = opts;

    // Cập nhật class active cho các mục trong sidebar
    // Update active class for sidebar items
    sidebar.querySelectorAll('.question-item').forEach((item, i) => {
      item.classList.toggle('active', i === index);
    });

    // Cuộn khung chat nếu được yêu cầu (Scroll chat frame if requested)
    if (scrollChat && questionEls[index]) {
      setTimeout(() => {
        questionEls[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }

  // Cập nhật câu hỏi active dựa trên vị trí scroll (không cuộn chat)
  // Update active question based on scroll position (without scrolling chat)
  function updateActiveQuestion(sidebar, questionEls) {
    const topThreshold = isSharePage ? scrollMarginTop : 0;
    let activeIndex = -1;

    // Tìm câu hỏi đầu tiên xuất hiện trong viewport
    // Find first question appearing in viewport
    for (let i = 0; i < questionEls.length; i++) {
      const rect = questionEls[i].getBoundingClientRect();
      if (rect.top >= topThreshold) {
        activeIndex = i;
        break;
      }
    }

    // Cập nhật class active (Update active class)
    sidebar.querySelectorAll('.question-item').forEach((item, index) => {
      item.classList.toggle('active', index === activeIndex);
    });
  }

  // ====== CẬP NHẬT DANH SÁCH CÂU HỎI (UPDATE QUESTIONS LIST) ======
  // Cập nhật danh sách câu hỏi (đảm bảo dính cuối nếu cần, và KHÔNG cuộn khung chat khi khởi tạo)
  // Update questions list (ensure stick to bottom if needed, and DON'T scroll chat frame on init)
  function updateQuestionsList(sidebar, scrollToLast = false) {
    const list = sidebar.querySelector('.questions-list');
    if (!list) return;

    const questions = getQuestions();
    const questionEls = queryQuestionEls();

    // Lưu vị trí cuộn trước khi rebuild (Save scroll position before rebuild)
    const prevScrollTop = list.scrollTop;
    const prevAtBottom = (list.scrollTop + list.clientHeight >= list.scrollHeight - 5);

    // Rebuild danh sách (Rebuild list)
    list.innerHTML = questions.map((q, index) => `
      <li class="question-item" data-index="${index}">
        <span class="question-number">${index + 1}.</span>
        <span class="question-text">${q}</span>
      </li>
    `).join('');

    // Kiểm tra có nên dính cuối không (Check if should stick to bottom)
    const forceWindow = Date.now() < (sidebar._forceBottomUntil || 0);
    const shouldStick = scrollToLast || forceWindow || sidebar._stickToBottom || prevAtBottom;

    if (questions.length > 0 && shouldStick) {
      // Quan trọng: KHÔNG cuộn khung chat ở nhánh này
      // Important: DON'T scroll chat frame in this branch
      setActiveQuestion(sidebar, questions.length - 1, questionEls, { scrollChat: false });
      requestAnimationFrame(() => scrollSidebarToBottom(sidebar));
    } else {
      updateActiveQuestion(sidebar, questionEls);
      // Khôi phục vị trí cuộn nếu không dính cuối
      // Restore scroll position if not sticking to bottom
      requestAnimationFrame(() => { list.scrollTop = prevScrollTop; });
    }
  }

  // Xử lý click vào câu hỏi (click mới cuộn khung chat)
  // Handle click on question (only click scrolls chat frame)
  function handleQuestionClick(e, sidebar) {
    const item = e.target.closest('.question-item');
    if (!item) return;

    const index = parseInt(item.dataset.index);
    const questionEls = queryQuestionEls();

    // Click => cuộn khung chat tới câu hỏi đó + set active
    // Click => scroll chat frame to that question + set active
    setActiveQuestion(sidebar, index, questionEls, { scrollChat: true });
  }

  // Toggle thu gọn/mở rộng sidebar (Toggle collapse/expand sidebar)
  function toggleSidebar(sidebar) {
    const isCollapsed = sidebar.classList.contains('collapsed');
    sidebar.classList.toggle('collapsed');
    sidebar.classList.remove('hovering');
    sidebar._isManuallyToggled = true;
    sidebar._isOpen = isCollapsed;
  }

  // ====== CHỨC NĂNG HOVER (HOVER FUNCTIONALITY) ======
  function setupHoverBehavior(sidebar) {
    let hoverTimeout;

    // Khi di chuột vào (On mouse enter)
    sidebar.addEventListener('mouseenter', () => {
      if (!sidebar.classList.contains('dragging')) {
        clearTimeout(hoverTimeout);
        sidebar.classList.add('hovering');
      }
    });

    // Khi di chuột ra (On mouse leave)
    sidebar.addEventListener('mouseleave', () => {
      if (!sidebar.classList.contains('dragging')) {
        clearTimeout(hoverTimeout);
        // Delay trước khi tắt hover (Delay before removing hover)
        hoverTimeout = setTimeout(() => {
          sidebar.classList.remove('hovering');
        }, 234);
      }
    });
  }

  // ====== KHỞI TẠO CHÍNH (MAIN INITIALIZATION) ======
  function init(isFirstLoad = false) {
    // Xóa sidebar cũ nếu có (Remove old sidebar if exists)
    const existing = document.querySelector(`[${DOM_MARK}]`);
    if (existing) {
      existing._cleanup?.();
      existing._cleanupDrag?.();
      existing.remove();
    }

    // Kiểm tra có câu hỏi không (Check if there are questions)
    const questionEls = queryQuestionEls();
    if (questionEls.length === 0) return;

    // Tạo và thêm sidebar mới (Create and add new sidebar)
    const sidebar = createSidebar();
    document.body.appendChild(sidebar);

    // Khởi tạo trạng thái (Initialize state)
    sidebar._isManuallyToggled = false;
    sidebar._isOpen = false;
    sidebar.classList.add('collapsed');

    const list = sidebar.querySelector('.questions-list');

    // Trạng thái "dính cuối" (Stick to bottom state)
    sidebar._stickToBottom = true; // Lần đầu luôn coi như dính cuối (First time always stick to bottom)
    sidebar._forceBottomUntil = Date.now() + FORCE_STICK_BOTTOM_MS;

    // Theo dõi scroll của sidebar để biết khi nào người dùng kéo lên
    // Track sidebar scroll to know when user scrolls up
    list.addEventListener('scroll', () => {
      const atBottom = (list.scrollTop + list.clientHeight >= list.scrollHeight - 5);
      sidebar._stickToBottom = atBottom;
    });

    // Click câu hỏi (Question click)
    list.addEventListener('click', (e) => handleQuestionClick(e, sidebar));

    // Setup các behavior (Setup behaviors)
    setupHoverBehavior(sidebar);
    setupDragBehavior(sidebar);

    // Lần đầu: build list và chỉ cuộn sidebar về cuối (không đụng tới chat)
    // First time: build list and only scroll sidebar to bottom (don't touch chat)
    updateQuestionsList(sidebar, isFirstLoad);

    // Theo dõi scroll của khung chat (Track chat frame scroll)
    const scrollContainer = queryChatContainer()?.parentElement;
    if (scrollContainer) {
      let scrollTimeout;
      scrollContainer.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        // Debounce để tránh cập nhật quá nhiều (Debounce to avoid too many updates)
        scrollTimeout = setTimeout(() => {
          updateActiveQuestion(sidebar, queryQuestionEls());
        }, 50);
      });
    }

    // Quan sát thay đổi DOM để cập nhật danh sách
    // Observe DOM changes to update list
    const observer = new MutationObserver(() => {
      updateQuestionsList(sidebar);
    });

    const chatContainer = queryChatContainer();
    if (chatContainer) {
      observer.observe(chatContainer, { childList: true });
    }

    // Hàm dọn dẹp (Cleanup function)
    sidebar._cleanup = () => {
      observer.disconnect();
    };
  }

  // ====== GIÁM SÁT THAY ĐỔI (MONITOR FOR CHANGES) ======
  let loaded = false;
  let conversationId = null;
  let isInitialLoad = true;

  // Kiểm tra định kỳ để phát hiện thay đổi conversation
  // Periodically check to detect conversation changes
  setInterval(() => {
    const latestConversationId = getConversationIdByUrl();
    const hasQuestions = queryQuestionEls().length > 0;

    // Nếu conversation thay đổi hoặc không có câu hỏi
    // If conversation changed or no questions
    if (conversationId !== latestConversationId || !hasQuestions) {
      conversationId = latestConversationId;

      // Xóa sidebar cũ (Remove old sidebar)
      const existing = document.querySelector(`[${DOM_MARK}]`);
      if (existing) {
        existing._cleanup?.();
        existing._cleanupDrag?.();
        existing.remove();
      }
      loaded = false;

      // Reset trạng thái initial load khi đổi conversation
      // Reset initial load state when conversation changes
      if (conversationId !== latestConversationId) {
        isInitialLoad = true;
      }
    }

    // Khởi tạo sidebar mới nếu có câu hỏi
    // Initialize new sidebar if there are questions
    if (!loaded && hasQuestions) {
      init(isInitialLoad);
      loaded = true;
      isInitialLoad = false;
    }
  }, 600); // Kiểm tra mỗi 600ms (Check every 600ms)
})();