function enableTooltips() {
  const createTooltip = ({
    target,
    message,
    position = 'top',
    bgColor = '#333',
    color = '#fff',
    motion = 'fade',
    delay = 0,
    duration = 2000,
    onHide = null,
  }) => {
    if (target._tooltipActive) return;
    target._tooltipActive = true;

    const tooltip = document.createElement('div');
    const arrow = document.createElement('div');
    tooltip.appendChild(arrow);
    document.body.appendChild(tooltip);

    // 스타일 초기화
    Object.assign(tooltip.style, {
      position: 'absolute',
      padding: '6px 10px',
      borderRadius: '6px',
      fontSize: '14px',
      pointerEvents: 'none',
      whiteSpace: 'nowrap',
      zIndex: '9999',
      opacity: '0',
      transition: 'opacity 0.3s ease, transform 0.3s ease',
      backgroundColor: bgColor,
      color,
      maxWidth: 'calc(100vw - 20px)',
    });

    Object.assign(arrow.style, {
      position: 'absolute',
      width: '0',
      height: '0',
    });

    const setArrowStyle = () => {
      arrow.style.border = 'none';
      switch (position) {
        case 'top':
          Object.assign(arrow.style, {
            bottom: '-6px',
            left: '50%',
            transform: 'translateX(-50%)',
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderTop: '6px solid #333',
          });
          break;
        case 'bottom':
          Object.assign(arrow.style, {
            top: '-6px',
            left: '50%',
            transform: 'translateX(-50%)',
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderBottom: '6px solid #333',
          });
          break;
        case 'left':
          Object.assign(arrow.style, {
            top: '50%',
            right: '-6px',
            transform: 'translateY(-50%)',
            borderTop: '6px solid transparent',
            borderBottom: '6px solid transparent',
            borderLeft: '6px solid #333',
          });
          break;
        case 'right':
          Object.assign(arrow.style, {
            top: '50%',
            left: '-6px',
            transform: 'translateY(-50%)',
            borderTop: '6px solid transparent',
            borderBottom: '6px solid transparent',
            borderRight: '6px solid #333',
          });
          break;
      }
    };

    const show = () => {
      const rect = target.getBoundingClientRect();
      const scrollY = window.scrollY || 0;
      const scrollX = window.scrollX || 0;

      let x = rect.left + rect.width / 2 + scrollX;
      let y = rect.top + scrollY;

      tooltip.innerText = message;
      tooltip.appendChild(arrow);
      setArrowStyle();

      switch (position) {
        case 'top':
          y = rect.top - 0 + scrollY;
          tooltip.style.transform = motion === 'slide' ? 'translate(-50%, -120%)' : 'translate(-50%, -100%)';
          break;
        case 'bottom':
          y = rect.bottom + 0 + scrollY;
          tooltip.style.transform = motion === 'slide' ? 'translate(-50%, 20px)' : 'translate(-50%, 10px)';
          break;
        case 'left':
          x = rect.left - 0 + scrollX;
          y = rect.top + rect.height / 2 + scrollY;
          tooltip.style.transform = motion === 'slide' ? 'translate(-120%, -50%)' : 'translate(-105%, -50%)';
          break;
        case 'right':
          x = rect.right + 0 + scrollX;
          y = rect.top + rect.height / 2 + scrollY;
          tooltip.style.transform = motion === 'slide' ? 'translate(20%, -50%)' : 'translate(5%, -50%)';
          break;
      }

      tooltip.style.left = `${x}px`;
      tooltip.style.top = `${y}px`;

      requestAnimationFrame(() => {
        tooltip.style.opacity = '1';
      });

      // 위치 보정 (툴팁이 화면 밖으로 벗어나지 않게)
      requestAnimationFrame(() => {
        const tipRect = tooltip.getBoundingClientRect();
        const padding = 8;
        const overflowRight = tipRect.right - window.innerWidth;
        const overflowLeft = -tipRect.left;

        if (overflowRight > 0) {
          tooltip.style.left = `${x - overflowRight - padding}px`;
        }
        if (overflowLeft > 0) {
          tooltip.style.left = `${x + overflowLeft + padding}px`;
        }
      });

      // 사라짐 처리
      setTimeout(() => {
        tooltip.style.opacity = '0';
        setTimeout(() => {
          tooltip.remove();
          target._tooltipActive = false;
          if (typeof window[onHide] === 'function') {
            window[onHide](target);
          }
        }, 300);
      }, duration);
    };

    setTimeout(show, delay);
  };

  // 바인딩
  const elements = document.querySelectorAll('[tooltip]');
  elements.forEach(el => {
    const handler = () => {
      const content = el.getAttribute('tooltip');
      if (!content) return;

      createTooltip({
        target: el,
        message: content,
        position: el.getAttribute('tooltip-position') || 'top',
        bgColor: el.getAttribute('tooltip-bg') || '#333',
        color: el.getAttribute('tooltip-color') || '#fff',
        motion: el.getAttribute('tooltip-motion') || 'fade',
        delay: parseInt(el.getAttribute('tooltip-delay') || '0', 10),
        duration: parseInt(el.getAttribute('tooltip-duration') || '2000', 10),
        onHide: el.getAttribute('tooltip-on-hide'),
      });
    };

    const useHover = el.getAttribute('tooltip-hover') === 'true';

    if (useHover) {
      el.addEventListener('mouseenter', handler);
      el.addEventListener('mouseleave', () => {
        // 자동 제거는 내부적으로 처리됨
      });
    } else {
      el.addEventListener('click', handler);
      el.addEventListener('touchstart', handler);
      el.addEventListener('focusin', handler);
    }
  });
}
