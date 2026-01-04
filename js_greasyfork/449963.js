// ==UserScript==
// @name         Hd Gitlab Script
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  For Hd Gitlab Commit -> 修改发布单conf文件路径
// @author       demon
// @match        http://gitlab.faidev.cc/hd/*/commit/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=faidev.cc
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/449963/Hd%20Gitlab%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/449963/Hd%20Gitlab%20Script.meta.js
// ==/UserScript==

(function() {
    // 用ver2的项目
    const useVer2Project = ['hdportal']
    // 工程化项目
    const engineeringProject = ['openportal', 'hdportal_vuecli']
    // 工程化项目对应需要发布的文件
    const engineeringProjectPublishFile = {
        openportal: [
            'web/hdportal/openportal/index.jsp',
            'res/hdportal/css/openportal/',
            'res/hdportal/js/openportal/',
            'res/hdportal/image/openportal/'
        ],
        hdportal_vuecli: [
            'web/hdportal/newVersion/index.jsp',
            'res/hdportal/newVersion/'
        ]
    }
    // 压缩指令
    const minCMD = 'minResSingle'
    // 当前环境，默认pre，线上为svr
    let env = 'pre'
    // 获取文件列表
    const getFileList = () => {
        const list = []
        $('strong.file-title-name').each((index, item) => {
            list.push($.trim(item.innerText))
        })
        return list
    }
    // 判断是否为资源文件
    const isResFile = file => {
        return /\.(src\.js|src\.css)$/.test(file)
    }
    //
    // 通过分支名判断环境
    const getEnv = () => {
        const branchName = $('a.branch-link').text()
        switch(branchName){
            case 'pre-production':
                env = 'pre'
                break;
            case 'production':
                env = 'svr'
                break;
        }
    }
    // 当前项目
    const getProjectName = () => {
        let projectName = ''
        $('.breadcrumbs-list .breadcrumb-item-text').each((index,item) => {
            projectName = item.innerText
        })
        return projectName
    }
    // 压缩命令
    const getMinCommand = (env, project) => {
        return `~/script/deploy/tm-prepare${env === 'pre' ? 'Dep' : ''}Res${useVer2Project.includes(project) ? '2' :''} ${project}`
    }
    // 版本号conf发布文件
    const getPublishConfFile = project => {
        const ver2Str = useVer2Project.includes(project) ? '_ver2' :''
        return `etc/web/${project}/res_${project}${ver2Str}.conf`
    }
    // 是否是版本号conf文件
    const isVerConfFile = (file, project) => {
        const ver2Str = useVer2Project.includes(project) ? '_ver2' :''
        return file.includes(`res_${project}${ver2Str}.conf`)
    }


    // dom元素
    const minBox = $('<div></div>')
    // dom插入的目标
    const targetBox = $('.commit-box')
    setTimeout(() => {
        const projectName = getProjectName()

        if (engineeringProject.includes(projectName)) {
            // 发布单内容
            minBox.append('<div><h3>发布单</h3></div>')
            const fileList = engineeringProjectPublishFile[projectName]
            fileList.forEach(file => {
                minBox.append(`<p>${file}</p>`)
            })
        } else {
            // minRes内容
            minBox.append('<div><h3>minRes</h3></div>')
            getEnv();
            const fileList = getFileList()
            const list4Min = fileList.filter(file => isResFile(file))
            list4Min.forEach(file => {
                minBox.append(`<p>${minCMD} /home/faier/${env === 'svr' ? 'production' :'git'}/web/${projectName}/${file}</p>`)
            })
            if(projectName && list4Min.length > 0) {
                minBox.append(`<p>${getMinCommand(env, projectName)}</p>`)
            }

            // 发布单内容
            minBox.append('<div><h3>发布单</h3></div>')
            const insertProjectName = `${projectName}/`
            const publishJspNoteList = fileList.filter(file => /\.(jsp|inc)$/.test(file))
            publishJspNoteList.forEach(file => {
                minBox.append(`<p>${file.replace(/(?<=web\/)/, insertProjectName)}</p>`)
            })
            const publishResNoteList = fileList.filter(file => /\.(src\.js|src\.css|jpeg|jpg|gif|png|svg|webp|jfif|bmp|dpg|conf|json)$/.test(file) && !isVerConfFile(file, projectName))
            publishResNoteList.forEach(file => {
                if (/\.(conf)$/.test(file)) {
                    minBox.append(`<p>${file.replace(/(?<=etc\/)/, 'web/' + insertProjectName)}</p>`)
                }else {
                    minBox.append(`<p>${file.replace(/(?<=res\/)/, insertProjectName).replace(/\.src\./, '.min.')}</p>`)
                }
            })
            const hasChangeConfFile = fileList.some(file => isVerConfFile(file, projectName))
            if (projectName && (list4Min.length > 0 || hasChangeConfFile)){
                minBox.append(`<p>${getPublishConfFile(projectName)}</p>`)
            }
        }

        targetBox.append(minBox)

    }, 2000)
})();
