// ==UserScript==
// @name         BS Nội trú - Helper (TA Hospital) - By drquochoai, BS.CKI Trần Quốc Hoài
// @namespace    http://tampermonkey.net/
// @version      1.9.2
// @description  Hỗ trợ dữ liệu bệnh nhân từ bs-noitru.tahospital.vn.
// @author       BS.CKI Trần Quốc Hoài, tahospital.vn
// @match        https://bs-noitru.tahospital.vn/*
// @match        https://dd-noitru.tahospital.vn/*
// @match        https://hsba.tahospital.vn/*
// @match        https://otm.tahospital.vn/*
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @license      MIT
// @connect      google.com
// @connect      tahospital.vn
// @connect      bs-noitru.tahospital.vn
// @connect      script.google.com
// @connect      googleusercontent.com
// @sandbox      MAIN_WORLD
// @downloadURL https://update.greasyfork.org/scripts/537154/BS%20N%E1%BB%99i%20tr%C3%BA%20-%20Helper%20%28TA%20Hospital%29%20-%20By%20drquochoai%2C%20BSCKI%20Tr%E1%BA%A7n%20Qu%E1%BB%91c%20Ho%C3%A0i.user.js
// @updateURL https://update.greasyfork.org/scripts/537154/BS%20N%E1%BB%99i%20tr%C3%BA%20-%20Helper%20%28TA%20Hospital%29%20-%20By%20drquochoai%2C%20BSCKI%20Tr%E1%BA%A7n%20Qu%E1%BB%91c%20Ho%C3%A0i.meta.js
// ==/UserScript==

(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// BS_CAI_DAT_GIAO_DIEN.js
// File cấu hình giao diện cho hệ thống Bệnh Sử Nội Trú
// Có thể chỉnh sửa các cài đặt này để tùy chỉnh giao diện

const BS_CAI_DAT = {
    // ================== CÀI ĐẶT HSBA ==================
    // Quy tắc xử lý tài liệu HSBA.
    // - tenmau: Tên mẫu tài liệu gốc từ HSBA V2
    // - show: true nếu muốn hiển thị trong danh sách "dr-hsba-item"
    // - sync: true nếu muốn dùng tài liệu này để đồng bộ với checklist bộ mổ
    // - checklist: (tùy chọn) Nhãn checklist mục tiêu khi sync === true
    // Lưu ý: Một mục có thể chỉ show (hiển thị) hoặc chỉ sync (đồng bộ) hoặc cả hai.
    HSBA_CHECKLIST_MAP: [
        // Hiển thị + Đồng bộ vào checklist
        { tenmau: 'Phiếu khám bệnh vào viện', show: true, sync: true, checklist: 'Phiếu Khám vào viện (hsoft)' },
        { tenmau: 'Biên bản hội chẩn duyệt mổ', show: true, sync: true, checklist: 'Tạo Biên bản Hội chẩn duyệt mổ (web)' },
        { tenmau: 'Phiếu cung cấp thông tin chẩn đoán, điều trị và chi phí', show: true, sync: true, checklist: 'Phiếu cung cấp thông tin, chẩn đoán và điều trị (hsoft)' },
        { tenmau: 'Giấy cam đoan thực hiện Phẫu thuật, Thủ thuật và Gây mê hồi sức', show: true, sync: true, checklist: '57. Cam kết phẫu thuật thủ thuật (hsoft)' },
        { tenmau: 'Phiếu khai thác tiền sử dị ứng', show: true, sync: true, checklist: 'Phiếu khai thác tiền sử dị ứng (hsoft)' },
        { tenmau: 'Phiếu HKTT trên bệnh người Phẫu thuật', show: false, sync: true, checklist: 'Đánh giá nguy cơ huyết khối (web)' },
        { tenmau: 'Phiếu khám tiền mê', show: true, sync: true, checklist: 'ĐÃ khám tiền mê CHƯA?' },

        // Chỉ hiển thị (không sync checklist)
        { tenmau: 'Phiếu khám chuyên khoa', show: true, sync: false },
        { tenmau: 'Phiếu tường trình phẫu thuật, thủ thuật', show: true, sync: false },
        { tenmau: 'Phiếu khám bệnh', show: true, sync: false },
        { tenmau: 'Toa thuốc ngoại trú', show: true, sync: false },

        // Không hiển thị (chỉ sync checklist)
        { tenmau: 'Phiếu Theo dõi điều trị', show: true, sync: true, checklist: 'Tờ điều trị (web)' },

        // Có thể bổ sung thêm nếu cần
    ],
    // ================== CÀI ĐẶT CHECKLIST ==================
    checklistItems: [
        'Phiếu Khám vào viện (hsoft)',
        'Bệnh án Ngoại khoa',
        'Tờ điều trị (web)',
        'Tạo Biên bản Hội chẩn duyệt mổ (web)',
        'Phiếu khai thác tiền sử dị ứng (hsoft)',
        '57. Cam kết phẫu thuật thủ thuật (hsoft)',
        'Phiếu cung cấp thông tin, chẩn đoán và điều trị (hsoft)',
        'Đánh giá nguy cơ huyết khối (web)',
        'Chuyển xét nghiệm vào khoa (hsoft) và ✅ ký số',
        'Đánh dấu vết mổ',
        'ĐÃ khám tiền mê CHƯA?',
        'ĐÃ đặt lịch mổ CHƯA?',
        'ĐÃ ghi y lệnh chuyển mổ',
        'Phiếu kiểm tra HIV test (hsoft)',
    ],

    // ================== CÀI ĐẶT CHECKLIST XUẤT VIỆN ==================
    checklistXuatVien: [
        'Mở HSBA v2',
        'Tạo tờ điều trị cuối (chỉnh chẩn đoán, ICD)',
        'Mở trang dặn dò',
        'Giấy ra viện',
        'Tóm tắt bệnh án',
        // Tờ điều trị sẽ có checklist con
        {
            label: 'Tờ điều trị',
            children: [
                'Thực hiện y lệnh thuốc đã dự trù',
                'Cấp các cử thuốc còn lại của người bệnh khi xuất viện',
                'Ký toa thuốc ra viện, In toa',
                'Chuyển dược',
                'Ký số các CLS tồn',
                'Tổng kết bệnh án trong tờ điều trị',
                'Tổng kết bệnh án điện tử',
            ]
        }
    ],

    // ================== CÀI ĐẶT Y LỆNH QUICK ACTIONS ==================
    quickYLenhActions: [
        { label: 'Xuất viện', icon: '🏠', color: '#4caf50' },
        { label: 'Cận lâm sàng', icon: '🧪', color: '#06b6d4' },
        { label: 'Đã đánh thuốc', icon: '💊', color: '#16a34a' },
        { label: 'Thay băng', icon: '👗', color: '#310994ff' },
        { label: 'Rút ODL vết mổ', icon: '🩹', color: '#ff9800' },
        { label: 'Rút ODL phổi', icon: '🫁', color: '#2196f3' },
        { label: 'Rút sonde tiểu', icon: '🔗', color: '#9c27b0' }
    ],

    // ================== CÀI ĐẶT BÁC SĨ ==================
    danhSachBacSi: [
        'PGS.TS.BS Vũ Hữu Vĩnh',
        'TS.BS Nguyễn Anh Dũng',
        'BS.CKII Trần Công Quyền',
        'ThS.BS Lê Thị Ngọc Hằng',
        'BS.CKI Trần Quốc Hoài',
        'ThS.BS Lê Chí Hiếu',
        'ThS.BS Phan Vũ Hồng Hải',
        'ThS.BSNT.CKI Phạm Hưng',
        'ThS.BS Nguyễn Đức Nghĩa'
    ],

    // ================== CÀI ĐẶT THẺ TRẮNG (WHITE-CARD ROOMS) ==================
    // Danh sách phòng sẽ hiển thị thẻ màu trắng (sử dụng bởi isWhiteCard(room))
    whiteCardRooms: [
        'Phòng 302',
        'Phòng 303',
        'Phòng 304',
        'Phòng 306D',
        'Phòng 307',
        'Phòng 305D',
        'Phòng 300',
        'Phòng 301'
    ],

    // ================== CÀI ĐẶT PHẪU THUẬT ==================
    phauThuatDefaults: {
        defaultDate: 'tomorrow', // 'tomorrow' | 'today' | null
        defaultTime: '07:30',
    },

    // ================== CÀI ĐẶT MÀU SẮC VÀ GIAO DIỆN ==================
    colors: {
        // Màu chính
        primary: '#1976d2',
        secondary: '#4caf50',
        danger: '#d32f2f',
        warning: '#ff9800',
        info: '#2196f3',

        // Màu cho thẻ bệnh nhân
        cardBackground: '#fff',
        cardBorder: '#e0e0e0',
        blueCardBackground: '#e3f2fd',

        // Màu cho tags y lệnh
        tagDefault: '#4caf50',
        tagBackground: 'rgba(76, 175, 80, 0.1)',
        tagBorder: 'rgba(76, 175, 80, 0.3)',
    },

    // ================== CÀI ĐẶT TAGS ==================
    tags: {
        maxDisplayTags: 3, // Số lượng tags tối đa hiển thị trên mỗi thẻ bệnh nhân
        showOnlyToday: true, // Chỉ hiển thị y lệnh hôm nay
        defaultIcon: '📋',

        // Cài đặt cho celebration (khi có tag Xuất viện)
        celebration: {
            enabled: true, // Bật/tắt hiệu ứng celebration
            glowColor: '#4caf50', // Màu glow animation
            borderWidth: '3px', // Độ dày viền celebration
            animationDuration: '2s', // Thời gian animation
        }
    },

    // ================== CÀI ĐẶT THỜI GIAN ==================
    timing: {
        autoSaveDelay: 500, // ms - thời gian delay khi auto-save
        loadChecklistDelay: 100, // ms - thời gian delay khi load checklist
        eventListenerDelay: 10, // ms - thời gian delay khi setup event listeners
    },

    // ================== CÀI ĐẶT DEBUG ==================
    debug: {
        enableLogging: false, // Bật/tắt console.log
        enableTagsTest: true, // Bật/tắt function test tags
        defaultTestMabn: '2510149440', // Mã bệnh nhân mặc định để test
    },

    // ================== CÀI ĐẶT TEXT ==================
    text: {
        noYLenhMessage: 'Chưa có y lệnh nào...',
        noPhauThuatMessage: 'Chưa có phẫu thuật nào...',
        loadingMessage: 'Đang tải checklist...',
        noDataMessage: 'Không có dữ liệu',
        errorMessage: 'Lỗi tải checklist',

        // Tiêu đề các phần
        checklistTitle: 'Checklist bộ mổ',
        phauThuatTitle: 'Thông tin phẫu thuật',
        yLenhTitle: 'Log y lệnh',

        // Button text
        addPhauThuatBtn: 'Thêm phẫu thuật',
        addYLenhBtn: 'Thêm',
        saveBtn: 'Lưu',
        cancelBtn: 'Hủy',
        deleteBtn: 'Xóa',

        // Placeholder text
        yLenhPlaceholder: 'Nhập y lệnh (VD: rút sonde tiểu)',
        ppptPlaceholder: 'Nhập PPPT',
        datePlaceholder: 'dd/mm/yyyy',
    },

    // ================== CÀI ĐẶT VALIDATION ==================
    validation: {
        requiredFields: {
            phauThuat: ['date', 'time', 'method', 'doctors'],
            yLenh: ['content']
        },
        dateFormat: /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/,
        messages: {
            missingPhauThuatInfo: 'Vui lòng nhập đầy đủ thông tin phẫu thuật!',
            invalidDateFormat: 'Vui lòng nhập ngày theo định dạng dd/mm/yyyy!',
            invalidMonth: 'Tháng không hợp lệ (1-12)!',
            invalidDay: 'Ngày không hợp lệ (1-31)!',
            invalidDate: 'Ngày không tồn tại!',
            noDoctorSelected: 'Vui lòng chọn ít nhất một bác sĩ!',
        }
    },

    // ================== CÀI ĐẶT LAYOUT ==================
    layout: {
        sidebar: {
            width: '80vw',
            maxWidth: '80vw',
            zIndex: 100000,
        },

        popup: {
            maxWidth: '500px',
            width: '90vw',
            maxHeight: '80vh',
            zIndex: 100001,
        },

        cards: {
            gap: '16px',
            borderRadius: '8px',
            padding: '16px',
        }
    }
};

// Export cho Node.js environment (browserify)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BS_CAI_DAT;
}

// Export cho browser environment
if (typeof window !== 'undefined') {
    window.BS_CAI_DAT = BS_CAI_DAT;
}

},{}],2:[function(require,module,exports){
// DanhSachBenhNhan.js
function DanhSachBenhNhan() {
    this.danhSach = null;
    this.lastFetched = null;
    this.autoFetchTimer = null;
    this.fixedMabn = "51991h991h991h991";
}

DanhSachBenhNhan.prototype.layDanhSachTheoMaBNFixed = function() {
    var self = this;
    return this._fetchDanhSach(this.fixedMabn).then(function(data) {
        if (data && data.length > 0) {
            self.danhSach = data;
            self.lastFetched = new Date();
            console.log('Đã lấy danh sách cho MABN cố định (' + data.length + ' mục).');
            self.uploadChecklistWithDrData(self.fixedMabn);
        } else {
            self.uploadChecklistWithDrData(self.fixedMabn);
        }
        return data;
    });
};

DanhSachBenhNhan.prototype.luuDanhSachBenhNhanVoiNgayVVMacDinh = function(ds) {
    if (!Array.isArray(ds)) return;
    this.danhSach = ds.map(function(bn) {
        var copy = {};
        for (var k in bn) copy[k] = bn[k];
        copy.ngayvv = "01/01/1001 01:01";
        return copy;
    });
    this.lastFetched = new Date();
    alert('Đã lưu ' + this.danhSach.length + ' bệnh nhân với ngày vào viện mặc định.');
};

DanhSachBenhNhan.prototype.startAutoFetch = function() {
    var self = this;
    if (this.autoFetchTimer) clearInterval(this.autoFetchTimer);
    this.autoFetchTimer = setInterval(function() { self._autoFetch7h(); }, 60000);
};
DanhSachBenhNhan.prototype._autoFetch7h = function() {
    var now = new Date();
    if (now.getHours() === 7 && now.getMinutes() === 0) {
        if (this.lastFetched) {
            var last = new Date(this.lastFetched);
            if (last.getFullYear() === now.getFullYear() && last.getMonth() === now.getMonth() && last.getDate() === now.getDate() && last.getHours() === 7) {
                alert('Đã có danh sách bệnh nhân lúc 7h sáng rồi.');
                return;
            }
        }
        this.layDanhSachTheoMaBNFixed();
    }
};

DanhSachBenhNhan.prototype.addFetchButtonToBottomBar = function() {
    var self = this;
    function addBtn() {
        var bar = document.querySelector('.dr-bottom-bar');
        if (!bar || bar.querySelector('#btn-fetch-fixed-mabn')) return;
        var btn = document.createElement('button');
        btn.id = 'btn-fetch-fixed-mabn';
        btn.innerText = 'Lấy DSBN (MABN cố định)';
        btn.className = 'btn btn-info';
        btn.style.marginLeft = '12px';
        btn.onclick = function() { self.layDanhSachTheoMaBNFixed(); };
        bar.appendChild(btn);
    }
    addBtn();
    document.addEventListener('DOMContentLoaded', addBtn);
    setTimeout(addBtn, 2000);
};

DanhSachBenhNhan.prototype._fetchDanhSach = function(mabn) {
    var self = this;
    return new Promise(function(resolve) {
        var formData = new FormData();
        formData.append('mabn', mabn);
        var now = new Date();
        var month = String(now.getMonth() + 1).padStart(2, '0');
        var day = String(now.getDate()).padStart(2, '0');
        var year = now.getFullYear();
        var dateStr = month + '/' + day + '/' + year + ' 07:00';
        formData.append('tungay', "01/01/1001 01:01");
        formData.append('denngay',  "01/01/3001 01:01");
        fetch('/DanhSachBenhNhan/DSPhieuCCThongTinVaCamKetNhapVien', {
            method: 'POST',
            credentials: 'include',
            body: formData
        }).then(function(r) { return r.json(); }).then(function(res) {
            if (res && res.data) resolve(res.data);
            else {
                if (window.DanhSachBenhNhanManager && typeof window.DanhSachBenhNhanManager.uploadChecklistWithDrData === 'function') {
                    window.DanhSachBenhNhanManager.uploadChecklistWithDrData(mabn, function(uploadRes) {
                        resolve(null);
                    });
                } else {
                    resolve(null);
                }
            }
        }).catch(function() { resolve(null); });
    });
};

DanhSachBenhNhan.prototype.uploadChecklistWithDrData = function(mabn, callback) {
    var formData = new FormData();
    formData.append('status', '1');
    formData.append('thebaohiemyte', 'Không');
    formData.append('chuky', JSON.stringify(window.dr_data || {}));
    formData.append('khac', '--*--');
    formData.append('khu', '1');
    formData.append('mabn', mabn);
    formData.append('bieumauid', '027');
    try {
        const { getSelectedKhoa } = require('./utils/khoaUtils');
        formData.append('makp', getSelectedKhoa('551'));
    } catch(_) {
        formData.append('makp', '551');
    }
    formData.append('__model', 'TAH.Entity.Model.PHIEUCCTHONGTINVACAMKETNHAPVIEN.ERM_PHIEUCCTHONGTINVACAMKETNHAPVIEN');
    formData.append('actiontype', '');
    formData.append('hoten', 'Không rõ%');
    formData.append('ngaysinh', '10/10/1999');
    formData.append('gioitinh', 'Nam');
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const year = now.getFullYear();
    formData.append('maql', `${month}/${day}/${year} 07:00`);
    fetch('/ERM_PHIEUCCTHONGTINVACAMKETNHAPVIEN/CreateAjax', {
        method: 'POST',
        credentials: 'include',
        body: formData
    }).then(function(r) { return r.json(); }).then(function(res) {
        if (typeof callback === 'function') callback(res);
    }).catch(function() {
        if (typeof callback === 'function') callback(null);
    });
};

module.exports = DanhSachBenhNhan;

},{"./utils/khoaUtils":41}],3:[function(require,module,exports){
// Global function to open HSBA V2 - Define at top level for global access
// This needs to be outside any function to be truly global
// Don't use window.openHSBAV2 as it may not work in Tampermonkey
async function openHSBAV2(mabn) {
    try {
        const response = await fetch('/ToDieuTri/LoadLinkHsba', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-Requested-With': 'XMLHttpRequest'
            },
            credentials: 'include',
            body: 'code=' + encodeURIComponent(mabn)
        });
        
        const result = await response.json();
        if (result && result.data && result.data.link) {
            window.open(result.data.link, '_blank');
        } else {
            console.error('Không lấy được link HSBA V2');
            alert('Không lấy được link HSBA V2');
        }
    } catch (error) {
        console.error('Lỗi khi load link HSBA V2:', error);
        alert('Lỗi khi load link HSBA V2');
    }
}

// Also assign to window as fallback but the function declaration above should work
if (typeof window !== 'undefined') {
    window.openHSBAV2 = openHSBAV2;
}

// Make it available in global scope for Tampermonkey
this.openHSBAV2 = openHSBAV2;
unsafeWindow.openHSBAV2 = openHSBAV2;

(function () {
    'use strict';

    const Utils = require('./utils');
    // Ensure HSBA background worker runs on hsba.tahospital.vn when this bundle is injected there
    try { require('./components/hsbaDataFetcher'); } catch(_) {}
    // Ensure OTM entry runs on otm.tahospital.vn when this bundle is injected there
    try { require('./pages/otm-entry'); } catch(_) {}
    const { TaiToanBoTaiLieuHSBAV2, triggerDownloadIfDataExists } = require('./utils/hsbaV2Download');
    const DanhSachBenhNhan = require('./DanhSachBenhNhan');
    const { GoogleAppsScriptUploader, GOOGLE_APPS_SCRIPT_URL } = require('./googleAppsScript');
    const { showDashboardBenhNhanIfNeeded } = require('./pages/page.dashboard');
    const { showSettingsIfNeeded } = require('./pages/page.settings');
        // Lịch mổ hôm nay route hook
        try {
            const { showLichMoHomNayIfNeeded } = require('./pages/page.lichmo.homnay');
            showLichMoHomNayIfNeeded();
        } catch(_) {}
    const { initCopyDienTienAI } = require('./components/copyDienTienAI');
    const ChecklistService = require('./services/checklistService');
    showDashboardBenhNhanIfNeeded();
    showSettingsIfNeeded();
    try {
        window.addEventListener('online', () => {
            try { ChecklistService.drainSaveQueue(); } catch(_) {}
        });
    } catch(_) {}
    // --- Khởi tạo class và gắn vào window để dễ test ---
    window.DanhSachBenhNhanManager = new DanhSachBenhNhan();
    window.DanhSachBenhNhanManager.startAutoFetch();
    window.DanhSachBenhNhanManager.addFetchButtonToBottomBar();

    // --- Khởi tạo uploader Google Apps Script và gắn vào window để có thể dùng ở nơi khác nếu cần ---
    var uploader = new GoogleAppsScriptUploader(GOOGLE_APPS_SCRIPT_URL);
    window.GoogleAppsScriptUploader = uploader;
    // uploader.addUploadButton();

    // ĐÃ XÓA toàn bộ định nghĩa các hàm createDirectReportGeneration, fetchToDieuTriData, addGlobalStyles, updateChecklistPhieu, createChecklistPhieu khỏi file này vì đã chuyển sang dashboard.support.js và được sử dụng qua dashboard.js


    // Show dr_data as cards if ?show=true or ?nln in URL
    // ĐÃ XÓA toàn bộ định nghĩa hàm showDashboardBenhNhanIfNeeded và các hàm con bên trong (từ dòng 192 trở đi cho đến hết hàm)

    // ĐÃ XÓA đoạn kiểm tra window.dr_data, fetchToDieuTriData và renderCards khỏi file này vì đã chuyển sang dashboard.js


    // Nếu URL kết thúc bằng /to-dieu-tri thì tự động click #cbTaCa nếu tồn tại
    function autoClickCbTaCaIfNeeded() {
        // --- Tự động click #cbTaCa nếu ở trang /to-dieu-tri ---
        if (/\/to-dieu-tri(\?.*)?$/.test(window.location.pathname) || window.location.href.includes('DanhSachBenhNhan')) {
            $('#ddlKhoa').on('change', function () {
                const v = $(this).val();
                try {
                    localStorage.setItem('bsnt_khoa_dashboard', v);
                } catch(_) {}
            });

            setTimeout(() => {

                const savedKhoa = localStorage.getItem('bsnt_khoa_dashboard') || "551";
                if (savedKhoa) {
                    $('#ddlKhoa').val(savedKhoa).change();
                }
                console.log('Đã tự động chọn khoa ' + savedKhoa + ' trong dropdown #ddlKhoa');
            }, 500);

            const cb = document.getElementById('cbTaCa');
            if (cb) {
                cb.click();
            }
        }
    }
    autoClickCbTaCaIfNeeded();

    // Initialize Copy Diễn Tiến button on /to-dieu-tri
    try { initCopyDienTienAI(); } catch(_) {}

    // Auto-login on /Home/Login: always fill from default account; only auto-submit if enabled
    try {
        const isLoginPage = /\/Home\/Login(\?.*)?$/.test(window.location.pathname);
        if (isLoginPage && window.localStorage) {
            const ACC_KEY = 'dr_accounts_json';
            const DEF_KEY = 'dr_acc_default';
            const AUTO_KEY = 'dr_acc_autologin';
            let accounts = [];
            try { accounts = JSON.parse(localStorage.getItem(ACC_KEY) || '[]'); } catch(_) { accounts = []; }
            const defUser = localStorage.getItem(DEF_KEY) || '';
            const acc = accounts.find(a => (a && a.username) === defUser) || accounts[0] || null;
            const userInput = document.querySelector('input[name="username"][placeholder="Tên đăng nhập"]');
            const passInput = document.querySelector('input[type="password"][name="password"][placeholder="Mật khẩu"]');
            const submitBtn = document.querySelector('button[type="submit"].btn.btn-primary.btn-block');
            if (acc && userInput && passInput) {
                userInput.value = acc.username || '';
                passInput.value = acc.password || '';
            }
            if (acc && localStorage.getItem(AUTO_KEY) === '1' && userInput && passInput && submitBtn) {
                setTimeout(() => {
                    submitBtn.click();
                    setTimeout(() => { try { window.location.href = '/?nln'; } catch(_) {} }, 1500);
                }, 200);
            } else if (localStorage.getItem(AUTO_KEY) !== '1') {
                // Render account picker panel to the right of login card
                try {
                    const ensurePanel = () => {
                        const loginCard = document.querySelector('div.card.card-outline.card-primary');
                        if (!loginCard || accounts.length === 0 || document.getElementById('dr-quochoai-danh-sach-tai-khoan-login')) return;
                        // Inject minimal CSS for layout + blue buttons
                        if (!document.getElementById('dr-login-accounts-css')) {
                            const style = document.createElement('style');
                            style.id = 'dr-login-accounts-css';
                            style.textContent = `
                                #dr-quochoai-danh-sach-tai-khoan-login { position: fixed; width: 300px; max-width: 340px; display: flex; flex-direction: column; gap: 8px; background:#fff; border:1px solid #e5e7eb; border-radius:10px; padding:10px; z-index:2147483647; }
                                #dr-quochoai-danh-sach-tai-khoan-login .dr-acc-title { font-weight: 700; margin-bottom: 4px; color: #0d47a1; }
                                #dr-quochoai-danh-sach-tai-khoan-login .dr-acc-btn { background: #1976d2; color: #fff; border: none; padding: 10px 12px; border-radius: 8px; font-weight: 600; cursor: pointer; text-align: left; box-shadow: 0 1px 2px rgba(0,0,0,0.12); }
                                #dr-quochoai-danh-sach-tai-khoan-login .dr-acc-btn:hover { background: #1565c0; }
                            `;
                            document.head && document.head.appendChild(style);
                        }

                        const panel = document.createElement('div');
                        panel.id = 'dr-quochoai-danh-sach-tai-khoan-login';
                        const titleEl = document.createElement('div');
                        titleEl.className = 'dr-acc-title';
                        titleEl.textContent = 'Tài khoản đã lưu';
                        panel.appendChild(titleEl);

                        accounts.forEach(a => {
                            const btn = document.createElement('button');
                            btn.type = 'button';
                            btn.className = 'dr-acc-btn';
                            const title = a.title || a.username || 'Tài khoản';
                            btn.textContent = title + (a.username ? ` (${a.username})` : '');
                            btn.addEventListener('click', () => {
                                if (userInput && passInput && submitBtn) {
                                    userInput.value = a.username || '';
                                    passInput.value = a.password || '';
                                    submitBtn.click();
                                    setTimeout(() => { try { window.location.href = '/?nln'; } catch(_) {} }, 1500);
                                }
                            });
                            panel.appendChild(btn);
                        });

                        // Append panel directly to body and position it to the right of the login card
                        if (document.body && document.body.appendChild) {
                            document.body.appendChild(panel);
                            const positionPanel = () => {
                                const rect = loginCard.getBoundingClientRect();
                                const panelRect = panel.getBoundingClientRect();
                                const top = Math.max(12, rect.top + window.scrollY);
                                let left = rect.right + 16 + window.scrollX;
                                const maxLeft = window.scrollX + window.innerWidth - panelRect.width - 12;
                                if (left > maxLeft) left = Math.max(12 + window.scrollX, maxLeft);
                                panel.style.top = top + 'px';
                                panel.style.left = left + 'px';
                            };
                            // Initial and delayed to ensure metrics
                            positionPanel();
                            setTimeout(positionPanel, 0);
                            window.addEventListener('resize', positionPanel);
                            window.addEventListener('scroll', positionPanel, { passive: true });
                        }
                    };
                    // Run now or retry a few times if the DOM isn’t ready yet
                    if (document.readyState === 'loading') {
                        document.addEventListener('DOMContentLoaded', ensurePanel);
                    } else {
                        ensurePanel();
                        let tries = 0;
                        const iv = setInterval(() => {
                            tries++;
                            if (document.getElementById('dr-quochoai-danh-sach-tai-khoan-login') || tries > 10) return clearInterval(iv);
                            ensurePanel();
                        }, 300);
                    }
                } catch(_) {}
            }
        }
    } catch(_) {}



    // Gọi hàm khi trang chính load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            addDashboardMenuToSidebar();
            addDashboardMenuToTopbar();
            addAutoLoginToggleToTopbar();
        });
    } else {
        addDashboardMenuToSidebar();
        addDashboardMenuToTopbar();
        addAutoLoginToggleToTopbar();
    }

    // Thêm menu mở dashboard vào sidebar
    function addDashboardMenuToSidebar() {
        // Tìm nav sidebar
        const nav = document.querySelector('nav.mt-2 ul.nav-sidebar');
        if (!nav) return;
        // Kiểm tra đã có menu chưa
        if (nav.querySelector('.bsnt-dashboard-menu')) return;
        // Tạo li mới
        const li = document.createElement('li');
        li.className = 'nav-item bsnt-dashboard-menu';
        const a = document.createElement('a');
        a.className = 'nav-link';
        a.href = '/?nln';
        a.target = '_blank'; // Mở trong tab mới
        a.innerHTML = '<i class="nav-icon fas fa-tachometer-alt"></i> <p>Mở dashboard</p>';
        // Style vàng và bo tròn
        a.style.background = 'gold';
        a.style.borderRadius = '12px';
        a.style.color = '#333';
        a.style.fontWeight = 'bold';
        a.onmouseover = function () { a.style.background = '#ffe066'; };
        a.onmouseout = function () { a.style.background = 'gold'; };
        li.appendChild(a);
        // Thêm vào đầu ul
        nav.insertBefore(li, nav.firstChild);
    }

    // Thêm nút TỰ ĐỘNG LOGIN vào TOPBAR bên trái <li class="nav-item dropdown">
    function addAutoLoginToggleToTopbar() {
        const { createAutoLoginToggle, applyToggleStyles } = require('./components/autoLoginToggle');
        const dropdownLi = document.querySelector('nav.main-header ul.navbar-nav li.nav-item.dropdown')
            || document.querySelector('ul.navbar-nav li.nav-item.dropdown')
            || document.querySelector('li.nav-item.dropdown');
        if (!dropdownLi) return;
        const ul = dropdownLi.parentElement;
        if (!ul) return;
        if (ul.querySelector('.bsnt-autologin-toggle')) return;

        const li = document.createElement('li');
        li.className = 'nav-item bsnt-autologin-toggle';
        const enabled = window.localStorage && window.localStorage.getItem('dr_acc_autologin') === '1';
        const a = createAutoLoginToggle({
            enabled,
            onToggle: () => {
                const cur = window.localStorage && window.localStorage.getItem('dr_acc_autologin') === '1';
                if (window.localStorage) window.localStorage.setItem('dr_acc_autologin', cur ? '0' : '1');
                applyToggleStyles(a, !cur);
            },
            onDblClick: () => window.open('/?caidat=account', '_blank'),
            title: 'Bật/tắt tự động login (double click để mở Cài đặt > Account)'
        });
        li.appendChild(a);
        ul.insertBefore(li, dropdownLi);
    }

    // Helper: detect smartphone/small screens
    function shouldShowTopbarMenu() {
        try { return window.matchMedia && window.matchMedia('(max-width: 768px)').matches; } catch(_) { return false; }
    }

    // Thêm nút mở dashboard vào TOPBAR bên cạnh <li class="nav-item dropdown">
    function addDashboardMenuToTopbar() {
        // Tìm topbar ul chứa các nav-item
        const dropdownLi = document.querySelector('nav.main-header ul.navbar-nav li.nav-item.dropdown')
            || document.querySelector('ul.navbar-nav li.nav-item.dropdown')
            || document.querySelector('li.nav-item.dropdown');
        if (!dropdownLi) return;
        const ul = dropdownLi.parentElement;
        if (!ul) return;
        // On desktop, remove if present and skip
        if (!shouldShowTopbarMenu()) {
            const existing = ul.querySelector('.bsnt-dashboard-menu-top');
            if (existing) existing.remove();
            return;
        }
        // Tránh thêm trùng
        if (ul.querySelector('.bsnt-dashboard-menu-top')) return;

        const li = document.createElement('li');
        li.className = 'nav-item bsnt-dashboard-menu-top';
        const a = document.createElement('a');
        a.className = 'nav-link';
        a.href = '/?nln';
        a.target = '_blank';
        a.innerHTML = '<i class="fas fa-tachometer-alt"></i> <span style="margin-left:6px;">Mở dashboard</span>';
        // Style vàng và bo tròn giống sidebar
        a.style.background = 'gold';
        a.style.borderRadius = '12px';
        a.style.color = '#333';
        a.style.fontWeight = 'bold';
        a.style.display = 'inline-flex';
        a.style.alignItems = 'center';
        a.style.gap = '6px';
        a.style.padding = '6px 10px';
        a.onmouseover = function () { a.style.background = '#ffe066'; };
        a.onmouseout = function () { a.style.background = 'gold'; };
        li.appendChild(a);

        if (dropdownLi.nextSibling) ul.insertBefore(li, dropdownLi.nextSibling);
        else ul.appendChild(li);
    }

    // Re-evaluate visibility on resize (bind once)
    if (!window.__bsntTopbarMenuResizeBound) {
        window.addEventListener('resize', () => {
            try { addDashboardMenuToTopbar(); } catch(_) {}
        }, { passive: true });
        window.__bsntTopbarMenuResizeBound = true;
    }

    // --- HSBA V2 PAGE ENHANCEMENT: Hide empty sections (no documents) ---
    function HSBAV2HideEmptySectionsIfNeeded() {
        if (window.location.hostname === 'hsba.tahospital.vn') {
            function hideEmptySections() {
                document.querySelectorAll('div.MuiBox-root.css-0').forEach(div => {
                    const p = div.querySelector('p');
                    if (p && /\(0\)\s*$/.test(p.textContent)) {
                        div.style.display = 'none';
                    }
                });
            }
            // Wait for all AJAX content to load before running hideEmptySections
            function waitForFullLoadAndHide() {
                let lastCount = 0;
                let stableCount = 0;
                const maxWait = 20000; // 20 seconds max
                const startTime = performance.now();
                const interval = setInterval(() => {
                    const currentCount = document.querySelectorAll('div.MuiBox-root.css-0').length;
                    if (currentCount === lastCount) {
                        stableCount++;
                    } else {
                        stableCount = 0;
                    }
                    lastCount = currentCount;
                    // If count is stable for 10 checks (~10s) or maxWait reached, run hideEmptySections and click target div
                    if (stableCount > 10 || (performance.now() - startTime) > maxWait) {
                        clearInterval(interval);
                        hideEmptySections();
                        // Click div with class 'MuiBox-root css-1ebnygn'
                        const targetDiv = document.querySelector('div.MuiBox-root.css-1ebnygn');
                        if (targetDiv) {
                            targetDiv.click();
                        }
                    }
                    // For debug:
                    // console.log(`Current sections: ${currentCount}, Stable count: ${stableCount}`);
                }, 1000);
            }
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', waitForFullLoadAndHide);
            } else {
                waitForFullLoadAndHide();
            }
            // Also observe for dynamic changes (in case of further AJAX updates)
            const observer = new MutationObserver(hideEmptySections);
            observer.observe(document.body, { childList: true, subtree: true });

            // Add download button
            const buttonTargetDiv = document.querySelector('div.css-1xd5sck');
            if (buttonTargetDiv && !buttonTargetDiv.querySelector('.dr-download-all-btn')) {
                const button = document.createElement('button');
                button.className = 'dr-download-all-btn';
                button.textContent = 'Tải toàn bộ tài liệu';
                button.style.cssText = 'background:#007bff;color:#fff;border:none;border-radius:4px;padding:8px 16px;cursor:pointer;margin:10px;font-size:14px;';
                button.onclick = () => {
                    if (typeof window.triggerDownloadIfDataExists === 'function') {
                        window.triggerDownloadIfDataExists();
                    }
                };
                buttonTargetDiv.appendChild(button);
            }

            // Regularly check for button injection on lazy loaded content
            const checkForButtonInjection = () => {
                const buttonTargetDiv = document.querySelector('div.css-1xd5sck');
                if (buttonTargetDiv && !buttonTargetDiv.querySelector('.dr-download-all-btn')) {
                    const button = document.createElement('button');
                    button.className = 'dr-download-all-btn';
                    button.textContent = 'Tải toàn bộ tài liệu';
                    button.style.cssText = 'background:#007bff;color:#fff;border:none;border-radius:4px;padding:8px 16px;cursor:pointer;margin:10px;font-size:14px;';
                    button.onclick = () => {
                        if (typeof window.triggerDownloadIfDataExists === 'function') {
                            window.triggerDownloadIfDataExists();
                        }
                    };
                    buttonTargetDiv.appendChild(button);
                }
            };
            // Check immediately
            checkForButtonInjection();
            // Then check every 2 seconds for up to 30 seconds
            let buttonCheckCount = 0;
            const buttonCheckInterval = setInterval(() => {
                buttonCheckCount++;
                checkForButtonInjection();
                if (buttonCheckCount > 15) { // 30 seconds
                    clearInterval(buttonCheckInterval);
                }
            }, 2000);

        }

    }
    HSBAV2HideEmptySectionsIfNeeded();
    
    // Initialize HSBA V2 full download
    TaiToanBoTaiLieuHSBAV2();
    window.triggerDownloadIfDataExists = triggerDownloadIfDataExists;
})();
},{"./DanhSachBenhNhan":2,"./components/autoLoginToggle":5,"./components/copyDienTienAI":6,"./components/hsbaDataFetcher":8,"./googleAppsScript":17,"./pages/otm-entry":18,"./pages/page.dashboard":20,"./pages/page.lichmo.homnay":22,"./pages/page.settings":24,"./services/checklistService":27,"./utils":35,"./utils/hsbaV2Download":39}],4:[function(require,module,exports){
// components/actionButtons.js - shared creators for action buttons
const ChecklistService = require('../services/checklistService');
const ReportService = require('../services/reportService');

async function openHSBAV2Link(mabn) {
    try {
        const response = await fetch('/ToDieuTri/LoadLinkHsba', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-Requested-With': 'XMLHttpRequest'
            },
            credentials: 'include',
            body: 'code=' + encodeURIComponent(mabn)
        });
        const result = await response.json();
        if (result && result.data && result.data.link) {
            window.open(result.data.link, '_blank');
        } else {
            window.open(`/hoso/${encodeURIComponent(String(mabn))}`, '_blank');
        }
    } catch (_) {
        window.open(`/hoso/${encodeURIComponent(String(mabn))}`, '_blank');
    }
}

function createCopyOneButton({ item, variant = 'icon' }) {
    const isIcon = variant === 'icon';
    const btn = document.createElement('button');
    btn.className = isIcon ? 'dr-btn-icon' : 'dr-detail-btn no-print';
    if (!isIcon) {
        btn.style.position = 'static';
        btn.style.padding = '8px';
        btn.style.borderRadius = '10px';
        btn.style.display = 'inline-flex';
        btn.style.alignItems = 'center';
        btn.style.justifyContent = 'center';
    }
    btn.title = 'Copy báo cáo (1 BN)';
    btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path fill="#fff" d="M16 1H4a2 2 0 0 0-2 2v12h2V3h12V1zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H8V7h11v14z"/></svg>' + (isIcon ? '' : ' Copy');
    btn.onclick = async (e) => {
        e.stopPropagation();
        try {
            const { copyReportToClipboardRich } = require('../pages/page.dashboard.support');
            const res = await ChecklistService.loadChecklistData(item);
            const obj = ChecklistService.findChecklistObject(res);
            const state = obj ? (ChecklistService.parseChecklistState(obj) || {}) : {};
            const html = ReportService.generateSingleHTML(item, state);
            const text = ReportService.generateSingleText(item, state);
            await copyReportToClipboardRich(html, text);
        } catch (err) {
            console.error('Copy single-patient report failed:', err);
        }
    };
    return btn;
}

function createToDieuTriButton({ item, variant = 'full' }) {
    const isIcon = variant === 'icon';
    const btn = document.createElement('button');
    btn.className = isIcon ? 'dr-btn-icon' : 'dr-detail-btn no-print';
    if (!isIcon) {
        btn.style.position = 'static';
        btn.style.fontSize = '14px';
        btn.style.padding = '8px 12px 8px 10px';
    }
    btn.title = 'Tờ điều trị';
    const svgDoc = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path fill="#fff" d="M6 2h7l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm7 1v4h4l-4-4zM8 9h8v2H8V9zm0 4h8v2H8v-2zm0 4h5v2H8v-2z"/></svg>';
    btn.innerHTML = isIcon ? svgDoc : `${svgDoc}Tờ điều trị`;
    btn.onclick = (e) => {
        e.stopPropagation();
        if (item.mabn) window.open(`/to-dieu-tri?mabn=${encodeURIComponent(item.mabn)}`, '_blank');
    };
    return btn;
}

function createHsbaButton({ item, variant = 'full' }) {
    const isIcon = variant === 'icon';
    const btn = document.createElement('button');
    btn.className = isIcon ? 'dr-btn-icon' : 'dr-detail-btn no-print';
    if (!isIcon) {
        btn.style.position = 'static';
        btn.style.marginLeft = '8px';
        btn.style.fontSize = '14px';
        btn.style.padding = '8px 12px 8px 10px';
        btn.textContent = 'HSBA V2';
    } else {
        btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path fill="#fff" d="M12 5C5 5 2 12 2 12s3 7 10 7 10-7 10-7-3-7-10-7zm0 12c-4.97 0-8.19-4.16-8.94-5C3.81 10.16 7.03 6 12 6s8.19 4.16 8.94 5c-.75.84-3.97 5-8.94 5zm0-8a3 3 0 100 6 3 3 0 000-6z"/></svg>';
    }
    btn.title = 'HSBA V2';
    btn.onclick = (e) => { e.stopPropagation(); openHSBAV2Link(item.mabn); };
    return btn;
}

module.exports = {
    createCopyOneButton,
    createToDieuTriButton,
    createHsbaButton,
    createHsbaV1Button,
    openHSBAV2Link
};

// Legacy HSBA (v1) opener as a shared creator
function createHsbaV1Button(item) {
    const btn = document.createElement('button');
    btn.className = 'dr-detail-btn no-print';
    btn.style.position = 'static';
    btn.style.marginLeft = '8px';
    btn.textContent = 'HSBAv1';
    btn.onclick = function (e) {
        e.stopPropagation();
        try {
            if (!item || !item.mabn) return;
            const url = `/hoso/${encodeURIComponent(String(item.mabn))}`;
            window.open(url, '_blank', 'noopener');
        } catch (error) {
            console.warn('Open HSBAv1 failed', error);
        }
    };
    return btn;
}

},{"../pages/page.dashboard.support":21,"../services/checklistService":27,"../services/reportService":30}],5:[function(require,module,exports){
// autoLoginToggle.js - Shared toggle UI for Auto Login

function applyToggleStyles(a, enabled) {
    a.className = (a.className || '') + ' dr-autologin-toggle nav-link';
    a.style.borderRadius = '12px';
    a.style.display = 'inline-flex';
    a.style.alignItems = 'center';
    a.style.gap = '6px';
    a.style.padding = '6px 10px';
    if (enabled) {
        a.innerHTML = '<i class="fas fa-toggle-on"></i> <span style="margin-left:6px; font-weight:600;">TỰ ĐỘNG LOGIN</span>';
        a.style.background = '#dc2626';
        a.style.color = '#fff';
        a.style.border = '1px solid #b91c1c';
    } else {
        a.innerHTML = '<i class="fas fa-toggle-off"></i> <span style="margin-left:6px;">TỰ ĐỘNG LOGIN</span>';
        a.style.background = '#fff';
        a.style.color = '#111827';
        a.style.border = '1px solid #e5e7eb';
    }
}

function createAutoLoginToggle({ enabled, onToggle, onDblClick, title }) {
    const a = document.createElement('a');
    a.href = 'javascript:void(0)';
    a.title = title || 'Bật/tắt tự động login';
    applyToggleStyles(a, !!enabled);
    a.addEventListener('click', (e) => {
        e.preventDefault();
        if (typeof onToggle === 'function') onToggle();
    });
    if (typeof onDblClick === 'function') {
        a.addEventListener('dblclick', (e) => {
            e.preventDefault();
            onDblClick();
        });
    }
    return a;
}

module.exports = { createAutoLoginToggle, applyToggleStyles };

},{}],6:[function(require,module,exports){
// copyDienTienAI.js
// Inject a "Copy diễn tiến" button on /to-dieu-tri and copy all PDF text to clipboard using pdf.js

function isToDieuTriPage() {
    try {
        return /\/to-dieu-tri(\?.*)?$/.test(window.location.pathname);
    } catch (_) { return false; }
}

function getMabnFromUrl() {
    try {
        const u = new URL(window.location.href);
        return u.searchParams.get('mabn') || '';
    } catch (_) { return ''; }
}

function ensureStatusBar(container) {
    let bar = document.getElementById('dr-copy-dien-tien-status');
    if (!bar) {
        bar = document.createElement('div');
        bar.id = 'dr-copy-dien-tien-status';
        bar.style.cssText = 'margin-top:8px; font-size:12px; color:#0f172a;';
        container.appendChild(bar);
    }
    return bar;
}

// Helper to set status text with optional auto-clear after 4s
function setStatus(bar, text, color, autoClear = false) {
    if (!bar) return;
    try { if (bar.__statusTimer) { clearTimeout(bar.__statusTimer); bar.__statusTimer = null; } } catch(_) {}
    if (typeof text === 'string') bar.textContent = text;
    if (color) bar.style.color = color;
    if (autoClear) {
        bar.__statusTimer = setTimeout(() => {
            try { bar.textContent = ''; } catch(_) {}
        }, 4000);
    }
}

async function loadPdfJsIfNeeded() {
    const getLib = () => (window.pdfjsLib || (typeof unsafeWindow !== 'undefined' ? unsafeWindow.pdfjsLib : undefined));
    if (getLib()) {
        // worker may still need to be set
        try {
            const lib = getLib();
            if (lib && lib.GlobalWorkerOptions) lib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.worker.min.js';
        } catch(_) {}
        return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.min.js';
    script.referrerPolicy = 'no-referrer';
    const p = new Promise((resolve, reject) => {
        script.onload = () => {
            try {
                // bridge between page and userscript contexts
                if (typeof unsafeWindow !== 'undefined' && unsafeWindow.pdfjsLib && !window.pdfjsLib) {
                    try { window.pdfjsLib = unsafeWindow.pdfjsLib; } catch(_) {}
                }
                const lib = getLib();
                if (lib && lib.GlobalWorkerOptions) lib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.worker.min.js';
            } catch(_) {}
            resolve();
        };
        script.onerror = () => reject(new Error('Không tải được pdf.js'));
    });
    document.head.appendChild(script);
    await p;
}

async function fetchPatientInfo(mabn) {
    const body = 'code=' + encodeURIComponent(mabn);
    const res = await fetch('/ToDieuTri/GetPatient', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'X-Requested-With': 'XMLHttpRequest',
            'accept': '*/*'
        },
        credentials: 'include',
        body
    });
    if (!res.ok) throw new Error('Lỗi GetPatient: ' + res.status);
    const json = await res.json();
    if (!json || json.isValid === false || !json.data || !json.data[0]) throw new Error('Dữ liệu GetPatient không hợp lệ');
    return json.data[0];
}

function parseMMDDYYYYtoDDMMYYYY(dateTimeStr) {
    if (!dateTimeStr) return '';
    // Expect "MM/DD/YYYY HH:mm:ss" or "MM/DD/YYYY"
    const [datePart] = String(dateTimeStr).split(' ');
    const [mm, dd, yyyy] = datePart.split('/');
    if (!mm || !dd || !yyyy) return '';
    return `${dd.padStart(2, '0')}/${mm.padStart(2, '0')}/${yyyy}`;
}

function todayDDMMYYYY() {
    const d = new Date();
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
}

async function fetchPdfArrayBuffer(url) {
    const res = await fetch(url, { method: 'GET', credentials: 'include' });
    if (!res.ok) throw new Error('Lỗi tải PDF: ' + res.status);
    return await res.arrayBuffer();
}

async function extractAllTextFromPdfBuffer(buffer) {
    await loadPdfJsIfNeeded();
    const pdfjsLib = (window.pdfjsLib || (typeof unsafeWindow !== 'undefined' ? unsafeWindow.pdfjsLib : undefined));
    if (!pdfjsLib || !pdfjsLib.getDocument) throw new Error('pdfjsLib chưa sẵn sàng');
    const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(buffer) });
    const pdf = await loadingTask.promise;
    let out = [];
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const strings = content.items.map(it => it.str).filter(Boolean);
        out.push(strings.join(' '));
    }
    return out.join('\n\n');
}

// Sanitize sensitive info before copying to clipboard
function sanitizeCopiedText(text) {
    if (!text) return '';
    let t = String(text);
    // Remove from "Họ và tên:" to the first '-' character (inclusive), not to newline
    t = t.replace(/Họ\s+và\s+tên:\s*[^-]*-\s*/gi, '');
    return t;
}

async function copyToClipboard(text) {
    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text);
            return true;
        }
    } catch(_) {}
    try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        return true;
    } catch(_) { return false; }
}

function injectButton() {
    if (!isToDieuTriPage()) return;
    const host = document.getElementById('LoadToDieuTri');
    if (!host) return;
    if (document.getElementById('dr-copy-dien-tien-forAI')) return; // already added

    const wrap = document.createElement('div');
    wrap.style.margin = '6px 0 10px 0';

    const btn = document.createElement('button');
    btn.id = 'dr-copy-dien-tien-forAI';
    btn.type = 'button';
    btn.className = 'btn btn-sm btn-success';
    btn.textContent = 'Copy diễn tiến';

    // Secondary "copy again" icon button
    const btnCopyAgain = document.createElement('button');
    btnCopyAgain.type = 'button';
    btnCopyAgain.title = 'Copy lại';
    btnCopyAgain.className = 'btn btn-sm btn-outline-secondary';
    btnCopyAgain.style.marginLeft = '6px';
    btnCopyAgain.textContent = '📋';
    btnCopyAgain.style.display = 'none';

    wrap.appendChild(btn);
    wrap.appendChild(btnCopyAgain);
    host.prepend(wrap);

    const statusBar = ensureStatusBar(wrap);

    btn.addEventListener('click', async () => {
        const mabn = getMabnFromUrl();
        if (!mabn) {
            setStatus(statusBar, 'Không tìm thấy MABN trong URL', '#b91c1c', true);
            return;
        }
        try {
            setStatus(statusBar, 'Đang lấy thông tin người bệnh...', '#0f172a', false);
            const info = await fetchPatientInfo(mabn);
            const mavaovien = info.maVaoVien || info.maVaoVien || info.mavaovien || '';
            const ngayvv = parseMMDDYYYYtoDDMMYYYY(info.ngayVV || info.ngayvv || '');
            const maql = info.maql || '';
            if (!mavaovien || !ngayvv || !maql) {
                setStatus(statusBar, 'Thiếu tham số (mã vào viện/ngày vào/maql)', '#b91c1c', true);
                return;
            }

            const denngay = todayDDMMYYYY();
            const pdfUrl = `/todieutri/DienBien/PrintPDF?id=&mabn=${encodeURIComponent(mabn)}&mavaovien=${encodeURIComponent(mavaovien)}&tungay=${encodeURIComponent(ngayvv)}&denngay=${encodeURIComponent(denngay)}&maql=${encodeURIComponent(maql)}`;

            setStatus(statusBar, 'Đang tải và xử lý PDF...', '#0f172a', false);
            const buf = await fetchPdfArrayBuffer(pdfUrl);
            const rawText = await extractAllTextFromPdfBuffer(buf);
            const text = sanitizeCopiedText(rawText);

            setStatus(statusBar, 'Đang copy vào clipboard...', '#0f172a', false);
            const ok = await copyToClipboard(text);
            if (ok) {
                setStatus(statusBar, 'Đã copy toàn bộ diễn tiến vào clipboard.', '#166534', true);
                // Enable copy-again with latest sanitized text
                btnCopyAgain.dataset.clipboardText = text;
                btnCopyAgain.style.display = 'inline-block';
            } else {
                setStatus(statusBar, 'Không thể copy vào clipboard.', '#b91c1c', true);
            }
        } catch (err) {
            console.error(err);
            setStatus(statusBar, 'Lỗi: ' + (err && err.message ? err.message : 'Không rõ'), '#b91c1c', true);
        }
    });

    // Copy-again action: copy last cached text without reloading PDF
    btnCopyAgain.addEventListener('click', async () => {
        const cached = btnCopyAgain.dataset.clipboardText || '';
        if (!cached) {
            setStatus(statusBar, 'Chưa có dữ liệu để copy lại.', '#b91c1c', true);
            return;
        }
        try {
            setStatus(statusBar, 'Đang copy vào clipboard...', '#0f172a', false);
            const ok = await copyToClipboard(cached);
            if (ok) setStatus(statusBar, 'Đã copy lại vào clipboard.', '#166534', true);
            else setStatus(statusBar, 'Không thể copy vào clipboard.', '#b91c1c', true);
        } catch (e) {
            setStatus(statusBar, 'Lỗi: ' + (e && e.message ? e.message : 'Không rõ'), '#b91c1c', true);
        }
    });
}

function initCopyDienTienAI() {
    if (!isToDieuTriPage()) return;
    // Try immediately and a few retries in case DOM is populated later
    const tryInject = () => {
        injectButton();
    };
    tryInject();
    let tries = 0;
    const iv = setInterval(() => {
        tries++;
        injectButton();
        if (document.getElementById('dr-copy-dien-tien-forAI') || tries > 20) clearInterval(iv);
    }, 300);
}

module.exports = { 
    initCopyDienTienAI,
    fetchPatientInfo,
    parseMMDDYYYYtoDDMMYYYY,
    todayDDMMYYYY,
    fetchPdfArrayBuffer,
    extractAllTextFromPdfBuffer,
    copyToClipboard,
    sanitizeCopiedText,
    setStatus
};

},{}],7:[function(require,module,exports){
// dialogManager.js - Manager for dialogs and modals

const DialogManager = {
    /**
     * Create a modal dialog
     */
    createDialog(id, options = {}) {
        // Remove existing dialog if exists
        const existing = document.getElementById(id);
        if (existing) existing.remove();

        const dialog = document.createElement('div');
        dialog.id = id;
        dialog.style = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: 1000001;
            background: rgba(0,0,0,0.25);
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        const inner = document.createElement('div');
        inner.style = `
            background: #fff;
            padding: 32px 24px 24px 24px;
            max-width: ${options.maxWidth || '1000px'};
            width: 95vw;
            max-height: ${options.maxHeight || '88vh'};
            overflow-y: auto;
            border-radius: 12px;
            box-shadow: 0 4px 32px rgba(0,0,0,0.18);
            position: relative;
        `;

        dialog.appendChild(inner);
        document.body.appendChild(dialog);

        // Click outside to close
        if (options.closeOnClickOutside !== false) {
            dialog.onclick = function (e) {
                if (e.target === dialog) dialog.remove();
            };
        }

        return { dialog, inner };
    },

    /**
     * Create action buttons for dialog
     */
    createActionButtons(buttons) {
        const buttonContainer = document.createElement('div');
    buttonContainer.style = 'margin-top:18px;display:flex;gap:12px;justify-content:flex-end;flex-wrap:wrap;';

        buttons.forEach(button => {
            const btn = document.createElement('button');
            btn.id = button.id;
            btn.className = button.className || 'btn';
            btn.textContent = button.text;
            btn.onclick = button.onclick;
            // Add visual styles for easier recognition
            btn.style.padding = '8px 14px';
            btn.style.borderRadius = '8px';
            btn.style.border = '1px solid #cbd5e1';
            btn.style.cursor = 'pointer';
            btn.style.fontWeight = '600';
            if (btn.className.includes('btn-primary')) {
                btn.style.background = 'linear-gradient(180deg, #1e88e5, #1976d2)';
                btn.style.color = '#fff';
                btn.style.borderColor = '#1976d2';
            } else if (btn.className.includes('btn-secondary')) {
                btn.style.background = '#f8fafc';
                btn.style.color = '#0f172a';
                btn.style.borderColor = '#cbd5e1';
            }
            buttonContainer.appendChild(btn);
        });

        return buttonContainer;
    },

    /**
     * Show toast notification
     */
    showToast(message, options = {}) {
        const toast = document.createElement('div');
        toast.innerText = message;
        toast.style = `
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            background: ${options.background || '#1976d2'};
            color: ${options.color || '#fff'};
            padding: 12px 28px;
            border-radius: 8px;
            font-size: 1.1em;
            z-index: 1000002;
            box-shadow: 0 2px 12px rgba(25,118,210,0.15);
            transition: opacity 0.3s;
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 400);
        }, options.duration || 1800);
    }
};

module.exports = DialogManager;

},{}],8:[function(require,module,exports){
// hsbaDataFetcher.js - Fetch HSBA V2 data via background tab and GraphQL

/*
Contract
- addHSBATab(rootEl, patient):
  - Adds a new tab button "HSBA Data" into `.checklist-tabs` within the provided rootEl (sidebar right column content)
  - Renders a tab pane with a Fetch button (id: dr-hsb-fetch-btn) to trigger the flow
  - Uses GM_openInTab to open the HSBA V2 link silently, waits for background tab to collect data on hsba.tahospital.vn, then displays results

- Background (auto-run when host === hsba.tahospital.vn):
  - Wait until the main grid appears (div.MuiGrid-root)
  - Parse pid from URL (public?pid=<...>)
  - Run fetch to /graphql using current domain’s cookies (no cross-origin hack)
  - Store results via GM_setValue under key `dr_hsba_result_${pid}`

Notes
- Requires Tampermonkey grants: GM_openInTab, GM_setValue, GM_addValueChangeListener (already used in this repo for GM_xmlhttpRequest)
- Falls back gracefully when grants aren’t available (opens in foreground and asks user to wait)
*/

const DialogManager = require('./dialogManager');
const ChecklistService = require('../services/checklistService');
const BS_CAI_DAT = (() => {
	try { return require('../BS_CAI_DAT_GIAO_DIEN'); } catch(_) { return (typeof window !== 'undefined' && window.BS_CAI_DAT) ? window.BS_CAI_DAT : {}; }
})();

// Track opened HSBA tabs by patient id to auto-close after data arrives
const HSBA_OPEN_TABS = new Map();
function registerOpenedTab(pid, ref) {
	try {
		const prev = HSBA_OPEN_TABS.get(pid);
		if (prev && typeof prev.close === 'function') {
			try { prev.close(); } catch(_) {}
		}
	} catch(_) {}
	HSBA_OPEN_TABS.set(pid, ref);
	try { console.log('[DR][HSBA] registered background tab for pid:', pid, ref); } catch(_) {}
}
function closeOpenedTab(pid, reason = 'done') {
	try {
		const ref = HSBA_OPEN_TABS.get(pid);
		if (ref && typeof ref.close === 'function') {
			try { ref.close(); console.log('[DR][HSBA] closed background tab (GM_openInTab) for pid:', pid, 'reason:', reason); } catch(e) { console.warn('[DR][HSBA] close tab error:', e); }
		} else if (ref && typeof ref === 'object' && 'close' in ref) {
			try { ref.close(); console.log('[DR][HSBA] closed background window for pid:', pid, 'reason:', reason); } catch(e) { console.warn('[DR][HSBA] close window error:', e); }
		} else {
			console.warn('[DR][HSBA] no tabRef to close for pid:', pid, 'reason:', reason);
		}
	} catch(e) { console.warn('[DR][HSBA] closeOpenedTab exception:', e); }
	HSBA_OPEN_TABS.delete(pid);
}

// Build rules from BS_CAI_DAT.HSBA_CHECKLIST_MAP (array of rule objects)
const __HSBA_RULES__ = Array.isArray(BS_CAI_DAT.HSBA_CHECKLIST_MAP) ? BS_CAI_DAT.HSBA_CHECKLIST_MAP : [];
const HSBA_SHOW_SET = new Set(__HSBA_RULES__.filter(r => r && r.tenmau && r.show).map(r => r.tenmau));
const HSBA_SYNC_SET = new Set(__HSBA_RULES__.filter(r => r && r.tenmau && r.sync).map(r => r.tenmau));
const HSBA_TENMAU_TO_CHECKLIST = __HSBA_RULES__.reduce((acc, r) => {
	if (r && r.sync && r.tenmau && r.checklist) acc[r.tenmau] = r.checklist;
	return acc;
}, {});

function createEl(tag, attrs = {}, children = []) {
	const el = document.createElement(tag);
	Object.entries(attrs).forEach(([k, v]) => {
		if (k === 'style' && typeof v === 'object') {
			Object.assign(el.style, v);
		} else if (k === 'dataset' && v && typeof v === 'object') {
			Object.entries(v).forEach(([dk, dv]) => el.dataset[dk] = dv);
		} else if (k in el) {
			try { el[k] = v; } catch(_) { el.setAttribute(k, v); }
		} else {
			el.setAttribute(k, v);
		}
	});
	(Array.isArray(children) ? children : [children]).forEach(c => {
		if (c == null) return;
		if (typeof c === 'string') el.appendChild(document.createTextNode(c));
		else el.appendChild(c);
	});
	return el;
}

function formatDateYYYYMMDD(d = new Date()) {
	const yyyy = d.getFullYear();
	const mm = String(d.getMonth() + 1).padStart(2, '0');
	const dd = String(d.getDate()).padStart(2, '0');
	return `${yyyy}-${mm}-${dd}`;
}

function parseDateSafe(s) {
	if (!s || typeof s !== 'string') return null;
	// Try ISO first; fallback to replace spaces
	let dt = new Date(s);
	if (isNaN(dt.getTime())) {
		try { dt = new Date(s.replace(' ', 'T')); } catch(_) {}
	}
	return isNaN(dt.getTime()) ? null : dt;
}

function formatDateDDMMYYYY(dt) {
	if (!(dt instanceof Date) || isNaN(dt.getTime())) return '';
	const dd = String(dt.getDate()).padStart(2, '0');
	const mm = String(dt.getMonth() + 1).padStart(2, '0');
	const yyyy = dt.getFullYear();
	return `${dd}/${mm}/${yyyy}`;
}

function formatDateTimeDDMMYYYYHHmm(dt) {
	if (!(dt instanceof Date) || isNaN(dt.getTime())) return '';
	const ddmmyyyy = formatDateDDMMYYYY(dt);
	const hh = String(dt.getHours()).padStart(2, '0');
	const mi = String(dt.getMinutes()).padStart(2, '0');
	return `${ddmmyyyy} ${hh}:${mi}`;
}

async function getHSBAV2Link(mabn) {
	try {
		const res = await fetch('/ToDieuTri/LoadLinkHsba', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'X-Requested-With': 'XMLHttpRequest'
			},
			credentials: 'include',
			body: 'code=' + encodeURIComponent(mabn)
		});
		const json = await res.json();
		if (json && json.data && json.data.link) return json.data.link;
		return `/hoso/${encodeURIComponent(String(mabn))}`; // fallback v1
	} catch (e) {
		return `/hoso/${encodeURIComponent(String(mabn))}`; // fallback v1
	}
}

function renderResult(container, result, ctx = {}) {
	// Render only filtered data (documents with allowed "tenmau")
	container.innerHTML = '';
	try { console.log('[DR][HSBA] filtered result received:', result); } catch(_) {}
	if (!result || !result.data || !result.data.hoSoBenhAns) {
		container.textContent = 'Không có dữ liệu HSBA.';
		return;
	}
	const hs = result.data.hoSoBenhAns;
	const rawItems = Array.isArray(hs.items) ? hs.items : [];
	// Filter: skip episodes with hoten === null (do not display)
	const items = rawItems.filter(it => it && it.hoten != null);
	// Count only valid, displayable docs (have tenfile or fileName)
	const docCount = items.reduce((sum, it) => sum + (Array.isArray(it.hoSoChiTiet) ? it.hoSoChiTiet.reduce((s, g) => s + (Array.isArray(g.chiTiets) ? g.chiTiets.filter(x => (x && (x.tenfile || x.fileName) && x.tenmau)).length : 0), 0) : 0), 0);
	const summary = createEl('div', { style: { marginBottom: '8px' } }, [
		createEl('div', {}, `Tổng số đợt HSBA: ${hs.total != null ? hs.total : items.length}`),
		createEl('div', {}, `Số tài liệu đã lọc: ${docCount}`)
	]);
	container.appendChild(summary);

	if (items.length === 0) return;

	// Determine current episode: prefer one with ngayra null, otherwise the latest by ngayvao
	const pickEpisode = () => {
		const open = items.filter(it => !it.ngayra);
		const arr = (open.length ? open : items).slice();
		arr.sort((a,b) => {
			const ta = parseDateSafe(a.ngayvao)?.getTime() || 0;
			const tb = parseDateSafe(b.ngayvao)?.getTime() || 0;
			return tb - ta; // newest first
		});
		return arr[0] || null;
	};
	const currentEpisode = pickEpisode();

	// From current episode, compute HSBA doc matches and persist to checklist state
	try {
		if (currentEpisode && Array.isArray(currentEpisode.hoSoChiTiet)) {
			const epStart = parseDateSafe(currentEpisode.ngayvao);
			const epEnd = parseDateSafe(currentEpisode.ngayra);
			const startTs = epStart ? epStart.getTime() : -Infinity;
			const endTs = epEnd ? epEnd.getTime() : Infinity;
			const docSet = new Set();
			let latestDocDates = {};
			currentEpisode.hoSoChiTiet.forEach(g => {
				(Array.isArray(g.chiTiets) ? g.chiTiets : []).forEach(d => {
					if (!d || !d.tenmau) return;
					if (!HSBA_SYNC_SET.has(d.tenmau)) return;
					// Only consider documents within the current episode date range
					const dDate = parseDateSafe(d.ngay);
					if (!dDate) return;
					const ts = dDate.getTime();
					if (ts < startTs || ts > endTs) return;
					docSet.add(d.tenmau);
					const prev = latestDocDates[d.tenmau] || 0;
					if (ts > prev) latestDocDates[d.tenmau] = ts;
				});
			});
			const map = HSBA_TENMAU_TO_CHECKLIST;
			const nowIso = new Date().toISOString();
			const hsbaSynced = Object.create(null);
			for (const tenmau of docSet) {
				const target = map[tenmau];
				if (!target) continue;
				const dateTs = latestDocDates[tenmau] || 0;
				hsbaSynced[target] = {
					matched: true,
					source: 'hsba',
					docName: tenmau,
					docDate: dateTs ? new Date(dateTs).toISOString() : null,
					updatedAt: nowIso
				};
			}
			if (Object.keys(hsbaSynced).length) {
				// Merge into window.checklistState and persist
				if (!window.checklistState) window.checklistState = {};
				const prev = window.checklistState.hsbaSynced || {};
				window.checklistState.hsbaSynced = { ...prev, ...hsbaSynced, __lastSyncAt: nowIso };
				if (window.checklistObj && ChecklistService && typeof ChecklistService.updateChecklistState === 'function') {
					ChecklistService.updateChecklistState(window.checklistObj, window.checklistState, { enqueueOnOffline: true, ctxId: (window.dr_sidebar_ctx && window.dr_sidebar_ctx.id), signal: (window.dr_sidebar_ctx && window.dr_sidebar_ctx.signal) })
						.then(() => {
							// Ask dashboard to refresh checklist badges if function exists
							try { if (typeof window.dr_refreshChecklistBadges === 'function') window.dr_refreshChecklistBadges(); } catch(_) {}
						})
						.catch(() => {});
				} else {
					try { if (typeof window.dr_refreshChecklistBadges === 'function') window.dr_refreshChecklistBadges(); } catch(_) {}
				}
			}
		}
	} catch(_) {}
	const outer = createEl('div', { className: 'dr-hsba-container', style: { maxHeight: '320px', overflowY: 'auto', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '8px' } });
	items.forEach((it, idx) => {
	const headerParts = [];
	if (it.hoten) headerParts.push(it.hoten);
	if (it.mabn) headerParts.push(it.mabn);
	if (it.tenkp) headerParts.push(it.tenkp);
	const ngayVaoDt = parseDateSafe(it.ngayvao);
	const ngayVaoStr = formatDateDDMMYYYY(ngayVaoDt);
	const header = createEl('div', { className: 'dr-hsba-episode-title', style: { fontWeight: '700', margin: '8px 0 6px', color: '#fff', background: '#1976d2' } }, headerParts.concat(ngayVaoStr ? [ngayVaoStr] : []).join(' - '));
		outer.appendChild(header);
		const groups = Array.isArray(it.hoSoChiTiet) ? it.hoSoChiTiet : [];
	groups.forEach(g => {
			const rawDocs = Array.isArray(g.chiTiets) ? g.chiTiets : [];
			if (!rawDocs.length) return;
			const gTitle = createEl('div', { className: 'dr-hsba-group-title', style: { fontWeight: '600', margin: '4px 0', color: '#334155' } }, `${g.tengay || g.gayid || 'Mục'}:`);
			outer.appendChild(gTitle);
			const ul = createEl('ul', { className: 'dr-hsba-list', style: { margin: 0, paddingLeft: '18px', listStyle: 'disc' } });
			// Build displayable docs: must have tenmau and tenfile/fileName
			const docs = rawDocs
				.map(d => ({
					...d,
					_tenfile: d && (d.tenfile || d.fileName) || '',
					_date: parseDateSafe(d && d.ngay)
				}))
				.filter(d => {
					if (!d) return false;
					if (!d.tenmau || !HSBA_SHOW_SET.has(d.tenmau)) {
						try { console.debug('[DR][HSBA] skip doc (tenmau not allowed):', d); } catch(_) {}
						return false;
					}
					if (!d._tenfile) {
						try { console.warn('[DR][HSBA] skip doc (missing tenfile):', d); } catch(_) {}
						return false;
					}
					return true;
				})
				.sort((a, b) => {
					const ta = a._date ? a._date.getTime() : -Infinity;
					const tb = b._date ? b._date.getTime() : -Infinity;
					return tb - ta; // descending (newest first)
				});
			try { console.log('[DR][HSBA] group sorted docs:', { group: g.tengay || g.gayid, count: docs.length }); } catch(_) {}

	    const openViewer = async (tenfile, tenmau, ngayDisplay) => {
				try {
					const patient = ctx && ctx.patient;
					const mabn = patient && (patient.pid || patient.mabn);
					if (!mabn) {
						console.error('[DR][HSBA] openViewer: missing mabn');
						return;
					}
					// Get a fresh HSBA V2 link with tokens (pid/s/t/site) and append hash with file to view inline
					const baseLink = await getHSBAV2Link(mabn);
		    const parts = [];
		    parts.push(`dr-viewer=${encodeURIComponent(tenfile)}`);
		    if (tenmau) parts.push(`dr-name=${encodeURIComponent(tenmau)}`);
		    if (ngayDisplay) parts.push(`dr-date=${encodeURIComponent(ngayDisplay)}`);
		    const hash = parts.join('&');
		    const url = `${baseLink}${baseLink.includes('#') ? '' : '#'}${baseLink.includes('#') ? '&' : ''}${hash}`;
		    console.log('[DR][HSBA] opening inline viewer:', { mabn, tenfile, tenmau, ngayDisplay, url });
					window.open(url, '_blank');
				} catch (err) {
					console.error('[DR][HSBA] openViewer error:', err);
				}
			};

			docs.forEach(d => {
				const nd = d._date || parseDateSafe(d && d.ngay);
				const ngayFmt = formatDateTimeDDMMYYYYHHmm(nd) || (d && d.ngay) || '';
				const label = `${d.tenmau} - ${ngayFmt}`;
				const li = createEl('li', {
					className: 'dr-hsba-item',
					title: 'Mở tài liệu ở tab mới',
					dataset: { tenfile: d._tenfile },
					style: { cursor: 'pointer', padding: '2px 0' }
				}, label);
				li.addEventListener('click', () => {
					const tf = li.dataset.tenfile || '';
					if (!tf) {
						console.error('[DR][HSBA] click but missing data-tenfile');
						return;
					}
					openViewer(tf, d.tenmau, ngayFmt);
				});
				ul.appendChild(li);
			});
			outer.appendChild(ul);
		});
		if (idx < items.length - 1) outer.appendChild(createEl('hr', { style: { border: 'none', borderTop: '1px dashed #e5e7eb', margin: '8px 0' } }));
	});
	container.appendChild(outer);
}

function attachTabToggleBehavior(rootEl) {
	const tabs = rootEl.querySelectorAll('.checklist-tabs .tab-btn');
	const panes = rootEl.querySelectorAll('.tab-content .tab-pane');
	tabs.forEach(btn => {
		if (btn.__drBound) return;
		btn.__drBound = true;
		btn.addEventListener('click', function() {
			const targetTab = this.getAttribute('data-tab');
			tabs.forEach(b => { b.classList.remove('active'); b.style.background = 'transparent'; b.style.color = '#666'; b.style.fontWeight = 'normal'; });
			this.classList.add('active');
			this.style.background = '#0ea5e9';
			this.style.color = '#fff';
			this.style.fontWeight = 'bold';
			panes.forEach(p => { p.classList.remove('active'); p.style.display = 'none'; });
			const pane = rootEl.querySelector(`.tab-pane[data-tab="${targetTab}"]`);
			if (pane) { pane.classList.add('active'); pane.style.display = 'block'; }
		});
	});
}

function addHSBATab(rootEl, patient) {
	try {
		if (!rootEl) return;
		const tabsBar = rootEl.querySelector('.checklist-tabs');
		const tabContent = rootEl.querySelector('.tab-content');
		if (!tabsBar || !tabContent) return;

		// Avoid duplicate
		if (tabsBar.querySelector('#dr-hsba-tab-btn')) return;

		const btn = createEl('button', {
			id: 'dr-hsba-tab-btn',
			className: 'tab-btn',
			dataset: { tab: 'hsba' },
			style: {
				padding: '8px 16px', border: 'none', background: 'transparent', color: '#666',
				borderRadius: '4px 4px 0 0', cursor: 'pointer', marginLeft: '4px'
			}
		}, 'HSBA Data');
		tabsBar.appendChild(btn);

		const pane = createEl('div', {
			className: 'tab-pane',
			dataset: { tab: 'hsba' },
			style: { display: 'none' }
		});

		const status = createEl('div', { id: 'dr-hsba-status', style: { margin: '6px 0', color: '#0f172a' } });
		const resultBox = createEl('div', { id: 'dr-hsba-result', style: { fontSize: '13px' } });
		const btnFetch = createEl('button', {
			id: 'dr-hsb-fetch-btn',
			className: 'btn btn-primary',
			style: { padding: '8px 14px', borderRadius: '8px', cursor: 'pointer' }
		}, 'Lấy HSBA từ file');
		// When clicking the HSBA tab, auto-fetch if there is no data yet
		btn.addEventListener('click', () => {
			try {
				const empty = !resultBox || (!resultBox.firstChild && !String(resultBox.textContent || '').trim());
				if (empty) {
					btnFetch.click();
				}
			} catch (_) {}
		});
		btnFetch.addEventListener('click', async () => {
			// Defensive: ensure patient exists
			const mabn = patient && (patient.pid || patient.mabn);
			if (!mabn) { status.textContent = 'Không tìm thấy MABN.'; return; }
			status.textContent = 'Đang mở HSBA V2 trong nền...';
			const link = await getHSBAV2Link(mabn);
			let tabRef = null;
			try {
				if (typeof GM_openInTab === 'function') {
					tabRef = GM_openInTab(link, { active: false, insert: true });
					registerOpenedTab(String(mabn), tabRef);
				} else {
					const w = window.open(link, '_blank');
					if (w) registerOpenedTab(String(mabn), w);
				}
			} catch(_) {
				const w = window.open(link, '_blank');
				if (w) registerOpenedTab(String(mabn), w);
			}

			// Result key for cross-tab delivery
			const key = `dr_hsba_result_${mabn}`;
			// 1) Realtime listener when supported
			if (typeof GM_addValueChangeListener === 'function') {
		GM_addValueChangeListener(key, function(name, oldVal, newVal, remote) {
					if (!remote || !newVal) return;
					try {
						const payload = typeof newVal === 'string' ? JSON.parse(newVal) : newVal;
						try { console.log('[DR][HSBA] payload received via listener:', payload); } catch(_) {}
						renderResult(resultBox, payload, { patient });
						status.textContent = 'Đã lấy HSBA.';
			// Close the background tab for this patient
			setTimeout(() => closeOpenedTab(String(mabn), 'listener'), 300);
					} catch (e) {
						status.textContent = 'Lỗi phân tích dữ liệu HSBA.';
						console.warn(e);
					}
				});
			}
			// 2) Polling fallback when listener is unavailable or unreliable
			let attempts = 0;
			const maxAttempts = 60; // ~60s
			if (typeof GM_getValue === 'function') {
				const iv = setInterval(async () => {
					try {
						attempts++;
						const raw = await GM_getValue(key, null);
						if (raw) {
							clearInterval(iv);
							const payload = typeof raw === 'string' ? JSON.parse(raw) : raw;
							try { console.log('[DR][HSBA] payload received via polling:', payload); } catch(_) {}
							renderResult(resultBox, payload, { patient });
							status.textContent = 'Đã lấy HSBA.';
							// Close the background tab for this patient
							setTimeout(() => closeOpenedTab(String(mabn), 'polling'), 300);
							return;
						}
						if (attempts === 5 && !resultBox.firstChild) {
							status.textContent = 'Đang chờ HSBA tải xong... (có thể 5–15s)';
						}
						if (attempts >= maxAttempts) {
							clearInterval(iv);
							if (!resultBox.firstChild) status.textContent = 'Hết thời gian chờ HSBA.';
						}
					} catch (_) {}
				}, 1000);
			} else if (!resultBox.firstChild) {
				status.textContent = 'Không hỗ trợ lắng nghe nền. Hãy chuyển sang tab HSBA để tải xong, rồi quay lại.';
			}
		});

		pane.appendChild(btnFetch);
		pane.appendChild(status);
		pane.appendChild(resultBox);
		tabContent.appendChild(pane);

		// Bind toggle behavior (for newly added button)
		attachTabToggleBehavior(rootEl);
	} catch (e) {
		console.warn('addHSBATab error', e);
	}
}

// Background worker on hsba.tahospital.vn — auto-fetch GraphQL and publish via GM_setValue
async function hsbaBackgroundFetcherIfNeeded() {
	try {
		if (typeof window === 'undefined') return;
		if (window.location.hostname !== 'hsba.tahospital.vn') return;
	const params = new URLSearchParams(window.location.search);
	const pid = params.get('pid');
	const s = params.get('s') || '';
	const t = params.get('t') || '';
	const site = params.get('site') || '1';
		if (!pid) return;

		function waitForGrid() {
			return new Promise(resolve => {
				// Prefer the explicit container; fallback to generic grid if classnames change
				const targetSelectors = [
					'div.MuiGrid-root'
				];
				if (targetSelectors.some(q => document.querySelector(q))) return resolve(true);
				const obs = new MutationObserver(() => {
					if (targetSelectors.some(q => document.querySelector(q))) {
						obs.disconnect();
						resolve(true);
					}
				});
				obs.observe(document.documentElement || document.body, { childList: true, subtree: true });
				// Fallback timeout
				setTimeout(() => { try { obs.disconnect(); } catch(_) {} resolve(true); }, 15000);
			});
		}

		await waitForGrid();

		const today = formatDateYYYYMMDD(new Date());
		const body = {
			operationName: 'hoSoBenhAns',
			variables: {
				mabn: String(pid),
				tuNgay: '2024-01-01',
				denNgay: today,
				offset: 0,
				limit: 1000
			},
			query: `query hoSoBenhAns($mabn: String, $tuNgay: DateTime, $denNgay: DateTime, $daKy: Boolean, $offset: Int, $limit: Int, $makp: String, $raVien: Boolean) {
  hoSoBenhAns(
	mabn: $mabn
	tuNgay: $tuNgay
	denNgay: $denNgay
	daKy: $daKy
	offset: $offset
	limit: $limit
	makp: $makp
	raVien: $raVien
  ) {
	items {
	  mabn
	  hoten
	  ngaysinh
	  phai
	  diachi
	  mavaovien
	  sovaovien
	  doituong
	  tenkp
	  ngayvao
	  ngayra
	  chandoan
	  tenba
	  ngayky
	  loai
	  dienthoai
	  tenfile
	  fileName
	  tuoi
	  daky
	  maql
	  tennguoiky
	  coTheKyTong
	  ChiDinhNgoai
	  nguoiky
	  hoSoChiTiet {
		stt
		gayid
		tengay
		chiTiets {
		  id
		  tenfile
		  fileName
		  ngay
		  tenmau
		  daky
		  coTheKyChiTiet
		  congkhai
		  maql
		  BieuMau {
			id
			maphieu
			stt
			gayid
			slkyso
			ghichu
			loaiphieu
			trangthai
			chophepxoa
			congkhai
			xemtomtat
			NhomBieuMau {
			  id
			  ten
			  __typename
			}
			__typename
		  }
		  __typename
		}
		__typename
	  }
	  loaidieutri
	  __typename
	}
	total
	offset
	limit
	__typename
  }
}`
		};

				// Inject a main-world script that performs the fetch with the exact headers and posts the result back
				try {
						if (!window.__dr_hsba_injected__) {
								window.__dr_hsba_injected__ = true;
								// Listen for result from main world and persist via GM_setValue
								window.addEventListener('message', (ev) => {
										try {
												const d = ev && ev.data;
												if (!d || d.type !== 'DR_HSBA_RESULT' || d.pid !== pid) return;
												// Filter payload to only keep allowed tenmau docs
												let filtered = d.payload || {};
												try {
													const src = d.payload;
													if (src && src.data && src.data.hoSoBenhAns) {
														const cloned = JSON.parse(JSON.stringify(src));
														const items = Array.isArray(cloned.data.hoSoBenhAns.items) ? cloned.data.hoSoBenhAns.items : [];
														items.forEach(it => {
															if (Array.isArray(it.hoSoChiTiet)) {
																it.hoSoChiTiet.forEach(g => {
																	if (Array.isArray(g.chiTiets)) {
																		g.chiTiets = g.chiTiets.filter(x => !x || !x.tenmau ? false : HSBA_SHOW_SET.has(x.tenmau));
																	}
																});
															}
														});
														filtered = cloned;
													}
												} catch(_) {}
												if (typeof GM_setValue === 'function') {
														GM_setValue(`dr_hsba_result_${pid}`, JSON.stringify(filtered));
												} else {
														window.__dr_hsba_result__ = filtered;
												}
										} catch(_) {}
								});
												const refUrl = `${window.location.origin}/public?pid=${encodeURIComponent(pid)}&t=${encodeURIComponent(t)}&s=${encodeURIComponent(s)}&site=${encodeURIComponent(site)}`;
								const script = document.createElement('script');
								script.type = 'text/javascript';
								script.textContent = `(() => {
	try {
		const pid = ${JSON.stringify(pid)};
		const s = ${JSON.stringify(s)};
		const t = ${JSON.stringify(t)};
		const site = ${JSON.stringify(String(site))};
		const body = ${JSON.stringify(body)};
		const referrer = ${JSON.stringify(refUrl)};
						const headers = {
							"accept": "*/*",
							"accept-language": "en-US,en;q=0.9,vi;q=0.8",
							"content-type": "application/json",
							pid: String(pid),
							priority: "u=1, i",
							s: s,
							site: String(site),
							t: t
						};

						// Inline viewer: if URL hash has dr-viewer, fetch the file and render via blob URL
						const showInlineViewer = (filePath, docName, docDate) => {
							try {
								const overlay = document.createElement('div');
								overlay.id = 'dr-hsba-viewer-overlay';
								overlay.style.cssText = 'position:fixed;inset:0;background:rgba(15,23,42,0.75);z-index:2147483647;display:flex;align-items:center;justify-content:center;padding:0;width:100vw;height:100vh;';
								overlay.setAttribute('role', 'dialog');
								overlay.setAttribute('aria-modal', 'true');
								const frameWrap = document.createElement('div');
								frameWrap.id = 'dr-hsba-viewer-framewrap';
								frameWrap.style.cssText = 'background:#fff;width:100vw;height:100vh;box-shadow:0 10px 30px rgba(0,0,0,0.4);border-radius:8px;display:flex;flex-direction:column;overflow:hidden;margin:0;';
								const bar = document.createElement('div');
								bar.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:4px 8px;background:#0ea5e9;color:#fff;font-weight:700;';
								const title = document.createElement('span');
								title.textContent = 'Xem tài liệu HSBA';
								const actions = document.createElement('div');
								actions.style.cssText = 'display:flex;gap:8px;align-items:center;';
								const btnDownload = document.createElement('button');
								btnDownload.id = 'dr-hsba-viewer-download';
								btnDownload.textContent = 'Tải xuống';
								btnDownload.style.cssText = 'background:#fff;color:#0f172a;border:none;border-radius:6px;padding:4px 8px;cursor:pointer;';
								const prevOverflow = document.body && document.body.style ? document.body.style.overflow : '';
								let currentBlobUrl = null;
								const revokeUrl = () => { try { if (currentBlobUrl) { URL.revokeObjectURL(currentBlobUrl); currentBlobUrl = null; } } catch(_) {} };
								const doClose = () => { try { revokeUrl(); if (document.body) document.body.style.overflow = prevOverflow || ''; overlay.remove(); } catch(_) {} };
								actions.appendChild(btnDownload);
								bar.appendChild(title);
								bar.appendChild(actions);
								const iframe = document.createElement('iframe');
								iframe.id = 'dr-hsba-viewer-iframe';
								iframe.style.cssText = 'flex:1;border:0;background:#1f2937';
								frameWrap.appendChild(bar);
								frameWrap.appendChild(iframe);
								overlay.appendChild(frameWrap);
								if (document && document.body) { document.body.style.overflow = 'hidden'; }
								(document.body || document.documentElement).appendChild(overlay);
				// ESC disabled per requirements
				const getFileName = () => {
									try {
					const sanitize = (s) => (s || '').replace(/[\\/:*?"<>|]/g, ' ').replace(/\s+/g, ' ').trim();
					const namePart = sanitize(docName || 'HSBA');
					const datePart = sanitize(docDate || '');
					const combined = (namePart + (datePart ? ' - ' + datePart : '')).trim() || 'hsba-document';
					return combined + '.pdf';
									} catch(_) { return 'hsba-document.pdf'; }
								};
								const fileName = getFileName();
								const triggerDownload = () => {
									try {
										if (currentBlobUrl) {
											const a = document.createElement('a');
											a.href = currentBlobUrl;
											a.download = fileName;
											document.body.appendChild(a);
											a.click();
											a.remove();
										} else {
											// Fallback: navigate to API to download with credentials
											const a = document.createElement('a');
											a.href = '/api/hosobenhan/download?url=' + encodeURIComponent(filePath);
											a.target = '_blank';
											a.rel = 'noopener';
											document.body.appendChild(a);
											a.click();
											a.remove();
										}
									} catch(_) {}
								};
								btnDownload.onclick = () => triggerDownload();
								fetch('/api/hosobenhan/download?url=' + encodeURIComponent(filePath), { credentials: 'include' })
									.then(r => r.blob())
									.then(blob => {
										const u = URL.createObjectURL(blob);
										currentBlobUrl = u;
										iframe.src = u;
									})
									.catch(err => {
										console.error('[DR][HSBA] viewer fetch error:', err);
										doClose();
									});
							} catch (e) { console.error('[DR][HSBA] viewer error:', e); }
						};

						try {
							const h = window.location.hash || '';
							const m = h.match(/[#&]dr-viewer=([^&]+)/);
							if (m && m[1]) {
								const filePath = decodeURIComponent(m[1]);
								console.log('[DR][HSBA] inline viewer param detected:', filePath);
								let name = null, dateLabel = null;
								const n = h.match(/[#&]dr-name=([^&]+)/);
								if (n && n[1]) name = decodeURIComponent(n[1]);
								const d2 = h.match(/[#&]dr-date=([^&]+)/);
								if (d2 && d2[1]) dateLabel = decodeURIComponent(d2[1]);
								showInlineViewer(filePath, name, dateLabel);
							}
						} catch(_) {}
						fetch("/graphql", {
							headers,
			referrer: referrer,
			body: JSON.stringify(body),
			method: "POST",
			mode: "cors",
			credentials: "include"
		}).then(r => r.json()).then(json => {
			try { console.log('[DR][HSBA] raw API response:', json); } catch(_) {}
			window.postMessage({ type: 'DR_HSBA_RESULT', pid, payload: json }, '*');
		}).catch(err => {
			window.postMessage({ type: 'DR_HSBA_RESULT', pid, payload: { error: String(err && err.message || err) } }, '*');
		});
	} catch (e) {
		try { window.postMessage({ type: 'DR_HSBA_RESULT', pid: ${JSON.stringify(pid)}, payload: { error: String(e && e.message || e) } }, '*'); } catch(_) {}
	}
})();`;
								(document.head || document.documentElement || document.body).appendChild(script);
								// Optional: remove the script node after injected
								setTimeout(() => { try { script.remove(); } catch(_) {} }, 1000);
						}
				} catch(_) {}
	} catch (e) {
		// Swallow errors to avoid impacting page
		console.warn('hsbaBackgroundFetcherIfNeeded error', e);
	}
}

// Run background fetcher immediately on hsba domain
try { hsbaBackgroundFetcherIfNeeded(); } catch(_) {}

module.exports = { addHSBATab };


},{"../BS_CAI_DAT_GIAO_DIEN":1,"../services/checklistService":27,"./dialogManager":7}],9:[function(require,module,exports){
// components/khoaSelect.js - Reusable khoa selection button with dropdown

const ApiService = require('../services/apiService');

function ensureStyles() {
  if (document.getElementById('dr-khoa-select-css')) return;
  const st = document.createElement('style');
  st.id = 'dr-khoa-select-css';
  st.textContent = `
    .dr-khoa-select{display:inline-flex;align-items:center;gap:6px;padding:4px 8px;border:1px solid #e5e7eb;border-radius:8px;background:#fff;color:#0f172a;font-size:13px;cursor:pointer}
    .dr-khoa-caret{border:solid #64748b;border-width:0 2px 2px 0;display:inline-block;padding:2px;transform:rotate(45deg);margin-left:2px}
    .dr-khoa-select-wrap{position:relative;display:inline-block}
    .dr-khoa-menu{position:absolute;top:110%;left:0;min-width:220px;max-height:320px;overflow:auto;background:#fff;border:1px solid #e5e7eb;border-radius:8px;box-shadow:0 10px 20px rgba(2,6,23,.08);z-index:9999;padding:6px}
    .dr-khoa-item{padding:6px 8px;border-radius:6px;cursor:pointer}
    .dr-khoa-item:hover{background:#f1f5f9}
    .dr-khoa-active{background:#e0f2fe}
    .dr-khoa-search{display:block;width:100%;box-sizing:border-box;margin:4px 0 6px 0;padding:6px 8px;border:1px solid #e5e7eb;border-radius:6px}
  `;
  document.head.appendChild(st);
}

function getStoredKhoaId(defaultId) {
  try { return localStorage.getItem('bsnt_khoa_dashboard') || defaultId; } catch(_) { return defaultId; }
}
function setStoredKhoaId(id) {
  try { localStorage.setItem('bsnt_khoa_dashboard', String(id)); } catch(_) {}
}

function createKhoaSelect(opts) {
  ensureStyles();
  const { container, onChange } = opts || {};
  const wrap = document.createElement('span');
  wrap.className = 'dr-khoa-select-wrap';
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'dr-khoa-select';
  btn.id = 'dr-khoa-select';
  const label = document.createElement('span');
  label.textContent = 'Chọn khoa';
  const caret = document.createElement('i'); caret.className = 'dr-khoa-caret';
  btn.appendChild(label); btn.appendChild(caret);
  const menu = document.createElement('div'); menu.className = 'dr-khoa-menu'; menu.style.display = 'none';
  const search = document.createElement('input'); search.className = 'dr-khoa-search'; search.placeholder = 'Tìm khoa...';
  const listBox = document.createElement('div');
  menu.appendChild(search); menu.appendChild(listBox);
  wrap.appendChild(btn); wrap.appendChild(menu);
  if (container) container.innerHTML = '', container.appendChild(wrap);

  let allKhoa = [];
  let currentId = getStoredKhoaId('551');

  function renderList(filter='') {
    listBox.innerHTML = '';
    const f = filter.trim().toLowerCase();
    allKhoa
      .filter(k => !f || (k.name||'').toLowerCase().includes(f) || String(k.id).includes(f))
      .forEach(k => {
        const item = document.createElement('div');
        item.className = 'dr-khoa-item' + (String(k.id) === String(currentId) ? ' dr-khoa-active' : '');
        item.textContent = `${k.name || 'Khoa'} (${k.id})`;
        item.addEventListener('click', () => {
          currentId = String(k.id);
          setStoredKhoaId(currentId);
          label.textContent = k.name || `Khoa ${k.id}`;
          if (typeof onChange === 'function') onChange(currentId, k.name || `Khoa ${k.id}`);
          menu.style.display = 'none';
        });
        listBox.appendChild(item);
      });
  }

  async function init() {
    try {
      const list = await ApiService.fetchKhoaPhong();
      allKhoa = Array.isArray(list) ? list : [];
      const found = allKhoa.find(k => String(k.id) === String(currentId));
      label.textContent = (found && found.name) || `Khoa ${currentId}`;
      renderList();
    } catch(_) {
      label.textContent = `Khoa ${currentId}`;
    }
  }

  btn.addEventListener('click', async (e) => {
    e.stopPropagation();
    if (menu.style.display === 'none') {
      if (!allKhoa.length) await init();
      menu.style.display = 'block';
      search.focus();
    } else {
      menu.style.display = 'none';
    }
  });
  search.addEventListener('input', () => renderList(search.value || ''));
  document.addEventListener('click', (e) => {
    if (!wrap.contains(e.target)) menu.style.display = 'none';
  });

  init();
  return { el: wrap, button: btn, refreshLabel: init, getKhoaId: () => currentId };
}

module.exports = { createKhoaSelect };

},{"../services/apiService":26}],10:[function(require,module,exports){
// components/listView.js - Rendering for list view rows and actions
const Utils = require('../utils');
const PatientDataMapper = require('../utils/patientDataMapper');
const { createYLenhTags, hasMedsDoneToday } = require('../utils/tagUtils');
const { escapeHtml } = require('../utils/htmlUtils');
const { createCopyOneButton, createToDieuTriButton, createHsbaButton } = require('./actionButtons');

function createListActions(item, onCopy) {
    const wrap = document.createElement('div');
    wrap.className = 'dr-list-actions';
    

    // Copy icon for single-patient report (left-most as requested)
    const btnCopy = createCopyOneButton({ item, variant: 'icon' });
    wrap.appendChild(btnCopy);

    // Document icon for Tờ điều trị
    const btnToDieuTri = createToDieuTriButton({ item, variant: 'icon' });
    wrap.appendChild(btnToDieuTri);

    // Eye icon for HSBA V2 (right-most)
    const btnHsba = createHsbaButton({ item, variant: 'icon' });
    wrap.appendChild(btnHsba);

    return wrap;
}

function createListRow(item, opts = {}) {
    const row = document.createElement('div');
    row.className = 'dr-list-row';
    const age = Utils.calculateAge(item.ngaysinh);
    const gender = item.phai === 1 ? 'Nữ' : 'Nam';
    const formattedLocation = PatientDataMapper.formatRoomLocation(
        item.teN_PHONG, item.teN_GIUONG, item.teN_TANG, item.teN_TOANHA
    );
    const { composeDiagnosis } = require('../utils/domUpdaters');
    const { baseText: dx } = composeDiagnosis(item);
    const hxtText = (item.checklistState && item.checklistState.huongXuTri) ? String(item.checklistState.huongXuTri).trim() : '';

    const left = document.createElement('div');
    left.innerHTML = `
    <div class="dr-list-title">${item.hoten || ''} <span class="dr-list-dem">- ${age}t - ${gender}</span> • <span class="dr-list-mabn">${item.mabn || ''}</span> • <span class="dr-list-loc">${formattedLocation}</span></div>
        <div class="dr-list-dx">${dx}</div>
        ${hxtText ? `<div class="dr-value dr-hxt-block"><span class="dr-label"><b>HXT:</b></span> ${escapeHtml(hxtText)}</div>` : ''}
        ${createYLenhTags(item)}
    `;

    const onCopy = async () => {
        try {
            const ReportService = require('../services/reportService');
            const ChecklistService = require('../services/checklistService');
            const { copyReportToClipboardRich } = require('../pages/page.dashboard.support');
            const res = await ChecklistService.loadChecklistData(item);
            const obj = ChecklistService.findChecklistObject(res);
            const state = obj ? (ChecklistService.parseChecklistState(obj) || {}) : {};
            const html = ReportService.generateSingleHTML(item, state);
            const text = ReportService.generateSingleText(item, state);
            await copyReportToClipboardRich(html, text);
        } catch (err) { console.error('Copy single-patient report failed:', err); }
    };

    const right = createListActions(item, onCopy);

    row.appendChild(left);
    row.appendChild(right);

    if (typeof opts.onOpen === 'function') {
        row.addEventListener('click', opts.onOpen);
    }

    return row;
}

// escapeHtml now provided by utils/htmlUtils

module.exports = {
    createListRow
};

},{"../pages/page.dashboard.support":21,"../services/checklistService":27,"../services/reportService":30,"../utils":35,"../utils/domUpdaters":38,"../utils/htmlUtils":40,"../utils/patientDataMapper":42,"../utils/tagUtils":44,"./actionButtons":4}],11:[function(require,module,exports){
// loginHandler.js - Centralized login prompt handling

const LoginHandler = {
    /**
     * Show login prompt and redirect to login page
     */
    showLoginPrompt() {
        document.body.innerHTML = '';
        const loginDiv = document.createElement('div');
        loginDiv.className = 'dr-login';
        loginDiv.textContent = 'Vui lòng đăng nhập để xem dữ liệu';
        document.body.appendChild(loginDiv);
        
        setTimeout(() => {
            window.location.href = '/Home/Login';
        }, 500);
    },

    /**
     * Check if user needs to login and handle accordingly
     */
    handleLoginRequired() {
        this.showLoginPrompt();
    }
};

module.exports = LoginHandler;

},{}],12:[function(require,module,exports){
// modalManager.js - Centralized modal/sidebar management
let SidebarSession = null;
try { SidebarSession = require('./sidebarSession'); } catch(_) {}

const ModalManager = {
    /**
     * Create or get existing backdrop element
     */
    getOrCreateBackdrop() {
        let backdrop = document.getElementById('dr-sidebar-backdrop');
        if (!backdrop) {
            backdrop = document.createElement('div');
            backdrop.id = 'dr-sidebar-backdrop';
            backdrop.style = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.25);z-index:99999;';
            document.body.appendChild(backdrop);
        }
        return backdrop;
    },

    /**
     * Create or get existing sidebar element
     */
    getOrCreateSidebar() {
        let sidebar = document.getElementById('dr-sidebar');
        if (!sidebar) {
            sidebar = document.createElement('div');
            sidebar.id = 'dr-sidebar';
            document.body.appendChild(sidebar);
        }
        return sidebar;
    },

    /**
     * Show modal with backdrop
     */
    showModal(sidebar, backdrop) {
        backdrop.style.display = 'block';
        sidebar.style.display = 'block';
    },

    /**
     * Hide modal and backdrop
     */
    hideModal(sidebar, backdrop) {
        if (sidebar) {
            sidebar.style.display = 'none';
            sidebar.innerHTML = ''; // Clear content between patients
        }
        backdrop.style.display = 'none';
    try { if (SidebarSession && typeof SidebarSession.endSession === 'function') SidebarSession.endSession(); } catch(_) {}
    },

    /**
     * Setup modal close handlers
     */
    setupCloseHandlers(sidebar, backdrop) {
        const hideModal = () => this.hideModal(sidebar, backdrop);
        
        // Click backdrop to close and clear content
        backdrop.onclick = () => {
            sidebar.innerHTML = ''; // Clear all HTML content of current dr-sidebar
            this.hideModal(sidebar, backdrop);
        };
        
        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Đóng';
        closeBtn.style = 'position:absolute;top:12px;right:12px;background:#eee;border:none;border-radius:50%;width:32px;height:32px;font-size:18px;cursor:pointer;';
        closeBtn.onclick = hideModal;
        
        return closeBtn;
    }
};

module.exports = ModalManager;

},{"./sidebarSession":15}],13:[function(require,module,exports){
// patientInfoSection.js
const { setupYLenhHandlers } = require('./yLenhHandlers');
const { setupPhauThuatHandlers } = require('./phauThuatHandlers');
const ChecklistService = require('../services/checklistService');
const Utils = require('../utils');
const ReportService = require('../services/reportService');

function createPatientInfoSection(patient, quickYLenhActions) {
    const ctxId = (window.dr_sidebar_ctx && window.dr_sidebar_ctx.id) || `${patient.mabn}:${Date.now()}`;
    const info = document.createElement('div');
    // Reuse report DOB/age formatter for consistency with dr-report-content
    const { dob, age } = ReportService.formatDateOfBirth(patient.ngaysinh);
    const gender = patient.phai === 1 ? 'Nữ' : 'Nam';
    const room = patient.teN_PHONG || '';
    const bed = patient.teN_GIUONG || '';
    info.innerHTML = `
        <h2 style="margin-top:0">${patient.hoten || ''} <span style="font-size:0.9em;color:#888;">${patient.mabn ? ' - ' + patient.mabn : ''}</span></h2>
        <div><b>DOB:</b> ${dob} (${age}) - ${gender} - ${room} - ${bed}</div>
        <div><b>Chẩn đoán:</b> <span id="dr-chandoan">${patient.chandoanvk || ''}</span></div>
        <div style="margin-top:8px; display:grid; grid-template-columns:max-content 1fr; align-items:start; column-gap:10px;">
            <label for="dr-chandoan-kemtheo" style="margin:0;font-weight:600;line-height:1.4;font-size:12px;color:#555;">Bệnh đi kèm</label>
            <div style="display:flex;flex-direction:column;gap:4px;">
                <textarea id="dr-chandoan-kemtheo" rows="2" placeholder="VD: THA, ĐTĐ type 2..." style="width:100%;padding:6px 8px;border:1px solid #90caf9;border-radius:4px;resize:vertical;font-size:12px;line-height:1.3;min-height:44px;box-shadow:0 0 0 2px rgba(25,118,210,0.12);outline:none;"></textarea>
                <div id="dr-chandoan-kemtheo-saved" style="display:none;color:#2e7d32;font-weight:600;">Đã lưu</div>
            </div>
        </div>
        
        <div style="margin-top:20px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;gap:12px;">
                <h3 style="margin:0;">Thông tin phẫu thuật</h3>
                <button id="dr-show-pt-form" style="background:#1976d2;color:#fff;border:none;border-radius:6px;padding:8px 14px;cursor:pointer;font-size:0.9em;white-space:nowrap;">Thêm phẫu thuật</button>
            </div>
            <div id="dr-pt-log" style="max-height:200px;overflow-y:auto;border:1px solid #eee;padding:10px;border-radius:4px;background:#f9f9f9;">
                <div style="color:#888;font-style:italic;">Chưa có phẫu thuật nào...</div>
            </div>
        </div>
        
        <div style="margin-top:20px;">
            <h3 style="margin-bottom:10px;">Kế hoạch điều trị / Hướng xử trí</h3>
            <textarea id="dr-hxt-textarea" rows="3" placeholder="VD: Kháng sinh 7 ngày, dự kiến xuất viện 22/08, tái khám sau 1 tuần..." style="width:100%;padding:10px;border:1px solid #eee;border-radius:6px;resize:vertical;"></textarea>
            <div id="dr-hxt-saved" style="display:none;color:#2e7d32;font-weight:600;margin-top:4px;">Đã lưu</div>
        </div>
        
        <div style="margin-top:20px;">
            <h3 style="margin-bottom:10px;">Log y lệnh</h3>
            
            <!-- Quick Action Buttons -->
            <div class="quick-ylenh-actions">
                ${quickYLenhActions.map(action => `
                    <button class="quick-ylenh-btn" data-action="${action.label}" style="color: ${action.color}; border-color: ${action.color};">
                        <span class="icon">${action.icon}</span>
                        <span class="text">${action.label}</span>
                    </button>
                `).join('')}
            </div>
            
            <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:12px;">
                <input type="text" id="dr-y-lenh-input" placeholder="Nhập y lệnh (VD: rút sonde tiểu)" style="padding:10px;border:1px solid #ddd;border-radius:4px;">
                <button id="dr-add-y-lenh" style="padding:12px 16px;background:#1976d2;color:#fff;border:none;border-radius:4px;cursor:pointer;width:100%;">Thêm</button>
            </div>
            <div id="dr-y-lenh-log" style="max-height:200px;overflow-y:auto;border:1px solid #eee;padding:10px;border-radius:4px;background:#f9f9f9;word-break: break-word; overflow-wrap: anywhere;">
                <div style="color:#888;font-style:italic;">Chưa có y lệnh nào...</div>
            </div>
        </div>
    `;

    // Setup y lệnh functionality
    setupYLenhHandlers(info, patient);

    // Setup phẫu thuật functionality
    setupPhauThuatHandlers(info, patient);

    // Setup HXT (kế hoạch điều trị) auto-save and live update
    const hxtTextarea = info.querySelector('#dr-hxt-textarea');
    const hxtSaved = info.querySelector('#dr-hxt-saved');
    // Setup Chẩn đoán kèm theo auto-save
    const cdktTextarea = info.querySelector('#dr-chandoan-kemtheo');
    const cdktSaved = info.querySelector('#dr-chandoan-kemtheo-saved');
    // Shared debounced save state
    let pendingSaveTimer = null;
    const SAVE_DEBOUNCE_MS = 700;

    // Track last saved values to avoid redundant saves
    const lastSaved = {
        hxt: (patient && patient.checklistState && typeof patient.checklistState.huongXuTri === 'string')
            ? String(patient.checklistState.huongXuTri).trim() : '',
        cdkt: (patient && patient.checklistState && typeof patient.checklistState.chanDoanKemTheo === 'string')
            ? String(patient.checklistState.chanDoanKemTheo).trim() : ''
    };
    // Current draft values
    const draft = { hxt: lastSaved.hxt, cdkt: lastSaved.cdkt };
    let dirty = { hxt: false, cdkt: false };

    // Initial load from patient-scoped state only (avoid leaking previous patient's global state)
    setTimeout(() => {
        if (patient && patient.checklistState && typeof patient.checklistState.huongXuTri === 'string') {
            hxtTextarea.value = patient.checklistState.huongXuTri;
        }
        if (patient && patient.checklistState && typeof patient.checklistState.chanDoanKemTheo === 'string') {
            cdktTextarea.value = patient.checklistState.chanDoanKemTheo;
        }
    }, 50);

    function invokeUpdatePatientCardHXT(p) {
        try {
            if (typeof updatePatientCardHXT === 'function') {
                updatePatientCardHXT(p);
                return true;
            }
            if (typeof unsafeWindow !== 'undefined' && typeof unsafeWindow.updatePatientCardHXT === 'function') {
                unsafeWindow.updatePatientCardHXT(p);
                return true;
            }
            if (typeof globalThis !== 'undefined' && typeof globalThis.updatePatientCardHXT === 'function') {
                globalThis.updatePatientCardHXT(p);
                return true;
            }
            if (typeof this !== 'undefined' && typeof this.updatePatientCardHXT === 'function') {
                this.updatePatientCardHXT(p);
                return true;
            }
            if (typeof window !== 'undefined' && typeof window.updatePatientCardHXT === 'function') {
                window.updatePatientCardHXT(p);
                return true;
            }
        } catch (e) {
            console.warn('invokeUpdatePatientCardHXT error', e);
        }
        return false;
    }

    function softUpdateHXT(newVal) {
        // Update in-memory state and card immediately for UX
        if (!window.checklistState) window.checklistState = {};
        window.checklistState = { ...(window.checklistState || {}), huongXuTri: newVal };
        patient.checklistState = { ...(patient.checklistState || {}), huongXuTri: newVal };
        if (window.dr_data && patient.mabn) {
            const patientInData = window.dr_data.find(p => p.mabn === patient.mabn);
            if (patientInData) {
                patientInData.checklistState = { ...(patientInData.checklistState || {}), huongXuTri: newVal };
            }
        }
        invokeUpdatePatientCardHXT(patient);
    }

    async function persistIfDirty() {
        // Build a single save payload only if something actually changed
        const changedKeys = [];
        if (dirty.hxt && draft.hxt !== lastSaved.hxt) changedKeys.push('hxt');
        if (dirty.cdkt && draft.cdkt !== lastSaved.cdkt) changedKeys.push('cdkt');
        if (changedKeys.length === 0) return;

        if (!window.checklistState) window.checklistState = {};
        const nextState = { ...window.checklistState };
        if (changedKeys.includes('hxt')) nextState.huongXuTri = draft.hxt;
        if (changedKeys.includes('cdkt')) nextState.chanDoanKemTheo = draft.cdkt;

        // Persist once
        if (window.checklistObj) {
            const res = await ChecklistService.updateChecklistState(window.checklistObj, nextState, { ctxId, enqueueOnOffline: true, signal: (window.dr_sidebar_ctx && window.dr_sidebar_ctx.signal) });
            if (!res || (!res.ok && !res.queued)) {
                console.warn('Lưu checklist thất bại');
            } else {
                // If this sidebar is no longer active, do not apply visual updates
                if (window.dr_sidebar_ctx && window.dr_sidebar_ctx.id !== ctxId) return;
                // Update global state snapshot and lastSaved
                window.checklistState = nextState;
                if (changedKeys.includes('hxt')) lastSaved.hxt = draft.hxt;
                if (changedKeys.includes('cdkt')) lastSaved.cdkt = draft.cdkt;
                dirty = { hxt: false, cdkt: false };

                // Subtle flash effect on saved fields
                try {
                    const flash = (el) => {
                        if (!el) return;
                        const prev = el.style.boxShadow;
                        el.style.boxShadow = '0 0 0 2px rgba(76,175,80,0.6)';
                        setTimeout(() => { el.style.boxShadow = prev || ''; }, 400);
                    };
                    if (changedKeys.includes('hxt')) {
                        flash(hxtTextarea);
                        if (hxtSaved) { hxtSaved.style.display = 'block'; setTimeout(() => hxtSaved.style.display = 'none', 600); }
                    }
                    if (changedKeys.includes('cdkt')) {
                        flash(cdktTextarea);
                        if (cdktSaved) { cdktSaved.style.display = 'block'; setTimeout(() => cdktSaved.style.display = 'none', 600); }
                        // Update card diagnosis after saving CDKT to keep cards in sync
                        try {
                            if (typeof updatePatientCardCDKT === 'function') {
                                updatePatientCardCDKT(patient);
                            } else if (typeof unsafeWindow !== 'undefined' && typeof unsafeWindow.updatePatientCardCDKT === 'function') {
                                unsafeWindow.updatePatientCardCDKT(patient);
                            } else if (typeof globalThis !== 'undefined' && typeof globalThis.updatePatientCardCDKT === 'function') {
                                globalThis.updatePatientCardCDKT(patient);
                            }
                        } catch (_) {}
                    }
                } catch (_) {}
                if (res && res.queued) {
                    try { (window.showToast || console.log)("Đã lưu tạm—sẽ đồng bộ khi có mạng."); } catch(_) {}
                }
            }
        }
    }

    function scheduleSave() {
        if (pendingSaveTimer) clearTimeout(pendingSaveTimer);
        pendingSaveTimer = setTimeout(() => {
            pendingSaveTimer = null;
            persistIfDirty();
        }, SAVE_DEBOUNCE_MS);
    }

    hxtTextarea.addEventListener('input', () => {
        const val = hxtTextarea.value.trim();
        draft.hxt = val;
        // Mark dirty only if actual change relative to last saved
        dirty.hxt = (val !== lastSaved.hxt);
        softUpdateHXT(val);
        scheduleSave();
    });
    hxtTextarea.addEventListener('blur', () => {
        if (pendingSaveTimer) {
            clearTimeout(pendingSaveTimer);
            pendingSaveTimer = null;
        }
        // Save only if dirty to avoid redundant saves on focus/blur without edits
        persistIfDirty();
    });

    // ====== Chẩn đoán kèm theo: soft update + shared save ======
    function softUpdateCDKT(newVal) {
        if (!window.checklistState) window.checklistState = {};
        window.checklistState = { ...(window.checklistState || {}), chanDoanKemTheo: newVal };
        patient.checklistState = { ...(patient.checklistState || {}), chanDoanKemTheo: newVal };
        if (window.dr_data && patient.mabn) {
            const patientInData = window.dr_data.find(p => p.mabn === patient.mabn);
            if (patientInData) {
                patientInData.checklistState = { ...(patientInData.checklistState || {}), chanDoanKemTheo: newVal };
            }
        }
    }

    cdktTextarea.addEventListener('input', () => {
        const val = cdktTextarea.value.trim();
        draft.cdkt = val;
        dirty.cdkt = (val !== lastSaved.cdkt);
        softUpdateCDKT(val);
        scheduleSave();
    });
    cdktTextarea.addEventListener('blur', () => {
        if (pendingSaveTimer) {
            clearTimeout(pendingSaveTimer);
            pendingSaveTimer = null;
        }
        persistIfDirty();
    });

    return info;
}

module.exports = { createPatientInfoSection };

},{"../services/checklistService":27,"../services/reportService":30,"../utils":35,"./phauThuatHandlers":14,"./yLenhHandlers":16}],14:[function(require,module,exports){
// phauThuatHandlers.js
const ChecklistService = require('../services/checklistService');
const BS_CAI_DAT = require('../BS_CAI_DAT_GIAO_DIEN');
const { updatePatientCardPhauThuat } = require('../utils/surgeryUtils');

function createDoctorCheckboxes(className) {
    return BS_CAI_DAT.danhSachBacSi.map(doctor => 
        `<label><input type="checkbox" class="${className}" value="${doctor}"> ${doctor}</label>`
    ).join('');
}

function setupPhauThuatHandlers(infoElement, patient) {
    const showFormBtn = infoElement.querySelector('#dr-show-pt-form');
    const logContainer = infoElement.querySelector('#dr-pt-log');

    function createPhauThuatPopup(editIndex = null) {
        // Check if popup already exists
        const existingPopup = document.getElementById('dr-pt-popup-backdrop');
        if (existingPopup) {
            console.log('Popup already exists, skipping creation');
            return;
        }
        
        const backdrop = document.createElement('div');
        backdrop.id = 'dr-pt-popup-backdrop';
        backdrop.style.cssText = `
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.5); z-index: 100001;
            display: flex; align-items: center; justify-content: center;
        `;

        const popup = document.createElement('div');
        popup.id = 'dr-pt-popup';
        popup.style.cssText = `
            background: white; border-radius: 8px; padding: 24px;
            max-width: 500px; width: 90vw; max-height: 80vh; overflow-y: auto;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        `;

        popup.innerHTML = `
            <h3 style="margin-top: 0; margin-bottom: 16px;">${editIndex !== null ? 'Sửa thông tin phẫu thuật' : 'Thêm thông tin phẫu thuật'}</h3>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px;">
                <div>
                    <label style="font-size:0.9em;color:#666;">Ngày PT:</label>
                    <input type="text" id="dr-pt-date-popup" placeholder="dd/mm/yyyy" style="width:100%;padding:6px;border:1px solid #ddd;border-radius:4px;">
                </div>
                <div>
                    <label style="font-size:0.9em;color:#666;">Giờ PT:</label>
                    <div style="display:flex;gap:4px;align-items:center;">
                        <input type="number" id="dr-pt-hour-popup" min="0" max="23" placeholder="HH" style="width:50px;padding:6px;border:1px solid #ddd;border-radius:4px;text-align:center;" />
                        <span style="font-weight:bold;">:</span>
                        <input type="number" id="dr-pt-minute-popup" min="0" max="59" step="5" placeholder="MM" style="width:50px;padding:6px;border:1px solid #ddd;border-radius:4px;text-align:center;" />
                        <small style="margin-left:8px;color:#888;">(24h)</small>
                    </div>
                </div>
            </div>
            <div style="margin-bottom:12px;">
                <label style="font-size:0.9em;color:#666;">Phương pháp phẫu thuật (PPPT):</label>
                <input type="text" id="dr-pt-method-popup" placeholder="Nhập PPPT" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:4px;">
            </div>
            <div style="margin-bottom:16px;">
                <label style="font-size:0.9em;color:#666;margin-bottom:6px;display:block;">Bác sĩ thực hiện:</label>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:0.9em;">
                    ${createDoctorCheckboxes('dr-pt-doctor-popup')}
                </div>
            </div>
            <div style="display: flex; gap: 8px; justify-content: flex-end;">
                <button id="dr-cancel-pt" style="background:#666;color:#fff;border:none;border-radius:4px;padding:8px 16px;cursor:pointer;">Hủy</button>
                <button id="dr-save-pt" style="background:${BS_CAI_DAT.colors.primary};color:#fff;border:none;border-radius:4px;padding:8px 16px;cursor:pointer;">Lưu</button>
            </div>
        `;

        backdrop.appendChild(popup);
        document.body.appendChild(backdrop);

        const originalClosePopup = function() {
            document.body.removeChild(backdrop);
            document.documentElement.lang = originalLang || 'vi';
        };

        const dateInput = popup.querySelector('#dr-pt-date-popup');
        const hourInput = popup.querySelector('#dr-pt-hour-popup');
        const minuteInput = popup.querySelector('#dr-pt-minute-popup');
        const methodInput = popup.querySelector('#dr-pt-method-popup');
        const doctorCheckboxes = popup.querySelectorAll('.dr-pt-doctor-popup');
        const saveBtn = popup.querySelector('#dr-save-pt');
        const cancelBtn = popup.querySelector('#dr-cancel-pt');

        hourInput.addEventListener('input', function() {
            let value = parseInt(this.value);
            if (value > 23) this.value = 23;
            if (value < 0) this.value = 0;
            if (this.value.length === 2) {
                minuteInput.focus();
                minuteInput.select();
            }
        });

        hourInput.addEventListener('focus', function() {
            this.select();
        });

        minuteInput.addEventListener('input', function() {
            let value = parseInt(this.value);
            if (value > 59) this.value = 59;
            if (value < 0) this.value = 0;
        });

        minuteInput.addEventListener('focus', function() {
            this.select();
        });

        minuteInput.addEventListener('blur', function() {
            if (this.value && this.value.length === 1) {
                this.value = '0' + this.value;
            }
        });

        hourInput.addEventListener('blur', function() {
            if (this.value && this.value.length === 1) {
                this.value = '0' + this.value;
            }
        });

        const config = BS_CAI_DAT.phauThuatDefaults;
        
        // Load existing data for edit mode
        if (editIndex !== null && window.checklistState.phauThuatLog && window.checklistState.phauThuatLog[editIndex]) {
            const editData = window.checklistState.phauThuatLog[editIndex];
            dateInput.value = editData.date || '';
            methodInput.value = editData.method || '';
            
            // Parse time
            if (editData.time) {
                const [hour, minute] = editData.time.split(':');
                hourInput.value = hour;
                minuteInput.value = minute;
            }
            
            // Set doctors
            if (editData.doctors) {
                const doctorList = editData.doctors.split(', ');
                doctorCheckboxes.forEach(cb => {
                    cb.checked = doctorList.includes(cb.value);
                });
            }
        } else {
            // Set defaults for new entry
            if (config.defaultDate === 'tomorrow') {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                const tomorrowStr = String(tomorrow.getDate()).padStart(2, '0') + '/' + 
                    String(tomorrow.getMonth() + 1).padStart(2, '0') + '/' + 
                    tomorrow.getFullYear();
                dateInput.value = tomorrowStr;
            } else if (config.defaultDate === 'today') {
                const today = new Date();
                const todayStr = String(today.getDate()).padStart(2, '0') + '/' + 
                    String(today.getMonth() + 1).padStart(2, '0') + '/' + 
                    today.getFullYear();
                dateInput.value = todayStr;
            }

            if (config.defaultTime) {
                const [defaultHour, defaultMinute] = config.defaultTime.split(':');
                hourInput.value = defaultHour;
                minuteInput.value = defaultMinute;
            }
        }

        function closePopup() {
            originalClosePopup();
        }

        function savePhauThuat() {
            const date = dateInput.value.trim();
            const hour = hourInput.value.trim();
            const minute = minuteInput.value.trim();
            const method = methodInput.value.trim();
            
            let time = '';
            if (hour && minute) {
                const h = parseInt(hour, 10);
                const m = parseInt(minute, 10);
                
                if (h >= 0 && h <= 23 && m >= 0 && m <= 59) {
                    time = String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
                } else {
                    alert('Thời gian không hợp lệ. Giờ: 0-23, Phút: 0-59');
                    return;
                }
            } else if (hour || minute) {
                alert('Vui lòng nhập đầy đủ giờ và phút');
                return;
            }
            
            if (!date || !time || !method) {
                alert(BS_CAI_DAT.validation.messages.missingPhauThuatInfo);
                return;
            }

            const dateRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
            const dateMatch = date.match(dateRegex);
            if (!dateMatch) {
                alert(BS_CAI_DAT.validation.messages.invalidDateFormat);
                return;
            }

            const day = parseInt(dateMatch[1]);
            const month = parseInt(dateMatch[2]);
            const year = parseInt(dateMatch[3]);

            if (month < 1 || month > 12) {
                alert(BS_CAI_DAT.validation.messages.invalidMonth);
                return;
            }
            if (day < 1 || day > 31) {
                alert(BS_CAI_DAT.validation.messages.invalidDay);
                return;
            }

            const dateObj = new Date(year, month - 1, day);
            if (dateObj.getDate() !== day || dateObj.getMonth() !== month - 1 || dateObj.getFullYear() !== year) {
                alert(BS_CAI_DAT.validation.messages.invalidDate);
                return;
            }

            const selectedDoctors = Array.from(doctorCheckboxes)
                .filter(cb => cb.checked)
                .map(cb => cb.value);

            if (selectedDoctors.length === 0) {
                alert(BS_CAI_DAT.validation.messages.noDoctorSelected);
                return;
            }

            if (!window.checklistState.phauThuatLog) {
                window.checklistState.phauThuatLog = [];
            }

            const newEntry = {
                date: date,
                time: time,
                method: method,
                doctors: selectedDoctors.join(', '),
                id: Date.now()
            };

            if (editIndex !== null) {
                // Update existing entry
                window.checklistState.phauThuatLog[editIndex] = newEntry;
            } else {
                // Add new entry at the beginning
                window.checklistState.phauThuatLog.unshift(newEntry);
            }

            savePhauThuatLog();
            renderPhauThuatLog(window.checklistState.phauThuatLog);
            updatePatientCardPhauThuatLocal(patient);
            closePopup();
        }

        saveBtn.addEventListener('click', savePhauThuat);
        cancelBtn.addEventListener('click', closePopup);
        backdrop.addEventListener('click', function(e) {
            if (e.target === backdrop) {
                closePopup();
            }
        });
    }

    function loadPhauThuatLog() {
        if (window.checklistState && window.checklistState.phauThuatLog) {
            renderPhauThuatLog(window.checklistState.phauThuatLog);
        }
    }

    function renderPhauThuatLog(phauThuatArray) {
        if (!Array.isArray(phauThuatArray) || phauThuatArray.length === 0) {
            logContainer.innerHTML = '<div style="color:#888;font-style:italic;">Chưa có phẫu thuật nào...</div>';
            return;
        }

        logContainer.innerHTML = phauThuatArray.map((entry, index) => `
            <div class="pt-entry-clickable" data-index="${index}" style="margin-bottom:8px;padding:8px 40px 8px 8px;background:#fff;border-radius:4px;border-left:3px solid #4caf50;position:relative;cursor:pointer;transition:background-color 0.2s;" onmouseover="this.style.backgroundColor='#f5f5f5'" onmouseout="this.style.backgroundColor='#fff'">
                <button class="remove-pt-btn" data-index="${index}" style="position:absolute;right:8px;top:50%;transform:translateY(-50%);background:#d32f2f;color:#fff;border:none;border-radius:3px;padding:2px 6px;font-size:0.8em;cursor:pointer;z-index:1;">Xóa</button>
                <div style="font-size:0.9em;color:#666;margin-bottom:4px;"><strong>Ngày PT:</strong> ${entry.date} ${entry.time}</div>
                <div style="font-weight:bold;color:#333;margin-bottom:2px;"><strong>PPPT:</strong> ${entry.method}</div>
                <div style="font-size:0.85em;color:#555;"><strong>BS:</strong> ${entry.doctors}</div>
            </div>
        `).join('');

        setTimeout(() => {
            logContainer.querySelectorAll('.remove-pt-btn').forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const index = parseInt(this.getAttribute('data-index'));
                    removePhauThuat(index);
                });
            });

            logContainer.querySelectorAll('.pt-entry-clickable').forEach(entry => {
                entry.addEventListener('click', function(e) {
                    if (e.target.classList.contains('remove-pt-btn')) return;
                    const index = parseInt(this.getAttribute('data-index'));
                    editPhauThuat(index);
                });
            });
        }, 10);
    }

    function editPhauThuat(index) {
        console.log('Edit phẫu thuật:', index);
        createPhauThuatPopup(index);
    }

    function removePhauThuat(index) {
        if (window.checklistState.phauThuatLog && Array.isArray(window.checklistState.phauThuatLog)) {
            window.checklistState.phauThuatLog.splice(index, 1);
            savePhauThuatLog();
            renderPhauThuatLog(window.checklistState.phauThuatLog);
            updatePatientCardPhauThuatLocal(patient);
        }
    }

    async function savePhauThuatLog() {
        if (window.checklistObj) {
            const res = await ChecklistService.updateChecklistState(window.checklistObj, window.checklistState, { enqueueOnOffline: true, ctxId: (window.dr_sidebar_ctx && window.dr_sidebar_ctx.id), signal: (window.dr_sidebar_ctx && window.dr_sidebar_ctx.signal) });
            if (!res || (!res.ok && !res.queued)) {
                console.error('Lưu log phẫu thuật thất bại!');
            }
        }
    }

    function updatePatientCardPhauThuatLocal(patient) {
        updatePatientCardPhauThuat(patient);
        
        // Also try global access as fallback
        if (typeof unsafeWindow !== 'undefined' && unsafeWindow.updatePatientCardPhauThuat) {
            unsafeWindow.updatePatientCardPhauThuat(patient);
        } else if (typeof this !== 'undefined' && this.updatePatientCardPhauThuat) {
            this.updatePatientCardPhauThuat(patient);
        } else if (globalThis.updatePatientCardPhauThuat) {
            globalThis.updatePatientCardPhauThuat(patient);
        } else if (window.updatePatientCardPhauThuat) {
            window.updatePatientCardPhauThuat(patient);
        }
    }

    showFormBtn.addEventListener('click', () => createPhauThuatPopup(null));
    setTimeout(loadPhauThuatLog, 100);

    window.currentRemovePhauThuat = removePhauThuat;
    window.currentRenderPhauThuatLog = renderPhauThuatLog;
    window.currentEditPhauThuat = editPhauThuat;
}

module.exports = { setupPhauThuatHandlers };

},{"../BS_CAI_DAT_GIAO_DIEN":1,"../services/checklistService":27,"../utils/surgeryUtils":43}],15:[function(require,module,exports){
// sidebarSession.js - Manage per-sidebar session context and AbortController

let _current = {
    id: 0,
    mabn: null,
    controller: null
};

const SidebarSession = {
    startSession(mabn) {
        // End previous session
        try { if (_current.controller) _current.controller.abort(); } catch(_) {}
        _current.id = Date.now();
        _current.mabn = mabn || null;
        _current.controller = (typeof AbortController !== 'undefined') ? new AbortController() : null;
        return _current.id;
    },
    endSession() {
        try { if (_current.controller) _current.controller.abort(); } catch(_) {}
        _current.controller = null;
        _current.mabn = null;
        _current.id = 0;
    },
    getSignal() {
        return _current.controller ? _current.controller.signal : undefined;
    },
    isActive(sessionId) {
        return !!sessionId && sessionId === _current.id;
    },
    getCurrent() { return { ..._current }; }
};

module.exports = SidebarSession;

},{}],16:[function(require,module,exports){
// yLenhHandlers.js
const ChecklistService = require('../services/checklistService');
const BS_CAI_DAT = require('../BS_CAI_DAT_GIAO_DIEN');

function setupYLenhHandlers(infoElement, patient) {
    const ctxId = (window.dr_sidebar_ctx && window.dr_sidebar_ctx.id) || `${patient.mabn}:${Date.now()}`;
    const input = infoElement.querySelector('#dr-y-lenh-input');
    const addBtn = infoElement.querySelector('#dr-add-y-lenh');
    const logContainer = infoElement.querySelector('#dr-y-lenh-log');

    // Use configured quick y lệnh actions
    const quickYLenhActions = BS_CAI_DAT.quickYLenhActions;

    // Load existing y lệnh when checklist is loaded
    function loadYLenhLog() {
        if (window.checklistState && window.checklistState.yLenhLog) {
            renderYLenhLog(window.checklistState.yLenhLog);
        }
    }

    // Render y lệnh log (filter out quick actions from display)
    function renderYLenhLog(yLenhArray) {
        if (!Array.isArray(yLenhArray) || yLenhArray.length === 0) {
            logContainer.innerHTML = '<div style="color:#888;font-style:italic;">Chưa có y lệnh nào...</div>';
            return;
        }

        // Filter out quick actions for log display only
        const quickActionLabels = BS_CAI_DAT.quickYLenhActions.map(action => action.label);
        const manualEntries = yLenhArray.filter(entry => !quickActionLabels.includes(entry.content));

        if (manualEntries.length === 0) {
            logContainer.innerHTML = '<div style="color:#888;font-style:italic;">Chưa có y lệnh manual nào...</div>';
            return;
        }

    logContainer.innerHTML = manualEntries.map((entry, index) => {
            // Find original index in full array for correct removal
            const originalIndex = yLenhArray.findIndex(originalEntry => 
                originalEntry.id === entry.id || 
                (originalEntry.timestamp === entry.timestamp && originalEntry.content === entry.content)
            );
            
            return `
        <div style="margin-bottom:8px;padding:8px 40px 8px 8px;background:#fff;border-radius:4px;border-left:3px solid #1976d2;position:relative;word-break: break-word; overflow-wrap: anywhere;">
                    <button class="remove-y-lenh-btn" data-index="${originalIndex}" style="position:absolute;right:8px;top:50%;transform:translateY(-50%);background:#d32f2f;color:#fff;border:none;border-radius:3px;padding:2px 6px;font-size:0.8em;cursor:pointer;">Xóa</button>
                    <div style="font-size:0.9em;color:#666;margin-bottom:4px;">${entry.timestamp}</div>
                    <div style="font-weight:bold;color:#333;">${entry.content}</div>
                </div>
            `;
        }).join('');

        // Add event listeners for remove buttons
        setTimeout(() => {
            logContainer.querySelectorAll('.remove-y-lenh-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const index = parseInt(this.getAttribute('data-index'));
                    removeYLenh(index);
                });
            });
        }, 10);
    }

    // Add y lệnh (enhanced với support cho quick actions)
    function addYLenh(content = null) {
        const inputContent = content || input.value.trim();
        if (!inputContent) return;

        // Initialize yLenhLog if not exists
        if (!window.checklistState.yLenhLog) {
            window.checklistState.yLenhLog = [];
        }

        // Create new entry
        const now = new Date();
        const timestamp = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        const doctorName = 'BS'; // You can customize this to get actual doctor name

        const newEntry = {
            timestamp: `${timestamp} - ${doctorName}`,
            content: inputContent,
            id: Date.now() // Unique ID for easier removal
        };

        // Add to array
        window.checklistState.yLenhLog.unshift(newEntry); // Add to beginning for newest first

        // Save to server
        saveYLenhLog();

        // Clear input and re-render
        if (!content) input.value = ''; // Only clear if not from quick action
        renderYLenhLog(window.checklistState.yLenhLog);

        // Update patient object in window.dr_data with new checklistState
        if (window.dr_data && patient.mabn) {
            const patientInData = window.dr_data.find(p => p.mabn === patient.mabn);
            if (patientInData) {
                patientInData.checklistState = { ...window.checklistState };
                console.log('Updated checklistState in window.dr_data for patient:', patient.mabn);
            }
        }

        // Trigger patient card update to show new tag
        if (window.updatePatientCardTags) {
            console.log('Calling updatePatientCardTags for patient:', patient.mabn);
            window.updatePatientCardTags(patient.mabn);
        }
        
        // Also check celebration animation specifically after adding tag
        setTimeout(() => {
            if (typeof window.checkAllCelebrationAnimations === 'function') {
                // Find the updated patient data
                const patientInData = window.dr_data.find(p => p.mabn === patient.mabn);
                if (patientInData) {
                    window.checkAllCelebrationAnimations([patientInData]);
                }
            }
        }, 100);
    }

    // Remove y lệnh
    function removeYLenh(index) {
        if (window.checklistState.yLenhLog && Array.isArray(window.checklistState.yLenhLog)) {
            window.checklistState.yLenhLog.splice(index, 1);
            saveYLenhLog();
            renderYLenhLog(window.checklistState.yLenhLog);
            
            // Update patient object in window.dr_data with new checklistState
            if (window.dr_data && patient.mabn) {
                const patientInData = window.dr_data.find(p => p.mabn === patient.mabn);
                if (patientInData) {
                    patientInData.checklistState = { ...window.checklistState };
                    console.log('Updated checklistState in window.dr_data after removal for patient:', patient.mabn);
                }
            }

            // Trigger patient card update to refresh tags
            if (window.updatePatientCardTags) {
                console.log('Calling updatePatientCardTags after removal for patient:', patient.mabn);
                window.updatePatientCardTags(patient.mabn);
            }
            
            // Also check celebration animation specifically after removing tag
            setTimeout(() => {
                if (typeof window.checkAllCelebrationAnimations === 'function') {
                    // Find the updated patient data
                    const patientInData = window.dr_data.find(p => p.mabn === patient.mabn);
                    if (patientInData) {
                        window.checkAllCelebrationAnimations([patientInData]);
                    }
                }
            }, 100);
        }
    }

    // Save y lệnh log to server
    async function saveYLenhLog() {
        if (window.checklistObj) {
            const res = await ChecklistService.updateChecklistState(window.checklistObj, window.checklistState, { ctxId, enqueueOnOffline: true, signal: (window.dr_sidebar_ctx && window.dr_sidebar_ctx.signal) });
            if (!res || (!res.ok && !res.queued)) {
                console.error('Lưu log y lệnh thất bại!');
            }
            if (res && res.queued) {
                try { (window.showToast || console.log)("Đã lưu tạm—sẽ đồng bộ khi có mạng."); } catch(_) {}
            }
        }
    }

    // Event listeners
    addBtn.addEventListener('click', () => addYLenh());
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addYLenh();
        }
    });

    // Helper: find today's quick entry by action
    function findTodayQuickEntryByAction(actionText) {
        const today = new Date();
        const todayStr = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
        if (!window.checklistState || !Array.isArray(window.checklistState.yLenhLog)) return { entry: null, index: -1 };
        const index = window.checklistState.yLenhLog.findIndex(e => {
            const entryDate = e.timestamp ? e.timestamp.split(' ')[0] : '';
            const sameAction = e.action ? e.action === actionText : e.content === actionText;
            return entryDate === todayStr && sameAction && (e.q === true || e.content === actionText);
        });
        return { entry: index >= 0 ? window.checklistState.yLenhLog[index] : null, index };
    }

    // UI: Discharge time editor (appears when 'Xuất viện' quick action is present today)
    function ensureDischargeTimeEditor() {
        const hostAfter = infoElement.querySelector('.quick-ylenh-actions');
        if (!hostAfter) return;
        const { entry } = findTodayQuickEntryByAction('Xuất viện');
        let editor = infoElement.querySelector('.xv-time-editor');
        if (!entry) {
            if (editor) editor.remove();
            return;
        }
        // ensure editor exists
        if (!editor) {
            editor = document.createElement('div');
            editor.className = 'xv-time-editor';
            editor.innerHTML = `
              <label class="xv-label">Xuất viện lúc:</label>
              <input class="xv-time xv-hour" type="number" min="0" max="23" placeholder="HH" style="width:56px;text-align:center;" />
              <span>:</span>
              <input class="xv-time xv-min" type="number" min="0" max="59" placeholder="mm" style="width:56px;text-align:center;" />
                            <div class="xv-presets" style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap;">
                                <button type="button" class="xv-chip" data-time="11:00" style="padding:2px 8px;border:1px solid #ccc;border-radius:12px;background:#f7f7f7;cursor:pointer;">11:00</button>
                                <button type="button" class="xv-chip" data-time="12:00" style="padding:2px 8px;border:1px solid #ccc;border-radius:12px;background:#f7f7f7;cursor:pointer;">12:00</button>
                                <button type="button" class="xv-chip" data-time="13:00" style="padding:2px 8px;border:1px solid #ccc;border-radius:12px;background:#f7f7f7;cursor:pointer;">13:00</button>
                                <button type="button" class="xv-chip" data-time="14:00" style="padding:2px 8px;border:1px solid #ccc;border-radius:12px;background:#f7f7f7;cursor:pointer;">14:00</button>
                                <button type="button" class="xv-chip" data-time="15:00" style="padding:2px 8px;border:1px solid #ccc;border-radius:12px;background:#f7f7f7;cursor:pointer;">15:00</button>
                            </div>
              <span class="xv-saved" style="display:none;">Đã lưu</span>
            `;
            hostAfter.insertAdjacentElement('afterend', editor);
        }
        const hourInput = editor.querySelector('.xv-hour');
        const minInput = editor.querySelector('.xv-min');
                const presets = editor.querySelector('.xv-presets');
        const saved = editor.querySelector('.xv-saved');
        // default to 12:00 if missing
        if (!entry.dischargeTime) entry.dischargeTime = '12:00';
        const [hh = '12', mm = '00'] = (entry.dischargeTime || '12:00').split(':');
        if (hourInput.value !== hh) hourInput.value = hh;
        if (minInput.value !== mm) minInput.value = mm;
        // Bind change handlers once
        const commit = async () => {
            const { entry: current, index } = findTodayQuickEntryByAction('Xuất viện');
            if (current && index >= 0) {
                let h = parseInt(hourInput.value, 10);
                let m = parseInt(minInput.value, 10);
                if (isNaN(h)) h = 12; if (isNaN(m)) m = 0;
                h = Math.max(0, Math.min(23, h));
                m = Math.max(0, Math.min(59, m));
                const hh2 = String(h).padStart(2, '0');
                const mm2 = String(m).padStart(2, '0');
                current.dischargeTime = `${hh2}:${mm2}`;
                // Update dr_data patient state for tag refresh
                if (window.dr_data && patient.mabn) {
                    const patientInData = window.dr_data.find(p => p.mabn === patient.mabn);
                    if (patientInData) patientInData.checklistState = { ...window.checklistState };
                }
                await saveYLenhLog();
                if (typeof window.updatePatientCardTags === 'function') {
                    window.updatePatientCardTags(patient.mabn);
                }
                if (saved) {
                    saved.style.display = 'inline';
                    setTimeout(() => { saved.style.display = 'none'; }, 1000);
                }
            }
        };
        if (!hourInput._bound) {
            hourInput.addEventListener('change', commit);
            hourInput.addEventListener('blur', commit);
            hourInput._bound = true;
        }
        // UX: select all text in hour field when user clicks/focuses it
        if (!hourInput._selectAllBound) {
            const selectAll = (e) => {
                try {
                    // Attempt twice to handle timing quirks
                    e.target.select && e.target.select();
                    setTimeout(() => {
                        try { e.target.select && e.target.select(); } catch (_) {}
                    }, 0);
                } catch (_) { /* noop */ }
            };
            hourInput.addEventListener('focus', selectAll);
            hourInput.addEventListener('click', selectAll);
            // Prevent mouseup from clearing the selection in some browsers
            hourInput.addEventListener('mouseup', (ev) => ev.preventDefault());
            hourInput._selectAllBound = true;
        }
        if (!minInput._bound) {
            minInput.addEventListener('change', commit);
            minInput.addEventListener('blur', commit);
            minInput._bound = true;
        }
        // UX: select all text in minute field when user clicks/focuses it
        if (!minInput._selectAllBound) {
            const selectAllMin = (e) => {
                try {
                    e.target.select && e.target.select();
                    setTimeout(() => {
                        try { e.target.select && e.target.select(); } catch (_) {}
                    }, 0);
                } catch (_) { /* noop */ }
            };
            minInput.addEventListener('focus', selectAllMin);
            minInput.addEventListener('click', selectAllMin);
            minInput.addEventListener('mouseup', (ev) => ev.preventDefault());
            minInput._selectAllBound = true;
        }

        // Preset chips: quick one-tap set and save
        if (presets && !presets._bound) {
            presets.querySelectorAll('.xv-chip').forEach(chip => {
                chip.addEventListener('click', async () => {
                    const tm = chip.getAttribute('data-time') || '12:00';
                    const [hh3, mm3] = tm.split(':');
                    hourInput.value = hh3.padStart(2, '0');
                    minInput.value = mm3.padStart(2, '0');
                    await commit();
                    // brief visual press feedback
                    chip.style.transform = 'scale(0.98)';
                    setTimeout(() => { chip.style.transform = ''; }, 120);
                });
            });
            presets._bound = true;
        }
    }

    // Quick action buttons event listeners - Toggle logic (3-state: off -> active -> done -> off)
    infoElement.querySelectorAll('.quick-ylenh-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const actionText = this.getAttribute('data-action');
            toggleQuickYLenh(actionText, this);
        });
    });

    // Function to toggle quick y lệnh (three states)
    function toggleQuickYLenh(actionText, buttonElement) {
        // Today string
        const today = new Date();
        const todayStr = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
        
        if (!window.checklistState.yLenhLog) {
            window.checklistState.yLenhLog = [];
        }

        // Find existing quick entry for this action today
        const existingIndex = window.checklistState.yLenhLog.findIndex(entry => {
            const entryDate = entry.timestamp ? entry.timestamp.split(' ')[0] : '';
            const isToday = entryDate === todayStr;
            const isQuick = entry.q === true || (entry.content === actionText && !entry.id?.toString().startsWith('manual'));
            const sameAction = entry.action ? entry.action === actionText : entry.content === actionText;
            return isToday && isQuick && sameAction;
        });

        // Cycle states
        if (existingIndex === -1) {
            // OFF -> ACTIVE (create entry)
            const now = new Date();
            const timestamp = `${todayStr} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
            const doctorName = 'BS';
            const newEntry = {
                timestamp: `${timestamp} - ${doctorName}`,
                content: actionText,
                id: Date.now(),
                q: true,
                action: actionText,
                status: 'active'
            };
            // If this is 'Xuất viện', set default discharge time
            if (actionText === 'Xuất viện') {
                newEntry.dischargeTime = '12:00';
            }
            window.checklistState.yLenhLog.unshift(newEntry);
            buttonElement.classList.add('active');
            buttonElement.classList.remove('done');
            console.log('Quick action set to ACTIVE:', actionText);
        } else {
            const entry = window.checklistState.yLenhLog[existingIndex];
            if (entry.status === 'active') {
                // ACTIVE -> DONE
                entry.status = 'done';
                buttonElement.classList.remove('active');
                buttonElement.classList.add('done');
                console.log('Quick action set to DONE:', actionText);
            } else if (entry.status === 'done') {
                // DONE -> OFF (remove)
                window.checklistState.yLenhLog.splice(existingIndex, 1);
                buttonElement.classList.remove('active');
                buttonElement.classList.remove('done');
                console.log('Quick action reset to OFF:', actionText);
            } else {
                // Unknown status (fallback): set to ACTIVE
                entry.status = 'active';
                buttonElement.classList.add('active');
                buttonElement.classList.remove('done');
            }
        }

    // Save changes
    saveYLenhLog();
        renderYLenhLog(window.checklistState.yLenhLog);

        // Update patient object in window.dr_data
        if (window.dr_data && patient.mabn) {
            const patientInData = window.dr_data.find(p => p.mabn === patient.mabn);
            if (patientInData) {
                patientInData.checklistState = { ...window.checklistState };
            }
        }

    // Update card tags (quick actions might render as tags; styles can reflect state)
        if (window.updatePatientCardTags) {
            window.updatePatientCardTags(patient.mabn);
        }

        // Discharge time editor + celebration animation for 'Xuất viện'
        if (actionText === 'Xuất viện') {
            // ensure time editor is visible/hidden appropriately
            ensureDischargeTimeEditor();
            setTimeout(() => {
                if (typeof window.checkAllCelebrationAnimations === 'function') {
                    const patientInData = window.dr_data.find(p => p.mabn === patient.mabn);
                    if (patientInData) {
                        window.checkAllCelebrationAnimations([patientInData]);
                    }
                }
            }, 100);
        }

        // Visual feedback
        buttonElement.style.transform = 'scale(0.95)';
        setTimeout(() => {
            buttonElement.style.transform = '';
        }, 150);
    }

    // Function to update button states based on existing log
    function updateQuickActionButtonStates() {
        const today = new Date();
        const todayStr = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
        
        infoElement.querySelectorAll('.quick-ylenh-btn').forEach(btn => {
            const actionText = btn.getAttribute('data-action');
            
            // Check if this action exists today
            let state = 'off';
            if (window.checklistState && Array.isArray(window.checklistState.yLenhLog)) {
                const found = window.checklistState.yLenhLog.find(entry => {
                    const entryDate = entry.timestamp ? entry.timestamp.split(' ')[0] : '';
                    const isToday = entryDate === todayStr;
                    const sameAction = entry.action ? entry.action === actionText : entry.content === actionText;
                    return isToday && sameAction && (entry.q === true || entry.content === actionText);
                });
                if (found) state = found.status || 'active';
            }
            btn.classList.toggle('active', state === 'active');
            btn.classList.toggle('done', state === 'done');
        });
    }

    // Load existing data after a short delay to ensure checklist is loaded
    setTimeout(() => {
        loadYLenhLog();
        updateQuickActionButtonStates();
        // Ensure discharge editor appears if needed on load
        ensureDischargeTimeEditor();
    }, 100);

    // Store reference to removeYLenh for use in loadYLenhLogFromState
    window.currentRemoveYLenh = removeYLenh;

    // Return functions that might be needed externally
    return {
        loadYLenhLog,
        renderYLenhLog,
        addYLenh,
        removeYLenh,
    updateQuickActionButtonStates
    };
}

module.exports = { setupYLenhHandlers };

},{"../BS_CAI_DAT_GIAO_DIEN":1,"../services/checklistService":27}],17:[function(require,module,exports){
// googleAppsScript.js

function GoogleAppsScriptUploader(googleAppsScriptUrl) {
    this.url = googleAppsScriptUrl;
}

GoogleAppsScriptUploader.prototype.uploadPatientList = function () {
    if (!window.dr_data || !Array.isArray(window.dr_data) || window.dr_data.length === 0) {
        console.error('Không có dữ liệu bệnh nhân để upload lên Google Apps Script!');
        return;
    }
    console.log('Đang tải dữ liệu bệnh nhân lên Google Apps Script (sử dụng GM_xmlhttpRequest để xử lý CORS)...');
    var requestBody = {
        function: 'doPost',
        parameters: [window.dr_data],
    };
    var self = this;
    return new Promise(function (resolve, reject) {
        GM_xmlhttpRequest({
            method: 'POST',
            url: self.url,
            headers: {
                'Content-Type': 'application/json'
            },
            redirects: 'follow',
            data: JSON.stringify(requestBody),
            onload: function (response) {
                try {
                    console.log('Phản hồi từ Google Apps Script:', response);
                    var result = JSON.parse(response.responseText);
                    if (response.status >= 200 && response.status < 300) {
                        console.log('Đã gửi danh sách bệnh nhân lên Google Apps Script thành công!');
                        console.log('Kết quả từ Google Apps Script:', result);
                        resolve(result);
                    } else {
                        console.error('Lỗi khi gửi lên Google Apps Script: ' + (result.error && result.error.message ? result.error.message : 'HTTP Status ' + response.status));
                        console.error('Lỗi từ Google Apps Script:', result);
                        reject(new Error(result.error && result.error.message ? result.error.message : 'HTTP Status ' + response.status));
                    }
                } catch (e) {
                    console.error('Lỗi phân tích phản hồi từ Google Apps Script: ' + e.message);
                    console.error('Lỗi phân tích phản hồi:', e, response.responseText);
                    reject(new Error('Failed to parse response from Google Apps Script.'));
                }
            },
            onerror: function (error) {
                console.error('Lỗi mạng khi gửi lên Google Apps Script: ' + error.statusText);
                console.error('Lỗi mạng (GM_xmlhttpRequest):', error);
                reject(new Error('Network error or failed to connect to Google Apps Script.'));
            },
            ontimeout: function (error) {
                console.error('Yêu cầu tới Google Apps Script bị hết thời gian: ' + error.statusText);
                console.error('Yêu cầu hết thời gian (GM_xmlhttpRequest):', error);
                reject(new Error('Request to Google Apps Script timed out.'));
            }
        });
    });
};

GoogleAppsScriptUploader.prototype.addUploadButton = function () {
    var btn = document.createElement('button');
    btn.innerText = 'Đăng lên Google Sheet';
    btn.style.position = 'fixed';
    btn.style.left = '20px';
    btn.style.bottom = '70px';
    btn.style.background = '#4285F4';
    btn.style.color = '#fff';
    btn.style.padding = '10px 18px';
    btn.style.border = 'none';
    btn.style.borderRadius = '5px';
    btn.style.fontSize = '14px';
    btn.style.cursor = 'pointer';
    btn.style.zIndex = 9999;
    btn.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    btn.onclick = this.uploadPatientList.bind(this);
    document.body.appendChild(btn);
};

var GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz48_viXo1mjhk-W2CsDbxLuFLFHyD2I7k2UchSmZROjqRC9S4hCRvbNmNOY5nP8HVBnA/exec';

module.exports = {
    GoogleAppsScriptUploader: GoogleAppsScriptUploader,
    GOOGLE_APPS_SCRIPT_URL: GOOGLE_APPS_SCRIPT_URL
};

},{}],18:[function(require,module,exports){
// otm-entry.js - Entry point for OTM content script
(function() {
    'use strict';

    // Only run on OTM domain
    if (window.location.hostname !== 'otm.tahospital.vn') {
        return;
    }

    console.log('OTM Entry Script loaded');

    // Load the content script
    try {
        require('./otm.content.script');
    } catch (error) {
        console.error('Failed to load OTM content script:', error);
    }

})();

},{"./otm.content.script":19}],19:[function(require,module,exports){
// otm.content.js - Content script for OTM surgery data fetching
(function() {
    'use strict';

    console.log('OTM Content Script loaded');

    // Function to check if debug is enabled
    function isDebugEnabled() {
        return localStorage.getItem('dr_debug_otm') === 'true';
    }

    // Function to log debug messages
    function debugLog(message, ...args) {
        if (isDebugEnabled()) {
            console.log('[OTM Debug]', message, ...args);
        }
    }

    // Lightweight validation for access tokens to avoid saving 'undefined'/'null'/too-short values
    function isLikelyValidToken(tok) {
        try {
            if (typeof tok !== 'string') return false;
            const t = tok.trim();
            if (!t) return false;
            const low = t.toLowerCase();
            if (low === 'undefined' || low === 'null') return false;
            if (t.length < 16) return false; // heuristic: tokens are typically long
            // avoid whitespace in token
            if (/\s/.test(t)) return false;
            return true;
        } catch { return false; }
    }

    // Function to save bearer token to GM and localStorage (only if valid)
    function saveBearerToken(token) {
        try {
            if (!isLikelyValidToken(token)) {
                debugLog('Refusing to save invalid bearer token candidate');
                return;
            }
            try { sessionStorage.setItem('otm_bearer_token', token); } catch(_) {}
            try { localStorage.setItem('otm_bearer_token', token); } catch(_) {}
            try { if (typeof GM !== 'undefined' && GM.setValue) { GM.setValue('otm_bearer_token', token); } } catch(_) {}
            debugLog('Bearer token saved');
        } catch (error) {
            debugLog('Error saving bearer token:', error);
        }
    }

    // Function to get bearer token from GM or localStorage (awaits GM when needed)
    async function getSavedBearerTokenAsync() {
        try {
            let token = null;
            try { token = sessionStorage.getItem('otm_bearer_token'); } catch(_) { token = null; }
            if (!token) { try { token = localStorage.getItem('otm_bearer_token'); } catch(_) { token = null; } }
            if (!token && typeof GM !== 'undefined' && GM.getValue) {
                try {
                    token = await GM.getValue('otm_bearer_token', '');
                    if (token) {
                        try { sessionStorage.setItem('otm_bearer_token', token); } catch(_) {}
                        try { localStorage.setItem('otm_bearer_token', token); } catch(_) {}
                    }
                } catch(_) { token = null; }
            }
            if (token) {
                // Guard against polluted storage values like 'undefined' or too short strings
                if (!isLikelyValidToken(token)) {
                    debugLog('Found invalid token in storage; cleaning up');
                    try { sessionStorage.removeItem('otm_bearer_token'); } catch(_) {}
                    try { localStorage.removeItem('otm_bearer_token'); } catch(_) {}
                    try { if (typeof GM !== 'undefined' && GM.deleteValue) { GM.deleteValue('otm_bearer_token'); } } catch(_) {}
                    return null;
                }
                debugLog('Found saved bearer token (async)');
                return token;
            }
        } catch (error) {
            debugLog('Error getting saved bearer token (async):', error);
        }
        return null;
    }

    // Function to send message to parent using GM storage
    function sendMessageToParent(type, data) {
        debugLog('Sending message to parent via GM storage:', type, data);
        try {
            const key = `otm_${type}`;
            const value = JSON.stringify({
                data: {
                    ...(data || {})
                },
                timestamp: Date.now(),
                tabId: Math.random().toString(36).substr(2, 9)
            });

            if (typeof GM !== 'undefined' && GM.setValue) {
                GM.setValue(key, value);
                debugLog(`Stored ${key} in GM storage`);
            } else {
                debugLog('GM.setValue not available, falling back to localStorage');
                localStorage.setItem(key, value);
            }
        } catch (error) {
            debugLog('Error storing message:', error);
        }
    }

    // Function to close this tab - always self-close like ?nln flow, with robust fallbacks
    function closeTab() {
        debugLog('Closing OTM tab (self + fallback signal)');
        // Signal parent as a fallback in case self-close is blocked
        try { sendMessageToParent('close_tab', { reason: 'self_close_fallback' }); } catch(_) {}
        // Try TM API if available
        try { if (typeof GM !== 'undefined' && GM.closeTab) { GM.closeTab(); } } catch(_) {}
        // Try window.close twice with small delays
        try { window.close(); } catch (_) { /* ignore */ }
        setTimeout(() => {
            try { if (typeof GM !== 'undefined' && GM.closeTab) { GM.closeTab(); } } catch(_) {}
            try { window.close(); } catch(_) {}
        }, 300);
        setTimeout(() => {
            try { if (typeof GM !== 'undefined' && GM.closeTab) { GM.closeTab(); } } catch(_) {}
            try { window.close(); } catch(_) {}
        }, 900);
    }

    // Function to test if bearer token is still valid
    async function testTokenValidity(token) {
        try {
            debugLog('Testing token validity...');
            // Use a future date for testing (next week)
            const testDate = new Date();
            testDate.setDate(testDate.getDate() + 7); // 7 days from now
            const isoDate = testDate.toISOString().replace('T00:00:00.000Z', 'T17:00:00.000Z');

            debugLog('Test date for token validation:', isoDate);

            const response = await fetch(`https://otm.tahospital.vn/api/booking?date=${isoDate}`, {
                headers: {
                    "accept": "application/json, text/plain, */*",
                    "accept-language": "en-US,en;q=0.9,vi;q=0.8",
                    "authorization": `Bearer ${token}`,
                    "if-none-match": "W/\"3de9d-aNgxHg6vKhdB2PNct3jxHFKkaaU\"",
                    "logintype": "2",
                    "priority": "u=1, i",
                    "sec-ch-ua": "\"Not;A=Brand\";v=\"99\", \"Microsoft Edge\";v=\"139\", \"Chromium\";v=\"139\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "siteid": "1"
                },
                method: "GET",
                mode: "cors",
                credentials: "include"
            });

            debugLog('Token validation response status:', response.status);
            debugLog('Token validation response ok:', response.ok);

            if (!response.ok) {
                debugLog('Token validation failed - response not ok');
                return false;
            }

            // Try to parse the response
            const data = await response.json();
            debugLog('Token validation response data:', data);

            return true;
        } catch (error) {
            debugLog('Token validity test failed with error:', error);
            debugLog('Error details:', error.message);
            return false;
        }
    }

    // Check if we should run automation - read from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const otmFetchParam = urlParams.get('otm-fetch');
    const otmFetchUsers = urlParams.has('otm-fetch-users') || urlParams.get('otm-fetch-users') === '1' || urlParams.get('otm-fetch') === 'users';
    const otmTokenParam = urlParams.get('otm-token'); // New parameter for token-only extraction
    // Date range for fetching (filled from URL or defaulted later)
    let fromDate = null;
    let toDate = null;
    // Correlation id for messages back to parent
    let requestId = null;
    
    console.log('[OTM Debug] URL params check - otmFetchParam:', !!otmFetchParam, 'otmTokenParam:', !!otmTokenParam);
    
    // Handle token-only extraction requests
    if (otmTokenParam) {
        console.log('[OTM Debug] Token extraction request detected');
        setTimeout(() => {
            checkExistingTokenForExtraction();
        }, 0);
    } else {
        // Always check existing token first for normal operations
        console.log('[OTM Debug] Will check existing token first');
        debugLog('Checking for existing token...');
        // Schedule immediately (next tick) to start as soon as possible
        setTimeout(() => {
            console.log('[OTM Debug] Calling checkExistingToken ASAP');
            checkExistingToken();
        }, 0);
    }

    // Function to check existing token and start appropriate flow
    async function checkExistingToken() {
        let savedToken = await getSavedBearerTokenAsync();
        console.log('[OTM Debug] Checking existing token...');
        if (savedToken) {
            console.log('[OTM Debug] Found saved token, using it immediately');
            sendMessageToParent('progress', { step: 'token_found', message: 'Đã có token OTM, bắt đầu lấy dữ liệu...' });
            // Ensure global bearerToken is set so fetchSurgeryData can use it immediately
            try { bearerToken = savedToken; } catch(_) {}
            // Skip pre-validation to save time; fetch will detect 401/403 and fallback
            if (otmFetchUsers) {
                try {
                    await fetchOTMUsers();
                    return;
                } catch (error) {
                    console.error('Failed to fetch OTM users with saved token:', error);
                    sendMessageToParent('error', { message: 'Lỗi khi lấy danh sách OTM: ' + error.message });
                    closeTab();
                    return;
                }
            } else if (otmFetchParam) {
                try {
                    const data = JSON.parse(decodeURIComponent(otmFetchParam));
                    fromDate = data.fromDate;
                    toDate = data.toDate;
                    const preferToken = !!data.preferToken;
                    console.log('Starting direct API fetch for dates:', fromDate, 'to', toDate);
                    if (preferToken) {
                        // With preferToken, strictly avoid automation when token is present
                        await fetchSurgeryData(fromDate, toDate);
                        return;
                    }
                    await fetchSurgeryData(fromDate, toDate);
                    return;
                } catch (error) {
                    console.error('Failed to parse OTM fetch data from URL:', error);
                    sendMessageToParent('error', { message: 'Lỗi khi phân tích dữ liệu URL: ' + error.message });
                    closeTab();
                    return;
                }
            } else {
                // Default to today
                const today = new Date();
                const yyyy = today.getFullYear();
                const mm = String(today.getMonth() + 1).padStart(2, '0');
                const dd = String(today.getDate()).padStart(2, '0');
                fromDate = `${yyyy}-${mm}-${dd}`;
                toDate = fromDate;
                console.log('[OTM Debug] No URL param; defaulting to today and fetching:', fromDate);
                await fetchSurgeryData(fromDate, toDate);
                return;
            }
        } else {
            console.log('[OTM Debug] No saved token found');
            debugLog('No saved token found, starting automation');
            // Grace period: retry a few times to read GM/local storage in case it's not hydrated yet
            let tries = 0;
            while (!savedToken && tries < 5) {
                await new Promise(r => setTimeout(r, 250));
                tries++;
                savedToken = await getSavedBearerTokenAsync();
            }
            if (savedToken) {
                try { bearerToken = savedToken; } catch(_) {}
                sendMessageToParent('progress', { step: 'token_found', message: 'Đã có token OTM, bắt đầu lấy dữ liệu...' });
                if (otmFetchUsers) { await fetchOTMUsers(); return; }
                if (otmFetchParam) {
                    try {
                        const data = JSON.parse(decodeURIComponent(otmFetchParam));
                        fromDate = data.fromDate; toDate = data.toDate;
                        await fetchSurgeryData(fromDate, toDate);
                        return;
                    } catch (e) {
                        sendMessageToParent('error', { message: 'Lỗi khi phân tích dữ liệu URL: ' + e.message });
                        closeTab(); return;
                    }
                }
                const today = new Date();
                const yyyy = today.getFullYear();
                const mm = String(today.getMonth() + 1).padStart(2, '0');
                const dd = String(today.getDate()).padStart(2, '0');
                fromDate = `${yyyy}-${mm}-${dd}`; toDate = fromDate;
                await fetchSurgeryData(fromDate, toDate);
                return;
            }
            sendMessageToParent('progress', { step: 'no_token', message: 'Không tìm thấy token OTM đã lưu, bắt đầu tự động hóa...' });
        }

    // Start automation to get new token (either invalid token or no token)
    if (otmFetchParam) {
            // Parse the fetch parameters
            try {
                const data = JSON.parse(decodeURIComponent(otmFetchParam));
                fromDate = data.fromDate;
                toDate = data.toDate;
                console.log('Starting OTM automation for dates:', fromDate, 'to', toDate);
            } catch (error) {
                console.error('Failed to parse OTM fetch data from URL:', error);
                sendMessageToParent('error', { message: 'Lỗi khi phân tích dữ liệu URL: ' + error.message });
                closeTab();
                return;
            }
        }
        startAutomation();
    }

    // Function specifically for token extraction requests
    async function checkExistingTokenForExtraction() {
        console.log('[OTM Debug] Starting token extraction flow...');
        
        // Check for existing token first
        let savedToken = await getSavedBearerTokenAsync();
        
        if (savedToken && isLikelyValidToken(savedToken)) {
            console.log('[OTM Debug] Found valid saved token, returning it');
            debugLog('Token extraction: using saved token');
            bearerToken = savedToken;
            
            // Validate the token to make sure it's still working
            const isValid = await testTokenValidity(savedToken);
            if (isValid) {
                console.log('[OTM Debug] Token validation passed, sending to parent');
                sendMessageToParent('token_success', {
                    token: savedToken,
                    expiry: Date.now() + (24 * 60 * 60 * 1000), // Default 24h expiry
                    source: 'saved_token'
                });
                closeTab();
                return;
            } else {
                console.log('[OTM Debug] Saved token is invalid, need to get fresh one');
                debugLog('Token extraction: saved token invalid, starting automation');
            }
        } else {
            console.log('[OTM Debug] No valid saved token found');
            debugLog('Token extraction: no saved token, starting automation');
        }

        // No valid token available, start automation to get a fresh one
        sendMessageToParent('progress', { step: 'token_automation', message: 'Bắt đầu tự động hóa để lấy token mới...' });
        startAutomationForTokenExtraction();
    }

    // Modified automation specifically for token extraction
    async function startAutomationForTokenExtraction() {
        try {
            debugLog('=== STARTING TOKEN EXTRACTION AUTOMATION ===');
            sendMessageToParent('progress', { step: 'start', message: 'Bắt đầu tự động hóa để lấy token OTM...' });

            // Wait for page to load
            await new Promise(resolve => setTimeout(resolve, 500));
            sendMessageToParent('progress', { step: 'page_loaded', message: 'Trang OTM đã tải xong' });

            // Step 1: Find and hover over "Quản lý Phẫu thuật"
            debugLog('Looking for "Quản lý Phẫu thuật" menu for token extraction...');
            sendMessageToParent('progress', { step: 'finding_menu', message: 'Đang tìm menu "Quản lý Phẫu thuật"...' });
            const quanLyPhauThuatElement = await waitForElement('p', 'Quản lý Phẫu thuật', 8000);

            if (!quanLyPhauThuatElement) {
                debugLog('Token extraction: Cannot find "Quản lý Phẫu thuật" menu');
                sendMessageToParent('token_error', { message: 'Không tìm thấy menu "Quản lý Phẫu thuật". Có thể tài khoản không có quyền truy cập.' });
                closeTab();
                return;
            }

            debugLog('Token extraction: Found menu, triggering mouseover...');
            sendMessageToParent('progress', { step: 'menu_found', message: 'Đã tìm thấy menu, đang mở submenu...' });

            // Step 2: Trigger mouseover to show submenu
            triggerMouseEvent(quanLyPhauThuatElement, 'mouseover');
            await new Promise(resolve => setTimeout(resolve, 500));

            // Step 3: Find and click submenu
            debugLog('Token extraction: Looking for submenu...');
            sendMessageToParent('progress', { step: 'finding_submenu', message: 'Đang tìm submenu "Đặt hẹn Lịch mổ"...' });

            let datHenLichMoElement = await waitForElement('h6', 'Đặt hẹn Lịch mổ', 800);
            if (!datHenLichMoElement) {
                datHenLichMoElement = await waitForElement('p', 'Đặt hẹn Lịch mổ', 800);
            }
            if (!datHenLichMoElement) {
                datHenLichMoElement = await waitForElement('h6', 'Đặt hẹn', 900);
            }
            if (!datHenLichMoElement) {
                datHenLichMoElement = await waitForElement('p', 'Đặt hẹn', 900);
            }

            if (datHenLichMoElement) {
                debugLog('Token extraction: Found submenu, clicking...');
                sendMessageToParent('progress', { step: 'submenu_found', message: 'Đã tìm thấy submenu, đang chuyển trang...' });
                datHenLichMoElement.click();

                // Wait for the page to load and token to be captured
                await new Promise(resolve => setTimeout(resolve, 2000));
                sendMessageToParent('progress', { step: 'token_wait', message: 'Đang chờ token được tạo...' });

                // Wait for token to be captured by our interceptors
                let attempts = 0;
                while (!bearerToken && attempts < 15) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    attempts++;
                    debugLog(`Token extraction: waiting for token... (attempt ${attempts}/15)`);
                }

                if (bearerToken && isLikelyValidToken(bearerToken)) {
                    console.log('[OTM Debug] Token captured successfully during extraction');
                    debugLog('Token extraction: success, token captured');
                    sendMessageToParent('token_success', {
                        token: bearerToken,
                        expiry: Date.now() + (24 * 60 * 60 * 1000), // Default 24h expiry
                        source: 'fresh_automation'
                    });
                } else {
                    console.log('[OTM Debug] Token extraction failed - no token captured');
                    debugLog('Token extraction: failed, no token captured');
                    sendMessageToParent('token_error', { message: 'Không thể lấy token sau khi tự động hóa' });
                }
            } else {
                debugLog('Token extraction: submenu not found');
                sendMessageToParent('token_error', { message: 'Không tìm thấy submenu "Đặt hẹn Lịch mổ"' });
            }
        } catch (error) {
            console.error('Token extraction automation error:', error);
            sendMessageToParent('token_error', { message: 'Lỗi trong quá trình tự động hóa token: ' + error.message });
        } finally {
            closeTab();
        }
    }

    // Intercept fetch to capture Bearer token
    let bearerToken = null; // Will be set by checkExistingToken or interceptors
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        const [url, options] = args;
        if (options && options.headers) {
            // Check for Authorization header
            const getHeaderVal = (h) => {
                try {
                    if (!h) return null;
                    // Headers object vs plain object
                    if (typeof h.get === 'function') {
                        return h.get('Authorization') || h.get('authorization') || null;
                    }
                    return h.Authorization || h.authorization || null;
                } catch { return null; }
            };
            const authHeader = getHeaderVal(options.headers);
            if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
                const newToken = authHeader.substring(7);
                if (isLikelyValidToken(newToken) && newToken !== bearerToken) {
                    bearerToken = newToken;
                    saveBearerToken(bearerToken);
                    debugLog('Captured Bearer token from fetch headers');
                }
            }
        }
        return originalFetch.apply(this, args);
    };

    // Also intercept XMLHttpRequest for token capture
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, ...args) {
        this.addEventListener('loadstart', function() {
            try {
                const authHeader = this._headers && (this._headers.Authorization || this._headers.authorization);
                if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
                    const newToken = authHeader.substring(7);
                    if (isLikelyValidToken(newToken) && newToken !== bearerToken) {
                        bearerToken = newToken;
                        saveBearerToken(bearerToken);
                        debugLog('Captured Bearer token from XMLHttpRequest');
                    }
                }
            } catch(_) {}
        });
        return originalOpen.apply(this, [method, url, ...args]);
    };

    const originalSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
    XMLHttpRequest.prototype.setRequestHeader = function(header, value) {
        if (!this._headers) this._headers = {};
        this._headers[header] = value;
        try {
            if ((header === 'Authorization' || header === 'authorization') && typeof value === 'string' && value.startsWith('Bearer ')) {
                const newToken = value.substring(7);
                if (isLikelyValidToken(newToken) && newToken !== bearerToken) {
                    bearerToken = newToken;
                    saveBearerToken(bearerToken);
                    debugLog('Captured Bearer token from XMLHttpRequest setRequestHeader');
                }
            }
        } catch(_) {}
        return originalSetRequestHeader.apply(this, [header, value]);
    };

    // Utility functions
    function findElementByText(tagName, textContent) {
        const elements = document.querySelectorAll(tagName);
        for (const element of elements) {
            const elementText = element.textContent.trim();
            // Try exact match first
            if (elementText === textContent.trim()) {
                return element;
            }
            // Try case-insensitive match
            if (elementText.toLowerCase() === textContent.trim().toLowerCase()) {
                return element;
            }
            // Try partial match
            if (elementText.includes(textContent.trim())) {
                return element;
            }
            // Try partial case-insensitive match
            if (elementText.toLowerCase().includes(textContent.trim().toLowerCase())) {
                return element;
            }
        }
        return null;
    }

    function triggerMouseEvent(element, eventType) {
        const event = new MouseEvent(eventType, {
            bubbles: true,
            cancelable: true
        });
        element.dispatchEvent(event);
    }

    function waitForElement(tagName, textContent, timeout = 10000) {
        return new Promise((resolve) => {
            const startTime = Date.now();
            const interval = setInterval(() => {
                const element = findElementByText(tagName, textContent);
                if (element) {
                    clearInterval(interval);
                    resolve(element);
                } else if (Date.now() - startTime > timeout) {
                    clearInterval(interval);
                    resolve(null);
                }
            }, 500);
        });
    }

    // Transform raw surgery records into a lean structure required by the main UI
    function filterSurgeryData(records) {
        if (!Array.isArray(records)) return [];
        const result = [];
        for (const r of records) {
            const item = {
                customer: {
                    fullname: r?.customer?.fullname ?? null,
                    pid: r?.customer?.code ?? null,
                    dob: r?.customer?.dob ?? null,
                },
                diagnose: r?.diagnose ?? null,
                surgerymethod: r?.surgerymethod ?? null,
                start: r?.start ?? null,
                end: r?.end ?? null,
                // Optional treatment info
                khoaLuuTri: r?.khoaLuuTri ?? null,
                khoaDieuTri: r?.khoaDieuTri ?? null,
                phongDieuTri: r?.phongDieuTri ?? null,
                giuongDieuTri: r?.giuongDieuTri ?? null,
                // Operating room name only
                operating_room: r?.room?.name ?? null,
                status: r?.status ?? null,
                // Surgeons
                userexec: Array.isArray(r?.userexec)
                    ? r.userexec.map(u => ({ fullname: u?.fullname ?? null, taid: u?.taid ?? null }))
                    : [],
                userassistant: Array.isArray(r?.userassistant)
                    ? r.userassistant.map(u => ({ fullname: u?.fullname ?? null, taid: u?.taid ?? null }))
                    : [],
            };
            result.push(item);
        }
        return result;
    }

    // Main automation function
    async function startAutomation() {
        try {
            debugLog('=== STARTING OTM AUTOMATION ===');
            sendMessageToParent('progress', { step: 'start', message: 'Bắt đầu tự động hóa OTM...' });

            // Wait for page to load (reduced)
            await new Promise(resolve => setTimeout(resolve, 500));
            sendMessageToParent('progress', { step: 'page_loaded', message: 'Trang OTM đã tải xong' });

            // Step 1: Find and hover over "Quản lý Phẫu thuật"
            debugLog('Looking for "Quản lý Phẫu thuật" menu...');
            sendMessageToParent('progress', { step: 'finding_menu', message: 'Đang tìm menu "Quản lý Phẫu thuật"...' });
            const quanLyPhauThuatElement = await waitForElement('p', 'Quản lý Phẫu thuật', 8000);

            if (!quanLyPhauThuatElement) {
                debugLog('Không tìm thấy phần tử "Quản lý Phẫu thuật". Có thể account không có quyền truy cập.');
                sendMessageToParent('error', { message: 'Không tìm thấy menu "Quản lý Phẫu thuật". Có thể tài khoản không có quyền truy cập.' });
                closeTab();
                return;
            }

            debugLog('Tìm thấy "Quản lý Phẫu thuật", kích hoạt mouseover...');
            sendMessageToParent('progress', { step: 'menu_found', message: 'Đã tìm thấy menu, đang mở submenu...' });

            // Step 2: Trigger mouseover to show submenu
            triggerMouseEvent(quanLyPhauThuatElement, 'mouseover');

            // Wait a bit for submenu to appear (reduced from 1000ms)
            await new Promise(resolve => setTimeout(resolve, 500));

            // Step 3: Try different selectors for submenu (reduced timeouts)
            debugLog('Tìm submenu "Đặt hẹn Lịch mổ"...');
            sendMessageToParent('progress', { step: 'finding_submenu', message: 'Đang tìm submenu "Đặt hẹn Lịch mổ"...' });

            let datHenLichMoElement = await waitForElement('h6', 'Đặt hẹn Lịch mổ', 800);
            if (!datHenLichMoElement) {
                datHenLichMoElement = await waitForElement('p', 'Đặt hẹn Lịch mổ', 800);
            }
            if (!datHenLichMoElement) {
                // Try partial text match
                datHenLichMoElement = await waitForElement('h6', 'Đặt hẹn', 900);
            }
            if (!datHenLichMoElement) {
                datHenLichMoElement = await waitForElement('p', 'Đặt hẹn', 900);
            }
            if (!datHenLichMoElement) {
                // Last resort: search all clickable elements
                const allClickable = document.querySelectorAll('button, a, [role="button"], [onclick]');
                for (const el of allClickable) {
                    if (el.textContent && el.textContent.toLowerCase().includes('đặt hẹn')) {
                        datHenLichMoElement = el;
                        debugLog('Found via clickable elements search:', el.textContent.trim());
                        break;
                    }
                }
            }

            // Debug: Log all possible elements
            console.log('Debug: Tất cả elements h6:', Array.from(document.querySelectorAll('h6')).map(el => el.textContent.trim()));
            console.log('Debug: Tất cả elements p:', Array.from(document.querySelectorAll('p')).map(el => el.textContent.trim()));

            if (datHenLichMoElement) {
                debugLog('Tìm thấy "Đặt hẹn Lịch mổ", click...');
                sendMessageToParent('progress', { step: 'submenu_found', message: 'Đã tìm thấy submenu, đang chuyển trang...' });
                datHenLichMoElement.click();

                // Wait for the surgery scheduling page to load
                await new Promise(resolve => setTimeout(resolve, 1000));
                sendMessageToParent('progress', { step: 'page_ready', message: 'Trang đặt lịch đã sẵn sàng' });

                // Now we can fetch the surgery data if date range is available
                if (otmFetchUsers) {
                    await fetchOTMUsers();
                } else if (fromDate && toDate) {
                    await fetchSurgeryData(fromDate, toDate);
                } else {
                    debugLog('No date range provided; token should be captured by now. Closing tab.');
                    sendMessageToParent('progress', { step: 'token_ready', message: 'Token đã sẵn sàng' });
                    closeTab();
                }

            } else {
                debugLog('Không tìm thấy submenu "Đặt hẹn Lịch mổ"');
                debugLog('Debug: Current URL:', window.location.href);
                debugLog('Debug: Page title:', document.title);
                sendMessageToParent('error', { message: 'Không tìm thấy submenu "Đặt hẹn Lịch mổ"' });
                closeTab();
            }

        } catch (error) {
            console.error('Lỗi trong quá trình automation:', error);
            sendMessageToParent('error', { message: 'Lỗi trong quá trình tự động hóa: ' + error.message });
            closeTab();
        }
    }

    // Fetch OTM users list and return to parent
    async function fetchOTMUsers() {
        try {
            sendMessageToParent('progress', { step: 'token_wait', message: 'Đang chờ token xác thực...' });
            let attempts = 0;
            while (!bearerToken && attempts < 10) {
                await new Promise(r => setTimeout(r, 1000));
                attempts++;
            }
            if (!bearerToken) {
                sendMessageToParent('error', { message: 'Không thể lấy token xác thực sau 10 lần thử' });
                closeTab();
                return;
            }

            const query = 'ishsoft=null&page=1&limit=10000';
            const url = `https://otm.tahospital.vn/api/user?${query}&_=${Date.now()}`;
            debugLog('Fetching OTM users:', url);
            debugLog('Using Bearer token (prefix):', (bearerToken || '').slice(0, 12) + '...');

            const res = await fetch(url, {
                headers: {
                    'accept': 'application/json, text/plain, */*',
                    'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
                    'authorization': `Bearer ${bearerToken}`,
                    'logintype': '2',
                    'priority': 'u=1, i',
                    'sec-ch-ua': '"Not;A=Brand";v="99", "Microsoft Edge";v="139", "Chromium";v="139"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': '"Windows"',
                    'sec-fetch-dest': 'empty',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-site': 'same-origin',
                    'siteid': '1'
                },
                referrer: 'https://otm.tahospital.vn/surgery/booking',
                body: null,
                method: 'GET',
                mode: 'cors',
                cache: 'no-store',
                credentials: 'include'
            });

            debugLog('Users fetch status:', res.status, 'ok:', res.ok);
            debugLog('Users fetch headers etag:', res.headers && res.headers.get ? res.headers.get('etag') : undefined);
            let effectiveRes = res;
            if (res.status === 304) {
                // Retry once without caches using a cache-busting param
                debugLog('Received 304 for OTM users. Retrying with cache-busting...');
                const bustUrl = `${url}&_=${Date.now()}`;
                const retry = await fetch(bustUrl, {
                    headers: {
                        'accept': 'application/json, text/plain, */*',
                        'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
                        'authorization': `Bearer ${bearerToken}`,
                        'logintype': '2',
                        'siteid': '1'
                    },
                    referrer: 'https://otm.tahospital.vn/surgery/booking',
                    body: null,
                    method: 'GET',
                    mode: 'cors',
                    cache: 'no-store',
                    credentials: 'include'
                });
                effectiveRes = retry;
                debugLog('Retry users fetch status:', effectiveRes.status, 'ok:', effectiveRes.ok);
            }

            if (!effectiveRes.ok) {
                if (effectiveRes.status === 401 || effectiveRes.status === 403) {
                    sendMessageToParent('progress', { step: 'token_invalid', message: 'Token hết hạn, chuyển sang tự động hóa để lấy token mới...' });
                    startAutomation();
                    return;
                }
                throw new Error('HTTP ' + effectiveRes.status);
            }
            let json;
            try {
                json = await effectiveRes.json();
            } catch (parseErr) {
                debugLog('Users JSON parse error:', parseErr);
                try {
                    const txt = await effectiveRes.clone().text();
                    debugLog('Users raw text (first 300 chars):', (txt || '').slice(0, 300));
                } catch {}
                throw parseErr;
            }

            const keys = json && typeof json === 'object' ? Object.keys(json) : [];
            debugLog('Users response type:', Array.isArray(json) ? 'array' : typeof json, 'keys:', keys);

            function pickArrayPayload(obj) {
                if (Array.isArray(obj)) return { arr: obj, via: 'root' };
                if (!obj || typeof obj !== 'object') return { arr: [], via: 'none' };
                const candidates = ['data', 'items', 'result', 'rows', 'content', 'users', 'records', 'list'];
                for (const k of candidates) {
                    const v = obj[k];
                    if (Array.isArray(v)) return { arr: v, via: k };
                    if (v && typeof v === 'object') {
                        for (const kk of candidates) {
                            const v2 = v[kk];
                            if (Array.isArray(v2)) return { arr: v2, via: `${k}.${kk}` };
                        }
                    }
                }
                return { arr: [], via: 'not_found' };
            }

            const { arr: usersArray, via } = pickArrayPayload(json);
            debugLog('Users array source:', via, 'length:', usersArray.length || 0);
            let users = (usersArray || []).map(u => ({ id: u.id ?? u.taid ?? u.userid ?? u.userId ?? null, fullname: u.fullname || u.fullName || u.name || '' }));

            if ((users?.length || 0) === 0) {
                // Extra diagnostics for empty payloads
                debugLog('Empty users after parse. Sample payload snapshot:', JSON.stringify(json).slice(0, 400));
                sendMessageToParent('progress', { step: 'users_empty', via, keys, hint: 'Parsed 0 users from payload', url });

                // Optional fallback: drop ishsoft param if enabled
                if (localStorage.getItem('dr_otm_users_alt') === 'drop_ishsoft') {
                    const altUrl = 'https://otm.tahospital.vn/api/user?page=1&limit=10000&_=' + Date.now();
                    debugLog('Fallback fetch without ishsoft:', altUrl);
                    sendMessageToParent('progress', { step: 'users_alt_fetch', message: 'Thử lại không có ishsoft', altUrl });
                    const altRes = await fetch(altUrl, {
                        headers: {
                            'accept': 'application/json, text/plain, */*',
                            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
                            'authorization': `Bearer ${bearerToken}`,
                            'logintype': '2',
                            'priority': 'u=1, i',
                            'sec-ch-ua': '"Not;A=Brand";v="99", "Microsoft Edge";v="139", "Chromium";v="139"',
                            'sec-ch-ua-mobile': '?0',
                            'sec-ch-ua-platform': '"Windows"',
                            'sec-fetch-dest': 'empty',
                            'sec-fetch-mode': 'cors',
                            'sec-fetch-site': 'same-origin',
                            'siteid': '1'
                        },
                        referrer: 'https://otm.tahospital.vn/surgery/booking',
                        body: null,
                        method: 'GET',
                        mode: 'cors',
                        cache: 'no-store',
                        credentials: 'include'
                    });
                    if (altRes.ok) {
                        let altJson;
                        try { altJson = await altRes.json(); } catch {}
                        const altKeys = altJson && typeof altJson === 'object' ? Object.keys(altJson) : [];
                        const pickAlt = pickArrayPayload(altJson);
                        debugLog('Alt users array source:', pickAlt.via, 'length:', (pickAlt.arr || []).length || 0, 'keys:', altKeys);
                        users = (pickAlt.arr || []).map(u => ({ id: u.id ?? u.taid ?? u.userid ?? u.userId ?? null, fullname: u.fullname || u.fullName || u.name || '' }));
                        sendMessageToParent('progress', { step: 'users_alt_parsed', count: users.length, via: pickAlt.via });
                    } else {
                        debugLog('Alt users fetch failed:', altRes.status);
                        sendMessageToParent('progress', { step: 'users_alt_failed', status: altRes.status });
                    }
                }
            }

            // Emit a parse summary to parent for debugging
            const sample = (users || []).slice(0, 3).map(u => u.fullname);
            sendMessageToParent('progress', { step: 'users_parsed', count: users.length, via, sample });

            sendMessageToParent('success', {
                otmUsers: users,
                count: users.length,
                summary: `Đã tải ${users.length} người dùng từ OTM`
            });
            closeTab();
        } catch (e) {
            sendMessageToParent('error', { message: 'Lỗi khi lấy DS người dùng OTM: ' + (e.message || e) });
            closeTab();
        }
    }

    // Function to fetch surgery data for a date range
    async function fetchSurgeryData(fromDate, toDate) {
        try {
            debugLog('=== STARTING SURGERY DATA FETCH ===');
            // Keep original requested range for reporting
            const requestedFrom = fromDate;
            const requestedTo = toDate;
            debugLog('Requested range:', requestedFrom, 'to', requestedTo);

            // Send progress update to parent
            sendMessageToParent('progress', { step: 'token_wait', message: 'Đang chờ token xác thực...' });

            // Wait for token if not available yet
            let attempts = 0;
            while (!bearerToken && attempts < 10) {
                debugLog(`Waiting for Bearer token... (attempt ${attempts + 1}/10)`);
                await new Promise(resolve => setTimeout(resolve, 1000));
                attempts++;
            }

            if (!bearerToken) {
                debugLog('No Bearer token captured after 10 attempts');
                sendMessageToParent('error', { message: 'Không thể lấy token xác thực sau 10 lần thử' });
                closeTab();
                return;
            }

            debugLog('Bearer token available:', bearerToken.substring(0, 20) + '...');
            sendMessageToParent('progress', { step: 'token_ready', message: 'Token đã sẵn sàng, đang lấy dữ liệu...' });

            // Generate array of dates from requestedFrom to requestedTo (inclusive)
            function toDateOnly(dateStr) {
                // Always treat as date-only without timezone shifting
                const [y, m, d] = dateStr.split('-').map(n => parseInt(n, 10));
                return new Date(Date.UTC(y, (m - 1), d)); // UTC midnight for stability
            }
            const dates = [];
            const startDate = toDateOnly(requestedFrom);
            const endDate = toDateOnly(requestedTo);
            const cur = new Date(startDate.getTime());
            while (cur.getTime() <= endDate.getTime()) {
                const y = cur.getUTCFullYear();
                const m = String(cur.getUTCMonth() + 1).padStart(2, '0');
                const d = String(cur.getUTCDate()).padStart(2, '0');
                dates.push(`${y}-${m}-${d}`);
                cur.setUTCDate(cur.getUTCDate() + 1);
            }

            debugLog('Dates to fetch:', dates);

            const allSurgeryData = [];
            let totalSurgeries = 0;

            const getConcurrencyLimit = () => {
                const raw = localStorage.getItem('dr_otm_concurrency');
                const n = parseInt(raw ?? '3', 10);
                return isNaN(n) ? 3 : Math.min(Math.max(n, 1), 6);
            };

            async function fetchDateData(currentDate) {
                sendMessageToParent('progress', {
                    step: 'api_call',
                    message: `Đang gọi API cho ngày ${currentDate}...`
                });

                // Convert local Vietnam midnight (UTC+07:00) to exact Z time for API
                // e.g., '2025-09-07T00:00:00+07:00' -> '2025-09-06T17:00:00.000Z'
                const isoDate = new Date(`${currentDate}T00:00:00+07:00`).toISOString();

                debugLog(`Fetching data for date: ${currentDate} (ISO: ${isoDate})`);
                sendMessageToParent('progress', { step: 'api_call', message: `GET /api/booking?date=${isoDate}`, currentDate, isoDate });

                let response = await fetch(`https://otm.tahospital.vn/api/booking?date=${isoDate}`, {
                    headers: {
                        "accept": "application/json, text/plain, */*",
                        "accept-language": "en-US,en;q=0.9,vi;q=0.8",
                        "authorization": `Bearer ${bearerToken}`,
                        "logintype": "2",
                        "priority": "u=1, i",
                        "sec-ch-ua": "\"Not;A=Brand\";v=\"99\", \"Microsoft Edge\";v=\"139\", \"Chromium\";v=\"139\"",
                        "sec-ch-ua-mobile": "?0",
                        "sec-ch-ua-platform": "\"Windows\"",
                        "sec-fetch-dest": "empty",
                        "sec-fetch-mode": "cors",
                        "sec-fetch-site": "same-origin",
                        "siteid": "1"
                    },
                    referrer: "https://otm.tahospital.vn/surgery/booking",
                    body: null,
                    method: "GET",
                    mode: "cors",
                    cache: "no-store",
                    credentials: "include"
                });
                if (response.status === 304) {
                    debugLog(`Received 304 for ${currentDate}. Retrying with cache-busting...`);
                    const retryUrl = `https://otm.tahospital.vn/api/booking?date=${isoDate}&_=${Date.now()}`;
                    response = await fetch(retryUrl, {
                        headers: {
                            "accept": "application/json, text/plain, */*",
                            "authorization": `Bearer ${bearerToken}`,
                            "logintype": "2",
                            "siteid": "1"
                        },
                        referrer: "https://otm.tahospital.vn/surgery/booking",
                        body: null,
                        method: "GET",
                        mode: "cors",
                        cache: "no-store",
                        credentials: "include"
                    });
                }

                if (!response.ok) {
                    debugLog(`HTTP error for ${currentDate}: ${response.status}`);
                    if (response.status === 401 || response.status === 403) {
                        const err = new Error('Unauthorized');
                        err.__unauthorized = true;
                        throw err;
                    }
                    return { surgeriesWithDate: [], count: 0 };
                }
                let data;
                try { data = await response.json(); }
                catch (parseErr) {
                    debugLog('Booking JSON parse error:', parseErr);
                    try { const raw = await response.clone().text(); debugLog('Booking raw (first 300):', (raw||'').slice(0,300)); } catch {}
                    return { surgeriesWithDate: [], count: 0 };
                }
                debugLog(`Surgery data received for ${currentDate}:`, data);
                if (!Array.isArray(data) || data.length === 0) return { surgeriesWithDate: [], count: 0 };

                const surgeriesWithDate = data.map(surgery => ({ ...surgery, fetchDate: currentDate }));
                debugLog(`Full surgery data for ${currentDate}:`, data);
                return { surgeriesWithDate, count: data.length };
            }

            const concurrency = getConcurrencyLimit();
            let unauthorizedDetected = false;
            for (let i = 0; i < dates.length; i += concurrency) {
                const batch = dates.slice(i, i + concurrency);
                const results = await Promise.allSettled(batch.map(d => fetchDateData(d)));

                for (const res of results) {
                    if (res.status === 'rejected') {
                        if (res.reason && res.reason.__unauthorized) {
                            unauthorizedDetected = true;
                            break;
                        } else {
                            debugLog('Batch fetch error:', res.reason);
                        }
                    } else if (res.value) {
                        const { surgeriesWithDate, count } = res.value;
                        if (count > 0) {
                            totalSurgeries += count;
                            allSurgeryData.push(...surgeriesWithDate);
                        }
                    }
                }

                if (unauthorizedDetected) {
                    sendMessageToParent('progress', { step: 'token_invalid', message: 'Token hết hạn, chuyển sang tự động hóa để lấy token mới...' });
                    startAutomation();
                    return;
                }

                // Small delay between batches to avoid rate limiting
                if (i + concurrency < dates.length) {
                    await new Promise(resolve => setTimeout(resolve, 200));
                }
            }

            sendMessageToParent('progress', { step: 'data_received', message: 'Đã nhận dữ liệu từ API', days: dates.length, totalCandidate: allSurgeryData.length });

            // Send success data to parent with all collected data (raw + filtered)
            const filteredSurgeryData = filterSurgeryData(allSurgeryData);
            if (filteredSurgeryData.length > 0) {
                const message = `Tìm thấy tổng cộng ${totalSurgeries} ca mổ từ ${requestedFrom} đến ${requestedTo}:\n\n` +
                    allSurgeryData.map((item, index) => 
                        `${index + 1}. ${item.customer?.fullname || 'N/A'} - ${item.surgerymethod || 'N/A'} (${item.fetchDate})`
                    ).join('\n');

                sendMessageToParent('success', {
                    surgeryData: filteredSurgeryData,
                    surgeryDataRaw: allSurgeryData,
                    count: filteredSurgeryData.length,
                    dateRange: { from: requestedFrom, to: requestedTo },
                    summary: message
                });

                debugLog('=== SURGERY DATA FETCH COMPLETED SUCCESSFULLY ===');
                debugLog(`Total surgeries found (filtered): ${filteredSurgeryData.length}`);
            } else {
                sendMessageToParent('success', {
                    surgeryData: [],
                    surgeryDataRaw: allSurgeryData,
                    count: 0,
                    dateRange: { from: requestedFrom, to: requestedTo },
                    summary: `Không tìm thấy dữ liệu mổ từ ${requestedFrom} đến ${requestedTo}`
                });
            }

            // Small delay to let storage events propagate before closing
            setTimeout(() => { try { closeTab(); } catch(_) {} }, 350);

        } catch (error) {
            debugLog('Error fetching surgery data:', error);
            debugLog('Lỗi khi lấy dữ liệu mổ: ' + error.message);
            sendMessageToParent('error', {
                message: 'Lỗi khi lấy dữ liệu mổ: ' + error.message,
                error: error.toString()
            });
            setTimeout(() => { try { closeTab(); } catch(_) {} }, 350);
        }
    }

    // Start automation when page loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            // checkExistingToken() is already called at the top
        });
    } else {
        // checkExistingToken() is already called at the top
    }

})();

},{}],20:[function(require,module,exports){
(function (global){(function (){
// dashboard.js

const Utils = require('../utils');
const {
    createDirectReportGeneration,
    addGlobalStyles
} = require('./page.dashboard.support');

// Import cài đặt giao diện
const BS_CAI_DAT = require('../BS_CAI_DAT_GIAO_DIEN');

// Import refactored modules
const PatientService = require('../services/patientService');
const ChecklistService = require('../services/checklistService');
const PatientDataMapper = require('../utils/patientDataMapper');
const ModalManager = require('../components/modalManager');
const LoginHandler = require('../components/loginHandler');

// Import newly refactored components
const { createPatientInfoSection } = require('../components/patientInfoSection');
const SidebarSession = require('../components/sidebarSession');
const { createYLenhTags, updatePatientCardTags, hasDischargeTag, updateMedsDoneBadge } = require('../utils/tagUtils');
const { setupPhauThuatHandlers } = require('../components/phauThuatHandlers');

// Import utility functions
const { showToast, copyToClipboard } = require('../utils/uiUtils');
const { addSurgeryStatusIcon, formatSurgeryInfo, updatePatientCardPhauThuat } = require('../utils/surgeryUtils');
const { escapeHtml } = require('../utils/htmlUtils');
const DomUpdaters = require('../utils/domUpdaters');
const { createChecklistItemHTML, copyYLenhText, checkCelebrationForCard, checkAllCelebrationAnimations } = require('../utils/checklistUtils');

// Global variable for OTM tabs
if (typeof window !== 'undefined') {
    window.openTabs = window.openTabs || [];
} else if (typeof global !== 'undefined') {
    global.openTabs = global.openTabs || [];
} else {
    this.openTabs = this.openTabs || [];
}

function showDashboardBenhNhanIfNeeded() {
    // Use global openTabs variable for OTM tabs
    if (!window.openTabs) window.openTabs = [];
    let openTabs = window.openTabs;
    
    if (!(/[?&](show=true|nln)($|&)/.test(window.location.search))) return;
    addGlobalStyles(); // Đảm bảo style chỉ chèn 1 lần

    // Make utility functions globally available for onclick handlers
    // Không sử dụng window để tránh lỗi undefined - sử dụng global assignment trực tiếp
    if (typeof unsafeWindow !== 'undefined') {
        unsafeWindow.showToast = showToast;
        unsafeWindow.copyToClipboard = copyToClipboard;
        unsafeWindow.copyYLenhText = copyYLenhText;
    unsafeWindow.updatePatientCardPhauThuat = updatePatientCardPhauThuat;
    unsafeWindow.updatePatientCardHXT = DomUpdaters.updateHXT;
    unsafeWindow.updatePatientCardCDKT = DomUpdaters.updateCDKT;
    } else if (typeof this !== 'undefined') {
        this.showToast = showToast;
        this.copyToClipboard = copyToClipboard;
        this.copyYLenhText = copyYLenhText;
    this.updatePatientCardPhauThuat = updatePatientCardPhauThuat;
    this.updatePatientCardHXT = DomUpdaters.updateHXT;
    this.updatePatientCardCDKT = DomUpdaters.updateCDKT;
    } else {
        // Fallback - tạo global functions không qua window
        globalThis.showToast = showToast;
        globalThis.copyToClipboard = copyToClipboard;
        globalThis.copyYLenhText = copyYLenhText;
    globalThis.updatePatientCardPhauThuat = updatePatientCardPhauThuat;
    globalThis.updatePatientCardHXT = DomUpdaters.updateHXT;
    globalThis.updatePatientCardCDKT = DomUpdaters.updateCDKT;
    }
    
    // Styles are injected via addGlobalStyles() only

    const checklistItems = BS_CAI_DAT.checklistItems;
    const quickYLenhActions = BS_CAI_DAT.quickYLenhActions;

    // Helper function to create checklist section
    async function createChecklistSectionAsync(patient) {
        const checklistDiv = document.createElement('div');
        
        // Determine if patient has discharge tag
        const hasDischarge = hasDischargeTag(patient);
        const defaultTab = hasDischarge ? 'xuatvien' : 'bomo';
        
        checklistDiv.innerHTML = `
            <h3 style="margin-top:0">Checklist</h3>
            <div class="checklist-tabs" style="display:flex;margin-bottom:16px;border-bottom:2px solid #e0e0e0;">
                <button class="tab-btn ${defaultTab === 'bomo' ? 'active' : ''}" data-tab="bomo" style="padding:8px 16px;border:none;background:${defaultTab === 'bomo' ? '#1976d2' : 'transparent'};color:${defaultTab === 'bomo' ? 'white' : '#666'};border-radius:4px 4px 0 0;cursor:pointer;font-weight:${defaultTab === 'bomo' ? 'bold' : 'normal'};">Bộ mổ</button>
                <button class="tab-btn ${defaultTab === 'xuatvien' ? 'active' : ''}" data-tab="xuatvien" style="padding:8px 16px;border:none;background:${defaultTab === 'xuatvien' ? '#4caf50' : 'transparent'};color:${defaultTab === 'xuatvien' ? 'white' : '#666'};border-radius:4px 4px 0 0;cursor:pointer;margin-left:4px;font-weight:${defaultTab === 'xuatvien' ? 'bold' : 'normal'};">Xuất viện</button>
            </div>
            <div class="tab-content">
                <div class="tab-pane ${defaultTab === 'bomo' ? 'active' : ''}" data-tab="bomo" style="display:${defaultTab === 'bomo' ? 'block' : 'none'};">
                    <ul id="checklist-bomo" style="overflow-y:auto;padding-left:0;list-style:none;margin:0 0 16px 0;"></ul>
                </div>
                <div class="tab-pane ${defaultTab === 'xuatvien' ? 'active' : ''}" data-tab="xuatvien" style="display:${defaultTab === 'xuatvien' ? 'block' : 'none'};">
                    <ul id="checklist-xuatvien" style="overflow-y:auto;padding-left:0;list-style:none;margin:0 0 16px 0;"></ul>
                </div>
            </div>
        `;
        
        // Setup tab switching
        setTimeout(() => {
            const tabBtns = checklistDiv.querySelectorAll('.tab-btn');
            const tabPanes = checklistDiv.querySelectorAll('.tab-pane');
            
            tabBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    const targetTab = this.getAttribute('data-tab');
                    
                    // Update buttons
                    tabBtns.forEach(b => {
                        b.classList.remove('active');
                        b.style.background = 'transparent';
                        b.style.color = '#666';
                        b.style.fontWeight = 'normal';
                    });
                    
                    this.classList.add('active');
                    this.style.background = targetTab === 'bomo' ? '#1976d2' : '#4caf50';
                    this.style.color = 'white';
                    this.style.fontWeight = 'bold';
                    
                    // Update panes
                    tabPanes.forEach(pane => {
                        pane.classList.remove('active');
                        pane.style.display = 'none';
                    });
                    
                    const targetPane = checklistDiv.querySelector(`.tab-pane[data-tab="${targetTab}"]`);
                    if (targetPane) {
                        targetPane.classList.add('active');
                        targetPane.style.display = 'block';
                    }
                });
            });
        }, 10);
        
        // Load both checklists asynchronously
        const bomoList = checklistDiv.querySelector('#checklist-bomo');
        const xuatvienList = checklistDiv.querySelector('#checklist-xuatvien');
        
        // Await the async loadChecklist for bomo
        if (bomoList) {
            await loadChecklist(patient, bomoList, 'bomo');
        }
        
        // For xuatvien, it's not async but we can wait a bit for the setTimeout
        if (xuatvienList) {
            loadChecklistXuatVien(patient, xuatvienList);
            // Wait for the setTimeout in loadChecklistXuatVien
            await new Promise(resolve => setTimeout(resolve, 150));
        }
        
        return checklistDiv;
    }

    // Helper function to load checklist data
    async function loadChecklist(patient, checklistUl, checklistType = 'bomo', retryCount = 0) {
        try {
            checklistUl.innerHTML = '<li>Đang tải checklist...</li>';
            
            const res = await ChecklistService.loadChecklistData(patient, { forceRefresh: true });
            checklistUl.innerHTML = '';
            
            let checklistObj = ChecklistService.findChecklistObject(res);
            
            if (!checklistObj) {
                checklistUl.innerHTML = '<li>Không có dữ liệu</li>';
                const created = await ChecklistService.createNewChecklist(patient);
                if (created) {
                    loadChecklist(patient, checklistUl, checklistType, retryCount + 1);
                } else {
                    checklistUl.innerHTML = '<li>Lỗi tạo mới checklist phiếu!</li>';
                    if (retryCount < 1) {
                        setTimeout(() => {
                            const sidebar = document.getElementById('dr-sidebar');
                            const backdrop = document.getElementById('dr-sidebar-backdrop');
                            ModalManager.hideModal(sidebar, backdrop);
                            setTimeout(() => {
                                showSidebar(patient);
                            }, 300);
                        }, 500);
                    }
                }
                return;
            }

            window.checklistObj = checklistObj;
            // Parse into a fresh object; avoid leaking prior patient's HXT into others
            const parsedState = ChecklistService.parseChecklistState(checklistObj) || {};
            window.checklistState = { ...parsedState };
            // Merge standardized OTM surgeries (if any) for this patient into state (append-only)
            try {
                const otmLogs = Array.isArray(patient && patient._otmPhauThuatLog) ? patient._otmPhauThuatLog : [];
                if (otmLogs.length > 0) {
                    if (!Array.isArray(window.checklistState.phauThuatLog)) window.checklistState.phauThuatLog = [];
                    const keyOf = (e) => `${e.date}|${e.time}|${(e.method||'').trim().toLowerCase()}`;
                    const existingKeys = new Set(window.checklistState.phauThuatLog.map(keyOf));
                    let added = 0;
                    for (const e of otmLogs) {
                        const k = keyOf(e);
                        if (!existingKeys.has(k)) {
                            window.checklistState.phauThuatLog.push({ ...e });
                            existingKeys.add(k);
                            added++;
                        }
                    }
                    if (added > 0) {
                        const parseDDMMYYYY = (s) => { const [d,m,y] = String(s||'').split('/').map(n=>parseInt(n,10)); return new Date(y||1970,(m||1)-1,d||1); };
                        const toTs = (e) => { const dt = parseDDMMYYYY(e.date); const [hh,mm] = String(e.time||'00:00').split(':').map(n=>parseInt(n,10)||0); dt.setHours(hh, mm, 0, 0); return dt.getTime(); };
                        window.checklistState.phauThuatLog.sort((a,b) => toTs(b)-toTs(a));
                        // Persist silently in background
                        try { ChecklistService.updateChecklistState(window.checklistObj, window.checklistState, { enqueueOnOffline: true, ctxId: (window.dr_sidebar_ctx && window.dr_sidebar_ctx.id), signal: (window.dr_sidebar_ctx && window.dr_sidebar_ctx.signal) }); } catch (_) {}
                    }
                }
            } catch (e) { console.warn('OTM merge into checklistState failed', e); }
            
            // Load y lệnh log if exists
            const yLenhLogContainer = document.getElementById('dr-y-lenh-log');
            if (yLenhLogContainer && window.checklistState && window.checklistState.yLenhLog) {
                loadYLenhLogFromState();
            }

            // Load phẫu thuật log if exists
            const ptLogContainer = document.getElementById('dr-pt-log');
            if (ptLogContainer && window.checklistState && window.checklistState.phauThuatLog) {
                loadPhauThuatLogFromState();
            }

            // Render checklist items for bộ mổ
            if (checklistType === 'bomo') {
                renderChecklistItems(checklistUl);
            }
            
        } catch (error) {
            console.error('Error loading checklist:', error);
            checklistUl.innerHTML = '<li>Lỗi tải checklist</li>';
        }
    }

    // Helper function to load checklist xuất viện
    function loadChecklistXuatVien(patient, checklistUl) {
        try {
            checklistUl.innerHTML = '<li>Đang tải checklist xuất viện...</li>';
            
            setTimeout(() => {
                renderChecklistXuatVien(checklistUl, patient);
            }, 100);
            
        } catch (error) {
            console.error('Error loading xuất viện checklist:', error);
            checklistUl.innerHTML = '<li>Lỗi tải checklist xuất viện</li>';
        }
    }

    // Helper function to render checklist xuất viện
    function renderChecklistXuatVien(checklistUl, patient) {
        checklistUl.innerHTML = '';
        
        BS_CAI_DAT.checklistXuatVien.forEach((item, idx) => {
            const li = document.createElement('li');
            li.style = 'margin-bottom:8px;';
            
            if (typeof item === 'string') {
                // Simple checklist item
                const id = 'dr-checklist-xv-' + idx;
                const isChecked = window.checklistState && window.checklistState[`xuatvien_${item}`] || false;
                
                li.innerHTML = createChecklistItemHTML(item, id, isChecked, patient);
            } else if (item.children) {
                // Parent item with children - Special handling for "Tờ điều trị"
                if (item.label === 'Tờ điều trị') {
                    // Render as header without checkbox
                    li.innerHTML = `
                        <div style="margin-bottom:12px;">
                            <h4 style="margin:0 0 8px 0;color:#1976d2;font-weight:bold;border-bottom:2px solid #e3f2fd;padding-bottom:4px;">📋 ${item.label}</h4>
                            <ul style="margin-left:0;margin-top:8px;list-style:none;padding:0;">
                                ${item.children.map((child, childIdx) => {
                                    const childId = `dr-checklist-xv-child-${idx}-${childIdx}`;
                                    const isChildChecked = window.checklistState && window.checklistState[`xuatvien_${child}`] || false;
                                    return `<li style="margin-bottom:4px;">${createChecklistItemHTML(child, childId, isChildChecked, patient)}</li>`;
                                }).join('')}
                            </ul>
                        </div>
                    `;
                } else {
                    // Normal parent item with checkbox
                    const parentId = 'dr-checklist-xv-parent-' + idx;
                    const isParentChecked = window.checklistState && window.checklistState[`xuatvien_${item.label}`] || false;
                    
                    li.innerHTML = `
                        <div style="margin-bottom:8px;">
                            <label style="display:flex;align-items:center;gap:8px;font-weight:bold;">
                                <input type="checkbox" id="${parentId}" ${isParentChecked ? 'checked' : ''}>${item.label}
                            </label>
                            <ul style="margin-left:24px;margin-top:8px;list-style:none;padding:0;">
                                ${item.children.map((child, childIdx) => {
                                    const childId = `dr-checklist-xv-child-${idx}-${childIdx}`;
                                    const isChildChecked = window.checklistState && window.checklistState[`xuatvien_${child}`] || false;
                                    return `<li style="margin-bottom:4px;">${createChecklistItemHTML(child, childId, isChildChecked, patient)}</li>`;
                                }).join('')}
                            </ul>
                        </div>
                    `;
                }
            }
            
            checklistUl.appendChild(li);
        });

        // Setup checkbox change handlers for xuất viện
        setTimeout(() => {
            checklistUl.querySelectorAll('input[type=checkbox]').forEach((cb, idx) => {
                cb.addEventListener('change', async function () {
                    const item = BS_CAI_DAT.checklistXuatVien[idx];
                    let label = '';
                    if (typeof item === 'string') {
                        label = item;
                    } else if (item.label) {
                        label = item.label;
                    } else {
                        // Fallback for child items - extract from data attribute or parent text
                        const dataLabel = this.getAttribute('data-original-label');
                        if (dataLabel) {
                            label = dataLabel;
                        } else {
                            label = this.parentNode.textContent.trim();
                        }
                    }
                    const key = `xuatvien_${label}`;
                    
                    if (!window.checklistState) {
                        window.checklistState = {};
                    }
                    
                    window.checklistState[key] = this.checked;
                    
                    const res = await ChecklistService.updateChecklistState(window.checklistObj, window.checklistState, { enqueueOnOffline: true, ctxId: (window.dr_sidebar_ctx && window.dr_sidebar_ctx.id), signal: (window.dr_sidebar_ctx && window.dr_sidebar_ctx.signal) });
                    if (!res || (!res.ok && !res.queued)) {
                        console.error('Lưu checklist xuất viện thất bại!');
                    }
                });
            });
        }, 10);
        
        // Make function available for reuse
        window.renderChecklistXuatVien = renderChecklistXuatVien;
    }



    // Helper function to load y lệnh log from state
    function loadYLenhLogFromState() {
        const logContainer = document.getElementById('dr-y-lenh-log');
        if (!logContainer) return;

        function renderYLenhLog(yLenhArray) {
            if (!Array.isArray(yLenhArray) || yLenhArray.length === 0) {
                logContainer.innerHTML = '<div style="color:#888;font-style:italic;">Chưa có y lệnh nào...</div>';
                return;
            }

            logContainer.innerHTML = yLenhArray.map((entry, index) => `
                <div style="margin-bottom:8px;padding:8px 40px 8px 8px;background:#fff;border-radius:4px;border-left:3px solid #1976d2;position:relative;word-break: break-word; overflow-wrap: anywhere;">
                    <button class="remove-y-lenh-btn" data-index="${index}" style="position:absolute;right:8px;top:50%;transform:translateY(-50%);background:#d32f2f;color:#fff;border:none;border-radius:3px;padding:2px 6px;font-size:0.8em;cursor:pointer;">Xóa</button>
                    <div style="font-size:0.9em;color:#666;margin-bottom:4px;">${entry.timestamp}</div>
                    <div style="font-weight:bold;color:#333;">${entry.content}</div>
                </div>
            `).join('');

            // Add event listeners for remove buttons
            setTimeout(() => {
                logContainer.querySelectorAll('.remove-y-lenh-btn').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const index = parseInt(this.getAttribute('data-index'));
                        if (window.currentRemoveYLenh) {
                            window.currentRemoveYLenh(index);
                        } else {
                            // Fallback removal function
                            if (window.checklistState.yLenhLog && Array.isArray(window.checklistState.yLenhLog)) {
                                window.checklistState.yLenhLog.splice(index, 1);
                                // Re-render after removal
                                renderYLenhLog(window.checklistState.yLenhLog);
                                // Save to server
                                if (window.checklistObj) {
                                    ChecklistService.updateChecklistState(window.checklistObj, window.checklistState, { enqueueOnOffline: true, ctxId: (window.dr_sidebar_ctx && window.dr_sidebar_ctx.id), signal: (window.dr_sidebar_ctx && window.dr_sidebar_ctx.signal) });
                                }
                            }
                        }
                    });
                });
            }, 10);
        }

        if (window.checklistState && window.checklistState.yLenhLog) {
            renderYLenhLog(window.checklistState.yLenhLog);
        }
    }

    // Helper function to load phẫu thuật log from state
    function loadPhauThuatLogFromState() {
        const logContainer = document.getElementById('dr-pt-log');
        if (!logContainer) return;

        // Use the current render function if available
        if (window.currentRenderPhauThuatLog && window.checklistState && window.checklistState.phauThuatLog) {
            window.currentRenderPhauThuatLog(window.checklistState.phauThuatLog);
            return;
        }

        // Fallback render function
        function renderPhauThuatLog(phauThuatArray) {
            if (!Array.isArray(phauThuatArray) || phauThuatArray.length === 0) {
                logContainer.innerHTML = '<div style="color:#888;font-style:italic;">Chưa có phẫu thuật nào...</div>';
                return;
            }

            logContainer.innerHTML = phauThuatArray.map((entry, index) => `
                <div class="pt-entry-clickable" data-index="${index}" style="margin-bottom:8px;padding:8px 40px 8px 8px;background:#fff;border-radius:4px;border-left:3px solid #4caf50;position:relative;cursor:pointer;transition:background-color 0.2s;" onmouseover="this.style.backgroundColor='#f5f5f5'" onmouseout="this.style.backgroundColor='#fff'">
                    <button class="remove-pt-btn" data-index="${index}" style="position:absolute;right:8px;top:50%;transform:translateY(-50%);background:#d32f2f;color:#fff;border:none;border-radius:3px;padding:2px 6px;font-size:0.8em;cursor:pointer;z-index:1;">Xóa</button>
                    <div style="font-size:0.9em;color:#666;margin-bottom:4px;"><strong>Ngày PT:</strong> ${entry.date} ${entry.time}</div>
                    <div style="font-weight:bold;color:#333;margin-bottom:2px;"><strong>PPPT:</strong> ${entry.method}</div>
                    <div style="font-size:0.85em;color:#555;"><strong>BS:</strong> ${entry.doctors}</div>
                </div>
            `).join('');

            // Add event listeners for remove buttons
            setTimeout(() => {
                logContainer.querySelectorAll('.remove-pt-btn').forEach(btn => {
                    btn.addEventListener('click', function(e) {
                        e.stopPropagation(); // Prevent triggering edit popup
                        const index = parseInt(this.getAttribute('data-index'));
                        if (window.currentRemovePhauThuat) {
                            window.currentRemovePhauThuat(index);
                        } else {
                            // Fallback removal function
                            if (window.checklistState.phauThuatLog && Array.isArray(window.checklistState.phauThuatLog)) {
                                window.checklistState.phauThuatLog.splice(index, 1);
                                // Re-render after removal
                                renderPhauThuatLog(window.checklistState.phauThuatLog);
                                // Save to server
                                if (window.checklistObj) {
                                    ChecklistService.updateChecklistState(window.checklistObj, window.checklistState, { enqueueOnOffline: true, ctxId: (window.dr_sidebar_ctx && window.dr_sidebar_ctx.id), signal: (window.dr_sidebar_ctx && window.dr_sidebar_ctx.signal) });
                                }
                            }
                        }
                    });
                });

                // Add event listeners for edit functionality
                logContainer.querySelectorAll('.pt-entry-clickable').forEach(entry => {
                    entry.addEventListener('click', function(e) {
                        // Don't trigger if clicking the remove button
                        if (e.target.classList.contains('remove-pt-btn')) return;
                        
                        const index = parseInt(this.getAttribute('data-index'));
                        if (window.currentEditPhauThuat) {
                            window.currentEditPhauThuat(index);
                        } else {
                            console.warn('Edit function not available');
                        }
                    });
                });
            }, 10);
        }

        if (window.checklistState && window.checklistState.phauThuatLog) {
            renderPhauThuatLog(window.checklistState.phauThuatLog);
        }
    }

    // Helper function to render checklist items with HSBA badges and sync note
    function renderChecklistItems(checklistUl) {
        checklistUl.innerHTML = '';
        const hsbaSynced = (window.checklistState && window.checklistState.hsbaSynced) || {};
        const lastSyncAt = hsbaSynced.__lastSyncAt || null;
        checklistItems.forEach((item, idx) => {
            const li = document.createElement('li');
            // No margin/padding; keep optional background and radius only
            let liStyle = 'border-radius:6px;';
            const id = 'dr-checklist-' + idx;
            const isChecked = !!(window.checklistState && window.checklistState[item]);
            const auto = hsbaSynced[item] && hsbaSynced[item].matched === true;
            const badge = auto ? `<span class="dr-hsba-badge" title="Đã có trong HSBA" style="color:#16a34a; font-weight:700;">✔</span>` : '';
            const hint = auto ? `<span class="dr-hsba-hint" style="color:#16a34a; font-size:12px;">(HSBA)</span>` : '';
            if (auto) {
                const hl = (BS_CAI_DAT && BS_CAI_DAT.colors && BS_CAI_DAT.colors.blueCardBackground) ? BS_CAI_DAT.colors.blueCardBackground : '#e3f2fd';
                liStyle += `background:${hl};`;
            }
            li.style = liStyle;
            li.innerHTML = `<label style="display:flex;align-items:center;gap:0;min-height:28px;"><input type="checkbox" id="${id}" ${isChecked ? 'checked' : ''}>${item}${auto ? ' ' : ''}${badge}${auto ? ' ' : ''}${hint}</label>`;
            checklistUl.appendChild(li);
        });

        // Add sync note under list
        const note = document.createElement('div');
        note.className = 'dr-hsba-sync-note';
        note.style.cssText = 'margin-top:6px; font-size:12px; color:#64748b;';
        if (lastSyncAt) {
            const dt = new Date(lastSyncAt);
            const dd = String(dt.getDate()).padStart(2,'0');
            const mm = String(dt.getMonth()+1).padStart(2,'0');
            const yyyy = dt.getFullYear();
            const hh = String(dt.getHours()).padStart(2,'0');
            const mi = String(dt.getMinutes()).padStart(2,'0');
            note.textContent = `Đồng bộ HSBA: ${dd}/${mm}/${yyyy} ${hh}:${mi}`;
        } else {
            note.textContent = 'Đồng bộ HSBA: chưa có';
        }
        checklistUl.parentElement.appendChild(note);

        // Setup checkbox change handlers
        setTimeout(() => {
            checklistUl.querySelectorAll('input[type=checkbox]').forEach((cb, idx) => {
                cb.addEventListener('change', async function () {
                    const itemText = checklistItems[idx]; // Use original item text, not display text
                    window.checklistState[itemText] = this.checked;
                    const res = await ChecklistService.updateChecklistState(window.checklistObj, window.checklistState, { enqueueOnOffline: true, ctxId: (window.dr_sidebar_ctx && window.dr_sidebar_ctx.id), signal: (window.dr_sidebar_ctx && window.dr_sidebar_ctx.signal) });
                    if (!res || (!res.ok && !res.queued)) {
                        console.error('Lưu checklist thất bại!');
                    }
                });
            });
        }, 10);
    }

    // Public refresh to update HSBA badges and note after sync
    window.dr_refreshChecklistBadges = function () {
        try {
            const ul = document.querySelector('#checklist-bomo');
            if (ul) renderChecklistItems(ul);
        } catch(_) {}
    };

    async function showSidebar(patient) {
        const backdrop = ModalManager.getOrCreateBackdrop();
        const sidebar = ModalManager.getOrCreateSidebar();
        
        // Clear and setup sidebar with responsive layout
        sidebar.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 100vh; font-size: 18px; color: #666;">
                <div style="text-align: center;">
                    <div style="margin-bottom: 16px;">Đang tải thông tin bệnh nhân...</div>
                    <div style="width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #1976d2; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto;"></div>
                </div>
            </div>
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `;
    // Start a new session for this sidebar open
    const sessionId = SidebarSession.startSession(patient && patient.mabn);
        sidebar.style = `position:fixed;top:0;right:0;width:80vw;max-width:80vw;height:100vh;background:#fff;z-index:100000;box-shadow:-2px 0 16px rgba(0,0,0,0.15);padding:32px 24px 24px 24px;overflow-y:auto;transition:right 0.2s;`;
        
        // Create responsive container
        const container = document.createElement('div');
        container.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 20px;
            height: 100%;
        `;
        
    // Responsive styles are handled in addGlobalStyles()
        
        container.className = 'dr-sidebar-container';
        
        // Left column: Patient info with surgery and y lệnh
        const leftColumn = document.createElement('div');
        leftColumn.className = 'dr-sidebar-left';
        leftColumn.style.cssText = `
            flex: 1;
            min-width: 0;
        `;
        
    // Sidebar action buttons (reuse card actions behavior)
        const sidebarActions = document.createElement('div');
        sidebarActions.className = 'dr-sidebar-actions';
        sidebarActions.style.cssText = `
            display: flex; justify-content: flex-end; gap: 10px; 
            margin-bottom: 12px; flex-wrap: wrap;
        `;
    // Import shared action creators
    const { createToDieuTriButton, createHsbaButton, createHsbaV1Button } = require('../components/actionButtons');
    const { initCopyDienTienAI } = require('../components/copyDienTienAI');
    sidebarActions.appendChild(createToDieuTriButton({ item: patient, variant: 'full' }));
    sidebarActions.appendChild(createHsbaV1Button(patient));
    sidebarActions.appendChild(createHsbaButton({ item: patient, variant: 'full' }));

    // Copy diễn tiến button (AI) inside sidebar actions
    try {
        const btnCopy = document.createElement('button');
        btnCopy.type = 'button';
        btnCopy.className = 'btn btn-sm btn-success';
        btnCopy.textContent = 'Copy diễn tiến';
        // Copy-again icon button
        const btnCopyAgain = document.createElement('button');
        btnCopyAgain.type = 'button';
        btnCopyAgain.title = 'Copy lại';
        btnCopyAgain.className = 'btn btn-sm btn-outline-secondary';
        btnCopyAgain.style.marginLeft = '6px';
        btnCopyAgain.textContent = '📋';
        btnCopyAgain.style.display = 'none';
        btnCopy.addEventListener('click', async () => {
            // Build a minimal runner that reuses CopyDienTienAI logic with explicit mabn
            const mabn = (patient && (patient.pid || patient.mabn)) ? String(patient.pid || patient.mabn) : '';
            const wrap = document.createElement('div');
            const statusBar = document.createElement('div');
            statusBar.id = 'dr-copy-dien-tien-status';
            statusBar.style.cssText = 'margin-left:8px; font-size:12px; color:#0f172a;';
            // Place status near the button
            btnCopyAgain.insertAdjacentElement('afterend', statusBar);

            if (!mabn) {
                const mod = require('../components/copyDienTienAI');
                mod.setStatus(statusBar, 'Không tìm thấy MABN (pid)', '#b91c1c', true);
                return;
            }

            // Import functions from module
            const mod = require('../components/copyDienTienAI');
            const { fetchPatientInfo } = mod.__esModule ? mod : { fetchPatientInfo: undefined };
            // Fallback: call via window by reusing internal helpers through duplicated minimal flow
            try {
                mod.setStatus(statusBar, 'Đang lấy thông tin người bệnh...', '#0f172a', false);
                // use internal method via module reference already loaded in bundle
                const info = await mod.fetchPatientInfo(mabn);
                const mavaovien = info.maVaoVien || info.mavaovien || '';
                const ngayvv = mod.parseMMDDYYYYtoDDMMYYYY(info.ngayVV || info.ngayvv || '');
                const maql = info.maql || '';
                if (!mavaovien || !ngayvv || !maql) {
                    mod.setStatus(statusBar, 'Thiếu tham số (mã vào viện/ngày vào/maql)', '#b91c1c', true);
                    return;
                }
                const denngay = mod.todayDDMMYYYY();
                const pdfUrl = `/todieutri/DienBien/PrintPDF?id=&mabn=${encodeURIComponent(mabn)}&mavaovien=${encodeURIComponent(mavaovien)}&tungay=${encodeURIComponent(ngayvv)}&denngay=${encodeURIComponent(denngay)}&maql=${encodeURIComponent(maql)}`;

                mod.setStatus(statusBar, 'Đang tải và xử lý PDF...', '#0f172a', false);
                const buf = await mod.fetchPdfArrayBuffer(pdfUrl);
                const rawText = await mod.extractAllTextFromPdfBuffer(buf);
                const text = mod.sanitizeCopiedText(rawText);

                mod.setStatus(statusBar, 'Đang copy vào clipboard...', '#0f172a', false);
                const ok = await mod.copyToClipboard(text);
                if (ok) {
                    mod.setStatus(statusBar, 'Đã copy toàn bộ diễn tiến vào clipboard.', '#166534', true);
                    btnCopyAgain.dataset.clipboardText = text;
                    btnCopyAgain.style.display = 'inline-block';
                } else {
                    mod.setStatus(statusBar, 'Không thể copy vào clipboard.', '#b91c1c', true);
                }
            } catch (err) {
                console.error(err);
                mod.setStatus(statusBar, 'Lỗi: ' + (err && err.message ? err.message : 'Không rõ'), '#b91c1c', true);
            }
        });
        // Copy-again behavior
        btnCopyAgain.addEventListener('click', async () => {
            const mod = require('../components/copyDienTienAI');
            const cached = btnCopyAgain.dataset.clipboardText || '';
            const statusBar = document.getElementById('dr-copy-dien-tien-status') || document.createElement('div');
            if (!cached) {
                mod.setStatus(statusBar, 'Chưa có dữ liệu để copy lại.', '#b91c1c', true);
                return;
            }
            mod.setStatus(statusBar, 'Đang copy vào clipboard...', '#0f172a', false);
            const ok = await mod.copyToClipboard(cached);
            if (ok) mod.setStatus(statusBar, 'Đã copy lại vào clipboard.', '#166534', true);
            else mod.setStatus(statusBar, 'Không thể copy vào clipboard.', '#b91c1c', true);
        });
        sidebarActions.appendChild(btnCopy);
        sidebarActions.appendChild(btnCopyAgain);
    } catch(_) {}
    // HSBAv1 button now comes from components/actionButtons.js
        leftColumn.appendChild(sidebarActions);

    // Provide sidebar context for children (ctx id + abort signal)
    window.dr_sidebar_ctx = { id: sessionId, signal: SidebarSession.getSignal() };
    const info = createPatientInfoSection(patient, quickYLenhActions);
        leftColumn.appendChild(info);
        
        // Setup phẫu thuật handlers for the info section
        setupPhauThuatHandlers(info, patient);
        
        // Right column: Checklist section
        const rightColumn = document.createElement('div');
        rightColumn.className = 'dr-sidebar-right';
        rightColumn.style.cssText = `
            flex: 1;
            min-width: 0;
        `;
        
        const checklistDiv = await createChecklistSectionAsync(patient);
        rightColumn.appendChild(checklistDiv);
        // Add HSBA Data tab into the same tabs bar
        try {
            const { addHSBATab } = require('../components/hsbaDataFetcher');
            addHSBATab(checklistDiv, patient);
        } catch (e) { console.warn('HSBA tab init failed', e); }
        
        // Add columns to container
        container.appendChild(leftColumn);
        container.appendChild(rightColumn);
        
    // Add container to sidebar plus an offline banner
    const offlineBanner = document.createElement('div');
    offlineBanner.className = 'dr-offline-banner';
    offlineBanner.textContent = 'Đang offline — thay đổi sẽ được lưu tạm và đồng bộ khi có mạng.';
    sidebar.appendChild(offlineBanner);
    // Replace loading content with actual content
    sidebar.innerHTML = '';
    sidebar.appendChild(offlineBanner);
    sidebar.appendChild(container);
        
        // Close button
        const closeBtn = ModalManager.setupCloseHandlers(sidebar, backdrop);
        sidebar.appendChild(closeBtn);
        
        // Show modal
        ModalManager.showModal(sidebar, backdrop);

        // Toggle offline banner visibility
        const toggleOffline = () => {
            try {
                const b = document.querySelector('#dr-sidebar .dr-offline-banner');
                if (!b) return;
                b.style.display = (navigator && navigator.onLine === false) ? 'block' : 'none';
            } catch(_) {}
        };
        toggleOffline();
        try {
            window.addEventListener('online', toggleOffline, { once: true });
        } catch(_) {}
    }



    function renderCards(data) {
        const sortedData = PatientDataMapper.sortPatients([...data]);
        
        document.body.innerHTML = '';

        // Create top filter/search bar
        const topBar = document.createElement('div');
        topBar.className = 'dr-top-filter-bar';
        topBar.style.cssText = `
            position: sticky; top: 0; z-index: 1000;
            display: flex; align-items: center; gap: 12px; 
            padding: 12px 16px; margin: 0 0 8px 0;
            background: #fff; border-bottom: 1px solid #e0e0e0;
        `;
        topBar.innerHTML = `
            <div class="dr-topbar-left" style="display:flex; align-items:center; gap:12px; flex:1; min-width:0;">
                <input id="dr-search-input" type="text" placeholder="Lọc BN theo tên, MABN, phòng, chẩn đoán..." 
                    style="flex:1; min-width: 220px; padding: 8px 10px; border:1px solid #ddd; border-radius:6px;">
            </div>
            <div class="dr-topbar-center" style="flex:0 0 auto; display:flex; justify-content:center; min-width:140px;">
                <span id="dr-total-compact" style="display:inline-block; text-align:center; color:#0f172a; font-weight:700; white-space:nowrap; background:#f1f5f9; border:1px solid #e2e8f0; padding:4px 10px; border-radius:9999px; min-width:110px;">0/0</span>
            </div>
            <div class="dr-topbar-right" style="flex:1; display:flex; align-items:center; justify-content:flex-end; gap:12px;">
                <label style="display:flex; align-items:center; gap:6px; white-space:nowrap;">
                    <input id="dr-filter-xuatvien" type="checkbox"> Xuất viện
                </label>
                <label style="display:flex; align-items:center; gap:6px; white-space:nowrap;">
                    <input id="dr-filter-canlamsang" type="checkbox"> Cận lâm sàng
                </label>
                <button id="dr-view-toggle" title="Đổi chế độ hiển thị" style="padding:8px 10px;border:1px solid #cbd5e1;border-radius:8px;background:#fff;cursor:pointer;white-space:nowrap;">Chế độ: <b><span id="dr-view-label"></span></b></button>
            </div>
        `;

    const container = document.createElement('div');
        // View state
        const VIEW_KEY = 'dr-card-view';
        const view = (localStorage.getItem(VIEW_KEY) || 'grid');
        const viewLabelEl = topBar.querySelector('#dr-view-label');
        const setViewLabel = () => { if (viewLabelEl) viewLabelEl.textContent = (localStorage.getItem(VIEW_KEY) || 'grid') === 'list' ? 'Danh sách' : 'Lưới'; };
        if (!localStorage.getItem(VIEW_KEY)) localStorage.setItem(VIEW_KEY, view);
        container.className = view === 'list' ? 'dr-list-container' : 'dr-card-list';
        // Safety padding in case styles load late
        container.style.paddingBottom = '90px';
        
    const renderItemGrid = (item) => createPatientCard(item);
    const { createListRow } = require('../components/listView');
    const renderItemList = (item) => createListRow(item, { onOpen: () => showSidebar(item) });
        const renderer = (localStorage.getItem('dr-card-view') || 'grid') === 'list' ? renderItemList : renderItemGrid;
        sortedData.forEach(item => {
            const card = renderer(item);
            // mark useful attributes for filtering
            if (item && item.mabn) card.setAttribute('data-mabn', item.mabn);
            if (item && item.hoten) card.setAttribute('data-name', (item.hoten || '').toLowerCase());
            if (item && item.chandoanvk) card.setAttribute('data-cd', (item.chandoanvk || '').toLowerCase());
            if (item && (item.teN_PHONG || item.teN_GIUONG)) {
                const loc = PatientDataMapper.formatRoomLocation(
                    item.teN_PHONG,
                    item.teN_GIUONG,
                    item.teN_TANG,
                    item.teN_TOANHA
                );
                card.setAttribute('data-loc', (loc || '').toLowerCase());
            }
            // compute dataset flags from today's yLenhLog
            try {
                const today = new Date();
                const todayStr = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
                const log = item && item.checklistState && Array.isArray(item.checklistState.yLenhLog) ? item.checklistState.yLenhLog : [];
                let hasXV = false, hasCLS = false;
                for (const e of log) {
                    if (!e.timestamp || !e.content) continue;
                    if (!e.timestamp.startsWith(todayStr)) continue;
                    const c = e.content.toLowerCase();
                    if (c.includes('xuất viện')) {
                        // if quick and has status, use done/active as presence
                        if (e.q === true && e.action === 'Xuất viện') {
                            if (e.status === 'active' || e.status === 'done') hasXV = true;
                        } else {
                            hasXV = true;
                        }
                    }
                    if (c.includes('cận lâm sàng')) hasCLS = true;
                }
                card.dataset.hasxv = hasXV ? '1' : '0';
                card.dataset.hascls = hasCLS ? '1' : '0';
            } catch (_) {}
            container.appendChild(card);
        });
        
    // Append top bar then container
        document.body.appendChild(topBar);
        document.body.appendChild(container);
        
    // Add bottom bar
    createBottomBar();

        // Filter logic
    const searchInput = topBar.querySelector('#dr-search-input');
    const chkXuatVien = topBar.querySelector('#dr-filter-xuatvien');
    const chkCanLamSang = topBar.querySelector('#dr-filter-canlamsang');
    const totalCompact = topBar.querySelector('#dr-total-compact');

        function applyFilter() {
            const q = (searchInput.value || '').trim().toLowerCase();
            const onlyXV = !!chkXuatVien.checked;
            const onlyCLS = !!chkCanLamSang.checked;
            let visible = 0;

            const cards = container.querySelectorAll('.dr-card, .dr-list-row');
            cards.forEach(card => {
                const txt = card.textContent.toLowerCase();
                const matchesText = q === '' || txt.includes(q) ||
                    card.getAttribute('data-mabn')?.toLowerCase().includes(q) ||
                    card.getAttribute('data-name')?.includes(q) ||
                    card.getAttribute('data-cd')?.includes(q) ||
                    card.getAttribute('data-loc')?.includes(q);
                // dataset flags prepared on card creation
                const matchesXV = !onlyXV || card.dataset.hasxv === '1' || card.classList.contains('xuatvienanimation');
                const matchesCLS = !onlyCLS || card.dataset.hascls === '1';
                const show = matchesText && matchesXV && matchesCLS;
                card.style.display = show ? '' : 'none';
                if (show) visible++;
            });

            // Update centered compact total, integrating the filter count
            if (totalCompact) {
                const hasFilter = !!(q || onlyXV || onlyCLS);
                totalCompact.textContent = hasFilter ? `Hiển thị: ${visible}/${sortedData.length}` : `${visible}/${sortedData.length}`;
                // Color accents: blue when filtered, neutral otherwise
                if (hasFilter) {
                    totalCompact.style.background = '#e3f2fd';
                    totalCompact.style.borderColor = '#bbdefb';
                    totalCompact.style.color = '#1976d2';
                } else {
                    totalCompact.style.background = '#f1f5f9';
                    totalCompact.style.borderColor = '#e2e8f0';
                    totalCompact.style.color = '#0f172a';
                }
            }
        }

    searchInput.addEventListener('input', applyFilter);
    chkXuatVien.addEventListener('change', applyFilter);
    chkCanLamSang.addEventListener('change', applyFilter);

    // Initialize view label, compact total and run first filter
    setViewLabel();
    const totalCompactInit = document.getElementById('dr-total-compact');
    if (totalCompactInit) {
        totalCompactInit.textContent = `${sortedData.length}/${sortedData.length}`;
        totalCompactInit.style.background = '#f1f5f9';
        totalCompactInit.style.borderColor = '#e2e8f0';
        totalCompactInit.style.color = '#0f172a';
    }
    applyFilter();

        // Prefill from query param ?q=
        try {
            const u = new URL(window.location.href);
            const qParam = u.searchParams.get('q');
            if (qParam) {
                searchInput.value = qParam;
                applyFilter();
            }
        } catch (_) {}

    const refreshPatientCards = function(newData) {
            const sortedNewData = PatientDataMapper.sortPatients([...newData]);
            
            // Update existing cards instead of full re-render to avoid interrupting user
            sortedNewData.forEach((item, index) => {
                const card = container.children[index];
                if (card) {
                    // Update merged diagnosis line (Chẩn đoán + CD kèm theo)
                    try {
                        const diagnosisEl = card.querySelector('.dr-diagnosis-line');
                        if (diagnosisEl) {
                            const { composeDiagnosis } = DomUpdaters;
                            const { baseText: baseCdNew, cdktText, combinedHtml } = composeDiagnosis(item);
                            diagnosisEl.dataset.baseCd = baseCdNew;
                            diagnosisEl.dataset.cdkt = cdktText || '';
                            diagnosisEl.innerHTML = `<span class="dr-label">Chẩn đoán:</span> ${combinedHtml}`;
                        }
                        // remove any legacy block if present
                        const oldCdkt = card.querySelector('.dr-cdkt-block');
                        if (oldCdkt) oldCdkt.remove();
                    } catch (_) {}
                    // Update surgery info with post-op days using shared updater
                    DomUpdaters.updateSurgeryInfo(card, item);
                    
                    // Update HXT line in the card/list row
                    DomUpdaters.updateHXT(item);
                    
                    // Update y lệnh tags if checklistState is available
                    if (item.checklistState) {
                        DomUpdaters.updateTagsAndMedsBadge(card, item);
                    }
                    
                    // Update surgery status icon
                    DomUpdaters.updateSurgeryIcon(card, item);

                    // Re-evaluate filter visibility after updates (e.g., xuatvienanimation class changes)
                    // Delay to allow DOM/class updates done elsewhere
                    setTimeout(() => {
                        applyFilter();
                    }, 0);
                }
            });
        };

        // Make functions available for global use
        if (typeof unsafeWindow !== 'undefined') {
            unsafeWindow.refreshPatientCards = refreshPatientCards;
            unsafeWindow.checkAllCelebrationAnimations = checkAllCelebrationAnimations;
        } else if (typeof this !== 'undefined') {
            this.refreshPatientCards = refreshPatientCards;
            this.checkAllCelebrationAnimations = checkAllCelebrationAnimations;
        } else {
            globalThis.refreshPatientCards = refreshPatientCards;
            globalThis.checkAllCelebrationAnimations = checkAllCelebrationAnimations;
        }

        // Wire view toggle button
        const toggleBtn = topBar.querySelector('#dr-view-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                const cur = localStorage.getItem('dr-card-view') || 'grid';
                const next = cur === 'list' ? 'grid' : 'list';
                localStorage.setItem('dr-card-view', next);
                setViewLabel();
                try { window.location.reload(); } catch(_) { }
            });
        }
    }



    function createPatientCard(item) {
        const room = item.teN_PHONG || '';
        const isWhite = PatientDataMapper.isWhiteCard(room);
        const card = document.createElement('div');
        card.className = 'dr-card' + (isWhite ? '' : ' dr-blue');
        
        // Format location using the new utility function
        const formattedLocation = PatientDataMapper.formatRoomLocation(
            item.teN_PHONG, 
            item.teN_GIUONG, 
            item.teN_TANG, 
            item.teN_TOANHA
        );

    const ptInfo = formatSurgeryInfo(item);
        
    const hxtText = (item.checklistState && item.checklistState.huongXuTri) ? String(item.checklistState.huongXuTri).trim() : '';
    const hxtHtml = hxtText ? `<div class="dr-value dr-hxt-block"><span class="dr-label"><b>HXT:</b></span> ${escapeHtml(hxtText)}</div>` : '';
    const { baseText: baseDiagnosis, cdktText, combinedHtml: combinedDiagnosis } = DomUpdaters.composeDiagnosis(item);
        card.innerHTML = `
            <h2>${item.hoten || ''} <span style="font-size:0.9em;color:#888;">${item.mabn ? ' - ' + item.mabn : ''}</span> - ${item.phai === 1 ? 'Nữ' : 'Nam'} - ${formattedLocation}</h2>
            <div class="dr-value"><span class="dr-label">Ngày sinh:</span> ${item.ngaysinh ? Utils.formatDate(item.ngaysinh) : ''} (${Utils.calculateAge(item.ngaysinh)} tuổi)</div>
            <div class="dr-value dr-diagnosis-line" data-base-cd="${baseDiagnosis.replace(/"/g,'&quot;')}" data-cdkt="${escapeHtml(cdktText).replace(/"/g,'&quot;')}"><span class="dr-label">Chẩn đoán:</span> ${combinedDiagnosis}</div>
            ${ptInfo}
            ${hxtHtml}
            ${createYLenhTags(item)}
        `;
        // mark base diagnosis for future updates
        try {
            const diagEl = card.querySelector('.dr-diagnosis-line');
            if (diagEl) {
                diagEl.dataset.baseCd = baseDiagnosis;
                diagEl.dataset.cdkt = cdktText || '';
            }
        } catch (_) {}
        if (item && item.mabn && !card.getAttribute('data-mabn')) {
            card.setAttribute('data-mabn', item.mabn);
        }
        
        // Add action buttons
        const btnGroup = createActionButtons(item);
        card.appendChild(btnGroup);
        
        // Add surgery status icon
        addSurgeryStatusIcon(card, item);
    // Show meds-done badge if applicable
    try { updateMedsDoneBadge(card, item); } catch (_) {}
        
        card.onclick = () => showSidebar(item);
        // Preload HXT from checklist state after rendering card (non-blocking)
        setTimeout(() => {
            preloadHXTForPatient(item);
        }, 0);
        
        return card;
    }

    // List view row now lives in components/listView.js

    // escapeHtml provided by utils/htmlUtils

    // Update HXT on a card when sidebar saves
    function updatePatientCardHXT(patient) { try { DomUpdaters.updateHXT(patient); } catch (_) {} }

    // Update Chẩn đoán kèm theo on a card when sidebar saves
    function updatePatientCardCDKT(patient) { try { DomUpdaters.updateCDKT(patient); } catch (_) {} }

    // Preload HXT for a patient by fetching checklist state if not present
    async function preloadHXTForPatient(item) {
        try {
            if (!item || !item.mabn) return;
            const existing = item.checklistState && typeof item.checklistState.huongXuTri === 'string' ? item.checklistState.huongXuTri.trim() : '';
            if (existing) {
                DomUpdaters.updateHXT(item);
                return;
            }
            const res = await ChecklistService.loadChecklistData(item);
            const obj = ChecklistService.findChecklistObject(res);
            if (!obj) return;
            const state = ChecklistService.parseChecklistState(obj) || {};
            const hxt = typeof state.huongXuTri === 'string' ? state.huongXuTri.trim() : '';
            if (!hxt) return;
            // Update dr_data entry
            if (window.dr_data && Array.isArray(window.dr_data)) {
                const idx = window.dr_data.findIndex(p => p.mabn === item.mabn);
                if (idx >= 0) {
                    const oldState = window.dr_data[idx].checklistState || {};
                    window.dr_data[idx].checklistState = { ...oldState, ...state };
                }
            }
            // Update card view with merged state
            const updated = { ...item, checklistState: { ...(item.checklistState || {}), ...state } };
            DomUpdaters.updateHXT(updated);
            try { DomUpdaters.updateCDKT(updated); } catch (_) {}
        } catch (e) {
            console.warn('Preload HXT failed for', item?.mabn, e);
        }
    }







    // Helper function to create action buttons
    function createActionButtons(item) {
    const { createToDieuTriButton, createHsbaButton, createCopyOneButton } = require('../components/actionButtons');
    const btnToDieuTri = createToDieuTriButton({ item, variant: 'full' });
    const btnHsba2 = createHsbaButton({ item, variant: 'full' });
    const btnCopyOne = createCopyOneButton({ item, variant: 'icon' });
        
        const btnGroup = document.createElement('div');
        btnGroup.className = 'dr-action-buttons';
    btnGroup.style.display = 'flex';
    btnGroup.style.gap = '8px';
    btnGroup.style.justifyContent = 'flex-end';
    btnGroup.style.alignItems = 'center';
    btnGroup.style.position = 'absolute';
    btnGroup.style.right = '16px';
    btnGroup.style.bottom = '12px';
        
    btnGroup.appendChild(btnCopyOne);
    btnGroup.appendChild(btnToDieuTri);
        btnGroup.appendChild(btnHsba2);
        
        return btnGroup;
    }

    // Button creators moved to components/actionButtons.js

    // Helper function to create bottom bar
    function createBottomBar() {
        const ApiService = require('../services/apiService');
        const { getSelectedKhoa } = require('../utils/khoaUtils');
        const bottomBar = document.createElement('div');
        bottomBar.className = 'dr-bottom-bar';
        bottomBar.innerHTML = `
            <div class="dr-bottom-bar-left">
                <a id="dr-settings-btn" class="dr-gear-btn" href="/?caidat" target="_blank" title="Cài đặt">
                    <i class="fas fa-cog"></i>
                </a>
                <select id="dr-khoa-select" class="dr-khoa-select" title="Chọn khoa"></select>
            </div>
            <button id="dr-btn-direct-report" class="btn btn-warning" style="font-weight:bold;">Tạo báo cáo trực</button>
        `;
        document.body.appendChild(bottomBar);
        
        // Add OTM buttons to bottom bar
        addOTMButtonsToBottomBar(bottomBar);
        
    // Bottom bar styles come from addGlobalStyles()
        
        // Setup direct report button
        setTimeout(() => {
            const btn = document.getElementById('dr-btn-direct-report');
            if (btn) btn.onclick = createDirectReportGeneration;
        }, 10);

        // Populate khoa dropdown and wire change
        (async () => {
            try {
                const select = document.getElementById('dr-khoa-select');
                if (!select) return;
                select.disabled = true;
                select.innerHTML = `<option>Đang tải khoa...</option>`;
                const list = await ApiService.fetchKhoaPhong();
                const current = String(getSelectedKhoa('551'));
                select.innerHTML = '';
                list.forEach(k => {
                    const opt = document.createElement('option');
                    opt.value = String(k.id);
                    opt.textContent = k.name || k.id;
                    if (opt.value === current) opt.selected = true;
                    select.appendChild(opt);
                });
                select.disabled = false;
                select.addEventListener('change', (e) => {
                    const val = e.target.value;
                    try { localStorage.setItem('bsnt_khoa_dashboard', String(val)); } catch(_) {}
                    // reload dashboard data by simply reloading the page or re-running init
                    window.location.reload();
                });
            } catch (e) {
                console.warn('Load khoa for bottom bar failed', e);
            }
        })();
    }

    // Bottom bar styling helper removed (centralized in dashboard.support.js)
    // Main logic
    async function initializeDashboard() {
        const data = await PatientService.loadPatientDataWithErrorHandling();
        if (data) {
            renderCards(data);
        }
    }

    // Helper function to try closing a tab using multiple methods
    function tryCloseTab(tab) {
        // Method 1: Try GM.closeTab with tab object
        if (typeof GM !== 'undefined' && GM.closeTab) {
            try {
                GM.closeTab(tab);
                console.log('Closed OTM tab using GM.closeTab(tab)');
                return false; // Remove from array
            } catch (gmError) {
                console.log('GM.closeTab(tab) failed, trying alternatives:', gmError);
            }
        }

        // Method 2: Try tab.close() if available
        if (tab.close && typeof tab.close === 'function') {
            try {
                tab.close();
                console.log('Closed OTM tab using tab.close()');
                return false; // Remove from array
            } catch (closeError) {
                console.log('tab.close() failed:', closeError);
            }
        }

        // Method 3: Try window.close() on the tab
        if (tab.window && tab.window.close) {
            try {
                tab.window.close();
                console.log('Closed OTM tab using tab.window.close()');
                return false; // Remove from array
            } catch (windowError) {
                console.log('tab.window.close() failed:', windowError);
            }
        }

        // Method 4: For GM tabs, try posting a message to close
        if (tab.postMessage) {
            try {
                tab.postMessage({ type: 'close-otm-tab' }, '*');
                console.log('Sent close message to OTM tab');
                return false; // Remove from array
            } catch (msgError) {
                console.log('postMessage failed:', msgError);
            }
        }

        console.log('All close methods failed for OTM tab');
        return true; // Keep in array
    }

    // Handle OTM close tab messages
    function handleOTMCloseTab(name, oldValue, newValue, remote) {
        try {
            const data = typeof newValue === 'string' ? JSON.parse(newValue) : newValue;
            console.log('[OTM Close Tab] Received close request:', data.data);
            console.log('[OTM Close Tab] Current openTabs:', window.openTabs);
            console.log('[OTM Close Tab] openTabs length:', window.openTabs.length);
            
            // Close OTM tabs from stored references
            if (window.openTabs && window.openTabs.length > 0) {
                window.openTabs = window.openTabs.filter(tabInfo => {
                    if (tabInfo && tabInfo.hostname === 'otm.tahospital.vn') {
                        try {
                            const tab = tabInfo.tab;
                            
                            // Handle case where tab is a Promise (from GM.openInTab)
                            if (tab && typeof tab.then === 'function') {
                                console.log('Tab is a Promise, waiting for resolution...');
                                tab.then(actualTab => {
                                    if (actualTab && !actualTab.closed) {
                                        tryCloseTab(actualTab);
                                    }
                                }).catch(error => {
                                    console.error('Error resolving tab Promise:', error);
                                });
                                return false; // Remove from array since we're handling it asynchronously
                            }
                            
                            if (tab && !tab.closed) {
                                return tryCloseTab(tab);
                            } else {
                                console.log('Tab already closed or invalid');
                                return false; // Remove from array
                            }
                        } catch (error) {
                            console.error('Error closing OTM tab:', error);
                            return true; // Keep in array
                        }
                    }
                    return true; // Keep in array
                });
            } else {
                console.log('No OTM tabs found to close');
            }
        } catch (error) {
            console.error('Error handling OTM close tab:', error);
        }
    }

    // Add GM value change listeners for OTM data
    if (typeof GM !== 'undefined' && GM.addValueChangeListener) {
        GM.addValueChangeListener('otm_progress', handleOTMProgress);
        GM.addValueChangeListener('otm_success', handleOTMSuccess);
        GM.addValueChangeListener('otm_error', handleOTMError);
        GM.addValueChangeListener('otm_close_tab', handleOTMCloseTab);
    } else {
        // Fallback to localStorage polling for non-Greasemonkey environments
        setInterval(() => {
            const progressData = localStorage.getItem('otm_progress');
            const successData = localStorage.getItem('otm_success');
            const errorData = localStorage.getItem('otm_error');
            const closeTabData = localStorage.getItem('otm_close_tab');

            if (progressData) {
                try {
                    const parsed = JSON.parse(progressData);
                    handleOTMProgress('otm_progress', null, parsed, null);
                    localStorage.removeItem('otm_progress');
                } catch (e) {
                    console.error('Error parsing OTM progress data:', e);
                }
            }

            if (successData) {
                try {
                    const parsed = JSON.parse(successData);
                    handleOTMSuccess('otm_success', null, parsed, null);
                    localStorage.removeItem('otm_success');
                } catch (e) {
                    console.error('Error parsing OTM success data:', e);
                }
            }

            if (errorData) {
                try {
                    const parsed = JSON.parse(errorData);
                    handleOTMError('otm_error', null, parsed, null);
                    localStorage.removeItem('otm_error');
                } catch (e) {
                    console.error('Error parsing OTM error data:', e);
                }
            }

            if (closeTabData) {
                try {
                    const parsed = JSON.parse(closeTabData);
                    handleOTMCloseTab('otm_close_tab', null, parsed, null);
                    localStorage.removeItem('otm_close_tab');
                } catch (e) {
                    console.error('Error parsing OTM close tab data:', e);
                }
            }
        }, 1000);
    }

    // Start dashboard initialization
    initializeDashboard();
}

// Helpers to integrate standardized OTM surgery data
function dr_normalizePid(val) {
    if (val == null) return '';
    const s = String(val).trim();
    const digits = s.replace(/\D+/g, '');
    return digits.replace(/^0+/, '');
}

function dr_formatVNDateTime(date) {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    const HH = String(date.getHours()).padStart(2, '0');
    const MM = String(date.getMinutes()).padStart(2, '0');
    return { date: `${dd}/${mm}/${yyyy}`, time: `${HH}:${MM}` };
}

function dr_otmToLogEntry(otmItem) {
    try {
        const startIso = otmItem && otmItem.start;
        if (!startIso) return null;
        const d = new Date(startIso);
        if (isNaN(d.getTime())) return null;
        const { date, time } = dr_formatVNDateTime(d);
        const method = (otmItem.surgerymethod || '').trim();
        // Collect doctors from userexec + userassistant
        const names = [];
        const pushNames = (arr) => {
            if (Array.isArray(arr)) {
                for (const u of arr) {
                    const n = (u && u.fullname ? String(u.fullname) : '').trim();
                    if (n && !names.includes(n)) names.push(n);
                }
            }
        };
        pushNames(otmItem.userexec);
        pushNames(otmItem.userassistant);
        const doctors = names.join(', ');
        return { date, time, method, doctors, id: `otm-${startIso}` };
    } catch (_) { return null; }
}

function dr_integrateOTMSurgeryData(otmList) {
    const res = { updatedPatients: 0, addedLogs: 0, updated: [] };
    if (!Array.isArray(otmList) || !Array.isArray(window.dr_data)) return res;
    // Build map pid -> log entries
    const map = new Map();
    for (const it of otmList) {
        const pid = dr_normalizePid(it && it.customer && it.customer.pid);
        if (!pid) continue;
        const entry = dr_otmToLogEntry(it);
        if (!entry) continue;
        if (!map.has(pid)) map.set(pid, []);
        map.get(pid).push(entry);
    }
    if (map.size === 0) return res;

    // Attach and merge to in-memory patient data
    for (const p of window.dr_data) {
        const mabnNorm = dr_normalizePid(p && p.mabn);
        if (!mabnNorm) continue;
        const entries = map.get(mabnNorm);
        if (!entries || entries.length === 0) continue;

        // Keep original for sidebar merge
        p._otmPhauThuatLog = entries.slice();

        // Merge into patient.checklistState for UI display (append-only, no overwrite)
        if (!p.checklistState) p.checklistState = {};
        if (!Array.isArray(p.checklistState.phauThuatLog)) p.checklistState.phauThuatLog = [];
        const keyOf = (e) => `${e.date}|${e.time}|${(e.method||'').trim().toLowerCase()}`;
        const existingKeys = new Set(p.checklistState.phauThuatLog.map(keyOf));
        let added = 0;
        for (const e of entries) {
            const k = keyOf(e);
            if (!existingKeys.has(k)) {
                p.checklistState.phauThuatLog.push({ ...e });
                existingKeys.add(k);
                added++;
            }
        }
        if (added > 0) {
            res.updatedPatients++;
            res.addedLogs += added;
            res.updated.push({ patient: p, added });
            // Sort newest first
            const parseDDMMYYYY = (s) => { const [d,m,y] = String(s||'').split('/').map(n=>parseInt(n,10)); return new Date(y||1970,(m||1)-1,d||1); };
            const toTs = (e) => { const dt = parseDDMMYYYY(e.date); const [hh,mm] = String(e.time||'00:00').split(':').map(n=>parseInt(n,10)||0); dt.setHours(hh, mm, 0, 0); return dt.getTime(); };
            p.checklistState.phauThuatLog.sort((a,b) => toTs(b)-toTs(a));
            // Also reflect latest to phauThuatInfo for formatSurgeryInfo compatibility
            const latest = p.checklistState.phauThuatLog[0];
            if (latest) {
                p.phauThuatInfo = { date: latest.date, time: latest.time, method: latest.method, doctors: latest.doctors, ngayPhauThuat: latest.date, gioPhauThuat: latest.time, pppt: latest.method };
            }
            // Update card/list row if present
            try {
                const DomUpdaters = require('../utils/domUpdaters');
                const el = DomUpdaters.findPatientElement(p.mabn);
                if (el) {
                    DomUpdaters.updateSurgeryInfo(el, p);
                    DomUpdaters.updateSurgeryIcon(el, p);
                }
            } catch (_) {}
        }
    }
    return res;
}

async function dr_fetchChecklistObjForPatient(patient) {
    try {
        const res = await ChecklistService.loadChecklistData(patient, { forceRefresh: true });
        let obj = ChecklistService.findChecklistObject(res);
        if (!obj) {
            const created = await ChecklistService.createNewChecklist(patient);
            if (created) {
                const res2 = await ChecklistService.loadChecklistData(patient, { forceRefresh: true });
                obj = ChecklistService.findChecklistObject(res2);
            }
        }
        return obj || null;
    } catch (_) { return null; }
}

async function dr_persistMergedOTMSurgeries(updatedEntries, { concurrency = 2 } = {}) {
    if (!Array.isArray(updatedEntries) || updatedEntries.length === 0) return { saved: 0, queued: 0, failed: 0 };
    const queue = updatedEntries.slice();
    let saved = 0, queued = 0, failed = 0;

    const worker = async () => {
        while (queue.length) {
            const entry = queue.shift();
            const p = entry && entry.patient;
            if (!p) { failed++; continue; }
            try {
                const checklistObj = await dr_fetchChecklistObjForPatient(p);
                if (!checklistObj) { failed++; continue; }
                // Merge server state with current in-memory state (append-only)
                const serverState = ChecklistService.parseChecklistState(checklistObj) || {};
                const ensureArr = (arr) => Array.isArray(arr) ? arr : [];
                const merged = ensureArr(serverState.phauThuatLog).slice();
                const fromMem = ensureArr(p.checklistState && p.checklistState.phauThuatLog);
                const keyOf = (e) => `${e.date}|${e.time}|${(e.method||'').trim().toLowerCase()}`;
                const existing = new Set(merged.map(keyOf));
                for (const e of fromMem) {
                    const k = keyOf(e);
                    if (!existing.has(k)) { merged.push({ ...e }); existing.add(k); }
                }
                // Sort newest first
                const parseDDMMYYYY = (s) => { const [d,m,y] = String(s||'').split('/').map(n=>parseInt(n,10)); return new Date(y||1970,(m||1)-1,d||1); };
                const toTs = (e) => { const dt = parseDDMMYYYY(e.date); const [hh,mm] = String(e.time||'00:00').split(':').map(n=>parseInt(n,10)||0); dt.setHours(hh, mm, 0, 0); return dt.getTime(); };
                merged.sort((a,b) => toTs(b)-toTs(a));

                const newState = { ...(serverState || {}), phauThuatLog: merged };
                const r = await ChecklistService.updateChecklistState(checklistObj, newState, { enqueueOnOffline: true });
                if (r && (r.ok || r.queued)) {
                    if (r.queued) queued++; else saved++;
                } else {
                    failed++;
                }
            } catch (_) { failed++; }
        }
    };

    const workers = Array.from({ length: Math.max(1, Math.min(6, concurrency)) }, () => worker());
    await Promise.all(workers);
    return { saved, queued, failed };
}

// Handle OTM progress messages
function handleOTMProgress(name, oldValue, newValue, remote) {
    try {
        const data = typeof newValue === 'string' ? JSON.parse(newValue) : newValue;
        showToast(`🔄 ${data.data.message}`, 'info', 3000);
        console.log('[OTM Progress]', data.data.step, data.data.message);
    } catch (error) {
        console.error('Error handling OTM progress:', error);
    }
}

// Handle OTM success messages
function handleOTMSuccess(name, oldValue, newValue, remote) {
    try {
        const data = typeof newValue === 'string' ? JSON.parse(newValue) : newValue;
        showToast(`✅ ${data.data.count} ca mổ đã được tải về!`, 'success', 5000);
        console.log('[OTM Success]', data.data);

        // Log full dataset once (no per-patient logs)
        if (data.data.surgeryData && data.data.surgeryData.length > 0) {
            console.log('=== SURGERY DATA RECEIVED (FULL) ===', data.data.surgeryData);
            // Merge into in-memory patients and update UI
            const mergeRes = dr_integrateOTMSurgeryData(data.data.surgeryData);
            const { updatedPatients, addedLogs } = mergeRes;
            if (updatedPatients > 0) {
                try { showToast(`🧩 Đã cập nhật PT cho ${updatedPatients} BN (${addedLogs} mục).`, 'success', 4000); } catch (_) {}
                // Persist to server in background (append-only)
                (async () => {
                    const res = await dr_persistMergedOTMSurgeries(mergeRes.updated, { concurrency: 2 });
                    if ((res.saved + res.queued) > 0) {
                        try { showToast(`💾 Lưu ${res.saved} | Hàng đợi ${res.queued} | Lỗi ${res.failed}`, 'info', 4000); } catch (_) {}
                    }
                })();
            }
        }
    } catch (error) {
        console.error('Error handling OTM success:', error);
    }
}

// Handle OTM error messages
function handleOTMError(name, oldValue, newValue, remote) {
    try {
        const data = typeof newValue === 'string' ? JSON.parse(newValue) : newValue;
        showToast(`❌ ${data.data.message}`, 'error', 5000);
        console.error('[OTM Error]', data.data);
    } catch (error) {
        console.error('Error handling OTM error:', error);
    }
}

// OTM buttons integration
function addOTMButtonsToBottomBar(bottomBar) {
    const bottomBarLeft = bottomBar.querySelector('.dr-bottom-bar-left');
    if (!bottomBarLeft) return;

    // Date range button (integrated today functionality)
    const dateBtn = document.createElement('button');
    dateBtn.id = 'dr-otm-date-btn';
    dateBtn.className = 'dr-btn dr-otm-btn';
    dateBtn.textContent = 'Mổ theo ngày';
    dateBtn.title = 'Chọn khoảng thời gian để lấy dữ liệu mổ từ OTM';
    dateBtn.addEventListener('click', () => handleOTMDateClick());

    bottomBarLeft.appendChild(dateBtn);
    console.log('OTM button added to dashboard');

    function handleOTMDateClick() {
        const DialogManager = require('../components/dialogManager');
        const dialog = DialogManager.createDialog('otm-date-dialog');
        
        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0];
        
        dialog.inner.innerHTML = `
            <h3>Chọn khoảng thời gian</h3>
            <div style="margin: 10px 0;">
                <div style="margin-bottom: 10px;">
                    <label for="otm-start-date">Ngày bắt đầu:</label>
                    <input type="date" id="otm-start-date" style="margin-left: 10px;" value="${today}">
                </div>
                <div>
                    <label for="otm-end-date">Ngày kết thúc:</label>
                    <input type="date" id="otm-end-date" style="margin-left: 10px;" value="${today}">
                </div>
            </div>
        `;

        const actionButtons = DialogManager.createActionButtons([
            {
                id: 'otm-fetch-btn',
                className: 'dr-btn-primary',
                text: 'Lấy dữ liệu',
                onclick: () => {
                    const startDateInput = document.getElementById('otm-start-date');
                    const endDateInput = document.getElementById('otm-end-date');
                    if (startDateInput && startDateInput.value && endDateInput && endDateInput.value) {
                        openOTMTab(startDateInput.value, endDateInput.value);
                        dialog.close();
                    } else {
                        alert('Vui lòng chọn ngày bắt đầu và ngày kết thúc');
                    }
                }
            },
            {
                id: 'otm-cancel-btn',
                className: 'dr-btn-secondary',
                text: 'Hủy',
                onclick: () => dialog.close()
            }
        ]);

        dialog.inner.appendChild(actionButtons);
        dialog.show();
    }

    function openOTMTab(fromDate, toDate) {
        const url = `https://otm.tahospital.vn/?otm-fetch=${encodeURIComponent(JSON.stringify({ fromDate, toDate }))}`;
        console.log('[OTM Open Tab] Opening tab with URL:', url);
        console.log('[OTM Open Tab] Current openTabs before:', window.openTabs);

        if (typeof GM !== 'undefined' && GM.openInTab) {
            const tabPromise = GM.openInTab(url, {
                active: false,
                insert: true,
                setParent: true
            });
            
            // Handle the Promise returned by GM.openInTab
            if (tabPromise && typeof tabPromise.then === 'function') {
                tabPromise.then(tab => {
                    if (tab) {
                        window.openTabs.push({
                            tab: tab,
                            url: url,
                            openedAt: Date.now(),
                            hostname: 'otm.tahospital.vn'
                        });
                        console.log('[OTM Open Tab] Tab added to openTabs. New length:', window.openTabs.length);
                    } else {
                        console.log('[OTM Open Tab] GM.openInTab resolved to null/undefined');
                    }
                }).catch(error => {
                    console.error('[OTM Open Tab] Error opening tab:', error);
                });
            } else if (tabPromise) {
                // Fallback if it's not a Promise (older GM versions)
                window.openTabs.push({
                    tab: tabPromise,
                    url: url,
                    openedAt: Date.now(),
                    hostname: 'otm.tahospital.vn'
                });
                console.log('[OTM Open Tab] Tab added to openTabs. New length:', window.openTabs.length);
            } else {
                console.log('[OTM Open Tab] GM.openInTab returned null/undefined');
            }
        } else {
            // Fallback for non-Greasemonkey environments
            const tab = window.open(url, '_blank');
            if (tab) {
                window.openTabs.push({
                    tab: tab,
                    url: url,
                    openedAt: Date.now(),
                    hostname: 'otm.tahospital.vn'
                });
                console.log('[OTM Open Tab] Fallback tab added to openTabs. New length:', window.openTabs.length);
            } else {
                console.log('[OTM Open Tab] window.open returned null/undefined');
            }
        }
    }
}

module.exports = {
    showDashboardBenhNhanIfNeeded
};

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../BS_CAI_DAT_GIAO_DIEN":1,"../components/actionButtons":4,"../components/copyDienTienAI":6,"../components/dialogManager":7,"../components/hsbaDataFetcher":8,"../components/listView":10,"../components/loginHandler":11,"../components/modalManager":12,"../components/patientInfoSection":13,"../components/phauThuatHandlers":14,"../components/sidebarSession":15,"../services/apiService":26,"../services/checklistService":27,"../services/patientService":29,"../utils":35,"../utils/checklistUtils":36,"../utils/domUpdaters":38,"../utils/htmlUtils":40,"../utils/khoaUtils":41,"../utils/patientDataMapper":42,"../utils/surgeryUtils":43,"../utils/tagUtils":44,"../utils/uiUtils":45,"./page.dashboard.support":21}],21:[function(require,module,exports){
// dashboard.support.js - Refactored with modular architecture

const ReportService = require('../services/reportService');
const ApiService = require('../services/apiService');
const DialogManager = require('../components/dialogManager');
const DateUtils = require('../utils/dateUtils');

/**
 * Create direct report generation dialog
 */
async function createDirectReportGeneration() {
    const data = window.dr_data || [];
    
    // Create dialog
    const { dialog, inner } = DialogManager.createDialog('dr-direct-report-dialog', { maxWidth: '1100px', maxHeight: '88vh' });
    // Layout: flex column with a scrollable content area and a fixed (in-modal) footer
    try {
        inner.style.display = 'flex';
        inner.style.flexDirection = 'column';
        inner.style.overflowY = 'hidden';
        inner.style.paddingBottom = '0px';
    } catch (_) {}
    
    try {
        // Show loading state
        inner.innerHTML = `
            <div style="font-size:1.1em;margin-bottom:12px"><b>BÁO CÁO TRỰC</b></div>
            <div style="text-align:center;padding:20px;">
                <div>Đang tải dữ liệu báo cáo...</div>
            </div>
        `;
        
    // Load checklist state for all patients (already sorted)
    const { sortedPatients, states } = await ReportService.getBatchChecklistStates(data);
        
    // Generate report content (all patients)
    const htmlContent = ReportService.generateHTMLReport(sortedPatients, states);
    const textReport = ReportService.generateTextReport(sortedPatients, states);

    // Helpers to filter patients by admission date (ngayvv) using preloaded data only
    function parseAdmitDateToMidnight(dateStr) {
        if (!dateStr) return null;
        try {
            const us = DateUtils.convertToUSFormat(String(dateStr));
            const d = new Date(us);
            if (isNaN(d.getTime())) return null;
            d.setHours(0, 0, 0, 0);
            return d;
        } catch (_) { return null; }
    }

    function filterByAdmitDay(patientsArr, statesArr, targetDate) {
        const target = new Date(targetDate);
        target.setHours(0,0,0,0);
        const zipped = patientsArr.map((p, i) => ({ p, s: statesArr[i] }));
        const filtered = zipped.filter(({ p }) => {
            const d = parseAdmitDateToMidnight(p && p.ngayvv);
            return d && d.getTime() === target.getTime();
        });
        return {
            patients: filtered.map(z => z.p),
            states: filtered.map(z => z.s)
        };
    }

    const today = new Date(); today.setHours(0,0,0,0);
    const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
    const { patients: todayPatients, states: todayStates } = filterByAdmitDay(sortedPatients, states, today);
    const { patients: yesterdayPatients, states: yesterdayStates } = filterByAdmitDay(sortedPatients, states, yesterday);
    const htmlToday = ReportService.generateHTMLReport(todayPatients, todayStates);
    const textToday = ReportService.generateTextReport(todayPatients, todayStates);
    const htmlYesterday = ReportService.generateHTMLReport(yesterdayPatients, yesterdayStates);
    const textYesterday = ReportService.generateTextReport(yesterdayPatients, yesterdayStates);

    // Filter by surgery date (latest surgery in state.phauThuatLog[0])
    function filterBySurgeryDay(patientsArr, statesArr, targetDate) {
        const target = new Date(targetDate); target.setHours(0,0,0,0);
        const zipped = patientsArr.map((p, i) => ({ p, s: statesArr[i] }));
        const filtered = zipped.filter(({ s }) => {
            if (!s || !Array.isArray(s.phauThuatLog) || s.phauThuatLog.length === 0) return false;
            const dStr = s.phauThuatLog[0] && s.phauThuatLog[0].date;
            const d = parseAdmitDateToMidnight(dStr);
            return d && d.getTime() === target.getTime();
        });
        return {
            patients: filtered.map(z => z.p),
            states: filtered.map(z => z.s)
        };
    }

    const { patients: ptTodayPatients, states: ptTodayStates } = filterBySurgeryDay(sortedPatients, states, today);
    const { patients: ptYesterdayPatients, states: ptYesterdayStates } = filterBySurgeryDay(sortedPatients, states, yesterday);
    const htmlPtToday = ReportService.generateHTMLReport(ptTodayPatients, ptTodayStates);
    const textPtToday = ReportService.generateTextReport(ptTodayPatients, ptTodayStates);
    const htmlPtYesterday = ReportService.generateHTMLReport(ptYesterdayPatients, ptYesterdayStates);
    const textPtYesterday = ReportService.generateTextReport(ptYesterdayPatients, ptYesterdayStates);
        
        // Create action buttons (copy set only)
        const copyButtons = DialogManager.createActionButtons([
            {
                id: 'dr-copy-direct-report',
                className: 'btn btn-primary',
                text: 'Copy bệnh ở khoa',
                onclick: () => copyReportToClipboardRich(htmlContent, textReport)
            },
            {
                id: 'dr-copy-direct-report-yesterday',
                className: 'btn btn-secondary',
                text: 'Copy bệnh mới hôm qua',
                onclick: () => {
                    if (!yesterdayPatients || yesterdayPatients.length === 0) {
                        try { DialogManager.showToast('Không có bệnh nhân mới hôm qua.'); } catch (_) {}
                        return;
                    }
                    copyReportToClipboardRich(htmlYesterday, textYesterday);
                }
            },
            {
                id: 'dr-copy-direct-report-today',
                className: 'btn btn-secondary',
                text: 'Copy bệnh mới hôm nay',
                onclick: () => {
                    if (!todayPatients || todayPatients.length === 0) {
                        try { DialogManager.showToast('Không có bệnh nhân mới hôm nay.'); } catch (_) {}
                        return;
                    }
                    copyReportToClipboardRich(htmlToday, textToday);
                }
            },
            {
                id: 'dr-copy-direct-report-pt-yesterday',
                className: 'btn btn-secondary',
                text: 'Copy bệnh PT hôm qua',
                onclick: () => {
                    if (!ptYesterdayPatients || ptYesterdayPatients.length === 0) {
                        try { DialogManager.showToast('Không có bệnh nhân PT hôm qua.'); } catch (_) {}
                        return;
                    }
                    copyReportToClipboardRich(htmlPtYesterday, textPtYesterday);
                }
            },
            {
                id: 'dr-copy-direct-report-pt-today',
                className: 'btn btn-secondary',
                text: 'Copy bệnh PT hôm nay',
                onclick: () => {
                    if (!ptTodayPatients || ptTodayPatients.length === 0) {
                        try { DialogManager.showToast('Không có bệnh nhân PT hôm nay.'); } catch (_) {}
                        return;
                    }
                    copyReportToClipboardRich(htmlPtToday, textPtToday);
                }
            }
        ]);
        
        // Update dialog content: a scrollable content area
        inner.innerHTML = `<div id="dr-report-content" style="flex:1; overflow:auto;">${htmlContent}</div>`;
        // Build footer bar fixed within modal (not sticky)
        const footerBar = document.createElement('div');
        footerBar.style.cssText = [
            'background:#fff',
            'padding:10px 0 0',
            'margin-top:8px',
            'border-top:1px solid #eee',
            'box-shadow:0 -2px 8px rgba(0,0,0,0.05)'
        ].join(';');
        // Arrange copy buttons into a 2x3 grid as requested
        try {
            const grid = copyButtons;
            grid.style.display = 'grid';
            grid.style.gridTemplateColumns = '1fr 1fr 1fr';
            grid.style.gridTemplateRows = 'auto auto';
            grid.style.gap = '12px';
            grid.style.justifyContent = 'stretch';
            grid.style.alignItems = 'stretch';

            const btnAll = grid.querySelector('#dr-copy-direct-report');
            const btnNewY = grid.querySelector('#dr-copy-direct-report-yesterday');
            const btnNewT = grid.querySelector('#dr-copy-direct-report-today');
            const btnPtY = grid.querySelector('#dr-copy-direct-report-pt-yesterday');
            const btnPtT = grid.querySelector('#dr-copy-direct-report-pt-today');
            if (btnAll) {
                btnAll.style.gridColumn = '1';
                btnAll.style.gridRow = '1 / span 2';
                btnAll.style.height = '100%';
                btnAll.style.width = '100%';
            }
            if (btnNewY) { btnNewY.style.gridColumn = '2'; btnNewY.style.gridRow = '1'; btnNewY.style.width = '100%'; }
            if (btnNewT) { btnNewT.style.gridColumn = '2'; btnNewT.style.gridRow = '2'; btnNewT.style.width = '100%'; }
            if (btnPtY) { btnPtY.style.gridColumn = '3'; btnPtY.style.gridRow = '1'; btnPtY.style.width = '100%'; }
            if (btnPtT) { btnPtT.style.gridColumn = '3'; btnPtT.style.gridRow = '2'; btnPtT.style.width = '100%'; }
        } catch (_) {}

        if (copyButtons && copyButtons.style) copyButtons.style.marginTop = '0';
        footerBar.appendChild(copyButtons);

        // Add a separate right-aligned close button row
        const closeRow = document.createElement('div');
        closeRow.style.cssText = 'display:flex;justify-content:flex-end;margin-top:8px;';
        const closeBtnWrap = DialogManager.createActionButtons([
            {
                id: 'dr-close-direct-report',
                className: 'btn btn-secondary',
                text: 'Đóng',
                onclick: () => dialog.remove()
            }
        ]);
        // Flatten wrapper styles
        if (closeBtnWrap && closeBtnWrap.style) {
            closeBtnWrap.style.marginTop = '0';
        }
        closeRow.appendChild(closeBtnWrap);
        footerBar.appendChild(closeRow);
        inner.appendChild(footerBar);
        
    } catch (error) {
        console.error('Error generating report:', error);
        inner.innerHTML = `
            <div style="font-size:1.1em;margin-bottom:12px"><b>BÁO CÁO TRỰC</b></div>
            <div style="color:red;text-align:center;padding:20px;">
                Có lỗi xảy ra khi tạo báo cáo. Vui lòng thử lại.
            </div>
            ${DialogManager.createActionButtons([{
                id: 'dr-close-direct-report',
                className: 'btn btn-secondary', 
                text: 'Đóng',
                onclick: () => dialog.remove()
            }]).outerHTML}
        `;
    }
}


/**
 * Copy rich HTML (with plain text fallback) to clipboard for better pasting into Google Docs
 */
async function copyReportToClipboardRich(html, textFallback) {
    try {
        if (navigator.clipboard && window.ClipboardItem) {
            const blobHTML = new Blob([html], { type: 'text/html' });
            const blobText = new Blob([textFallback || ''], { type: 'text/plain' });
            const data = new ClipboardItem({
                'text/html': blobHTML,
                'text/plain': blobText
            });
            await navigator.clipboard.write([data]);
        } else {
            // Fallback: inject a hidden contenteditable, select, execCommand
            const div = document.createElement('div');
            div.contentEditable = 'true';
            div.style.position = 'fixed';
            div.style.left = '-9999px';
            div.style.top = '0';
            div.innerHTML = html;
            document.body.appendChild(div);
            const range = document.createRange();
            range.selectNodeContents(div);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
            document.execCommand('copy');
            document.body.removeChild(div);
        }
        DialogManager.showToast('Đã copy báo cáo (định dạng) vào clipboard!');
    } catch (error) {
        console.error('Failed to copy rich report:', error);
        // Last resort fallback
        try {
            await navigator.clipboard.writeText(textFallback || '');
            DialogManager.showToast('Đã copy báo cáo dạng text (fallback).');
        } catch (e2) {
            DialogManager.showToast('Lỗi khi copy báo cáo', { 
                background: '#d32f2f',
                duration: 3000 
            });
        }
    }
}

/**
 * Fetch patient data from ToDieuTri API
 */
async function fetchToDieuTriData() {
    return ApiService.fetchToDieuTriData();
}

/**
 * Add global styles for the dashboard
 */
function addGlobalStyles() {
    if (document.getElementById('dr-global-style')) return;
    
    const style = document.createElement('style');
    style.id = 'dr-global-style';
    style.textContent = `
        /* Sidebar action buttons polish */
        .dr-sidebar-actions { gap: 10px !important; padding: 6px 0 4px 0; }
        .dr-sidebar-actions .dr-detail-btn {
            display: inline-flex; align-items: center; gap: 8px;
            padding: 10px 14px; border-radius: 12px; border: 1px solid #cbd5e1;
            background: #ffffff; color: #0f172a; font-weight: 600; line-height: 1;
            box-shadow: 0 1px 2px rgba(15, 23, 42, 0.05); transition: all 0.18s ease;
        }
        .dr-sidebar-actions .dr-detail-btn svg { width: 18px; height: 18px; }
        .dr-sidebar-actions .dr-detail-btn img { width: 18px; height: 18px; object-fit: contain; display: block; }
        .dr-sidebar-actions .dr-detail-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 10px rgba(15, 23, 42, 0.12); border-color: #94a3b8; }
        .dr-sidebar-actions .dr-detail-btn:active { transform: translateY(0); box-shadow: 0 2px 6px rgba(15, 23, 42, 0.10); }
        .dr-sidebar-actions .dr-detail-btn:focus-visible { outline: none; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.35); }
        .dr-sidebar-actions .dr-detail-btn:first-child { background: linear-gradient(180deg, #1e88e5, #1976d2); color: #fff; border-color: #1976d2; }
        .dr-sidebar-actions .dr-detail-btn:first-child:hover { filter: brightness(1.03); box-shadow: 0 6px 14px rgba(25, 118, 210, 0.25); }
        .dr-sidebar-actions .dr-detail-btn:last-child { background: #ffffff; color: #0f172a; border-color: #cbd5e1; }
        .dr-sidebar-actions .dr-detail-btn:last-child:hover { background: #f8fafc; }

        /* Quick y lệnh actions */
        .quick-ylenh-actions { display:flex; flex-wrap:wrap; gap:8px; margin:10px 0; padding:10px; background:#f8f9fa; border-radius:8px; border:1px solid #e9ecef; }
        .quick-ylenh-btn { display:flex; align-items:center; gap:6px; padding:8px 12px; border:none; border-radius:6px; background:#fff; color:#333; font-size:12px; font-weight:500; cursor:pointer; transition:all 0.2s ease; border:2px solid transparent; white-space:nowrap; position:relative; }
        .quick-ylenh-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15); border-color: currentColor; }
        .quick-ylenh-btn:active { transform: translateY(0); box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); }
        .quick-ylenh-btn.active { border: 3px solid #d32f2f !important; background-color: #ffebee; box-shadow: 0 0 10px rgba(211, 47, 47, 0.3); }
        .quick-ylenh-btn.active::after { content: '⏳'; position:absolute; top:-6px; right:-6px; background:#1d4ed8; color:#fff; width:18px; height:18px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:12px; }
        .quick-ylenh-btn.done { border: 3px solid #2e7d32 !important; background-color: #e8f5e9; color: #1b5e20 !important; box-shadow: 0 0 10px rgba(27, 94, 32, 0.2); position: relative; }
        .quick-ylenh-btn.done::after { content: '✔'; position:absolute; top:-6px; right:-6px; background:#2e7d32; color:#fff; width:18px; height:18px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:12px; }
        .xv-time-editor { display:flex; align-items:center; gap:8px; padding:8px 12px; margin:6px 0 0 0; background:#f1f5f9; border:1px dashed #cbd5e1; border-radius:8px; width:fit-content; }
        .xv-time-editor .xv-label { color:#0f172a; font-weight:600; }
        .xv-time-editor .xv-time { padding:4px 6px; border:1px solid #cbd5e1; border-radius:6px; }
        .xv-time-editor .xv-saved { color:#16a34a; font-weight:600; }

        /* Tags (generic) */
        .ylenh-tags { display:flex; flex-wrap:wrap; gap:4px; margin:8px 0 4px 0; overflow-wrap:anywhere; word-break:break-word; }
        .ylenh-tag { display:inline-flex; align-items:center; gap:4px; padding:4px 10px; background-color: rgba(76, 175, 80, 0.1); color:#2e7d32; border:1px solid rgba(76, 175, 80, 0.3); border-radius:12px; font-size:12px; font-weight:600; line-height:1.2; white-space:normal; overflow-wrap:anywhere; word-break:break-word; max-width:100%; flex-wrap:wrap; }
        .ylenh-tag.discharge { background: linear-gradient(45deg, #4caf50, #66bb6a) !important; color: #fff !important; border: 2px solid #4caf50 !important; font-weight:700 !important; font-size:12px; text-shadow: 0 1px 1px rgba(0,0,0,0.25); }
        .ylenh-tag.completed { background-color: rgba(76, 175, 80, 0.2); color: #1b5e20; border-color: rgba(76, 175, 80, 0.5); }
        .ylenh-tag.state-active { background-color: rgba(37, 99, 235, 0.10); color:#1d4ed8; border-color: rgba(37, 99, 235, 0.35); font-weight:700; }
        .ylenh-tag.state-done { background-color: rgba(34, 197, 94, 0.12); color:#15803d; border-color: rgba(34, 197, 94, 0.45); font-weight:600; }
        .ylenh-tag.discharge.state-active { font-size:12.5px; font-weight:700; color:#ffffff !important; text-shadow: 0 1px 1px rgba(0,0,0,0.35); border-color:#2e7d32 !important; padding:4px 9px; }

        /* Card meds-done badge */
        .dr-card .dr-badge-meds-done { position:absolute; top:-10px; right:10px; background:#16a34a; color:#fff; font-weight:800; font-size:11px; border-radius:999px; padding:4px 8px; box-shadow:0 2px 6px rgba(22,163,74,0.35); display:inline-flex; align-items:center; gap:6px; z-index:2; }
        .dr-card .dr-badge-meds-done::before { content:'✔'; background: rgba(255,255,255,0.2); width:16px; height:16px; display:inline-flex; align-items:center; justify-content:center; border-radius:50%; font-size:11px; }
        .dr-card.meds-done { border: 2px solid #16a34a !important; box-shadow: 0 0 0 2px rgba(22,163,74,0.08), 0 4px 12px rgba(0,0,0,0.06); }
        .dr-card-list { 
            display: flex; 
            flex-wrap: wrap; 
            gap: 20px; 
            justify-content: center; 
            padding: 30px; 
            /* Ensure content is not hidden behind fixed bottom bar */
            padding-bottom: 90px; 
        }
        /* List view container and rows */
        .dr-list-container {
            display: grid;
            grid-template-columns: 1fr;
            gap: 10px;
            padding: 10px 12px 90px 12px; /* keep room for bottom bar */
        }
        @media (min-width: 1200px) {
            .dr-list-container {
                grid-template-columns: 1fr 1fr; /* 2 columns on large screens */
            }
        }
        .dr-list-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            padding: 14px 12px 10px 12px; /* extra top space for badge */
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            box-shadow: 0 1px 4px rgba(15, 23, 42, 0.04);
            cursor: pointer;
            min-height: 60px;
            position: relative; /* anchor for corner badges */
        }
        .dr-list-row:hover {
            box-shadow: 0 4px 10px rgba(15, 23, 42, 0.10);
            border-color: #cbd5e1;
        }
        .dr-list-title {
            font-weight: 700;
            color: #0f172a;
            line-height: 1.2;
            margin-bottom: 2px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    .dr-list-title .dr-list-dem { color:#64748b; font-weight:600; }
    .dr-list-title .dr-list-mabn { color:#334155; font-weight:700; }
    .dr-list-title .dr-list-loc { color:#64748b; }
        .dr-list-sub {
            color: #64748b;
            font-weight: 600;
            font-size: 12px;
            margin-bottom: 4px;
        }
        .dr-list-dx {
            color: #0f172a;
            font-size: 13px;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
            max-height: 2.8em;
        }
        /* Compact tags inside list rows */
        .dr-list-row .ylenh-tags {
            margin: 6px 0 0 0;
            gap: 4px;
        }
        .dr-list-row .ylenh-tag {
            padding: 2px 8px;
            border-radius: 10px;
            font-size: 11px;
            line-height: 1.15;
        }
        .dr-list-actions {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-left: 10px;
            flex-shrink: 0;
            position: relative; /* anchor for inline badge */
        }
        .dr-btn-icon {
            width: 34px;
            height: 34px;
            border-radius: 10px;
            border: 1px solid #cbd5e1;
            background: linear-gradient(180deg, #1e88e5, #1976d2);
            box-shadow: 0 1px 2px rgba(25, 118, 210, 0.15);
            display: inline-flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: transform 0.12s ease, box-shadow 0.12s ease, filter 0.12s ease;
        }
        .dr-btn-icon:hover { transform: translateY(-1px); filter: brightness(1.03); box-shadow: 0 4px 10px rgba(25,118,210,0.22); }
        .dr-btn-icon:active { transform: translateY(0); box-shadow: 0 2px 6px rgba(25,118,210,0.18); }
        .dr-btn-icon svg { width: 16px; height: 16px; }
        .dr-badge-meds-inline {
            background: #16a34a;
            color: #fff;
            font-weight: 700;
            font-size: 11px;
            border-radius: 999px;
            padding: 2px 8px;
            line-height: 1.2;
            box-shadow: 0 1px 2px rgba(22,163,74,0.2);
            white-space: nowrap;
            position: absolute;
            top: -8px;
            right: -6px;
            pointer-events: none;
        }
        .dr-badge-meds-row-corner {
            position: absolute;
            top: -8px;
            left: -6px;
            background: #16a34a;
            color: #fff;
            font-weight: 800;
            font-size: 10px;
            border-radius: 999px;
            padding: 3px 8px;
            line-height: 1;
            box-shadow: 0 1px 3px rgba(22,163,74,0.25);
            pointer-events: none;
            z-index: 2;
        }
        /* Unify HXT typography */
        .dr-hxt-block { color: #0f172a; font-size: 13px; line-height: 1.35; }
        .dr-hxt-block .dr-label { color: #0f172a; font-weight: 700; }
        @media (max-width: 600px) {
            .dr-list-row { padding: 12px 10px 8px 10px; gap: 10px; }
            .dr-list-title { font-size: 14px; }
            .dr-list-sub { font-size: 11px; }
            .dr-list-dx { font-size: 12px; -webkit-line-clamp: 2; }
            .dr-btn-icon { width: 30px; height: 30px; border-radius: 8px; }
            .dr-btn-icon svg { width: 14px; height: 14px; }
            .dr-sidebar-actions { gap: 6px !important; }
            .dr-sidebar-actions .dr-detail-btn { gap:6px; padding:8px 10px; border-radius:10px; font-size:12px; line-height:1.1; }
            .dr-sidebar-actions .dr-detail-btn svg,
            .dr-sidebar-actions .dr-detail-btn img { width:14px; height:14px; }
        }
            .dr-card { 
                background: #ffffff; 
                border-radius: 20px; 
                box-shadow: 0 2px 12px rgba(0,0,0,0.10); 
                padding: 24px 20px 50px 20px; 
                min-width: 260px; 
                max-width: 320px; 
                flex: 1 1 260px; 
                display: flex; 
                flex-direction: column; 
                align-items: flex-start; 
                position: relative; 
                border: 2px solid #e3e3e3; 
                cursor: pointer; 
        }
        .dr-card.dr-blue { 
            background: #e3f2fd; 
            border: 2px solid #90caf9; 
        }
        .dr-card h2 { 
            margin: 0 0 8px 0; 
            font-size: 1.2em; 
            color: #1976d2; 
        }
        .dr-card .dr-label { 
            font-weight: bold; 
            color: #000; 
        }
        .dr-card .dr-value { 
            margin-bottom: 6px; 
        }
        /* Clamp secondary diagnosis (CD kèm theo) to 2 lines in card view */
        .dr-card .dr-diagnosis-line .dr-cdkt-clamp {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
            max-height: 2.8em; /* approx two lines */
        }
        .dr-card .dr-detail-btn { 
            position: absolute; 
            right: 16px; 
            bottom: 12px; 
            background: #1976d2; 
            color: #fff; 
            border: none; 
            border-radius: 50px; 
            padding: 6px 16px 6px 10px; 
            font-size: 15px; 
            cursor: pointer; 
            display: flex; 
            align-items: center; 
            box-shadow: 0 2px 6px rgba(25,118,210,0.10); 
            white-space: nowrap;
        }
            .dr-card .dr-detail-btn svg { 
                margin-right: 4px; 
                width: 16px; height: 16px;
            }
        .dr-total { 
            text-align: center; 
            font-size: 1.1em; 
            margin-top: 30px; 
            color: #1976d2; 
            font-weight: bold; 
        }
        .dr-nodata, .dr-login { 
            text-align: center; 
            font-size: 1.2em; 
            color: #b71c1c; 
            margin-top: 40px; 
        }
        .dr-bottom-bar {
            position: fixed;
            left: 0; right: 0; bottom: 0;
            width: 100vw;
            background: #fff;
            border-top: 2px solid #90caf9;
            box-shadow: 0 -2px 8px rgba(25,118,210,0.08);
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 24px;
            height: 54px;
            z-index: 99999;
            font-size: 1.1em;
        }
        /* Bottom bar left cluster */
        .dr-bottom-bar-left { display:flex; align-items:center; gap: 10px; }

        /* Khoa select (pretty) */
        .dr-khoa-select {
            height: 34px;
            min-width: 200px;
            padding: 0 34px 0 10px; /* room for chevron */
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            background: #ffffff;
            color: #0f172a;
            font-size: 14px;
            font-weight: 600;
            box-shadow: 0 1px 2px rgba(15,23,42,0.05);
            transition: border-color .15s ease, box-shadow .15s ease, filter .15s ease;
            -webkit-appearance: none;
            appearance: none;
            background-image: url("data:image/svg+xml;utf8,\
                <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20' fill='none'>\
                    <path d='M6 8l4 4 4-4' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/>\
                </svg>");
            background-repeat: no-repeat;
            background-position: right 8px center;
            background-size: 18px 18px;
            cursor: pointer;
        }
        .dr-khoa-select:hover { border-color: #94a3b8; filter: brightness(1.02); }
        .dr-khoa-select:focus { outline: none; border-color: #60a5fa; box-shadow: 0 0 0 3px rgba(59,130,246,0.25); }
        .dr-khoa-select:disabled { opacity: .6; cursor: not-allowed; }

        /* settings “gear” anchor next to select */
        .dr-gear-btn { display:inline-flex; align-items:center; justify-content:center; width:34px; height:34px; border-radius:50%; color:#1976d2; border:1px solid rgba(25,118,210,0.25); text-decoration:none; background:#fff; transition: box-shadow .15s ease, background .15s ease; }
        .dr-gear-btn i { font-size:16px; }
        .dr-gear-btn:hover { background:#e3f2fd; box-shadow:0 0 0 2px rgba(25,118,210,0.15) inset; }

    /* Offline banner */
    .dr-offline-banner { background:#fff3cd; color:#8a6d3b; border:1px solid #ffeeba; padding:6px 10px; border-radius:6px; margin:8px 0; display:none; }
        .dr-bottom-bar-left { color: #1976d2; font-weight: bold; }
        @media (max-width: 600px) {
            .dr-bottom-bar { 
                flex-direction: column; 
                height: auto; 
                padding: 8px 8px; 
            }
            .dr-card-list { 
                flex-direction: column; 
                align-items: center; 
            }
            /* Card action buttons: smaller on phones */
            .dr-card .dr-detail-btn {
                padding: 6px 10px 6px 8px;
                font-size: 12px;
                border-radius: 16px;
            }
            .dr-card .dr-detail-btn svg { width: 14px; height: 14px; margin-right: 4px; }
            /* Action group spacing and positioning */
            .dr-action-buttons { gap: 6px !important; right: 10px !important; bottom: 8px !important; }
            /* Icon-only copy button (inline style width/height) shrink */
            .dr-action-buttons .dr-detail-btn[title="Copy báo cáo (1 BN)"] {
                width: 30px !important; height: 30px !important; padding: 6px !important; border-radius: 8px !important;
            }
            .dr-action-buttons .dr-detail-btn[title="Copy báo cáo (1 BN)"] svg { width: 14px; height: 14px; }
        }
        #dr-sidebar-backdrop {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0,0,0,0.25);
            z-index: 99999;
        }
        #dr-sidebar {
            position: fixed;
            top: 0;
            right: 0;
            width: 80vw;
            max-width: 80vw;
            height: 100vh;
            background: #fff;
            z-index: 100000;
            box-shadow: -2px 0 16px rgba(0,0,0,0.15);
            padding: 32px 24px 24px 24px;
            overflow-y: auto;
            transition: right 0.2s;
        }
        /* Sidebar responsive layout */
        @media (min-width: 1024px) {
            .dr-sidebar-container { flex-direction: row !important; gap: 24px !important; }
            .dr-sidebar-left { flex: 0 0 40% !important; }
            .dr-sidebar-right { flex: 1 !important; }
        }
        /* Xuất viện animation class - Hiệu ứng ngôi sao */
        .dr-card.xuatvienanimation {
            position: relative;
            overflow: hidden;
            border: 3px solid #ffd700 !important;
            background: linear-gradient(135deg, #fff9c4, #ffffff) !important;
            animation: starGlow 3s ease-in-out infinite;
        }
        
        /* Xuất viện animation cho card blue - border blue glow */
        .dr-card.xuatvienanimation.dr-blue {
            border: 3px solid #2196f3 !important;
            background: linear-gradient(135deg, #e3f2fd, #ffffff) !important;
            animation: starGlowBlue 3s ease-in-out infinite;
        }
        
        .dr-card.xuatvienanimation::before {
            content: '⭐';
            position: absolute;
            top: 10px;
            right: 10px;
            font-size: 24px;
            animation: starRotate 2s linear infinite;
            z-index: 10;
        }
        
        .dr-card.xuatvienanimation::after {
            content: '✨ 🎉 ✨';
            position: absolute;
            top: -5px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 14px;
            animation: sparkle 1.5s ease-in-out infinite;
            z-index: 10;
        }
        
        @keyframes starGlow {
            0%, 100% { 
                box-shadow: 0 2px 12px rgba(0,0,0,0.10), 0 0 20px rgba(255, 215, 0, 0.4);
            }
            50% { 
                box-shadow: 0 2px 12px rgba(0,0,0,0.10), 0 0 30px rgba(255, 215, 0, 0.8);
            }
        }
        
        @keyframes starGlowBlue {
            0%, 100% { 
                box-shadow: 0 2px 12px rgba(0,0,0,0.10), 0 0 20px rgba(33, 150, 243, 0.4);
            }
            50% { 
                box-shadow: 0 2px 12px rgba(0,0,0,0.10), 0 0 30px rgba(33, 150, 243, 0.8);
            }
        }
        
        @keyframes starRotate {
            0% { transform: rotate(0deg) scale(1); }
            25% { transform: rotate(90deg) scale(1.2); }
            50% { transform: rotate(180deg) scale(1); }
            75% { transform: rotate(270deg) scale(1.2); }
            100% { transform: rotate(360deg) scale(1); }
        }
        
        @keyframes sparkle {
            0%, 100% { 
                opacity: 0.6;
                transform: translateX(-50%) translateY(0px);
            }
            50% { 
                opacity: 1;
                transform: translateX(-50%) translateY(-5px);
            }
        }
        
        @media print {
            .no-print { 
                display: none !important; 
            }
            /* White cards (214, 215, 216) - giữ màu trắng khi in */
            .dr-card:not(.dr-blue) {
                background: #0d8ae3ff !important;
                border: 2px solid #c4490bff !important;
                color: #000 !important;
            }
            /* Blue cards (các phòng khác) - giữ background blue khi in */
            .dr-card.dr-blue {
                background: #e3f2fd !important;
                border: 2px solid #2196f3 !important;
                color: #000 !important;
            }
            .dr-card h2 {
                color: #000 !important;
            }
            .dr-bottom-bar {
                display: none !important;
            }
            /* Tắt animation khi in */
            .dr-card.xuatvienanimation,
            .dr-card.xuatvienanimation.dr-blue {
                animation: none !important;
                border: 2px solid #ccc !important;
                background: #fff !important;
            }
            .dr-card.xuatvienanimation::before,
            .dr-card.xuatvienanimation.dr-blue::before {
                display: inline-flex; align-items:center; gap:10px;
                display: none !important;
            .dr-khoa-select { height: 32px; min-width: 180px; border:1px solid #cbd5e1; border-radius: 8px; padding: 0 8px; }
            .dr-gear-btn { display:inline-flex; align-items:center; justify-content:center; width:32px; height:32px; border-radius:50%; color:#1976d2; border:1px solid rgba(25,118,210,0.25); text-decoration:none; background:#fff; }
            .dr-gear-btn i { font-size:16px; }
            .dr-gear-btn:hover { background:#e3f2fd; box-shadow:0 0 0 2px rgba(25,118,210,0.15) inset; }
            }
            .dr-card.xuatvienanimation::after,
            .dr-card.xuatvienanimation.dr-blue::after {
                display: none !important;
            }
        }
    `;
    document.head.appendChild(style);
}

/**
 * Update checklist data (wrapper for backward compatibility)
 */
function updateChecklistPhieu(oldData, checklistState, callback) {
    ApiService.updateChecklistData(oldData, checklistState)
        .then(result => {
            if (typeof callback === 'function') {
                callback(result);
            }
        })
        .catch(error => {
            console.error('Failed to update checklist:', error);
            if (typeof callback === 'function') {
                callback(null);
            }
        });
}

/**
 * Create checklist for patient (wrapper for backward compatibility)
 */
function createChecklistPhieu(patient, callback) {
    ApiService.createChecklistForPatient(patient)
        .then(result => {
            if (typeof callback === 'function') {
                callback(result);
            }
        })
        .catch(error => {
            console.error('Failed to create checklist:', error);
            if (typeof callback === 'function') {
                callback(null);
            }
        });
}

module.exports = {
    createDirectReportGeneration,
    fetchToDieuTriData,
    addGlobalStyles,
    copyReportToClipboardRich,
    updateChecklistPhieu,
    createChecklistPhieu
};

},{"../components/dialogManager":7,"../services/apiService":26,"../services/reportService":30,"../utils/dateUtils":37}],22:[function(require,module,exports){
// page.lichmo.homnay.js - Refactored surgery schedule using OTMTokenService

const { showToast } = require('../utils/uiUtils');
const { getSelectedKhoa } = require('../utils/khoaUtils');
const SurgeonSettingsService = require('../services/surgeonSettingsService');
const { createKhoaSelect } = require('../components/khoaSelect');
const OTMTokenService = require('../services/otm.token');

function stylesOnce() {
  if (document.getElementById('dr-qh-lichmo-css')) return;
  const st = document.createElement('style');
  st.id = 'dr-qh-lichmo-css';
  st.textContent = `
    .dr-qh-lichmo-wrap{min-height:100vh;background:#fff;color:#0f172a;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif}
    .dr-qh-lichmo-head{display:flex;align-items:center;justify-content:space-between;padding:10px 16px;border-bottom:1px solid #e5e7eb;position:sticky;top:0;background:#fff;z-index:10;gap:12px}
    .dr-qh-lichmo-left{display:flex;align-items:center;gap:10px}
    .dr-qh-lichmo-title{margin:0;font-size:18px}
    .dr-qh-lichmo-khoa{color:#475569;font-size:13px;background:#f1f5f9;border-radius:8px;padding:3px 8px}
    .dr-qh-lichmo-mid{display:flex;align-items:center;gap:6px}
    .dr-qh-lichmo-date{font-weight:600}
    .dr-qh-lichmo-btn{border:1px solid #e5e7eb;background:#fff;border-radius:8px;padding:6px 10px;cursor:pointer}
    .dr-qh-lichmo-btn:hover{background:#f8fafc}
    .dr-qh-lichmo-right{display:flex;align-items:center;gap:8px}
    .dr-qh-lichmo-status{color:#64748b;font-size:13px}
    .dr-qh-lichmo-loading{width:16px;height:16px;border:2px solid #94a3b8;border-top-color:#0ea5e9;border-radius:50%;animation:drspin 1s linear infinite;display:none}
    .dr-qh-lichmo-loading.active{display:inline-block}
    @keyframes drspin{to{transform:rotate(360deg)}}
  .dr-qh-lichmo-content{padding:16px 18px;height:calc(100vh - 58px);overflow:auto;overscroll-behavior:contain}
  /* Timeline container */
  .dr-qh-timeline{position:relative;border-left:1px dashed #e2e8f0;padding-left:12px}
  .dr-qh-timegrid{position:relative;min-height:720px;background:linear-gradient(180deg,#fff 0,#fff 49%,#f8fafc 50%,#f8fafc 100%);background-size:100% 60px;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden}
  .dr-qh-timeaxis{position:absolute;left:0;top:0;width:54px;border-right:1px solid #e5e7eb;background:#fff;z-index:2}
  .dr-qh-timeaxis .tick{position:absolute;left:0;right:0;height:1px;background:#e5e7eb}
  .dr-qh-timeaxis .label{position:absolute;left:6px;transform:translateY(-50%);font-size:12px;color:#64748b;background:#fff;padding:0 2px}
  .dr-qh-lanes{position:absolute;left:54px;right:0;top:0}
  .dr-qh-lane{position:relative}
  .dr-qh-evtbar{position:absolute;left:8px;right:12px;border-radius:16px;display:flex;flex-direction:column;align-items:flex-start;padding:14px 18px;color:#0f172a;box-shadow:0 8px 20px rgba(2,6,23,.12);border:1px solid rgba(15,23,42,.08);min-height:80px;transition:all .2s ease;overflow:hidden}
  .dr-qh-evtbar:hover{box-shadow:0 12px 30px rgba(2,6,23,.18);transform:translateY(-1px)}
  .dr-qh-evtbar .row{display:flex;gap:8px;align-items:flex-start;min-width:0;width:100%;line-height:1.4;margin-bottom:6px}
  .dr-qh-evtbar .row:last-child{margin-bottom:0}
  .dr-qh-evtbar .time{font-size:14px;font-weight:600;color:#1976d2;white-space:nowrap;margin-left:auto}
  .dr-qh-evtbar .patient{font-weight:800;font-size:18px;text-transform:uppercase;letter-spacing:.3px;color:#1976d2;line-height:1.2;word-wrap:break-word;overflow-wrap:break-word;flex:1}
  .dr-qh-evtbar .method{font-size:14px;color:#374151;font-weight:500;line-height:1.3;word-wrap:break-word;overflow-wrap:break-word;flex:1;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
  .dr-qh-evtbar .docs{font-size:14px;color:#7c3aed;font-weight:500;line-height:1.3;word-wrap:break-word;overflow-wrap:break-word;flex:1}
  /* Emphasize OR row: largest and bold */
  .dr-qh-evtbar .or{font-size:16px;font-weight:800;color:#1976d2;background:#fef3c7;padding:4px 10px;border-radius:8px;border:1px solid #fbbf24;margin-bottom:4px;word-wrap:break-word;overflow-wrap:break-word;flex:1}
  /* Make meta as prominent as patient */
  .dr-qh-evtbar .meta{font-size:14px;font-weight:600;color:#1f2937;background:#f3f4f6;padding:3px 8px;border-radius:6px;border:1px solid #d1d5db;word-wrap:break-word;overflow-wrap:break-word;flex:1}
  .dr-qh-evtbar .diagnose{font-size:14px;color:#374151;font-weight:500;line-height:1.3;word-wrap:break-word;overflow-wrap:break-word;flex:1;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
  .dr-qh-evtbar.tight{padding:8px 12px;min-height:80px}
  .dr-qh-evtbar.tight .method{font-size:13px}
  .dr-qh-evtbar.tight .docs{font-size:12px}
  .dr-qh-empty{padding:12px;border:1px dashed #cbd5e1;border-radius:10px;color:#64748b;background:#f8fafc}
  @media (max-width: 1100px){.dr-qh-timeaxis{width:46px}.dr-qh-lanes{left:46px}}
  `;
  document.head.appendChild(st);
}

function formatTimeRange(start, end) {
  try {
    const s = start ? new Date(start) : null;
    const e = end ? new Date(end) : null;
    const fmt = (d)=> d ? d.toLocaleTimeString('vi-VN', {hour:'2-digit', minute:'2-digit'}) : '';
    const sStr = fmt(s);
    const eStr = fmt(e);
    return sStr + (eStr ? ` - ${eStr}` : '');
  } catch(_) { return start || ''; }
}

function filterBySelectedSurgeons(surgeries, selectedNames) {
  if (!Array.isArray(surgeries) || surgeries.length === 0) return [];
  const set = new Set((selectedNames || []).map(s => (s || '').toString().trim().toLowerCase()).filter(Boolean));
  if (set.size === 0) return surgeries; // If nothing selected, show all
  return surgeries.filter(item => {
    const all = [
      ...(Array.isArray(item.userexec) ? item.userexec : []),
      ...(Array.isArray(item.userassistant) ? item.userassistant : [])
    ];
    return all.some(u => set.has(((u && (u.fullname || u.name)) || '').toString().trim().toLowerCase()));
  });
}

function sortByStart(a, b) {
  const as = a && a.start ? Date.parse(a.start) : 0;
  const bs = b && b.start ? Date.parse(b.start) : 0;
  return as - bs;
}

function renderTimeAxisHTML(startHour, endHour, timelineHeight = 720) {
  let ticksHTML = '';
  for (let h = startHour; h <= endHour; h++) {
    const y = (h - startHour) * (timelineHeight / (endHour - startHour));
    ticksHTML += `
      <div class="tick" style="top: ${y}px;"></div>
      <div class="label" style="top: ${y}px;">${String(h).padStart(2,'0')}:00</div>
    `;
  }
  return `<div class="dr-qh-timeaxis" style="height: ${timelineHeight}px;">${ticksHTML}</div>`;
}

function calculateContentHeight(item) {
  const { s } = item;
  
  // Count content rows
  let rowCount = 0;
  
  // Operating room + time row
  const opRoom = s.operating_room || (s.room && s.room.name) || '';
  if (opRoom) rowCount++;
  
  // Patient name row
  if (s.customer && s.customer.fullname) rowCount++;
  
  // Surgery method row
  if (s.surgerymethod) rowCount++;
  
  // Doctors row
  const docs = [...(s.userexec || []), ...(s.userassistant || [])];
  if (docs.length > 0) rowCount++;
  
  // Diagnosis row
  if (s.diagnose) rowCount++;
  
  // Meta info row
  const meta = [s.khoaLuuTri, s.khoaDieuTri, s.phongDieuTri, s.giuongDieuTri].filter(Boolean);
  if (meta.length > 0) rowCount++;

  // Base height + row height * number of rows
  const baseHeight = 40;
  const rowHeight = 22;
  const paddingHeight = 28;
  
  return baseHeight + (rowCount * rowHeight) + paddingHeight;
}

function renderSurgeryTimeline(surgeries) {
  if (!Array.isArray(surgeries) || surgeries.length === 0) {
    return '<div class="dr-qh-empty">Không có lịch mổ nào trong ngày hôm nay</div>';
  }

  // Sort surgeries by start time
  const sorted = [...surgeries].sort(sortByStart);
  
  const startHour = 6;
  const endHour = 22;
  const timelineHeight = 720;
  const hoursSpan = endHour - startHour;

  const timeAxisHTML = renderTimeAxisHTML(startHour, endHour, timelineHeight);

  // Generate surgery event bars
  let eventsHTML = '';
  sorted.forEach((item, idx) => {
    const { s } = item;
    
    // Calculate position and height
    const startTime = s.start ? new Date(s.start) : null;
    const endTime = s.end ? new Date(s.end) : null;
    
    let topPercent = 0;
    let heightPixels = calculateContentHeight(item);
    
    if (startTime) {
      const startHours = startTime.getHours() + (startTime.getMinutes() / 60);
      const relativeStart = Math.max(0, Math.min(hoursSpan, startHours - startHour));
      topPercent = (relativeStart / hoursSpan) * 100;
      
      if (endTime) {
        const endHours = endTime.getHours() + (endTime.getMinutes() / 60);
        const relativeEnd = Math.max(relativeStart, Math.min(hoursSpan, endHours - startHour));
        const duration = relativeEnd - relativeStart;
        heightPixels = Math.max(heightPixels, (duration / hoursSpan) * timelineHeight);
      }
    }

    // Generate content rows
    let contentRows = '';
    
    // Operating room + time row
    const opRoom = s.operating_room || (s.room && s.room.name) || '';
    const timeRange = formatTimeRange(s.start, s.end);
    if (opRoom || timeRange) {
      contentRows += `
        <div class="row">
          <div class="or">${opRoom || 'Phòng mổ'}</div>
          <div class="time">${timeRange}</div>
        </div>
      `;
    }

    // Patient name row
    if (s.customer && s.customer.fullname) {
      contentRows += `
        <div class="row">
          <div class="patient">${s.customer.fullname}</div>
        </div>
      `;
    }

    // Surgery method row
    if (s.surgerymethod) {
      contentRows += `
        <div class="row">
          <div class="method">${s.surgerymethod}</div>
        </div>
      `;
    }

    // Doctors row
    const docs = [...(s.userexec || []), ...(s.userassistant || [])];
    if (docs.length > 0) {
      const docNames = docs.map(d => d.fullname).filter(Boolean).join(', ');
      contentRows += `
        <div class="row">
          <div class="docs">BS: ${docNames}</div>
        </div>
      `;
    }

    // Diagnosis row
    if (s.diagnose) {
      contentRows += `
        <div class="row">
          <div class="diagnose">${s.diagnose}</div>
        </div>
      `;
    }

    // Meta info row
    const meta = [s.khoaLuuTri, s.khoaDieuTri, s.phongDieuTri, s.giuongDieuTri].filter(Boolean);
    if (meta.length > 0) {
      contentRows += `
        <div class="row">
          <div class="meta">${meta.join(' • ')}</div>
        </div>
      `;
    }

    // Create event bar
    eventsHTML += `
      <div class="dr-qh-evtbar" style="top: ${topPercent}%; height: ${heightPixels}px; z-index: ${100 - idx};">
        ${contentRows}
      </div>
    `;
  });

  return `
    <div class="dr-qh-timegrid">
      ${timeAxisHTML}
      <div class="dr-qh-lanes">
        <div class="dr-qh-lane" style="height: ${timelineHeight}px;">
          ${eventsHTML}
        </div>
      </div>
    </div>
  `;
}

function renderLichMoPage() {
  stylesOnce();

  const today = new Date();
  const dateStr = today.toLocaleDateString('vi-VN', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return `
    <div class="dr-qh-lichmo-wrap">
      <div class="dr-qh-lichmo-head">
        <div class="dr-qh-lichmo-left">
          <h2 class="dr-qh-lichmo-title">Lịch mổ hôm nay</h2>
          <div class="dr-qh-lichmo-khoa" id="dr-qh-lichmo-khoa">Tất cả khoa</div>
        </div>
        <div class="dr-qh-lichmo-mid">
          <div class="dr-qh-lichmo-date">${dateStr}</div>
        </div>
        <div class="dr-qh-lichmo-right">
          <button class="dr-qh-lichmo-btn" id="dr-qh-lichmo-refresh">↻ Làm mới</button>
          <button class="dr-qh-lichmo-btn" id="dr-qh-lichmo-settings">⚙ Cài đặt</button>
          <div class="dr-qh-lichmo-status" id="dr-qh-lichmo-status">Sẵn sàng</div>
          <div class="dr-qh-lichmo-loading" id="dr-qh-lichmo-loading"></div>
        </div>
      </div>
      <div class="dr-qh-lichmo-content" id="dr-qh-lichmo-content">
        <div class="dr-qh-empty">Đang tải dữ liệu...</div>
      </div>
    </div>
  `;
}

// Transform raw surgery records into a lean structure required by the UI
function filterSurgeryData(records) {
  if (!Array.isArray(records)) return [];
  const result = [];
  for (const r of records) {
    const item = {
      s: {
        customer: {
          fullname: r?.customer?.fullname ?? null,
          pid: r?.customer?.code ?? null,
          dob: r?.customer?.dob ?? null,
        },
        diagnose: r?.diagnose ?? null,
        surgerymethod: r?.surgerymethod ?? null,
        start: r?.start ?? null,
        end: r?.end ?? null,
        khoaLuuTri: r?.khoaLuuTri ?? null,
        khoaDieuTri: r?.khoaDieuTri ?? null,
        phongDieuTri: r?.phongDieuTri ?? null,
        giuongDieuTri: r?.giuongDieuTri ?? null,
        operating_room: r?.room?.name ?? null,
        status: r?.status ?? null,
        userexec: Array.isArray(r?.userexec)
          ? r.userexec.map(u => ({ fullname: u?.fullname ?? null, taid: u?.taid ?? null }))
          : [],
        userassistant: Array.isArray(r?.userassistant)
          ? r.userassistant.map(u => ({ fullname: u?.fullname ?? null, taid: u?.taid ?? null }))
          : [],
        room: r?.room || null
      }
    };
    result.push(item);
  }
  return result;
}

async function loadSurgeryData() {
  const loadingEl = document.getElementById('dr-qh-lichmo-loading');
  const statusEl = document.getElementById('dr-qh-lichmo-status');
  const contentEl = document.getElementById('dr-qh-lichmo-content');
  
  if (loadingEl) loadingEl.classList.add('active');
  if (statusEl) statusEl.textContent = 'Đang tải...';

  try {
    console.log('DEBUG - Starting direct OTM API fetch...');
    
    // Use OTMTokenService to fetch today's surgeries
    const today = new Date().toISOString().split('T')[0];
    const rawData = await OTMTokenService.fetchSurgeries(today, today);
    
    console.log('DEBUG - Raw OTM surgery data:', rawData);
    
    // Extract surgery array from response
    let surgeryArray = [];
    if (Array.isArray(rawData)) {
      surgeryArray = rawData;
    } else if (rawData && Array.isArray(rawData.data)) {
      surgeryArray = rawData.data;
    } else if (rawData && typeof rawData === 'object') {
      // Look for array in various possible properties
      const candidates = ['bookings', 'surgeries', 'items', 'records', 'results'];
      for (const prop of candidates) {
        if (Array.isArray(rawData[prop])) {
          surgeryArray = rawData[prop];
          break;
        }
      }
    }
    
    console.log('DEBUG - Extracted surgery array:', surgeryArray.length, 'items');
    
    // Transform data
    const surgeries = filterSurgeryData(surgeryArray);
    console.log('DEBUG - Filtered surgery data:', surgeries.length, 'items');
    
    // Apply surgeon filtering if any
    const selectedSurgeons = await SurgeonSettingsService.getSelectedSurgeons();
    const filteredSurgeries = filterBySelectedSurgeons(surgeries, selectedSurgeons);
    console.log('DEBUG - After surgeon filter:', filteredSurgeries.length, 'items');
    
    // Render timeline
    const timelineHTML = renderSurgeryTimeline(filteredSurgeries);
    if (contentEl) contentEl.innerHTML = timelineHTML;
    
    if (statusEl) statusEl.textContent = `${filteredSurgeries.length} ca mổ`;
    showToast(`Đã tải ${filteredSurgeries.length} ca mổ hôm nay`, 'success');
    
  } catch (error) {
    console.error('DEBUG - Error loading surgery data:', error);
    
    let errorMessage = 'Không thể tải dữ liệu lịch mổ';
    if (error.message === 'TOKEN_EXPIRED') {
      errorMessage = 'Token OTM đã hết hạn, vui lòng thử lại';
    } else if (error.message === 'NO_TOKEN') {
      errorMessage = 'Không có token OTM, vui lòng đăng nhập OTM trước';
    }
    
    if (contentEl) {
      contentEl.innerHTML = `
        <div class="dr-qh-empty">
          <p>${errorMessage}</p>
          <button class="dr-qh-lichmo-btn" onclick="loadSurgeryData()">Thử lại</button>
        </div>
      `;
    }
    if (statusEl) statusEl.textContent = 'Lỗi';
    showToast(errorMessage, 'error');
  } finally {
    if (loadingEl) loadingEl.classList.remove('active');
  }
}

function attachEventListeners() {
  const refreshBtn = document.getElementById('dr-qh-lichmo-refresh');
  const settingsBtn = document.getElementById('dr-qh-lichmo-settings');

  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      console.log('DEBUG - Refresh button clicked');
      loadSurgeryData();
    });
  }

  if (settingsBtn) {
    settingsBtn.addEventListener('click', () => {
      // Navigate to surgeon settings
      window.location.href = '?caidat&tab=otm-quanlyphauthuat';
    });
  }
}

function initLichMoPage() {
  console.log('DEBUG - Initializing Lich Mo page with OTMTokenService');
  
  // Render the page
  document.body.innerHTML = renderLichMoPage();
  
  // Attach event listeners
  attachEventListeners();
  
  // Load data
  loadSurgeryData();
}

// Legacy compatibility function
async function showLichMoHomNayIfNeeded() {
  const url = new URL(window.location.href);
  const hasLm = /[?&]lm(=|&|$)/.test(url.search);
  const hasLichmo = /[?&]lichmo(=|&|$)/.test(url.search) || (url.searchParams.get('otm')||'').toLowerCase() === 'lichmo';
  if (!hasLm && !hasLichmo) return;
  
  console.log('DEBUG - Legacy URL detected, redirecting to initLichMoPage');
  initLichMoPage();
}

module.exports = {
  initLichMoPage,
  renderLichMoPage,
  loadSurgeryData,
  showLichMoHomNayIfNeeded
};

},{"../components/khoaSelect":9,"../services/otm.token":28,"../services/surgeonSettingsService":33,"../utils/khoaUtils":41,"../utils/uiUtils":45}],23:[function(require,module,exports){
// settings-open-world.js - Open World settings (Thông tin khoa/phòng)

const SettingsService = require('../services/settingsService');
const ApiService = require('../services/apiService');

function createStylesOnce() {
    if (document.getElementById('dr-openworld-styles')) return;
    const st = document.createElement('style');
    st.id = 'dr-openworld-styles';
    st.textContent = `
        .dr-ow-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .dr-ow-card { border:1px solid #e5e7eb; border-radius: 10px; padding: 10px; background: #fff; }
        .dr-ow-title { margin: 0 0 8px 0; font-weight: 700; color: #0f172a; }
        .dr-ow-list { display: flex; flex-direction: column; gap: 8px; max-height: 52vh; overflow: auto; }
        .dr-ow-item { display: flex; align-items: center; justify-content: space-between; gap: 8px; border:1px solid #e5e7eb; border-radius: 8px; padding: 8px 10px; cursor: pointer; }
        .dr-ow-item:hover { background: #f8fafc; }
        .dr-ow-item.active { border-color: #16a34a; box-shadow: 0 0 0 2px rgba(22,163,74,.15) inset; }
        .dr-ow-badge { background: #16a34a; color: #fff; border-radius: 10px; padding: 2px 6px; font-size: 12px; }
        .dr-ow-empty { color:#6b7280; font-style: italic; }
        @media (max-width: 900px) { .dr-ow-wrap { grid-template-columns: 1fr; } }
    `;
    document.head.appendChild(st);
}

function debounce(fn, delay = 400) {
    let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
}

async function fetchKhoaPhong() { return ApiService.fetchKhoaPhong(); }
async function fetchRoomsByKhoa(khoaId) { return ApiService.fetchRoomsByKhoa(khoaId); }

/**
 * Mount Open World settings tab
 */
async function mountOpenWorldTab(opts) {
    const { container, doctorName, checklistObj, settings } = opts || {};
    if (!container) return;
    createStylesOnce();

    container.innerHTML = `
        <div style="margin:0 0 8px; color:#6b7280">Quản lý khoa mặc định và các phòng theo dõi bệnh nhân. Việc chọn khoa sẽ được lưu và áp dụng ở dashboard.</div>
        <div class="dr-ow-wrap">
            <div class="dr-ow-card">
                <h4 class="dr-ow-title">Danh sách khoa/phòng</h4>
                <div id="dr-ow-khoa-list" class="dr-ow-list"><div class="dr-ow-empty">Đang tải danh sách khoa...</div></div>
            </div>
            <div class="dr-ow-card">
                <h4 class="dr-ow-title">Phòng thuộc khoa đã chọn</h4>
                <div id="dr-ow-room-list" class="dr-ow-list"><div class="dr-ow-empty">Chưa chọn khoa.</div></div>
            </div>
        </div>
    `;

    const khoaListEl = container.querySelector('#dr-ow-khoa-list');
    const roomListEl = container.querySelector('#dr-ow-room-list');

    const ls = window.localStorage;
    const SELECTED_KHOA_KEY = 'bsnt_khoa_dashboard';
    const ROOMS_CACHE_KEY = (k) => `dr_ow_rooms_${k}`;

    // Helper: render rooms
    function renderRooms(rooms) {
        if (!rooms || rooms.length === 0) {
            roomListEl.innerHTML = `<div class="dr-ow-empty">Không có phòng.</div>`;
            return;
        }
        roomListEl.innerHTML = '';
        rooms.forEach(r => {
            const div = document.createElement('div');
            div.className = 'dr-ow-item';
            div.textContent = r.name || r.code || 'Phòng';
            // keep attributes for later use
            div.dataset.id = r.id || '';
            div.dataset.code = r.code || '';
            div.dataset.name = r.name || '';
            div.dataset.khoA_ID = r.khoA_ID || '';
            div.dataset.tanG_ID = r.tanG_ID || '';
            roomListEl.appendChild(div);
        });
    }

    // Debounced save to API for default khoa
    const debouncedSave = debounce(async (khoaId) => {
        try {
            if (!doctorName) return;
            let obj = checklistObj || await SettingsService.loadSettingsPhieu(doctorName);
            if (!obj) {
                const created = await SettingsService.createSettingsPhieu(doctorName);
                if (created && created.isValid) obj = await SettingsService.loadSettingsPhieu(doctorName);
            }
            if (!obj) return;
            const current = SettingsService.parseSettingsState(obj) || {};
            const next = { ...current, openWorld: { ...(current.openWorld || {}), defaultKhoa: String(khoaId || '') } };
            await SettingsService.updateSettingsState(obj, next);
        } catch (e) { console.warn('Save default khoa failed', e); }
    }, 600);

    // Render khoa list and wire selection
    async function renderKhoaList() {
        try {
            const khoa = await fetchKhoaPhong();
            let selected = (ls && ls.getItem(SELECTED_KHOA_KEY)) || '';
            khoaListEl.innerHTML = '';
            khoa.forEach(k => {
                const div = document.createElement('div');
                const kId = String(k.id);
                const isSelected = !!selected && selected === kId;
                div.className = 'dr-ow-item' + (isSelected ? ' active' : '');
                const name = (k && k.name) || 'Khoa';
                div.innerHTML = `<span>${name}</span>` + (isSelected ? `<span class="dr-ow-badge">Đã chọn</span>` : '');
                div.addEventListener('click', async () => {
                    // update selection locally
                    Array.from(khoaListEl.querySelectorAll('.dr-ow-item')).forEach(el => el.classList.remove('active'));
                    div.classList.add('active');
                    // set badge
                    Array.from(khoaListEl.querySelectorAll('.dr-ow-badge')).forEach(b => b.remove());
                    div.insertAdjacentHTML('beforeend', `<span class="dr-ow-badge">Đã chọn</span>`);
                    // persist to localStorage for dashboard compatibility
                    try {
                        ls && ls.setItem(SELECTED_KHOA_KEY, kId);
                    } catch(_) {}
                    // fetch rooms for selected khoa
                    const rooms = await fetchRoomsByKhoa(kId);
                    renderRooms(rooms);
                    try { ls && ls.setItem(ROOMS_CACHE_KEY(kId), JSON.stringify(rooms || [])); } catch(_) {}
                    // save via API for per-doctor settings
                    debouncedSave(kId);
                });
                khoaListEl.appendChild(div);
            });
            // Auto-load rooms for current selection
            if (selected) {
                try {
                    const cached = ls && ls.getItem(ROOMS_CACHE_KEY(selected));
                    if (cached) {
                        try { renderRooms(JSON.parse(cached)); } catch { /* ignore */ }
                    } else {
                        const rooms = await fetchRoomsByKhoa(selected);
                        renderRooms(rooms);
                        try { ls && ls.setItem(ROOMS_CACHE_KEY(selected), JSON.stringify(rooms || [])); } catch(_) {}
                    }
                } catch(_) {}
            }
        } catch (e) {
            khoaListEl.innerHTML = `<div class="dr-ow-empty">Lỗi tải danh sách khoa.</div>`;
            console.warn('LoadKhoaPhong failed', e);
        }
    }

    renderKhoaList();
}

module.exports = { mountOpenWorldTab };

},{"../services/apiService":26,"../services/settingsService":32}],24:[function(require,module,exports){
// settings.js - Render a settings page similar to dashboard, triggered by ?caidat

const SettingsService = require('../services/settingsService');
let mountOpenWorldTab;
try {
        ({ mountOpenWorldTab } = require('./page.settings-open-world'));
} catch (e) {
        try { ({ mountOpenWorldTab } = require('../settings-open-world')); }
        catch (e2) { console.warn('Open World settings module not found', e2); }
}

async function showSettingsIfNeeded() {
        // Support selecting tab via ?caidat or ?tab param, e.g., ?caidat=account or ?caidat, ?tab=discharge
        const u = new URL(window.location.href);
        const caidatParam = u.searchParams.get('caidat');
        const tabParam = u.searchParams.get('tab');
        const targetTab = (caidatParam && caidatParam !== 'true') ? caidatParam : (tabParam || 'discharge');
        if (!(/[?&](caidat)($|=|&)/.test(window.location.search))) return;

        // Reset page and mount a two-column layout with tabs
        document.body.innerHTML = '';

        const styles = document.createElement('style');
        styles.textContent = `
            .dr-st-wrap{display:flex; min-height:100vh; color:#111827; background:#fff; font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif}
            .dr-st-left{width:260px; border-right:1px solid #e5e7eb; background:#fafafa}
            .dr-st-left h2{margin:16px; font-size:18px}
            .dr-st-menu{display:flex; flex-direction:column; gap:8px; padding:0 12px 16px}
            .dr-st-menu button{appearance:none; border:1px solid #e5e7eb; background:#fff; padding:10px 12px; border-radius:10px; text-align:left; cursor:pointer}
            .dr-st-menu button.active{border-color:#2563eb; box-shadow:0 0 0 2px rgba(37,99,235,.15) inset}
            .dr-st-right{flex:1; min-width:0;}
            .dr-st-head{display:flex; align-items:center; justify-content:space-between; padding:16px 20px; border-bottom:1px solid #e5e7eb}
            .dr-st-title{margin:0; font-size:18px}
            .dr-st-content{padding:16px 20px}
            .dr-st-row{display:flex; gap:8px; align-items:center; margin-bottom:8px}
            .dr-st-input{flex:1; padding:8px 10px; border:1px solid #e5e7eb; border-radius:8px}
            .dr-st-btn{appearance:none; border:1px solid #e5e7eb; background:#fff; padding:8px 12px; border-radius:8px; cursor:pointer}
            .dr-st-btn.primary{border-color:#2563eb; background:#2563eb; color:#fff}
            .dr-st-list{display:flex; flex-direction:column; gap:8px; margin:12px 0}
            .dr-st-tab{display:none}
            .dr-st-tab.active{display:block}
            .dr-st-footer{padding:12px 20px; color:#6b7280; border-top:1px solid #e5e7eb}
        `;
        document.head.appendChild(styles);

        const wrap = document.createElement('div');
        wrap.className = 'dr-st-wrap';

        // Left menu
        const left = document.createElement('aside');
        left.className = 'dr-st-left';
        left.innerHTML = `
            <h2>Cài đặt</h2>
                        <div class="dr-st-menu">
                <button data-tab="discharge" class="${targetTab==='discharge'?'active':''}">Lời dặn dò ra viện</button>
                <button data-tab="account" class="${targetTab==='account'?'active':''}">Account</button>
                                <button data-tab="openworld" class="${targetTab==='openworld'?'active':''}">Thông tin khoa/phòng</button>
                                <button data-tab="otm-surgeons" class="${targetTab==='otm-surgeons'?'active':''}">Quản lý phẫu thuật</button>
            </div>
            <div class="dr-st-footer" id="dr-st-doctor"></div>
        `;

        // Right content with header and tabs
        const right = document.createElement('section');
        right.className = 'dr-st-right';
                right.innerHTML = `
            <div class="dr-st-head">
                        <h3 class="dr-st-title">${targetTab==='account'?'Account':(targetTab==='openworld'?'Thông tin khoa/phòng':(targetTab==='otm-surgeons'?'Quản lý phẫu thuật':'Lời dặn dò ra viện'))}</h3>
                <div>
                    <button class="dr-st-btn" id="reload-tab">Tải lại</button>
                    <button class="dr-st-btn primary" id="save-tab">Lưu</button>
                </div>
            </div>
            <div class="dr-st-content">
                        <div id="tab-discharge" class="dr-st-tab ${targetTab==='discharge'?'active':''}">
                    <p style="margin:0 0 8px; color:#6b7280">Danh sách các lời dặn dò ra viện. Bạn có thể thêm/xóa và chỉnh sửa.</p>
                    <div id="discharge-list" class="dr-st-list"></div>
                    <button id="add-discharge" class="dr-st-btn">+ Thêm mục</button>
                </div>
                                        <div id="tab-account" class="dr-st-tab ${targetTab==='account'?'active':''}">
                                                <div style="margin-bottom:12px; padding:10px; border:1px solid #fde68a; background:#fffbeb; border-radius:8px; color:#92400e">
                                                <b>Lưu ý bảo mật:</b> Thông tin dưới đây chỉ lưu trên thiết bị (LocalStorage của trình duyệt), không gửi lên máy chủ. Hãy sử dụng trên máy tính cá nhân tin cậy. Nếu dùng máy công cộng, KHÔNG nhập mật khẩu ở đây.
                                        </div>
                                                <div id="dr-acc-toggle-wrap" style="margin:8px 0 16px;"></div>
                                                <div style="margin-top:8px; color:#6b7280; font-size:13px; line-height:1.5;">
                                                Khi bật "tự động login", lúc vào trang <code>/Home/Login</code> tiện ích sẽ tự điền Tên đăng nhập và Mật khẩu rồi nhấn Đăng nhập, sau đó chờ 1.5 giây và mở <code>/?nln</code>. Tắt tùy chọn này nếu bạn không muốn tự động đăng nhập.
                                        </div>
                                                                                                <div id="dr-acc-grid" style="display:grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap:12px; margin-top:12px;"></div>
                                </div>
                                                                <div id="tab-openworld" class="dr-st-tab ${targetTab==='openworld'?'active':''}">
                                                                        <div id="dr-openworld-container"></div>
                                                                </div>
                                                                <div id="tab-otm-surgeons" class="dr-st-tab ${targetTab==='otm-surgeons'?'active':''}">
                                                                        <div id="dr-otm-surgeons-container"></div>
                                                                </div>
            </div>
        `;

        wrap.appendChild(left);
        wrap.appendChild(right);
        document.body.appendChild(wrap);

        // Load settings state
        let { doctorName, checklistObj, settings } = await SettingsService.getOrCreateSettings();
        const titleEl = right.querySelector('.dr-st-title');
        const listEl = right.querySelector('#discharge-list');
        const doctorEl = left.querySelector('#dr-st-doctor');
        if (doctorEl) doctorEl.textContent = doctorName ? `Bác sĩ: ${doctorName}` : 'Bác sĩ: (không xác định)';

                // Account tab: multi-account manager (localStorage only)
                const ls = window.localStorage;
                const ACC_KEY = 'dr_accounts_json';
                const DEF_KEY = 'dr_acc_default';
                const AUTO_KEY = 'dr_acc_autologin';
                function readAccounts() {
                        try { return JSON.parse(ls.getItem(ACC_KEY) || '[]'); } catch(_) { return []; }
                }
                function writeAccounts(arr) { ls.setItem(ACC_KEY, JSON.stringify(arr || [])); }
                function readDefault() { return ls.getItem(DEF_KEY) || ''; }
                function writeDefault(u) { ls.setItem(DEF_KEY, u || ''); }

                const grid = right.querySelector('#dr-acc-grid');
                function renderGrid() {
                        if (!grid) return;
                        grid.innerHTML = '';
                                                   const accounts = readAccounts();
                                                   let def = readDefault();
                                                   // If only one account, auto set as default
                                                   if (accounts.length === 1) {
                                                           const only = accounts[0];
                                                           if (only && only.username && def !== only.username) {
                                                                   writeDefault(only.username);
                                                                   def = only.username;
                                                           }
                                                   }
                        accounts.forEach((acc, idx) => {
                                const box = document.createElement('div');
                                box.style.cssText = 'border:1px solid #e5e7eb; border-radius:10px; padding:10px; position:relative; background:#fff;';
                                const radioId = `dr-acc-default-${idx}`;
                                box.innerHTML = `
                                                                                   <button class="dr-acc-remove" title="Xóa" style="position:absolute; right:8px; top:8px; background:#dc2626; color:#fff; border:none; border-radius:6px; padding:2px 6px; cursor:pointer;">X</button>
                                        <div class="dr-st-row" style="margin-top:8px;">
                                                <label style="width:100px">Tiêu đề</label>
                                                <input class="dr-st-input dr-acc-title" type="text" value="${(acc.title||'').replace(/"/g,'&quot;')}" placeholder="VD: BS. ABC" />
                                        </div>
                                        <div class="dr-st-row">
                                                <label style="width:100px">Tên đăng nhập</label>
                                                <input class="dr-st-input dr-acc-username" type="text" value="${(acc.username||'').replace(/"/g,'&quot;')}" placeholder="Tên đăng nhập" />
                                        </div>
                                        <div class="dr-st-row">
                                                <label style="width:100px">Mật khẩu</label>
                                                <input class="dr-st-input dr-acc-password" type="password" value="${(acc.password||'').replace(/"/g,'&quot;')}" placeholder="Mật khẩu" />
                                        </div>
                                        <div class="dr-st-row">
                                                <input id="${radioId}" type="radio" name="dr-acc-default" class="dr-acc-default" ${def && def===acc.username ? 'checked' : ''} />
                                                <label for="${radioId}" style="margin-left:6px; cursor:pointer;">Tài khoản mặc định</label>
                                        </div>
                                `;
                                box.querySelector('.dr-acc-remove').addEventListener('click', () => {
                                        if (confirm('Xóa tài khoản này?')) {
                                                const arr = readAccounts();
                                                arr.splice(idx,1);
                                                writeAccounts(arr);
                                                                if (def === acc.username) writeDefault('');
                                                                if (arr.length === 1) {
                                                                        const u = arr[0] && arr[0].username || '';
                                                                        if (u) writeDefault(u);
                                                                }
                                                renderGrid();
                                        }
                                });
                                box.querySelector('.dr-acc-title').addEventListener('input', (e) => {
                                        const arr = readAccounts();
                                        if (arr[idx]) { arr[idx].title = e.target.value; writeAccounts(arr); }
                                });
                                                box.querySelector('.dr-acc-username').addEventListener('input', (e) => {
                                        const arr = readAccounts();
                                                        if (arr[idx]) {
                                                                const oldU = arr[idx].username || '';
                                                                arr[idx].username = e.target.value; writeAccounts(arr);
                                                                const curDef = readDefault();
                                                                if (curDef === oldU) writeDefault(e.target.value || '');
                                                        }
                                });
                                box.querySelector('.dr-acc-password').addEventListener('input', (e) => {
                                        const arr = readAccounts();
                                        if (arr[idx]) { arr[idx].password = e.target.value; writeAccounts(arr); }
                                });
                                box.querySelector('.dr-acc-default').addEventListener('change', (e) => {
                                        if (e.target.checked) writeDefault(acc.username || '');
                                });
                                // Ensure label click also sets default (redundant with for=, but safe)
                                const lbl = box.querySelector(`label[for="${radioId}"]`);
                                if (lbl) {
                                        lbl.addEventListener('click', () => {
                                                const inp = box.querySelector(`#${radioId}`);
                                                if (inp) { inp.checked = true; writeDefault(acc.username || ''); }
                                        });
                                }
                                grid.appendChild(box);
                        });
                        // Add box
                        const addBox = document.createElement('div');
                        addBox.style.cssText = 'border:1px dashed #cbd5e1; border-radius:10px; padding:10px; display:flex; align-items:center; justify-content:center; cursor:pointer; color:#6b7280; background:#fafafa;';
                        addBox.innerHTML = '<div style="font-size:28px; line-height:1;">+</div>';
                        addBox.title = 'Thêm tài khoản';
                        addBox.addEventListener('click', () => {
                                const arr = readAccounts();
                                arr.push({ title:'', username:'', password:'' });
                                writeAccounts(arr);
                                renderGrid();
                        });
                        grid.appendChild(addBox);
                }
                renderGrid();

                // Top-level auto-login toggle (shared component)
                try {
                        const { createAutoLoginToggle, applyToggleStyles } = require('../components/autoLoginToggle');
                        const wrap = right.querySelector('#dr-acc-toggle-wrap');
                        if (wrap) {
                                const enabled = ls.getItem(AUTO_KEY) === '1';
                                const toggle = createAutoLoginToggle({
                                        enabled,
                                        onToggle: () => {
                                                const cur = ls.getItem(AUTO_KEY) === '1';
                                                ls.setItem(AUTO_KEY, cur ? '0' : '1');
                                                applyToggleStyles(toggle, !cur);
                                        },
                                        onDblClick: () => {},
                                        title: 'Bật/tắt tự động login'
                                });
                                wrap.appendChild(toggle);
                        }
                } catch(_) {}

        const renderDischarge = (items) => {
                listEl.innerHTML = '';
                (items || []).forEach(text => {
                        const row = document.createElement('div');
                        row.className = 'dr-st-row';
                        row.innerHTML = `
                            <input class="dr-st-input" type="text" value="${(text || '').replace(/"/g,'&quot;')}" placeholder="Nhập lời dặn dò..." />
                            <button class="dr-st-btn remove-row" title="Xóa">Xóa</button>
                        `;
                        listEl.appendChild(row);
                });
        };

        renderDischarge(settings && settings.danDoRaVien ? settings.danDoRaVien : SettingsService.getDefaultSettings().danDoRaVien);

        // Left menu switching (future tabs-ready)
                left.addEventListener('click', (e) => {
                                const btn = e.target.closest('button[data-tab]');
                if (!btn) return;
                left.querySelectorAll('button').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const tab = btn.dataset.tab;
                                titleEl.textContent = tab === 'discharge' ? 'Lời dặn dò ra viện' : (tab === 'account' ? 'Account' : (tab === 'openworld' ? 'Thông tin khoa/phòng' : (tab === 'otm-surgeons' ? 'Quản lý phẫu thuật' : btn.textContent.trim())));
                right.querySelectorAll('.dr-st-tab').forEach(t => t.classList.remove('active'));
                const target = right.querySelector(`#tab-${tab}`);
                if (target) target.classList.add('active');
                                // Update URL (no reload) to reflect current tab for deep linking
                                try {
                                        const url = new URL(window.location.href);
                                        url.searchParams.set('caidat', tab);
                                        window.history.replaceState({}, '', url);
                                } catch(_) {}
                                // Mount Open World content when its tab is shown
                                if (tab === 'openworld') {
                                        const mountEl = right.querySelector('#dr-openworld-container');
                                        if (mountEl && !mountEl.dataset.mounted) {
                                                mountEl.dataset.mounted = '1';
                                                mountOpenWorldTab({ container: mountEl, doctorName, checklistObj, settings });
                                        }
                                } else if (tab === 'otm-surgeons') {
                                        try {
                                                const { mountOTMSurgeonsTab } = require('../pages/page.settings.otm.quanlyphauthuat');
                                                const mountEl = right.querySelector('#dr-otm-surgeons-container');
                                                if (mountEl && !mountEl.dataset.mounted) {
                                                        mountEl.dataset.mounted = '1';
                                                        mountOTMSurgeonsTab({ container: mountEl });
                                                }
                                        } catch (e) {
                                                console.warn('OTM Surgeons tab mount failed', e);
                                        }
                                }
        });

        // Right actions
        right.addEventListener('click', async (e) => {
                if (e.target.id === 'add-discharge') {
                        const row = document.createElement('div');
                        row.className = 'dr-st-row';
                        row.innerHTML = `
                            <input class="dr-st-input" type="text" placeholder="Nhập lời dặn dò..." />
                            <button class="dr-st-btn remove-row" title="Xóa">Xóa</button>
                        `;
                        listEl.appendChild(row);
                        return;
                }
                if (e.target.classList && e.target.classList.contains('remove-row')) {
                        e.target.closest('.dr-st-row')?.remove();
                        return;
                }
                if (e.target.id === 'reload-tab') {
                        const data = await SettingsService.getOrCreateSettings();
                        doctorName = data.doctorName;
                        checklistObj = data.checklistObj;
                        settings = data.settings || SettingsService.getDefaultSettings();
                        renderDischarge(settings.danDoRaVien || []);
                        if (doctorEl) doctorEl.textContent = doctorName ? `Bác sĩ: ${doctorName}` : 'Bác sĩ: (không xác định)';
                        return;
                }
                if (e.target.id === 'save-tab') {
                        const values = Array.from(listEl.querySelectorAll('input')).map(i => i.value.trim()).filter(Boolean);
                        const next = { ...(settings || {}), danDoRaVien: values };
                        // Ensure checklist exists
                        if (!checklistObj && doctorName) {
                                const created = await SettingsService.createSettingsPhieu(doctorName);
                                if (created && created.isValid) {
                                        checklistObj = await SettingsService.loadSettingsPhieu(doctorName);
                                }
                        }
                        if (!checklistObj) {
                                alert('Không thể lưu: chưa có phiếu cài đặt.');
                                return;
                        }
                        const ok = await SettingsService.updateSettingsState(checklistObj, next);
                        if (ok) {
                                settings = next;
                                alert('Đã lưu cài đặt');
                        } else {
                                alert('Lưu thất bại');
                        }
                }
        });

        // Account tab no longer uses single username/password fields; managed via grid.
                // Mount Open World if deep-linked initially
                try {
                        if (targetTab === 'openworld') {
                                const mountEl = right.querySelector('#dr-openworld-container');
                                if (mountEl) {
                                        mountEl.dataset.mounted = '1';
                                        mountOpenWorldTab({ container: mountEl, doctorName, checklistObj, settings });
                                }
                        } else if (targetTab === 'otm-surgeons') {
                                try {
                                        const { mountOTMSurgeonsTab } = require('../pages/page.settings.otm.quanlyphauthuat');
                                        const mountEl = right.querySelector('#dr-otm-surgeons-container');
                                        if (mountEl) {
                                                mountEl.dataset.mounted = '1';
                                                mountOTMSurgeonsTab({ container: mountEl });
                                        }
                                } catch (e) { console.warn('Init OTM Surgeons tab failed', e); }
                        }
                } catch(_) {}
}

module.exports = { showSettingsIfNeeded };

},{"../components/autoLoginToggle":5,"../pages/page.settings.otm.quanlyphauthuat":25,"../services/settingsService":32,"../settings-open-world":34,"./page.settings-open-world":23}],25:[function(require,module,exports){
// page.settings.otm.quanlyphauthuat.refactored.js - Refactored OTM surgeon management using OTMTokenService

const SurgeonSettingsService = require('../services/surgeonSettingsService');
const { getSelectedKhoa } = require('../utils/khoaUtils');
const OTMTokenService = require('../services/otm.token');

function stylesOnce() {
    if (document.getElementById('dr-otm-surgeon-styles-v2')) return;
    const st = document.createElement('style');
    st.id = 'dr-otm-surgeon-styles-v2';
    st.textContent = `
    .dr-os-wrap { display:flex; flex-direction:column; gap:12px; }
    .dr-os-row { display:flex; gap:8px; align-items:center; flex-wrap:wrap; }
    .dr-os-select, .dr-os-search { padding:8px 10px; border:1px solid #e5e7eb; border-radius:8px; }
    .dr-os-columns { display:grid; grid-template-columns: 320px 1fr; gap:12px; align-items:start; }
    .dr-os-selected { border:1px solid #e5e7eb; border-radius:10px; padding:10px; background:#fff; max-height:55vh; overflow:auto; }
    .dr-os-selected h4 { margin:0 0 8px; font-size:14px; color:#334155; }
    .dr-os-chip { display:inline-flex; align-items:center; gap:6px; padding:6px 10px; background:#f1f5f9; border:1px solid #e5e7eb; border-radius:999px; margin:4px; font-size:13px; }
    .dr-os-chip button { appearance:none; border:none; background:transparent; cursor:pointer; color:#64748b; }
    .dr-os-list { border:1px solid #e5e7eb; border-radius:10px; padding:10px; max-height:55vh; overflow:auto; display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:8px; }
    .dr-os-item { display:flex; align-items:center; gap:8px; padding:8px; border:1px solid #e5e7eb; border-radius:8px; background:#fff; }
        .dr-os-actions { display:flex; gap:8px; }
        .dr-os-btn { appearance:none; border:1px solid #e5e7eb; background:#fff; padding:8px 12px; border-radius:8px; cursor:pointer }
        .dr-os-btn.primary { border-color:#2563eb; background:#2563eb; color:#fff }
        .dr-os-status { padding:12px; text-align:center; color:#64748b; font-size:14px; }
        .dr-os-error { color:#dc2626; background:#fef2f2; border:1px solid #fecaca; border-radius:8px; padding:12px; margin:8px 0; }
        .dr-os-loading { display:inline-block; width:16px; height:16px; border:2px solid #e5e7eb; border-top-color:#2563eb; border-radius:50%; animation:spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
    @media (max-width: 1100px) { .dr-os-columns { grid-template-columns: 1fr; } }
    @media (max-width: 900px) { .dr-os-list { grid-template-columns: 1fr; } }
    `;
    document.head.appendChild(st);
}

// In-memory cache for OTM users
const _otmUsersCache = { list: null, at: 0, loading: false };

async function ensureOTMUsers() {
    if (Array.isArray(_otmUsersCache.list) && _otmUsersCache.list.length > 0) {
        console.log('DEBUG - Using cached OTM users:', _otmUsersCache.list.length);
        return _otmUsersCache.list;
    }
    
    if (_otmUsersCache.loading) {
        console.log('DEBUG - OTM users already loading, waiting...');
        // Wait for the ongoing request
        let attempts = 0;
        while (_otmUsersCache.loading && attempts < 30) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            attempts++;
        }
        if (Array.isArray(_otmUsersCache.list) && _otmUsersCache.list.length > 0) {
            return _otmUsersCache.list;
        }
    }

    _otmUsersCache.loading = true;
    try {
        console.log('DEBUG - Fetching OTM users using OTMTokenService...');
        const response = await OTMTokenService.fetchUsers();
        console.log('DEBUG - Raw OTM users response:', response);
        
        // Extract users array from response
        let usersArray = [];
        if (Array.isArray(response)) {
            usersArray = response;
        } else if (response && Array.isArray(response.data)) {
            usersArray = response.data;
        } else if (response && typeof response === 'object') {
            // Look for array in various possible properties
            const candidates = ['data', 'items', 'result', 'rows', 'content', 'users', 'records', 'list'];
            for (const prop of candidates) {
                if (Array.isArray(response[prop])) {
                    usersArray = response[prop];
                    break;
                }
                // Check nested properties
                if (response[prop] && typeof response[prop] === 'object') {
                    for (const nestedProp of candidates) {
                        if (Array.isArray(response[prop][nestedProp])) {
                            usersArray = response[prop][nestedProp];
                            break;
                        }
                    }
                    if (usersArray.length > 0) break;
                }
            }
        }
        
        console.log('DEBUG - Extracted users array:', usersArray.length, 'users');
        
        // Transform and filter users
        const users = (usersArray || [])
            .map(u => ({
                id: u.id ?? u.taid ?? u.userid ?? u.userId ?? null,
                fullname: u.fullname || u.fullName || u.name || ''
            }))
            .filter(u => u.fullname && u.fullname.trim().length > 0);

        console.log('DEBUG - Processed users:', users.length, 'valid users');
        
        _otmUsersCache.list = users;
        _otmUsersCache.at = Date.now();
        return users;
        
    } catch (error) {
        console.error('DEBUG - Error fetching OTM users:', error);
        
        if (error.message === 'TOKEN_EXPIRED') {
            throw new Error('Token OTM đã hết hạn. Vui lòng đăng nhập lại OTM.');
        } else if (error.message === 'NO_TOKEN') {
            throw new Error('Không có token OTM. Vui lòng đăng nhập OTM trước.');
        }
        
        throw new Error('Không thể tải danh sách bác sĩ từ OTM: ' + error.message);
    } finally {
        _otmUsersCache.loading = false;
    }
}

function renderSurgeonManagement() {
    stylesOnce();
    return `
        <div class="dr-os-wrap">
            <div class="dr-os-row">
                <h3>Quản lý danh sách bác sĩ phẫu thuật</h3>
                <button class="dr-os-btn primary" id="dr-os-refresh">🔄 Làm mới danh sách</button>
            </div>
            <div class="dr-os-row">
                <input 
                    type="text" 
                    id="dr-os-search" 
                    class="dr-os-search" 
                    placeholder="Tìm kiếm bác sĩ..."
                    style="flex: 1; max-width: 300px;"
                />
                <button class="dr-os-btn" id="dr-os-select-all">Chọn tất cả</button>
                <button class="dr-os-btn" id="dr-os-clear-all">Bỏ chọn tất cả</button>
            </div>
            <div class="dr-os-columns">
                <div class="dr-os-selected">
                    <h4>Bác sĩ đã chọn (<span id="dr-os-selected-count">0</span>)</h4>
                    <div id="dr-os-selected-list">
                        <div class="dr-os-status">Đang tải...</div>
                    </div>
                </div>
                <div class="dr-os-list" id="dr-os-list">
                    <div class="dr-os-status">
                        <div class="dr-os-loading"></div>
                        Đang tải danh sách bác sĩ từ OTM...
                    </div>
                </div>
            </div>
        </div>
    `;
}

async function loadSurgeonsList() {
    const listEl = document.getElementById('dr-os-list');
    const selectedListEl = document.getElementById('dr-os-selected-list');
    const searchEl = document.getElementById('dr-os-search');

    try {
        // Show loading state
        if (listEl) {
            listEl.innerHTML = `
                <div class="dr-os-status">
                    <div class="dr-os-loading"></div>
                    Đang tải danh sách bác sĩ từ OTM...
                </div>
            `;
        }

        console.log('DEBUG - Starting OTM users fetch...');
        const users = await ensureOTMUsers();
        console.log('DEBUG - Loaded', users.length, 'OTM users');

        // Get currently selected surgeons
        const selectedSurgeons = await SurgeonSettingsService.getSelectedSurgeons();
        console.log('DEBUG - Currently selected surgeons:', selectedSurgeons);
        
        // Render selected surgeons
        renderSelectedSurgeons(selectedSurgeons, selectedListEl);
        
        // Render all surgeons list
        renderSurgeonsList(users, selectedSurgeons, listEl);
        
        // Set up search functionality
        if (searchEl) {
            searchEl.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase().trim();
                filterSurgeonsList(users, selectedSurgeons, query, listEl);
            });
        }

        console.log('DEBUG - Surgeon management loaded successfully');

    } catch (error) {
        console.error('DEBUG - Error loading surgeons list:', error);
        
        if (listEl) {
            listEl.innerHTML = `
                <div class="dr-os-error">
                    <p><strong>Lỗi:</strong> ${error.message}</p>
                    <button class="dr-os-btn" onclick="loadSurgeonsList()">Thử lại</button>
                </div>
            `;
        }
        
        if (selectedListEl) {
            selectedListEl.innerHTML = `
                <div class="dr-os-status">Không thể tải danh sách bác sĩ</div>
            `;
        }
    }
}

function renderSelectedSurgeons(selectedSurgeons, container) {
    if (!container) return;
    
    const countEl = document.getElementById('dr-os-selected-count');
    if (countEl) {
        countEl.textContent = selectedSurgeons.length.toString();
    }

    if (selectedSurgeons.length === 0) {
        container.innerHTML = '<div class="dr-os-status">Chưa chọn bác sĩ nào</div>';
        return;
    }

    const chipsHTML = selectedSurgeons.map(name => `
        <div class="dr-os-chip">
            ${name}
            <button onclick="removeSurgeon('${name.replace(/'/g, "\\'")}')">&times;</button>
        </div>
    `).join('');

    container.innerHTML = chipsHTML;
}

function renderSurgeonsList(users, selectedSurgeons, container) {
    if (!container) return;
    
    filterSurgeonsList(users, selectedSurgeons, '', container);
}

function filterSurgeonsList(users, selectedSurgeons, query, container) {
    if (!container) return;
    
    const selectedSet = new Set(selectedSurgeons.map(name => name.toLowerCase()));
    
    let filteredUsers = users.filter(user => {
        const nameMatch = !query || user.fullname.toLowerCase().includes(query);
        const notSelected = !selectedSet.has(user.fullname.toLowerCase());
        return nameMatch && notSelected;
    });

    if (filteredUsers.length === 0) {
        const message = query ? 
            `Không tìm thấy bác sĩ nào với từ khóa "${query}"` : 
            'Tất cả bác sĩ đã được chọn';
        container.innerHTML = `<div class="dr-os-status">${message}</div>`;
        return;
    }

    const itemsHTML = filteredUsers.map(user => `
        <div class="dr-os-item">
            <div style="flex: 1;">
                <strong>${user.fullname}</strong>
                ${user.id ? `<div style="font-size: 12px; color: #6b7280;">ID: ${user.id}</div>` : ''}
            </div>
            <button class="dr-os-btn primary" onclick="addSurgeon('${user.fullname.replace(/'/g, "\\'")}')">
                Thêm
            </button>
        </div>
    `).join('');

    container.innerHTML = itemsHTML;
}

// Global functions for button handlers
window.addSurgeon = async function(name) {
    try {
        console.log('DEBUG - Adding surgeon:', name);
        const selectedSurgeons = await SurgeonSettingsService.getSelectedSurgeons();
        
        if (selectedSurgeons.includes(name)) {
            console.log('DEBUG - Surgeon already selected:', name);
            return;
        }

        const newSelected = [...selectedSurgeons, name];
        await SurgeonSettingsService.saveSelectedSurgeons(newSelected);
        console.log('DEBUG - Surgeon added successfully:', name);
        
        // Reload the lists
        loadSurgeonsList();

    } catch (error) {
        console.error('DEBUG - Error adding surgeon:', error);
        alert('Không thể thêm bác sĩ: ' + error.message);
    }
};

window.removeSurgeon = async function(name) {
    try {
        console.log('DEBUG - Removing surgeon:', name);
        const selectedSurgeons = await SurgeonSettingsService.getSelectedSurgeons();
        const newSelected = selectedSurgeons.filter(s => s !== name);
        
        await SurgeonSettingsService.saveSelectedSurgeons(newSelected);
        console.log('DEBUG - Surgeon removed successfully:', name);
        
        // Reload the lists
        loadSurgeonsList();

    } catch (error) {
        console.error('DEBUG - Error removing surgeon:', error);
        alert('Không thể xóa bác sĩ: ' + error.message);
    }
};

function attachEventListeners() {
    const refreshBtn = document.getElementById('dr-os-refresh');
    const selectAllBtn = document.getElementById('dr-os-select-all');
    const clearAllBtn = document.getElementById('dr-os-clear-all');

    if (refreshBtn) {
        refreshBtn.addEventListener('click', async () => {
            console.log('DEBUG - Refresh button clicked, clearing cache');
            // Clear cache and reload
            _otmUsersCache.list = null;
            _otmUsersCache.at = 0;
            await loadSurgeonsList();
        });
    }

    if (selectAllBtn) {
        selectAllBtn.addEventListener('click', async () => {
            try {
                const users = await ensureOTMUsers();
                const allNames = users.map(u => u.fullname);
                await SurgeonSettingsService.saveSelectedSurgeons(allNames);
                loadSurgeonsList();
            } catch (error) {
                alert('Không thể chọn tất cả: ' + error.message);
            }
        });
    }

    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', async () => {
            try {
                await SurgeonSettingsService.saveSelectedSurgeons([]);
                loadSurgeonsList();
            } catch (error) {
                alert('Không thể bỏ chọn tất cả: ' + error.message);
            }
        });
    }
}

function initSurgeonManagement() {
    console.log('DEBUG - Initializing OTM surgeon management with OTMTokenService');
    
    const container = document.createElement('div');
    container.innerHTML = renderSurgeonManagement();
    
    // Replace or append to current content
    const existingContent = document.querySelector('.dr-os-wrap');
    if (existingContent) {
        existingContent.replaceWith(container.firstElementChild);
    } else {
        document.body.appendChild(container.firstElementChild);
    }
    
    // Attach event listeners
    attachEventListeners();
    
    // Load data
    loadSurgeonsList();
}

module.exports = {
    initSurgeonManagement,
    renderSurgeonManagement,
    loadSurgeonsList,
    ensureOTMUsers
};

},{"../services/otm.token":28,"../services/surgeonSettingsService":33,"../utils/khoaUtils":41}],26:[function(require,module,exports){
// apiService.js - Centralized API service
const { getSelectedKhoa } = require('../utils/khoaUtils');

const ApiService = {
    /**
     * Load list of khoa/phòng (departments)
     */
    async fetchKhoaPhong() {
        const body = new URLSearchParams();
        body.set('loaibn', '');
        body.set('makp', '');
        const res = await fetch('/ToDieuTri/LoadKhoaPhong', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': '*/*'
            },
            body
        });
        const json = await res.json();
        return (json && json.data) || [];
    },

    /**
     * Load rooms by khoa id
     */
    async fetchRoomsByKhoa(khoaId) {
        const body = new URLSearchParams();
        body.set('code', String(khoaId || ''));
        const res = await fetch('/ToDieuTri/LoadRoom', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': '*/*'
            },
            body
        });
        const json = await res.json();
        return (json && json.data) || [];
    },
    /**
     * Fetch patient data from ToDieuTri endpoint
     */
    async fetchToDieuTriData() {
        try {
            const formData = new FormData();
            const khoa = getSelectedKhoa('551');
            formData.append('khoa', khoa);
            formData.append('tk', '0');
            formData.append('cbAll', '1');

            const response = await fetch('/ToDieuTri/Search', {
                method: 'POST',
                body: formData,
                credentials: 'include',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': '*/*'
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            let data;
            const contentType = response.headers.get('content-type');
            
            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                data = await response.text();
            }

            return data;
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu ToDieuTri:', error);
            throw error;
        }
    },

    /**
     * Update checklist data
     */
    async updateChecklistData(oldData, checklistState, { signal } = {}) {
        try {
            const formData = new FormData();
            
            // Add all old data fields
            for (const key in oldData) {
                if (Object.prototype.hasOwnProperty.call(oldData, key)) {
                    formData.append(key.toLowerCase(), oldData[key] == null ? '' : oldData[key]);
                }
            }
            
            // Update checklist state
            formData.set('chuky', JSON.stringify(checklistState));

            const response = await fetch('/ERM_PHIEUCCTHONGTINVACAMKETNHAPVIEN/EditAjax', {
                method: 'POST',
                credentials: 'include',
                body: formData,
                signal
            });

            return response.json();
        } catch (error) {
            console.error('Lỗi cập nhật checklist phiếu:', error);
            throw error;
        }
    },

    /**
     * Create new checklist for patient
     */
    async createChecklistForPatient(patient) {
        try {
            const formData = new FormData();
            formData.append('status', '1');
            formData.append('thebaohiemyte', patient.thebaohiemyte || 'Không');
            formData.append('chuky', '{}');
            formData.append('khac', '--*--');
            formData.append('khu', patient.khu || '1');
            formData.append('mabn', patient.mabn + 9898);
            formData.append('bieumauid', '027');
            // prefer patient's makp; fallback to selected khoa
            const makp = (patient.makp || getSelectedKhoa('551'));
            formData.append('makp', makp);
            formData.append('__model', 'TAH.Entity.Model.PHIEUCCTHONGTINVACAMKETNHAPVIEN.ERM_PHIEUCCTHONGTINVACAMKETNHAPVIEN');
            formData.append('actiontype', '');
            formData.append('hoten', (patient.hoten || '') + "%");
            formData.append('ngaysinh', '10/10/1999');
            formData.append('gioitinh', patient.phai === 1 ? 'Nữ' : 'Nam');
            formData.append('diachi', patient.diachi || '');
            formData.append('sdt', patient.sdt || '');

            const response = await fetch('/ERM_PHIEUCCTHONGTINVACAMKETNHAPVIEN/CreateAjax', {
                method: 'POST',
                credentials: 'include',
                body: formData
            });

            return response.json();
        } catch (error) {
            console.error('Lỗi tạo mới checklist phiếu:', error);
            throw error;
        }
    }
};

module.exports = ApiService;

},{"../utils/khoaUtils":41}],27:[function(require,module,exports){
// checklistService.js - Centralized checklist management

const DateUtils = require('../utils/dateUtils');
const ApiService = require('./apiService');
const SaveQueue = require('./saveQueue');

// In-memory cache to dedupe checklist fetches per patient and date range
const _checklistCache = new Map();
function _makeCacheKey(mabn, tungay, denngay) {
    return `${String(mabn)}|${String(tungay)}|${String(denngay)}`;
}

const ChecklistService = {
    // Expose small helpers for cache invalidation (internal use)
    _invalidateCacheForMabn(mabn) {
        try {
            const prefix = `${String(mabn)}|`;
            for (const key of _checklistCache.keys()) {
                if (key.startsWith(prefix)) _checklistCache.delete(key);
            }
        } catch (_) {}
    },

    async drainSaveQueue() {
        return await SaveQueue.drain(async ({ checklistObj, checklistState }) => {
            try {
                const res = await ApiService.updateChecklistData(checklistObj, checklistState);
                const ok = res && (res.Status == 1 || res.isValid);
                if (ok) {
                    try {
                        const mabn = checklistObj && (checklistObj.mabn || checklistObj.MABN || checklistObj.MaBN);
                        let ngayvv = (checklistObj && (checklistObj.tungay || checklistObj.ngayvv || checklistObj.NgayVV)) || null;
                        if (mabn) {
                            if (ngayvv) {
                                const { tungay, denngay } = DateUtils.getChecklistDateRange(ngayvv);
                                const key = _makeCacheKey(mabn, tungay, denngay);
                                _checklistCache.delete(key);
                            }
                            this._invalidateCacheForMabn(mabn);
                        }
                    } catch (_) {}
                }
                return ok;
            } catch (_) {
                return false;
            }
        });
    },
    /**
     * Load checklist data for a patient
     */
    async loadChecklistData(patient, options = {}) {
        const originalMabn = patient.mabn;
        const mabnWith9898 = patient.mabn + 9898;
        const { tungay, denngay } = DateUtils.getChecklistDateRange(patient.ngayvv);
        console.log('DEBUG - DateUtils.getChecklistDateRange result:', {
            inputNgayvv: patient.ngayvv,
            outputTungay: tungay,
            outputDenngay: denngay
        });
        console.log('DEBUG - Trying both mabn formats:', { originalMabn, mabnWith9898 });

        const cacheKey = _makeCacheKey(originalMabn, tungay, denngay);
        if (options && options.forceRefresh) {
            _checklistCache.delete(cacheKey);
        }
        if (_checklistCache.has(cacheKey)) {
            console.log('DEBUG - Returning cached/inflight checklist response for', cacheKey);
            return _checklistCache.get(cacheKey);
        }

        const inflight = (async () => {
            // First try with 9898 suffix
            const formData = new FormData();
            formData.append('mabn', mabnWith9898);
            formData.append('tungay', tungay);
            formData.append('denngay', denngay);
            const response = await fetch('/DanhSachBenhNhan/DSPhieuCCThongTinVaCamKetNhapVien', {
                method: 'POST',
                credentials: 'include',
                body: formData
            });
            const result = await response.json();
            console.log('DEBUG - ChecklistService.loadChecklistData API response (with 9898):', result);
            if (!result.data || result.data.length === 0) {
                // Fallback without 9898
                const fallbackFormData = new FormData();
                fallbackFormData.append('mabn', originalMabn);
                fallbackFormData.append('tungay', tungay);
                fallbackFormData.append('denngay', denngay);
                const fallbackResponse = await fetch('/DanhSachBenhNhan/DSPhieuCCThongTinVaCamKetNhapVien', {
                    method: 'POST',
                    credentials: 'include',
                    body: fallbackFormData
                });
                const fallbackResult = await fallbackResponse.json();
                console.log('DEBUG - ChecklistService.loadChecklistData API response (original mabn):', fallbackResult);
                return fallbackResult;
            }
            return result;
        })();

        _checklistCache.set(cacheKey, inflight);
        try {
            const finalRes = await inflight;
            // Store resolved promise for subsequent reuse
            _checklistCache.set(cacheKey, Promise.resolve(finalRes));
            return finalRes;
        } catch (e) {
            _checklistCache.delete(cacheKey);
            throw e;
        }
    },

    /**
     * Find existing checklist object from response data
     */
    findChecklistObject(responseData) {
        console.log('DEBUG - findChecklistObject input:', responseData);
        
        if (!responseData.data || !Array.isArray(responseData.data) || responseData.data.length === 0) {
            console.log('DEBUG - No data array or empty array');
            return null;
        }

        console.log('DEBUG - Searching through', responseData.data.length, 'checklist objects');
        
        for (let i = 0; i < responseData.data.length; i++) {
            const item = responseData.data[i];
            console.log(`DEBUG - Checklist object ${i}:`, item);
            
            if (typeof item.hoten === 'string' && item.hoten.trim().endsWith('%')) {
                console.log('DEBUG - Found matching checklist object with hoten ending with %');
                return item;
            }
        }
        
        console.log('DEBUG - No matching checklist object found');
        return null;
    },

    /**
     * Parse checklist state from checklist object
     */
    parseChecklistState(checklistObj) {
        let state = {};
        if (checklistObj && checklistObj.chuky) {
            try {
                state = JSON.parse(checklistObj.chuky);
            } catch (e) {
                console.warn('Failed to parse checklist state:', e);
                state = {};
            }
        }
        return state;
    },

    /**
     * Load checklist state for a patient (combination of loadChecklistData and parseChecklistState)
     */
    async loadChecklistState(checklistObj) {
        try {
            // If we already have a checklist object, just parse its state
            if (checklistObj && checklistObj.chuky) {
                return this.parseChecklistState(checklistObj);
            }

            // Otherwise, we need to construct a patient object and load data
            const patient = {
                mabn: checklistObj.mabn,
                mavaovien: checklistObj.mavaovien,
                ngayvv: checklistObj.tungay // Use tungay as ngayvv for date range calculation
            };

            console.log('DEBUG - checklistService.loadChecklistState patient object:', patient);

            const responseData = await this.loadChecklistData(patient);
            const foundChecklistObj = this.findChecklistObject(responseData);
            
            if (foundChecklistObj) {
                return this.parseChecklistState(foundChecklistObj);
            }
            
            return null;
        } catch (error) {
            console.warn('Failed to load checklist state:', error);
            return null;
        }
    },

    /**
     * Update checklist state on server
     */
    _locks: new Map(), // mabn -> Promise chain for serialization

    async updateChecklistState(checklistObj, checklistState, options = {}) {
        const { enqueueOnOffline = true, signal, ctxId, clientVersion = Date.now() } = options || {};
        const mabn = checklistObj && (checklistObj.mabn || checklistObj.MABN || checklistObj.MaBN);
        // If offline, queue and return
        if (enqueueOnOffline && typeof navigator !== 'undefined' && navigator && navigator.onLine === false) {
            SaveQueue.enqueueUpdate(checklistObj, checklistState);
            return { ok: false, queued: true, clientVersion };
        }
        const send = async () => {
            const result = await ApiService.updateChecklistData(checklistObj, checklistState, { signal });
            const ok = result && (result.Status == 1 || result.isValid);
            return { ok, queued: false, clientVersion };
        };
        // Serialize per patient to avoid races
        if (mabn) {
            const prev = this._locks.get(mabn) || Promise.resolve();
            const next = prev.then(send, send);
            this._locks.set(mabn, next.catch(() => {}));
            try {
                const res = await next;
                if (res.ok) {
                    // Invalidate cache when saved
                    try {
                        let ngayvv = (checklistObj && (checklistObj.tungay || checklistObj.ngayvv || checklistObj.NgayVV)) || null;
                        if (ngayvv) {
                            const { tungay, denngay } = DateUtils.getChecklistDateRange(ngayvv);
                            const key = _makeCacheKey(mabn, tungay, denngay);
                            _checklistCache.delete(key);
                        }
                        this._invalidateCacheForMabn(mabn);
                    } catch (_) {}
                }
                return res;
            } catch (error) {
                console.error('Failed to update checklist state:', error);
                // Network error: queue if allowed
                if (enqueueOnOffline) {
                    SaveQueue.enqueueUpdate(checklistObj, checklistState);
                    return { ok: false, queued: true, clientVersion };
                }
                return { ok: false, queued: false, clientVersion };
            }
        } else {
            try {
                return await send();
            } catch (error) {
                console.error('Failed to update checklist state:', error);
                if (enqueueOnOffline) {
                    SaveQueue.enqueueUpdate(checklistObj, checklistState);
                    return { ok: false, queued: true, clientVersion };
                }
                return { ok: false, queued: false, clientVersion };
            }
        }
    },

    /**
     * Create new checklist for patient
     */
    async createNewChecklist(patient) {
        try {
            const result = await ApiService.createChecklistForPatient(patient);
            return result && result.isValid;
        } catch (error) {
            console.error('Failed to create new checklist:', error);
            return false;
        }
    }
};

module.exports = ChecklistService;

},{"../utils/dateUtils":37,"./apiService":26,"./saveQueue":31}],28:[function(require,module,exports){
// otm.token.js - OTM Token management service
// This service manages OTM authentication tokens and direct API access

const ApiService = require('./apiService');

// Special MABN identifier for OTM token storage
const OTM_TOKEN_MABN = '%9191_otm_token';

// In-memory token cache to avoid frequent API calls
let _tokenCache = {
    token: null,
    expiry: 0,
    lastValidated: 0
};

// Token validation interval (5 minutes)
const TOKEN_VALIDATION_INTERVAL = 5 * 60 * 1000;

const OTMTokenService = {
    /**
     * Check if a token appears to be valid (basic format validation)
     */
    _isLikelyValidToken(token) {
        try {
            if (typeof token !== 'string') return false;
            const t = token.trim();
            if (!t) return false;
            const low = t.toLowerCase();
            if (low === 'undefined' || low === 'null') return false;
            if (t.length < 16) return false; // heuristic: tokens are typically long
            // avoid whitespace in token
            if (/\s/.test(t)) return false;
            return true;
        } catch { 
            return false; 
        }
    },

    /**
     * Get stored OTM token from our API service
     */
    async getStoredToken() {
        try {
            // Use fixed dates as per requirement: tungay và denngay là 10/10/1010 10:10
            const tungay = '1010-10-10 10:10';
            const denngay = '1010-10-10 10:10';
            
            const formData = new FormData();
            formData.append('mabn', OTM_TOKEN_MABN);
            formData.append('tungay', tungay);
            formData.append('denngay', denngay);
            
            const response = await fetch('/DanhSachBenhNhan/DSPhieuCCThongTinVaCamKetNhapVien', {
                method: 'POST',
                credentials: 'include',
                body: formData
            });
            
            const result = await response.json();
            console.log('DEBUG - OTM Token retrieve API response:', result);
            
            if (result.data && Array.isArray(result.data) && result.data.length > 0) {
                // Find the token record (similar to findChecklistObject)
                const tokenRecord = result.data.find(item => 
                    item.hoten && item.hoten.includes('OTM_TOKEN')
                );
                
                if (tokenRecord && tokenRecord.chuky) {
                    try {
                        const tokenData = JSON.parse(tokenRecord.chuky);
                        if (tokenData.token && this._isLikelyValidToken(tokenData.token)) {
                            console.log('DEBUG - Retrieved valid OTM token from storage');
                            return {
                                token: tokenData.token,
                                expiry: tokenData.expiry || 0,
                                checklistObj: tokenRecord
                            };
                        }
                    } catch (e) {
                        console.error('DEBUG - Error parsing stored token data:', e);
                    }
                }
            }
            
            return null;
        } catch (error) {
            console.error('DEBUG - Error retrieving stored OTM token:', error);
            return null;
        }
    },

    /**
     * Save OTM token to our API service
     */
    async saveToken(token, expiry = null) {
        try {
            if (!this._isLikelyValidToken(token)) {
                console.error('DEBUG - Refusing to save invalid OTM token');
                return false;
            }

            // Calculate expiry if not provided (default: 24 hours from now)
            if (!expiry) {
                expiry = Date.now() + (24 * 60 * 60 * 1000);
            }

            const tokenData = {
                token: token,
                expiry: expiry,
                savedAt: Date.now()
            };

            // First, try to get existing record
            const existing = await this.getStoredToken();
            
            let checklistObj;
            if (existing && existing.checklistObj) {
                // Update existing record
                checklistObj = existing.checklistObj;
            } else {
                // Create new record structure with fixed dates: 10/10/1010 10:10
                const fixedDate = '1010-10-10';
                const fixedDateTime = '1010-10-10 10:10';
                checklistObj = {
                    mabn: OTM_TOKEN_MABN,
                    hoten: 'OTM_TOKEN_STORAGE',
                    ngaysinh: fixedDate,
                    gioitinh: '1',
                    diachi: 'SYSTEM_GENERATED',
                    ngayvv: fixedDate,
                    tungay: fixedDateTime,
                    denngay: fixedDateTime,
                    chuky: JSON.stringify(tokenData)
                };
            }

            // Update the token data
            checklistObj.chuky = JSON.stringify(tokenData);

            // Save using the same pattern as ChecklistService
            const result = await ApiService.updateChecklistData(checklistObj, tokenData);
            
            if (result && (result.Status == 1 || result.isValid)) {
                console.log('DEBUG - OTM token saved successfully');
                // Update in-memory cache
                _tokenCache = {
                    token: token,
                    expiry: expiry,
                    lastValidated: Date.now()
                };
                return true;
            } else {
                console.error('DEBUG - Failed to save OTM token:', result);
                return false;
            }
        } catch (error) {
            console.error('DEBUG - Error saving OTM token:', error);
            return false;
        }
    },

    /**
     * Test if a token is valid by making a test API call
     */
    async validateToken(token) {
        try {
            if (!this._isLikelyValidToken(token)) {
                return false;
            }

            // Use GM_xmlhttpRequest for cross-origin request if available
            return new Promise((resolve) => {
                const testUrl = `https://otm.tahospital.vn/api/booking/roomwithdepartment?_=${Date.now()}`;
                
                if (typeof GM_xmlhttpRequest !== 'undefined') {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: testUrl,
                        headers: {
                            'accept': 'application/json, text/plain, */*',
                            'authorization': `Bearer ${token}`,
                            'logintype': '2',
                            'siteid': '1',
                            'cache-control': 'no-cache'
                        },
                        timeout: 10000,
                        onload: function(response) {
                            console.log('DEBUG - Token validation response:', response.status);
                            resolve(response.status >= 200 && response.status < 300);
                        },
                        onerror: function() {
                            console.log('DEBUG - Token validation failed - network error');
                            resolve(false);
                        },
                        ontimeout: function() {
                            console.log('DEBUG - Token validation timed out');
                            resolve(false);
                        }
                    });
                } else {
                    // Fallback - this might fail due to CORS, but try anyway
                    fetch(testUrl, {
                        method: 'GET',
                        headers: {
                            'accept': 'application/json, text/plain, */*',
                            'authorization': `Bearer ${token}`,
                            'logintype': '2',
                            'siteid': '1'
                        },
                        mode: 'cors',
                        credentials: 'include'
                    })
                    .then(response => {
                        console.log('DEBUG - Token validation response (fetch):', response.status);
                        resolve(response.status >= 200 && response.status < 300);
                    })
                    .catch(() => {
                        console.log('DEBUG - Token validation failed (fetch)');
                        resolve(false);
                    });
                }
            });
        } catch (error) {
            console.error('DEBUG - Error validating token:', error);
            return false;
        }
    },

    /**
     * Get a valid OTM token - from cache, storage, or by opening OTM tab
     */
    async getValidToken() {
        const now = Date.now();
        
        // Check in-memory cache first
        if (_tokenCache.token && 
            _tokenCache.expiry > now && 
            (now - _tokenCache.lastValidated) < TOKEN_VALIDATION_INTERVAL) {
            console.log('DEBUG - Using cached OTM token');
            return _tokenCache.token;
        }

        // Try to get from storage
        const stored = await this.getStoredToken();
        if (stored && stored.token && stored.expiry > now) {
            // Validate the stored token
            const isValid = await this.validateToken(stored.token);
            if (isValid) {
                console.log('DEBUG - Using stored OTM token');
                _tokenCache = {
                    token: stored.token,
                    expiry: stored.expiry,
                    lastValidated: now
                };
                return stored.token;
            } else {
                console.log('DEBUG - Stored token is invalid, need to refresh');
            }
        }

        // Need to get a fresh token by opening OTM tab
        console.log('DEBUG - Need to open OTM tab to get fresh token');
        return await this._getTokenFromOTMTab();
    },

    /**
     * Open OTM tab to obtain a fresh token (based on existing openOTMSurgeriesTab pattern)
     */
    async _getTokenFromOTMTab() {
        return new Promise((resolve, reject) => {
            let resolved = false;
            const timeout = setTimeout(() => {
                if (!resolved) {
                    resolved = true;
                    reject(new Error('Token fetch timeout'));
                }
            }, 30000); // 30 second timeout

            // Subscribe to OTM messages (based on existing subscribeOTMMessages pattern)
            const unsubscribe = this._subscribeToTokenMessages(
                (tokenData) => {
                    if (!resolved) {
                        resolved = true;
                        clearTimeout(timeout);
                        unsubscribe();
                        
                        if (tokenData && tokenData.token) {
                            console.log('DEBUG - Received token from OTM tab');
                            // Save the new token
                            this.saveToken(tokenData.token, tokenData.expiry);
                            resolve(tokenData.token);
                        } else {
                            reject(new Error('No token received from OTM tab'));
                        }
                    }
                },
                (error) => {
                    if (!resolved) {
                        resolved = true;
                        clearTimeout(timeout);
                        unsubscribe();
                        reject(new Error(error || 'OTM token fetch failed'));
                    }
                }
            );

            // Open OTM tab with token fetch request
            const payload = encodeURIComponent(JSON.stringify({ 
                action: 'getToken',
                preferToken: true 
            }));
            const url = `https://otm.tahospital.vn/?otm-token=${payload}`;
            
            if (typeof GM !== 'undefined' && GM.openInTab) {
                try {
                    GM.openInTab(url, { active: false, insert: true, setParent: true });
                } catch (e) {
                    window.open(url, '_blank');
                }
            } else {
                window.open(url, '_blank');
            }
        });
    },

    /**
     * Subscribe to token messages from OTM tab (similar to subscribeOTMMessages)
     */
    _subscribeToTokenMessages(onSuccess, onError) {
        try {
            if (typeof GM !== 'undefined' && GM.addValueChangeListener) {
                const unsubIds = [];
                
                unsubIds.push(GM.addValueChangeListener('otm_token_success', (n, o, v) => {
                    try {
                        const parsed = typeof v === 'string' ? JSON.parse(v) : v;
                        onSuccess && onSuccess(parsed && parsed.data);
                    } catch(_) {}
                }));
                
                unsubIds.push(GM.addValueChangeListener('otm_token_error', (n, o, v) => {
                    try {
                        const parsed = typeof v === 'string' ? JSON.parse(v) : v;
                        onError && onError(parsed && parsed.data);
                    } catch(_) {}
                }));
                
                return () => {
                    try {
                        unsubIds.forEach(id => {
                            try {
                                GM.removeValueChangeListener && GM.removeValueChangeListener(id);
                            } catch(_) {}
                        });
                    } catch(_) {}
                };
            }
        } catch(_) {}

        // Fallback localStorage polling
        const tid = setInterval(() => {
            try {
                const s = localStorage.getItem('otm_token_success');
                if (s) {
                    localStorage.removeItem('otm_token_success');
                    const p = JSON.parse(s);
                    onSuccess && onSuccess(p && p.data);
                }
                
                const er = localStorage.getItem('otm_token_error');
                if (er) {
                    localStorage.removeItem('otm_token_error');
                    const p = JSON.parse(er);
                    onError && onError(p && p.data);
                }
            } catch(_) {}
        }, 800);
        
        return () => clearInterval(tid);
    },

    /**
     * Make an OTM API request using GM_xmlhttpRequest with automatic token handling
     */
    async makeOTMRequest(url, options = {}) {
        try {
            const token = await this.getValidToken();
            if (!token) {
                throw new Error('No valid OTM token available');
            }

            return new Promise((resolve, reject) => {
                const requestOptions = {
                    method: options.method || 'GET',
                    url: url,
                    headers: {
                        'accept': 'application/json, text/plain, */*',
                        'authorization': `Bearer ${token}`,
                        'logintype': '2',
                        'siteid': '1',
                        'cache-control': 'no-cache',
                        ...options.headers
                    },
                    timeout: options.timeout || 30000
                };

                // Add body for POST requests
                if (options.body) {
                    if (typeof options.body === 'string') {
                        requestOptions.data = options.body;
                    } else {
                        requestOptions.data = JSON.stringify(options.body);
                        requestOptions.headers['content-type'] = 'application/json';
                    }
                }

                if (typeof GM_xmlhttpRequest !== 'undefined') {
                    GM_xmlhttpRequest({
                        ...requestOptions,
                        onload: function(response) {
                            console.log('DEBUG - OTM API response:', response.status, url);
                            
                            if (response.status >= 200 && response.status < 300) {
                                try {
                                    const data = JSON.parse(response.responseText);
                                    resolve(data);
                                } catch (e) {
                                    resolve(response.responseText);
                                }
                            } else if (response.status === 401 || response.status === 403) {
                                // Token expired, clear cache and retry once
                                console.log('DEBUG - Token expired, clearing cache');
                                _tokenCache = { token: null, expiry: 0, lastValidated: 0 };
                                reject(new Error('TOKEN_EXPIRED'));
                            } else {
                                reject(new Error(`HTTP ${response.status}: ${response.statusText}`));
                            }
                        },
                        onerror: function(error) {
                            reject(error);
                        },
                        ontimeout: function() {
                            reject(new Error('REQUEST_TIMEOUT'));
                        }
                    });
                } else {
                    // Fallback to fetch (might fail due to CORS)
                    fetch(url, {
                        method: requestOptions.method,
                        headers: requestOptions.headers,
                        body: requestOptions.data,
                        mode: 'cors',
                        credentials: 'include'
                    })
                    .then(response => {
                        if (response.ok) {
                            return response.json().catch(() => response.text());
                        } else if (response.status === 401 || response.status === 403) {
                            _tokenCache = { token: null, expiry: 0, lastValidated: 0 };
                            throw new Error('TOKEN_EXPIRED');
                        } else {
                            throw new Error(`HTTP ${response.status}`);
                        }
                    })
                    .then(resolve)
                    .catch(reject);
                }
            });
        } catch (error) {
            console.error('DEBUG - OTM API request error:', error);
            throw error;
        }
    },

    /**
     * Convenience method: Fetch surgery data for date range
     */
    async fetchSurgeries(fromDate, toDate) {
        const fromISO = fromDate ? new Date(fromDate).toISOString().replace('T00:00:00.000Z', 'T17:00:00.000Z') : null;
        const toISO = toDate ? new Date(toDate).toISOString().replace('T00:00:00.000Z', 'T17:00:00.000Z') : null;
        
        if (fromISO && toISO) {
            // Range request
            const url = `https://otm.tahospital.vn/api/booking?from=${fromISO}&to=${toISO}&_=${Date.now()}`;
            return await this.makeOTMRequest(url);
        } else if (fromISO) {
            // Single date
            const url = `https://otm.tahospital.vn/api/booking?date=${fromISO}&_=${Date.now()}`;
            return await this.makeOTMRequest(url);
        } else {
            // Today
            const today = new Date().toISOString().replace('T00:00:00.000Z', 'T17:00:00.000Z');
            const url = `https://otm.tahospital.vn/api/booking?date=${today}&_=${Date.now()}`;
            return await this.makeOTMRequest(url);
        }
    },

    /**
     * Convenience method: Fetch OTM users list
     */
    async fetchUsers() {
        const url = `https://otm.tahospital.vn/api/user?ishsoft=null&page=1&limit=10000&_=${Date.now()}`;
        return await this.makeOTMRequest(url);
    },

    /**
     * Convenience method: Fetch rooms with department info
     */
    async fetchRoomsWithDepartment() {
        const url = `https://otm.tahospital.vn/api/booking/roomwithdepartment?_=${Date.now()}`;
        return await this.makeOTMRequest(url);
    }
};

module.exports = OTMTokenService;

},{"./apiService":26}],29:[function(require,module,exports){
// patientService.js - Centralized patient data fetching

const { fetchToDieuTriData } = require('../pages/page.dashboard.support');
const PatientDataMapper = require('../utils/patientDataMapper');
const LoginHandler = require('../components/loginHandler');
const ChecklistService = require('./checklistService');

const PatientService = {
    /**
     * Fetch and process patient data
     */
    async fetchPatientData() {
        try {
            const data = await fetchToDieuTriData();
            console.log('Dữ liệu ToDieuTri đã được lấy:', data);
            
            let arr = Array.isArray(data) ? data : (data && data.data ? data.data : []);
            
            if (!arr || arr.length === 0) {
                return [];
            }

            // DEBUG: Check raw tungay format before mapping
            console.log('DEBUG - Raw tungay format from API:');
            arr.slice(0, 3).forEach((item, index) => {
                console.log(`Raw item ${index + 1} - mabn: ${item.mabn}, tungay: ${item.tungay}, typeof: ${typeof item.tungay}`);
            });

            return PatientDataMapper.mapPatientArray(arr);
        } catch (error) {
            console.error('Error fetching patient data:', error);
            throw error;
        }
    },

    /**
     * Enrich patient data with checklist information including surgery data
     */
    async enrichPatientDataWithChecklist(patients) {
        if (!Array.isArray(patients) || patients.length === 0) {
            return patients;
        }

        console.log('Starting to enrich patient data with checklist information for', patients.length, 'patients');

        // DEBUG: Check tungay format in the first few patients
        console.log('DEBUG - Sample patient data tungay format:');
        patients.slice(0, 3).forEach((patient, index) => {
            console.log(`Patient ${index + 1} - mabn: ${patient.mabn}, tungay: ${patient.tungay}, typeof: ${typeof patient.tungay}`);
        });

        // Process patients in batches to avoid overwhelming the server
        const batchSize = 5;
        const enrichedPatients = [...patients]; // Copy array to avoid mutation

        for (let i = 0; i < patients.length; i += batchSize) {
            const batch = patients.slice(i, i + batchSize);
            console.log(`Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(patients.length/batchSize)}`);
            
            const batchPromises = batch.map(async (patient, batchIndex) => {
                const actualIndex = i + batchIndex;
                try {
                    // Create checklist object for this patient
                    // Use patient's ngayvv (actual admission date) instead of old tungay
                    console.log('DEBUG - Patient ngayvv:', patient.ngayvv);
                    console.log('DEBUG - Background enrichment patient object:', JSON.stringify(patient, null, 2));
                    
                    const checklistObj = {
                        mabn: patient.mabn,
                        mavaovien: patient.mavaovien,
                        tungay: patient.ngayvv // Use ngayvv (admission date) instead of tungay
                    };

                    console.log('Loading checklist for patient:', patient.mabn, 'with ngayvv:', patient.ngayvv);

                    // Load checklist state
                    const checklistState = await ChecklistService.loadChecklistState(checklistObj);
                    if (checklistState) {
                        console.log('Checklist state loaded for patient:', patient.mabn, checklistState);
                        
                        // Store checklist state for y lệnh tags
                        enrichedPatients[actualIndex].checklistState = checklistState;
                        
                        // Map surgery data from checklist
                        const surgeryData = PatientDataMapper.mapPhauThuatData(checklistState);
                        if (surgeryData) {
                            console.log('Surgery data mapped for patient:', patient.mabn, surgeryData);
                            enrichedPatients[actualIndex].phauThuatInfo = surgeryData;
                        } else {
                            console.log('No surgery data found for patient:', patient.mabn);
                        }
                    } else {
                        console.log('No checklist state found for patient:', patient.mabn);
                    }
                } catch (error) {
                    console.warn('Failed to load checklist for patient:', patient.mabn, error);
                }
            });

            // Wait for current batch to complete before proceeding
            await Promise.all(batchPromises);
            
            // Small delay between batches to be nice to the server
            if (i + batchSize < patients.length) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }

        console.log('Enrichment completed. Patients with surgery info:', 
            enrichedPatients.filter(p => p.phauThuatInfo).length);

        // Check for celebration animations after enrichment
        setTimeout(() => {
            if (typeof window.checkAllCelebrationAnimations === 'function') {
                window.checkAllCelebrationAnimations(enrichedPatients);
            }
        }, 200);

        return enrichedPatients;
    },

    /**
     * Get patient data from window.dr_data or fetch from API
     */
    async getPatientData() {
        // Check if data already exists in window
        if (window.dr_data && Array.isArray(window.dr_data) && window.dr_data.length > 0) {
            return window.dr_data;
        }

        // Check if fetch function is available
        if (typeof fetchToDieuTriData !== 'function') {
            throw new Error('fetchToDieuTriData function not available');
        }

        // Fetch basic patient data from API first (fast)
        const basicData = await this.fetchPatientData();
        
        // Store basic data immediately for fast initial render
        window.dr_data = basicData;
        
        // Start enrichment in background (don't wait for it)
        this.enrichPatientDataInBackground(basicData);
        
        return basicData;
    },

    /**
     * Enrich patient data in background without blocking initial render
     */
    async enrichPatientDataInBackground(patients) {
        console.log('Starting background enrichment for', patients.length, 'patients');
        
        try {
            const enrichedData = await this.enrichPatientDataWithChecklist(patients);
            
            // Update the global data
            window.dr_data = enrichedData;
            
            // Trigger re-render of cards with updated data
            if (typeof unsafeWindow !== 'undefined' && typeof unsafeWindow.refreshPatientCards === 'function') {
                unsafeWindow.refreshPatientCards(enrichedData);
            } else if (typeof this !== 'undefined' && typeof this.refreshPatientCards === 'function') {
                this.refreshPatientCards(enrichedData);
            } else if (typeof globalThis.refreshPatientCards === 'function') {
                globalThis.refreshPatientCards(enrichedData);
            } else if (typeof window.refreshPatientCards === 'function') {
                window.refreshPatientCards(enrichedData);
            }
            
            console.log('Background enrichment completed');
            
            // Check for celebration animations after background enrichment
            setTimeout(() => {
                if (typeof unsafeWindow !== 'undefined' && typeof unsafeWindow.checkAllCelebrationAnimations === 'function') {
                    unsafeWindow.checkAllCelebrationAnimations(enrichedData);
                } else if (typeof this !== 'undefined' && typeof this.checkAllCelebrationAnimations === 'function') {
                    this.checkAllCelebrationAnimations(enrichedData);
                } else if (typeof globalThis.checkAllCelebrationAnimations === 'function') {
                    globalThis.checkAllCelebrationAnimations(enrichedData);
                } else if (typeof window.checkAllCelebrationAnimations === 'function') {
                    window.checkAllCelebrationAnimations(enrichedData);
                }
            }, 200);
        } catch (error) {
            console.error('Background enrichment failed:', error);
        }
    },

    /**
     * Load surgery info for a specific patient (for immediate use)
     */
    async loadPatientSurgeryInfo(patient) {
        try {
            const checklistObj = {
                mabn: patient.mabn,
                mavaovien: patient.mavaovien,
                tungay: patient.tungay
            };

            const checklistState = await ChecklistService.loadChecklistState(checklistObj);
            if (checklistState) {
                const surgeryData = PatientDataMapper.mapPhauThuatData(checklistState);
                return surgeryData;
            }
            return null;
        } catch (error) {
            console.warn('Failed to load surgery info for patient:', patient.mabn, error);
            return null;
        }
    },

    /**
     * Handle patient data loading with error handling
     */
    async loadPatientDataWithErrorHandling() {
        try {
            return await this.getPatientData();
        } catch (error) {
            console.error('Failed to load patient data:', error);
            LoginHandler.handleLoginRequired();
            return null;
        }
    }
};

module.exports = PatientService;

},{"../components/loginHandler":11,"../pages/page.dashboard.support":21,"../utils/patientDataMapper":42,"./checklistService":27}],30:[function(require,module,exports){
// reportService.js - Service for generating reports

const DateUtils = require('../utils/dateUtils');
const PatientDataMapper = require('../utils/patientDataMapper');
const ChecklistService = require('./checklistService');
const SurgeryUtils = require('../utils/surgeryUtils');

const ReportService = {
    _escapeHtml(str) {
        return String(str || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    },
    // Deprecated: kept for reference; reports now load full checklist state
    async getPatientTreatmentPlan(mabn, ngayvv) {
        try {
            const formData = new FormData();
            formData.append('mabn', mabn + 9898);
            const { tungay, denngay } = DateUtils.getChecklistDateRange(ngayvv);
            formData.append('tungay', tungay);
            formData.append('denngay', denngay);
            const response = await fetch('/DanhSachBenhNhan/DSPhieuCCThongTinVaCamKetNhapVien', {
                method: 'POST', credentials: 'include', body: formData
            });
            const res = await response.json();
            if (res.data && Array.isArray(res.data) && res.data.length > 0) {
                const obj = res.data[res.data.length - 1];
                let state = {};
                if (obj && obj.chuky) {
                    try { state = JSON.parse(obj.chuky); } catch (e) { state = {}; }
                }
                return state.kehoach || '';
            }
            return '';
        } catch (error) {
            console.error('Error getting treatment plan:', error);
            return '';
        }
    },

    /**
     * Load checklist state for multiple patients (sorted)
     */
    async getBatchChecklistStates(patients) {
        const sortedPatients = PatientDataMapper.sortPatients([...patients]);
        const promises = sortedPatients.map(async (patient) => {
            try {
                const res = await ChecklistService.loadChecklistData(patient);
                const obj = ChecklistService.findChecklistObject(res);
                return obj ? (ChecklistService.parseChecklistState(obj) || {}) : {};
            } catch (e) {
                console.warn('Failed to load checklist state for', patient?.mabn, e);
                return {};
            }
        });
        const states = await Promise.all(promises);
        return { sortedPatients, states };
    },

    /**
     * Format patient data for report
     */
    formatPatientData(patient, index, state = {}) {
        const { dob, age } = this.formatDateOfBirth(patient.ngaysinh);
        const gender = patient.phai === 1 ? 'Nữ' : 'Nam';
        const phauThuat = PatientDataMapper.mapPhauThuatData(state);
        const hxt = (state && typeof state.huongXuTri === 'string') ? state.huongXuTri.trim() : '';
        const cdkt = (state && typeof state.chanDoanKemTheo === 'string') ? state.chanDoanKemTheo.trim() : '';

        // Build surgery displays similar to dr-card
        let ppptDisplay = '';
        let ngayPtDisplay = '';
        if (phauThuat) {
            const date = phauThuat.ngayPhauThuat || '';
            const method = phauThuat.pppt || '';
            const info = SurgeryUtils.getSurgeryDateInfo(date);
            const hpnSuffix = (info && info.postOpDay !== null) ? ` (HPN${info.postOpDay})` : '';
            // Show PPPT with HPNx when available
            ppptDisplay = `${method}${hpnSuffix}`.trim();
            // Show only the surgery date (no time)
            ngayPtDisplay = date;
        }
        
        return {
            index: index + 1,
            name: patient.hoten || '',
            mabn: patient.mabn || '',
            dob,
            age,
            gender,
            room: patient.teN_PHONG || '',
            bed: patient.teN_GIUONG || '',
            diagnosis: `${patient.chandoanvk || ''}${cdkt ? '; ' + cdkt : ''}`,
            hxt,
            ppptDisplay,
            ngayPtDisplay
        };
    },

    /**
     * Format date of birth and calculate age
     */
    formatDateOfBirth(ngaysinh) {
        let dob = '';
        let age = '';
        
        if (ngaysinh) {
            let d = ngaysinh.split('T')[0];
            
            if (d.includes('-')) {
                const [y, m, day] = d.split('-');
                dob = `${day}/${m}/${y}`;
                age = (new Date().getFullYear() - parseInt(y, 10)).toString() + 't';
            } else if (d.includes('/')) {
                dob = d;
                const y = d.split('/')[2];
                age = (new Date().getFullYear() - parseInt(y, 10)).toString() + 't';
            }
        }
        
        return { dob, age };
    },

    /**
     * Generate HTML report content
     */
    generateHTMLReport(patients, states) {
        let html = ``;
        // html += `<div style="margin-bottom:10px">Số lượng bệnh nhân hiện có: <b>${patients.length}</b></div>`;
        
        patients.forEach((patient, idx) => {
            const data = this.formatPatientData(patient, idx, states[idx] || {});
            
            html += `<div style='margin-bottom:8px; line-height:1.15;'>`;
            html += `<h3 style='font-size:1.3em; margin:0 0 4px 0; color:#3277d5'><strong>${data.index}. ${data.name} - ${data.mabn}</strong></h3>`;
            html += `<div style='margin:2px 0;'><b>DOB</b>: ${data.dob} (${data.age}) - ${data.gender} - ${data.room} - ${data.bed}</div>`;
            html += `<div style='margin:2px 0;'><b>Chẩn đoán</b>: ${this._escapeHtml(data.diagnosis)}</div>`;
            if (data.ppptDisplay) html += `<div style='margin:2px 0;'><b>PPPT</b>: ${data.ppptDisplay}</div>`;
            if (data.ngayPtDisplay) html += `<div style='margin:2px 0;'><b>Ngày PT</b>: ${data.ngayPtDisplay}</div>`;
            if (data.hxt) html += `<div style='margin:2px 0;'><b>HXT</b>: ${data.hxt.replace(/\n/g, '<br>')}</div>`;
            html += `</div>`;
        });
        
        return html;
    },

    /**
     * Generate HTML for a single patient (no numbering)
     */
    generateSingleHTML(patient, state = {}) {
        const data = this.formatPatientData(patient, 0, state);
        let html = ``;
        html += `<div style='margin-bottom:8px; line-height:1.15;'>`;
        html += `<h3 style='font-size:1.3em; margin:0 0 4px 0; color:#3277d5'><strong>${data.name} - ${data.mabn}</strong></h3>`;
        html += `<div style='margin:2px 0;'><b>DOB</b>: ${data.dob} (${data.age}) - ${data.gender} - ${data.room} - ${data.bed}</div>`;
        html += `<div style='margin:2px 0;'><b>Chẩn đoán</b>: ${this._escapeHtml(data.diagnosis)}</div>`;
        if (data.ppptDisplay) html += `<div style='margin:2px 0;'><b>PPPT</b>: ${data.ppptDisplay}</div>`;
        if (data.ngayPtDisplay) html += `<div style='margin:2px 0;'><b>Ngày PT</b>: ${data.ngayPtDisplay}</div>`;
        if (data.hxt) html += `<div style='margin:2px 0;'><b>HXT</b>: ${data.hxt.replace(/\n/g, '<br>')}</div>`;
        html += `</div>`;
        return html;
    },

    /**
     * Generate plain text report content
     */
    generateTextReport(patients, states) {
        let report = `BÁO CÁO TRỰC\nSố lượng bệnh nhân hiện có: ${patients.length}\n`;
        
        patients.forEach((patient, idx) => {
            const data = this.formatPatientData(patient, idx, states[idx] || {});
            
            report += `${data.index}. ${data.bed} - ${data.name} - ${data.mabn} - ${data.dob} (${data.age}) - ${data.gender}\n`;
            report += `   Chẩn đoán: ${data.diagnosis}\n`;
            if (data.ppptDisplay) report += `   PPPT: ${data.ppptDisplay}\n`;
            if (data.ngayPtDisplay) report += `   Ngày PT: ${data.ngayPtDisplay}\n`;
            if (data.hxt) report += `   HXT: ${data.hxt}\n`;
        });
        
        return report;
    }
    ,
    /**
     * Generate plain text for a single patient (no numbering)
     */
    generateSingleText(patient, state = {}) {
        const data = this.formatPatientData(patient, 0, state);
        let report = '';
        report += `${data.bed} - ${data.name} - ${data.mabn} - ${data.dob} (${data.age}) - ${data.gender}\n`;
        report += `Chẩn đoán: ${data.diagnosis}\n`;
        if (data.ppptDisplay) report += `PPPT: ${data.ppptDisplay}\n`;
        if (data.ngayPtDisplay) report += `Ngày PT: ${data.ngayPtDisplay}\n`;
        if (data.hxt) report += `HXT: ${data.hxt}\n`;
        return report;
    }
};

module.exports = ReportService;

},{"../utils/dateUtils":37,"../utils/patientDataMapper":42,"../utils/surgeryUtils":43,"./checklistService":27}],31:[function(require,module,exports){
// saveQueue.js - Offline queue for checklist saves

const QUEUE_KEY = 'dr_save_queue_v1';

function loadQueue() {
    try {
        const raw = localStorage.getItem(QUEUE_KEY);
        const arr = raw ? JSON.parse(raw) : [];
        return Array.isArray(arr) ? arr : [];
    } catch (_) {
        return [];
    }
}

function saveQueue(arr) {
    try { localStorage.setItem(QUEUE_KEY, JSON.stringify(arr)); } catch (_) {}
}

// Keep only the latest item per mabn (dedupe)
function upsertByMabn(queue, item) {
    const idx = queue.findIndex(q => q.mabn === item.mabn);
    if (idx >= 0) queue[idx] = item; else queue.push(item);
}

const SaveQueue = {
    enqueueUpdate(checklistObj, checklistState) {
        const mabn = (checklistObj && (checklistObj.mabn || checklistObj.MABN || checklistObj.MaBN)) || '';
        const item = {
            id: `${mabn}:${Date.now()}`,
            mabn,
            type: 'updateChecklist',
            payload: { checklistObj, checklistState },
            createdAt: Date.now()
        };
        const q = loadQueue();
        upsertByMabn(q, item);
        saveQueue(q);
        return item.id;
    },
    async drain(processor) {
        // processor: async ({ checklistObj, checklistState }) => boolean
        const q = loadQueue();
        if (!q.length) return 0;
        let successCount = 0;
        const rest = [];
        for (const item of q) {
            try {
                const ok = await processor(item.payload);
                if (ok) successCount++; else rest.push(item);
            } catch (_) { rest.push(item); }
        }
        saveQueue(rest);
        return successCount;
    },
    size() { return loadQueue().length; },
    purge(mabn) {
        const q = loadQueue().filter(i => i.mabn !== mabn);
        saveQueue(q);
    }
};

module.exports = SaveQueue;

},{}],32:[function(require,module,exports){
// settingsService.js - Manage settings stored in a checklist-like phiếu using doctor name as mabn

const ApiService = require('./apiService');
const { getSelectedKhoa } = require('../utils/khoaUtils');

const SettingsService = {
    async fetchDoctorName() {
        try {
            const body = new URLSearchParams();
            body.set('FilterProperty', '');
            body.set('FilterBy', '');
            body.set('Page', '1');
            body.set('PageSize', '20');
            body.set('OrderProperty', '');
            body.set('OrderBy', '');
            body.set('id', '');
            body.set('_key', 'change-pin-chung-thu-so');

            const response = await fetch('/sp-admin/change-pin-chung-thu-so/Form', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Accept': '*/*',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body
            });

            const htmlText = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlText, 'text/html');
            const input = doc.querySelector('#HoTen');
            let name = '';
            if (input) {
                name = (input.value || input.getAttribute('value') || '').trim();
            }
            return name;
        } catch (e) {
            console.error('Failed to fetch doctor name:', e);
            return '';
        }
    },

    async loadSettingsPhieu(doctorName) {
        // Use DSPhieu API with doctorName as mabn
        const formData = new FormData();
        formData.append('mabn', doctorName);
        // very wide range
        formData.append('tungay', '01/01/1001 01:01');
        formData.append('denngay', '01/01/3001 01:01');

        const resp = await fetch('/DanhSachBenhNhan/DSPhieuCCThongTinVaCamKetNhapVien', {
            method: 'POST',
            credentials: 'include',
            body: formData
        });
        const result = await resp.json();
        const data = (result && result.data) || [];
        // Pick first item that looks like our settings (hoten endsWith % and mabn==doctorName)
        const found = data.find(item => item && item.mabn === doctorName && typeof item.hoten === 'string' && item.hoten.endsWith('%')) || null;
        return found;
    },

    parseSettingsState(checklistObj) {
        if (!checklistObj || !checklistObj.chuky) return {};
        try {
            const parsed = JSON.parse(checklistObj.chuky);
            return parsed && typeof parsed === 'object' ? parsed : {};
        } catch {
            return {};
        }
    },

    async createSettingsPhieu(doctorName) {
        // Reuse CreateAjax endpoint with doctorName as mabn
        const formData = new FormData();
        formData.append('status', '1');
        formData.append('thebaohiemyte', 'Không');
        formData.append('chuky', '{}');
        formData.append('khac', '--*--');
        formData.append('khu', '1');
        formData.append('mabn', doctorName);
        formData.append('bieumauid', '027');
    formData.append('makp', getSelectedKhoa('551'));
        formData.append('__model', 'TAH.Entity.Model.PHIEUCCTHONGTINVACAMKETNHAPVIEN.ERM_PHIEUCCTHONGTINVACAMKETNHAPVIEN');
        formData.append('actiontype', '');
        // Mark with name% so it can be identified and matched by endsWith('%')
        formData.append('hoten', `${doctorName}%`);
        formData.append('ngaysinh', '10/10/1999');
        formData.append('gioitinh', 'Nam');

        const response = await fetch('/ERM_PHIEUCCTHONGTINVACAMKETNHAPVIEN/CreateAjax', {
            method: 'POST',
            credentials: 'include',
            body: formData
        });
        return response.json();
    },

    async updateSettingsState(oldData, settingsState) {
        try {
            const res = await ApiService.updateChecklistData(oldData, settingsState);
            return res && (res.Status == 1 || res.isValid);
        } catch (e) {
            console.error('Failed to update settings state:', e);
            return false;
        }
    },

    getDefaultSettings() {
        return {
            danDoRaVien: [
                'Uống thuốc đúng toa được dặn',
                'Tái khám đúng hẹn',
                'Liên hệ khi có dấu hiệu bất thường'
            ]
        };
    },

    async getOrCreateSettings() {
        const doctorName = await this.fetchDoctorName();
        if (!doctorName) {
            return { doctorName: '', checklistObj: null, settings: this.getDefaultSettings() };
        }
        let checklistObj = await this.loadSettingsPhieu(doctorName);
        if (!checklistObj) {
            const created = await this.createSettingsPhieu(doctorName);
            if (created && created.isValid && created.data) {
                // Some CreateAjax returns full object, some just flags; re-read list to get object
                checklistObj = await this.loadSettingsPhieu(doctorName);
            }
        }
        const settings = checklistObj ? this.parseSettingsState(checklistObj) : this.getDefaultSettings();
        if (!settings.danDoRaVien) settings.danDoRaVien = this.getDefaultSettings().danDoRaVien;
        return { doctorName, checklistObj, settings };
    }
};

module.exports = SettingsService;

},{"../utils/khoaUtils":41,"./apiService":26}],33:[function(require,module,exports){
// surgeonSettingsService.js - Store selected surgeons per khoa using checklist-like records

const ApiService = require('./apiService');

function makeKeyForKhoa(khoaId) {
    return `${String(khoaId)}%h991h otm.dsbacsi`;
}

async function loadRecordForKhoa(khoaId) {
    const key = makeKeyForKhoa(khoaId);
    const formData = new FormData();
    formData.append('mabn', key);
    // Use a very wide range to ensure the special record is returned
    formData.append('tungay', '01/01/1001 01:01');
    formData.append('denngay', '01/01/3001 01:01');
    const resp = await fetch('/DanhSachBenhNhan/DSPhieuCCThongTinVaCamKetNhapVien', {
        method: 'POST',
        credentials: 'include',
        body: formData
    });
    const result = await resp.json();
    const data = (result && result.data) || [];
    const found = data.find(item => item && item.mabn === key && typeof item.hoten === 'string' && item.hoten.endsWith('%')) || null;
    return found;
}

async function createRecordForKhoa(khoaId) {
    const key = makeKeyForKhoa(khoaId);
    const formData = new FormData();
    formData.append('status', '1');
    formData.append('thebaohiemyte', 'Không');
    // Initialize with empty list
    formData.append('chuky', JSON.stringify({ otm: { dsbacsi: [] } }));
    formData.append('khac', '--*--');
    formData.append('khu', '1');
    formData.append('mabn', key);
    formData.append('bieumauid', '027');
    // Use a fixed marker date as per convention
    formData.append('makp', '551');
    formData.append('__model', 'TAH.Entity.Model.PHIEUCCTHONGTINVACAMKETNHAPVIEN.ERM_PHIEUCCTHONGTINVACAMKETNHAPVIEN');
    formData.append('actiontype', '');
    formData.append('hoten', `${key}%`);
    formData.append('ngaysinh', '10/10/1010');
    formData.append('gioitinh', 'Nam');
    const response = await fetch('/ERM_PHIEUCCTHONGTINVACAMKETNHAPVIEN/CreateAjax', {
        method: 'POST',
        credentials: 'include',
        body: formData
    });
    return response.json();
}

function parseState(obj) {
    if (!obj || !obj.chuky) return { otm: { dsbacsi: [] } };
    try {
        const parsed = JSON.parse(obj.chuky);
        if (parsed && parsed.otm && Array.isArray(parsed.otm.dsbacsi)) return parsed;
        // normalize
        const arr = parsed && (parsed.dsbacsi || parsed.surgeons || []);
        return { otm: { dsbacsi: Array.isArray(arr) ? arr : [] } };
    } catch (_) {
        return { otm: { dsbacsi: [] } };
    }
}

const SurgeonSettingsService = {
    makeKeyForKhoa,
    async getOrCreateRecord(khoaId) {
        let obj = await loadRecordForKhoa(khoaId);
        if (!obj) {
            const created = await createRecordForKhoa(khoaId);
            if (created && (created.isValid || created.Status == 1)) {
                obj = await loadRecordForKhoa(khoaId);
            }
        }
        return obj;
    },
    async loadSurgeonList(khoaId) {
        const obj = await loadRecordForKhoa(khoaId);
        const state = parseState(obj);
        return { list: state.otm.dsbacsi || [], obj };
    },
    async saveSurgeonList(khoaId, fullnames) {
        const obj = await this.getOrCreateRecord(khoaId);
        if (!obj) return { ok: false };
        const next = { otm: { dsbacsi: Array.from(new Set((fullnames || []).map(s => String(s).trim()).filter(Boolean))) } };
        const res = await ApiService.updateChecklistData(obj, next);
        const ok = res && (res.Status == 1 || res.isValid);
        return { ok };
    }
};

module.exports = SurgeonSettingsService;

},{"./apiService":26}],34:[function(require,module,exports){
// Top-level compatibility shim for legacy imports
module.exports = require('./pages/page.settings-open-world');
// Top-level compatibility shim for legacy imports
// This allows requiring '../settings-open-world' from files inside src/pages
module.exports = require('./pages/page.settings-open-world');

},{"./pages/page.settings-open-world":23}],35:[function(require,module,exports){
// Common utility functions (date formatting, age calculation, etc.)
const Utils = {
    _normalizeDateInput(dateInput) {
        if (!dateInput) return { dateObj: null, timeStr: null };
        let effectiveDateObj = null;
        let extractedTimeStr = null;
        if (dateInput instanceof Date) {
            effectiveDateObj = dateInput;
            extractedTimeStr = `${String(effectiveDateObj.getHours()).padStart(2, '0')}:${String(effectiveDateObj.getMinutes()).padStart(2, '0')}`;
        } else if (typeof dateInput === 'string') {
            let datePart = dateInput;
            let timePart = null;
            if (datePart.includes('T')) {
                const parts = datePart.split('T');
                datePart = parts[0];
                if (parts[1]) timePart = parts[1].substring(0, 5);
            } else if (datePart.includes(' ')) {
                const parts = datePart.split(' ');
                datePart = parts[0];
                if (parts[1]) timePart = parts[1].substring(0, 5);
            }
            extractedTimeStr = timePart;
            if (/\d{4}-\d{2}-\d{2}/.test(datePart)) {
                effectiveDateObj = new Date(datePart + 'T00:00:00');
            } else if (/\d{2}\/\d{2}\/\d{4}/.test(datePart)) {
                const [d, m, y] = datePart.split('/');
                effectiveDateObj = new Date(`${y}-${m}-${d}T00:00:00`);
            } else {
                const potentialDate = new Date(dateInput);
                if (!isNaN(potentialDate.getTime())) {
                    effectiveDateObj = potentialDate;
                    if (!extractedTimeStr && (dateInput.includes('T') || dateInput.includes(' ')) && dateInput.includes(':')) {
                        extractedTimeStr = `${String(effectiveDateObj.getHours()).padStart(2, '0')}:${String(effectiveDateObj.getMinutes()).padStart(2, '0')}`;
                    }
                }
            }
            if (effectiveDateObj && isNaN(effectiveDateObj.getTime())) {
                effectiveDateObj = null;
            }
        }
        return { dateObj: effectiveDateObj, timeStr: extractedTimeStr };
    },
    calculateAge(dateString) {
        const { dateObj: birth } = this._normalizeDateInput(dateString);
        if (!birth) return '';
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    },
    formatDate(date) {
        const { dateObj } = this._normalizeDateInput(date);
        if (!dateObj) return '';
        const day = String(dateObj.getDate()).padStart(2, '0');
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const year = dateObj.getFullYear();
        return `${day}/${month}/${year}`;
    },
    formatDateForApi(date) {
        const { dateObj, timeStr } = this._normalizeDateInput(date);
        if (!dateObj) return '';
        const day = String(dateObj.getDate()).padStart(2, '0');
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const year = dateObj.getFullYear();
        const finalTime = timeStr || '00:00';
        return `${month}/${day}/${year} ${finalTime}`;
    },
    pad(n, width = 2) {
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
    },
    getQueryParam(name) {
        const url = new URL(window.location.href);
        return url.searchParams.get(name);
    },
    copyToClipboard(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text);
        } else {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
        }
    }
};

module.exports = Utils;

},{}],36:[function(require,module,exports){
// checklistUtils.js - Checklist-related utility functions

const { showToast, copyToClipboard } = require('./uiUtils');
const ChecklistService = require('../services/checklistService');

/**
 * Create checklist item HTML with special actions
 * @param {string} itemText - Item text
 * @param {string} id - Item ID
 * @param {boolean} isChecked - Whether item is checked
 * @param {object} patient - Patient data
 * @returns {string} - HTML string
 */
function createChecklistItemHTML(itemText, id, isChecked, patient) {
    const baseHTML = `<label style="display:flex;align-items:center;gap:8px;"><input type="checkbox" id="${id}" ${isChecked ? 'checked' : ''}>${itemText}</label>`;
    
    // Add special clickable items without checkbox for certain items
    if (itemText === 'Mở HSBA v2') {
        return `
            <div style="display:flex;align-items:center;gap:8px;padding:8px;background:#e3f2fd;border-radius:4px;cursor:pointer;transition:background-color 0.2s;" onclick="openHSBAV2('${patient.mabn}')" onmouseover="this.style.backgroundColor='#bbdefb'" onmouseout="this.style.backgroundColor='#e3f2fd'">
                <span style="color:#1976d2;font-weight:500;">🔗 ${itemText}</span>
                <span style="margin-left:auto;color:#1976d2;font-size:0.8em;">👆 Click để mở</span>
            </div>
        `;
    } else if (itemText === 'Mở trang dặn dò') {
        return `
            <div style="display:flex;align-items:center;gap:8px;padding:8px;background:#fff3e0;border-radius:4px;cursor:pointer;transition:background-color 0.2s;" onclick="window.open('https://hoaiump.notion.site/D-N-D-RA-VI-N-21025280dcee804c971bea55557264b9', '_blank')" onmouseover="this.style.backgroundColor='#ffe0b2'" onmouseout="this.style.backgroundColor='#fff3e0'">
                <span style="color:#f57c00;font-weight:500;">📋 ${itemText}</span>
                <span style="margin-left:auto;color:#f57c00;font-size:0.8em;">👆 Click để mở</span>
            </div>
        `;
    } else if (itemText === 'Thực hiện y lệnh thuốc đã dự trù') {
        const key = `xuatvien_${itemText}`;
        const isCompleted = window.checklistState && window.checklistState[key] || false;
        return `
            <div style="display:flex;align-items:center;gap:8px;padding:8px;background:${isCompleted ? '#e8f5e8' : '#f3e5f5'};border-radius:4px;cursor:pointer;transition:background-color 0.2s;border:${isCompleted ? '2px solid #4caf50' : '1px solid #9c27b0'};" onclick="copyYLenhText('${itemText}', '${id}', '${patient.mabn}')" onmouseover="this.style.backgroundColor='${isCompleted ? '#dcedc8' : '#e1bee7'}'" onmouseout="this.style.backgroundColor='${isCompleted ? '#e8f5e8' : '#f3e5f5'}'">
                <span style="color:${isCompleted ? '#2e7d32' : '#7b1fa2'};font-weight:500;">${isCompleted ? '✅' : '📋'} ${itemText}</span>
                <span style="margin-left:auto;color:${isCompleted ? '#2e7d32' : '#7b1fa2'};font-size:0.8em;">${isCompleted ? '✅ Đã copy' : '👆 Click để copy'}</span>
            </div>
        `;
    }
    
    return baseHTML;
}

/**
 * Copy y lệnh text and mark as completed
 * @param {string} text - Text to copy
 * @param {string} id - Item ID
 * @param {string} mabn - Patient MABN
 */
async function copyYLenhText(text, id, mabn) {
    const success = await copyToClipboard(text);
    
    if (success) {
        // Mark as completed in checklist state
        if (!window.checklistState) {
            window.checklistState = {};
        }
        
        const key = `xuatvien_${text}`;
        window.checklistState[key] = true;
        
        // Save to server
        if (window.checklistObj) {
            const res = await ChecklistService.updateChecklistState(window.checklistObj, window.checklistState, { enqueueOnOffline: true, ctxId: (window.dr_sidebar_ctx && window.dr_sidebar_ctx.id), signal: (window.dr_sidebar_ctx && window.dr_sidebar_ctx.signal) });
            if (!res || (!res.ok && !res.queued)) {
                console.error('Lưu checklist thất bại!');
            }
        }
        
        // Show success toast
        showToast(`📋 Đã copy: "${text}"`, {
            background: '#4caf50',
            duration: 2500
        });
        
        // Re-render the checklist to show completed state
        setTimeout(() => {
            const xuatvienList = document.querySelector('#checklist-xuatvien');
            if (xuatvienList) {
                const patient = (typeof dr_data !== 'undefined' && dr_data) ? dr_data.find(p => p.mabn === mabn) : null;
                if (patient) {
                    // Try different global scopes for renderChecklistXuatVien function
                    const renderFn = globalThis.renderChecklistXuatVien || 
                                   (typeof unsafeWindow !== 'undefined' && unsafeWindow.renderChecklistXuatVien) ||
                                   (typeof this !== 'undefined' && this.renderChecklistXuatVien) ||
                                   window.renderChecklistXuatVien;
                    if (renderFn) {
                        renderFn(xuatvienList, patient);
                    }
                }
            }
        }, 100);
        
    } else {
        showToast('❌ Không thể copy vào clipboard', {
            background: '#f44336',
            duration: 2000
        });
    }
}

/**
 * Check celebration for card
 * @param {HTMLElement} card - Card element
 * @param {object} patient - Patient data
 */
function checkCelebrationForCard(card, patient) {
    if (!patient || !patient.checklistState || !patient.checklistState.yLenhLog) {
        card.classList.remove('xuatvienanimation');
        return;
    }

    // Check if any entries contain "xuất viện"
    const dischargeEntries = patient.checklistState.yLenhLog.filter(entry => {
        return entry.content && entry.content.toLowerCase().includes('xuất viện');
    });

    if (dischargeEntries.length > 0) {
        card.classList.add('xuatvienanimation');
    } else {
        card.classList.remove('xuatvienanimation');
    }
}

/**
 * Check celebration animations for all cards
 * @param {Array} enrichedPatients - Patient data array
 */
function checkAllCelebrationAnimations(enrichedPatients) {
    const cards = document.querySelectorAll('.dr-card');
    
    cards.forEach((card) => {
        // Get patient MABN from card
        const cardTitle = card.querySelector('h2');
        if (!cardTitle) return;
        
        const cardText = cardTitle.textContent;
        const mabnMatch = cardText.match(/(\d{8,})/); // Find MABN pattern
        if (!mabnMatch) return;
        
        const mabn = mabnMatch[1];
        
        // Find corresponding patient in enriched data
        const patient = enrichedPatients.find(p => p.mabn === mabn);
        if (patient) {
            checkCelebrationForCard(card, patient);
        }
    });
}

module.exports = {
    createChecklistItemHTML,
    copyYLenhText,
    checkCelebrationForCard,
    checkAllCelebrationAnimations
};

},{"../services/checklistService":27,"./uiUtils":45}],37:[function(require,module,exports){
// dateUtils.js - Centralized date handling utilities

const DateUtils = {
    /**
     * Convert Vietnamese date format (dd/mm/yyyy) to US format (mm/dd/yyyy)
     * Also handles cases where input is already in mm/dd/yyyy format
     */
    convertToUSFormat(admitDate) {
        if (!admitDate) {
            const now = new Date();
            const dd = String(now.getDate()).padStart(2, '0');
            const mm = String(now.getMonth() + 1).padStart(2, '0');
            const yyyy = now.getFullYear();
            return `${mm}/${dd}/${yyyy} 00:00`;
        }

        // DEBUG: Log input format
        console.log('DEBUG - DateUtils.convertToUSFormat input:', admitDate);

        if (/^\d{2}\/\d{2}\/\d{4}/.test(admitDate)) {
            const [part1, part2, yearAndTime] = admitDate.split('/');
            const [year, time] = yearAndTime.split(' ');
            
            // Try to determine if it's dd/mm/yyyy or mm/dd/yyyy
            // If part1 > 12, it must be dd/mm/yyyy format
            // If part2 > 12, it must be mm/dd/yyyy format  
            const num1 = parseInt(part1);
            const num2 = parseInt(part2);
            
            let month, day;
            
            if (num1 > 12) {
                // part1 is day, part2 is month (dd/mm/yyyy format)
                day = part1;
                month = part2;
                console.log('DEBUG - Detected dd/mm/yyyy format');
            } else if (num2 > 12) {
                // part1 is month, part2 is day (mm/dd/yyyy format - already US format)
                month = part1;
                day = part2;
                console.log('DEBUG - Detected mm/dd/yyyy format (already US format)');
            } else {
                // Both numbers <= 12, assume Vietnamese format (dd/mm/yyyy)
                day = part1;
                month = part2;
                console.log('DEBUG - Ambiguous format, assuming dd/mm/yyyy');
            }
            
            const result = `${month}/${day}/${year} ${time || '00:00'}`;
            console.log('DEBUG - DateUtils.convertToUSFormat output:', result);
            return result;
        }

        console.log('DEBUG - DateUtils.convertToUSFormat: returning input as-is');
        return admitDate;
    },

    /**
     * Calculate date range for checklist (from admit date to +30 days)
     */
    getChecklistDateRange(admitDate) {
        const tungay = this.convertToUSFormat(admitDate);
        const [admitMonth, admitDay, admitYearAndTime] = tungay.split('/');
        const [admitYear, admitTime] = admitYearAndTime.split(' ');
        
        const tungayDate = new Date(`${admitYear}-${admitMonth}-${admitDay}T${admitTime || '00:00'}`);
        const denngayDate = new Date(tungayDate.getTime() + 30 * 24 * 60 * 60 * 1000);
        
        const dd = String(denngayDate.getDate()).padStart(2, '0');
        const mm = String(denngayDate.getMonth() + 1).padStart(2, '0');
        const yyyy = denngayDate.getFullYear();
        const denngay = `${mm}/${dd}/${yyyy} 23:59`;

        return { tungay, denngay };
    }
};

module.exports = DateUtils;

},{}],38:[function(require,module,exports){
// domUpdaters.js - shared UI update helpers for both card and list rows

const { createYLenhTags, updateMedsDoneBadge } = require('./tagUtils');
const { addSurgeryStatusIcon, formatSurgeryInfo } = require('./surgeryUtils');
const { escapeHtml } = require('./htmlUtils');

function findPatientElement(mabn) {
    if (!mabn) return null;
    return (
        document.querySelector(`.dr-card[data-mabn="${mabn}"]`) ||
        document.querySelector(`.dr-list-row[data-mabn="${mabn}"]`)
    );
}

function updateHXT(patient) {
    try {
        const el = findPatientElement(patient && patient.mabn);
        if (!el) return;
        const hxtText = (patient.checklistState && patient.checklistState.huongXuTri) ? String(patient.checklistState.huongXuTri).trim() : '';
        const old = el.querySelector('.dr-hxt-block');
        if (old) old.remove();
        if (!hxtText) return;
        const div = document.createElement('div');
        div.className = 'dr-value dr-hxt-block';
        div.innerHTML = `<span class="dr-label"><b>HXT:</b></span> ${escapeHtml(hxtText)}`;
        if (el.classList.contains('dr-card')) {
            const ptInfoEl = el.querySelector('.dr-pt-info');
            const cdEl = el.querySelector('.dr-diagnosis-line');
            if (ptInfoEl) ptInfoEl.insertAdjacentElement('afterend', div);
            else if (cdEl) cdEl.insertAdjacentElement('afterend', div);
            else el.insertAdjacentElement('afterbegin', div);
        } else {
            const dxEl = el.querySelector('.dr-list-dx');
            if (dxEl) dxEl.insertAdjacentElement('afterend', div);
            else el.insertAdjacentElement('afterbegin', div);
        }
    } catch (_) {}
}

/**
 * Compose diagnosis strings consistently.
 * Returns baseText (primary diagnosis + optional ICD in parentheses)
 * and combinedHtml which appends CDKT (clamped span) when present.
 */
function composeDiagnosis(patient) {
    const icdSuffix = patient && patient.maicdvk ? ` (${String(patient.maicdvk).trim()})` : '';
    const baseText = `${(patient && patient.chandoanvk) ? patient.chandoanvk : ''}${icdSuffix}`;
    const cdktText = (patient && patient.checklistState && typeof patient.checklistState.chanDoanKemTheo === 'string')
        ? patient.checklistState.chanDoanKemTheo.trim()
        : '';
    const combinedHtml = `${baseText}${cdktText ? '; <span class="dr-cdkt-clamp">' + escapeHtml(cdktText) + '</span>' : ''}`;
    return { baseText, cdktText, combinedHtml };
}

function updateCDKT(patient) {
    try {
        const el = findPatientElement(patient && patient.mabn);
        if (!el) return;
        const diagnosisLine = el.querySelector('.dr-diagnosis-line');
        if (!diagnosisLine) return;
        const { baseText, cdktText, combinedHtml } = composeDiagnosis(patient);
        diagnosisLine.dataset.baseCd = baseText;
        diagnosisLine.dataset.cdkt = cdktText;
        diagnosisLine.innerHTML = `<span class="dr-label">Chẩn đoán:</span> ${combinedHtml}`;
    } catch (_) {}
}

function updateTagsAndMedsBadge(containerEl, patient) {
    try {
        if (!containerEl || !patient) return;
        const existingTags = containerEl.querySelector('.ylenh-tags');
        if (existingTags) existingTags.remove();
        const tagsHtml = createYLenhTags(patient);
        if (tagsHtml) {
            let inserted = false;
            if (containerEl.classList.contains('dr-card')) {
                const btnGroup = containerEl.querySelector('.dr-action-buttons');
                if (btnGroup) { btnGroup.insertAdjacentHTML('beforebegin', tagsHtml); inserted = true; }
            }
            if (!inserted) {
                const left = containerEl.querySelector(':scope > div');
                if (left) left.insertAdjacentHTML('beforeend', tagsHtml);
                else containerEl.insertAdjacentHTML('beforeend', tagsHtml);
            }
        }
        updateMedsDoneBadge(containerEl, patient);
    } catch (_) {}
}

function updateSurgeryInfo(containerEl, patient) {
    try {
        if (!containerEl) return;
        const ptInfoContainer = containerEl.querySelector('.dr-pt-info');
        if (!ptInfoContainer) return;
        const formattedPtInfo = formatSurgeryInfo(patient);
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = formattedPtInfo;
        const inner = tempDiv.querySelector('.dr-pt-info');
        if (inner) ptInfoContainer.innerHTML = inner.innerHTML;
    } catch (_) {}
}

function updateSurgeryIcon(containerEl, patient) {
    try { addSurgeryStatusIcon(containerEl, patient); } catch (_) {}
}

module.exports = {
    updateHXT,
    updateCDKT,
    updateTagsAndMedsBadge,
    updateSurgeryInfo,
    updateSurgeryIcon,
    findPatientElement,
    composeDiagnosis,
};

},{"./htmlUtils":40,"./surgeryUtils":43,"./tagUtils":44}],39:[function(require,module,exports){
function TaiToanBoTaiLieuHSBAV2() {
    if (window.location.hostname !== 'hsba.tahospital.vn') return;

    // Load pdf-lib for merging using the same loading pattern as PDF.js
    const getPDFLib = () => (window.PDFLib || (typeof unsafeWindow !== 'undefined' ? unsafeWindow.PDFLib : undefined));
    if (!getPDFLib()) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js';
        script.referrerPolicy = 'no-referrer';
        script.onload = () => {
            try {
                // bridge between page and userscript contexts
                if (typeof unsafeWindow !== 'undefined' && unsafeWindow.PDFLib && !window.PDFLib) {
                    try { window.PDFLib = unsafeWindow.PDFLib; } catch(_) {}
                }
                console.log('PDF-lib loaded for HSBA download');
            } catch(_) {}
        };
        script.onerror = () => console.warn('Failed to load PDF-lib, falling back to individual downloads');
        document.head.appendChild(script);
    }

    // Listen for the existing HSBA data fetch result
    window.addEventListener('message', (event) => {
        try {
            const data = event.data;
            if (data && data.type === 'DR_HSBA_RESULT' && data.payload && data.payload.data && data.payload.data.hoSoBenhAns) {
                // Store data globally for manual trigger
                window.hsbaData = data.payload;
                console.log('HSBA data ready for manual download');
            }
        } catch (e) {
            console.error('Error processing HSBA message:', e);
        }
    });

    // Also check if data is already available (in case it was fetched before this script ran)
    if (window.__dr_hsba_result__ && window.__dr_hsba_result__.data && window.__dr_hsba_result__.data.hoSoBenhAns) {
        window.hsbaData = window.__dr_hsba_result__;
        console.log('HSBA data already available for manual download');
    }
}

function downloadAllDocuments(data) {
    if (!data || !data.data || !data.data.hoSoBenhAns || !data.data.hoSoBenhAns.items) {
        console.error('Invalid data structure for hoSoBenhAns');
        return;
    }

    const items = data.data.hoSoBenhAns.items;
    const filteredDocs = [];
    const downloadPromises = [];

    // Filter documents based on tenmau keywords
    const keywords = ['phiếu khám', 'kết quả', 'chuyên khoa', 'dị ứng', 'tiền mê', 'duyệt mổ', 'cam đoan', 'điều trị'];

    items.forEach(item => {
        if (item.hoSoChiTiet) {
            item.hoSoChiTiet.forEach(section => {
                if (section.chiTiets) {
                    section.chiTiets.forEach(doc => {
                        if (doc.tenfile && doc.tenmau && doc.ngay) {
                            // Check if tenmau contains any of the keywords (case insensitive)
                            const tenmauLower = doc.tenmau.toLowerCase();
                            const hasKeyword = keywords.some(keyword => tenmauLower.includes(keyword));
                            
                            if (hasKeyword) {
                                filteredDocs.push({
                                    ...doc,
                                    patientInfo: {
                                        hoten: item.hoten,
                                        mabn: item.mabn
                                    }
                                });
                                
                                // Prepare for downloading with proper filename
                                const fileName = `${doc.tenmau} - ${formatDate(doc.ngay)}.pdf`;
                                downloadPromises.push(downloadDocumentForMerge(doc.tenfile, fileName));
                            }
                        }
                    });
                }
            });
        }
    });

    // Wait for all downloads to complete, then process results
    Promise.allSettled(downloadPromises).then((results) => {
        const successfulDownloads = results
            .map((result, index) => ({
                result,
                doc: filteredDocs[index]
            }))
            .filter(({ result }) => result.status === 'fulfilled' && result.value);

        // Always download individual files with correct names
        successfulDownloads.forEach(({ result, doc }) => {
            const fileName = `${doc.tenmau} - ${formatDate(doc.ngay)}.pdf`;
            downloadDocumentWithCorrectName(result.value, fileName);
        });

        // Try to merge PDFs if pdf-lib is available and we have multiple files
        const getPDFLib = () => (window.PDFLib || (typeof unsafeWindow !== 'undefined' ? unsafeWindow.PDFLib : undefined));
        if (successfulDownloads.length > 1 && getPDFLib()) {
            console.log(`Attempting to merge ${successfulDownloads.length} PDFs...`);
            const pdfBuffers = successfulDownloads.map(({ result }) => result.value);
            mergeAndDownloadPDFs(pdfBuffers, filteredDocs[0]?.patientInfo);
        } else if (successfulDownloads.length > 1 && !getPDFLib()) {
            console.log('PDF-lib not available, skipping merge. Only individual files downloaded.');
        } else {
            console.log(`Only ${successfulDownloads.length} file(s) found, no merging needed.`);
        }

        // Call the hide function after downloads
        if (typeof HSBAV2HideEmptySectionsIfNeeded === 'function') {
            HSBAV2HideEmptySectionsIfNeeded();
        }
    });
}

function downloadDocumentForMerge(tenfile, fileName) {
    const url = 'https://hsba.tahospital.vn/api/hosobenhan/download/base64?url=' + encodeURIComponent(tenfile);
    return fetch(url, { credentials: 'include' })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to download ' + fileName);
            }
            return response.json();
        })
        .then(jsonResponse => {
            const base64String = jsonResponse.base64;
            
            // Decode base64 to binary
            const binaryString = atob(base64String);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            
            // Return the PDF buffer for merging
            return bytes.buffer;
        })
        .catch(err => {
            console.error('Error downloading document ' + fileName + ':', err);
            return null; // Return null so Promise.allSettled can handle it
        });
}

function downloadDocumentWithCorrectName(buffer, fileName) {
    try {
        const blob = new Blob([buffer], { type: 'application/pdf' });
        const blobUrl = URL.createObjectURL(blob);

        // Create download link and trigger download
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Clean up
        URL.revokeObjectURL(blobUrl);
        
        console.log('Downloaded:', fileName);
    } catch (err) {
        console.error('Error downloading document ' + fileName + ':', err);
    }
}

function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    } catch (e) {
        return dateString; // Return original if parsing fails
    }
}

async function mergeAndDownloadPDFs(pdfBuffers, patientInfo) {
    const getPDFLib = () => (window.PDFLib || (typeof unsafeWindow !== 'undefined' ? unsafeWindow.PDFLib : undefined));
    if (!getPDFLib() || !pdfBuffers.length) {
        console.log('PDF-lib not available or no buffers to merge');
        return;
    }

    try {
        console.log(`Starting PDF merge with ${pdfBuffers.length} files...`);
        const { PDFDocument } = getPDFLib();
        const mergedPdf = await PDFDocument.create();

        for (let i = 0; i < pdfBuffers.length; i++) {
            try {
                const pdf = await PDFDocument.load(pdfBuffers[i]);
                const pageCount = pdf.getPageCount();
                console.log(`Processing PDF ${i + 1}: ${pageCount} pages`);
                const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                copiedPages.forEach(page => mergedPdf.addPage(page));
            } catch (e) {
                console.error(`Error processing PDF ${i + 1}:`, e);
            }
        }

        const mergedPdfBytes = await mergedPdf.save();
        const totalPages = mergedPdf.getPageCount();
        console.log(`Merged PDF created with ${totalPages} total pages`);
        
        const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
        const blobUrl = URL.createObjectURL(blob);

        // Create download link for merged PDF
        const fileName = patientInfo ? `${patientInfo.hoten}-${patientInfo.mabn}.pdf` : 'merged-hsba-documents.pdf';
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Clean up
        URL.revokeObjectURL(blobUrl);
        
        console.log(`✅ Merged PDF downloaded as: ${fileName}`);
    } catch (e) {
        console.error('❌ Error merging PDFs:', e);
    }
}

// Export for require
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TaiToanBoTaiLieuHSBAV2, triggerDownloadIfDataExists, downloadDocumentForMerge, downloadDocumentWithCorrectName, formatDate, mergeAndDownloadPDFs };
}

function triggerDownloadIfDataExists() {
    if (window.hsbaData) {
        downloadAllDocuments(window.hsbaData);
    } else {
        alert('Dữ liệu chưa sẵn sàng. Vui lòng tải lại trang hoặc chờ dữ liệu tải.');
    }
}
},{}],40:[function(require,module,exports){
// htmlUtils.js - HTML/text helpers

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/\n/g, '<br/>');
}

module.exports = { escapeHtml };

},{}],41:[function(require,module,exports){
// khoaUtils.js - central helpers for selected khoa id

function getSelectedKhoa(defaultValue = '551') {
    try {
        const ls = window.localStorage;
        return (ls.getItem('bsnt_khoa_dashboard') || defaultValue);
    } catch (_) {
        return defaultValue;
    }
}

module.exports = {
    getSelectedKhoa
};

},{}],42:[function(require,module,exports){
// patientDataMapper.js - Centralized patient data mapping

const PatientDataMapper = {
    /**
     * Map raw patient data to standardized format
     */
    mapPatientData(item) {
        return {
            teN_GIUONG: item.teN_GIUONG,
            teN_PHONG: item.teN_PHONG,
            teN_TANG: item.teN_TANG,
            teN_TOANHA: item.teN_TOANHA,
            mabn: item.mabn,
            hoten: item.hoten,
            ngaysinh: item.ngaysinh,
            phai: item.phai,
            mavaovien: item.mavaovien,
            chandoanvk: item.chandoanvk,
            maicdvk: item.maicdvk,
            kehoach: item.kehoach,
            ngayvv: item.ngayvv,
            maql: item.maql,
            tungay: item.tungay
        };
    },

    /**
     * Map array of patient data
     */
    mapPatientArray(dataArray) {
        if (!Array.isArray(dataArray)) {
            return [];
        }
        return dataArray.map(item => this.mapPatientData(item));
    },

    /**
     * Determine if room should have white card styling
     */
    isWhiteCard(room) {
        if (!room) return false;

        // Prefer configured list in BS_CAI_DAT.whiteCardRooms when available
        try {
            const cfg = (typeof BS_CAI_DAT !== 'undefined' && BS_CAI_DAT.whiteCardRooms) || null;
            if (Array.isArray(cfg) && cfg.length > 0) {
                const target = this.formatRoom(room).toLowerCase();
                return cfg.some(r => this.formatRoom(r).toLowerCase() === target);
            }
        } catch (e) {
            // ignore and fallback to legacy pattern
        }

        // Fallback (legacy behavior)
        return /^(Phòng )?(214|215|216)$/i.test(room) || /214|215|216/.test(room);
    },

    /**
     * Format room info - extract only room number
     * "Phòng 402" -> "402"
     */
    formatRoom(roomText) {
        if (!roomText) return '';
        // Remove "Phòng " prefix and keep only the number/text
        return roomText.replace(/^Phòng\s*/i, '').trim();
    },

    /**
     * Format bed info - extract only bed letter/name
     * "Giường A" -> "A"
     * "G215-A" -> "A"
     */
    formatBed(bedText) {
        if (!bedText) return '';
        
        // Remove "Giường " prefix first
        let cleaned = bedText.replace(/^Giường\s*/i, '').trim();
        
        // If there's a dash, take only the part after the last dash
        if (cleaned.includes('-')) {
            const parts = cleaned.split('-');
            return parts[parts.length - 1].trim();
        }
        
        // Otherwise return the cleaned text
        return cleaned;
    },

    /**
     * Format floor info - extract only floor number
     * "Tầng 4" -> "4"
     */
    formatFloor(floorText) {
        if (!floorText) return '';
        // Remove "Tầng " prefix and keep only the number
        return floorText.replace(/^Tầng\s*/i, '').trim();
    },

    /**
     * Format building info - extract only building letter/name
     * "Tòa C" -> "C"
     */
    formatBuilding(buildingText) {
        if (!buildingText) return '';
        // Remove "Tòa " prefix and keep only the letter/name
        return buildingText.replace(/^Tòa\s*/i, '').trim();
    },

    /**
     * Format complete room location info
     * Returns formatted string: "402 A - 4 C"
     */
    formatRoomLocation(room, bed, floor, building) {
        const formattedRoom = this.formatRoom(room);
        const formattedBed = this.formatBed(bed);
        const formattedFloor = this.formatFloor(floor);
        const formattedBuilding = this.formatBuilding(building);
        
        let location = '';
        
        // Add room and bed
        if (formattedRoom) {
            location += formattedRoom;
            if (formattedBed) {
                location += `${formattedBed}`;
            }
        }
        
        // Add separator if we have floor or building
        if ((formattedFloor || formattedBuilding) && location) {
            location += ' - ';
        }
        
        // Add floor and building
        if (formattedFloor) {
            location += "Tòa " + formattedFloor;
            if (formattedBuilding) {
                location += `${formattedBuilding}`;
            }
        } else if (formattedBuilding) {
            location += formattedBuilding;
        }
        
        return location;
    },

    /**
     * Extract numeric value from text for sorting
     * "402" -> 402, "A" -> 0, "4C" -> 4
     */
    extractNumericValue(text) {
        if (!text) return 0;
        const match = text.toString().match(/\d+/);
        return match ? parseInt(match[0], 10) : 0;
    },

    /**
     * Extract alpha value from text for sorting
     * "402A" -> "A", "G215-B" -> "B", "4" -> ""
     */
    extractAlphaValue(text) {
        if (!text) return '';
        // Remove numbers and special characters, keep only letters
        const alpha = text.toString().replace(/[^A-Za-z]/g, '');
        return alpha.toUpperCase();
    },

    /**
     * Sort patients by Building -> Floor -> Room -> Bed (all ascending)
     */
    sortPatients(patients) {
        return patients.sort((a, b) => {
            // 1. Sort by Building (Tòa nhà)
            const buildingA = this.extractAlphaValue(this.formatBuilding(a.teN_TOANHA));
            const buildingB = this.extractAlphaValue(this.formatBuilding(b.teN_TOANHA));
            if (buildingA !== buildingB) {
                return buildingA.localeCompare(buildingB);
            }

            // 2. Sort by Floor (Tầng)
            const floorA = this.extractNumericValue(this.formatFloor(a.teN_TANG));
            const floorB = this.extractNumericValue(this.formatFloor(b.teN_TANG));
            if (floorA !== floorB) {
                return floorA - floorB;
            }

            // 3. Sort by Room number (Phòng)
            const roomA = this.extractNumericValue(this.formatRoom(a.teN_PHONG));
            const roomB = this.extractNumericValue(this.formatRoom(b.teN_PHONG));
            if (roomA !== roomB) {
                return roomA - roomB;
            }

            // 4. Sort by Bed (Giường)
            // First by numeric part, then by alpha part
            const bedA = this.formatBed(a.teN_GIUONG);
            const bedB = this.formatBed(b.teN_GIUONG);
            
            const bedNumA = this.extractNumericValue(bedA);
            const bedNumB = this.extractNumericValue(bedB);
            if (bedNumA !== bedNumB) {
                return bedNumA - bedNumB;
            }
            
            const bedAlphaA = this.extractAlphaValue(bedA);
            const bedAlphaB = this.extractAlphaValue(bedB);
            return bedAlphaA.localeCompare(bedAlphaB);
        });
    },

    /**
     * Map surgery data from checklist state
     */
    mapPhauThuatData(checklistData) {
        if (!checklistData || !checklistData.phauThuatLog) {
            return null;
        }

        const logs = checklistData.phauThuatLog;
        if (!Array.isArray(logs) || logs.length === 0) {
            return null;
        }

        // Get the latest surgery record (first one since newest is first)
        const latestSurgery = logs[0];
        
        return {
            ngayPhauThuat: latestSurgery.date || '', // Already in dd/mm/yyyy format
            gioPhauThuat: latestSurgery.time || '', // Already in HH:MM format
            pppt: latestSurgery.method || '',
            bacSi: latestSurgery.doctors || '',
            timestamp: latestSurgery.id || new Date().getTime()
        };
    },

    /**
     * Check if patient has surgery data
     */
    hasPhauThuatData(checklistData) {
        if (!checklistData || !checklistData.phauThuatLog) {
            return false;
        }

        const logs = checklistData.phauThuatLog;
        return Array.isArray(logs) && logs.length > 0;
    }
};

module.exports = PatientDataMapper;

},{}],43:[function(require,module,exports){
// surgeryUtils.js - Surgery-related utility functions

/**
 * Parse surgery date and get detailed info
 * @param {string} surgeryDateStr - Surgery date string
 * @returns {object|null} - Surgery date info
 */
function getSurgeryDateInfo(surgeryDateStr) {
    if (!surgeryDateStr) return null;
    
    // Extract date from surgery date string (format: dd/mm/yyyy or yyyy-mm-dd)
    let surgeryDate;
    if (surgeryDateStr.includes('/')) {
        // Format: dd/mm/yyyy
        const [day, month, year] = surgeryDateStr.split('/');
        surgeryDate = new Date(year, month - 1, day);
    } else if (surgeryDateStr.includes('-')) {
        // Format: yyyy-mm-dd
        surgeryDate = new Date(surgeryDateStr);
    } else {
        return null;
    }
    
    // Get today's date (without time)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Set surgery date to start of day
    surgeryDate.setHours(0, 0, 0, 0);
    
    // Calculate days difference
    const timeDiff = today.getTime() - surgeryDate.getTime();
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    
    // Determine status
    let status;
    if (daysDiff > 0) {
        status = 'past'; // Before today
    } else if (daysDiff === 0) {
        status = 'today'; // Today
    } else {
        status = 'future'; // Tomorrow or later
    }
    
    return {
        status: status,
        daysDiff: daysDiff,
        postOpDay: daysDiff >= 0 ? daysDiff : null // Only calculate for past/today surgeries
    };
}

/**
 * Parse surgery date and compare with today (backward compatibility)
 * @param {string} surgeryDateStr - Surgery date string
 * @returns {string|null} - Surgery status
 */
function getSurgeryDateStatus(surgeryDateStr) {
    const info = getSurgeryDateInfo(surgeryDateStr);
    return info ? info.status : null;
}

/**
 * Add surgery status icon to card
 * @param {HTMLElement} card - Patient card element
 * @param {object} item - Patient item
 */
function addSurgeryStatusIcon(card, item) {
    // Remove existing status icon if any
    const existingIcon = card.querySelector('.dr-surgery-status-icon');
    if (existingIcon) {
        existingIcon.remove();
    }
    // Do not show icon for list view rows
    try {
        if (card && card.classList && card.classList.contains('dr-list-row')) return;
    } catch (_) {}
    
    // Get surgery date from item
    let surgeryDate = null;
    if (item.phauThuatInfo) {
        // From new format
        surgeryDate = item.phauThuatInfo.date || item.phauThuatInfo.ngayPhauThuat;
    } else if (item.checklistState && item.checklistState.phauThuatLog && item.checklistState.phauThuatLog.length > 0) {
        // From checklist log (latest surgery)
        surgeryDate = item.checklistState.phauThuatLog[0].date;
    }
    
    const surgeryInfo = getSurgeryDateInfo(surgeryDate);
    if (!surgeryInfo) return;
    
    // Create icon element
    const iconDiv = document.createElement('div');
    iconDiv.className = 'dr-surgery-status-icon';
    iconDiv.style.cssText = `
        position: absolute;
        top: -4px;
        left: -4px;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        z-index: 10;
        pointer-events: none;
    `;
    
    // Set icon and title based on status
    switch (surgeryInfo.status) {
        case 'past':
            iconDiv.textContent = '⬅️';
            iconDiv.title = `Phẫu thuật đã qua - HPN${surgeryInfo.postOpDay}`;
            break;
        case 'today':
            iconDiv.textContent = '⏸️';
            iconDiv.title = 'Hôm nay PT';
            break;
        case 'future':
            const daysUntil = Math.abs(surgeryInfo.daysDiff);
            iconDiv.textContent = '➡️';
            if (daysUntil === 1) {
                iconDiv.title = 'Ngày mai';
            } else if (daysUntil === 2) {
                iconDiv.title = 'Ngày mốt PT';
            } else {
                iconDiv.title = `Còn ${daysUntil} ngày nữa PT`;
            }
            break;
    }
    
    // Add to card
    card.style.position = 'relative';
    card.appendChild(iconDiv);
}

/**
 * Format surgery info with post-op days
 * @param {object} item - Patient item
 * @returns {string} - Formatted surgery info HTML
 */
function formatSurgeryInfo(item) {
    let ptInfo = '';
    let surgeryDate = null;
    let ptData = null;
    
    if (item.phauThuatInfo) {
        ptData = item.phauThuatInfo;
        surgeryDate = ptData.date || ptData.ngayPhauThuat;
    } else if (item.checklistState && item.checklistState.phauThuatLog && item.checklistState.phauThuatLog.length > 0) {
        // Get latest surgery from checklist log
        ptData = item.checklistState.phauThuatLog[0];
        surgeryDate = ptData.date;
    }
    
    if (ptData) {
        let dateTime = '';
        if (ptData.date && ptData.time) {
            // New format from phauThuatHandlers
            dateTime = `${ptData.date} ${ptData.time}`;
        } else if (ptData.ngayPhauThuat && ptData.gioPhauThuat) {
            // Old format
            dateTime = `${ptData.ngayPhauThuat} ${ptData.gioPhauThuat}`;
        } else if (ptData.date) {
            dateTime = ptData.date;
        } else if (ptData.ngayPhauThuat) {
            dateTime = ptData.ngayPhauThuat;
        }
        
        const method = ptData.method || ptData.pppt || '';
        
        // Calculate post-op days
        const surgeryInfo = getSurgeryDateInfo(surgeryDate);
        let postOpDisplay = '';
        if (surgeryInfo && surgeryInfo.postOpDay !== null) {
            if (surgeryInfo.status === 'today') {
                postOpDisplay = ` <strong>(Hôm nay PT)</strong>`;
            } else {
                postOpDisplay = ` <strong>(HPN${surgeryInfo.postOpDay})</strong>`;
            }
        } else if (surgeryInfo && surgeryInfo.status === 'future') {
            const daysUntil = Math.abs(surgeryInfo.daysDiff);
            if (daysUntil === 1) {
                postOpDisplay = ` <strong>(Ngày mai phẫu thuật)</strong>`;
            } else if (daysUntil === 2) {
                postOpDisplay = ` <strong>(Ngày mốt PT)</strong>`;
            } else {
                postOpDisplay = ` <strong>(Còn ${daysUntil} ngày nữa PT)</strong>`;
            }
        }
        
        console.log('Surgery info found for patient:', item.mabn, 'PPPT:', method, 'DateTime:', dateTime, 'PostOp:', postOpDisplay);
        
        ptInfo = `<div class="dr-pt-info">
            <div class="dr-value"><span class="dr-label">PPPT:</span> ${method}${postOpDisplay}</div>
            <div class="dr-value"><span class="dr-label">Ngày PT:</span> ${dateTime}</div>
        </div>`;
    } else {
        ptInfo = '<div class="dr-pt-info"></div>';
    }
    
    return ptInfo;
}

/**
 * Update patient card surgery info
 * @param {object} patient - Patient data
 * @param {object} customChecklistState - Custom checklist state
 */
function updatePatientCardPhauThuat(patient, customChecklistState = null) {
    const cards = document.querySelectorAll('.dr-card');
    for (let card of cards) {
        const cardTitle = card.querySelector('h2');
        if (cardTitle && cardTitle.textContent.includes(patient.mabn)) {
            const checklistState = customChecklistState || window.checklistState;
            
            // Create patient object with updated checklist state for formatSurgeryInfo
            // Also ensure any existing phauThuatInfo is preserved/updated
            const patientWithState = {
                ...patient,
                checklistState: checklistState
            };
            
            // If checklistState has phauThuatLog, update patient's phauThuatInfo with latest entry
            if (checklistState && checklistState.phauThuatLog && checklistState.phauThuatLog.length > 0) {
                const latestPT = checklistState.phauThuatLog[0]; // Latest is first
                patientWithState.phauThuatInfo = {
                    date: latestPT.date,
                    time: latestPT.time,
                    method: latestPT.method,
                    doctors: latestPT.doctors,
                    // Keep backward compatibility
                    ngayPhauThuat: latestPT.date,
                    gioPhauThuat: latestPT.time,
                    pppt: latestPT.method
                };
            }
            
            // Use formatSurgeryInfo to get formatted surgery info with post-op days
            const formattedPtInfo = formatSurgeryInfo(patientWithState);
            
            // Find existing surgery info container and update
            const existingPTContainer = card.querySelector('.dr-pt-info');
            if (existingPTContainer) {
                console.log('PT container found, updating with formatted info');
                // Extract just the inner content from the formatted HTML
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = formattedPtInfo;
                const innerContent = tempDiv.querySelector('.dr-pt-info');
                if (innerContent) {
                    existingPTContainer.innerHTML = innerContent.innerHTML;
                }
                console.log('Updated PT container with post-op days and latest surgery info');
            } else {
                console.log('PT container not found for patient:', patient.mabn);
            }
            
            // Update surgery status icon with the latest info
            addSurgeryStatusIcon(card, patientWithState);
            
            break;
        }
    }
}

module.exports = {
    getSurgeryDateInfo,
    getSurgeryDateStatus,
    addSurgeryStatusIcon,
    formatSurgeryInfo,
    updatePatientCardPhauThuat
};

},{}],44:[function(require,module,exports){
// tagUtils.js
const BS_CAI_DAT = require('../BS_CAI_DAT_GIAO_DIEN');

// Helper function to create y lệnh tags
function createYLenhTags(patient) {
    console.log('DEBUG createYLenhTags - patient:', patient.mabn, 'checklistState:', !!patient.checklistState);
    
    if (!patient.checklistState || !patient.checklistState.yLenhLog || !Array.isArray(patient.checklistState.yLenhLog)) {
        console.log('No yLenhLog found for patient:', patient.mabn);
        return '';
    }

    // Filter for today's entries (INCLUDE all entries for dashboard cards)
    const today = new Date();
    const todayStr = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
    
    const todayEntries = patient.checklistState.yLenhLog.filter(entry => {
        return entry.timestamp && entry.timestamp.startsWith(todayStr);
    });
    // Exclude 'Đã đánh thuốc' from tags (both quick and manual entries)
    const filteredEntries = todayEntries.filter(entry => {
        const text = ((entry.action || entry.content || '') + '').trim().toLowerCase();
        return text !== 'đã đánh thuốc';
    });

    console.log('Today entries (excluding meds-done) for patient', patient.mabn, ':', filteredEntries);

    if (filteredEntries.length === 0) {
        return '';
    }

    // Take only first 3 entries (most recent)
    const displayEntries = filteredEntries.slice(0, 3);
    
    const tagsHtml = displayEntries.map(entry => {
        // Determine tag color based on content
        let color = '#4caf50'; // default green
        const content = (entry.content || '').toLowerCase();
        let isDischarge = false;

        if (content.includes('xuất viện')) {
            color = '#4caf50';
            isDischarge = true;
        }
        else if (content.includes('rút odl')) color = '#ff9800';
        else if (content.includes('sonde')) color = '#9c27b0';
        else if (content.includes('thay băng')) color = '#2196f3';

        // Quick-action state mapping
        let stateClass = '';
        let stateIcon = '📋';
        if (entry.q === true) {
            const st = entry.status || 'active';
            if (st === 'active') { stateClass = ' state-active'; stateIcon = '⏳'; }
            if (st === 'done')   { stateClass = ' state-done';   stateIcon = '✔'; }
        }

        const dischargeClass = isDischarge ? ' discharge' : '';
        const classes = `ylenh-tag${dischargeClass}${stateClass}`;
        // Append discharge time if available and is Xuất viện
        const timeText = (isDischarge && entry.dischargeTime) ? ` (${entry.dischargeTime})` : '';

        return `<span class="${classes}" style="background-color: rgba(${hexToRgb(color)}, 0.1); color: ${color}; border-color: rgba(${hexToRgb(color)}, 0.3);">
            <span class="icon">${stateIcon}</span>
            <span style="overflow-wrap:anywhere; word-break:break-word;">${entry.content}${timeText}</span>
        </span>`;
    }).join('');

    console.log('Generated tags HTML for patient', patient.mabn, ':', tagsHtml);
    
    return `<div class="ylenh-tags">${tagsHtml}</div>`;
}

// Helper function to convert hex to RGB
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? 
        `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
        '76, 175, 80'; // fallback green
}

// Compute if today has a quick action 'Đã đánh thuốc' marked done
function hasMedsDoneToday(patient) {
    try {
        if (!patient || !patient.checklistState || !Array.isArray(patient.checklistState.yLenhLog)) return false;
        const today = new Date();
        const todayStr = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
        return patient.checklistState.yLenhLog.some(entry => {
            if (!entry || !entry.timestamp || !entry.content) return false;
            if (!entry.timestamp.startsWith(todayStr)) return false;
            const isQuick = entry.q === true && (entry.action ? entry.action === 'Đã đánh thuốc' : entry.content === 'Đã đánh thuốc');
            const isManual = !entry.q && entry.content === 'Đã đánh thuốc';
            if (isQuick) return entry.status === 'done';
            return isManual; // if someone typed it manually, count it
        });
    } catch (_) { return false; }
}

// Add or remove the meds-done badge on a specific card element
function updateMedsDoneBadge(card, patient) {
    try {
        if (!card) return;
        const shouldShow = hasMedsDoneToday(patient);

        // List view: manage inline badge inside actions, do not use absolute badge
        if (card.classList.contains('dr-list-row')) {
            let corner = card.querySelector('.dr-badge-meds-row-corner');
            if (shouldShow) {
                if (!corner) {
                    corner = document.createElement('span');
                    corner.className = 'dr-badge-meds-row-corner';
                    corner.textContent = 'Đã đánh thuốc';
                    card.appendChild(corner);
                }
            } else if (corner) {
                corner.remove();
            }
            return;
        }

        // Card view: original absolute badge behavior
        const existed = card.querySelector('.dr-badge-meds-done');
        if (shouldShow) {
            if (!existed) {
                const badge = document.createElement('div');
                badge.className = 'dr-badge-meds-done';
                badge.textContent = 'Đã đánh thuốc';
                card.appendChild(badge);
            }
            card.classList.add('meds-done');
        } else if (existed) {
            existed.remove();
            card.classList.remove('meds-done');
        }
    } catch (_) { /* noop */ }
}

// Helper function to check for discharge tags and add xuatvienanimation class
function checkAndAddCelebrationClass(card, patient) {
    if (!patient || !patient.checklistState || !patient.checklistState.yLenhLog) {
        card.classList.remove('xuatvienanimation');
        console.log('No checklistState or yLenhLog for patient:', patient?.mabn);
        return;
    }

    // Check if today's entries include "Xuất viện" (including quick actions)
    const today = new Date();
    const todayStr = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
    
    console.log('DEBUG checkAndAddCelebrationClass - Today:', todayStr);
    console.log('DEBUG checkAndAddCelebrationClass - yLenhLog entries:', patient.checklistState.yLenhLog);
    
    // Check ALL entries (including quick actions) for "xuất viện"
    const dischargeEntries = patient.checklistState.yLenhLog.filter(entry => {
        const hasDischarge = entry.content && entry.content.toLowerCase().includes('xuất viện');
        const isToday = entry.timestamp && entry.timestamp.startsWith(todayStr);
        // If quick action, count both active and done for celebration
        if (entry.q === true && entry.action === 'Xuất viện' && isToday) {
            return entry.status === 'active' || entry.status === 'done';
        }
        
        console.log('DEBUG entry:', entry.content, 'timestamp:', entry.timestamp, 'hasDischarge:', hasDischarge, 'isToday:', isToday);
        
        // Check for today's discharge entries (including quick actions)
        return hasDischarge && isToday;
    });

    console.log('DEBUG discharge entries found:', dischargeEntries);

    if (dischargeEntries.length > 0) {
        card.classList.add('xuatvienanimation');
        console.log('🎉 Added xuatvienanimation class to card for patient:', patient.mabn);
    } else {
        card.classList.remove('xuatvienanimation');
        console.log('❌ No discharge entries found for patient:', patient.mabn);
    }
}

// Global function to update patient card tags
function updatePatientCardTags(patientMabn) {
    console.log('updatePatientCardTags called for patient:', patientMabn);
    
    if (!window.dr_data) {
        console.log('No dr_data found');
        return;
    }

    // Find patient in data
    const patient = window.dr_data.find(p => p.mabn === patientMabn);
    if (!patient) {
        console.log('Patient not found in dr_data:', patientMabn);
        return;
    }

    // Prefer data-mabn matching on both card and list rows
    console.log('Looking for patient element (card or row) with mabn:', patientMabn);
    let targetCard = document.querySelector(`.dr-card[data-mabn="${patientMabn}"]`) || document.querySelector(`.dr-list-row[data-mabn="${patientMabn}"]`);
    if (!targetCard) {
        // Fallback: scan text in .dr-card only (legacy)
        const allCards = document.querySelectorAll('.dr-card');
        allCards.forEach((card) => {
            const cardText = card.textContent || card.innerText || '';
            if (cardText.includes(patientMabn)) targetCard = card;
        });
    }

    if (!targetCard) {
        console.log('Patient card not found in DOM for:', patientMabn);
        console.log('Available card text snippets:');
        allCards.forEach((card, index) => {
            const cardText = card.textContent || card.innerText || '';
            console.log(`  Card ${index}:`, cardText.substring(0, 50));
        });
        return;
    }

    console.log('Found patient card for:', patientMabn);
    
    // Remove existing tags from anywhere in the element
    const existingTags = targetCard.querySelector('.ylenh-tags');
    if (existingTags) {
        existingTags.remove();
        console.log('Removed existing tags');
    }

    // Create new tags
    const tagsHtml = createYLenhTags(patient);
    if (tagsHtml) {
        // Insert tags appropriately
        let placed = false;
        const actionButtons = targetCard.querySelector('.dr-action-buttons');
        if (actionButtons) {
            actionButtons.insertAdjacentHTML('beforebegin', tagsHtml);
            placed = true;
        }
        if (!placed) {
            const left = targetCard.querySelector(':scope > div');
            if (left) left.insertAdjacentHTML('beforeend', tagsHtml);
            else targetCard.insertAdjacentHTML('beforeend', tagsHtml);
        }
        // Update dataset flags for filters (today only)
        try {
            const today = new Date();
            const todayStr = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
            const log = patient && patient.checklistState && Array.isArray(patient.checklistState.yLenhLog) ? patient.checklistState.yLenhLog : [];
            let hasXV = false, hasCLS = false;
            for (const e of log) {
                if (!e.timestamp || !e.content) continue;
                if (!e.timestamp.startsWith(todayStr)) continue;
                const c = e.content.toLowerCase();
                if (c.includes('xuất viện')) {
                    if (e.q === true && e.action === 'Xuất viện') {
                        if (e.status === 'active' || e.status === 'done') hasXV = true;
                    } else { hasXV = true; }
                }
                if (c.includes('cận lâm sàng')) hasCLS = true;
            }
            targetCard.dataset.hasxv = hasXV ? '1' : '0';
            targetCard.dataset.hascls = hasCLS ? '1' : '0';
        } catch (_) {}
    }

    // Update discharge celebration class and meds-done badge regardless of tags presence
    checkAndAddCelebrationClass(targetCard, patient);
    updateMedsDoneBadge(targetCard, patient);
}

// Make updatePatientCardTags globally available
if (typeof window !== 'undefined') {
    window.updatePatientCardTags = updatePatientCardTags;
}

// Helper function to check if patient has discharge tag
function hasDischargeTag(patient) {
    if (!patient || !patient.checklistState || !patient.checklistState.yLenhLog) {
        return false;
    }
    
    return patient.checklistState.yLenhLog.some(entry => {
        return entry.content && entry.content.toLowerCase().includes('xuất viện');
    });
}

module.exports = { 
    createYLenhTags, 
    updatePatientCardTags,
    hexToRgb,
    hasDischargeTag,
    hasMedsDoneToday,
    updateMedsDoneBadge
};

},{"../BS_CAI_DAT_GIAO_DIEN":1}],45:[function(require,module,exports){
// uiUtils.js - UI utility functions

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {object} options - Options for toast
 * @param {string} options.background - Background color
 * @param {string} options.color - Text color
 * @param {number} options.duration - Duration in milliseconds
 */
function showToast(message, options = {}) {
    const toast = document.createElement('div');
    toast.innerText = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        background: ${options.background || '#4caf50'};
        color: ${options.color || '#fff'};
        padding: 12px 28px;
        border-radius: 8px;
        font-size: 1.1em;
        z-index: 1000002;
        box-shadow: 0 2px 12px rgba(76, 175, 80, 0.3);
        transition: opacity 0.3s;
        font-weight: 500;
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 400);
    }, options.duration || 2000);
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} - Success status
 */
async function copyToClipboard(text) {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            return true;
        } else {
            // Fallback for older browsers or non-secure contexts
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            const success = document.execCommand('copy');
            textArea.remove();
            return success;
        }
    } catch (err) {
        console.error('Failed to copy: ', err);
        return false;
    }
}

module.exports = {
    showToast,
    copyToClipboard
};

},{}]},{},[3]);
