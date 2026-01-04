chrome.runtime.sendMessage({ action: "fetchExam" }, (response) => {
    if (response.data) {
        const activities = response.data;
        const now = Date.now();
        const validActivities = activities.filter(activity => activity.deadline > now);
        validActivities.sort((a, b) => a.deadline - b.deadline);
        for (const activity of validActivities) {
            document.body.appendChild(renderActivity(activity));
        }
    } else {
        console.error('Failed to fetch data:', response.error);
    }
});

function renderActivity(activity) {
    // link
    let link = `https://www.yuketang.cn/v2/web/exam/${activity.classroom_id}/${activity.courseware_id}`;
    if (activity.type === 4) {
        link = `https://www.yuketang.cn/v2/web/studentQuiz/${activity.courseware_id}/1`;
    }
    const linkBox = document.createElement('a');
    linkBox.href = link;
    linkBox.className = 'custom-link';
    linkBox.target = '_blank';

    // 创建外层容器
    const contentBox = document.createElement('div');
    contentBox.className = 'content-box';

    // 创建活动部分
    const section = document.createElement('section');
    section.className = 'activity__wrap el-tooltip';
    section.tabIndex = 0;

    const activityInfo = document.createElement('div');
    activityInfo.className = 'activity-info';

    // 创建标题部分
    const infoWrapper = document.createElement('div');
    const title = document.createElement('h2');
    title.textContent = activity.title + ' - ' + activity.course_name + '(' + activity.teacher_name + ')';

    // 创建副标题部分
    const subInfo = document.createElement('div');
    subInfo.className = 'sub-info';
    const totalScore = `<span class="gray">满分：${activity.total_score}分</span>`;
    const problemCount = `<span class="gray beforeBorder">共${activity.problem_count}题</span>`;
    let limit = '';
    if (activity.limit) {
        limit = `<span class="gray beforeBorder">限时：${activity.limit / 60}分钟</span>`;
    }
    const deadline = `<span class="beforeBorder gray">截止时间：${formatDeadline(activity.deadline)}</span>`;
    subInfo.innerHTML = `${totalScore} ${problemCount} ${limit} ${deadline}`;

    infoWrapper.appendChild(title);
    infoWrapper.appendChild(subInfo);
    activityInfo.appendChild(infoWrapper);
    section.appendChild(activityInfo);
    contentBox.appendChild(section);

    linkBox.appendChild(contentBox);
    return linkBox;
}

// 格式化截止时间
function formatDeadline(deadlineTimestamp) {
    const date = new Date(deadlineTimestamp);
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', weekday: 'short' };
    return date.toLocaleDateString('zh-CN', options).replace(/\//g, '/');
}