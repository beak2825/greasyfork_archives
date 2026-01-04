// ==UserScript==
// @name         Element Selector Inspector - Advanced (Multiple Selections & Strict Relationships)
// @namespace    http://tampermonkey.net/
// @version      3.8
// @description  Click: Main, Alt+Click: Addition, Ctrl+Click: Excluded. Supports multiple selections per type & strict relationship rules.
// @author       lmdw
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537431/Element%20Selector%20Inspector%20-%20Advanced%20%28Multiple%20Selections%20%20Strict%20Relationships%29.user.js
// @updateURL https://update.greasyfork.org/scripts/537431/Element%20Selector%20Inspector%20-%20Advanced%20%28Multiple%20Selections%20%20Strict%20Relationships%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Tùy chỉnh ---
    let activated = false;
    const toggleKey = { ctrl: true, alt: true, key: '1' }; // Phím tắt để bật/tắt (Ctrl+Alt+1)
    const overlayPadding = 4; // Khoảng cách giữa overlay và phần tử
    const hoverColor = 'rgba(255,223,0,0.8)'; // Màu khi di chuột
    const mainColor = 'rgba(255,165,0,1)'; // Màu phần tử chính (vàng cam)
    const additionColor = 'rgba(0,255,0,1)'; // Màu phần tử bổ sung (xanh lá)
    const excludeColor = 'rgba(255,0,0,1)'; // Màu phần tử loại trừ (đỏ)
    const infoLabelBackground = 'rgba(255,223,0,0.95)'; // Màu nền của info label

    // --- Biến toàn cục (Lưu trữ các Set phần tử đã chọn) ---
    let hoverOverlay, infoLabel;
    let mainElements = new Set(); // Các phần tử chính
    let additionElements = new Set(); // Các phần tử bổ sung
    let excludedElements = new Set(); // Các phần tử loại trừ

    // --- Ánh xạ phần tử sang overlay ---
    // Sử dụng WeakMap để tránh rò rỉ bộ nhớ nếu phần tử bị xóa khỏi DOM
    const elementOverlayMap = new WeakMap();
    const elementInfoMap = new WeakMap(); // Có thể không cần thiết nếu infoLabel chỉ hiển thị cho hover

    // --- Hàm tạo overlay chung ---
    function createOverlays() {
        if (!hoverOverlay) {
            hoverOverlay = document.createElement('div');
             // Style chung cho hover overlay
            Object.assign(hoverOverlay.style, {
                position: 'absolute',
                borderRadius: '4px',
                pointerEvents: 'none',
                zIndex: 2147483646,
                display: 'none',
                boxSizing: 'border-box',
                border: `2px solid ${hoverColor}`,
                background: hoverColor.replace(/[^,]+(?=\))/, '0.1')
            });
            document.body.appendChild(hoverOverlay);
        }
        if (!infoLabel) {
            infoLabel = document.createElement('div');
             // Style cho info label
            Object.assign(infoLabel.style, {
                position: 'absolute',
                padding: '2px 6px',
                background: infoLabelBackground,
                color: '#000',
                fontSize: '12px',
                fontFamily: 'Arial',
                borderRadius: '4px',
                pointerEvents: 'none',
                zIndex: 2147483647,
                whiteSpace: 'nowrap',
                display: 'none'
            });
            document.body.appendChild(infoLabel);
        }
    }

    // --- Hàm cập nhật vị trí và kích thước overlay ---
    function updateOverlay(overlay, el) {
        try {
            const rect = el.getBoundingClientRect();
             // Kiểm tra nếu phần tử không còn trong viewport hoặc có kích thước không hợp lệ
            if (rect.width === 0 || rect.height === 0 || rect.right < 0 || rect.bottom < 0 || rect.left > window.innerWidth || rect.top > window.innerHeight) {
                 overlay.style.display = 'none'; // Ẩn overlay nếu phần tử không hiển thị
                 return false; // Báo hiệu không cập nhật thành công
            }

            overlay.style.top = `${rect.top + window.scrollY - overlayPadding}px`;
            overlay.style.left = `${rect.left + window.scrollX - overlayPadding}px`;
            overlay.style.width = `${rect.width + overlayPadding * 2}px`;
            overlay.style.height = `${rect.height + overlayPadding * 2}px`;
            overlay.style.display = 'block';
            return true; // Báo hiệu cập nhật thành công
        } catch (e) {
            // Xử lý lỗi nếu getBoundingClientRect thất bại (ví dụ: phần tử bị display: none đột ngột)
            overlay.style.display = 'none';
            console.warn("Error updating overlay for element:", el, e);
            return false;
        }
    }


    // --- Hàm cập nhật thông tin trên label ---
    function updateInfoLabel(el, x, y) {
        const tag = el.tagName.toLowerCase();
        const id = el.id ? `#${el.id}` : '';
        // Lấy các class và lọc bỏ khoảng trắng thừa, sau đó nối lại
        const classes = el.className ? `.${el.className.trim().split(/\s+/).filter(cls => cls.length > 0).join('.')}` : '';

        infoLabel.textContent = `${tag}${id}${classes}`;
        infoLabel.style.top = `${y + 15 + window.scrollY}px`;
        infoLabel.style.left = `${x + 15 + window.scrollX}px`;
        infoLabel.style.display = 'block';
    }

    // --- Hàm xử lý mouseover ---
    function mouseOver(e) {
        // Bỏ qua nếu không activated, hoặc di chuột vào chính overlay/label, hoặc root document
        if (!activated || e.target === hoverOverlay || e.target === infoLabel || e.target === document.documentElement || e.target === document.body) return;

        // Tránh cập nhật nếu di chuột qua một phần tử đã có overlay (tránh nhấp nháy)
        // if (elementOverlayMap.has(e.target)) return; // Commented out - want hover overlay even on selected

        updateOverlay(hoverOverlay, e.target);
        updateInfoLabel(e.target, e.clientX, e.clientY);
    }

    // --- Hàm xử lý mouseout/mouseleave ---
    function mouseOut(e) {
        if (!activated) return;
        // Ẩn label và hover overlay khi chuột rời khỏi bất kỳ phần tử nào (hoặc trang)
        hoverOverlay.style.display = 'none';
        infoLabel.style.display = 'none';
    }

    // --- Hàm tạo và trả về overlay với style và zIndex ---
    function createAndStoreOverlay(el, color, zIndex, hatched = false) {
        // Kiểm tra nếu overlay đã tồn tại cho phần tử này, xóa nó trước
        if (elementOverlayMap.has(el)) {
             removeOverlay(el);
        }

        const overlay = document.createElement('div');
        Object.assign(overlay.style, {
            position: 'absolute',
            borderRadius: '4px',
            pointerEvents: 'none',
            boxSizing: 'border-box',
            border: `2px solid ${color}`,
            background: color.replace(/[^,]+(?=\))/, '0.2'),
            display: 'block',
            zIndex: zIndex,
            opacity: 1, // Mặc định là 1
            transition: 'opacity 0.2s ease' // Thêm transition cho hiệu ứng mờ dần khi xóa
        });
        if (hatched) {
            overlay.style.backgroundImage = 'linear-gradient(45deg, rgba(0,0,0,0.1) 25%, transparent 25%, transparent 50%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.1) 75%, transparent 75%, transparent)';
            overlay.style.backgroundSize = '20px 20px';
        }

        // Thử cập nhật vị trí, nếu thất bại (phần tử không hiển thị), không thêm overlay
        if (!updateOverlay(overlay, el)) {
             return null; // Không thêm overlay nếu phần tử không hiển thị
        }

        document.body.appendChild(overlay);
        elementOverlayMap.set(el, overlay); // Lưu trữ tham chiếu overlay
        return overlay;
    }

    // --- Hàm xóa overlay của một phần tử ---
    function removeOverlay(el) {
        const overlay = elementOverlayMap.get(el);
        if (overlay) {
            // Sử dụng transition để mờ dần trước khi xóa
            overlay.style.opacity = 0;
            overlay.addEventListener('transitionend', function() {
                 if (overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                 }
            });
            elementOverlayMap.delete(el);
        }
    }

    // --- Helper: Kiểm tra mối quan hệ (chứa, bị chứa, hoặc giống nhau) ---
    function isRelated(el1, el2) {
        if (!el1 || !el2) return false;
         // Kiểm tra nếu el1 hoặc el2 không còn trong DOM
        if (!el1.isConnected || !el2.isConnected) return false;
        return el1 === el2 || el1.contains(el2) || el2.contains(el1);
    }

    // --- Helper: Kiểm tra nếu element là tổ tiên của bất kỳ phần tử nào trong set ---
    function isAncestorOfAnyInSet(element, set) {
        if (!element || !set || set.size === 0) return false;
        for (const el of set) {
            if (element !== el && element.contains(el)) {
                return true;
            }
        }
        return false;
    }

     // --- Helper: Kiểm tra nếu element là con cháu của bất kỳ phần tử nào trong set ---
    function isDescendantOfAnyInSet(element, set) {
         if (!element || !set || set.size === 0) return false;
         for (const el of set) {
             if (element !== el && el.contains(element)) {
                 return true;
             }
         }
         return false;
    }

    // --- Helper: Kiểm tra nếu element là con cháu của bất kỳ phần tử nào trong Main hoặc Addition ---
    function isDescendantOfAnyMainOrAddition(element) {
        return isDescendantOfAnyInSet(element, mainElements) || isDescendantOfAnyInSet(element, additionElements);
    }

    // --- Hàm xóa phần tử và overlay của nó theo loại ---
    function removeElement(el, type) {
        let targetSet;
        let overlayProp;
        let zIndex;

        switch (type) {
            case 'main':
                targetSet = mainElements;
                overlayProp = 'mainOverlay';
                zIndex = 2147483645;
                break;
            case 'addition':
                targetSet = additionElements;
                overlayProp = 'additionOverlay';
                zIndex = 2147483646;
                break;
            case 'exclude':
                targetSet = excludedElements;
                overlayProp = 'excludeOverlay';
                zIndex = 2147483647;
                break;
            default:
                console.error("Invalid removal type:", type);
                return;
        }

        if (targetSet.has(el)) {
            targetSet.delete(el);
            removeOverlay(el); // Xóa overlay qua WeakMap

            // Xử lý dọn dẹp các phần tử Excluded là con cháu của phần tử vừa xóa
            if (type === 'main' || type === 'addition') {
                const excludedToRemove = [];
                excludedElements.forEach(ex => {
                    // Nếu Excluded này là con cháu của `el` VÀ không phải con cháu của bất kỳ Main/Addition còn lại nào
                    if (el.contains(ex) && !isDescendantOfAnyMainOrAddition(ex)) {
                        excludedToRemove.push(ex);
                    }
                });
                excludedToRemove.forEach(ex => removeElement(ex, 'exclude'));
                if (excludedToRemove.length > 0) {
                    console.log(`Removed ${excludedToRemove.length} Excluded elements dependent on the removed ${type} element.`);
                }
            }
             console.log(`${type.charAt(0).toUpperCase() + type.slice(1)} Element Removed:`, el);
        } else {
             // console.warn(`Attempted to remove a ${type} element that was not in the set:`, el);
        }
    }

    // --- Hàm xử lý sự kiện click ---
    function clickHandler(e) {
        // Bỏ qua nếu không activated, hoặc click vào chính overlay/label
        if (!activated || e.target === hoverOverlay || e.target === infoLabel) return;

        e.preventDefault();
        e.stopPropagation();

        const target = e.target;
        let mode = null;
        let targetSet = null;
        let overlayColor = null;
        let overlayZIndex = null;
        let isHatched = false;

        // Xác định chế độ click
        if (!e.ctrlKey && !e.altKey) {
            mode = 'main';
            targetSet = mainElements;
            overlayColor = mainColor;
            overlayZIndex = 2147483645;
        } else if (e.altKey && !e.ctrlKey) {
            mode = 'addition';
            targetSet = additionElements;
            overlayColor = additionColor;
            overlayZIndex = 2147483646;
        } else if (e.ctrlKey && !e.altKey) {
            mode = 'exclude';
            targetSet = excludedElements;
            overlayColor = excludeColor;
            overlayZIndex = 2147483647;
            isHatched = true;
        } else {
            // Tổ hợp phím không xác định, bỏ qua
            console.log("Unknown key combination clicked.");
            return;
        }

         // --- Bước 1: Xử lý Bỏ chọn (nếu click vào phần tử đã chọn cùng loại) ---
        if (targetSet.has(target)) {
            removeElement(target, mode);
            return; // Đã xử lý, thoát
        }

        // --- Bước 2: Xử lý Logic Tổ tiên/Con cháu trong CÙNG loại ---
        // Nếu target là con cháu của phần tử đã chọn cùng loại, bỏ qua click này cho loại đó
        if (isDescendantOfAnyInSet(target, targetSet)) {
             console.log(`Clicked element is a descendant of an already selected ${mode} element. Ignoring.`);
             return; // Đã xử lý, thoát
        }

        // Nếu target là tổ tiên của phần tử đã chọn cùng loại, xóa các con cháu đó
        const descendantsToRemoveInSameMode = [];
        targetSet.forEach(el => {
            if (target.contains(el)) {
                descendantsToRemoveInSameMode.push(el);
            }
        });
        descendantsToRemoveInSameMode.forEach(el => removeElement(el, mode));
        if (descendantsToRemoveInSameMode.length > 0) {
             console.log(`Clicked element is an ancestor of selected ${mode} elements. Replaced descendants with ancestor.`);
        }

        // --- Bước 3: Xử lý Logic Quan hệ giữa CÁC loại ---

        // Chụp lại trạng thái hiện tại trước khi xử lý xung đột
        const initiallySelectedAsMain = mainElements.has(target);
        const initiallySelectedAsAddition = additionElements.has(target);
        const initiallySelectedAsExcluded = excludedElements.has(target);

        let allowAdd = true; // Cờ để quyết định có thêm target vào targetSet cuối cùng không

        if (mode === 'main') {
            // Nếu click Main, xóa mọi phần tử Addition có quan hệ với target
            const additionsToRemove = [];
            additionElements.forEach(addEl => {
                 if (isRelated(target, addEl)) {
                     additionsToRemove.push(addEl);
                 }
            });
            additionsToRemove.forEach(addEl => removeElement(addEl, 'addition'));
            if (additionsToRemove.length > 0) {
                console.log(`Conflict with Addition elements on Main click. Removed ${additionsToRemove.length} conflicting Additions.`);
            }

            // Nếu target là Excluded, xóa nó khỏi Excluded
            if (initiallySelectedAsExcluded) {
                 removeElement(target, 'exclude');
                 console.log(`Element was Excluded. Removed exclusion on Main click.`);
            }

        } else if (mode === 'addition') {
             // Nếu click Addition, kiểm tra xem có quan hệ với Main không
            const mainsRelated = Array.from(mainElements).filter(mainEl => isRelated(target, mainEl));
            if (mainsRelated.length > 0) {
                 // Yêu cầu: ưu tiên Main, vô hiệu hóa click Addition nếu xung đột
                 console.log('Invalid Addition element: Related to a Main element. Ignoring Addition click.');
                 allowAdd = false; // Không cho phép thêm vào Addition
            } else {
                // Nếu không xung đột với Main, kiểm tra và xóa khỏi Excluded nếu cần
                 if (initiallySelectedAsExcluded) {
                     removeElement(target, 'exclude');
                     console.log(`Element was Excluded. Removed exclusion on Addition click.`);
                 }
                 // Không cần kiểm tra xung đột giữa Addition với Addition khác theo yêu cầu
            }

        } else if (mode === 'exclude') {
             // Nếu click Excluded, kiểm tra xem có phải là con cháu của Main hoặc Addition không
            const isValidExclude = isDescendantOfAnyMainOrAddition(target);

            if (!isValidExclude) {
                 console.log('Invalid Excluded element: Not a child/descendant of any Main or Addition element. Ignoring click.');
                 allowAdd = false; // Không cho phép thêm vào Excluded
            } else {
                 // Nếu hợp lệ làm Excluded, kiểm tra và xóa khỏi Main hoặc Addition nếu cần
                 if (initiallySelectedAsMain) {
                     removeElement(target, 'main');
                     console.log(`Element was Main. Removed Main selection on Excluded click.`);
                 }
                 if (initiallySelectedAsAddition) {
                     removeElement(target, 'addition');
                     console.log(`Element was Addition. Removed Addition selection on Excluded click.`);
                 }
            }
        }

        // --- Bước 4: Thêm phần tử (nếu được phép) và tạo Overlay ---
        if (allowAdd) {
            // Kiểm tra lại lần cuối xem phần tử có còn hợp lệ để thêm vào set hiện tại sau khi xử lý xung đột không
            // (Ví dụ: bấm Ctrl+Click vào 1 phần tử, nó xóa Main/Addition chứa nó, nhưng nó lại không phải con của bất kỳ Main/Addition còn lại nào)
             if (mode === 'exclude') {
                 // Riêng với Exclude, cần kiểm tra lại điều kiện con cháu sau khi potentially xóa Main/Addition cha
                 if (!isDescendantOfAnyMainOrAddition(target)) {
                      console.log('Element became invalid for Excluded after removing its parent Main/Addition. Ignoring add.');
                      allowAdd = false; // Không thêm nếu không còn cha hợp lệ
                 }
             }
        }


        if (allowAdd) {
            targetSet.add(target);
            // Tạo/cập nhật overlay
            const overlay = createAndStoreOverlay(target, overlayColor, overlayZIndex, isHatched);
            if (overlay) {
                 console.log(`${mode.charAt(0).toUpperCase() + mode.slice(1)} Element Added:`, target);
            } else {
                 // Xóa khỏi set nếu không tạo được overlay (ví dụ: display: none)
                 targetSet.delete(target);
                 console.log(`Could not add ${mode} element (not visible):`, target);
            }
        }

        // --- Bước 5: Dọn dẹp cuối cùng cho Excluded sau mọi thay đổi ---
        // Đảm bảo tất cả Excluded còn lại đều là con cháu của ít nhất 1 Main hoặc 1 Addition
        const excludedStillValid = new Set();
        excludedElements.forEach(ex => {
            if (isDescendantOfAnyMainOrAddition(ex)) {
                excludedStillValid.add(ex);
            } else {
                removeElement(ex, 'exclude'); // Xóa các Excluded không còn hợp lệ
                console.log('Removed Excluded element that lost its Main/Addition parent:', ex);
            }
        });
         // Cập nhật lại set excludedElements
        excludedElements = excludedStillValid;

         // Note: Có thể cần một logic để cập nhật overlay nếu phần tử thay đổi kích thước/vị trí (cuộn trang, resize)
         // Điều này phức tạp hơn và không nằm trong yêu cầu hiện tại. UpdateOverlay chỉ chạy 1 lần khi tạo.
         // Cần thêm listeners cho scroll/resize để update các overlays đang hiển thị.
    }

    // --- Hàm kích hoạt inspector ---
    function activateInspector() {
        if (!hoverOverlay || !infoLabel) createOverlays();
        document.addEventListener('mouseover', mouseOver, true);
        document.addEventListener('mouseout', mouseOut, true);
        document.addEventListener('mouseleave', mouseOut, true);
        document.addEventListener('click', clickHandler, true);
        // Thêm listener cho scroll/resize để cập nhật vị trí overlays
        window.addEventListener('scroll', updateAllOverlays, true);
        window.addEventListener('resize', updateAllOverlays, true);

        activated = true;
        console.log('Inspector Activated. Use Ctrl+Alt+1 to toggle. Click modes: Main, Alt+Click: Addition, Ctrl+Click: Excluded.');
    }

    // --- Hàm hủy kích hoạt inspector ---
    function deactivateInspector() {
        document.removeEventListener('mouseover', mouseOver, true);
        document.removeEventListener('mouseout', mouseOut, true);
        document.removeEventListener('mouseleave', mouseOut, true);
        document.removeEventListener('click', clickHandler, true);
        window.removeEventListener('scroll', updateAllOverlays, true);
        window.removeEventListener('resize', updateAllOverlays, true);

        // Dọn dẹp tất cả phần tử và overlays
        removeAllElementsAndOverlays();

        hoverOverlay.style.display = 'none';
        infoLabel.style.display = 'none';
        activated = false;
        console.log('Inspector Deactivated.');
    }

    // --- Hàm xóa tất cả phần tử đã chọn và overlays ---
    function removeAllElementsAndOverlays() {
        [...mainElements].forEach(el => removeElement(el, 'main'));
        [...additionElements].forEach(el => removeElement(el, 'addition'));
        [...excludedElements].forEach(el => removeElement(el, 'exclude')); // Excluded nên được xóa cuối cùng hoặc độc lập
         // Đảm bảo tất cả overlays từ WeakMap bị xóa
        for(let [el, overlay] of elementOverlayMap) {
             if (overlay && overlay.parentNode) {
                  overlay.parentNode.removeChild(overlay);
             }
        }
        elementOverlayMap = new WeakMap(); // Reset WeakMap
         mainElements.clear();
         additionElements.clear();
         excludedElements.clear();
    }

     // --- Hàm cập nhật vị trí của tất cả overlays đang hiển thị ---
     function updateAllOverlays() {
         if (!activated) return; // Chỉ cập nhật khi inspector đang hoạt động

         // Tạo danh sách các phần tử cần cập nhật overlay
         const elementsToUpdate = new Set([...mainElements, ...additionElements, ...excludedElements]);

         elementsToUpdate.forEach(el => {
             const overlay = elementOverlayMap.get(el);
             if (overlay) {
                  // Nếu không thể cập nhật overlay (phần tử không hiển thị), xóa phần tử khỏi set tương ứng
                 if (!updateOverlay(overlay, el)) {
                     if (mainElements.has(el)) removeElement(el, 'main');
                     else if (additionElements.has(el)) removeElement(el, 'addition');
                     else if (excludedElements.has(el)) removeElement(el, 'exclude');
                 }
             } else {
                  // Nếu phần tử có trong set nhưng không có overlay (lỗi?), thử tạo lại hoặc xóa khỏi set
                  console.warn("Element in set but no overlay found. Removing:", el);
                  if (mainElements.has(el)) removeElement(el, 'main');
                  else if (additionElements.has(el)) removeElement(el, 'addition');
                  else if (excludedElements.has(el)) removeElement(el, 'addition');
             }
         });

         // Sau khi cập nhật/xóa các overlay, cần chạy lại bước dọn dẹp Excluded cuối cùng
         // để loại bỏ những Excluded mà cha/mẹ của nó vừa bị xóa do không hiển thị
         const excludedStillValid = new Set();
         excludedElements.forEach(ex => {
             if (isDescendantOfAnyMainOrAddition(ex)) {
                 excludedStillValid.add(ex);
             } else {
                 removeElement(ex, 'exclude');
                 console.log('Removed Excluded element that lost its Main/Addition parent (due to visibility change):', ex);
             }
         });
         excludedElements = excludedStillValid; // Cập nhật lại set
     }


    // --- Hàm bật/tắt inspector ---
    function toggleInspector(e) {
        // Kiểm tra nếu đang gõ vào input/textarea, bỏ qua
        if (e.target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
             return;
        }

        if (e.ctrlKey === toggleKey.ctrl && e.altKey === toggleKey.alt && e.key === toggleKey.key) {
            if (activated) {
                 deactivateInspector();
            } else {
                 // Tạo overlays ban đầu khi bật
                 createOverlays();
                 activateInspector();
            }
            e.preventDefault(); // Ngăn chặn hành vi mặc định của phím (ví dụ: Alt+1 có thể làm gì đó trên trình duyệt)
        }
    }

    // --- Lắng nghe sự kiện phím tắt ---
    document.addEventListener('keydown', toggleInspector, false);

    // --- Khởi tạo overlays ẩn khi script chạy lần đầu ---
    // Điều này giúp các biến hoverOverlay và infoLabel có giá trị ngay cả trước khi inspector được kích hoạt lần đầu
    createOverlays();
    hoverOverlay.style.display = 'none';
    infoLabel.style.display = 'none';


})();