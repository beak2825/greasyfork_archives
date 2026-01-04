// ==UserScript==
// @name         Tự động nhập QLCV NTSoft
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Tự động nhập công việc
// @match        https://qlcv.nhattamsoft.vn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535743/T%E1%BB%B1%20%C4%91%E1%BB%99ng%20nh%E1%BA%ADp%20QLCV%20NTSoft.user.js
// @updateURL https://update.greasyfork.org/scripts/535743/T%E1%BB%B1%20%C4%91%E1%BB%99ng%20nh%E1%BA%ADp%20QLCV%20NTSoft.meta.js
// ==/UserScript==

(function() {
    'use strict';
    debugger;

    //===============================================
    // CẤU HÌNH CHUNG - ĐIỀU CHỈNH CÁC GIÁ TRỊ TẠI ĐÂY
    //===============================================

    // Giá trị cần điền vào form
    const FORM_VALUES = {

        MucTieu: 'Nhập tiêu đề',
        NoiDung: 'Nhập nội dung',
        // Chổ này để nhập tiến độ
        NoiDungBC: 'Nội dung',
        KetQuaThucHien: 'Hoàn thành mục tiêu trong ngày',


        TieuDe: '',
        GioGiao: '07:30',
        GioThucHien: '07:30',
        GioHanChot: '17:00',
        GioKetThuc_KL: '17:00',
        UocThoiGianThucHien: '1',
        KhoiLuongYeuCau: '1',
        DiemKPI: '15',
        // Giá trị cho form tiến độ
        KLDotNay: '1',
        DiemTuDanhGia: '15'
    };

    // Thông tin đăng nhập
    const CONFIG = {
        username: '',
        password: '',
        debugMode: true,
        waitTime: 2000 // thời gian chờ (ms) giữa các thao tác
    };

    // Thông tin nhân viên
    const EMPLOYEE_DATA = {
        NguyenHoangVinh: {
            id: 'e5afdda0-8303-4836-9caf-212e9475cbb3',
            code: 'NV0006',
            name: 'Nguyễn Hoàng Vịnh'
        },
        TranVanTrung: {
            id: '1fea906f-9b16-4197-a370-18a52e314ccf',
            code: 'NV0002',
            name: 'Trần Văn Trung'
        }
    };

    // Thông tin danh mục (đơn vị tính, phân loại...)
    const CATEGORY_DATA = {
        PhanLoai: {
            SanXuat: {
                id: '720acd46-7701-4603-ac37-8de641fddb7c',
                code: '030',
                name: 'Sản xuất'
            }
        },
        DonViTinh: {
            CongViec: {
                id: 'd3beaae5-3adc-446a-886f-0d95678eda27',
                name: 'Công việc'
            }
        },
        MucUuTien: {
            MucMot: {
                value: 'Ưu tiên mức 1',
                name: 'Ưu tiên mức 1'
            }
        },
        MucDoCongViec: {
            TrungBinh: {
                value: 'Trung bình',
                name: 'Trung bình'
            }
        }
    };

    // ID của các trường trên form HTML
    const FORM_FIELDS = {
        // Thông tin cơ bản
        TieuDe: 'TieuDe',
        MucTieu: 'MucTieu',
        NoiDung: 'NoiDung',

        // Các dropdown
        MucUuTien: 'UuTien',
        PhanLoai: 'PhanLoaiID',
        MucDoCongViec: 'MucDoCongViec',
        NguoiGiao: 'NhanVienID_NguoiGiao', // ID chính xác từ HTML
        NguoiGiamSat: 'NhanVienID_NguoiGiamSat',
        NguoiTheoDoi: 'NguoiTheoDoi',
        DonViTinh: 'selDonViTinh',

        // Ngày giờ
        NgayGiao: 'NgayGiao',
        GioGiao: 'GioGiao',
        NgayThucHien: 'NgayThucHien',
        GioThucHien: 'GioThucHien',
        HanChot: 'HanChot',
        GioHanChot: 'GioHanChot',
        GioKetThuc_KL: 'GioKetThuc_KL',

        // Thông tin khác
        UocThoiGianThucHien: 'UocThoiGianThucHien',
        KhoiLuongYeuCau: 'KhoiLuongYeuCau',
        KLYeuCau: 'KLYeuCau',
        DiemKPI: 'DiemKPI',

        // Nút thao tác
        ThemMoi: 'btnThemMoi',

        // Các trường form tiến độ
        NoiDungBC: 'NoiDungBC',
        KetQuaThucHien: 'KetQuaThucHien',
        KLDotNay: 'KLDotNay',
        DiemTuDanhGia: 'DiemTuDanhGia',
        NguoiPheDuyet: 'NhanVienID_PheDuyet_modal'
    };



    //===============================================
    // HÀM TIỆN ÍCH - KHÔNG CẦN CHỈNH SỬA
    //===============================================

    // Hàm lấy ngày hiện tại định dạng dd/mm/yyyy
    function getCurrentDate() {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();
        return `${day}/${month}/${year}`;
    }

    // Ghi log hoạt động
    function log(message) {
        if (CONFIG.debugMode) {
            console.log(`[${new Date().toLocaleTimeString()}] ${message}`);
        }
    }

    // Hàm chọn giá trị trong dropdown
    function selectOption(selectElement, textToSelect) {
        for (let i = 0; i < selectElement.options.length; i++) {
            if (selectElement.options[i].text.includes(textToSelect)) {
                selectElement.selectedIndex = i;
                selectElement.dispatchEvent(new Event('change'));
                return true;
            }
        }
        return false;
    }

    // Hàm chọn giá trị trong select2 dropdown bằng UUID
    function selectByUUID(selectId, uuid) {
        log(`Chọn ${selectId} với UUID: ${uuid}`);

        // Sử dụng select2 API nếu có
        if (typeof $ !== 'undefined' && $.fn.select2) {
            $('#' + selectId).val(uuid).trigger('change');
            return true;
        }

        // Thủ công nếu không có jQuery
        const selectElement = document.getElementById(selectId);
        if (selectElement) {
            for (let i = 0; i < selectElement.options.length; i++) {
                if (selectElement.options[i].value === uuid) {
                    selectElement.selectedIndex = i;
                    selectElement.dispatchEvent(new Event('change'));
                    return true;
                }
            }
        }
        return false;
    }

    // Hàm chọn giá trị trong select2 dropdown bằng mã (code)
    function selectByCode(selectId, code) {
        const selectElement = document.getElementById(selectId);
        if (selectElement) {
            for (let i = 0; i < selectElement.options.length; i++) {
                if (selectElement.options[i].text === code) {
                    selectElement.selectedIndex = i;
                    selectElement.dispatchEvent(new Event('change'));
                    return true;
                }
            }
        }
        return false;
    }

    // Hàm điền giá trị đơn giản vào ô input
    function fillInputField(fieldId, value) {
        const field = document.getElementById(fieldId);
        if (field) {
            field.value = value;
            // Kích hoạt sự kiện để đảm bảo form validation hoạt động
            field.dispatchEvent(new Event('input', { bubbles: true }));
            field.dispatchEvent(new Event('change', { bubbles: true }));
            return true;
        }
        return false;
    }

    // Hàm chính xác để chọn người theo dõi
    function selectNguoiTheoDoi() {
        log("Đang xử lý người theo dõi...");

        // Phương pháp 1: Chọn chính xác từ UUID
        try {
            const nguoiTheoDoiElement = document.getElementById(FORM_FIELDS.NguoiTheoDoi);

            if (nguoiTheoDoiElement) {
                // Sử dụng UUID chính xác
                const trungValue = EMPLOYEE_DATA.TranVanTrung.id;
                const vinhValue = EMPLOYEE_DATA.NguyenHoangVinh.id;

                // Thiết lập giá trị đã chọn
                for (let i = 0; i < nguoiTheoDoiElement.options.length; i++) {
                    const option = nguoiTheoDoiElement.options[i];
                    if (option.value === trungValue || option.value === vinhValue) {
                        option.selected = true;
                        log("Đã chọn giá trị: " + option.value);
                    }
                }

                // Trigger change event
                nguoiTheoDoiElement.dispatchEvent(new Event('change'));

                // Sử dụng Select2 API nếu có
                if (typeof $ !== 'undefined' && $.fn.select2) {
                    $('#' + FORM_FIELDS.NguoiTheoDoi).val([trungValue, vinhValue]).trigger('change');
                }

                return true;
            }
        } catch (e) {
            log("Lỗi khi sử dụng UUID cho người theo dõi: " + e.message);
        }

        // Phương pháp 2: Sử dụng JavaScript để thêm vào Select2 đã hiển thị
        try {
            // Chọn giá trị bằng cách tạo sự kiện click trực tiếp
            const select2Container = document.querySelector('.select2-container');

            if (select2Container) {
                // Mô phỏng click để mở dropdown
                select2Container.querySelector('.select2-selection').click();

                // Tạo một hàm để chọn một người từ dropdown
                const selectPerson = (name, callback) => {
                    setTimeout(() => {
                        const searchInput = document.querySelector('.select2-search__field');
                        if (searchInput) {
                            // Xóa giá trị hiện tại và nhập tên mới
                            searchInput.value = '';
                            searchInput.focus();
                            searchInput.value = name;

                            // Kích hoạt sự kiện input để tìm kiếm
                            const inputEvent = new Event('input', { bubbles: true });
                            searchInput.dispatchEvent(inputEvent);

                            // Đợi kết quả tìm kiếm và nhấp vào tùy chọn đầu tiên
                            setTimeout(() => {
                                const firstOption = document.querySelector('.select2-results__option');
                                if (firstOption) {
                                    firstOption.click();
                                    if (callback) callback();
                                }
                            }, 300);
                        }
                    }, 300);
                };

                // Thêm cả hai người lần lượt
                selectPerson(EMPLOYEE_DATA.NguyenHoangVinh.name, () => {
                    // Sau khi chọn người đầu tiên, chọn người thứ hai
                    setTimeout(() => {
                        select2Container.querySelector('.select2-selection').click();
                        selectPerson(EMPLOYEE_DATA.TranVanTrung.name);
                    }, 500);
                });

                return true;
            }
        } catch (e) {
            log("Lỗi khi sử dụng phương pháp tương tác: " + e.message);
        }

        return false;
    }

    // Hàm điền nội dung với CKEditor (nếu có)
    function fillCKEditor(editorName, content) {
        try {
            if (typeof CKEDITOR !== 'undefined' && CKEDITOR.instances[editorName]) {
                CKEDITOR.instances[editorName].setData(content);
                return true;
            }
        } catch (e) {
            log("Lỗi khi điền CKEditor: " + e.message);
        }
        return false;
    }

    // Hàm điền thông tin vào form thêm công việc
    function fillTaskForm() {
        log("Bắt đầu điền thông tin công việc...");

        // Tên công việc
        fillInputField(FORM_FIELDS.TieuDe, FORM_VALUES.TieuDe);

        // Mục tiêu
        fillInputField(FORM_FIELDS.MucTieu, FORM_VALUES.MucTieu);

        // Nội dung với CKEditor
        if (!fillCKEditor(FORM_FIELDS.NoiDung, FORM_VALUES.NoiDung)) {
            fillInputField(FORM_FIELDS.NoiDung, FORM_VALUES.NoiDung);
        }

        // Mức ưu tiên: Ưu tiên mức 1
        if (document.getElementById(FORM_FIELDS.MucUuTien)) {
            // Sử dụng select2 nếu có
            if (typeof $ !== 'undefined' && $.fn.select2) {
                $('#' + FORM_FIELDS.MucUuTien).val(CATEGORY_DATA.MucUuTien.MucMot.value).trigger('change');
            } else {
                selectOption(document.getElementById(FORM_FIELDS.MucUuTien), CATEGORY_DATA.MucUuTien.MucMot.name);
            }
        }

        // Phân loại: Sản xuất (030)
        if (document.getElementById(FORM_FIELDS.PhanLoai)) {
            // Thử phương pháp 1: Sử dụng UUID
            selectByUUID(FORM_FIELDS.PhanLoai, CATEGORY_DATA.PhanLoai.SanXuat.id);

            // Dự phòng: Thử tìm kiếm bằng mã
            if (!document.querySelector('#select2-' + FORM_FIELDS.PhanLoai + '-container')?.textContent.includes(CATEGORY_DATA.PhanLoai.SanXuat.name)) {
                selectByCode(FORM_FIELDS.PhanLoai, CATEGORY_DATA.PhanLoai.SanXuat.code);
            }
        }

        // Mức độ công việc: Trung bình
        if (document.getElementById(FORM_FIELDS.MucDoCongViec)) {
            selectOption(document.getElementById(FORM_FIELDS.MucDoCongViec), CATEGORY_DATA.MucDoCongViec.TrungBinh.name);
        }

        // Ngày giao: ngày hiện tại
        fillInputField(FORM_FIELDS.NgayGiao, getCurrentDate());

        // Giờ giao: 7:30
        fillInputField(FORM_FIELDS.GioGiao, FORM_VALUES.GioGiao);

        // Người giao: Nguyễn Hoàng Vịnh (NV0006)
        if (document.getElementById(FORM_FIELDS.NguoiGiao)) {
            selectByUUID(FORM_FIELDS.NguoiGiao, EMPLOYEE_DATA.NguyenHoangVinh.id);
        }

        // Ngày thực hiện: ngày hiện tại
        fillInputField(FORM_FIELDS.NgayThucHien, getCurrentDate());

        // Giờ thực hiện: 7:30
        fillInputField(FORM_FIELDS.GioThucHien, FORM_VALUES.GioThucHien);

        // Người giám sát: Nguyễn Hoàng Vịnh (NV0006)
        if (document.getElementById(FORM_FIELDS.NguoiGiamSat)) {
            selectByUUID(FORM_FIELDS.NguoiGiamSat, EMPLOYEE_DATA.NguyenHoangVinh.id);
        }

        // Đơn vị tính: Công việc
        if (document.getElementById(FORM_FIELDS.DonViTinh)) {
            selectByUUID(FORM_FIELDS.DonViTinh, CATEGORY_DATA.DonViTinh.CongViec.id);
        }

        // Deadline: Ngày hiện tại
        fillInputField(FORM_FIELDS.HanChot, getCurrentDate());

        // Giờ deadline: 17:00
        fillInputField(FORM_FIELDS.GioHanChot, FORM_VALUES.GioHanChot);

        // Giờ kết thúc khối lượng: 17:00
        fillInputField(FORM_FIELDS.GioKetThuc_KL, FORM_VALUES.GioKetThuc_KL);

        // Ước thời gian thực hiện: 1 ngày
        fillInputField(FORM_FIELDS.UocThoiGianThucHien, FORM_VALUES.UocThoiGianThucHien);

        // Khối lượng yêu cầu: 1
        fillInputField(FORM_FIELDS.KhoiLuongYeuCau, FORM_VALUES.KhoiLuongYeuCau);

        // Khối lượng yêu cầu (ID thay thế): 1
        fillInputField(FORM_FIELDS.KLYeuCau, FORM_VALUES.KhoiLuongYeuCau);

        // Điểm KPI: 15
        fillInputField(FORM_FIELDS.DiemKPI, FORM_VALUES.DiemKPI);

        // Xử lý người theo dõi với chính xác thông tin
        setTimeout(selectNguoiTheoDoi, 1000);

        log("Hoàn tất điền thông tin công việc");
    }

    // Hàm điền thông tin vào form tiến độ
    function fillProgressForm() {
        log("Bắt đầu điền thông tin tiến độ...");

        // Điền nội dung báo cáo
        fillInputField(FORM_FIELDS.NoiDungBC, FORM_VALUES.NoiDungBC);

        // Điền kết quả thực hiện
        fillInputField(FORM_FIELDS.KetQuaThucHien, FORM_VALUES.KetQuaThucHien);

        // Điền khối lượng đợt này
        fillInputField(FORM_FIELDS.KLDotNay, FORM_VALUES.KLDotNay);

        // Điền điểm tự đánh giá
        fillInputField(FORM_FIELDS.DiemTuDanhGia, FORM_VALUES.DiemTuDanhGia);

        // Chọn người phê duyệt: Nguyễn Hoàng Vịnh (NV0006)
        if (document.getElementById(FORM_FIELDS.NguoiPheDuyet)) {
            setTimeout(() => {
                selectByUUID(FORM_FIELDS.NguoiPheDuyet, EMPLOYEE_DATA.NguyenHoangVinh.id);
                log("Đã chọn người phê duyệt: " + EMPLOYEE_DATA.NguyenHoangVinh.name);
            }, 500);
        }

        log("Hoàn tất điền thông tin tiến độ");
    }

    //===============================================
    // XỬ LÝ SỰ KIỆN CHÍNH
    //===============================================

    // Chờ DOM tải xong
    window.addEventListener('load', function() {
        // Kiểm tra nếu URL là trang đăng nhập
        if (window.location.href.includes("Login.aspx") || window.location.href.includes("dang-nhap.html")) {
            log("Đang ở trang đăng nhập...");

            // Điền thông tin vào form
            document.getElementById('txtusername').value = CONFIG.username;
            document.getElementById('txtpassword').value = CONFIG.password;

            // Click nút đăng nhập
            document.getElementById('btnDangNhap').click();
        }

        // Nếu đang ở trang chủ
        if (window.location.href.includes("ho-so-cong-viec.html")) {
            log("Đang ở trang chủ...");

            // Thêm nút tự động thêm công việc
            const autoButton = document.createElement('button');
            autoButton.textContent = 'Tự động thêm công việc';
            autoButton.style.position = 'fixed';
            autoButton.style.top = '10px';
            autoButton.style.right = '10px';
            autoButton.style.zIndex = '9999';
            autoButton.style.backgroundColor = 'green';
            autoButton.style.color = 'white';
            autoButton.style.padding = '10px';
            autoButton.style.border = 'none';
            autoButton.style.borderRadius = '5px';
            autoButton.style.cursor = 'pointer';

            autoButton.addEventListener('click', function() {
                // Click nút thêm mới
                const themMoiBtn = document.getElementById(FORM_FIELDS.ThemMoi);
                if (themMoiBtn) {
                    log("Click nút thêm mới...");
                    themMoiBtn.click();

                    // Chờ form load xong rồi điền thông tin
                    setTimeout(fillTaskForm, CONFIG.waitTime);
                }
            });

            document.body.appendChild(autoButton);

            // Thêm nút tự động nhập tiến độ
            const progressButton = document.createElement('button');
            progressButton.textContent = 'Tự động nhập tiến độ';
            progressButton.style.position = 'fixed';
            progressButton.style.top = '50px'; // Đặt bên dưới nút trước đó
            progressButton.style.right = '10px';
            progressButton.style.zIndex = '9999';
            progressButton.style.backgroundColor = 'blue';
            progressButton.style.color = 'white';
            progressButton.style.padding = '10px';
            progressButton.style.border = 'none';
            progressButton.style.borderRadius = '5px';
            progressButton.style.cursor = 'pointer';

            progressButton.addEventListener('click', function() {
                document.getElementById('TabKhoiLuongMain').click();
                document.getElementById('btnThemMoiTienDo').click();

                // Chờ form tiến độ load xong rồi điền thông tin
                setTimeout(fillProgressForm, CONFIG.waitTime);
            });

            document.body.appendChild(progressButton);
        }

        // Nếu đang ở trang thêm mới hoặc trang cập nhật công việc
        if (window.location.href.includes('them-cong-viec') || window.location.href.includes('cap-nhat-cong-viec')) {
            log("Đang ở trang thêm/cập nhật công việc...");
            // Đợi form load xong
            setTimeout(fillTaskForm, CONFIG.waitTime);
        }
    });
})();