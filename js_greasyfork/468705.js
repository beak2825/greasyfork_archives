// ==UserScript==
// @name        教学督导/教学评价自动填写
// @namespace   https://github.com/AliubYiero/TemperScripts
// @version     beta0.2
// @description 自动填写广东科贸职业学院AIC教学督导/教学评价
// @author      Yiero
// @match       https://aic.gdkmxy.cn/*
// @license     GPL
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/468705/%E6%95%99%E5%AD%A6%E7%9D%A3%E5%AF%BC%E6%95%99%E5%AD%A6%E8%AF%84%E4%BB%B7%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99.user.js
// @updateURL https://update.greasyfork.org/scripts/468705/%E6%95%99%E5%AD%A6%E7%9D%A3%E5%AF%BC%E6%95%99%E5%AD%A6%E8%AF%84%E4%BB%B7%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99.meta.js
// ==/UserScript==


function sleep( delay = 1 ) {
	return new Promise( resolve => {
		setTimeout( () => {
			resolve();
		}, delay * 1000 );
	} )
}

class WriteContentFormDom {
	constructor( domString, content ) {
		let dom;
		if ( typeof domString === 'string' ) {
			dom = document.querySelector( domString );
		} else {
			dom = domString;
		}
		this.dom = dom;
		
		this.content = content;
		
		this.document = document;
	}
	
	write() {
		this.dom.value = this.content;
	}
}

class Course {
	constructor( courseName, teacher ) {
		this.teacher = teacher;
		this.courseName = courseName;
		
		this.document = null;
	}
	
	write() {
		
		this.writeContentFormDom( '#txt_课程名称', this.courseName );
		
		this.writeContentFormDom( '#txt_任课教师', this.teacher );
		
		this.writeContentFormDom( '#txt_教学情况', '正常' );
		
		this.document.querySelector( '#btn_save' ).click();
		
	}
	
	writeContentFormDom( domString, content ) {
		let dom;
		if ( typeof domString === 'string' ) {
			dom = this.document.querySelector( domString );
		} else {
			dom = domString;
		}
		
		dom.value = content;
	}
}

const writeList = [
	new WriteContentFormDom( '#drl_总体评价', '优秀' ),
	new WriteContentFormDom( '#txt_突出问题', '正常' ),
	new WriteContentFormDom( '#txt_意见建议', '正常' ),
	new WriteContentFormDom( '#drl_部门领导', '107005' ),
];

// ---------------------------------------------------------------- //

const courseList = [
	new Course( 'H5移动应用开发', '凡飞飞' ),
	new Course( '形势与政策', '韦芬' ),
	new Course( '体育', '体育部' ),
	new Course( '大学生创新创业教育', '黄汕' ),
	new Course( 'Web前端技术', '丁知平' ),
	new Course( '网络数据库', '何受倩' ),
	// new Course( 'JavaWeb应用开发', '王松茂' ),
];

// ---------------------------------------------------------------- //

window.onload = () => {
	const btn = document.createElement( 'button' );
	btn.innerText = '写入数据'
	document.querySelector( '#breadcrumbs' ).append( btn );
	if ( document.URL === 'https://aic.gdkmxy.cn/xin/supervisor/stu/teachEdit.aspx?action=add&xin=0' ) {
		btn.onclick = async e => {
			e.preventDefault();
			
			writeList.forEach( writeContent => {
				writeContent.write();
			} )
			
			openDialogAddEidtOfClass( '编辑具体教学情况', 800, 400, 'teachEidtOfClass.aspx?Action=add' );
			
			await sleep( 1 );
			
			for ( const course of courseList ) {
				course.document = window.document.querySelector( '#_DialogFrame_0' ).contentDocument;
				course.write();
				await sleep( 0.1 );
			}
			
			Dialog.getInstance( '0' ).cancelButton.onclick.apply( Dialog.getInstance( '0' ).cancelButton, [] );
		}
	} else if ( document.URL.match( /https:\/\/aic.gdkmxy.cn\/xsgl\/xs\/xspj\/pj_ap_edit.aspx.*/ ) ) {
		let teacherIndex = 0;
		let questionIndex = 0;
		
		while ( document.querySelector( `#Repeater1_Repeater2_${ teacherIndex }_ddl_选项_${ questionIndex }` ) ) {
			// 写入分数
			const selectList = document.querySelector( `#Repeater1_Repeater2_${ teacherIndex }_ddl_选项_${ questionIndex++ }` );
			const score = [
				selectList.querySelector( 'option:nth-of-type(2)' ).value,
				selectList.querySelector( 'option:nth-of-type(3)' ).value,
				selectList.querySelector( 'option:nth-of-type(4)' ).value,
				selectList.querySelector( 'option:nth-of-type(5)' ).value,
			]
			selectList.value = score[0];
			
			// 判断新增后是否存在选项，有则继续，无则更换教师
			console.log( `#Repeater1_Repeater2_${ teacherIndex }_ddl_选项_${ questionIndex }` );
			if ( !document.querySelector( `#Repeater1_Repeater2_${ teacherIndex }_ddl_选项_${ questionIndex }` ) ) {
				// 无 -> 教师编号+1
				console.log( '教师编号+1' );
				teacherIndex++;
				questionIndex = 0;
			}
			// 有 -> 继续
		}
		
	}
}
